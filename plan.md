# Portfolio AI Assistant — Implementation Plan

## Phase 1 — Content Layer (single source of truth)

**Create:** `src/content/types.ts`, `sitemap.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `announcements.ts`

**Modify:** `src/components/Projects.jsx`, `Experience.jsx`, `Skills.jsx` — replace inline data with imports from `src/content/`

**Modify:** `src/mobile/components/Projects.jsx`, `Experience.jsx`, `Skills.jsx` — same treatment, importing from the same content modules

## Phase 2 — Knowledge Base Compiler

**Create:** `src/lib/buildPortfolioKnowledge.ts` — pure function that flattens all Phase 1 content into a markdown string for the system prompt. Called at request time inside the serverless function.

## Phase 3 — Vercel Serverless Functions

**Create:** `api/chat.js` (POST) — Gemini → Grok fallback with `navigate_to` tool calling, reads keys from env

**Create:** `api/greeting.js` (POST) — small prompt with announcements + date, same fallback

**Modify:** `vercel.json` — adjust rewrites so `/api/*` routes aren't caught by the catch-all

**Install:** `@google/generative-ai` npm package

**Client-side guard:** Session message cap (50), request size limit, graceful fallback

## Phase 4 — Chat Widget (both desktop & mobile)

**Create:** `src/components/ChatWidget.jsx` — floating button → expandable panel, calls `/api/chat`, renders inline nav buttons for `navigate_to` actions

**Create:** `src/mobile/components/ChatWidget.jsx` — same logic, mobile-styled

**Modify:** `src/components/Layout.jsx` — render ChatWidget site-wide

**Modify:** `src/mobile/components/Layout.jsx` — same

## Phase 5 — Welcome Popup (both desktop & mobile)

**Create:** `src/components/WelcomePopup.jsx` — `localStorage`-gated (once/day), static shell from `sitemap.ts` + `announcements.ts`, dynamic greeting from `/api/greeting` with `sessionStorage` cache + shimmer skeleton

**Create:** `src/mobile/components/WelcomePopup.jsx` — mobile-styled variant

**Modify:** `src/components/Layout.jsx` + `src/mobile/components/Layout.jsx` — render WelcomePopup

## Key Decisions

- **Animation:** Framer Motion throughout (consistent with existing codebase — GSAP/react-spring mentions in spec adapted to match current setup)
- **API routes:** Plain `.js` files (no build step needed on Vercel)
- **Platform:** Both desktop and mobile get Chat Widget + Welcome Popup
- **No old AI calls to remove** — building AI calling from scratch

## Acceptance Checklist

- [ ] No Gemini/Grok API keys in the client bundle (`dist/`)
- [ ] Editing `content/projects.ts` changes both the rendered project page and the AI's answers
- [ ] Adding an entry to `content/announcements.ts` changes both the popup's static list and the AI greeting
- [ ] Chat widget correctly answers "where can I find X" and offers a working navigation action
- [ ] Popup shows on first visit, doesn't re-trigger more than once/day, and degrades gracefully with a static fallback
- [ ] Existing page visuals/animations are unchanged
