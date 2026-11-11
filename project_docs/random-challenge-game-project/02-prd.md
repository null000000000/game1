# 02 — Product Requirements Document (PRD)

**Product:** Random Challenge Game (working title)  
**Version:** 1.0 — MVP  
**Status:** Approved product direction; implementation-ready baseline.

## 1. Product summary

A light-mode, mobile-first web game that reveals one random, pre-written challenge from a curated library of exactly 100 challenges. The challenge library is shipped with the app; users do not submit, assign, or send challenges to one another. The animation around selecting and revealing a challenge is a core part of the product experience.

## 2. Problem and opportunity

Sometimes people want a quick, fun thing to do but do not want to think of an idea themselves. The product removes that decision friction: one tap produces one small, understandable, feasible activity.

## 3. Product goals

- Make getting a challenge possible in one tap from the home screen.
- Make the selection/reveal feel delightful and understandable.
- Provide enough variety through five balanced categories.
- Avoid repeating a challenge within the same 100-item shuffle cycle.
- Keep sessions low-pressure, safe, and usable without an account.
- Work smoothly on common mobile and desktop browsers.

## 4. Non-goals (explicitly out of scope for MVP)

- User-generated or user-submitted challenges.
- Sending/assigning challenges to friends or receiving friend suggestions.
- Social feed, chat, profiles, followers, comments, or leaderboards.
- AI-generated challenges at runtime.
- Paid features, subscriptions, ads, or in-app purchases.
- Mandatory accounts, backend services, or cloud sync.
- Habit tracking, streaks, productivity goals, or penalties for skipping.
- Dark mode in v1.

## 5. Target users and primary use case

A person opens the site during a free moment, taps the main CTA, watches a short shuffle/reveal, reads a simple challenge, and chooses to do it, skip it, or return later. The product should make sense without onboarding or an explanation page.

## 6. MVP scope and functional requirements

### P0 — must ship

**FR-01: Home screen**  
Show a short value proposition, a single primary CTA, and a lightweight indication that 100 challenges are available. The CTA starts the reveal flow.

**FR-02: Curated challenge library**  
Load exactly 100 static challenges from `challenges.json`: 20 Social, 20 Creative, 20 Explore, 20 Fun, and 20 Brain & Observation. Each challenge has a unique ID, category, Arabic title and description, estimated duration, difficulty, and optional safety note.

**FR-03: Random draw without repeats within a cycle**  
Use a shuffled bag. Draw each challenge at most once in a cycle. When the bag is exhausted, create a new shuffled cycle. Persist the remaining bag and previous draw so a refresh does not reset the sequence. Avoid placing the last challenge of the previous cycle first in the next cycle when more than one item exists.

**FR-04: Animated reveal**  
On start, show a short shuffle animation and then reveal exactly one challenge. The animation must not change which challenge the randomization logic selected.

**FR-05: Challenge actions**  
After reveal, allow the user to:
- Start / accept the challenge.
- Mark it complete.
- Skip / get another challenge.

Skipping is always allowed and has no penalty. A challenge is consumed from the current shuffle bag when it is first revealed, not when it is completed.

**FR-06: Completion feedback**  
When marked complete, show a brief celebration and friendly confirmation. Do not require proof, photo, upload, or explanation.

**FR-07: Local persistence**  
Persist the shuffle bag, last shown ID, completion history, and current challenge state in `localStorage`. App must still work if storage is unavailable; in that case use in-memory state and show no blocking error.

**FR-08: Responsive and accessible UI**  
Support narrow mobile widths and desktop. Provide keyboard-operable buttons, visible focus states, semantic headings, readable contrast, and reduced-motion behavior.

### P1 — desirable, only if it does not delay the core game

- Small sound toggle, off by default; never autoplay sound.
- Simple completed count (e.g. “3 challenges completed”), without streaks or ranking.
- Reset progress action with a confirmation step.

### Not in MVP

Category browsing/filtering, accounts, social sharing, backend, admin CMS, analytics SDK, badges/levels, leaderboards, and AI generation.

## 7. Core user flow

1. Home → tap “ورّيني التحدي”.
2. Shuffle animation → challenge card reveal.
3. User chooses “هعمله” / “خلصت التحدي” or “تحدي تاني”.
4. On completion → celebratory state → “تحدي جديد”.
5. On skip → next draw; no guilt, penalty, or public record.

## 8. State model

`HOME` → `REVEALING` → `REVEALED` → (`ACTIVE` → `COMPLETED`) or `SKIPPED` → `REVEALING`.

- `HOME`: no current challenge displayed.
- `REVEALING`: selected challenge is already fixed; visual shuffle is playing.
- `REVEALED`: title, description, category, time, difficulty, and safety note are visible.
- `ACTIVE`: user has accepted / started it.
- `COMPLETED`: user voluntarily marks it done; show celebration.
- `SKIPPED`: current challenge is dismissed; immediately allow next draw.

A challenge can be marked complete directly from `REVEALED` to minimize friction. “Accept” is not a commitment and must not block skipping.

## 9. Randomization and persistence rules

- Use Fisher–Yates shuffle for the bag.
- Store a list of remaining challenge IDs, not duplicate challenge objects.
- On draw: take one ID from the end of the bag, resolve it from the immutable challenge library, persist the updated bag and current item.
- A newly revealed challenge is removed from the bag even if later skipped.
- On cycle reset, shuffle all 100 IDs. If the first item equals the previous cycle's last shown ID and the bag has more than one item, swap it with another position.
- Validate stored IDs against the current library on load; discard invalid or old-version state safely.
- Storage key: `random-challenge-game:v1`.
- Data schema should carry a `schemaVersion` so future changes can migrate or reset safely.

## 10. Content and safety rules

- Every challenge must be doable with ordinary surroundings and no required purchase.
- No dangerous physical stunts, trespassing, illegal acts, harassment, humiliation, or pressure to approach strangers.
- Social challenges are limited to people the user already knows or people who have clearly consented to participate.
- Never require exposing personal data or filming / posting another person.
- Outdoor challenges must mention familiar, public, safe settings and daylight where relevant.
- User can skip any challenge at any time without penalty.

## 11. Success metrics (lightweight, privacy-conscious)

For local MVP validation, prefer manual testing and aggregate counts over third-party tracking. Useful indicators:
- Time from page load to first reveal.
- Percentage of sessions that reach a revealed challenge.
- Completion-to-reveal ratio (directional only; not a user score).
- Repeated IDs within a single cycle: target 0.
- App load and interaction responsiveness on mid-range mobile devices.

Do not add analytics collection without a separate privacy decision.

## 12. Acceptance criteria

- [ ] The JSON parses and contains exactly 100 unique challenge IDs.
- [ ] Each of the five categories contains exactly 20 challenges.
- [ ] Home has one visually dominant CTA.
- [ ] Tapping the CTA reveals one challenge after the animation.
- [ ] No challenge repeats before the current bag is exhausted.
- [ ] Refreshing the page preserves the remaining bag and completion count when localStorage is available.
- [ ] Skipping never causes a penalty or blocks the user.
- [ ] Marking complete displays celebration feedback.
- [ ] Reduced-motion preference disables or simplifies non-essential movement.
- [ ] The site works without login and without a backend.
- [ ] All core controls work on mobile and desktop.

## 13. Release definition

MVP is complete when all P0 requirements and acceptance criteria pass, the 100-item file is validated, and the game has been tested on at least one mobile and one desktop viewport.
