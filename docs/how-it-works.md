# How It Works

## Architecture overview

```
YOUR BROWSER
  └── Claude for Chrome
        └── LinkedIn.com (automated)
              └── Application submitted
                    └── Claude writes to Notion (session end)
                          └── Notion Database (one row per app)
                                └── Dashboard syncs from Notion
                                      └── You manage statuses & notes
```

## The skill (Claude for Chrome)

The skill is a Markdown file that Claude reads as instructions. When triggered:

1. Opens LinkedIn in your browser via the Chrome extension
2. Builds search URLs with the right filters (Easy Apply, remote, country)
3. Reads each listing and decides whether to apply based on your rules
4. Opens Easy Apply modal and fills every field with your personal data
5. Handles multi-page forms, CV selection, cover letters, and screening questions
6. Skips offers that don't match criteria (seniority, language, geography)
7. Logs every application internally as it goes
8. At the end: generates Markdown summary + writes all to Notion

## The dashboard (React + Vercel + Notion)

A password-protected Vite/React app with three data layers:

- **localStorage** — persists data between sessions in the same browser
- **Notion** — source of truth, synced via Notion REST API
- **Vercel serverless function** — secure proxy for Notion API calls

**Sync (Notion → Dashboard):**
Frontend calls `/api/notion {action: "sync"}` → serverless queries Notion → deduplicates by URL → merges into localStorage

**Export (Dashboard → Notion):**
Frontend calls `/api/notion {action: "export", apps: [...]}` → serverless updates existing pages (PATCH) or creates new ones (POST)

## Security

- Dashboard is password-protected (sessionStorage)
- Notion token stays in Vercel env vars — never exposed to the browser
- All Notion calls go through the `/api/notion` serverless proxy

## Data model

```typescript
{
  id: string                 // Local UUID
  notion_id?: string         // Set after first sync from Notion
  titulo: string             // Job title
  empresa: string            // Company
  pais: 'NL'|'ES'|'UK'|'US'|'Global'
  url: string                // LinkedIn job URL
  estado: 'Enviada'|'Vista'|'Contactada'|'Entrevista'|'Oferta'|'Rechazada'|'Cancelada'
  contactoReclutador: string
  sesionId: string           // YYYY-MM-DD
  resumenPuesto: string
  requisitosClave: string[]
  beneficios: string
  rating: number             // 0-5
  notas: string
  aplicadoEn: string         // ISO timestamp
  historial: Array<{ fecha: string, cambio: string, tipo: string }>
}
```
