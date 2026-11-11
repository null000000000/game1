# 06 — Technical Specification

**Version:** 1.0  
**Target build environment:** Google AI Studio (Build mode)  
**Architecture:** static client-side web app for MVP.

## 1. Recommended stack

- React + TypeScript.
- Vite-based web application output (or the closest supported React web scaffold in the selected Google AI Studio Build workflow).
- Motion for React (`motion` package) for the reveal and completion transitions.
- CSS Modules or a small global CSS design-token layer; avoid a large component framework unless the scaffold already includes one.
- `lucide-react` for consistent interface icons.
- Static `challenges.json` bundled with the app.
- Browser `localStorage` for progress and shuffle-bag persistence.

Do not add a server, database, authentication provider, AI API call, or paid service for the MVP. The 100 challenges are curated content, not generated at runtime.

## 2. Suggested project structure

```text
src/
  app/
    App.tsx
    routes.tsx                 # optional; one-screen app may not need routing
  components/
    HomeScreen.tsx
    ChallengeCard.tsx
    RevealStage.tsx
    CompletionState.tsx
    CategoryBadge.tsx
    AppHeader.tsx
  data/
    challenges.json
  hooks/
    useChallengeGame.ts
    useReducedMotionPreference.ts
  lib/
    challengeBag.ts
    persistence.ts
    validation.ts
  styles/
    tokens.css
    globals.css
    motion.css
  types/
    challenge.ts
  main.tsx
```

Keep the implementation smaller if the generated scaffold is compact; the structure is a guide, not a reason to over-engineer.

## 3. Data contract

Use the shipped `challenges.json` file. It contains:
- `schema_version`
- `language`
- `total_challenges`
- `category_counts`
- `categories`
- `global_safety_rules_ar`
- `challenges[]`

Each challenge contains:
- `id`: stable unique ID (`CH001` … `CH100`)
- `category`: one of `SOCIAL`, `CREATIVE`, `EXPLORE`, `FUN`, `BRAIN`
- `category_ar`
- `title_ar`
- `description_ar`
- `duration_minutes`
- `difficulty`: `easy` or `medium`
- `safety_note_ar`: empty string when not needed

Do not create new challenges dynamically in the MVP. Do not silently rewrite the source dataset in generated code.

## 4. TypeScript types

```ts
export type ChallengeCategory =
  | "SOCIAL"
  | "CREATIVE"
  | "EXPLORE"
  | "FUN"
  | "BRAIN";

export type Difficulty = "easy" | "medium";

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  category_ar: string;
  title_ar: string;
  description_ar: string;
  duration_minutes: number;
  difficulty: Difficulty;
  safety_note_ar: string;
}

export type GameStatus =
  | "HOME"
  | "REVEALING"
  | "REVEALED"
  | "ACTIVE"
  | "COMPLETED";

export interface GameState {
  schemaVersion: 1;
  remainingIds: string[];
  currentChallengeId: string | null;
  lastDrawnId: string | null;
  status: GameStatus;
  completedIds: string[];
}
```

## 5. Shuffle bag algorithm (reference implementation)

```ts
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createBag(
  ids: string[],
  previousLastId: string | null
): string[] {
  const bag = shuffle(ids);
  if (bag.length > 1 && bag[bag.length - 1] === previousLastId) {
    // The implementation below assumes pop() draws from the end.
    [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  }
  return bag;
}

export function drawNext(state: GameState, allIds: string[]) {
  const remaining = state.remainingIds.length
    ? [...state.remainingIds]
    : createBag(allIds, state.lastDrawnId);

  const nextId = remaining.pop();
  if (!nextId) throw new Error("Challenge library is empty");

  return {
    ...state,
    remainingIds: remaining,
    currentChallengeId: nextId,
    lastDrawnId: nextId,
    status: "REVEALING" as const,
  };
}
```

Implementation note: because the bag is consumed with `pop()`, the boundary-repeat check must inspect the element that will be drawn first (`bag[bag.length - 1]`). Persist the updated state immediately after selecting the ID and before running the reveal animation.

## 6. Persistence contract

- Key: `random-challenge-game:v1`.
- Read in a guarded `try/catch`; localStorage may be unavailable or contain invalid JSON.
- Validate `schemaVersion`, status, current ID, completed IDs, and every remaining ID against the current library.
- Store only IDs and small state values; do not store duplicate full challenge objects.
- Save after draw, start, completion, skip, and reset.
- If persistence fails, continue in memory and show a discreet non-blocking note only when necessary.
- Never store personal data; no account is required.

## 7. State transitions

- Home CTA: `HOME` → select + persist ID → `REVEALING` → `REVEALED` after animation completes.
- Start: `REVEALED` → `ACTIVE`.
- Complete: `REVEALED | ACTIVE` → add ID to `completedIds` → `COMPLETED`.
- Skip: `REVEALED | ACTIVE` → keep the already-consumed item out of bag → draw next → `REVEALING`.
- New challenge: `COMPLETED` → draw next → `REVEALING`.

A challenge is consumed when drawn. Do not put a skipped challenge back into the current bag. Completion should not be required to draw another one.

## 8. Design tokens

```css
:root {
  color-scheme: light;
  --color-primary: #7667D9;
  --color-coral: #F28B82;
  --color-mint: #91C9B7;
  --color-yellow: #F4D58D;
  --color-sky: #73C9F5;
  --color-background: #F8F7F3;
  --color-surface: #FFFFFF;
  --color-text: #292638;
  --color-muted: #777386;
  --color-border: #E9E6F0;
  --radius-card: 22px;
  --radius-button: 18px;
  --shadow-card: 0 12px 32px rgba(41, 38, 56, 0.08);
}
```

## 9. Accessibility and quality

- Set document language to `ar` and direction to `rtl`.
- Use semantic `<button>` elements and visible focus states.
- Use `aria-live="polite"` for challenge reveal and completion confirmation where helpful.
- Ensure keyboard activation and logical focus order.
- Respect `prefers-reduced-motion`.
- Avoid color-only information and verify contrast.
- Do not trap focus in non-modal UI.
- Check browser console for errors and validate the JSON at startup or build time.

## 10. Error handling

- Invalid challenge data: show a friendly fallback screen and log a developer-readable error; do not render a broken card.
- Missing localStorage: continue with a fresh in-memory bag.
- Invalid saved state: rebuild bag from valid IDs and continue.
- Empty challenge list: show a clear empty-state message; do not spin forever.
- Repeated CTA tap during animation: ignore / disable until reveal ends.

## 11. Deployment assumptions

The app should build as a static web app and be deployable to any static hosting provider supported by the user's workflow. Do not hard-code a hosting vendor, API key, or environment secret. Provide a README with run/build instructions after the generated code is produced.

## 12. Definition of done

- `challenges.json` validates as exactly 100 records.
- Random draw never repeats within a cycle.
- State survives refresh when browser storage is available.
- Core flows work with keyboard and touch.
- Reveal and completion animations work and honor reduced-motion settings.
- RTL Arabic layout is correct on mobile and desktop.
- No login, backend, friend challenge, user-submission, or runtime AI generation exists in MVP.
