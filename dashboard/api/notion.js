const DB_ID = process.env.NOTION_DATABASE_ID || '34520bfea5154b188a30cf12895a9c3d';

async function notionFetch(endpoint, method = 'GET', body, token) {
  const r = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message || `Notion error ${r.status}`);
  return data;
}

function pageToApp(page) {
  const p = page.properties;
  const txt = prop => prop?.rich_text?.map(t => t.plain_text).join('') || '';
  const ttl = prop => prop?.title?.map(t => t.plain_text).join('') || '';
  const sel = prop => prop?.select?.name || '';
  const url = prop => prop?.url || '';
  const num = prop => Number(prop?.number) || 0;
  const dte = prop => prop?.date?.start || '';
  return {
    notion_id: page.id,
    titulo: ttl(p['Título']),
    empresa: txt(p['Empresa']),
    estado: sel(p['Estado']) || 'Enviada',
    pais: sel(p['País']) || 'Global',
    url: url(p['userDefined:URL']),
    contactoReclutador: txt(p['Reclutador']),
    sesionId: txt(p['Sesión']),
    resumenPuesto: txt(p['Resumen']),
    requisitosClave: txt(p['Requisitos']).split(',').map(s => s.trim()).filter(Boolean),
    beneficios: txt(p['Beneficios']),
    rating: num(p['Rating']),
    notas: txt(p['Notas']),
    aplicadoEn: dte(p['Fecha']) || page.created_time,
    ubicacion: '',
    tipo: sel(p['Tipo']) || 'Easy Apply',
    plataforma: txt(p['Plataforma']),
  };
}

function appToProps(app) {
  const rt = text => [{ type: 'text', text: { content: String(text || '').slice(0, 2000) } }];
  return {
    'Título':          { title: rt(app.titulo) },
    'Empresa':         { rich_text: rt(app.empresa) },
    'Estado':          { select: { name: app.estado } },
    'País':            { select: { name: app.pais } },
    'Fecha':           { date: { start: (app.aplicadoEn || new Date().toISOString()).split('T')[0] } },
    'userDefined:URL': { url: app.url || null },
    'Reclutador':      { rich_text: rt(app.contactoReclutador) },
    'Sesión':          { rich_text: rt(app.sesionId) },
    'Resumen':         { rich_text: rt(app.resumenPuesto) },
    'Requisitos':      { rich_text: rt((app.requisitosClave || []).join(', ')) },
    'Beneficios':      { rich_text: rt(app.beneficios) },
    'Rating':          { number: app.rating || 0 },
    'Notas':           { rich_text: rt(app.notas) },
    'Tipo':            { select: { name: app.tipo || 'Easy Apply' } },
    'Plataforma':      { rich_text: rt(app.plataforma) },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action, apps } = req.body;
  const token = process.env.NOTION_TOKEN;

  if (!token) return res.status(500).json({ error: 'NOTION_TOKEN no configurado en Vercel' });

  try {
    // ── SYNC: pull all pages from Notion DB ──────────────────
    if (action === 'sync') {
      const data = await notionFetch(`databases/${DB_ID}/query`, 'POST', { page_size: 100 }, token);
      const aplicaciones = (data.results || []).map(pageToApp);
      return res.json({ aplicaciones });
    }

    // ── EXPORT: push apps back to Notion ─────────────────────
    if (action === 'export') {
      let created = 0, updated = 0;
      for (const app of (apps || [])) {
        const props = appToProps(app);
        if (app.notion_id) {
          await notionFetch(`pages/${app.notion_id}`, 'PATCH', { properties: props }, token);
          updated++;
        } else {
          await notionFetch('pages', 'POST', { parent: { database_id: DB_ID }, properties: props }, token);
          created++;
        }
      }
      return res.json({ success: true, created, updated });
    }

    res.status(400).json({ error: 'action inválida' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
