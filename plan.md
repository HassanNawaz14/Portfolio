# Mobile/Desktop Code Separation Plan

## Goal
Make the portfolio website mobile-compatible by creating parallel mobile versions of all files, keeping original desktop files untouched, with a toggle button to switch between modes.

---

## 1. Mirror Directory Structure

Create `src/mobile/` that mirrors the current `src/` structure:

```
src/
├── components/          (DESKTOP - untouched)
├── pages/               (DESKTOP - untouched)
├── assets/              (shared - reused by both)
├── App.jsx              │
├── App.css              ├── (DESKTOP - untouched)
├── index.css            │
├── main.jsx             │
│
├── context/
│   └── ModeContext.jsx  (NEW)
│
└── mobile/
    ├── components/      (copies of all 14 components → adapted for mobile)
    ├── pages/           (copies of all 5 pages → adapted for mobile)
    ├── App.jsx          (mobile routing – adapted)
    ├── App.css          (mobile styles – rewritten)
    └── index.css        (mobile global styles – rewritten)
```

## 2. Mode Switching (`src/context/ModeContext.jsx`)

- **React Context** providing `mode` (`'desktop'` | `'mobile'`) and `setMode`
- Persisted in `localStorage` so preference survives refreshes
- Adds class `mode-desktop` or `mode-mobile` to `<body>` for CSS namespacing
- Exports `ModeProvider` wrapper and `useMode` hook

## 3. Minimal Modifications to Original Files

Only two files change in the original codebase:

| File | Change |
|------|--------|
| `src/main.jsx` | Wrap `<App />` with `<ModeProvider>` |
| `src/App.jsx` | Use `React.lazy()` to dynamically load desktop or mobile component trees based on mode + render floating toggle button |

No other original file is touched.

## 4. Lazy Loading (in modified `src/App.jsx`)

```jsx
const DesktopHome = lazy(() => import('./pages/Home'))
const MobileHome  = lazy(() => import('./mobile/pages/Home'))
// ... same for all 5 pages and 14 components
```

Active mode determines which set of imports renders. Switching modes cleanly unmounts one tree and mounts the other.

## 5. CSS Strategy

- **Desktop CSS** stays as-is (global selectors) — always imported
- **Mobile CSS** selectors prefixed with `.mode-mobile` (e.g., `.mode-mobile .hero`)
- Body class changes with mode, so mobile styles only apply when `.mode-mobile` is active
- Both CSS files imported globally — no conflict because mobile rules are scoped

## 6. Toggle Button

- Small floating button (bottom-right, matching site's glass aesthetic)
- Icon: `fa-mobile-screen-button` / `fa-desktop` (FontAwesome)
- Toggles mode → updates localStorage → body class changes → lazy components re-render
- Animated with Framer Motion

## 7. Workflow Per Section

For each section (Hero, About, Skills, Experience, Contact, etc.):

1. Copy the `.jsx` file to `src/mobile/components/`
2. Rewrite JSX for mobile layout (stack vertically, smaller, touch-friendly)
3. Copy relevant CSS to `src/mobile/index.css` / `src/mobile/App.css`
4. Prefix selectors with `.mode-mobile`
5. Redesign as needed — desktop version remains pristine

## Key Advantages

- ✅ Zero modification to existing desktop code (except `main.jsx` + `App.jsx`)
- ✅ Desktop continues to work exactly as before
- ✅ Mobile versions evolve independently, file-by-file
- ✅ Clean separation — easy to reason about and debug
- ✅ Shared assets (images, PDFs) reused, not duplicated
- ✅ Mode persists across sessions via localStorage
