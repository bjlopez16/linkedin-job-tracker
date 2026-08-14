---
name: linkedin-tracker-setup
description: >
  Complete onboarding for LinkedIn Job Tracker. Collects personal data, creates the
  Notion database automatically, connects the integration via the browser, and delivers
  a ready-to-use personalized skill + live dashboard artifact. Run this once.
  Trigger with: "set up job tracker", "configurar job tracker", "setup linkedin tracker".
---

# LinkedIn Job Tracker — Complete Setup

You are running the **LinkedIn Job Tracker onboarding**. Your job is to guide the user through the entire setup in one conversation, automating as much as possible.

By the end of this session the user will have:
1. A personalized `linkedin-easy-apply.md` skill ready to use
2. A live dashboard artifact (usable immediately inside Claude)
3. Optionally: Notion integration fully configured and connected

---

## PHASE 0 — Welcome & overview

Start by greeting the user and explaining what's about to happen. Be brief and clear:

```
👋 Welcome to LinkedIn Job Tracker setup.

I'm going to guide you through everything in one session. Here's what we'll do:

1. Collect your personal info (name, email, CV, etc.)
2. Configure your job search preferences
3. Set up Notion to track your applications (optional but recommended)
4. Generate your personalized skill and a live dashboard

The whole thing takes about 5–10 minutes. Let's start.
```

Then immediately ask the first question. **Ask questions one at a time** — never dump a list. Wait for each answer before asking the next.

---

## PHASE 1 — Personal data (ask one at a time)

Ask these in order. Store every answer internally.

### 1.1 — Basic contact info

```
What's your full name? (exactly as it appears on your CV)
```

```
What email address should appear on job applications?
```

```
What's your phone number, including country code?
For example: +34 628 000 000 or +31 6 12345678
```

```
What country is your phone number registered in?
This matters because LinkedIn often defaults to the wrong country code.
(e.g. Spain → +34, Netherlands → +31, UK → +44)
```

```
What city and country should appear as your location in application forms?
(e.g. "Amsterdam, Netherlands" or "The Netherlands")
```

### 1.2 — Professional links

```
Do you have a portfolio website? If yes, paste the URL.
If not, just say "none".
```

```
What's your LinkedIn profile URL? (optional — press Enter to skip)
```

### 1.3 — Experience & salary

```
How many years of professional experience do you have in your main field?
(Enter a number, e.g. 2)
```

```
What's your expected annual salary?
Include the currency. For example: 45000 EUR, 70000 GBP, 80000 USD
```

```
Approximate monthly equivalent in USD? (some forms ask in this format)
```

```
What's your notice period / availability?
For example: "Immediate", "2 weeks", "1 month"
```

### 1.4 — CV files

```
What are the exact filenames of your CV files as they appear on LinkedIn?

If you have different versions per language, list them like this:
  English: My CV English.pdf
  Spanish: My CV Spanish.pdf

If you only have one, just give me that filename.
```

---

## PHASE 2 — Job search preferences (ask one at a time)

### 2.1 — Job titles

```
What job titles are you targeting? List them separated by commas.
For example: UX Designer, Product Designer, UI Designer, Visual Designer
```

### 2.2 — Countries

```
Which countries do you want to search by default?
Options: Netherlands (NL), Spain (ES), United Kingdom (UK), United States (US), 
Germany (DE), France (FR), Belgium (BE), Global (no country filter)

You can choose multiple. For example: "NL and ES" or "NL, ES, and Global"
```

### 2.3 — Modality

```
What work modality are you looking for?
  1. Remote only (recommended)
  2. Hybrid only
  3. Both remote and hybrid
```

### 2.4 — Seniority filter

```
Should I automatically skip offers that contain these words in the title?
  Senior, Sr., Principal, Director, Head of, Lead, Staff, VP

Reply "yes" to skip them, or tell me which ones to keep.
```

### 2.5 — Languages

```
What languages should the job offer be written in for me to apply?
For example: "English only" or "English and Spanish"
Offers written only in other languages will be skipped.
```

---

## PHASE 3 — Notion setup

Now ask:

```
Do you want to connect Notion to track your applications?

With Notion connected, every application session will be saved automatically
to a database, and your dashboard can sync from it from any device.

Without Notion, the dashboard still works but data is stored only locally in your browser.

→ Type "yes" to set up Notion, or "skip" to continue without it.
```

### If user says YES → Run Notion setup flow

#### Step A — Check if Notion MCP is available

Check your available tools. If `notion-create-database` or similar Notion tools are available, proceed automatically. If not, explain:

```
I don't see Notion connected to this conversation. To connect it:

1. Go to Claude Settings → Integrations
2. Connect your Notion account
3. Come back to this conversation and say "continue"

Or if you prefer to set up Notion manually, I can give you the database schema.
```

If Notion tools ARE available, continue:

#### Step B — Create the Notion integration token (manual — cannot be automated)

```
Almost there. I need you to create a Notion integration token.
This is the one step I can't do for you — Notion requires you to authorize it manually.

1. Open this link: https://www.notion.so/my-integrations
2. Click "+ New connection"
3. Name it "Job Tracker"
4. Leave "Token de acceso" selected
5. Make sure these capabilities are checked: ✅ Read ✅ Update ✅ Insert
6. Click "Create connection"
7. Copy the token (it starts with ntn_...)

Paste your token here when you have it.
```

Wait for the token. When received, store it as `NOTION_TOKEN`.

#### Step C — Create the Notion database (automated via MCP)

Use `notion-create-database` with this exact schema:

```
Title: "Job Tracker"
Schema:
  Título (title)
  Empresa (rich_text)
  Estado (select): Enviada, Vista, Contactada, Entrevista, Oferta, Rechazada, Cancelada
  País (select): NL, ES, UK, US, Global
  Fecha (date)
  userDefined:URL (url)
  Reclutador (rich_text)
  Sesión (rich_text)
  Resumen (rich_text)
  Requisitos (rich_text)
  Beneficios (rich_text)
  Rating (number)
  Notas (rich_text)
```

After creating, extract and store the `database_id` from the result.

Then use `notion-create-view` to add a Kanban view grouped by Estado:
```
name: "Pipeline"
type: board
group by: Estado
```

Confirm to the user:
```
✓ Notion database created: "Job Tracker"
✓ Pipeline (Kanban) view added
```

#### Step D — Connect the integration to the database (automated via Chrome)

Use Claude for Chrome to:

1. Navigate to the database URL (use the URL from step C)
2. Click `···` (top right of the page)
3. Click `Connections` → search for `Job Tracker`
4. Click the integration → click `Confirm` or `Add to page`

After doing this, confirm:
```
✓ Integration connected to the database
  Your applications will be written here at the end of every session.
```

If Chrome is not available, show manual instructions:
```
One more step — open your database in Notion and:
1. Click ··· (top right)
2. Click Connections → search "Job Tracker"
3. Click it → Confirm

Do this and then say "done".
```

### If user says SKIP → Continue without Notion

Note internally: `NOTION_ENABLED = false`. The dashboard will use localStorage only.

---

## PHASE 4 — Generate outputs

Now generate everything the user needs.

### Output A — Personalized skill file

Generate the complete `linkedin-easy-apply.md` with all placeholders replaced by the user's actual answers.

Present it inside a code block with this header:
```
📄 Your personalized skill — save this as linkedin-easy-apply.md
```

Use this template (fill in ALL placeholders):

```markdown
---
name: linkedin-easy-apply
description: >
  Automates LinkedIn Easy Apply for [NAME]. Searches, filters, fills forms,
  and syncs to Notion at session end. Trigger: "apply to jobs", "start session",
  "busca ofertas", "aplica a trabajos".
---

# LinkedIn Easy Apply

## STEP 0 — Session start

Before searching, ask:
- Modality today? (Remote / Hybrid / Both)
- Countries/regions? (default: [DEFAULT_COUNTRIES])
- Any specific keyword?

---

## Candidate profile

| Field | Value |
|-------|-------|
| Name | [NAME] |
| Email | [EMAIL] |
| Phone | [PHONE] |
| Country code | [COUNTRY_CODE] — ALWAYS select this, never leave default |
| Location | [LOCATION] |
| Portfolio | [PORTFOLIO] |
| Availability | [AVAILABILITY] |

---

## Search

**Job titles to rotate:**
[JOB_TITLES — one per line with bullet]

**URL filters:** `f_AL=true` (Easy Apply) + `f_WT=2` (remote) or `f_WT=3` (hybrid)

**GeoIDs:**
| Country | GeoId |
|---------|-------|
| Netherlands | 102890719 |
| Spain | 105646813 |
| United Kingdom | 101165590 |
| United States | 103644278 |
| Germany | 101282230 |
| France | 105015875 |
| Belgium | 100565514 |

---

## Skip if

- Title contains: [SENIORITY_LIST]
- Written only in: [SKIP_LANGUAGES]
- Requires legal authorization to work in US or UK (if form asks)
- UK/US-only remote (must be based there)

---

## Form fields

| Field | Value |
|-------|-------|
| Full name | [NAME] |
| Email | [EMAIL] |
| Phone | [PHONE] |
| Country code | [COUNTRY_CODE] — always change |
| Location | [LOCATION] |
| Portfolio | [PORTFOLIO] |
| Years of experience | [EXPERIENCE_YEARS] |
| Expected salary (annual) | [SALARY_ANNUAL] |
| Expected salary (monthly USD) | [SALARY_MONTHLY_USD] |
| Notice period | [AVAILABILITY] |
| Visa sponsorship required? | No |
| Authorized to work? | Yes |

**CV selection:**
[CV_TABLE — language | filename]

---

## Track during session

After each application, record:
```json
{
  "titulo": "...", "empresa": "...", "ubicacion": "...",
  "contacto_reclutador": "...", "url": "...", "estado": "Enviada",
  "resumen_puesto": "...", "requisitos_clave": ["..."], "beneficios": "..."
}
```

---

## Session close

**1. Generate** `applications_[YYYY-MM-DD].md` → send with `SendUserFile`

**2. Write to Notion** using `notion-create-pages`:
- Parent: `{"database_id": "[DATABASE_ID]", "type": "database_id"}`

| Property | Value |
|----------|-------|
| Título | Job title |
| Empresa | Company |
| Estado | "Enviada" |
| País | NL / ES / UK / US / Global (use Global for any other country) |
| Fecha | Today YYYY-MM-DD |
| userDefined:URL | LinkedIn job URL ⚠️ exact name |
| Reclutador | Name or "Not visible" |
| Sesión | Session date YYYY-MM-DD |
| Resumen | 2-3 sentence summary |
| Requisitos | Requirements joined with ", " |
| Beneficios | Benefits or "" |
| Rating | 0 |
| Notas | "" |

**3. Confirm:** `✓ [N] applications saved to Notion — open dashboard and press Sync`

**4. Fallback** (if Notion fails):
```json
{
  "sesion_id": "YYYY-MM-DD",
  "aplicaciones": [{ "titulo": "...", "empresa": "...", ... }]
}
```

---

## Rules (never break)

1. Easy Apply button must exist — otherwise skip
2. Always change phone country code to [COUNTRY_CODE]
3. Always uncheck "Follow company" before submitting
4. Correct CV per language
5. Skip if work authorization form appears for US/UK
```

### Output B — Dashboard artifact

Generate a ready-to-use React dashboard artifact using the code in `dashboard-artifact-template.jsx` (in this same `skill/` folder).

Before generating the artifact:
1. Replace `[CANDIDATE_NAME]` with the user's actual name
2. Replace `[NOTION_DB_ID]` with the actual Notion database ID (if Notion was set up), or leave as `''` if skipped

The template already includes:
- `window.storage` for Claude artifact persistence
- Notion sync/export via Anthropic API + Notion MCP
- Full dashboard UI (warm off-white light mode, teal+amber palette)
- All status management, notes, ratings, history, recruiter tracking

Output the artifact as a `.jsx` file with this header before the code block:
```
🚀 Your dashboard — it opens immediately. Data persists between Claude sessions.
```

After the artifact, tell the user:
```
Your dashboard is live above.
→ Press "🔄 Sync desde Notion" to import your applications
→ Data is saved automatically between sessions
→ To also access it from any browser: deploy dashboard/ to Vercel (see SETUP.md)
```

### Output C — Vercel deployment (optional prompt)

After delivering the skill and artifact, ask:

```
Your dashboard works right now inside Claude.

Do you also want to deploy it to Vercel so you can access it from any browser
without opening Claude? (yes / no / later)
```

If YES:
```
To deploy to Vercel:

1. Clone this repo: github.com/[REPO_URL]
2. cd dashboard && npm install
3. Push to GitHub
4. Import to Vercel → vercel.com/new
5. Add these environment variables:
   NOTION_TOKEN     = [NOTION_TOKEN]
   NOTION_DATABASE_ID = [DATABASE_ID]
   VITE_APP_PASSWORD  = [choose a password]
6. Deploy — done.

Your dashboard URL will be: https://your-project.vercel.app
```

---

## PHASE 5 — Wrap up

End the session with a clean summary:

```
✅ Setup complete. Here's what was configured:

Skill:
  → linkedin-easy-apply.md — personalized and ready
  → Trigger it with: "start applying" or "busca ofertas en LinkedIn"

Dashboard:
  → Live now as the artifact above (persists in Claude)
  [→ Also deployed to: https://... (if Vercel was set up)]

Notion:
  [→ Database: "Job Tracker" — ID: ...]
  [→ Integration connected — applications will sync automatically]
  [OR → Skipped — dashboard uses local storage only]

Next steps:
1. Save your linkedin-easy-apply.md skill
2. Make sure Claude for Chrome is connected
3. Upload your CVs to LinkedIn if not already done
4. Start your first session: "start applying" or "/linkedin-easy-apply"
```

---

## Notes for Claude running this skill

- **One question at a time** — never ask multiple things at once
- **Validate answers** — if something looks wrong (e.g. phone without country code), ask to confirm
- **Be flexible with formats** — "+34628000000" and "+34 628 000 000" are both fine
- **If a tool fails** — give manual instructions and continue
- **If user skips something** — use `[TO FILL IN]` as placeholder in the output
- **The skill output** — always present in a code block so user can copy easily
- **The dashboard artifact** — generate it AFTER the skill, as a separate message
