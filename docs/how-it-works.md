🇬🇧 [English](#english) · 🇪🇸 [Español](#español)

---

<a name="english"></a>

# 🇬🇧 How It Works

## Architecture overview

```
YOUR BROWSER
  └── Claude for Chrome (browser automation)
        └── LinkedIn.com
              └── Easy Apply form submitted
                    └── Claude writes to Notion (end of session)
                          └── Notion Database — "Job Tracker"
                                └── Dashboard syncs from Notion
                                      └── You manage statuses, notes & follow-ups
```

## The skill — what Claude does

The skill is a Markdown file with instructions. When triggered, Claude:

1. **Asks preferences** — modality (remote/hybrid), countries, keywords
2. **Builds search URLs** — LinkedIn filters: `f_AL=true` (Easy Apply only) + geo + modality
3. **Reads each listing** — decides whether to apply based on your skip rules
4. **Opens Easy Apply modal** — fills every field with your personal data
5. **Handles multi-page forms** — CVs, cover letters, screening questions, salary, availability
6. **Tracks everything** — logs each application internally as it goes
7. **Closes the session** — generates a Markdown summary + writes all to Notion

## Skip rules (what gets filtered automatically)

Claude skips an offer if it matches any of these:

- **Seniority** — title contains Senior, Lead, Principal, Director, etc. (configurable)
- **Language** — offer written only in a language you didn't accept
- **Geography** — requires legal authorization to work in US or UK (if form asks)
- **Modality** — hybrid when you requested remote only
- **Missing button** — no Easy Apply button → skip entirely

## The dashboard

A password-protected React app available in two modes:

**Mode A — Claude artifact** (no deployment needed)
- Runs directly inside Claude
- Uses `window.storage` for persistence between sessions
- Calls Anthropic API + Notion MCP for sync/export

**Mode B — Vercel web app** (accessible from any browser)
- Deployed via Vercel
- Uses `localStorage` for local persistence
- Calls Notion REST API via a secure serverless proxy (`/api/notion`)
- Notion token stored as Vercel environment variable — never exposed to the browser

## Data flow

```
Skill session ends
      │
      ├─ notion-create-pages (one page per application)
      │         │
      │    Notion Database
      │         │
      └─ Dashboard "Sync from Notion"
                │
                ├─ Deduplicates by URL
                ├─ Merges new entries into local storage
                └─ Applications appear in the list
```

## Security

- Dashboard requires a password to access
- Notion integration token is stored server-side (Vercel env vars) — never in the browser
- The skill only accesses LinkedIn and Notion — no other sites
- All data stays in your own Notion workspace

## Data model

Each application stored as:

```typescript
{
  id: string                  // Local UUID
  notion_id?: string          // Set after first sync
  titulo: string              // Job title
  empresa: string             // Company
  pais: 'NL'|'ES'|'UK'|'US'|'Global'
  url: string                 // LinkedIn job URL (dedup key)
  estado: 'Enviada'|'Vista'|'Contactada'|'Entrevista'|'Oferta'|'Rechazada'|'Cancelada'
  contactoReclutador: string
  sesionId: string            // YYYY-MM-DD
  resumenPuesto: string
  requisitosClave: string[]
  beneficios: string
  rating: number              // 0–5 stars
  notas: string
  aplicadoEn: string          // ISO timestamp
  historial: Array<{
    fecha: string
    cambio: string
    tipo: string
  }>
}
```

---

<a name="español"></a>

# 🇪🇸 Cómo funciona

## Arquitectura general

```
TU NAVEGADOR
  └── Claude for Chrome (automatización del navegador)
        └── LinkedIn.com
              └── Formulario Easy Apply enviado
                    └── Claude escribe en Notion (fin de sesión)
                          └── Base de datos de Notion — "Job Tracker"
                                └── Dashboard sincroniza desde Notion
                                      └── Tú gestionas estados, notas y seguimientos
```

## La skill — qué hace Claude

La skill es un archivo Markdown con instrucciones. Al activarse, Claude:

1. **Pregunta preferencias** — modalidad (remoto/híbrido), países, palabras clave
2. **Construye URLs de búsqueda** — filtros de LinkedIn: `f_AL=true` (Easy Apply) + geo + modalidad
3. **Lee cada oferta** — decide si aplicar según tus reglas de filtrado
4. **Abre el modal Easy Apply** — rellena cada campo con tus datos personales
5. **Gestiona formularios de varias páginas** — CVs, carta de presentación, preguntas, salario
6. **Registra todo** — anota cada aplicación internamente mientras avanza
7. **Cierra la sesión** — genera un resumen en Markdown + escribe todo en Notion

## Reglas de filtrado (qué se descarta automáticamente)

Claude descarta una oferta si cumple alguna de estas condiciones:

- **Seniority** — el título contiene Senior, Lead, Principal, Director, etc. (configurable)
- **Idioma** — oferta escrita solo en un idioma que no aceptas
- **Geografía** — requiere autorización legal para trabajar en US o UK
- **Modalidad** — híbrido cuando pediste solo remoto
- **Sin botón** — sin botón Easy Apply → se salta directamente

## El dashboard

Una app React protegida con contraseña disponible en dos modos:

**Modo A — Artifact de Claude** (sin despliegue necesario)
- Funciona directamente dentro de Claude
- Usa `window.storage` para persistencia entre sesiones
- Llama a Anthropic API + Notion MCP para sync/export

**Modo B — App web en Vercel** (accesible desde cualquier navegador)
- Desplegado vía Vercel
- Usa `localStorage` para persistencia local
- Llama a la REST API de Notion vía un proxy serverless seguro (`/api/notion`)
- El token de Notion se guarda como variable de entorno en Vercel — nunca en el navegador

## Flujo de datos

```
Sesión de la skill termina
      │
      ├─ notion-create-pages (una página por aplicación)
      │         │
      │    Base de datos de Notion
      │         │
      └─ Dashboard "Sync desde Notion"
                │
                ├─ Deduplicación por URL
                ├─ Fusiona entradas nuevas en el almacenamiento local
                └─ Las aplicaciones aparecen en la lista
```

## Seguridad

- El dashboard requiere contraseña para acceder
- El token de integración de Notion se guarda en el servidor (variables de entorno de Vercel) — nunca en el navegador
- La skill solo accede a LinkedIn y Notion — ningún otro sitio
- Todos los datos permanecen en tu propio workspace de Notion

## Modelo de datos

Cada aplicación se guarda con esta estructura:

```typescript
{
  id: string                  // UUID local
  notion_id?: string          // Se asigna tras el primer sync
  titulo: string              // Título del puesto
  empresa: string             // Empresa
  pais: 'NL'|'ES'|'UK'|'US'|'Global'
  url: string                 // URL de la oferta en LinkedIn (clave de dedup)
  estado: 'Enviada'|'Vista'|'Contactada'|'Entrevista'|'Oferta'|'Rechazada'|'Cancelada'
  contactoReclutador: string
  sesionId: string            // YYYY-MM-DD
  resumenPuesto: string
  requisitosClave: string[]
  beneficios: string
  rating: number              // 0–5 estrellas
  notas: string
  aplicadoEn: string          // Timestamp ISO
  historial: Array<{
    fecha: string
    cambio: string
    tipo: string
  }>
}
```
