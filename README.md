<div align="center">

# LinkedIn Job Tracker

**AI-powered job application system built with Claude.**  
Apply to dozens of LinkedIn jobs hands-free, track every application in a live dashboard, and sync everything to Notion — all in one workflow.

<br/>

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)
[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-teal)](https://claude.ai)
[![Powered by Notion](https://img.shields.io/badge/Syncs%20with-Notion-black)](https://notion.so)

<br/>

🇬🇧 [English](#english) · 🇪🇸 [Español](#español)

</div>

---

<a name="english"></a>

## 🇬🇧 English

### What it does

1. **Skill** — Give Claude control of your browser. It searches LinkedIn, filters irrelevant offers, fills every form field with your personal data, and submits applications automatically. At the end of each session it writes every application to your Notion database.

2. **Dashboard** — A password-protected web app (runs inside Claude or deployable to Vercel) that syncs from Notion and lets you manage your entire pipeline: change statuses, add notes, rate opportunities, track recruiters, and see the full history of every application.

### How it works

```
/linkedin-easy-apply  →  Claude opens LinkedIn in your browser
                      →  Searches with your filters (remote, country, seniority)
                      →  Skips ineligible offers automatically
                      →  Fills every form field with your data
                      →  Submits the application
                      →  Writes to Notion at end of session
                              ↓
              Dashboard  →  Sync from Notion (one click)
                         →  Manage statuses & notes
                         →  Track recruiters & follow-ups
```

### Components

| File | What it is |
|------|-----------|
| `skill/setup.md` | **Start here.** One-time onboarding — asks your personal data, creates the Notion database automatically, and delivers your personalized skill + live dashboard |
| `skill/linkedin-easy-apply.md` | Generic skill template (filled in by setup) |
| `skill/dashboard-artifact-template.jsx` | Dashboard code for Claude artifact (no deployment needed) |
| `dashboard/` | Same dashboard as a Vite app — deploy to Vercel for browser access |

### Requirements

- Claude Pro subscription
- Claude for Chrome extension
- Notion account (free tier)
- Vercel account (free tier, optional — for browser deployment)

### Quick start

```
1. Paste skill/setup.md into a Claude conversation
2. Answer the questions (5–10 min)
3. Claude creates your Notion database and connects everything automatically
4. Save your personalized skill file
5. Run /linkedin-easy-apply and start applying
```

Full guide: [SETUP.md](./SETUP.md)

---

<a name="español"></a>

## 🇪🇸 Español

### Qué hace

1. **Skill** — Dale a Claude control de tu navegador. Busca en LinkedIn, filtra las ofertas que no encajan, rellena todos los campos del formulario con tus datos personales y envía las solicitudes automáticamente. Al terminar cada sesión, escribe todas las aplicaciones en tu base de datos de Notion.

2. **Dashboard** — Una aplicación web protegida con contraseña (funciona dentro de Claude o se puede desplegar en Vercel) que sincroniza con Notion y te permite gestionar todo tu pipeline: cambiar estados, añadir notas, valorar oportunidades, hacer seguimiento de reclutadores y ver el historial completo de cada aplicación.

### Cómo funciona

```
/linkedin-easy-apply  →  Claude abre LinkedIn en tu navegador
                      →  Busca con tus filtros (remoto, país, seniority)
                      →  Descarta ofertas automáticamente
                      →  Rellena cada campo con tus datos
                      →  Envía la solicitud
                      →  Escribe a Notion al terminar la sesión
                              ↓
              Dashboard  →  Sync desde Notion (un click)
                         →  Gestión de estados y notas
                         →  Seguimiento de reclutadores
```

### Componentes

| Archivo | Qué es |
|---------|--------|
| `skill/setup.md` | **Empieza aquí.** Onboarding único — hace preguntas sobre ti, crea la base de datos de Notion automáticamente y entrega tu skill personalizada + dashboard listo |
| `skill/linkedin-easy-apply.md` | Template genérico de la skill (se rellena con el setup) |
| `skill/dashboard-artifact-template.jsx` | Código del dashboard para artifact de Claude (sin necesidad de despliegue) |
| `dashboard/` | El mismo dashboard como app Vite — despliega en Vercel para acceso desde cualquier navegador |

### Requisitos

- Suscripción Claude Pro
- Extensión Claude for Chrome
- Cuenta de Notion (plan gratuito funciona)
- Cuenta de Vercel (gratuito, opcional — para acceso desde el navegador)

### Inicio rápido

```
1. Pega skill/setup.md en una conversación de Claude
2. Responde las preguntas (5–10 min)
3. Claude crea tu base de datos en Notion y lo conecta todo automáticamente
4. Guarda tu archivo de skill personalizado
5. Ejecuta /linkedin-easy-apply y empieza a aplicar
```

Guía completa: [SETUP.md](./SETUP.md)

---

## Created by

**Borja López** — UX/UI Designer & Product Builder based in Den Bosch, Netherlands.

This tool was built to solve a real problem: applying to dozens of jobs manually is slow, repetitive, and easy to lose track of. LinkedIn Job Tracker automates the grunt work so you can focus on what actually matters — preparing for interviews and choosing the right opportunity.

[![Portfolio](https://img.shields.io/badge/Portfolio-borjalopezdesign.com-teal)](https://borjalopezdesign.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Borja%20López-blue?logo=linkedin)](https://linkedin.com/in/borjalopez1)
[![Email](https://img.shields.io/badge/Contact-bjlopez.designer%40gmail.com-gray)](mailto:bjlopez.designer@gmail.com)

---

## License

**CC BY-NC 4.0** — Free to use and adapt with attribution. Commercial use requires explicit permission.

- ✅ Use it for your own job search
- ✅ Fork it, modify it, share it
- ✅ Credit the author (Borja López — borjalopezdesign.com)
- ❌ Cannot be sold or used commercially without permission

For commercial licensing: [bjlopez.designer@gmail.com](mailto:bjlopez.designer@gmail.com)

If you find it useful, a ⭐ on GitHub is always appreciated.
