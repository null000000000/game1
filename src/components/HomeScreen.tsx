import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Dices, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ChallengeCategory } from '../types/challenge';

interface HomeScreenProps {
  onStart: () => void;
  completedCount: number;
  totalChallenges: number;
  hasActiveChallenge: boolean;
  onResume?: () => void;
  reducedMotion?: boolean;
}

const CATEGORIES: ChallengeCategory[] = [
  'SOCIAL',
  'CREATIVE',
  'EXPLORE',
  'FUN',
  'BRAIN',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStart,
  completedCount,
  totalChallenges,
  hasActiveChallenge,
  onResume,
  reducedMotion = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto text-center px-4 py-6">
      {/* Playful Floating Hero Element */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6"
      >
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7667D9] to-[#5A4BB5] text-white flex items-center justify-center shadow-lg shadow-[#7667D9]/25">
          <Dices className="w-12 h-12" aria-hidden="true" />

          {/* Mini accent sparkle badge */}
          <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F4D58D] text-[#8F6715] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </motion.div>

      {/* Main Headlines */}
      <motion.div
        initial={reducedMotion ? {} : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-[#292638] tracking-tight mb-2.5">
          يلا نلعب؟
        </h1>
        <p className="text-[#777386] text-base sm:text-lg leading-relaxed max-w-xs mx-auto mb-6">
          اضغط وخد تحدي عشوائي بسيط وممتع، غير بيه مودك في الواقع.
        </p>
      </motion.div>

      {/* Category preview pills */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-1.5 mb-8 max-w-sm"
      >
        {CATEGORIES.map((cat) => (
          <CategoryBadge key={cat} category={cat} />
        ))}
      </motion.div>

      {/* Primary CTA Button */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="w-full space-y-3"
      >
        <button
          type="button"
          onClick={onStart}
          className="group relative w-full py-4 px-6 rounded-2xl bg-[#7667D9] hover:bg-[#6858CF] active:scale-[0.98] text-white text-lg font-bold shadow-md shadow-[#7667D9]/30 transition-all flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#7667D9]/30"
        >
          <Dices className="w-6 h-6 transition-transform group-hover:rotate-12" aria-hidden="true" />
          <span>ورّيني التحدي</span>
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        </button>

        {/* Resume button if challenge is currently active */}
        {hasActiveChallenge && onResume && (
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F8F7F3] border border-[#E9E6F0] text-sm font-semibold text-[#292638] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#7667D9]" aria-hidden="true" />
            <span>الرجوع للتحدي الحالي</span>
          </button>
        )}
      </motion.div>

      {/* Reassurance pill */}
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mt-6 flex items-center gap-2 text-xs text-[#777386]"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#91C9B7]" />
        <span>100 تحدي متنوع</span>
        <span>•</span>
        <span>من غير تسجيل</span>
        <span>•</span>
        <span>جاهز للعب فوراً</span>
      </motion.div>

      {completedCount > 0 && (
        <div className="mt-4 px-3 py-1 rounded-full bg-[#91C9B7]/15 text-[#2D7A63] text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>أنجزت {completedCount} من {totalChallenges} تحدي</span>
        </div>
      )}
    </div>
  );
};
