import React from 'react';
import { Sparkles, BarChart2, ShieldCheck } from 'lucide-react';

interface AppHeaderProps {
  completedCount: number;
  totalChallenges: number;
  onOpenInfo: () => void;
  onOpenStats: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  completedCount,
  totalChallenges,
  onOpenInfo,
  onOpenStats,
}) => {
  return (
    <header className="relative z-10 w-full max-w-xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
      {/* Wordmark placeholder */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#7667D9] flex items-center justify-center text-white shadow-sm shadow-[#7667D9]/30">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight text-[#292638] block leading-none">
            تَحَدّي
          </span>
          <span className="text-[11px] font-medium text-[#777386]">
            Random Challenge Game
          </span>
        </div>
      </div>

      {/* Action buttons and progress pill */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenStats}
          aria-label="عرض التقدم والإحصائيات"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-semibold text-[#292638] border border-[#E9E6F0] shadow-xs hover:border-[#7667D9]/40 transition-all cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#7667D9]" aria-hidden="true" />
          <span>{completedCount}</span>
          <span className="text-[#777386]">/ {totalChallenges}</span>
        </button>

        <button
          type="button"
          onClick={onOpenInfo}
          aria-label="قواعد اللعبة والسلامة"
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#777386] hover:text-[#7667D9] border border-[#E9E6F0] hover:border-[#7667D9]/40 transition-all cursor-pointer"
          title="قواعد اللعبة والسلامة"
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
