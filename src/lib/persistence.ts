import { GameState, GameStatus } from '../types/challenge';
import { createBag, createInitialState } from './shuffleBag';

export const STORAGE_KEY = 'random-challenge-game:v1';

const VALID_STATUSES: Set<GameStatus> = new Set([
  'HOME',
  'REVEALING',
  'REVEALED',
  'ACTIVE',
  'COMPLETED',
]);

export function saveStateToStorage(state: GameState): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.warn('LocalStorage save failed, falling back to memory state:', err);
    return false;
  }
}

export function loadStateFromStorage(allIds: string[]): GameState {
  const fallback = createInitialState(allIds);
  const validIdSet = new Set(allIds);

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    // Version validation
    if (parsed.schemaVersion !== 1) {
      return fallback;
    }

    // Filter and sanitize remaining IDs
    let remainingIds: string[] = Array.isArray(parsed.remainingIds)
      ? parsed.remainingIds.filter((id: unknown): id is string => typeof id === 'string' && validIdSet.has(id))
      : [];

    // Filter and sanitize completed IDs
    const completedIds: string[] = Array.isArray(parsed.completedIds)
      ? Array.from(new Set(parsed.completedIds.filter((id: unknown): id is string => typeof id === 'string' && validIdSet.has(id))))
      : [];

    // Current challenge ID
    let currentChallengeId: string | null = null;
    if (typeof parsed.currentChallengeId === 'string' && validIdSet.has(parsed.currentChallengeId)) {
      currentChallengeId = parsed.currentChallengeId;
    }

    // Last drawn ID
    let lastDrawnId: string | null = null;
    if (typeof parsed.lastDrawnId === 'string' && validIdSet.has(parsed.lastDrawnId)) {
      lastDrawnId = parsed.lastDrawnId;
    }

    // Status: if restored in REVEALING, transition smoothly to REVEALED if currentChallengeId exists, otherwise HOME
    let status: GameStatus = VALID_STATUSES.has(parsed.status) ? parsed.status : 'HOME';
    if (status === 'REVEALING') {
      status = currentChallengeId ? 'REVEALED' : 'HOME';
    }

    if (!currentChallengeId && (status === 'REVEALED' || status === 'ACTIVE' || status === 'COMPLETED')) {
      status = 'HOME';
    }

    // If remainingIds is empty and we are at HOME, seed a fresh bag
    if (remainingIds.length === 0 && !currentChallengeId) {
      remainingIds = createBag(allIds, lastDrawnId);
    }

    const drawCount = typeof parsed.drawCount === 'number' && parsed.drawCount >= 0 ? parsed.drawCount : completedIds.length;

    return {
      schemaVersion: 1,
      remainingIds,
      currentChallengeId,
      lastDrawnId,
      status,
      completedIds,
      drawCount,
    };
  } catch (err) {
    console.warn('LocalStorage load failed or corrupted, initializing fresh bag:', err);
    return fallback;
  }
}

export function clearStoredState(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    }
  } catch (err) {
    console.warn('Failed to clear storage:', err);
  }
  return false;
}
