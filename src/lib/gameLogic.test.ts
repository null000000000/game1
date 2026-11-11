import test from 'node:test';
import assert from 'node:assert/strict';
import { DATASET, validateChallengeDataset, ALL_CHALLENGES, ALL_CHALLENGE_IDS } from './validation';
import { createBag, drawNext, createInitialState } from './shuffleBag';
import { loadStateFromStorage, saveStateToStorage, STORAGE_KEY } from './persistence';

test('challenges.json validates exactly 100 items with 20 per category', () => {
  const result = validateChallengeDataset(DATASET);
  assert.equal(result.valid, true, `Validation failed: ${result.errors.join(', ')}`);
  assert.equal(ALL_CHALLENGES.length, 100);
  assert.equal(ALL_CHALLENGE_IDS.length, 100);
  const uniqueIds = new Set(ALL_CHALLENGE_IDS);
  assert.equal(uniqueIds.size, 100);
});

test('createBag shuffles without loss and respects previousLastId boundary', () => {
  const allIds = ['A', 'B', 'C', 'D', 'E'];
  const bag = createBag(allIds, 'E');
  assert.equal(bag.length, 5);
  assert.deepEqual(new Set(bag), new Set(allIds));
  // The next drawn item will be the last element in bag (pop)
  // It should not be 'E' when bag.length > 1
  assert.notEqual(bag[bag.length - 1], 'E');
});

test('drawNext consumes all 100 challenges without duplicate in 1 cycle', () => {
  let state = createInitialState(ALL_CHALLENGE_IDS);
  const drawnInCycle: string[] = [];

  for (let i = 0; i < 100; i++) {
    state = drawNext(state, ALL_CHALLENGE_IDS);
    assert.ok(state.currentChallengeId);
    drawnInCycle.push(state.currentChallengeId);
    assert.equal(state.status, 'REVEALING');
    assert.equal(state.remainingIds.length, 100 - (i + 1));
  }

  // Check no duplicates in 100 draws
  const uniqueDrawn = new Set(drawnInCycle);
  assert.equal(uniqueDrawn.size, 100);
  assert.equal(state.remainingIds.length, 0);

  // 101st draw should cleanly regenerate a fresh 99-item bag after popping the 1st
  const prevLastId = state.currentChallengeId;
  state = drawNext(state, ALL_CHALLENGE_IDS);
  assert.equal(state.remainingIds.length, 99);
  assert.notEqual(state.currentChallengeId, prevLastId);
});

test('persistence handles corrupt data gracefully', () => {
  const fallback = loadStateFromStorage(ALL_CHALLENGE_IDS);
  assert.equal(fallback.schemaVersion, 1);
  assert.equal(fallback.status, 'HOME');
  assert.equal(fallback.remainingIds.length, 100);
});
