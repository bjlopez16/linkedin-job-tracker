# LinkedIn Job Tracker

**Automated job application system powered by Claude AI.**  
Apply to dozens of LinkedIn jobs hands-free, track every application in a dashboard, and sync everything to Notion — all in one workflow.

---

## What it does

1. **Skill** — Give Claude control of your browser. It searches LinkedIn, filters out irrelevant offers, fills every form field with your personal data, and submits applications automatically. At the end of each session it writes every application to your Notion database.

2. **Dashboard** — A password-protected web app (deployed on Vercel) that syncs from Notion and lets you manage your entire pipeline: change statuses, add notes, rate opportunities, track recruiters, and see the full history of every application.

---

## How it works

```
/linkedin-easy-apply  →  Claude opens LinkedIn in your browser
                      →  Searches with your filters (remote, country, seniority)
                      →  Skips ineligible offers automatically
                      →  Fills every form field with your data
                      →  Submits applications
                      →  Writes to Notion at end of session
                              ↓
                      Dashboard  →  Sync from Notion
                                 →  Manage statuses & notes
                                 →  Track recruiters
                                 →  Export back to Notion
```

---

## Components

| Component | What it is |
|-----------|-----------|
| `skill/linkedin-easy-apply.md` | The main automation skill — runs inside Claude with browser access |
| `skill/setup.md` | One-time onboarding skill — asks for your personal data and generates your personalized skill |
| `dashboard/` | Vite + React app — deploy to Vercel in minutes |

---

## Requirements

- **Claude Pro** subscription (for extended thinking + browser use via Claude for Chrome)
- **Claude for Chrome** extension installed and connected
- **Notion** account (free tier is enough)
- **Vercel** account (free hobby tier is enough)
- A LinkedIn account with your CV already uploaded

---

## Quick start

### 1. Clone this repo

```bash
git clone https://github.com/yourusername/linkedin-job-tracker
cd linkedin-job-tracker
```

### 2. Run the onboarding skill

Open a new Claude conversation and paste the contents of `skill/setup.md`.  
Claude will ask you a series of questions and generate your personalized `linkedin-easy-apply.md` skill.

### 3. Install the personalized skill

Save the generated skill file to Claude's skill directory or use it directly in chat.

### 4. Set up Notion

Follow the steps in [SETUP.md → Notion](./SETUP.md#notion-setup) to create your database and integration token.

### 5. Deploy the dashboard

```bash
cd dashboard
npm install
```

Then deploy to Vercel:

```bash
npx vercel
```

Add these environment variables in Vercel's dashboard:

| Variable | Value |
|----------|-------|
| `NOTION_TOKEN` | Your Notion integration token (`ntn_...`) |
| `VITE_APP_PASSWORD` | The password you want for the dashboard |

### 6. Start applying

Open Claude for Chrome, start a new conversation, and type:

```
/linkedin-easy-apply
```

Claude will ask for your preferences (remote/hybrid, countries, keywords) and get to work.

---

## Skill configuration

The skill is fully configurable. See `skill/linkedin-easy-apply.md` for all options:

- **Target countries** — Which regions to search (NL, ES, UK, US, Global, or a combination)
- **Modality** — Remote only, hybrid, or both
- **Seniority rules** — Define which titles to skip (Senior, Lead, Director, etc.)
- **Language filters** — Skip offers written in languages you don't speak
- **Search terms** — Rotate between job titles to maximize coverage
- **Form data** — Your name, email, phone, portfolio, salary expectation, etc.
- **CV selection** — Different CVs per language (e.g. English CV for English offers)

---

## Dashboard features

- **Sync from Notion** — Pull new applications automatically after each session
- **Status management** — Enviada → Vista → Contactada → Entrevista → Oferta / Rechazada
- **Notes** — Add context to each application (interview prep, red flags, etc.)
- **Recruiter tracking** — Know who to follow up with
- **Star ratings** — Prioritize your best opportunities
- **Change history** — Full audit trail of every status change
- **Export to Notion** — Push updates back to Notion at any time
- **Manual add** — Add applications you made outside the skill
- **Filters** — Filter by status, country, minimum rating, or search text

---

## License

MIT — use it, fork it, sell it.

If you build something cool with this, a mention would be appreciated.
