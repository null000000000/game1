import React, { useState } from 'react';
import { X, BarChart2, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ALL_CHALLENGES } from '../lib/validation';
import { ChallengeCategory } from '../types/challenge';
import { CategoryBadge } from './CategoryBadge';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedIds: string[];
  remainingInCycle: number;
  totalChallenges: number;
  onReset: () => void;
}

const CATEGORIES: ChallengeCategory[] = [
  'SOCIAL',
  'CREATIVE',
  'EXPLORE',
  'FUN',
  'BRAIN',
];

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  completedIds,
  remainingInCycle,
  totalChallenges,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const completedSet = new Set(completedIds);
  const completedCount = completedIds.length;

  // Breakdown by category
  const categoryStats = CATEGORIES.map((cat) => {
    const totalInCat = ALL_CHALLENGES.filter((c) => c.category === cat).length;
    const completedInCat = ALL_CHALLENGES.filter(
      (c) => c.category === cat && completedSet.has(c.id)
    ).length;
    return {
      category: cat,
      completed: completedInCat,
      total: totalInCat,
      percentage: totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0,
    };
  });

  const handleConfirmReset = () => {
    onReset();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-[#E9E6F0] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-5 left-5 w-8 h-8 rounded-full bg-[#F8F7F3] hover:bg-[#E9E6F0] text-[#777386] hover:text-[#292638] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#7667D9]/15 text-[#7667D9] flex items-center justify-center">
            <BarChart2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="stats-modal-title" className="text-xl font-bold text-[#292638]">
              تقدمك في اللعبة
            </h3>
            <p className="text-xs text-[#777386]">
              إحصائيات خفيفة ومحفوظة على جهازك فقط
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#E9E6F0] text-center">
            <span className="text-2xl font-black text-[#5EAA83] block mb-0.5">
              {completedCount}
            </span>
            <span className="text-xs font-semibold text-[#777386]">
              تحديات مكتملة
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#E9E6F0] text-center">
            <span className="text-2xl font-black text-[#7667D9] block mb-0.5">
              {remainingInCycle}
            </span>
            <span className="text-xs font-semibold text-[#777386]">
              متبقي في دورة السحب
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-[#777386] uppercase tracking-wider text-start">
            الإنجاز حسب الفئة
          </h4>

          <div className="space-y-2">
            {categoryStats.map((item) => (
              <div
                key={item.category}
                className="p-3 rounded-xl bg-[#F8F7F3] border border-[#E9E6F0] flex items-center justify-between"
              >
                <CategoryBadge category={item.category} />
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-white rounded-full h-2 overflow-hidden border border-[#E9E6F0]">
                    <div
                      className="bg-[#7667D9] h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#292638] min-w-[36px] text-end">
                    {item.completed}/{item.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-3 border-t border-[#E9E6F0]">
          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-[#777386] hover:text-[#C94A40] hover:bg-[#F28B82]/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>إعادة ضبط التقدم وبدء دورة جديدة</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-[#F28B82]/10 border border-[#F28B82]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C94A40]">
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>متأكد إنك عايز تصفر كل التقدم وتبدأ من الأول؟</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#C94A40] text-white font-bold text-xs hover:bg-[#B33E35] transition-colors cursor-pointer"
                >
                  نعم، صفّر التقدم
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2 px-3 rounded-lg bg-white border border-[#E9E6F0] text-xs font-semibold text-[#292638] hover:bg-[#F8F7F3] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
