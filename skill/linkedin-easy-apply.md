---
name: linkedin-easy-apply
description: >
  Automates LinkedIn Easy Apply job applications for [CANDIDATE_NAME].
  Covers search, filtering, form-filling, tracking, and end-of-session Notion sync.
  Run setup.md first to generate your personalized version of this skill.
  Trigger with: "apply to jobs", "start session", "search LinkedIn", or similar.
---

# LinkedIn Easy Apply

> ⚠️ This is the generic template. Run `setup.md` first to generate your personalized version
> with your actual data filled in. The placeholders below must be replaced before use.

---

## STEP 0 — Session start

Before any search, ask:
- Modality today? (Remote / Hybrid / Both / No filter)
- Which countries/regions?
- Any specific keyword besides the usual ones?

---

## Candidate profile

**Name:** `[YOUR FULL NAME]`
**Email:** `[YOUR EMAIL]`
**Phone:** `[YOUR PHONE WITH COUNTRY CODE]`
**Phone country code:** `[+XX]` — always select this, never leave default
**Location (for forms):** `[YOUR CITY, COUNTRY]`
**Portfolio:** `[YOUR PORTFOLIO URL or 'none']`
**Availability:** `[Immediate / X weeks / X months]`

---

## Search configuration

### Job titles (rotate between sessions)
- `[Job title 1]`
- `[Job title 2]`
- `[Job title 3]`

### LinkedIn URL filters
- `f_AL=true` — Easy Apply only (always required)
- `f_WT=2` — Remote
- `f_WT=3` — Hybrid
- `f_WT=2,3` — Remote + Hybrid (run two searches)

### Country GeoIDs
| Country | GeoId |
|---------|-------|
| Netherlands | `102890719` |
| Spain | `105646813` |
| United Kingdom | `101165590` |
| United States | `103644278` |
| Germany | `101282230` |
| France | `105015875` |
| Belgium | `100565514` |

---

## Skip rules

Skip immediately if the offer matches ANY of these:

**By title:** contains `Senior`, `Sr.`, `Principal`, `Director`, `Head of`, `Lead`, `Staff`, `VP`
→ Edit this list to match your actual target seniority level

**By language:** offer written only in `[LANGUAGE(S) YOU DON'T SPEAK]` → skip

**By geography:** requires legal authorization to work in US or UK → skip if form asks

---

## Form field values

| Field | Value |
|-------|-------|
| Full name | `[YOUR FULL NAME]` |
| Email | `[YOUR EMAIL]` |
| Phone | `[YOUR PHONE]` |
| Country code | `[+XX]` — always change, never leave default |
| Location | `[YOUR CITY, COUNTRY]` |
| Portfolio | `[YOUR PORTFOLIO URL]` |
| Years of experience | `[N]` |
| Expected salary (annual) | `[AMOUNT CURRENCY]` |
| Expected salary (monthly USD) | `[AMOUNT]` |
| Notice period | `[Immediate / X weeks]` |
| Requires visa sponsorship? | No |
| Authorized to work? | Yes |

### CV selection
| Offer language | CV to use |
|----------------|-----------|
| English | `[English CV filename].pdf` |
| Spanish | `[Spanish CV filename].pdf` |
| Other | `[Default CV filename].pdf` |

---

## Session tracking

After each application, record immediately:

```json
{
  "titulo": "Job title",
  "empresa": "Company",
  "ubicacion": "City (modality)",
  "contacto_reclutador": "Name or Not visible",
  "url": "https://www.linkedin.com/jobs/view/XXXXXXX/",
  "estado": "Enviada",
  "resumen_puesto": "2-3 sentence summary",
  "requisitos_clave": ["req1", "req2"],
  "beneficios": "Benefits listed"
}
```

---

## Session close

When the session ends:

### 1. Summary document
Generate `applications_[YYYY-MM-DD].md` and send with `SendUserFile`.

### 2. Write to Notion
Use `notion-create-pages` with:
- **Parent:** `{"database_id": "[YOUR_NOTION_DATABASE_ID]", "type": "database_id"}`

| Notion property | Value |
|-----------------|-------|
| `Título` | Job title |
| `Empresa` | Company |
| `Estado` | `"Enviada"` |
| `País` | `NL` / `ES` / `UK` / `US` / `Global` |
| `Fecha` | Today YYYY-MM-DD |
| `userDefined:URL` | LinkedIn job URL |
| `Reclutador` | Recruiter name or `"Not visible"` |
| `Sesión` | Session date YYYY-MM-DD |
| `Resumen` | Role summary |
| `Requisitos` | Requirements joined with `", "` |
| `Beneficios` | Benefits or `""` |
| `Rating` | `0` |
| `Notas` | `""` |

Confirm: `✓ [N] applications saved to Notion — open the dashboard and press Sync`

### 3. Fallback JSON (if Notion fails)
```json
{
  "sesion_id": "YYYY-MM-DD",
  "aplicaciones": [{ "titulo": "...", "empresa": "...", ... }]
}
```

---

## Critical rules

1. Easy Apply button must be present — otherwise skip
2. Always change phone country code to your correct one
3. Always uncheck "Follow company" before submitting
4. Use the correct CV language version
5. Skip if work authorization form appears for countries where you're not eligible
