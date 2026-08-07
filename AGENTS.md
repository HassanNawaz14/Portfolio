# AGENTS.md — Working rules for AI agents

Repo: **web-portfolio** — a multi-mode React 19 + Vite portfolio with a serverless AI
assistant (Gemini → Groq fallback). Read the full architecture in [README.md](./README.md).

## Commands

```bash
npx eslint <file...>          # ALWAYS verify each changed JS/JSX/CSS? files after edits
vercel dev --listen 0.0.0.0:3000   # local dev WITH the api layer + .env
npm run dev                   # Vite only — NO api/* endpoints
npm run build                 # NOT allowed unless the user explicitly says so
```

- **Do not run `npm run build`** unless explicitly asked. Verify with lint only.
- eslint config: `api/**/*.js` uses `globals.node`; everything else uses browser globals +
  react-hooks + react-refresh.

## Repo map (get this right)

- `src/content/*.js` — **all editable content** (projects, skills, experience, education,
  certifications, courses, announcements, sitemap). Editing copy/date/titles = safe.
- `src/components/` — desktop components. Some are reused by car pages.
- `src/mobile/` — mobile mode copies (pages + components + layout + welcome/chat).
- `src/car/` — **the car mode** (desktop-only, car themed). New: `index.css`,
  `components/{Layout,Hero,Footer}`, `pages/{Home,QuickSite,Building,Projects,Profiles}`.
- `src/pages/` — desktop pages incl. `APIDebugger` (UI for `/api/debug`).
- `src/context/ModeContext.jsx` — modes; `localStorage['portfolio-mode']` + `<body>` class.
- `src/App.jsx` — router that picks `DesktopApp|MobileApp|CarApp` by `mode`.
- `src/main.jsx` — imports CSS **in order**: `index.css`, `mobile/index.css`, `car/index.css`.
- `api/` — Vercel serverless functions: `chat.js`, `greeting.js`, `debug.js`, `testchat.js`.
- `public/assets/certificates/` — certificate images used by `Certifications.jsx`.

## Modes scheme

- Valid modes: `desktop`, `mobile`, `car`. `car` is desktop-only.
- Switch UI: `src/components/ModeSwitch.jsx` — 3 options; third is `car`.
- `ModeContext.setMode` validates values; add to `VALID_MODES` in `ModeContext.jsx`.
- CSS is global & cascade-driven: last stylesheet wins. Scope new rules under
  `body.mode-…` so they don't bleed across modes.

## Certifications section (recent changing area)

- Cards are data-driven from `src/content/certifications.js` (`id`, `title`, `issuer`,
  `tag`, `category`, `date`, `color`).
- Image mapping lives in `src/components/Certifications.jsx` (`certImages[id]`).
- Adding a card = add content entry + image entry. Order in the file = render order
  (desktop uses `Certifications.jsx` map; CSS row on desktop is single-row fan with
  `margin: 0 -58px`; mobile uses `.mcerts-*` classes).
- The mobile index.css defines `.certifications-cards-row` — the desktop row inherits
  `flex-wrap` from there (mobile override); keep the wrap only on `.mcerts-row`.

## AI assistant

- API endpoints: `POST /api/chat`, `POST /api/greeting`, `GET /api/debug`,
  `GET /api/testchat`.
- Provider chain: Gemini → Groq (models `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) →
  static fallback.
- Keys: `GEMINI_API_KEY`, `GROQ_API_KEY` **or** `GROK_API_KEY` (from `.env`).
  **Never log full keys; only masked prefixes (4 chars prefix + masked tail) in diagnostics.**
- Chat tool-calling: `navigate_to` → handled client-side in `ChatWidget`.
- `buildPortfolioKnowledge` (api import) must remain Node-safe — no browser globals.

## Known issues / context (keep in mind)

- Production Vercel has **zero env vars set** — chat/greeting fall back to static. Adding
  env vars is the fix (user-approved step).
- Gemini key hits **HTTP 429 quota** — Groq fallback is the working provider currently.
- `/debug` page + `/api/debug` is the canonical way to check the live state of both providers.
- `vercel dev` is the only local way to test `/api/*`+ the bot. Do not use `--port` (use `--listen`).

## Workflow for new work

1. Read the relevant files fully; check `src/content` and matching components.
2. Make the smallest scoped change. Match existing code style (plain function components,
   className strings, no CSS-in-JS).
3. Verify with `npx eslint <file>`; never run build.
4. Commit only when the user asks.