# Task: Implement scroll-animated 3D car models across 5 sections

## Context

We have 5 consecutive page sections (already scaffolded, mostly empty) that need two 3D car models integrated with scroll-driven position/rotation animation. Read this entire spec before writing code — several sections depend on decisions made earlier in the spec (asset loading strategy in particular).

## Assets

Two optimized `.glb` files (Draco-compressed geometry, PNG textures — texture compression pending, do not assume WebP/KTX2 yet, verify by inspecting the file):

- `/models/supra_mk4_opt.glb` — Toyota Supra MK4
- `/models/gtr_r34_opt.glb` — Nissan Skyline R34 GT-R (~4.5MB, 25 meshes, ~191k triangles, Draco-compressed)

Confirm the Supra file has gone through the same optimization pipeline (Draco + mesh join/weld) before treating it as production-ready — if not, flag it back to me rather than proceeding with the raw ~13MB version.

## Tech stack

Use **React Three Fiber** + **@react-three/drei** for the 3D scene, and **GSAP with ScrollTrigger** for scroll-driven animation timelines. If the project already has a different 3D or scroll-animation stack in place (check `package.json` before starting), tell me what's there instead of assuming — don't introduce a second competing library for either concern.

## Critical architectural rule: single persistent scene

**Do not mount/unmount the 3D canvas or the models per-section.** Both models should load once (on page load or on approach to the first 3D section, per the loading strategy below) and remain mounted for the full duration the user is within sections 1–5. Only their `position`, `rotation`, and `visible`/opacity should change as the user scrolls. Remounting models between sections will cause reload flicker and re-trigger the loading cost — this defeats the point of preloading and will look broken.

Structure it as one `<Canvas>` (likely fixed/sticky positioned, spanning the scroll height of sections 1–5) with the two model components inside, and drive their transforms from scroll progress computed across that combined region.

## Section-by-section behavior

Confirm exact camera framing and pixel-level look with me/the designer before finalizing numbers — the below defines *relative* behavior; you'll need to tune actual position/rotation values against the real viewport and camera FOV.

**Section 1** — Supra, position/rrotation "A" (e.g., angled 3/4 front view, roughly centered or slightly off-center)

**Section 2** — Supra transitions to position/rotation "B" (a distinctly different angle/position from Section 1 — e.g., rotated to show the rear 3/4, or shifted to the opposite side of the frame). This should read as a deliberate reveal, not a subtle drift.

**Section 3 (dual model, partial off-screen)** — Both cars visible simultaneously:
- One car positioned off-screen-left, only its front bumper and front wheel visible within the viewport
- The other car positioned off-screen-right, mirrored (front bumper + front wheel visible)
- Confirm with me which car goes left vs right — not specified yet
- **Off-screen positioning must be computed from actual camera frustum width at the model's z-depth** (using `camera.fov`, `aspect`, and distance to the model), not a hardcoded x-value — hardcoded offsets will break across different viewport widths/aspect ratios
- Since both models are fully loaded and in the scene graph here (even though partially off-screen), be mindful of combined draw cost — see Performance section below

**Section 4** — Skyline, position/rotation "A"

**Section 5** — Skyline transitions to position/rotation "B" (same "distinct reveal" principle as Section 2)

Supra should not be visible/rendered-relevant during sections 4–5, and vice versa for the Skyline during 1–2 — either move them fully out of frustum or toggle a lightweight visibility flag; don't fully unmount (per the persistent-scene rule above).

## Scroll-driven animation mechanics

- Use GSAP `ScrollTrigger` with `scrub: true` (not `once`/discrete triggers) so transforms track scroll position continuously and reverse cleanly on scroll-up
- Each section's transform target is a keyframe; interpolate between them using GSAP timelines or `gsap.to()` calls scoped to each section's `ScrollTrigger` (`start`/`end` tied to that section's viewport entry/exit)
- Avoid `Math.lerp`-per-frame hand-rolled solutions unless GSAP is unavailable — ScrollTrigger already handles this cleanly and avoids jank from unthrottled scroll listeners
- Test scroll-up (reverse direction) explicitly — a common bug is one-directional-only animation logic

## Loading strategy (integrate with existing loading screen)

- Preload both `.glb` files via `useGLTF.preload()` before the user reaches Section 1 — trigger this during the site's existing loading screen / initial load sequence, not lazily on scroll-into-view
- Wrap the model components in `<Suspense>` with a fallback that ties into the existing loading UI pattern already used elsewhere on the site (check how the mode-switch loading screen is implemented and reuse that pattern/component rather than building a new one)
- If preload isn't complete by the time the user scrolls into Section 1, keep the loading screen active rather than showing an empty/partial scene

## Performance requirements

- Enable frustum culling (default in three.js, just don't explicitly disable it)
- Confirm `KHR_draco_mesh_compression` is being decoded correctly — R3F/drei's `useGLTF` needs the Draco decoder path set (`useGLTF.preload(path, true)` or configuring `DRACOLoader` decoder path via `useGLTF.setDecoderPath()`) or the model will fail to load silently/error out. Don't skip this — it's a common integration gap with Draco-compressed assets.
- Profile actual frame rate in Section 3 (both models in scene) using browser devtools performance panel — if it drops meaningfully below 60fps (or 30fps on throttled mobile CPU simulation), report back before proceeding further rather than shipping a janky section
- If a mobile mode/breakpoint exists on this site (per earlier project context), check whether it's reasonable to substitute lower-poly versions or skip the 3D scene entirely on mobile — flag this decision back to me rather than assuming either way

## Acceptance checklist (verify before calling this done)

- [ ] Both models load once, stay mounted, never flicker/reload when scrolling between sections
- [ ] Scroll up and scroll down both animate correctly (not just forward)
- [ ] Section 3's off-screen positioning holds correctly at at least 3 different viewport widths (narrow laptop, wide desktop, and whatever your mobile breakpoint is if 3D is enabled there)
- [ ] No console errors related to Draco decoding
- [ ] Loading screen covers the full preload duration — no flash of missing/low-poly geometry
- [ ] Frame rate in Section 3 (dual model) doesn't visibly stutter on a mid-tier device/throttled profile

If anything above is ambiguous or the exact position/rotation values need real numbers rather than descriptions, ask rather than guessing — this spec intentionally leaves precise transform values open pending visual review.
