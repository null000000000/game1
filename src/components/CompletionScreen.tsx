import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Dices, ArrowLeft } from 'lucide-react';
import { Challenge } from '../types/challenge';
import { CategoryBadge } from './CategoryBadge';

interface CompletionScreenProps {
  challenge: Challenge;
  completedCount: number;
  totalChallenges: number;
  onNext: () => void;
  reducedMotion?: boolean;
}

// 16 particles with approved palette colors
const PARTICLES = [
  { id: 1, x: -70, y: -90, color: '#7667D9', size: 10, shape: 'circle' },
  { id: 2, x: 60, y: -100, color: '#F28B82', size: 8, shape: 'rect' },
  { id: 3, x: -110, y: -40, color: '#91C9B7', size: 12, shape: 'pill' },
  { id: 4, x: 100, y: -50, color: '#F4D58D', size: 9, shape: 'circle' },
  { id: 5, x: -90, y: 30, color: '#73C9F5', size: 7, shape: 'rect' },
  { id: 6, x: 80, y: 40, color: '#7667D9', size: 11, shape: 'pill' },
  { id: 7, x: -40, y: -120, color: '#F28B82', size: 9, shape: 'circle' },
  { id: 8, x: 40, y: -130, color: '#91C9B7', size: 8, shape: 'rect' },
  { id: 9, x: -120, y: -10, color: '#F4D58D', size: 10, shape: 'circle' },
  { id: 10, x: 110, y: -20, color: '#73C9F5', size: 8, shape: 'pill' },
  { id: 11, x: -60, y: 80, color: '#7667D9', size: 9, shape: 'circle' },
  { id: 12, x: 70, y: 70, color: '#F28B82', size: 7, shape: 'rect' },
  { id: 13, x: -30, y: -80, color: '#91C9B7', size: 11, shape: 'pill' },
  { id: 14, x: 30, y: -90, color: '#F4D58D', size: 8, shape: 'circle' },
  { id: 15, x: -80, y: -70, color: '#73C9F5', size: 9, shape: 'rect' },
  { id: 16, x: 90, y: -60, color: '#7667D9', size: 10, shape: 'circle' },
];

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  challenge,
  completedCount,
  totalChallenges,
  onNext,
  reducedMotion = false,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center text-center">
      {/* Celebration Icon with Particle Burst */}
      <div className="relative my-4 flex items-center justify-center">
        {!reducedMotion && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {PARTICLES.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  scale: [0, 1.2, 0.9],
                  opacity: [1, 1, 0],
                  rotate: p.id % 2 === 0 ? 180 : -180,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? '9999px' : p.shape === 'pill' ? '4px' : '2px',
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={reducedMotion ? {} : { scale: 0.5, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-[#5EAA83] text-white flex items-center justify-center shadow-lg shadow-[#5EAA83]/30"
        >
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Celebration Headline */}
      <motion.div
        initial={reducedMotion ? {} : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#91C9B7]/20 text-[#2D7A63] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>أنجزت {completedCount} من {totalChallenges} تحدي</span>
        </div>

        <h2 className="text-3xl font-black text-[#292638] mb-1.5">
          خلصته! عاش 👏
        </h2>
        <p className="text-[#777386] text-sm sm:text-base max-w-xs mx-auto mb-6">
          مغامرة صغيرة تانية كملتها بنجاح. جاهز للي بعده؟
        </p>
      </motion.div>

      {/* Completed Challenge Summary Card */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white rounded-2xl border border-[#E9E6F0] p-5 shadow-xs mb-6 text-start"
      >
        <div className="flex items-center justify-between mb-2">
          <CategoryBadge category={challenge.category} categoryAr={challenge.category_ar} />
          <span className="text-xs font-semibold text-[#5EAA83] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>مكتمل</span>
          </span>
        </div>
        <h3 className="font-bold text-lg text-[#292638] mb-1">
          {challenge.title_ar}
        </h3>
        <p className="text-xs text-[#777386] line-clamp-2">
          {challenge.description_ar}
        </p>
      </motion.div>

      {/* Primary Action: Next Challenge */}
      <motion.div
        initial={reducedMotion ? {} : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full"
      >
        <button
          type="button"
          onClick={onNext}
          className="group w-full py-4 px-6 rounded-2xl bg-[#7667D9] hover:bg-[#6858CF] active:scale-[0.98] text-white text-base font-bold shadow-md shadow-[#7667D9]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#7667D9]/30"
        >
          <Dices className="w-5 h-5 transition-transform group-hover:rotate-12" aria-hidden="true" />
          <span>تحدي جديد</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        </button>
      </motion.div>
    </div>
  );
};
