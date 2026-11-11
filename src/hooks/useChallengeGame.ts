import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Challenge } from '../types/challenge';
import { ALL_CHALLENGE_IDS, CHALLENGE_MAP } from '../lib/validation';
import { drawNext, createInitialState, createBag } from '../lib/shuffleBag';
import { loadStateFromStorage, saveStateToStorage } from '../lib/persistence';

export interface UseChallengeGameOptions {
  prefersReducedMotion?: boolean;
}

export function useChallengeGame({ prefersReducedMotion = false }: UseChallengeGameOptions = {}) {
  const [state, setState] = useState<GameState>(() => {
    return loadStateFromStorage(ALL_CHALLENGE_IDS);
  });

  const [isRevealing, setIsRevealing] = useState<boolean>(state.status === 'REVEALING');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Support ?autostart=1 for quick test runs and ultra-mode verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' && state.status === 'HOME') {
        startDraw();
      }
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const currentChallenge: Challenge | null = state.currentChallengeId
    ? CHALLENGE_MAP.get(state.currentChallengeId) || null
    : null;

  const startDraw = useCallback(() => {
    if (isRevealing) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 1. Choose challenge once deterministically in state
    const nextState = drawNext(state, ALL_CHALLENGE_IDS);
    setState(nextState);
    setIsRevealing(true);

    // Save immediately before animation begins
    saveStateToStorage(nextState);

    // 2. Theatrical reveal delay (1200ms for full animation, 80ms for reduced motion)
    const delay = prefersReducedMotion ? 80 : 1250;

    timerRef.current = setTimeout(() => {
      setState((prev) => {
        const revealedState: GameState = {
          ...prev,
          status: 'REVEALED',
        };
        saveStateToStorage(revealedState);
        return revealedState;
      });
      setIsRevealing(false);
    }, delay);
  }, [isRevealing, state, prefersReducedMotion]);

  const acceptChallenge = useCallback(() => {
    if (state.status !== 'REVEALED') return;
    setState((prev) => {
      const nextState: GameState = {
        ...prev,
        status: 'ACTIVE',
      };
      saveStateToStorage(nextState);
      return nextState;
    });
  }, [state.status]);

  const completeChallenge = useCallback(() => {
    if (!state.currentChallengeId) return;

    setState((prev) => {
      const currentId = prev.currentChallengeId!;
      const alreadyCompleted = prev.completedIds.includes(currentId);
      const completedIds = alreadyCompleted
        ? prev.completedIds
        : [...prev.completedIds, currentId];

      const nextState: GameState = {
        ...prev,
        completedIds,
        status: 'COMPLETED',
      };
      saveStateToStorage(nextState);
      return nextState;
    });
  }, [state.currentChallengeId]);

  const skipChallenge = useCallback(() => {
    if (isRevealing) return;
    // Skipped challenge is already consumed from the bag when drawn.
    // Drawing another moves to the next item immediately.
    startDraw();
  }, [isRevealing, startDraw]);

  const resetAllProgress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const fresh = createInitialState(ALL_CHALLENGE_IDS);
    setState(fresh);
    setIsRevealing(false);
    saveStateToStorage(fresh);
  }, []);

  const totalChallenges = ALL_CHALLENGE_IDS.length;
  const completedCount = state.completedIds.length;
  // Cycle count is based on how many cards are left in current bag
  const remainingInCycle = state.remainingIds.length;
  const drawnInCycle = totalChallenges - remainingInCycle;

  return {
    state,
    currentChallenge,
    isRevealing,
    startDraw,
    acceptChallenge,
    completeChallenge,
    skipChallenge,
    resetAllProgress,
    stats: {
      totalChallenges,
      completedCount,
      remainingInCycle,
      drawnInCycle,
      drawCount: state.drawCount,
    },
  };
}
