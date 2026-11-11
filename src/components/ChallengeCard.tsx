import React from 'react';
import { motion } from 'motion/react';
import { Clock, Gauge, ShieldAlert, Check, RefreshCw, Play, Sparkles } from 'lucide-react';
import { Challenge, GameStatus } from '../types/challenge';
import { CategoryBadge } from './CategoryBadge';
import { CATEGORY_COLORS } from '../lib/validation';

interface ChallengeCardProps {
  challenge: Challenge;
  status: GameStatus;
  onAccept: () => void;
  onComplete: () => void;
  onSkip: () => void;
  reducedMotion?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  status,
  onAccept,
  onComplete,
  onSkip,
  reducedMotion = false,
}) => {
  const catColors = CATEGORY_COLORS[challenge.category] || CATEGORY_COLORS.CREATIVE;
  const isActive = status === 'ACTIVE';

  const difficultyLabel = challenge.difficulty === 'easy' ? 'سهل' : 'متوسط';
  const difficultyBadgeColor =
    challenge.difficulty === 'easy'
      ? 'bg-[#91C9B7]/20 text-[#2D7A63]'
      : 'bg-[#F4D58D]/30 text-[#8F6715]';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
      {/* Active State Banner if in progress */}
      {isActive && (
        <motion.div
          initial={reducedMotion ? {} : { y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-3 px-3 py-1 rounded-full bg-[#7667D9]/15 border border-[#7667D9]/30 text-[#5A4BB5] text-xs font-bold flex items-center gap-1.5 shadow-2xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#7667D9] animate-ping" />
          <span>التحدي قيد التنفيذ الآن! ورّينا شطارتك 🎯</span>
        </motion.div>
      )}

      {/* Main Card Surface */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 0.94, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white rounded-[24px] border border-[#E9E6F0] p-6 sm:p-7 shadow-lg shadow-black/4 relative overflow-hidden"
      >
        {/* Subtle top ambient category accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: catColors.accent }}
        />

        {/* Header: Category Badge & ID */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <CategoryBadge
            category={challenge.category}
            categoryAr={challenge.category_ar}
          />
          <span className="text-[11px] font-mono font-medium text-[#777386]">
            {challenge.id}
          </span>
        </div>

        {/* Title */}
        <motion.h2
          initial={reducedMotion ? {} : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-2xl sm:text-3xl font-extrabold text-[#292638] leading-snug mb-3 text-start"
        >
          {challenge.title_ar}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={reducedMotion ? {} : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="text-[#777386] text-base leading-relaxed mb-6 text-start"
        >
          {challenge.description_ar}
        </motion.p>

        {/* Metadata Chips: Duration & Difficulty */}
        <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 border-t border-[#E9E6F0]/80 mb-6 text-xs font-semibold text-[#777386]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F7F3] border border-[#E9E6F0]">
            <Clock className="w-3.5 h-3.5 text-[#7667D9]" aria-hidden="true" />
            <span>{challenge.duration_minutes} دقائق</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${difficultyBadgeColor}`}
          >
            <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
            <span>الصعوبة: {difficultyLabel}</span>
          </div>
        </div>

        {/* Safety Note if present */}
        {challenge.safety_note_ar && (
          <div className="p-3 rounded-xl bg-[#F4D58D]/15 border border-[#F4D58D]/40 text-xs text-[#8F6715] flex items-start gap-2 mb-6 text-start">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#8F6715]" aria-hidden="true" />
            <p className="leading-relaxed font-medium">
              <span className="font-bold">تنبيه سلامة: </span>
              {challenge.safety_note_ar}
            </p>
          </div>
        )}

        {/* Actions Container */}
        <div className="space-y-2.5 pt-1">
          {isActive ? (
            /* Active Mode Action */
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#5EAA83] hover:bg-[#529974] active:scale-[0.98] text-white text-base font-bold shadow-md shadow-[#5EAA83]/25 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#5EAA83]/30"
            >
              <Check className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              <span>خلصت التحدي! عاش 👏</span>
            </button>
          ) : (
            /* Revealed Mode Actions */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onAccept}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#7667D9] hover:bg-[#6858CF] active:scale-[0.98] text-white text-sm sm:text-base font-bold shadow-md shadow-[#7667D9]/25 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#7667D9]/30"
              >
                <Play className="w-4 h-4 fill-white" aria-hidden="true" />
                <span>هعمله دلوقتي</span>
              </button>

              <button
                type="button"
                onClick={onComplete}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#F8F7F3] border-2 border-[#5EAA83] active:scale-[0.98] text-[#2D7A63] text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#5EAA83]/20"
              >
                <Check className="w-4 h-4 text-[#5EAA83] stroke-[2.5]" aria-hidden="true" />
                <span>خلصت التحدي</span>
              </button>
            </div>
          )}

          {/* Secondary Action: Skip / Try Another (Always available, no penalty) */}
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 px-4 rounded-xl hover:bg-[#F8F7F3] text-sm font-semibold text-[#777386] hover:text-[#292638] flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent hover:border-[#E9E6F0]"
          >
            <RefreshCw className="w-4 h-4 text-[#777386]" aria-hidden="true" />
            <span>مش مناسب؟ ورّيني تحدي تاني</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
