---
name: linkedin-easy-apply
description: >
  Automates LinkedIn Easy Apply job applications for [CANDIDATE_NAME], and since v2
  also applications on external company sites / ATS (Greenhouse, Lever, Workday...)
  via the Claude for Chrome extension.
  Covers search, filtering, form-filling, tracking, and end-of-session Notion sync.
  Run setup.md first to generate your personalized version of this skill.
  Trigger with: "apply to jobs", "start session", "busca ofertas", "aplica a trabajos".
---

> 🇬🇧 **English** — Generic template. Run `setup.md` first to generate your personalized version with your actual data. Replace all `[PLACEHOLDERS]` before use.
>
> 🇪🇸 **Español** — Template genérico. Ejecuta `setup.md` primero para generar tu versión personalizada con tus datos reales. Reemplaza todos los `[MARCADORES]` antes de usar.

---

# LinkedIn Easy Apply

## STEP 0 — Session start: mandatory checklist before touching the browser / Inicio de sesión: checklist obligatorio antes de tocar el navegador

🇬🇧 **Hard rule: don't open LinkedIn, run any search, or call any browser tool until the 5 points below are answered.** The message that triggers this skill ("apply to jobs", "start session"...) activates the skill — it doesn't answer the checklist for you.

For each point: **if the answer is already in the user's prompt** (they wrote it explicitly, e.g. "search remote in Spain and include external ones from my home PC"), use that and don't ask again. **If it's not there, ask it** — never assume a default, never reuse an answer from a previous session's memory, never infer it from context.

1. **Modality** — Remote / Hybrid / Onsite / Remote+Hybrid / All
2. **Countries/regions**
3. **Specific search terms**, if any, besides the usual ones
4. **External applications** — include offers off LinkedIn too? Yes / No / Easy Apply only
5. **Device** — only if point 4 is "Yes": which device is the user applying from today? (see device table in "External applications"). If point 4 is "No", skip this point.

**⚠️ Hard technical rule, no exceptions: never use the button/multiple-choice question tool (`AskUserQuestion` / `ask_user_input_v0`) for Step 0.** That tool caps out at a few questions per call, paginates across several screens ("1 of 3", "2 of 3"...), and ends the turn as soon as it's called — in practice this has repeatedly resulted in points being left unasked. To avoid this failure mode entirely, ask the first 4 points **as a single normal, numbered text message**, e.g.:

> "Before we start: 1) What modality? (remote/hybrid/onsite/both/all) 2) Which countries? 3) Any specific term besides the usual ones? 4) Include external applications too, off LinkedIn?"

The user replies to all of it in one free-text message (e.g. "remote, NL+ES, no extra terms, yes include external"). Point 5 (device) is conditional on point 4, so it's a second plain-text question, in a separate turn, right after receiving a "yes" to point 4 — still part of this same initial checklist, before any search.

**Don't move on to "Search configuration" or open any browser until all 5 points are resolved** (either answered by the user or already present in their prompt).

🇪🇸 **Regla dura: no se abre LinkedIn, no se hace ninguna búsqueda ni se llama a ninguna herramienta de navegador hasta tener respuesta a los 5 puntos de abajo.** El mensaje que activa esta skill ("aplica a trabajos", "busca ofertas"...) dispara la skill — no responde el checklist por ti.

Para cada punto: **si la respuesta ya está en el prompt del usuario** (lo escribió explícitamente, ej. "busca remoto en España e incluye externas desde mi PC de casa"), usar esa respuesta y no volver a preguntarla. **Si no está, preguntarla** — nunca asumir un valor por defecto, nunca reusar la respuesta de una sesión anterior de memoria, nunca inferirla del contexto.

1. **Modalidad** — Remoto / Híbrido / Presencial / Remoto+Híbrido / Todos
2. **Regiones/países**
3. **Términos de búsqueda** específicos, si los hay, además de los habituales
4. **Aplicaciones externas** — ¿incluir también ofertas fuera de LinkedIn? Sí / No / Solo Easy Apply
5. **Dispositivo** — solo si el punto 4 es "Sí": ¿desde qué dispositivo está aplicando el usuario hoy? (ver tabla de dispositivos en "Aplicaciones externas"). Si el punto 4 es "No", omitir este punto.

**⚠️ Regla técnica sin excepciones: no usar la herramienta de preguntas con botones (`AskUserQuestion` / `ask_user_input_v0`) para el Paso 0, bajo ningún concepto.** Esa herramienta tiene un límite de preguntas por llamada, pagina en varias pantallas ("1 de 3", "2 de 3"...) y corta el turno en cuanto se llama — en la práctica esto ha dejado puntos sin preguntar repetidamente. Para evitarlo de raíz, preguntar los 4 primeros puntos **como un único mensaje de texto normal, numerado**, tipo:

> "Antes de empezar, dime: 1) ¿Qué modalidad? (remoto/híbrido/presencial/ambos/todos) 2) ¿Qué países? 3) ¿Algún término específico además de los habituales? 4) ¿Incluyo también aplicaciones externas fuera de LinkedIn?"

El usuario responde todo junto en un solo mensaje de texto libre (ej. "remoto, NL+ES, sin términos extra, sí incluye externas"). El punto 5 (dispositivo) es condicional al punto 4, así que es una segunda pregunta de texto normal, en un turno aparte, justo después de recibir un "sí" al punto 4 — sigue siendo parte de este mismo checklist inicial, antes de cualquier búsqueda.

**No pasar a "Configuración de búsqueda" ni abrir ningún navegador hasta que los 5 puntos estén resueltos** (respondidos por el usuario o ya presentes en su prompt).

---

## Candidate profile / Perfil del candidato

| Field / Campo | Value / Valor |
|---------------|---------------|
| Name / Nombre | `[YOUR FULL NAME]` |
| Email | `[YOUR EMAIL]` |
| Phone / Teléfono | `[YOUR PHONE WITH COUNTRY CODE]` |
| Country code / Código de país | `[+XX]` — always select this / siempre seleccionar este |
| Location / Ubicación (forms) | `[YOUR CITY, COUNTRY]` |
| Portfolio | `[YOUR PORTFOLIO URL or 'none']` |
| Availability / Disponibilidad | `[Immediate / X weeks / X months]` |

---

## Search configuration / Configuración de búsqueda

### Job titles / Títulos de puesto (rotate between sessions / rotar entre sesiones)
- `[Job title 1]`
- `[Job title 2]`
- `[Job title 3]`

### LinkedIn URL filters / Filtros de URL
- `f_AL=true` — Easy Apply only / solo Easy Apply (always required / siempre obligatorio)
- `f_WT=2` — Remote / Remoto
- `f_WT=3` — Hybrid / Híbrido
- `f_WT=2,3` — Remote + Hybrid (run two searches / hacer dos búsquedas)

### Country GeoIDs / GeoIDs por país
| Country / País | GeoId |
|----------------|-------|
| Netherlands / Países Bajos | `102890719` |
| Spain / España | `105646813` |
| United Kingdom / Reino Unido | `101165590` |
| United States / Estados Unidos | `103644278` |
| Germany / Alemania | `101282230` |
| France / Francia | `105015875` |
| Belgium / Bélgica | `100565514` |

---

## Skip rules / Reglas de descarte

🇬🇧 Skip immediately if the offer matches ANY of these:
🇪🇸 Descartar inmediatamente si la oferta cumple CUALQUIERA de estas:

**By title / Por título:**
🇬🇧 Contains `[SENIORITY_LIST]` — generated by `setup.md` from your Step 2.4 answer, not a fixed default
🇪🇸 Contiene `[LISTA_SENIORITY]` — generado por `setup.md` a partir de tu respuesta en el Paso 2.4, no es un valor fijo por defecto

**By language / Por idioma:**
🇬🇧 Offer written only in `[SKIP_LANGUAGES]` → skip — generated from your Step 2.5 answer
🇪🇸 Oferta escrita solo en `[IDIOMAS_A_DESCARTAR]` → descartar — generado a partir de tu respuesta en el Paso 2.5

**By geography / Por geografía:**
🇬🇧 Requires legal authorization to work in US or UK → skip if form asks
🇪🇸 Requiere autorización legal para trabajar en US o UK → descartar si el formulario lo pregunta

---

## Form field values / Valores para el formulario

| Field / Campo | Value / Valor |
|---------------|---------------|
| Full name / Nombre completo | `[YOUR FULL NAME]` |
| Email | `[YOUR EMAIL]` |
| Phone / Teléfono | `[YOUR PHONE]` |
| Country code / Código de país | `[+XX]` — always change / siempre cambiar |
| Location / Ubicación | `[YOUR CITY, COUNTRY]` |
| Portfolio | `[YOUR PORTFOLIO URL]` |
| Years of experience / Años de experiencia | `[N]` |
| Expected salary / Salario esperado (annual/anual) | `[AMOUNT CURRENCY]` |
| Expected salary / Salario esperado (monthly USD/mensual USD) | `[AMOUNT]` |
| Notice period / Preaviso | `[Immediate / X weeks]` |
| Requires visa sponsorship? / ¿Requiere patrocinio de visa? | No |
| Authorized to work? / ¿Autorizado para trabajar? | Yes / Sí |

### CV selection / Selección de CV
| Offer language / Idioma oferta | CV to use / CV a usar |
|--------------------------------|-----------------------|
| English / Inglés | `[English CV filename].pdf` |
| Spanish / Español | `[Spanish CV filename].pdf` |
| Other / Otro | `[Default CV filename].pdf` |

---

## External applications / Aplicaciones externas (v2)

🇬🇧 When an offer has no Easy Apply button but redirects to the company site or an ATS (Greenhouse, Lever, Workday, Ashby, etc.), and you opted in at Step 0, use the **Claude for Chrome** extension. **Requires the Claude Desktop app open and connected** on the device you're applying from — needed for local file uploads (CV, photo) even though the session itself runs from web/mobile chat.

**Fill fast, as you go — don't map the whole form first.** Reading/screenshotting the entire form before typing anything is the main thing that slows external applications down. Instead: fill the fields visible in the current viewport one by one as you find them, scroll to the next section and repeat (don't re-analyze the whole page each time), batch actions where possible instead of screenshotting after every single field, and save full verification for right before submit — not field by field.

- Everything is automatic (fill fields, upload CV/photo, write cover letter, answer screening questions, submit). **The session never stops mid-flow** — not even to ask for credentials.
- Don't stop for optional logins ("continue as guest") — always choose guest/no account.
- **Any blocker that can't be solved automatically** — mandatory account registration, unsolvable CAPTCHA, SMS/phone verification, unusual document uploads, a broken form — does **not** interrupt the session: log the offer to an internal `pending_manual` list (title, company, url, reason) and move on to the next eligible offer. This list becomes a dedicated section in the end-of-session summary document, so the user can review all of them at once and finish those applications themselves.
- File paths for CV/photo depend on the device you're applying from — keep a small table like this and ask once per session (at Step 0, see above) if unclear:

| Device / Dispositivo | English CV | Spanish CV | Photo |
|---|---|---|---|
| `[DEVICE NAME]` | `[PATH TO ENGLISH CV]` | `[PATH TO SPANISH CV]` | `[PATH TO PHOTO]` |

- **Notion tagging is mandatory, no exceptions:** every successfully submitted external application must be uploaded to Notion with `Tipo = "Externa"` (never left blank or defaulting to Easy Apply) and `Plataforma` set to the actual ATS/site name. Without this, the dashboard shows it as a regular Easy Apply application, which defeats the purpose of tracking it separately.

🇪🇸 Cuando una oferta no tiene botón Easy Apply pero redirige a la web de la empresa o a un ATS (Greenhouse, Lever, Workday, Ashby, etc.), y se activó en el Paso 0, usar la extensión **Claude for Chrome**. **Requiere Claude Desktop abierto y conectado** en el dispositivo desde el que se aplica — necesario para subir archivos locales (CV, foto) aunque la sesión se lleve desde el chat web/móvil.

**Rellenar rápido, sobre la marcha — sin mapear el formulario entero antes.** Leer/capturar el formulario completo antes de escribir nada es lo que más ralentiza las aplicaciones externas. En su lugar: rellenar los campos visibles en el viewport actual uno a uno según se encuentran, hacer scroll al siguiente tramo y repetir (sin volver a analizar la página entera cada vez), agrupar acciones cuando sea posible en vez de capturar pantalla tras cada campo individual, y dejar la verificación completa para justo antes de enviar — no campo a campo.

- Todo es automático (rellenar campos, subir CV/foto, escribir carta de presentación, responder screening, enviar). **La sesión nunca se detiene a mitad de camino** — ni siquiera para pedir credenciales.
- No detenerse por logins opcionales ("continuar como invitado") — elegir siempre invitado/sin cuenta.
- **Cualquier bloqueo que no se pueda resolver automáticamente** — registro obligatorio de cuenta, CAPTCHA sin solución, verificación por SMS/teléfono, documentos poco habituales, un formulario roto — no interrumpe la sesión: registrar la oferta en una lista interna `pending_manual` (título, empresa, url, motivo) y pasar a la siguiente oferta elegible. Esta lista se convierte en un apartado propio del documento de resumen final, para que el usuario revise todas juntas al terminar y complete esas aplicaciones por su cuenta.
- Las rutas de CV/foto dependen del dispositivo desde el que se aplique — mantener una tabla como la de arriba y preguntar una vez por sesión (en el Paso 0, ver arriba) si no está claro.
- **El etiquetado en Notion es obligatorio, sin excepción:** toda aplicación externa enviada con éxito debe subirse a Notion con `Tipo = "Externa"` (nunca en blanco ni con el valor por defecto de Easy Apply) y `Plataforma` con el nombre real del ATS/web. Sin esto, el dashboard la muestra como una Easy Apply normal, que es justo lo que se quiere evitar.

---

## Session tracking / Seguimiento durante la sesión

🇬🇧 After each application, record immediately:
🇪🇸 Después de cada aplicación, registrar inmediatamente:

```json
{
  "titulo": "Job title / Título del puesto",
  "empresa": "Company / Empresa",
  "ubicacion": "City (modality) / Ciudad (modalidad)",
  "contacto_reclutador": "Name or Not visible / Nombre o No visible",
  "url": "https://www.linkedin.com/jobs/view/XXXXXXX/",
  "estado": "Enviada",
  "tipo_aplicacion": "Easy Apply / Externa",
  "plataforma": "LinkedIn / Greenhouse / Lever / Workday / ...",
  "resumen_puesto": "2-3 sentence summary / Resumen de 2-3 frases",
  "requisitos_clave": ["req1", "req2"],
  "beneficios": "Benefits listed / Beneficios mencionados"
}
```

---

## Session close / Cierre de sesión

🇬🇧 When the session ends (user says "stop", "finish", or no more offers):
🇪🇸 Cuando la sesión termina (el usuario dice "para", "termina", o no hay más ofertas):

### 1. Summary document / Documento de resumen
🇬🇧 Generate `applications_[YYYY-MM-DD].md` and send with `SendUserFile`. If the internal `pending_manual` list has entries, add a dedicated section to the document (title, company, URL, reason for each) so the user can open and finish those applications themselves.
🇪🇸 Generar `aplicaciones_[YYYY-MM-DD].md` y enviar con `SendUserFile`. Si la lista interna `pending_manual` tiene entradas, añadir un apartado propio al documento (título, empresa, URL y motivo de cada una) para que el usuario pueda abrir y completar esas aplicaciones por su cuenta.

### 2. Write to Notion / Escribir en Notion
🇬🇧 Use `notion-create-pages` with parent `{"database_id": "[YOUR_NOTION_DATABASE_ID]", "type": "database_id"}`
🇪🇸 Usar `notion-create-pages` con parent `{"database_id": "[TU_NOTION_DATABASE_ID]", "type": "database_id"}`

| Notion property / Propiedad | Value / Valor |
|-----------------------------|---------------|
| `Título` | Job title / Título del puesto |
| `Empresa` | Company / Empresa |
| `Estado` | `"Enviada"` |
| `País` | `NL` / `ES` / `UK` / `US` / `Global` |
| `Fecha` | Today YYYY-MM-DD / Hoy YYYY-MM-DD |
| `userDefined:URL` | LinkedIn job URL ⚠️ exact name / nombre exacto |
| `Reclutador` | Name or `"Not visible"` / Nombre o `"No visible"` |
| `Sesión` | Session date YYYY-MM-DD |
| `Resumen` | Role summary / Resumen del puesto |
| `Requisitos` | Requirements joined with `", "` / Requisitos unidos con `", "` |
| `Beneficios` | Benefits or `""` / Beneficios o `""` |
| `Rating` | `0` |
| `Notas` | `""` |
| `Tipo` | `"Easy Apply"` or `"Externa"` / `"Easy Apply"` o `"Externa"` |
| `Plataforma` | `"LinkedIn"`, `"Greenhouse"`, `"Lever"`, `"Workday"`... |

🇬🇧 Confirm: `✓ [N] applications saved to Notion — open the dashboard and press Sync`
🇪🇸 Confirmar: `✓ [N] aplicaciones guardadas en Notion — abre el dashboard y pulsa Sync`

### 3. Fallback / Respaldo (if Notion fails / si Notion falla)
🇬🇧 Show JSON so the user can import manually via the dashboard Import button:
🇪🇸 Mostrar JSON para que el usuario pueda importarlo manualmente con el botón Import del dashboard:

```json
{
  "sesion_id": "YYYY-MM-DD",
  "aplicaciones": [{ "titulo": "...", "empresa": "...", "..." : "..." }]
}
```

---

## Critical rules / Reglas críticas (never break / nunca romper)

1. 🇬🇧 Easy Apply button must exist — otherwise skip / 🇪🇸 El botón Easy Apply debe existir — si no, saltar
2. 🇬🇧 Always change phone country code to `[+XX]` / 🇪🇸 Siempre cambiar el código de país del teléfono a `[+XX]`
3. 🇬🇧 Always uncheck "Follow company" before submitting / 🇪🇸 Siempre desmarcar "Seguir empresa" antes de enviar
4. 🇬🇧 Correct CV per language / 🇪🇸 CV correcto según el idioma de la oferta
5. 🇬🇧 Skip if work authorization form appears for US/UK / 🇪🇸 Saltar si aparece formulario de autorización de trabajo en US/UK
6. 🇬🇧 External applications: the session never stops mid-flow — every blocker (mandatory registration, CAPTCHA, SMS, unusual documents, broken form) is logged to `pending_manual` and the session moves on / 🇪🇸 Aplicaciones externas: la sesión nunca se detiene a mitad de camino — cualquier bloqueo (registro obligatorio, CAPTCHA, SMS, documentos raros, formulario roto) se registra en `pending_manual` y la sesión continúa
7. 🇬🇧 Claude Desktop must be open and connected for external applications (file uploads won't work otherwise) / 🇪🇸 Claude Desktop debe estar abierto y conectado para aplicaciones externas (si no, la subida de archivos no funcionará)
8. 🇬🇧 Step 0 is a hard gate, not a suggestion — no browser tool runs until all 5 points are resolved; if a point is already in the user's prompt don't re-ask it, but if it's missing always ask — never assume it or reuse it from a previous session's memory / 🇪🇸 El Paso 0 es una puerta de bloqueo, no una sugerencia — no se llama a ninguna herramienta de navegador hasta tener los 5 puntos resueltos; si un punto ya está en el prompt del usuario no se repregunta, pero si falta siempre se pregunta — nunca se asume ni se recicla de una sesión anterior
9. 🇬🇧 Step 0 never uses the button tool — the first 4 points go in a single numbered plain-text message; device (point 5) goes in a second text turn if needed. Never `AskUserQuestion`/`ask_user_input_v0` here — its question cap has repeatedly cut the turn short before the checklist was complete / 🇪🇸 El Paso 0 nunca usa la herramienta de botones — los 4 primeros puntos van en un solo mensaje de texto normal numerado; dispositivo (punto 5) va en un segundo turno de texto si aplica. Nunca `AskUserQuestion`/`ask_user_input_v0` aquí — su límite de preguntas ha cortado el turno antes de completar el checklist repetidamente
9. 🇬🇧 External applications: fill as you go, never map the whole form before typing / 🇪🇸 Aplicaciones externas: rellenar sobre la marcha, nunca mapear el formulario entero antes de escribir
10. 🇬🇧 External applications: `Tipo = "Externa"` in Notion is mandatory, never left as default Easy Apply / 🇪🇸 Aplicaciones externas: `Tipo = "Externa"` en Notion es obligatorio, nunca se deja como Easy Apply por defecto
