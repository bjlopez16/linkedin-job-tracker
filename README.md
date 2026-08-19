<div align="center">

# LinkedIn Job Tracker

**AI-powered job application system built with Claude.**  
Apply to dozens of LinkedIn jobs hands-free, track every application in a live dashboard, and sync everything to Notion — all in one workflow.

<br/>

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](LICENSE)
[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-teal)](https://claude.ai)
[![Powered by Notion](https://img.shields.io/badge/Syncs%20with-Notion-black)](https://notion.so)
[![v2](https://img.shields.io/badge/version-v2%20%E2%80%94%20off--LinkedIn%20applications-orange)](#english)

<br/>

🇬🇧 [English](#english) · 🇪🇸 [Español](#español)

</div>

---

<a name="english"></a>

## 🇬🇧 English

### What it does

1. **Skill** — Give Claude control of your browser. It searches LinkedIn, filters irrelevant offers, fills every form field with your personal data, and submits applications automatically — both **Easy Apply** and, as of **v2**, offers that redirect to an external company site or ATS (Greenhouse, Lever, Workday, etc.), using the Claude for Chrome extension to fill the external form, attach your CV/photo, and submit. It only pauses to ask you when a site requires creating a mandatory account. At the end of each session it writes every application to your Notion database.

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
- Claude for Chrome extension (required for external/off-LinkedIn applications in v2)
- **Claude Desktop app open and connected** on the machine you're applying from — required whenever a step needs your local files (CV, photo), even though the session itself runs from the web/mobile chat
- Notion account (free tier)
- Vercel account (free tier, optional — for browser deployment)

### Quick start

```
1. Paste skill/setup.md into a Claude conversation
2. Answer the questions (5–10 min)
3. Claude creates your Notion database and connects everything automatically
4. Save your personalized skill file
5. Open Claude Desktop and make sure the Chrome connection is on
6. Run /linkedin-easy-apply and start applying
```

Full guide: [SETUP.md](./SETUP.md)

### Current limitations

As of **v2**, this skill applies both to **LinkedIn Easy Apply** offers and to offers that redirect to an **external company site or ATS** (Greenhouse, Lever, Workday, etc.), using the Claude for Chrome extension. On external sites, the whole flow (form filling, CV/photo upload, cover letter, submission) is automatic and **the session never stops mid-flow** — not even for mandatory account registration.

Offers that hit a blocker the skill can't reliably solve on its own — a required account signup, an unsolvable CAPTCHA, SMS/phone verification, unusual document uploads, a broken form — aren't skipped silently or asked about in real time. They're logged during the session and listed in a dedicated **"Pending manual applications"** section of the end-of-session summary document, with title, company, and direct URL, so you can review them all at once and finish them yourself. Each successfully submitted application is also tagged with its `Tipo` (Easy Apply / Externa) and `Plataforma` (LinkedIn, Greenhouse, Lever, Workday...) so you can filter by it in the dashboard.

### Roadmap & contributions

This project is actively maintained and will keep improving. Planned areas:

- Smarter filtering and scoring of offers
- Follow-up reminders and recruiter tracking automation
- Deeper per-ATS refinement for known quirks (e.g. Workday's multi-page flows, Greenhouse custom questions) — basic support for these platforms shipped in v2, this is about handling their edge cases better

**Feedback and improvement proposals are welcome.** If you've used this and have ideas, found a bug, or want to suggest a feature:

- Open an [issue on GitHub](https://github.com/bjlopez16/linkedin-job-tracker/issues)
- Or reach out directly: [bjlopez.designer@gmail.com](mailto:bjlopez.designer@gmail.com)

This skill will keep evolving with real-world usage. If you find it useful, starring the repo helps others discover it. ⭐

---

<a name="español"></a>

## 🇪🇸 Español

### Qué hace

1. **Skill** — Dale a Claude control de tu navegador. Busca en LinkedIn, filtra las ofertas que no encajan, rellena todos los campos del formulario con tus datos personales y envía las solicitudes automáticamente — tanto de **Easy Apply** como, desde la **v2**, ofertas que redirigen a la web de la empresa o a un ATS externo (Greenhouse, Lever, Workday, etc.), usando la extensión Claude for Chrome para rellenar el formulario externo, adjuntar tu CV/foto y enviarlo. Solo se detiene a preguntarte cuando una web exige crear una cuenta obligatoria. Al terminar cada sesión, escribe todas las aplicaciones en tu base de datos de Notion.

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
- Extensión Claude for Chrome (imprescindible para aplicaciones externas/fuera de LinkedIn en v2)
- **Claude Desktop abierto y conectado** en el equipo desde el que apliques — necesario siempre que un paso requiera tus archivos locales (CV, foto), aunque la sesión en sí se lleve desde el chat web/móvil
- Cuenta de Notion (plan gratuito funciona)
- Cuenta de Vercel (gratuito, opcional — para acceso desde el navegador)

### Inicio rápido

```
1. Pega skill/setup.md en una conversación de Claude
2. Responde las preguntas (5–10 min)
3. Claude crea tu base de datos en Notion y lo conecta todo automáticamente
4. Guarda tu archivo de skill personalizado
5. Abre Claude Desktop y comprueba que la conexión con Chrome está activa
6. Ejecuta /linkedin-easy-apply y empieza a aplicar
```

Guía completa: [SETUP.md](./SETUP.md)

### Limitaciones actuales

Desde la **v2**, esta skill aplica tanto a ofertas de **LinkedIn Easy Apply** como a ofertas que redirigen a la **web de la empresa o a un ATS externo** (Greenhouse, Lever, Workday, etc.), usando la extensión Claude for Chrome. En webs externas, todo el proceso (rellenar formulario, subir CV/foto, carta de presentación, envío) es automático y **la sesión nunca se detiene a mitad de camino** — ni siquiera si hay que crear una cuenta obligatoria.

Las ofertas que se topan con un bloqueo que la skill no puede resolver de forma fiable —registro de cuenta obligatorio, un CAPTCHA sin solución, verificación por SMS/teléfono, documentos poco habituales, un formulario roto— no se descartan en silencio ni se preguntan en tiempo real. Quedan registradas durante la sesión y aparecen en un apartado propio, **"Pendientes de aplicación manual"**, dentro del documento de resumen final, con título, empresa y URL directa, para que las revises todas juntas al terminar y las completes tú mismo. Cada aplicación enviada con éxito queda además etiquetada con su `Tipo` (Easy Apply / Externa) y `Plataforma` (LinkedIn, Greenhouse, Lever, Workday...) para poder filtrarlas en el dashboard.

### Roadmap y contribuciones

Este proyecto se mantiene activamente y seguirá mejorando. Áreas previstas:

- Filtrado y puntuación inteligente de ofertas
- Recordatorios de seguimiento y automatización del contacto con reclutadores
- Refinamiento por ATS para casos particulares (flujos multi-página de Workday, preguntas personalizadas de Greenhouse...) — el soporte base para estas plataformas ya se implementó en v2, esto es sobre pulir sus casos límite

**Se aceptan propuestas de mejora y feedback.** Si has usado esta herramienta y tienes ideas, has encontrado un error o quieres sugerir una funcionalidad:

- Abre un [issue en GitHub](https://github.com/bjlopez16/linkedin-job-tracker/issues)
- O contáctame directamente: [bjlopez.designer@gmail.com](mailto:bjlopez.designer@gmail.com)

Esta skill seguirá evolucionando con el uso real. Si te resulta útil, dar una estrella al repo ayuda a que otros la descubran. ⭐

---

## Created by

**Borja López** — UX/UI Designer & Product Builder.

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
