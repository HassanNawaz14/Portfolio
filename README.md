# Hassan Nawaz — Web Portfolio

A multi-mode, AI-assisted portfolio for **Hassan Nawaz** (data science × creative
engineering). Built with **React 19 + Vite**, shipping three interchangeable visual
"modes" (Desktop, Mobile, and a new Car-themed desktop mode), plus a **serverless AI
assistant** that powers the chat bot and the welcome greeting.

> This README is written so that **humans and AI agents** can pick up full context:
> architecture, the modes scheme, pages/sections, content, the AI layer, deployment,
> and conventions. Agents should also read **[AGENTS.md](./AGENTS.md)** for working rules.

---

## 1. Overview

The portfolio is a React SPA deployed on **Vercel**. It provides:

- **Three runtime-switchable display modes** — `desktop`, `mobile`, `car`.
- **Six routes** per mode: `/`, `/quicksite`, `/building`, `/projects`, `/profiles`, `/debug`.
- **AI portfolio assistant** (chat bot) that answers questions about Hassan and can
  navigate you around the site via a `navigate_to` tool call.
- **AI-generated welcome greeting** in the welcome popup.
- **API debugger page** (`/debug`) that live-diagnoses the Gemini/Groq integration.

### Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React **19** |
| Build | Vite **8** (`@vitejs/plugin-react`) |
| Routing | `react-router-dom` **7** (BrowserRouter) |
| Animation | `framer-motion` **12**, `@react-spring/web` **10**, `gsap` **3** |
| CSS | Plain CSS — 3 global stylesheets loaded in order (see §2) |
| Backend | **Vercel Serverless Functions** in `api/` (Node, ESM) |
| AI | Google **Gemini** (primary) → **Groq** (fallback), plain REST `fetch` |

---

## 2. The three modes

| Mode | Key | Icon | Audience | Purpose |
| --- | --- | --- | --- | --- |
| **Desktop** | `desktop` | `fa-house` | Desktop browsers | Flagship "cyber" portfolio |
| **Mobile** | `mobile` | `fa-mobile-screen-button` | Phones / small screens | Compact, scroll-first experience |
| **Car** | `car` | `fa-car` | **Desktop only** | Car-themed showcase (garage / racing / gauges) |

### Mode plumbing

- **Single source of truth:** `src/context/ModeContext.jsx`
  - Persists the choice in `localStorage['portfolio-mode']` so it survives reloads.
  - Valid values: `desktop | mobile | car` (enforced via `VALID_MODES`).
  - Device detection picks the *initial* mode only when no saved value exists.
  - On every change it re-sets the `<body>` class: `mode-desktop`, `mode-mobile`, or `mode-car`.
- **Switch UI:** `src/components/ModeSwitch.jsx` — fixed button top-right; three
  options (house / phone / car). `mode: null` on the third slot was recently
  changed to `mode: 'car'`.

### CSS scheme (important)

CSS is **global**, not per-mode. All three stylesheets are always loaded, in this order, from
`src/main.jsx`:

```js
import './index.css'        // 1. base / desktop-first theme
import './mobile/index.css' // 2. mobile override (overrides desktop where rules collide)
import './car/index.css'    // 3. car theme – LAST, most specific
```

Because of cascade order, the portfolio deliberately lets later files override earlier ones
— that's how the "responsive" look is achieved (mobile styles also bleed into desktop where
the same class name exists). When you add new rules, scope them under `body.mode-car` etc.
so they only affect their mode.

---

## 3. Folder structure

Example Structure (does not include all files)
```
.
├── api/                             # Vercel serverless functions (backend only)
│   ├── chat.js                    # POST /api/chat — chat bot (Gemini → Groq → static)
│   ├── greeting.js                # POST /api/greeting — welcome popup text
│   ├── debug.js                   # GET  /api/debug — live Gemini + Groq diagnostics
│   └── testchat.js                # Legacy key-format checker
├── public/
│   └── assets/                    # All Assets
├── src/
│   ├── main.jsx                   # entry — imports all 3 CSS files in order
│   ├── App.jsx                    # router: chooses <DesktopApp|MobileApp|CarApp>
│   ├── context/
│   │   └── ModeContext.jsx        # useMode() + ModeProvider, localStorage + body class
│   ├── lib/
│   │   └── buildPortfolioKnowledge.js  # compiles the shared AI "knowledge" prompt
│   ├── content/                    # ALL editable content (data-driven)
│   │   ├── types.ts                # shared TS interfaces
│   │   ├── sitemap.js  projects.js  experience.js  education.js  skills.js
│   │   ├── certifications.js  courses.js  announcements.js
│   ├── components/                # desktop components (some reused by car)
│   │   ├── Layout.jsx  Footer.jsx  ChatWidget.jsx  WelcomePopup.jsx
│   │   ├── ModeSwitch.jsx  ContactLinks.jsx
│   │   └── Hero NavigationStrip SectorHeader About Skills Certifications Education
│   │          Experience ExperienceCard Courses Contact Projects CurrentlyBuilding
│   │          Startup Profiles Header
│   ├── pages/                     # desktop pages
│   │   ├── Home.jsx  ProjectsPage.jsx  ProfilesPage.jsx
│   │   ├── QuickSitePage.jsx  BuildingPage.jsx
│   │   └── APIDebugger.jsx        # /debug UI
│   ├── mobile/                    # mobile mode
│   │   ├── App.jsx  Layout.jsx  Footer.jsx  ChatWidget.jsx  WelcomePopup.jsx
│   │   ├── index.css
│   │   ├── pages/                 # Home  QuickSitePage  BuildingPage  ProjectsPage  ProfilesPage
│   │   └── components/            # Hero  NavigationStrip  About  Skills  Certifications …
│   ├── car/                       # CAR MODE (desktop-only, car themed)
│   │   ├── index.css              # car theme (loaded last)
│   │   ├── components/
│   │   │   ├── Layout.jsx         # car shell (with car-app wrapper)
│   │   │   ├── Hero.jsx           # garage/gauges placeholder hero
│   │   │   └── Footer.jsx
│   │   └── pages/
│   │       ├── Home.jsx           # Hero + placeholder car sections
│   │       ├── QuickSitePage.jsx  BuildingPage.jsx  ProjectsPage.jsx  ProfilesPage.jsx
│   └── assets/                    # hero.png, ProfilePic.jpeg, CVs
├── vercel.json                 # rewrites /api/* to the serverless functions
├── vite.config.js
├── package.json  package-lock.json
├── .env                        # LOCAL ONLY — Gemini/Groq keys (git-ignored)
├── README.md                   # this file
└── AGENTS.md                   # agent working rules
```

---

## 4. Routing & pages

`src/App.jsx` mounts the right app per mode:

```jsx
{mode === 'mobile' ? <MobileApp /> : mode === 'car' ? <CarApp /> : <DesktopApp />}
```

Routes (identical across modes, different rendered trees):

| Path | Desktop | Mobile | Car |
| --- | --- | --- | --- |
| `/` | `DesktopHome` | `MobileHome` | `CarHome` |
| `/quicksite` | `QuickSitePage` | `MobileQuickSitePage` | `CarQuickSitePage` |
| `/building` | `BuildingPage` | `MobileBuildingPage` | `CarBuildingPage` |
| `/projects` | `ProjectsPage` | `MobileProjectsPage` | `CarProjectsPage` |
| `/profiles` | `ProfilesPage` | `MobileProfilesPage` | `CarProfilesPage` |
| `/debug` | `APIDebugger` | `APIDebugger` | `APIDebugger` |

### Desktop home sections (top → bottom)

1. `Hero` — animated intro with portrait.
2. `About`
3. `NavigationStrip` — morphing sector nav.
4. `Skills` — the "arsenal".
5. `Certifications` — hover-grow card row.
6. `Experience` (+ `ExperienceCard`)
7. `Education`
8. `Courses`
9. `Contact` — plus floating dock.

Sub-pages render `Startup`, `CurrentlyBuilding`, `Projects`, `Profiles`, and the API
debugger, respectively.

### Car mode home (scaffolded)

The car home currently renders a **placeholder** Hero + placeholder car sections
(About/Skills/Experience/Contact) using `src/car/` components and `car-*` CSS classes.
Sub-pages (`/quicksite`, `/building`, `/projects`, `/profiles`) reuse the shared desktop
components (`Startup`, `CurrentlyBuilding`, `Projects`, `Profiles`).

---

## 5. The AI assistant layer

All AI lives in `api/` serverless functions. The browser **never** sees API keys.

### Endpoints

| Endpoint | File | Behavior |
| --- | --- | --- |
| `POST /api/chat` | `api/chat.js` | `{ messages }` → `{ reply, toolCalls }` |
| `POST /api/greeting` | `api/greeting.js` | `{ announcements }` → `{ greeting }` |
| `GET /api/debug` | `api/debug.js` | Live diagnostics — probes Gemini + Groq, masked keys, classification, `diagnosis[]` + `fixes[]` |
| `GET /api/testchat` | `api/testchat.js` | Key-format checker |

### Provider strategy (both chat & greeting)

1. **Gemini** (primary): `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
2. **Groq** (fallback): `https://api.groq.com/openai/v1/chat/completions`,
   models `llama-3.3-70b-versatile` → `llama-3.1-8b-instant` (decommissioned
   models were removed).
3. If **all providers fail** → static fallback (HTTP 200).

Keys:
- `GEMINI_API_KEY` — Google AI Studio key (legacy `AIza…` or new `AQ.…`).
- `GROQ_API_KEY` **or** `GROK_API_KEY` — a Groq key (`gsk_…`). The code reads
  `GROQ_API_KEY || GROK_API_KEY`.

### Tool calling

The chat bot declares a `navigate_to` function. When the model invokes it, `api/chat.js`
returns `toolCalls: [{ name: 'navigate_to', args: { route, anchor } }]` and
`ChatWidget.jsx` renders a "Take me there" button that runs the navigation.

### The knowledge base

`src/lib/buildPortfolioKnowledge.js` compiles the entire portfolio into a plain-text
system prompt (sitemap, projects, experience, education, skills, announcements). It is
imported by `api/chat.js`, so it must stay **Node-compatible** (no browser APIs).

### Clients that call the API

- `src/components/ChatWidget.jsx` — panel + FAB; caps at `MAX_SESSION_MSGS` (50);
  posts to `/api/chat`, renders assistant text + nav tool buttons.
- `src/components/WelcomePopup.jsx` — fires once/day (`localStorage['portfolio_welcomed_shown']`),
  calls `/api/greeting`, caches in sessionStorage so it rarely re-hits the API.
  It is a silent fetch: on error it uses the built-in static greeting.
- Corresponding `src/mobile/…` versions exist.

### `/debug` page

`src/pages/APIDebugger.jsx` → calls `/api/debug` and renders:
masked key table, per-provider probe results (status/latency/error type), exact diagnosis + fixes,
then buttons to live-test `/api/chat` and `/api/greeting`.

---

## 6. Environment & secrets

**Local** — `.env` (git-ignored):

```
GEMINI_API_KEY=…
GROK_API_KEY=…   # (a Groq gsk_ key — held in GROK var, used as the Groq fallback)
```

**Production** — the same vars go in Vercel Project Settings → Environment Variables
(`production` + `preview`). ⚠️ **Currently NONE are set in production**, which is why the live
chat bot always returns the static fallback. Adding them + redeploying fixes it.
The `/debug` page reports the exact state in whichever environment you open it in.

Git-ignored: `.env`, `.env.*`, `.vercel`, `GEMINI.md` — never commit secrets.

---

## 7. Development

```bash
npx vercel dev --yes --listen 3000   # serves Vite + api/ together, loads .env
```

`npm run dev` (Vite only) does **not** serve `/api/*`, so the bot/popup won't work locally.
Other scripts:

```bash
npm run build
npm run preview
npm run lint
```

> Note: verify changed files with `npx eslint <file>`. Do **not** run `npm run build`
> unless explicitly told it's okay.

---

## 8. Troubleshooting stamps

From the `/api/debug` tool, the current known facts:

1. **Production missing keys** → static fallback (biggest cause of "chatbot not working").
2. **Gemini quota 429** — free-tier limits exhausted for `gemini-2.0-flash`;
   fallback currently carries the load (Groq works). Fix: reset/wait or upgrade billing or
   a fresh AI-Studio project.
3. **Decommissioned models** — `mixtral-8x7b-32768` was removed from the Groq model lists.
4. Port name & `--port` deprecated → use `--listen`.
5. `vercel dev` + `.env` = keys available; plain Vite ≠ API.

---

*Hassan Nawaz — Portfolio. Docs kept up to date for agent use; claim URLs/behavior before relying
on them.*