# 07 — Google AI Studio Build Prompt

انسخ الـPrompt التالي إلى Google AI Studio Build mode بعد إرفاق ملفات المشروع، خصوصًا `challenges.json` والـBrand Identity والـPRD.

---

You are a senior product engineer and motion-focused UI designer. Build a polished, responsive, Arabic-first web game from the attached project documents.

## Product

This is a solo-first Random Challenge Game. The user opens the site and reveals one random challenge from the fixed local library of exactly 100 pre-written challenges in `challenges.json`.

This is NOT a social network, task manager, habit tracker, or AI challenge generator. Do not add user-submitted challenges, friend-to-friend challenge sending, accounts, chat, feed, leaderboard, or a backend.

## Non-negotiable design direction

- Playful Minimal.
- Light mode only. Do not implement dark mode.
- Main background `#F8F7F3`.
- Primary purple `#7667D9`.
- Accent colors: coral `#F28B82`, mint `#91C9B7`, yellow `#F4D58D`, sky `#73C9F5`.
- White surfaces, dark readable text `#292638`, muted text `#777386`.
- Friendly, colorful, polished, playful but not childish.
- Arabic-first interface with correct RTL layout (`dir="rtl"`, `lang="ar"`).
- Use Cairo or IBM Plex Sans Arabic for Arabic and Inter for Latin text when available.
- Do not invent a final brand name or logo. Use a small neutral wordmark placeholder that is easy to replace.

## The most important requirement: animation

The challenge reveal animation is a core feature, not decoration.

Create a satisfying 1.1–1.4 second card-shuffle/reveal sequence: a few decorative cards move/rotate quickly, settle, and reveal the selected challenge card. Use Motion for React if the scaffold supports it. Animate transform and opacity; avoid heavy 3D effects and layout thrashing. The challenge must be selected once in application state before the animation begins. Never call the randomizer repeatedly just to animate the cards.

On completion, show a short, tasteful confetti/sparkle burst. Keep it brief and never block the next action. Respect `prefers-reduced-motion`: replace the shuffle and confetti with a quick fade or immediate state change. No sound autoplay; omit sound controls unless implemented cleanly with sound off by default.

## Game behavior

1. Home screen has one dominant CTA: `ورّيني التحدي`.
2. The CTA reveals one challenge from `challenges.json`.
3. Show category, title, description, estimated minutes, difficulty, and safety note only when present.
4. Actions: `هعمله`, `خلصت التحدي`, and `تحدي تاني`.
5. User can skip without penalty. No guilt, score loss, streak loss, warning, or lockout.
6. A challenge is consumed from the current shuffled bag as soon as it is revealed, whether completed or skipped.
7. Use a Fisher–Yates shuffle bag so no challenge repeats until all 100 have been drawn. On cycle reset, shuffle again and avoid making the last challenge from the previous cycle the first one in the next cycle when possible.
8. Persist remaining IDs, current challenge, last draw, completion IDs, and game status in localStorage. Validate saved IDs against the JSON library. If localStorage is unavailable or invalid, recover gracefully and continue in memory.
9. No login and no backend.

## UI requirements

- Mobile-first, responsive, centered game layout; max content width around 560px.
- Home should feel inviting and uncluttered, with subtle floating decorative shapes only when motion is allowed.
- Challenge card is the main focus; use generous spacing and 20–24px corner radius.
- Primary buttons must have large touch targets and clear pressed/focus feedback.
- Category colors are semantic accents, not full-screen backgrounds. Always maintain text contrast and do not rely on color alone.
- Keep the skip action visible but secondary.
- Use concise Egyptian Arabic copy. Do not introduce English UI text unless it is a tiny technical detail.

## Technical requirements

- React + TypeScript.
- Keep components small and maintainable.
- Treat `challenges.json` as the source of truth. Do not modify, omit, duplicate, or generate challenges.
- Add runtime validation or development checks that confirm exactly 100 unique IDs and 20 items per category.
- Keep data, shuffle logic, persistence, UI, and animation concerns separated.
- No unnecessary dependencies, analytics SDK, external APIs, or secret keys.
- Add useful comments around the shuffle-bag boundary logic and persistence recovery.

## Required implementation sequence

1. Inspect the provided documents and JSON.
2. Implement types and challenge data validation.
3. Implement the shuffle bag and localStorage persistence.
4. Implement the state machine and core screens.
5. Implement reveal and completion animations, including reduced-motion handling.
6. Apply the approved visual system and RTL layout.
7. Test the full flow: home → reveal → complete → next; home → reveal → skip → next; refresh persistence; bag exhaustion and new cycle; rapid repeated taps; reduced motion.
8. Fix all runtime, console, accessibility, and responsive issues you can identify.

Do not stop after producing a static mockup. Deliver a working interactive MVP.

---
