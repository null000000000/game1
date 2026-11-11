import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, Layers } from 'lucide-react';
import { ChallengeCategory } from '../types/challenge';
import { CATEGORY_COLORS } from '../lib/validation';

interface RevealStageProps {
  reducedMotion?: boolean;
}

const PREVIEW_CARDS: Array<{
  category: ChallengeCategory;
  title: string;
  color: string;
  rotation: number;
}> = [
  { category: 'SOCIAL', title: 'كلم حد زمان ما كلمتوش', color: '#F28B82', rotation: -5 },
  { category: 'CREATIVE', title: 'ارسم رسمة مضحكة', color: '#7667D9', rotation: 4 },
  { category: 'EXPLORE', title: 'امشي في طريق جديد', color: '#91C9B7', rotation: -3 },
  { category: 'FUN', title: 'قلد شخصية كرتونية', color: '#F4D58D', rotation: 6 },
  { category: 'BRAIN', title: 'لاحظ 5 حاجات لونها أزرق', color: '#73C9F5', rotation: -2 },
];

export const RevealStage: React.FC<RevealStageProps> = ({ reducedMotion = false }) => {
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    // Fast cycling through card styles that slows down toward the end of the ~1.2s sequence
    const intervals = [100, 110, 130, 160, 200, 260];
    let step = 0;
    let timer: ReturnType<typeof setTimeout>;

    const runStep = () => {
      setCardIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
      step++;
      if (step < intervals.length) {
        timer = setTimeout(runStep, intervals[step]);
      }
    };

    timer = setTimeout(runStep, intervals[0]);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [reducedMotion]);

  const activeCard = PREVIEW_CARDS[cardIndex];
  const catColor = CATEGORY_COLORS[activeCard.category];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm mx-auto px-4 py-8 text-center">
      {/* Visual Shuffle Deck */}
      <div className="relative w-64 h-80 flex items-center justify-center my-6">
        {/* Background Deck Card 1 */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  rotate: [-6, 3, -4],
                  scale: [0.92, 0.95, 0.92],
                  y: [-4, 6, -4],
                }
          }
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[24px] bg-[#91C9B7]/30 border-2 border-[#91C9B7]/40 shadow-sm"
          style={{ transform: 'rotate(-5deg) translateY(-6px)' }}
        />

        {/* Background Deck Card 2 */}
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  rotate: [5, -4, 5],
                  scale: [0.95, 0.97, 0.95],
                  y: [5, -5, 5],
                }
          }
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[24px] bg-[#F28B82]/25 border-2 border-[#F28B82]/40 shadow-sm"
          style={{ transform: 'rotate(5deg) translateY(4px)' }}
        />

        {/* Active Top Shuffling Card */}
        <motion.div
          key={cardIndex}
          initial={reducedMotion ? { opacity: 0 } : { scale: 0.95, y: -10, opacity: 0.8 }}
          animate={{ scale: 1, y: 0, opacity: 1, rotate: activeCard.rotation }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute inset-0 rounded-[24px] bg-white border-2 border-[#E9E6F0] p-6 flex flex-col items-center justify-between shadow-xl"
        >
          {/* Top Pill placeholder */}
          <div className="flex items-center justify-between w-full">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${catColor.badgeBg} ${catColor.text}`}
            >
              {catColor.nameAr}
            </span>
            <Sparkles className="w-4 h-4 text-[#7667D9]" aria-hidden="true" />
          </div>

          {/* Central Shuffle Graphic */}
          <div className="my-auto flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F7F3] border border-[#E9E6F0] flex items-center justify-center text-[#7667D9]">
              <Dices className="w-8 h-8 animate-spin" style={{ animationDuration: '2s' }} aria-hidden="true" />
            </div>
            <p className="font-bold text-base text-[#292638] tracking-tight">
              {activeCard.title}
            </p>
          </div>

          {/* Bottom Card Silhouette Lines */}
          <div className="w-full space-y-1.5 opacity-40">
            <div className="h-2 rounded-full bg-[#E9E6F0] w-3/4 mx-auto" />
            <div className="h-2 rounded-full bg-[#E9E6F0] w-1/2 mx-auto" />
          </div>
        </motion.div>
      </div>

      {/* Loading message & indicator */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#7667D9] animate-pulse" aria-hidden="true" />
          <h2 className="text-xl font-bold text-[#292638]">
            بنختار لك تحدي...
          </h2>
        </div>
        <p className="text-xs text-[#777386]">
          سرعة وغموض، التحدي جاهز خلال لحظة!
        </p>
      </div>
    </div>
  );
};
