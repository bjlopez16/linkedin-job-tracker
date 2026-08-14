# Setup Guide

Complete step-by-step guide to get LinkedIn Job Tracker running from scratch.

---

## Prerequisites

Before starting, make sure you have:

- [ ] A **Claude Pro** account at claude.ai
- [ ] The **Claude for Chrome** extension installed in your browser
- [ ] A **Notion** account (free tier works fine)
- [ ] A **Vercel** account (free hobby tier works fine)
- [ ] Your CV uploaded to LinkedIn already
- [ ] Node.js 18+ installed locally

---

## Step 1 — Run the onboarding skill

The onboarding skill collects your personal data and generates a customized version of the application skill so Claude can fill LinkedIn forms with your information automatically.

1. Open a new Claude conversation at [claude.ai](https://claude.ai)
2. Paste the full contents of `skill/setup.md` into the chat
3. Claude will ask you questions about yourself — answer each one
4. At the end, Claude will output your personalized `linkedin-easy-apply.md` file
5. Save that file — you'll use it in Step 2

The onboarding covers:
- Your name, email, and phone number
- Your portfolio URL
- Your location (city/country)
- Years of experience per discipline
- Salary expectations
- Notice period / availability
- CV filenames per language
- Target countries and job titles
- Languages to accept or skip

---

## Step 2 — Install the personalized skill

### Option A — Use it directly in Claude chat (simplest)

Every time you want to run a job application session:
1. Open a new Claude conversation with browser access (Claude for Chrome)
2. Paste your personalized `linkedin-easy-apply.md` at the start of the conversation
3. Type: "Empieza la sesión" or "Start session"

### Option B — Save it as a Claude skill (recommended)

If Claude supports custom skills in your account:
1. Go to **Settings → Skills** in Claude
2. Create a new skill
3. Paste the contents of your personalized `linkedin-easy-apply.md`
4. Name it `linkedin-easy-apply`
5. From now on, just type `/linkedin-easy-apply` to trigger it

---

## Step 3 — Notion setup

### 3a. Create a Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New connection**
3. Name it `Job Tracker`
4. Select **Token de acceso** (internal integration)
5. Enable capabilities: ✅ Read, ✅ Update, ✅ Insert
6. Click **Create connection**
7. Copy the token — it looks like `ntn_xxxxx...`

### 3b. Create the Notion database

Use this SQL schema with Claude's Notion MCP (if you have it connected), or create it manually:

**Database name:** `Job Tracker`

| Property name | Type | Options |
|---------------|------|---------|
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

> **Important:** The URL property must be named exactly `userDefined:URL` — this is how Notion's internal API identifies custom URL properties.

### 3c. Connect your integration to the database

1. Open your new database in Notion
2. Click `···` (top right) → **Connections**
3. Search for `Job Tracker` and click it
4. Confirm — the integration now has access

### 3d. Copy the database ID

The database ID is the 32-character string in the database URL:  
`https://notion.so/YOUR-WORKSPACE/`**`34520bfe...`**`?v=...`

Add this to your skill file where indicated: `NOTION_DATABASE_ID`.

---

## Step 4 — Deploy the dashboard

### 4a. Push to GitHub

```bash
cd dashboard
git init
git add .
git commit -m "initial commit"
# Create a GitHub repo and push
git remote add origin https://github.com/yourusername/job-tracker-dashboard
git push -u origin main
```

### 4b. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Vite — no configuration needed
4. Before deploying, add environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NOTION_TOKEN` | `ntn_xxxxx...` | From Step 3a |
| `VITE_APP_PASSWORD` | Any password you choose | To protect your dashboard |

5. Click **Deploy**

Your dashboard will be live at `https://your-project.vercel.app`

---

## Step 5 — Update your skill with Notion details

Open your personalized skill file and fill in the Notion section:

```
database_id: YOUR_DATABASE_ID_HERE
```

This tells the skill where to write applications at the end of each session.

---

## Step 6 — First application session

1. Open a new Claude chat with Claude for Chrome connected
2. Trigger your skill (`/linkedin-easy-apply` or paste the file)
3. Claude will ask: what modality? which countries? any specific terms?
4. Confirm and watch it work
5. When you're done, say "Para aquí" or "Terminar sesión"
6. Claude will write everything to Notion and confirm
7. Open your dashboard → **Sync from Notion** → your applications appear

---

## Troubleshooting

**Sync returns Error 500**  
→ Check that `NOTION_TOKEN` is set in Vercel environment variables and the integration has access to the database (Step 3c).

**Claude can't find the Easy Apply button**  
→ Make sure you're using Claude for Chrome with browser access enabled, not the regular Claude chat.

**Applications not appearing in dashboard after sync**  
→ Check that the database ID in your skill matches the one in `dashboard/api/notion.js`.

**Wrong CV being uploaded**  
→ Make sure your CVs are already uploaded to LinkedIn. Claude selects between them by name — update the filenames in your skill config.

---

## Updating your personal data

If anything changes (new salary expectation, new portfolio URL, new phone number), simply edit your personalized `linkedin-easy-apply.md` file and update the relevant fields. No need to re-run the onboarding.
