import { GameState } from '../types/challenge';

/**
 * Modern Fisher-Yates array shuffle.
 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Creates a freshly shuffled bag of challenge IDs.
 * If previousLastId is provided and matches the next item that will be drawn
 * (the last element since we pop() from the end), swap it with the front element.
 */
export function createBag(
  allIds: string[],
  previousLastId: string | null
): string[] {
  if (allIds.length === 0) return [];
  const bag = shuffle(allIds);

  // Since we pop() from the end, bag[bag.length - 1] is the very next item to be drawn.
  // Avoid consecutive duplicate at the cycle boundary if more than 1 item exists.
  if (bag.length > 1 && bag[bag.length - 1] === previousLastId) {
    const swapIndex = Math.floor(Math.random() * (bag.length - 1));
    [bag[swapIndex], bag[bag.length - 1]] = [bag[bag.length - 1], bag[swapIndex]];
  }

  return bag;
}

export function drawNext(state: GameState, allIds: string[]): GameState {
  if (allIds.length === 0) {
    throw new Error('Challenge library is empty');
  }

  const remaining = state.remainingIds.length > 0
    ? [...state.remainingIds]
    : createBag(allIds, state.lastDrawnId);

  const nextId = remaining.pop();
  if (!nextId) {
    throw new Error('Failed to draw from challenge bag');
  }

  return {
    ...state,
    remainingIds: remaining,
    currentChallengeId: nextId,
    lastDrawnId: nextId,
    status: 'REVEALING',
    drawCount: (state.drawCount || 0) + 1,
  };
}

export function createInitialState(allIds: string[]): GameState {
  return {
    schemaVersion: 1,
    remainingIds: createBag(allIds, null),
    currentChallengeId: null,
    lastDrawnId: null,
    status: 'HOME',
    completedIds: [],
    drawCount: 0,
  };
}
