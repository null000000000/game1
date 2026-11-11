import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotionPreference } from './hooks/useReducedMotionPreference';
import { useChallengeGame } from './hooks/useChallengeGame';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AppHeader } from './components/AppHeader';
import { HomeScreen } from './components/HomeScreen';
import { RevealStage } from './components/RevealStage';
import { ChallengeCard } from './components/ChallengeCard';
import { CompletionScreen } from './components/CompletionScreen';
import { InfoModal } from './components/InfoModal';
import { StatsModal } from './components/StatsModal';

export default function App() {
  const reducedMotion = useReducedMotionPreference();
  const {
    state,
    currentChallenge,
    startDraw,
    acceptChallenge,
    completeChallenge,
    skipChallenge,
    resetAllProgress,
    stats,
  } = useChallengeGame({ prefersReducedMotion: reducedMotion });

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const renderCurrentView = () => {
    switch (state.status) {
      case 'HOME':
        return (
          <HomeScreen
            key="home"
            onStart={startDraw}
            completedCount={stats.completedCount}
            totalChallenges={stats.totalChallenges}
            hasActiveChallenge={Boolean(state.currentChallengeId)}
            onResume={() => {
              if (state.currentChallengeId) {
                // Resume showing current challenge
              }
            }}
            reducedMotion={reducedMotion}
          />
        );

      case 'REVEALING':
        return <RevealStage key="revealing" reducedMotion={reducedMotion} />;

      case 'REVEALED':
      case 'ACTIVE':
        if (!currentChallenge) {
          return (
            <HomeScreen
              key="fallback-home"
              onStart={startDraw}
              completedCount={stats.completedCount}
              totalChallenges={stats.totalChallenges}
              hasActiveChallenge={false}
              reducedMotion={reducedMotion}
            />
          );
        }
        return (
          <ChallengeCard
            key={currentChallenge.id}
            challenge={currentChallenge}
            status={state.status}
            onAccept={acceptChallenge}
            onComplete={completeChallenge}
            onSkip={skipChallenge}
            reducedMotion={reducedMotion}
          />
        );

      case 'COMPLETED':
        if (!currentChallenge) {
          return (
            <HomeScreen
              key="fallback-completed"
              onStart={startDraw}
              completedCount={stats.completedCount}
              totalChallenges={stats.totalChallenges}
              hasActiveChallenge={false}
              reducedMotion={reducedMotion}
            />
          );
        }
        return (
          <CompletionScreen
            key={`completed-${currentChallenge.id}`}
            challenge={currentChallenge}
            completedCount={stats.completedCount}
            totalChallenges={stats.totalChallenges}
            onNext={startDraw}
            reducedMotion={reducedMotion}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F7F3] text-[#292638] flex flex-col justify-between selection:bg-[#7667D9]/20 selection:text-[#292638]">
      {/* Background Animated Layer */}
      <AnimatedBackground reducedMotion={reducedMotion} />

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.status === 'REVEALING' && 'جاري اختيار تحدي عشوائي...'}
        {state.status === 'REVEALED' && currentChallenge && `تم اختيار تحدي: ${currentChallenge.title_ar}`}
        {state.status === 'ACTIVE' && currentChallenge && `بدأت التحدي: ${currentChallenge.title_ar}`}
        {state.status === 'COMPLETED' && 'مبروك! تم إكمال التحدي بنجاح.'}
      </div>

      {/* Top Header */}
      <AppHeader
        completedCount={stats.completedCount}
        totalChallenges={stats.totalChallenges}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Main Game Surface */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-2 py-4">
        <div className="w-full flex justify-center">
          {renderCurrentView()}
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto px-4 py-4 text-center text-xs text-[#777386]">
        <p>100 فكرة وتحدي لتغيير المود • العب واكتشف على مهلك</p>
      </footer>

      {/* Modals */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        completedIds={state.completedIds}
        remainingInCycle={stats.remainingInCycle}
        totalChallenges={stats.totalChallenges}
        onReset={resetAllProgress}
      />
    </div>
  );
}
