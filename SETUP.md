🇬🇧 [English](#english-setup) · 🇪🇸 [Español](#español-configuración)

---

<a name="english-setup"></a>

# 🇬🇧 Setup Guide

Complete step-by-step guide to get LinkedIn Job Tracker running from scratch.

## Prerequisites

Before starting, make sure you have:

- [ ] A **Claude Pro** account at claude.ai
- [ ] The **Claude for Chrome** extension installed
- [ ] A **Notion** account (free tier works)
- [ ] A **Vercel** account (free hobby tier, only if you want browser deployment)
- [ ] Your CV uploaded to LinkedIn
- [ ] Node.js 18+ installed locally (only for Vercel deployment)

---

## Step 1 — Run the onboarding skill

The onboarding skill collects your personal data, creates your Notion database automatically, connects the integration via your browser, and delivers a ready-to-use personalized skill + dashboard.

1. Open a new Claude conversation at [claude.ai](https://claude.ai)
2. Paste the full contents of `skill/setup.md` into the chat
3. Type: **"Start setup"**
4. Answer each question Claude asks — one at a time
5. At the end you'll receive:
   - Your personalized `linkedin-easy-apply.md` skill file
   - A live dashboard artifact (works immediately inside Claude)

**What the onboarding covers:**
- Name, email, phone number, portfolio URL
- Location and work authorization
- Years of experience and salary expectations
- Notice period / availability
- CV filenames per language
- Target job titles and countries
- Modality preference (remote / hybrid)
- Seniority filters and language filters
- Notion database creation (automated)
- Integration connection via Chrome (automated)

---

## Step 2 — Save your personalized skill

### Option A — Use directly in Claude chat (simplest)

Each time you want to run a job session:
1. Open a new Claude conversation with Claude for Chrome connected
2. Paste your personalized `linkedin-easy-apply.md` at the start
3. Type: "Start session" or "Empieza la sesión"

### Option B — Save as a Claude skill (recommended)

If Claude supports custom skills in your account:
1. Go to **Settings → Skills**
2. Create a new skill
3. Paste the contents of your personalized skill file
4. Name it `linkedin-easy-apply`
5. From now on, just type `/linkedin-easy-apply` to trigger it

---

## Step 3 — Notion setup (if not done automatically)

If the onboarding couldn't create the Notion database automatically, follow these steps:

### 3a. Create a Notion integration token

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New connection**
3. Name it `Job Tracker`
4. Select **Token de acceso** (internal integration)
5. Enable: ✅ Read ✅ Update ✅ Insert
6. Click **Create connection**
7. Copy the token (`ntn_xxxxx...`)

### 3b. Create the database

Use Claude with Notion MCP connected, or create it manually:

**Database name:** `Job Tracker`

| Property | Type | Options |
|----------|------|---------|
| `Título` | Title | — |
| `Empresa` | Rich text | — |
| `Estado` | Select | Enviada, Vista, Contactada, Entrevista, Oferta, Rechazada, Cancelada |
| `País` | Select | NL, ES, UK, US, Global |
| `Fecha` | Date | — |
| `userDefined:URL` | URL | — |
| `Reclutador` | Rich text | — |
| `Sesión` | Rich text | — |
| `Resumen` | Rich text | — |
| `Requisitos` | Rich text | — |
| `Beneficios` | Rich text | — |
| `Rating` | Number | — |
| `Notas` | Rich text | — |

> ⚠️ The URL property must be named exactly `userDefined:URL`

### 3c. Connect integration to the database

1. Open your database in Notion
2. Click `···` (top right) → **Connections**
3. Search for `Job Tracker` → click it → Confirm

### 3d. Copy the database ID

The database ID is the 32-character string in the URL:
`https://notion.so/YOUR-WORKSPACE/`**`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`?v=...`

Add it to your skill file where indicated.

---

## Step 4 — Deploy the dashboard to Vercel (optional)

The dashboard already works inside Claude as an artifact. Deploy to Vercel only if you want to access it from any browser without opening Claude.

### 4a. Push to GitHub

```bash
cd dashboard
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/yourusername/job-tracker-dashboard
git push -u origin main
```

### 4b. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
2. Vercel auto-detects Vite — no extra configuration needed
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `NOTION_TOKEN` | `ntn_xxxxx...` |
| `NOTION_DATABASE_ID` | Your 32-char database ID |
| `VITE_APP_PASSWORD` | Any password you choose |

4. Click **Deploy**

---

## Step 5 — First session

1. Open a new Claude chat with Claude for Chrome connected
2. Trigger your skill (`/linkedin-easy-apply` or paste the file)
3. Claude will ask: modality? countries? specific keywords?
4. Confirm and watch it work
5. When done: "Para aquí" or "Terminar sesión"
6. Claude writes everything to Notion and confirms
7. Open your dashboard → **Sync from Notion** → applications appear

---

## Troubleshooting

**Sync returns Error 500**
→ Check `NOTION_TOKEN` and `NOTION_DATABASE_ID` are set in Vercel, and the integration has access to the database.

**Claude can't find the Easy Apply button**
→ Make sure you're using Claude for Chrome with browser access enabled.

**Wrong CV being uploaded**
→ Make sure your CVs are already uploaded to LinkedIn. Update filenames in your skill config.

**Applications not appearing after sync**
→ Verify the database ID in your skill matches the one in `dashboard/api/notion.js`.

---

<a name="español-configuración"></a>

# 🇪🇸 Guía de configuración

Guía completa paso a paso para poner en marcha LinkedIn Job Tracker desde cero.

## Requisitos previos

Antes de empezar, asegúrate de tener:

- [ ] Una cuenta **Claude Pro** en claude.ai
- [ ] La extensión **Claude for Chrome** instalada
- [ ] Una cuenta de **Notion** (el plan gratuito funciona)
- [ ] Una cuenta de **Vercel** (plan gratuito, solo si quieres desplegar en el navegador)
- [ ] Tu CV subido a LinkedIn
- [ ] Node.js 18+ instalado (solo para el despliegue en Vercel)

---

## Paso 1 — Ejecutar la skill de onboarding

La skill de onboarding recopila tus datos personales, crea tu base de datos de Notion automáticamente, conecta la integración a través de tu navegador y entrega una skill personalizada + un dashboard listo para usar.

1. Abre una nueva conversación en [claude.ai](https://claude.ai)
2. Pega el contenido completo de `skill/setup.md` en el chat
3. Escribe: **"Empieza el setup"** o **"Start setup"**
4. Responde las preguntas que te haga Claude — una a una
5. Al final recibirás:
   - Tu archivo de skill personalizado `linkedin-easy-apply.md`
   - Un dashboard listo para usar como artifact de Claude

**Qué cubre el onboarding:**
- Nombre, email, teléfono, portfolio
- Ubicación y autorización de trabajo
- Años de experiencia y salario esperado
- Disponibilidad / preaviso
- Nombres de los archivos de CV por idioma
- Títulos de trabajo y países objetivo
- Preferencia de modalidad (remoto / híbrido)
- Filtros de seniority y de idioma
- Creación de base de datos en Notion (automático)
- Conexión de la integración vía Chrome (automático)

---

## Paso 2 — Guardar tu skill personalizada

### Opción A — Usarla directamente en el chat de Claude (más simple)

Cada vez que quieras hacer una sesión de aplicaciones:
1. Abre una nueva conversación con Claude for Chrome conectado
2. Pega tu `linkedin-easy-apply.md` personalizado al inicio
3. Escribe: "Empieza la sesión" o "Start session"

### Opción B — Guardarla como skill de Claude (recomendado)

Si Claude soporta skills personalizadas en tu cuenta:
1. Ve a **Configuración → Skills**
2. Crea una nueva skill
3. Pega el contenido de tu archivo de skill personalizado
4. Nómbrala `linkedin-easy-apply`
5. A partir de ahora, escribe `/linkedin-easy-apply` para activarla

---

## Paso 3 — Configuración de Notion (si no se hizo automáticamente)

Si el onboarding no pudo crear la base de datos de Notion automáticamente, sigue estos pasos:

### 3a. Crear un token de integración de Notion

1. Ve a [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Haz clic en **+ Nueva conexión**
3. Nómbrala `Job Tracker`
4. Selecciona **Token de acceso** (integración interna)
5. Activa: ✅ Leer ✅ Actualizar ✅ Insertar
6. Haz clic en **Crear conexión**
7. Copia el token (`ntn_xxxxx...`)

### 3b. Crear la base de datos

Usa Claude con Notion MCP conectado, o créala manualmente:

**Nombre de la base de datos:** `Job Tracker`

| Propiedad | Tipo | Opciones |
|-----------|------|----------|
| `Título` | Título | — |
| `Empresa` | Texto enriquecido | — |
| `Estado` | Selección | Enviada, Vista, Contactada, Entrevista, Oferta, Rechazada, Cancelada |
| `País` | Selección | NL, ES, UK, US, Global |
| `Fecha` | Fecha | — |
| `userDefined:URL` | URL | — |
| `Reclutador` | Texto enriquecido | — |
| `Sesión` | Texto enriquecido | — |
| `Resumen` | Texto enriquecido | — |
| `Requisitos` | Texto enriquecido | — |
| `Beneficios` | Texto enriquecido | — |
| `Rating` | Número | — |
| `Notas` | Texto enriquecido | — |

> ⚠️ La propiedad URL debe llamarse exactamente `userDefined:URL`

### 3c. Conectar la integración a la base de datos

1. Abre tu base de datos en Notion
2. Haz clic en `···` (arriba a la derecha) → **Conexiones**
3. Busca `Job Tracker` → haz clic → Confirmar

### 3d. Copiar el ID de la base de datos

El ID es la cadena de 32 caracteres en la URL:
`https://notion.so/TU-WORKSPACE/`**`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`?v=...`

Añádelo en tu skill donde se indica.

---

## Paso 4 — Desplegar el dashboard en Vercel (opcional)

El dashboard ya funciona dentro de Claude como artifact. Despliega en Vercel solo si quieres acceder desde cualquier navegador sin abrir Claude.

### 4a. Subir a GitHub

```bash
cd dashboard
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/tuusuario/job-tracker-dashboard
git push -u origin main
```

### 4b. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new) → importa tu repo
2. Vercel detecta Vite automáticamente — no hace falta configurar nada
3. Añade las variables de entorno:

| Variable | Valor |
|----------|-------|
| `NOTION_TOKEN` | `ntn_xxxxx...` |
| `NOTION_DATABASE_ID` | Tu ID de 32 caracteres |
| `VITE_APP_PASSWORD` | La contraseña que elijas |

4. Haz clic en **Deploy**

---

## Paso 5 — Primera sesión

1. Abre un chat de Claude con Claude for Chrome conectado
2. Activa tu skill (`/linkedin-easy-apply` o pega el archivo)
3. Claude preguntará: ¿modalidad? ¿países? ¿palabras clave específicas?
4. Confirma y deja que funcione
5. Cuando termines: "Para aquí" o "Terminar sesión"
6. Claude escribe todo en Notion y confirma
7. Abre tu dashboard → **Sync desde Notion** → aparecen todas las aplicaciones

---

## Resolución de problemas

**El Sync devuelve Error 500**
→ Comprueba que `NOTION_TOKEN` y `NOTION_DATABASE_ID` estén configurados en Vercel y que la integración tenga acceso a la base de datos.

**Claude no encuentra el botón Easy Apply**
→ Asegúrate de estar usando Claude for Chrome con acceso al navegador activado.

**Se sube el CV equivocado**
→ Verifica que tus CVs estén subidos a LinkedIn. Actualiza los nombres de archivo en tu skill.

**Las aplicaciones no aparecen tras el sync**
→ Verifica que el ID de base de datos en tu skill coincide con el de `dashboard/api/notion.js`.
