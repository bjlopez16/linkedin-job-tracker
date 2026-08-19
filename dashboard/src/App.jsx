import { useState, useEffect, useCallback } from 'react';

// ── DESIGN TOKENS — Light mode, warm off-white ────────────────
const T = {
  bg:      '#F3EDE4',   // warm off-white — toda la base
  sidebar: '#EAE1D5',   // arena más oscura para sidebar
  surf:    '#FFFFFF',   // tarjetas — blanco puro
  surf2:   '#FAF7F3',   // panel derecho
  border:  '#DDD5C8',   // borde suave cálido
  border2: '#C8BDB0',   // borde más visible
  text:    '#141210',   // casi negro — texto primario
  text2:   '#3A3430',   // negro apagado — texto secundario
  muted:   '#7A706A',   // gris cálido — texto terciario
  dim:     '#B5AAA2',   // muy apagado — labels, meta
  teal:    '#0A7A6E',   // teal accesible en blanco (5:1)
  tealL:   '#E8F5F3',   // teal muy claro — fondos
  tealM:   'rgba(10,122,110,0.1)',
  amber:   '#C47A00',   // ámbar accesible en blanco
  amberL:  '#FEF3DC',   // ámbar muy claro
  shadow:  '0 1px 3px rgba(20,18,16,0.08), 0 1px 2px rgba(20,18,16,0.04)',
  shadowM: '0 4px 12px rgba(20,18,16,0.10), 0 2px 4px rgba(20,18,16,0.06)',
};

const STATUSES = {
  Enviada:    { color:'#4A5568', bg:'#EEF0F3', border:'#C8CDD6'  },
  Vista:      { color:'#0369A1', bg:'#E0F0FA', border:'#93C5E8'  },
  Contactada: { color:'#6D28D9', bg:'#EDE9FA', border:'#C4B5F4'  },
  Entrevista: { color:'#92400E', bg:'#FEF3DC', border:'#F5CC80'  },
  Oferta:     { color:'#0A7A6E', bg:'#E4F5F3', border:'#7ECDC6'  },
  Rechazada:  { color:'#991B1B', bg:'#FEECEC', border:'#F5BCBC'  },
  Cancelada:  { color:'#6B7280', bg:'#F3F4F6', border:'#D1D5DB'  },
};
const STATUS_LIST = Object.keys(STATUSES);
const FLAGS = { NL:'🇳🇱', ES:'🇪🇸', UK:'🇬🇧', US:'🇺🇸', Global:'🌍' };
const TIPOS = {
  'Easy Apply': { color:'#0369A1', bg:'#E0F0FA', border:'#93C5E8' },
  'Externa':    { color:'#92400E', bg:'#FEF3DC', border:'#F5CC80' },
};
const TIPO_LIST = Object.keys(TIPOS);
const KEY   = 'bjl_job_tracker_v2';
const FONT  = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";

// ── HELPERS ───────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2,9) + Date.now().toString(36);
const fmtDate = iso => { try { return new Date(iso).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}); } catch { return '—'; }};
const detectCountry = (s='') => { const l=s.toLowerCase(); if(l.includes('nederland')||l.includes('países bajos'))return'NL'; if(l.includes('españa')||l.includes('spain'))return'ES'; if(l.includes('united kingdom')||l.includes('reino unido'))return'UK'; if(l.includes('united states')||l.includes('estados unidos'))return'US'; return'Global'; };

// ── STORAGE ───────────────────────────────────────────────────
const store = {
  load: () => { try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch { return []; }},
  save: d  => { try { localStorage.setItem(KEY,JSON.stringify(d)); } catch {} },
};

async function notionAction(action, payload={}) {
  const res = await fetch('/api/notion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload})});
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ── ATOMS ─────────────────────────────────────────────────────
const StatusBadge = ({status}) => {
  const cfg = STATUSES[status]||STATUSES.Enviada;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 9px', borderRadius:5,
      background:cfg.bg, color:cfg.color,
      border:`1px solid ${cfg.border}`,
      fontSize:10.5, fontWeight:700, whiteSpace:'nowrap',
      letterSpacing:'0.03em', textTransform:'uppercase',
    }}>{status}</span>
  );
};

const TipoBadge = ({tipo,plataforma}) => {
  const cfg = TIPOS[tipo]||TIPOS['Easy Apply'];
  return (
    <span title={plataforma||tipo} style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'2px 7px', borderRadius:10,
      background:cfg.bg, color:cfg.color,
      border:`1px solid ${cfg.border}`,
      fontSize:10.5, fontWeight:600, whiteSpace:'nowrap',
    }}>{tipo==='Externa'?'🔗':'⚡'} {plataforma||tipo}</span>
  );
};

const Stars = ({rating=0,onChange,size=16}) => {
  const [hov,setHov]=useState(0);
  return (
    <div style={{display:'flex',gap:1}}>
      {[1,2,3,4,5].map(n=>(
        <span key={n}
          onClick={()=>onChange?.(n===rating?0:n)}
          onMouseEnter={()=>onChange&&setHov(n)}
          onMouseLeave={()=>onChange&&setHov(0)}
          style={{fontSize:size,lineHeight:1,color:n<=(hov||rating)?T.amber:'#DDD5C8',cursor:onChange?'pointer':'default',transition:'color 0.1s'}}>
          ★
        </span>
      ))}
    </div>
  );
};

const Field = ({value,onChange,onBlur,placeholder,multi,rows=3}) => {
  const s = {
    width:'100%', background:'#FFFFFF', border:`1px solid ${T.border2}`,
    borderRadius:6, color:T.text, fontSize:13, padding:'9px 12px',
    resize:multi?'vertical':'none', minHeight:multi?rows*28:undefined,
    lineHeight:1.6, boxSizing:'border-box', fontFamily:FONT, outline:'none',
    transition:'border-color 0.15s',
  };
  const Tag = multi?'textarea':'input';
  return <Tag value={value} onChange={e=>onChange?.(e.target.value)} onBlur={onBlur} placeholder={placeholder} style={s}/>;
};

// Botón primario = teal sólido, texto blanco
// Ghost = borde fino, texto oscuro
// Teal light = fondo teal claro
const Btn = ({children,onClick,variant='ghost',disabled,full,small}) => {
  const vs = {
    primary: { background:T.teal, color:'#FFFFFF', border:'none', fontWeight:700 },
    ghost:   { background:'#FFFFFF', color:T.text2, border:`1px solid ${T.border2}`, fontWeight:500 },
    teal:    { background:T.tealL, color:T.teal, border:`1px solid ${T.teal}30`, fontWeight:600 },
    danger:  { background:'#FEECEC', color:'#991B1B', border:'1px solid #F5BCBC', fontWeight:600 },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...vs[variant], cursor:disabled?'not-allowed':'pointer',
      padding:small?'6px 11px':'8px 15px', borderRadius:6,
      fontSize:small?11.5:13, width:full?'100%':undefined,
      opacity:disabled?0.5:1, transition:'opacity 0.15s, transform 0.1s',
      fontFamily:FONT, letterSpacing:'-0.01em',
    }}>{children}</button>
  );
};

// Sidebar nav — linear style con indicador izquierdo
const SBtn = ({label,count,active,dotColor,onClick}) => (
  <button onClick={onClick} style={{
    display:'flex', justifyContent:'space-between', alignItems:'center',
    width:'100%', padding:'6px 12px 6px 14px',
    borderRadius:5, border:'none',
    borderLeft:`2px solid ${active?(dotColor||T.teal):'transparent'}`,
    background:active?T.surf:'transparent',
    color:active?(dotColor||T.teal):T.muted,
    cursor:'pointer', fontSize:12.5, fontWeight:active?600:400,
    textAlign:'left', marginBottom:1, fontFamily:FONT,
    letterSpacing:'-0.01em', boxShadow:active?T.shadow:'none',
    transition:'all 0.12s',
  }}>
    <span>{label}</span>
    <span style={{fontSize:11,fontVariantNumeric:'tabular-nums',color:active?(dotColor||T.teal):T.dim,fontWeight:active?700:400}}>{count}</span>
  </button>
);

// ── MODAL ─────────────────────────────────────────────────────
const Modal = ({children,onClose,title,subtitle}) => (
  <div style={{position:'fixed',inset:0,background:'rgba(20,18,16,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,backdropFilter:'blur(4px)'}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:12,padding:28,width:'90%',maxWidth:520,boxShadow:T.shadowM}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <div style={{color:T.text,fontSize:16,fontWeight:700,letterSpacing:'-0.02em'}}>{title}</div>
          {subtitle&&<div style={{color:T.muted,fontSize:12,marginTop:4}}>{subtitle}</div>}
        </div>
        <button onClick={onClose} style={{background:'none',border:'none',color:T.dim,cursor:'pointer',fontSize:22,lineHeight:1,padding:'0 0 0 12px'}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// ── LOGIN ─────────────────────────────────────────────────────
function LoginScreen({onAuth}) {
  const [val,setVal]=useState('');
  const [err,setErr]=useState(false);
  const check = () => {
    if(val===import.meta.env.VITE_APP_PASSWORD){sessionStorage.setItem('jt_auth','1');onAuth();}
    else{setErr(true);setTimeout(()=>setErr(false),1800);}
  };
  return (
    <div style={{height:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT}}>
      <div style={{width:320,textAlign:'center'}}>
        {/* Logo mark */}
        <div style={{marginBottom:32}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.teal,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:`0 4px 14px ${T.teal}40`}}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="12" y="12" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <div style={{fontSize:20,fontWeight:800,color:T.text,letterSpacing:'-0.03em',marginBottom:4}}>Job Tracker</div>
          <div style={{fontSize:12,color:T.muted,letterSpacing:'0.02em'}}>Borja López · UX/UI Designer</div>
        </div>
        <input type="password" value={val} autoFocus
          onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&check()}
          placeholder="Contraseña"
          style={{width:'100%',background:T.surf,border:`2px solid ${err?'#F5BCBC':T.border2}`,borderRadius:8,color:T.text,fontSize:14,padding:'12px 16px',textAlign:'center',fontFamily:FONT,letterSpacing:'0.1em',boxSizing:'border-box',outline:'none',transition:'border-color 0.2s',boxShadow:T.shadow}}/>
        {err&&<div style={{color:'#991B1B',fontSize:12,marginTop:8}}>Contraseña incorrecta</div>}
        <button onClick={check} style={{marginTop:10,width:'100%',padding:'12px',background:T.teal,border:'none',borderRadius:8,color:'#FFFFFF',fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:FONT,letterSpacing:'-0.01em',boxShadow:`0 4px 14px ${T.teal}40`,transition:'transform 0.1s'}}>
          Entrar →
        </button>
      </div>
    </div>
  );
}

// ── APP CARD ──────────────────────────────────────────────────
const AppCard = ({app,selected,onClick}) => (
  <div onClick={onClick} style={{
    padding:'13px 15px 11px', borderRadius:8, marginBottom:4,
    background:T.surf,
    border:`1px solid ${selected?T.teal:T.border}`,
    borderLeft:`3px solid ${selected?T.teal:'transparent'}`,
    boxShadow:selected?`0 0 0 3px ${T.teal}15, ${T.shadow}`:T.shadow,
    cursor:'pointer', transition:'all 0.12s',
  }}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:7}}>
      <div style={{minWidth:0,flex:1}}>
        <div style={{color:T.text,fontWeight:600,fontSize:13.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'-0.01em'}}>{app.titulo}</div>
        <div style={{color:T.muted,fontSize:12,marginTop:2,fontWeight:400}}>{app.empresa}</div>
      </div>
      <StatusBadge status={app.estado}/>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <span style={{fontSize:11.5,color:T.muted}}>{FLAGS[app.pais]||'🌍'} {app.pais}</span>
        {app.tipo==='Externa'&&<TipoBadge tipo={app.tipo} plataforma={app.plataforma}/>}
        {app.rating>0&&<span style={{color:T.amber,fontSize:11.5,letterSpacing:-1}}>{'★'.repeat(app.rating)}</span>}
        {app.notion_id&&<span style={{fontSize:9.5,color:T.teal,background:T.tealL,padding:'1px 6px',borderRadius:4,fontWeight:700,letterSpacing:'0.04em'}}>N</span>}
        {app.contactoReclutador&&app.contactoReclutador.length>2&&app.contactoReclutador!=='No visible'&&(
          <span style={{fontSize:11,color:'#6D28D9',background:'#EDE9FA',padding:'2px 7px',borderRadius:10,border:'1px solid #C4B5F4'}}>
            {app.contactoReclutador.split(' ')[0]}
          </span>
        )}
      </div>
      <span style={{fontSize:11,color:T.dim,fontVariantNumeric:'tabular-nums'}}>{fmtDate(app.aplicadoEn)}</span>
    </div>
  </div>
);

// ── DETAIL PANEL ──────────────────────────────────────────────
const DetailPanel = ({app,onUpdate,onDelete,onClose}) => {
  const [local,setLocal]=useState(app);
  const [notes,setNotes]=useState(app.notas||'');
  const [rec,setRec]=useState(app.contactoReclutador||'');

  useEffect(()=>{setLocal(app);setNotes(app.notas||'');setRec(app.contactoReclutador||'');},[app.id]);

  const push=(field,value,label)=>{
    const entry={fecha:new Date().toISOString(),cambio:label||`${field} actualizado`,tipo:field};
    const next={...local,[field]:value,historial:[...(local.historial||[]),entry]};
    setLocal(next);onUpdate(next);
  };

  const lbl={fontSize:10,color:T.dim,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:7,display:'block'};
  const sec={padding:'14px 18px',borderBottom:`1px solid ${T.border}`};

  return (
    <div style={{width:340,minWidth:340,background:T.surf2,borderLeft:`1px solid ${T.border}`,display:'flex',flexDirection:'column',overflowY:'auto'}}>
      {/* Header */}
      <div style={{...sec,position:'sticky',top:0,background:T.surf2,zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'flex-start',borderBottom:`2px solid ${T.teal}30`}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:T.text,fontWeight:700,fontSize:14.5,letterSpacing:'-0.02em',lineHeight:1.3,marginBottom:4}}>{local.titulo}</div>
          <div style={{color:T.muted,fontSize:12,marginBottom:6,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
            <span>{local.empresa} · {FLAGS[local.pais]||'🌍'} {local.pais}</span>
            <TipoBadge tipo={local.tipo||'Easy Apply'} plataforma={local.plataforma}/>
          </div>
          {local.url&&<a href={local.url} target="_blank" rel="noreferrer" style={{color:T.teal,fontSize:11.5,textDecoration:'none',fontWeight:500}}>Ver oferta ↗</a>}
          {local.notion_id&&<div style={{marginTop:3,fontSize:10,color:T.teal,fontWeight:600,letterSpacing:'0.04em'}}>✓ Synced desde Notion</div>}
        </div>
        <button onClick={onClose} style={{background:'none',border:'none',color:T.dim,cursor:'pointer',fontSize:22,lineHeight:1,padding:'0 0 0 10px',flexShrink:0}}>×</button>
      </div>

      {/* Estado */}
      <div style={sec}>
        <span style={lbl}>Estado</span>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {STATUS_LIST.map(s=>{
            const cfg=STATUSES[s];const active=local.estado===s;
            return (
              <button key={s} onClick={()=>push('estado',s,`Estado → ${s}`)} style={{
                padding:'4px 10px',borderRadius:5,cursor:'pointer',
                fontSize:11,fontWeight:active?700:500,
                letterSpacing:'0.03em',textTransform:'uppercase',
                border:`1px solid ${active?cfg.border:T.border}`,
                background:active?cfg.bg:'#FFFFFF',
                color:active?cfg.color:T.muted,
                transition:'all 0.12s',fontFamily:FONT,
                boxShadow:active?T.shadow:'none',
              }}>{s}</button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div style={sec}>
        <span style={lbl}>Valoración personal</span>
        <Stars rating={local.rating||0} size={22} onChange={v=>{setLocal(l=>({...l,rating:v}));push('rating',v,`Valoración → ${'★'.repeat(v)||'—'}`);}}/>
      </div>

      {/* Notas */}
      <div style={sec}>
        <span style={lbl}>Notas</span>
        <Field value={notes} onChange={setNotes} onBlur={()=>push('notas',notes,'Notas actualizadas')} placeholder="Prep entrevista, info empresa, red flags..." multi rows={3}/>
      </div>

      {/* Reclutador */}
      <div style={sec}>
        <span style={lbl}>Contacto reclutador</span>
        <Field value={rec} onChange={setRec} onBlur={()=>push('contactoReclutador',rec,`Reclutador → ${rec||'—'}`)} placeholder="Nombre del reclutador..."/>
      </div>

      {/* Info puesto */}
      {(local.resumenPuesto||local.requisitosClave?.length>0||local.beneficios)&&(
        <div style={sec}>
          <span style={lbl}>Sobre el puesto</span>
          {local.resumenPuesto&&<p style={{color:T.text2,fontSize:12.5,lineHeight:1.65,margin:'0 0 10px'}}>{local.resumenPuesto}</p>}
          {local.requisitosClave?.length>0&&(
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:T.dim,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6,fontWeight:700}}>Requisitos</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {local.requisitosClave.map((r,i)=>(
                  <span key={i} style={{padding:'3px 8px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:4,color:T.text2,fontSize:11.5,fontWeight:500}}>{r}</span>
                ))}
              </div>
            </div>
          )}
          {local.beneficios&&<div style={{fontSize:12,color:T.text2,marginTop:6}}><span style={{fontSize:10,color:T.dim,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700}}>Beneficios · </span>{local.beneficios}</div>}
        </div>
      )}

      {/* Historial */}
      <div style={sec}>
        <span style={lbl}>Historial de cambios</span>
        {!(local.historial?.length)?<div style={{color:T.dim,fontSize:12}}>Sin historial</div>:(
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[...(local.historial||[])].reverse().slice(0,12).map((h,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:T.border2,marginTop:5,flexShrink:0}}/>
                <div>
                  <div style={{color:T.text2,fontSize:12,fontWeight:500}}>{h.cambio}</div>
                  <div style={{color:T.dim,fontSize:10.5,marginTop:2,fontVariantNumeric:'tabular-nums'}}>{fmtDate(h.fecha)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{padding:'14px 18px'}}>
        <Btn variant="danger" full onClick={()=>{if(window.confirm('¿Eliminar? No se puede deshacer.'))onDelete(local.id);}}>
          Eliminar aplicación
        </Btn>
      </div>
    </div>
  );
};

// ── NOTION MODALS ─────────────────────────────────────────────
const NotionSyncModal = ({apps,onSync,onClose}) => {
  const [phase,setPhase]=useState('idle');const [count,setCount]=useState(0);const [err,setErr]=useState('');
  const doSync=async()=>{
    setPhase('loading');setErr('');
    try{
      const data=await notionAction('sync');
      if(data.error)throw new Error(data.error);
      const notionApps=data.aplicaciones||[];
      const existingUrls=new Set(apps.map(a=>a.url).filter(Boolean));
      const existingNIds=new Set(apps.map(a=>a.notion_id).filter(Boolean));
      const newApps=notionApps.filter(a=>!existingUrls.has(a.url)&&!existingNIds.has(a.notion_id))
        .map(a=>({...a,id:genId(),pais:a.pais||detectCountry(a.ubicacion||''),rating:Number(a.rating)||0,historial:[{fecha:new Date().toISOString(),cambio:'Sincronizada desde Notion',tipo:'notion_sync'}]}));
      if(newApps.length>0)onSync(newApps);
      setCount(newApps.length);setPhase('done');
    }catch(e){setErr(e.message);setPhase('error');}
  };
  return (
    <Modal onClose={onClose} title="Sync desde Notion" subtitle="Importa aplicaciones nuevas desde tu base de datos">
      {phase==='idle'&&<p style={{color:T.text2,fontSize:13,margin:'0 0 20px',lineHeight:1.7}}>Conecta con <strong style={{color:T.text,fontWeight:700}}>"Job Tracker — Borja López"</strong> e importa lo nuevo. Deduplicado por URL.</p>}
      {phase==='loading'&&<div style={{color:T.muted,fontSize:13,padding:'16px 0'}}>Consultando Notion...</div>}
      {phase==='done'&&<div style={{background:T.tealL,border:`1px solid ${T.teal}30`,borderRadius:8,padding:'12px 14px',marginBottom:16}}>
        <div style={{color:T.teal,fontWeight:700,fontSize:14,marginBottom:3}}>{count>0?`✓ ${count} aplicación${count>1?'es':''} importada${count>1?'s':''}`:'Todo al día'}</div>
        <div style={{color:T.teal,fontSize:12,opacity:0.8}}>{count===0?'No hay aplicaciones nuevas en Notion.':'Ya aparecen en el dashboard.'}</div>
      </div>}
      {phase==='error'&&<div style={{background:'#FEECEC',border:'1px solid #F5BCBC',borderRadius:8,padding:'12px 14px',marginBottom:16,color:'#991B1B',fontSize:13}}>{err}</div>}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:phase==='idle'?0:8}}>
        <Btn onClick={onClose}>{phase==='done'?'Cerrar':'Cancelar'}</Btn>
        {phase!=='done'&&<Btn variant="teal" onClick={doSync} disabled={phase==='loading'}>{phase==='loading'?'Sincronizando...':'Sincronizar'}</Btn>}
      </div>
    </Modal>
  );
};

const NotionExportModal = ({apps,onClose}) => {
  const [phase,setPhase]=useState('idle');const [err,setErr]=useState('');
  const doExport=async()=>{setPhase('loading');try{const d=await notionAction('export',{apps});if(d.error)throw new Error(d.error);setPhase('done');}catch(e){setErr(e.message);setPhase('error');}};
  return (
    <Modal onClose={onClose} title="Exportar a Notion" subtitle="Actualiza Notion con los estados actuales">
      {phase==='idle'&&<p style={{color:T.text2,fontSize:13,margin:'0 0 6px',lineHeight:1.7}}>Sincroniza <strong style={{color:T.text}}>{apps.length} aplicaciones</strong> a Notion.</p>}
      {phase==='done'&&<div style={{background:T.tealL,border:`1px solid ${T.teal}30`,borderRadius:8,padding:'12px 14px',marginBottom:16,color:T.teal,fontSize:13,fontWeight:600}}>✓ {apps.length} aplicaciones actualizadas en Notion</div>}
      {phase==='error'&&<div style={{background:'#FEECEC',border:'1px solid #F5BCBC',borderRadius:8,padding:'12px 14px',marginBottom:16,color:'#991B1B',fontSize:13}}>{err}</div>}
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
        <Btn onClick={onClose}>{phase==='done'?'Cerrar':'Cancelar'}</Btn>
        {phase!=='done'&&<Btn variant="primary" onClick={doExport} disabled={phase==='loading'}>{phase==='loading'?'Exportando...':'Exportar'}</Btn>}
      </div>
    </Modal>
  );
};

const ImportModal = ({onClose,onImport}) => {
  const [text,setText]=useState('');const [err,setErr]=useState('');
  const handle=()=>{setErr('');try{const raw=JSON.parse(text.trim());const list=Array.isArray(raw)?raw:(raw.aplicaciones||[]);if(!list.length)throw new Error('empty');const sid=raw.sesion_id||raw.fecha||new Date().toISOString().slice(0,10);const now=new Date().toISOString();const apps=list.map(a=>({id:genId(),titulo:a.titulo||'',empresa:a.empresa||'',ubicacion:a.ubicacion||'',pais:detectCountry(a.ubicacion||''),tipoJornada:a.tipo||'Jornada completa',tipo:a.tipo_aplicacion||'Easy Apply',plataforma:a.plataforma||'',publicado:a.publicado||'',aplicadoEn:a.aplicadoEn||now,sesionId:sid,contactoReclutador:a.contacto_reclutador||a.contactoReclutador||'',url:a.url||'',estado:a.estado||'Enviada',notas:'',rating:0,resumenPuesto:a.resumen_puesto||a.resumenPuesto||'',requisitosClave:a.requisitos_clave||a.requisitosClave||[],beneficios:a.beneficios||'',historial:[{fecha:now,cambio:`Importada — sesión ${sid}`,tipo:'import'}]}));onImport(apps);}catch{setErr('JSON no reconocido.');}};
  return (
    <Modal onClose={onClose} title="Importar sesión" subtitle="JSON de respaldo de linkedin-easy-apply">
      <textarea autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder={'{ "sesion_id": "2026-08-13", "aplicaciones": [...] }'} style={{width:'100%',height:150,background:T.bg,border:`1px solid ${err?'#F5BCBC':T.border2}`,borderRadius:8,color:T.text,fontFamily:'monospace',fontSize:11.5,padding:12,resize:'vertical',boxSizing:'border-box',lineHeight:1.5,outline:'none'}}/>
      {err&&<div style={{color:'#991B1B',fontSize:12,marginTop:5}}>{err}</div>}
      <div style={{display:'flex',gap:8,marginTop:14,justifyContent:'flex-end'}}><Btn onClick={onClose}>Cancelar</Btn><Btn variant="primary" onClick={handle} disabled={!text.trim()}>Importar</Btn></div>
    </Modal>
  );
};

const AddModal = ({onClose,onAdd}) => {
  const [f,setF]=useState({titulo:'',empresa:'',pais:'NL',url:'',estado:'Enviada',contactoReclutador:'',tipo:'Easy Apply',plataforma:''});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));const valid=f.titulo.trim()&&f.empresa.trim();
  const sel={width:'100%',background:'#FFFFFF',border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,fontSize:13,padding:'9px 12px',fontFamily:FONT,boxSizing:'border-box',outline:'none'};
  return (
    <Modal onClose={onClose} title="Añadir manualmente">
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {[{k:'titulo',l:'Título del puesto *',ph:'UX/UI Designer'},{k:'empresa',l:'Empresa *',ph:'Nombre de la empresa'}].map(({k,l,ph})=>(
          <div key={k}><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>{l}</div><Field value={f[k]} onChange={v=>set(k,v)} placeholder={ph}/></div>
        ))}
        <div style={{display:'flex',gap:10}}>
          {[{k:'pais',l:'País',opts:Object.entries(FLAGS).map(([c,fl])=>({v:c,l:`${fl} ${c}`}))},{k:'estado',l:'Estado',opts:STATUS_LIST.map(s=>({v:s,l:s}))}].map(({k,l,opts})=>(
            <div key={k} style={{flex:1}}><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>{l}</div><select value={f[k]} onChange={e=>set(k,e.target.value)} style={sel}>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
          ))}
        </div>
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1}}><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>Tipo</div><select value={f.tipo} onChange={e=>set('tipo',e.target.value)} style={sel}>{TIPO_LIST.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div style={{flex:1}}><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>Plataforma</div><Field value={f.plataforma} onChange={v=>set('plataforma',v)} placeholder="LinkedIn, Greenhouse..."/></div>
        </div>
        <div><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>URL de la oferta</div><Field value={f.url} onChange={v=>set('url',v)} placeholder="https://..."/></div>
        <div><div style={{fontSize:10.5,color:T.muted,marginBottom:5,textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:600}}>Reclutador (opcional)</div><Field value={f.contactoReclutador} onChange={v=>set('contactoReclutador',v)} placeholder="Nombre del reclutador..."/></div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:20,justifyContent:'flex-end'}}><Btn onClick={onClose}>Cancelar</Btn><Btn variant="primary" disabled={!valid} onClick={()=>{if(!valid)return;const now=new Date().toISOString();onAdd({...f,id:genId(),rating:0,sesionId:'manual',aplicadoEn:now,resumenPuesto:'',requisitosClave:[],beneficios:'',notas:'',ubicacion:'',historial:[{fecha:now,cambio:'Añadida manualmente',tipo:'manual'}]});}}> Añadir</Btn></div>
    </Modal>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [authed,setAuthed]=useState(()=>sessionStorage.getItem('jt_auth')==='1');
  const [apps,setApps]=useState(()=>store.load());
  const [selected,setSelected]=useState(null);
  const [modal,setModal]=useState(null);
  const [filters,setFilters]=useState({status:'all',country:'all',tipo:'all',rating:0,search:''});
  const [lastSync,setLastSync]=useState(null);

  const persist=useCallback(next=>{setApps(next);store.save(next);},[]);
  const setFilter=(k,v)=>setFilters(f=>({...f,[k]:v}));
  const handleImport=a=>{persist([...apps,...a]);setModal(null);};
  const handleAdd=a=>{persist([a,...apps]);setSelected(a);setModal(null);};
  const handleUpdate=u=>{persist(apps.map(a=>a.id===u.id?u:a));setSelected(u);};
  const handleDelete=id=>{persist(apps.filter(a=>a.id!==id));setSelected(null);};
  const handleSync=newApps=>{persist([...newApps,...apps]);setLastSync(newApps.length);setModal(null);};

  const filtered=apps.filter(a=>{
    if(filters.status!=='all'&&a.estado!==filters.status)return false;
    if(filters.country!=='all'&&a.pais!==filters.country)return false;
    if(filters.tipo!=='all'&&(a.tipo||'Easy Apply')!==filters.tipo)return false;
    if(filters.rating>0&&(a.rating||0)<filters.rating)return false;
    if(filters.search){const q=filters.search.toLowerCase();if(!a.titulo?.toLowerCase().includes(q)&&!a.empresa?.toLowerCase().includes(q))return false;}
    return true;
  }).sort((a,b)=>new Date(b.aplicadoEn)-new Date(a.aplicadoEn));

  const byStatus=STATUS_LIST.reduce((acc,s)=>{acc[s]=apps.filter(a=>a.estado===s).length;return acc;},{});
  const byCountry=Object.keys(FLAGS).reduce((acc,c)=>{const n=apps.filter(a=>a.pais===c).length;if(n)acc[c]=n;return acc;},{});
  const byTipo=TIPO_LIST.reduce((acc,t)=>{const n=apps.filter(a=>(a.tipo||'Easy Apply')===t).length;if(n)acc[t]=n;return acc;},{});
  const interviews=apps.filter(a=>a.estado==='Entrevista').length;
  const offers=apps.filter(a=>a.estado==='Oferta').length;

  if(!authed)return <LoginScreen onAuth={()=>setAuthed(true)}/>;

  return (
    <div style={{display:'flex',height:'100vh',background:T.bg,fontFamily:FONT,color:T.text,overflow:'hidden',fontSize:13}}>

      {/* ─── SIDEBAR ─── */}
      <div style={{width:210,minWidth:210,background:T.sidebar,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',overflowY:'auto'}}>

        {/* Header */}
        <div style={{padding:'20px 16px 16px',borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
            <div style={{width:26,height:26,borderRadius:7,background:T.teal,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 2px 8px ${T.teal}35`}}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="1" fill="white" fillOpacity="0.95"/>
                <rect x="7" y="1" width="4" height="4" rx="1" fill="white" fillOpacity="0.6"/>
                <rect x="1" y="7" width="4" height="4" rx="1" fill="white" fillOpacity="0.6"/>
                <rect x="7" y="7" width="4" height="4" rx="1" fill="white" fillOpacity="0.3"/>
              </svg>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:'-0.02em',color:T.text,lineHeight:1.2}}>Job Tracker</div>
              <div style={{fontSize:10,color:T.muted,letterSpacing:'0.01em'}}>Borja López</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{background:'#FFFFFF',borderRadius:8,padding:'10px 12px',boxShadow:T.shadow,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:28,fontWeight:800,letterSpacing:'-0.04em',lineHeight:1,color:T.teal}}>{apps.length}</div>
            <div style={{fontSize:10.5,color:T.muted,marginTop:2,letterSpacing:'0.02em',textTransform:'uppercase'}}>Aplicaciones</div>
            {lastSync!==null&&<div style={{marginTop:6,fontSize:11,color:T.teal,fontWeight:600}}>↑ {lastSync} nuevas</div>}
          </div>

          {/* Alerts */}
          {interviews>0&&(
            <div style={{marginTop:8,fontSize:11.5,color:'#92400E',background:T.amberL,padding:'5px 10px',borderRadius:6,border:'1px solid #F5CC80',fontWeight:600}}>
              🗓 {interviews} entrevista{interviews>1?'s':''} activa{interviews>1?'s':''}
            </div>
          )}
          {offers>0&&(
            <div style={{marginTop:5,fontSize:11.5,color:T.teal,background:T.tealL,padding:'5px 10px',borderRadius:6,border:`1px solid ${T.teal}30`,fontWeight:600}}>
              ✓ {offers} oferta{offers>1?'s':''} recibida{offers>1?'s':''}
            </div>
          )}
        </div>

        {/* Status filters */}
        <div style={{padding:'14px 10px 4px'}}>
          <div style={{fontSize:9.5,color:T.dim,textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:6,paddingLeft:14}}>Estado</div>
          <SBtn label="Todas las aplicaciones" count={apps.length} active={filters.status==='all'} onClick={()=>setFilter('status','all')}/>
          {STATUS_LIST.map(s=>(
            <SBtn key={s} label={s} count={byStatus[s]||0} active={filters.status===s} dotColor={STATUSES[s].color} onClick={()=>setFilter('status',filters.status===s?'all':s)}/>
          ))}
        </div>

        {/* Country filters */}
        {Object.keys(byCountry).length>0&&(
          <div style={{padding:'14px 10px 4px'}}>
            <div style={{fontSize:9.5,color:T.dim,textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:6,paddingLeft:14}}>País</div>
            {Object.entries(byCountry).map(([c,n])=>(
              <SBtn key={c} label={`${FLAGS[c]} ${c}`} count={n} active={filters.country===c} onClick={()=>setFilter('country',filters.country===c?'all':c)}/>
            ))}
          </div>
        )}

        {/* Tipo filters */}
        {Object.keys(byTipo).length>0&&(
          <div style={{padding:'14px 10px 4px'}}>
            <div style={{fontSize:9.5,color:T.dim,textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:6,paddingLeft:14}}>Tipo</div>
            {Object.entries(byTipo).map(([t,n])=>(
              <SBtn key={t} label={t} count={n} active={filters.tipo===t} dotColor={TIPOS[t].color} onClick={()=>setFilter('tipo',filters.tipo===t?'all':t)}/>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{marginTop:'auto',padding:'12px 10px',display:'flex',flexDirection:'column',gap:6,borderTop:`1px solid ${T.border}`}}>
          <Btn variant="primary" full onClick={()=>setModal('sync')}>🔄 Sync desde Notion</Btn>
          <Btn variant="ghost" full onClick={()=>setModal('add')}>+ Añadir manual</Btn>
          <div style={{display:'flex',gap:5}}>
            <Btn full small onClick={()=>setModal('import')}>↓ Import JSON</Btn>
            <Btn full small onClick={()=>setModal('export')}>↑ Export</Btn>
          </div>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

        {/* Topbar */}
        <div style={{padding:'10px 16px',borderBottom:`1px solid ${T.border}`,display:'flex',gap:10,alignItems:'center',flexShrink:0,background:T.bg}}>
          <input value={filters.search} onChange={e=>setFilter('search',e.target.value)}
            placeholder="Buscar empresa o título..."
            style={{flex:1,maxWidth:300,background:'#FFFFFF',border:`1px solid ${T.border2}`,borderRadius:7,color:T.text,fontSize:13,padding:'8px 13px',fontFamily:FONT,outline:'none',boxShadow:T.shadow}}/>
          <div style={{display:'flex',alignItems:'center',gap:3}}>
            <span style={{fontSize:10,color:T.muted,textTransform:'uppercase',letterSpacing:'0.06em',marginRight:3}}>Min</span>
            {[1,2,3,4,5].map(n=>(
              <span key={n} onClick={()=>setFilter('rating',filters.rating===n?0:n)}
                style={{fontSize:18,cursor:'pointer',color:n<=filters.rating?T.amber:'#DDD5C8',lineHeight:1,transition:'color 0.1s'}}>★</span>
            ))}
          </div>
          <div style={{color:T.dim,fontSize:11.5,marginLeft:4,fontVariantNumeric:'tabular-nums'}}>
            {filtered.length!==apps.length?`${filtered.length} / ${apps.length}`:apps.length} aplicaciones
          </div>
        </div>

        {/* List + Panel */}
        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          <div style={{flex:1,overflowY:'auto',padding:'12px 14px'}}>
            {filtered.length===0?(
              <div style={{textAlign:'center',padding:'80px 20px'}}>
                <div style={{fontSize:40,marginBottom:14,opacity:0.25}}>{apps.length===0?'📋':'🔍'}</div>
                <div style={{color:T.text2,fontSize:16,fontWeight:700,marginBottom:6,letterSpacing:'-0.02em'}}>{apps.length===0?'Sin aplicaciones todavía':'Sin resultados'}</div>
                <div style={{color:T.muted,fontSize:13,lineHeight:1.7}}>{apps.length===0?<>Haz sync desde Notion o añade<br/>una aplicación para empezar.</>:'Prueba ajustando los filtros.'}</div>
                {apps.length===0&&(
                  <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20}}>
                    <Btn variant="primary" onClick={()=>setModal('sync')}>🔄 Sync desde Notion</Btn>
                    <Btn onClick={()=>setModal('add')}>+ Añadir manual</Btn>
                  </div>
                )}
              </div>
            ):filtered.map(app=>(
              <AppCard key={app.id} app={app} selected={selected?.id===app.id} onClick={()=>setSelected(s=>s?.id===app.id?null:app)}/>
            ))}
          </div>
          {selected&&<DetailPanel app={selected} onUpdate={handleUpdate} onDelete={handleDelete} onClose={()=>setSelected(null)}/>}
        </div>
      </div>

      {modal==='sync'  &&<NotionSyncModal apps={apps} onSync={handleSync} onClose={()=>setModal(null)}/>}
      {modal==='export'&&<NotionExportModal apps={apps} onClose={()=>setModal(null)}/>}
      {modal==='import'&&<ImportModal onClose={()=>setModal(null)} onImport={handleImport}/>}
      {modal==='add'   &&<AddModal onClose={()=>setModal(null)} onAdd={handleAdd}/>}
    </div>
  );
}
