# 04 — Motion Design System

**Version:** 1.0  
**Priority:** Core product differentiator  
**Principle:** Motion creates anticipation and delight; it must never slow down the game.

## 1. Motion principles

1. **One hero animation:** the challenge reveal receives the most attention.
2. **Short by default:** most micro-interactions complete in 120–240 ms.
3. **Clear feedback:** every tap has a visual response.
4. **No motion tax:** users should not wait through long decorative sequences.
5. **Respect preferences:** follow `prefers-reduced-motion` and offer a reduced-motion experience.
6. **Performance first:** animate `transform` and `opacity`; avoid repeatedly animating layout dimensions or expensive blur/filter effects.

## 2. Motion tokens

| Token | Duration | Use |
|---|---:|---|
| `instant` | 100 ms | Press feedback |
| `micro` | 160 ms | Hover, focus, small icon movement |
| `short` | 220 ms | Button/card transitions |
| `medium` | 360 ms | Card entrance and state transitions |
| `reveal` | 1100 ms | Main shuffle and reveal sequence |
| `celebrate` | 900 ms | Completion confetti / sparkles |

**Easing**
- Standard: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Enter: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Exit: `cubic-bezier(0.4, 0, 1, 1)`.

## 3. Signature animation — Challenge Shuffle / Reveal

**Trigger:** user taps the Home CTA or “تحدي تاني”.

**Sequence (target 1100–1400 ms total)**
1. CTA press compresses slightly (scale 0.97) and returns.
2. Current card exits upward/fades (120–180 ms) if one exists.
3. A small deck of decorative cards appears and shifts horizontally/rotates by a few degrees (450–600 ms).
4. Back cards settle; selected card enters with spring-like scale from 0.94 to 1 (250–350 ms).
5. Category chip and metadata fade in (120–180 ms).

Important implementation rule: choose the challenge once in the state/store before starting this sequence. The motion is theatrical only; it must not repeatedly call the randomizer.

## 4. Card states

- **Idle:** slight visual depth; no constant bouncing.
- **Hover (pointer devices):** translateY(-3 px), modest shadow increase.
- **Press:** scale(0.985), then spring back.
- **Entering:** opacity 0 → 1, translateY(14 px) → 0, scale 0.96 → 1.
- **Leaving:** opacity 1 → 0, translateY(-8 px), short duration.

## 5. Completion celebration

- Trigger only after explicit user completion.
- Use a small, brief burst of confetti or stars around the card, not a full-screen obstruction.
- Duration target: 700–1000 ms.
- Keep confirmation text visible after particles stop.
- Do not automatically play sound; sound, if implemented, is opt-in and starts off.

## 6. Micro-interactions

| Element | Feedback |
|---|---|
| Primary button | Press scale + soft color transition |
| Secondary button | Subtle background tint |
| Category pill | Fade/scale entrance |
| Metadata icons | Small opacity/position transition |
| Completion mark | Check icon draws/fades in |
| Floating decoration | Very slow drift; disabled for reduced motion |

## 7. Reduced-motion mode

When `prefers-reduced-motion: reduce` is active:
- Remove card shuffling, parallax, continuous floating, and confetti particles.
- Reveal using a short opacity fade (≤120 ms) or immediately.
- Preserve clear state feedback through text, borders, and icons.
- Do not make the game harder to understand without animation.

## 8. Performance and implementation

- Recommended library: Motion for React (`motion` package) for React animation orchestration.
- Prefer transforms and opacity; use CSS for simple hover/focus transitions.
- Use `AnimatePresence` only where exit transitions materially improve clarity.
- Keep particle count modest (roughly 12–20 small particles maximum).
- Do not add a heavy 3D engine for this product.
- Avoid autoplaying sound and avoid infinite high-frequency motion.
- Test at mobile viewport sizes and on a mid-range device; animation should remain responsive.

## 9. Motion QA checklist

- [ ] Reveal duration stays around 1.1–1.4 seconds.
- [ ] Rapid taps cannot start overlapping reveal sequences.
- [ ] The chosen challenge does not change during the animation.
- [ ] Completion animation fires only after explicit completion.
- [ ] Reduced-motion preference is respected.
- [ ] Animations do not cause layout shifts or horizontal overflow.
- [ ] No sound plays automatically.
