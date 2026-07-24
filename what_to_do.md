# Portfolio AI Assistant — Implementation Spec

Hand this whole document to your coding agent as its task brief.

## Context (give the agent this before anything else)

- Existing repo: React + Vite portfolio (GitHub: `HassanNawaz14/Portfolio`), deployed on Vercel at `hassan-nawaz-portfolio00.vercel.app`.
- The site currently calls Gemini (primary) and Grok (fallback) directly from the frontend for a simple prompt-in/response-out feature. Those API calls and any exposed keys are being replaced by this spec — do not leave the old client-side calls in place once the new API routes work.
- Goal: a portfolio-aware AI chat assistant, plus an auto-triggered first-load welcome popup that mixes static content with one small AI-generated greeting.
- Hard constraints:
  - No database, no auth, no persistent server. The only backend allowed is Vercel serverless functions living in this same repo/project (deploy together, nothing to host separately).
  - No RAG / embeddings / vector store. The portfolio's total content is small enough to pass to the model directly on every call — don't add retrieval infrastructure.
  - Do not restyle or redesign existing pages. This is additive. New components should match the existing motion language (GSAP ScrollTrigger, react-spring parallax, Framer Motion) — reuse existing animation conventions rather than introducing a new one.

## Phase 1 — Content layer (single source of truth)

Create `src/content/` with typed modules:

- `sitemap.ts` — one entry per page: `{ route, title, icon, sections: [{ id, anchor, title, description, keywords[] }] }`. This is the map the AI uses for navigation *and* what the popup's static "sketch" renders from.
- `projects.ts`, `experience.ts`, `skills.ts` — audit existing components first; if project/experience data is already stored in similar structures, normalize into this shape rather than duplicating it. If it's currently hardcoded inline in JSX, migrate it out here without changing visual output.
- `announcements.ts` — `{ id, date (ISO string), text, link? }[]`, manually maintained by Hassan going forward (not AI-generated — these are facts, they should never be improvised).

Define TypeScript interfaces for all of the above in `src/content/types.ts`.

## Phase 2 — Knowledge base compiler

Create `src/lib/buildPortfolioKnowledge.ts`:

- A pure function that imports every content module and flattens it into one markdown string: page by page, section by section, each with its route+anchor, plus a compact digest of projects/experience/skills.
- Favor short descriptions (1–3 sentences per item) over full page text — the goal is enough for the model to answer accurately and route people correctly, not to reproduce every word of the site.
- This function must be called at *request time* inside the serverless function (Phase 3), never pasted into a prompt by hand. That's what keeps the AI's knowledge in sync automatically whenever content files change.

## Phase 3 — Vercel serverless functions

Create two API routes (or one handler with a `mode` switch):

**`/api/chat`**
- Input: `{ messages: {role, content}[] }`
- Server-side: build system prompt = `buildPortfolioKnowledge()` output + a persona/guardrail block (assistant only answers about Hassan/the portfolio; politely declines unrelated requests; keeps answers concise).
- Call Gemini first; on error/timeout, retry with Grok.
- Include a `navigate_to(route, anchor)` tool/function definition in the request (both providers support function calling) so the model can request an in-app navigation action instead of just describing where to go. Return any tool call in the response payload alongside the text.
- Never log or return the API keys; read them from `process.env.GEMINI_API_KEY` / `process.env.GROK_API_KEY` (set as Vercel environment variables).

**`/api/greeting`**
- Input: none required (read `announcements.ts` server-side) or optionally `{ announcements }` from the client.
- Build a *small* dedicated prompt — announcements + current date + a short tone instruction (e.g. "write a warm 2–3 sentence welcome referencing the most relevant announcement below, in this voice: ..."). Do **not** pass the full knowledge base here — this call should be cheap and fast.
- Same Gemini→Grok fallback pattern.
- Return just the short greeting string.

Add lightweight abuse protection: a client-side soft cap on messages per session, reasonable request size limits, and note (as a flagged follow-up, not something to solve now) that true per-IP rate limiting may need Vercel KV/Edge Config depending on plan — don't add a database to solve this.

## Phase 4 — Chat widget component

- Floating button (fixed position, consistent with the site's existing motion/entrance style) that expands into a chat panel.
- Calls `/api/chat` — no direct provider calls from the client anymore.
- Renders assistant responses; when a response includes a `navigate_to` action, render an inline "Take me there →" button that performs a client-side route change and scrolls to the target anchor.
- Keep conversation history in component state only (no persistence needed).
- If both providers fail, show a friendly static fallback message rather than an error.

## Phase 5 — Welcome popup

- Auto-triggers on first load. Use a `localStorage` timestamp (e.g. `portfolio_welcome_last_shown`) so it reappears at most once per day rather than every single visit — cheap to build, avoids annoying repeat visitors.
- **Static shell (no AI):**
  - A compact visual index built from `sitemap.ts` — icons/labels + one-line descriptions for each page.
  - An "Announcements" list rendered directly from `announcements.ts`.
- **Dynamic slice (the one AI call):**
  - On mount, call `/api/greeting`. Show a shimmer/skeleton in that region while pending, then fade or type in the result.
  - Cache the result in `sessionStorage`, keyed by a hash of `(announcements content + today's date)`, so reloading within the same session/day doesn't re-trigger the call.
  - Always have a static fallback greeting string ready for total API failure — this is the first thing visitors see, so it must never look broken.

## Acceptance checklist

- [ ] No Gemini/Grok API keys anywhere in the client bundle (check the built `dist/` output, not just source)
- [ ] Editing `content/projects.ts` changes both the rendered project page and the AI's answers, with no prompt string touched by hand
- [ ] Adding an entry to `content/announcements.ts` changes both the popup's static list and (after cache invalidation) the AI greeting
- [ ] Chat widget correctly answers "where can I find X" and offers a working navigation action
- [ ] Popup shows on first visit, doesn't re-trigger more than once/day, and degrades gracefully with a static fallback if both AI providers are unreachable
- [ ] Existing page visuals/animations are unchanged — this work is purely additive
