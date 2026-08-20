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

# LinkedIn Easy Apply — Skill

## STEP 0 — Session start: mandatory checklist before touching the browser / Inicio de sesión: checklist obligatorio antes de tocar el navegador

🇬🇧 **Hard rule: don't open LinkedIn, run any search, or call any browser tool until the 5 points below are answered.** The message that triggers this skill ("apply to jobs", "start session"...) activates the skill — it doesn't answer the checklist for you.

For each point: **if the answer is already in the user's prompt** (they wrote it explicitly), use that and don't ask again. **If it's not there, ask it** — never assume a default, never reuse an answer from a previous session's memory, never infer it from context.

1. **Modality** — Remote / Hybrid / Onsite / Remote+Hybrid / All
2. **Countries/regions**
3. **Specific search terms**, if any, besides the usual ones
4. **External applications** — include offers off LinkedIn too? Yes / No / Easy Apply only
5. **Device** — only if point 4 is "Yes": which device is the user applying from today? (see device table in "External applications"). If point 4 is "No", skip this point.

**⚠️ Hard rule about memory, no exceptions:** Claude's memory (saved preferences, past sessions, "N memories read") **never counts as an answer** to these 5 points. Memory can at most be *suggested* as a default inside the question message — never used to answer on the user's behalf or skip the question.

**⚠️ Hard rule about waiting, no exceptions:** after asking, the turn ends there. Don't generate the answers, don't summarize "ok, let's go with X, Y, Z", and don't say "starting now" until the user has sent a new message actually answering.

**⚠️ Exactly how to split the 5 points if the button question tool (`AskUserQuestion` / `ask_user_input_v0`) gets used:**

This tool tends to get used regardless of instructions to avoid it — instead of continuing to try to ban it outright, this defines precisely what goes in it when it's used, so no point is ever left unasked:

- **First call — exactly these 3 questions, no more, no less, in this order:**
  1. Modality (point 1)
  2. Countries/regions (point 2) — a handful of common options + "Something else" free text
  3. External applications (point 4) — Yes / No
- **Search terms (point 3)** go as plain text in the conversational message accompanying that same call, never as one of the tool's 3 questions.
- **Mandatory, no exceptions: as soon as the answers to that first call come back, if point 4 was "Yes", make a SECOND call** (same tool, or a plain text question) asking only point 5 (device), before touching the browser. This second call is not optional.

If instead everything is asked as plain text (no tool), the same rules apply: the first 4 points in one message, device in a second message if needed.

**Don't move on to "Search configuration" or open any browser until the user has actually replied with an explicit message answering all 5 points** (or they were already in their original prompt).

Modality determines which filters to apply:
- Remote only → `f_WT=2`
- Hybrid only → `f_WT=3`
- Onsite only → `f_WT=1`
- Remote + hybrid → `f_WT=2,3` (two separate searches)
- All → omit `f_WT` filter

If point 4 is "Yes", the rules in **"External applications"** below also apply.

🇪🇸 **Regla dura: no se abre LinkedIn, no se hace ninguna búsqueda ni se llama a ninguna herramienta de navegador hasta tener respuesta a los 5 puntos de abajo.** El mensaje que activa esta skill ("aplica a trabajos", "busca ofertas"...) dispara la skill — no responde el checklist por ti.

Para cada punto: **si la respuesta ya está en el prompt del usuario** (lo escribió explícitamente), usar esa respuesta y no volver a preguntarla. **Si no está, preguntarla** — nunca asumir un valor por defecto, nunca reusar la respuesta de una sesión anterior de memoria, nunca inferirla del contexto.

1. **Modalidad** — Remoto / Híbrido / Presencial / Remoto+Híbrido / Todos
2. **Regiones/países**
3. **Términos de búsqueda** específicos, si los hay, además de los habituales
4. **Aplicaciones externas** — ¿incluir también ofertas fuera de LinkedIn? Sí / No / Solo Easy Apply
5. **Dispositivo** — solo si el punto 4 es "Sí": ¿desde qué dispositivo está aplicando el usuario hoy? (ver tabla de dispositivos en "Aplicaciones externas"). Si el punto 4 es "No", omitir este punto.

**⚠️ Regla sobre memoria, sin excepciones:** la memoria de Claude nunca cuenta como respuesta a estos 5 puntos. Puede como mucho *sugerirse* como valor por defecto dentro del mensaje de la pregunta — nunca usarse para responder en su nombre.

**⚠️ Regla sobre esperar, sin excepciones:** después de preguntar, el turno termina ahí. No generar las respuestas, no resumir "vale, vamos con X, Y, Z" y no decir "empiezo ahora" hasta que el usuario haya respondido de verdad.

**⚠️ Cómo repartir exactamente los 5 puntos si se usa la herramienta de preguntas con botones (`AskUserQuestion` / `ask_user_input_v0`):**

- **Primera llamada — exactamente estas 3 preguntas, en este orden:** 1) Modalidad 2) Regiones/países 3) Aplicaciones externas (Sí/No)
- **Términos de búsqueda** van como texto normal en el mensaje que acompaña esa misma llamada, nunca como una de las 3 preguntas.
- **Obligatorio: en cuanto lleguen las respuestas, si el punto 4 fue "Sí", hacer una SEGUNDA llamada** preguntando solo el dispositivo, antes de tocar el navegador.

**No pasar a "Configuración de búsqueda" ni abrir ningún navegador hasta que el usuario haya respondido explícitamente a los 5 puntos** (o ya venían en su prompt original).

La modalidad determina qué filtros aplicar:
- Solo remoto → `f_WT=2`
- Solo híbrido → `f_WT=3`
- Solo presencial → `f_WT=1`
- Remoto + híbrido → `f_WT=2,3` (dos búsquedas separadas)
- Todos → omitir filtro `f_WT`

Si el punto 4 es "Sí", aplican también las reglas de **"Aplicaciones externas"** más abajo.

---

## Candidate profile / Perfil del candidato

| Field / Campo | Value / Valor |
|---------------|---------------|
| Name / Nombre | `[YOUR FULL NAME]` |
| Role / Perfil | `[YOUR ROLE, e.g. "UX/UI Designer with ~2 years of experience"]` |
| Previous background / Trayectoria previa (optional / opcional) | `[e.g. "5 years as Coordinator/Account Manager, 3 years as PR Manager" — mention as a differentiator in cover letters when the role values communication, client management, or team coordination]` |
| Working languages / Idiomas de trabajo | `[YOUR LANGUAGES]` |
| Availability / Disponibilidad | `[e.g. "Immediate"]` |
| Location for forms / Ubicación para formularios | `[YOUR COUNTRY]` |
| Portfolio | `[YOUR PORTFOLIO URL]` |
| Phone / Teléfono | `[YOUR PHONE, with country code]` |
| Email | `[YOUR EMAIL]` |

---

## Search configuration / Configuración de búsqueda

### Search terms / Términos de búsqueda
Rotate between these to maximize coverage / Rotar entre estos para maximizar cobertura:
- `[JOB TITLE 1]`
- `[JOB TITLE 2]`
- `[JOB TITLE 3]`
- ...add as many as relevant to your role / añade tantos como sean relevantes a tu perfil

### Easy Apply filter — depends on Step 0's answer (point 4) / Filtro Easy Apply — depende de la respuesta del Paso 0 (punto 4)

🇬🇧
- **If point 4 was "No" (Easy Apply only):** `f_AL=true` is mandatory in the URL — filters results to Easy Apply offers only.
- **If point 4 was "Yes" (include external):** **do NOT add `f_AL=true`.** Adding it makes LinkedIn return Easy Apply offers only, and external ones never show up in results — the whole external-applications feature is silently defeated by a search filter. Without that parameter, results include both types, and each offer is classified individually when opened ("Easy Apply" button → Easy Apply flow; "Apply" button that leaves LinkedIn → external, see "External applications").

`f_WT` (modality) stays mandatory regardless of this.

🇪🇸
- **Si el punto 4 fue "No" (solo Easy Apply):** `f_AL=true` es obligatorio en la URL — filtra los resultados a solo ofertas con Solicitud sencilla.
- **Si el punto 4 fue "Sí" (incluir externas):** **NO añadir `f_AL=true`**. Si se incluye, LinkedIn devuelve únicamente ofertas de Easy Apply y las externas nunca aparecen en los resultados — se pierde toda la funcionalidad de aplicaciones externas por un filtro de búsqueda. Sin ese parámetro, los resultados incluyen ambos tipos, y cada oferta se clasifica individualmente al abrirla ("Solicitud sencilla" → Easy Apply; "Solicitar" que lleva fuera de LinkedIn → externa).

`f_WT` (modalidad) sigue siendo obligatorio, independientemente de esto.

### Country GeoIDs / GeoIDs por país
| Country / País | GeoId |
|-----------------|-------|
| Netherlands / Países Bajos | `102890719` |
| Spain / España | `105646813` |
| United Kingdom / Reino Unido | `101165590` |
| United States / Estados Unidos | `103644278` |
| Germany / Alemania | `101282230` |
| France / Francia | `105015875` |
| Belgium / Bélgica | `100565514` |
| Italy / Italia | `103350119` |
| Global / no filter | (omit geoId) |

**Example URL — Easy Apply only:**
```
https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&geoId=[GEOID]&keywords=[KEYWORDS]
```

**Example URL — Easy Apply + external:**
```
https://www.linkedin.com/jobs/search/?f_WT=2&geoId=[GEOID]&keywords=[KEYWORDS]
```

---

## Skip rules / Reglas de descarte

🇬🇧 Skip immediately if the offer matches ANY of these:
🇪🇸 Descartar inmediatamente si la oferta cumple CUALQUIERA de estas:

**By title / Por título:**
🇬🇧 Contains `[SENIORITY_LIST]` — generated by `setup.md` from your Step 2.4 answer, not a fixed default
🇪🇸 Contiene `[LISTA_SENIORITY]` — generado por `setup.md` a partir de tu respuesta en el Paso 2.4, no es un valor fijo por defecto

**By modality / Por modalidad:**
🇬🇧 Hybrid / Onsite, or "Remote" that requires being physically based in the offer's country
🇪🇸 Híbrido / Presencial, o "Remoto" que exige estar físicamente en el país de la oferta

**By language / Por idioma:**
🇬🇧 Offer written only in `[SKIP_LANGUAGES]` → skip — generated from your Step 2.5 answer
🇪🇸 Oferta escrita solo en `[IDIOMAS_A_DESCARTAR]` → descartar — generado a partir de tu respuesta en el Paso 2.5

**By geography / Por geografía:**
🇬🇧 Requires legal authorization to work in a country you're not based in → skip if the form asks
🇪🇸 Requiere autorización legal de trabajo en un país donde no resides → descartar si el formulario lo pregunta

**By experience / Por experiencia:**
🇬🇧 Explicitly and strictly requires more years of experience than you have, or a clearly senior salary range
🇪🇸 Exige explícita y estrictamente más años de experiencia de los que tienes, o un rango salarial claramente senior

---

## Application process — step by step / Proceso de aplicación — paso a paso

### 1. Open the Easy Apply modal / Abrir el modal de Easy Apply
Click **"Easy Apply"** / **"Solicitud sencilla"** on the offer page.

### 2. Go through each modal page / Revisar cada página del modal
Navigate with **"Next"** / **"Siguiente"** until reaching **"Submit"** / **"Enviar solicitud"**.

**⚠️ NEVER click buttons outside the modal** — may open external or Premium pages.

### 3. Standard fields / Campos estándar

| Field / Campo | Value / Valor |
|-------|-------|
| CV / Resume | See CV section below / Ver sección CV más abajo |
| Name / Nombre | `[YOUR FULL NAME]` |
| Email | `[YOUR EMAIL]` |
| Phone / Teléfono | `[YOUR PHONE]` |
| Country code / Código de país | `[YOUR COUNTRY CODE]` — always double-check it matches your actual number / comprobar siempre que coincide con tu número real |
| Location / Ubicación | `[YOUR COUNTRY]` |
| Portfolio / Website | `[YOUR PORTFOLIO URL]` |
| Years of experience (role) / Años de experiencia (rol) | `[X]` |
| Salary expectation / Expectativa salarial | `[YOUR EXPECTED SALARY]` |
| Availability / Disponibilidad | `[YOUR NOTICE PERIOD]` |
| Visa/sponsorship required? / ¿Requiere visa? | `[Yes/No]` |
| Authorized to work in [YOUR COUNTRY]? | `[Yes]` |

### 4. "Follow company" checkbox / Checkbox "Seguir a la empresa"
**ALWAYS uncheck** before submitting / **SIEMPRE desmarcar** antes de enviar.

### 5. Cover letter / Carta de presentación
If there's a free-text or cover letter field:
- Write a short letter in the offer's language
- Mention the specific role, 1-2 match points, and portfolio
- If relevant, briefly mention your previous background as a differentiator
- Keep it short (3-4 sentences)

### 6. Screening questions / Preguntas de screening
- **"Years of experience in [tool/skill]"** → `[X]`
- **"Expected salary"** → see table above
- **"Notice period"** → `[YOUR NOTICE PERIOD]`

---

## CV selection / Selección de CV

| Offer language / Idioma de la oferta | CV to use / CV a usar |
|---------------------|-----------|
| English / Inglés | `[YOUR ENGLISH CV FILENAME]` |
| Spanish / Español | `[YOUR SPANISH CV FILENAME]` |
| Other unsupported languages / Otros idiomas no soportados | Skip the offer / Saltarse la oferta (see skip rules) |

If LinkedIn already has a default CV uploaded, verify it matches the offer's language and change it if needed.

---

## External applications / Aplicaciones externas (v2)

🇬🇧 When an offer has no Easy Apply button but redirects to the company site or an ATS (Greenhouse, Lever, Workday, Ashby, etc.), and you opted in at Step 0, use the **Claude for Chrome** extension. **Requires the Claude Desktop app open and connected** on the device you're applying from — needed for local file uploads (CV, photo) even though the session itself runs from web/mobile chat.

**Fill fast, as you go — don't map the whole form first.** Reading/screenshotting the entire form before typing anything is the main thing that slows external applications down. Instead: fill the fields visible in the current viewport one by one as you find them, scroll to the next section and repeat, batch actions where possible instead of screenshotting after every single field, and save full verification for right before submit. **Exception:** after interacting with a dropdown (which sometimes closes the tab or navigates away if it loses focus unexpectedly), do a quick check that the tab is still open before continuing to fill blindly.

- Everything is automatic (fill fields, upload CV/photo, write cover letter, answer screening questions, submit). **The session never stops mid-flow** — not even to ask for credentials.
- Don't stop for optional logins ("continue as guest") — always choose guest/no account.
- **Any blocker that can't be solved automatically** — mandatory account registration, unsolvable CAPTCHA, SMS/phone verification, unusual document uploads, a broken form — does **not** interrupt the session: log the offer to an internal `pending_manual` list (title, company, url, reason) and move on to the next eligible offer. This list becomes a dedicated section in the end-of-session summary document.
- **Never search for the CV/photo on Google Drive, Notion, or any other connector**, even if one is available and seems like a reasonable fallback. CV/photo only exist as local files at the paths in the device table below. If the local upload fails, there's no automatic plan B: mark the offer as pending manual (reason: "couldn't attach CV/photo") and move on.
- **Try the file upload as early as possible in each external offer, not at the end of the form.** If there's a CV/photo upload field, attempt it as soon as you reach it — don't fill every other field first and discover at the end that it fails. This avoids wasting dozens of actions filling a form that then can't be submitted.
- **If the file upload fails on the first external offer of the session** (device bridge unavailable, Desktop disconnected, etc.), **tell the user immediately in the chat, don't wait until session close.** The same failure likely affects every remaining external offer, so silently retrying one by one wastes a lot of work — better to pause, explain the problem, and let the user reconnect before continuing.
- File paths for CV/photo depend on the device you're applying from — keep a small table like this and ask once per session (at Step 0) if unclear:

| Device / Dispositivo | English CV | Spanish CV | Photo |
|---|---|---|---|
| `[DEVICE NAME]` | `[PATH TO ENGLISH CV]` | `[PATH TO SPANISH CV]` | `[PATH TO PHOTO]` |

- **Notion tagging is mandatory, no exceptions:** every successfully submitted external application must be uploaded to Notion with `Tipo = "Externa"` (never left blank or defaulting to Easy Apply) and `Plataforma` set to the actual ATS/site name.

🇪🇸 Cuando una oferta no tiene botón Easy Apply pero redirige a la web de la empresa o a un ATS (Greenhouse, Lever, Workday, Ashby, etc.), y se activó en el Paso 0, usar la extensión **Claude for Chrome**. **Requiere Claude Desktop abierto y conectado** en el dispositivo desde el que se aplica.

**Rellenar rápido, sobre la marcha — sin mapear el formulario entero antes.** Rellenar los campos visibles uno a uno según se encuentran, hacer scroll y repetir, agrupar acciones cuando sea posible, y dejar la verificación completa para justo antes de enviar. **Excepción:** tras interactuar con un dropdown (que a veces cierra la pestaña si pierde el foco), comprobar rápidamente que la pestaña sigue abierta antes de seguir.

- Todo es automático (rellenar, subir CV/foto, carta de presentación, screening, enviar). **La sesión nunca se detiene a mitad de camino** — ni siquiera para pedir credenciales.
- No detenerse por logins opcionales — elegir siempre invitado/sin cuenta.
- **Cualquier bloqueo que no se pueda resolver automáticamente** — registro obligatorio, CAPTCHA sin solución, SMS, documentos poco habituales, formulario roto — no interrumpe la sesión: registrar en `pending_manual` (título, empresa, url, motivo) y seguir. Apartado propio en el documento final.
- **Nunca buscar el CV/foto en Google Drive, Notion, u otro conector**, aunque esté disponible y parezca una alternativa razonable. Solo archivo local, en las rutas de la tabla. Si falla, pendiente manual — nunca se busca por otra vía.
- **Probar la subida del archivo cuanto antes en cada oferta, no al final del formulario.** Evita perder decenas de acciones rellenando un formulario que luego no se puede enviar.
- **Si la subida falla en la primera oferta externa de la sesión**, avisar al usuario de inmediato — no esperar al cierre de sesión. Es probable que afecte a todas las siguientes.
- Las rutas de CV/foto dependen del dispositivo — mantener una tabla como la de arriba y preguntar una vez por sesión (en el Paso 0) si no está claro.
- **El etiquetado en Notion es obligatorio, sin excepción:** `Tipo = "Externa"` y `Plataforma` con el nombre real del ATS/web, siempre.

---

## Session tracking / Seguimiento durante la sesión

### Internal record per application / Registro interno por aplicación

Keep an in-memory list during the whole session. For each application submitted, add an entry immediately:

```json
{
  "titulo": "...",
  "empresa": "...",
  "pais": "NL / ES / UK / US / Global / ...",
  "tipo_jornada": "Jornada completa",
  "contacto_reclutador": "Nombre visible o 'No visible'",
  "url": "...",
  "estado": "Enviada",
  "tipo_aplicacion": "Easy Apply",
  "plataforma": "LinkedIn",
  "resumen_puesto": "Descripción breve del rol...",
  "requisitos_clave": ["...", "..."],
  "beneficios": "Remoto, flexible, ..."
}
```

For external applications, `tipo_aplicacion` is `"Externa"` and `plataforma` names the ATS/site used.

---

## Session close / Cierre de sesión

### 1. Summary document / Documento de resumen
🇬🇧 Generate `applications_[YYYY-MM-DD].md` and send with `SendUserFile`. If the internal `pending_manual` list has entries, add a dedicated section (title, company, URL, reason for each).
🇪🇸 Generar `aplicaciones_[YYYY-MM-DD].md` y enviar con `SendUserFile`. Si `pending_manual` tiene entradas, añadir un apartado propio.

### 2. Notion upload / Subida a Notion
Upload every application using `mcp__Notion__notion-create-pages`.

| Property | Value |
|----------|-------|
| Título | Job title |
| Empresa | Company |
| Estado | "Enviada" |
| País | Country / Global |
| Fecha | Today YYYY-MM-DD |
| userDefined:URL | Job URL |
| Reclutador | Name or "Not visible" |
| Sesión | Session date |
| Resumen | 2-3 sentence summary |
| Requisitos | Requirements joined with ", " |
| Beneficios | Benefits or "" |
| Rating | 0 |
| Notas | "" |
| Tipo | "Easy Apply" or "Externa" |
| Plataforma | "LinkedIn", "Greenhouse", "Lever", "Workday"... |

### Country flag emojis / Emojis de bandera por país
🇳🇱 🇪🇸 🇬🇧 🇺🇸 🇩🇪 🇧🇪 🇫🇷 🇮🇹 🌍

---

## Critical rules / Reglas críticas (never break / nunca romper)

1. 🇬🇧 Easy Apply always valid; external only if Step 0 point 4 was "Yes" / 🇪🇸 Easy Apply siempre vale; externas solo si el punto 4 del Paso 0 fue "Sí"
2. 🇬🇧 Remote-only unless the user said otherwise / 🇪🇸 Solo remoto salvo que el usuario diga lo contrario
3. 🇬🇧 No seniority titles / 🇪🇸 Sin seniority
4. 🇬🇧 Always double-check the phone country code matches the actual number / 🇪🇸 Comprobar siempre que el código de país del teléfono coincide con el número real
5. 🇬🇧 Always uncheck "Follow company" / 🇪🇸 Desmarcar "Seguir empresa" siempre
6. 🇬🇧 Correct CV per language, never a duplicate/wrong file / 🇪🇸 CV correcto según idioma, nunca un archivo duplicado o incorrecto
7. 🇬🇧 Skip if the offer requires legal work authorization you don't have / 🇪🇸 Saltar si la oferta exige autorización legal de trabajo que no tienes
8. 🇬🇧 Notion at the end — always upload before closing the session / 🇪🇸 Notion al final — siempre subir antes de cerrar la sesión
9. 🇬🇧 External applications: the session never stops mid-flow — every blocker is logged to `pending_manual` and the session moves on / 🇪🇸 Aplicaciones externas: la sesión nunca se detiene a mitad de camino — cualquier bloqueo se registra en `pending_manual` y la sesión continúa
10. 🇬🇧 Claude Desktop must be open and connected for external applications / 🇪🇸 Claude Desktop debe estar abierto y conectado para aplicaciones externas
11. 🇬🇧 Step 0 is a hard gate, not a suggestion — never assume or reuse an answer from memory / 🇪🇸 El Paso 0 es una puerta de bloqueo, no una sugerencia — nunca se asume ni se recicla de memoria
12. 🇬🇧 Step 0 with the button tool: exactly 3 fixed questions, terms as plain text, mandatory second call for device if external=Yes / 🇪🇸 Paso 0 con herramienta de botones: exactamente 3 preguntas fijas, términos como texto, segunda llamada obligatoria para dispositivo si externas=Sí
13. 🇬🇧 External applications: fill as you go, never map the whole form before typing / 🇪🇸 Aplicaciones externas: rellenar sobre la marcha, nunca mapear el formulario entero antes de escribir
14. 🇬🇧 External applications: `Tipo = "Externa"` in Notion is mandatory / 🇪🇸 Aplicaciones externas: `Tipo = "Externa"` en Notion es obligatorio
15. 🇬🇧 Memory never answers Step 0 on the user's behalf — ask anyway and wait for a real reply / 🇪🇸 La memoria nunca responde el Paso 0 en nombre del usuario — preguntar igualmente y esperar una respuesta real
16. 🇬🇧 CV/photo: local file only, never Google Drive or another connector / 🇪🇸 CV/foto: solo archivo local, nunca Google Drive ni otro conector
17. 🇬🇧 Try the CV upload early, not at the end of the form — warn the user immediately if it fails / 🇪🇸 Probar la subida de CV pronto, no al final del formulario — avisar de inmediato si falla

---

## Browser automation notes / Notas de navegación

- Get the active tab ID before interacting
- Use screenshots to verify modal state at each step, but sparingly (see "fill fast" rule for external applications)
- Locate form fields by natural description
- If a new tab opens by mistake, close it and return to the correct one
- If the modal closes unexpectedly, click "Easy Apply" again

---

## Recommended session flow / Flujo recomendado por sesión

**Step 0 — Start:** follow the checklist above exactly. Don't start without all 5 points resolved.

**Step 1 — Search:** open LinkedIn with the filters matching Step 0's answers.

**Step 2 — Filter results:** for each offer — skip by seniority, modality mismatch, unsupported language, or restricted geography.

**Step 3 — Apply:** for each eligible offer — check which button it has: "Easy Apply" → follow the Easy Apply flow. "Apply" that leaves LinkedIn → if Step 0 included external, follow "External applications"; if not, skip. Immediately after submitting, log the entry with the correct `tipo_aplicacion`.

**Step 4 — Continue:** move to the next eligible offer.

**Step 5 — Session close:** generate the summary document, send it, upload everything to Notion, give a verbal summary.
