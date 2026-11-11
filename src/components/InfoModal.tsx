import React from 'react';
import { X, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { DATASET } from '../lib/validation';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#91C9B7]/25 text-[#2D7A63] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 id="info-modal-title" className="text-xl font-bold text-[#292638]">
              عن اللعبة وقواعد السلامة
            </h3>
            <p className="text-xs text-[#777386]">
              متعة خفيفة ومضمونة بدون أي ضغوط
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="p-3.5 rounded-2xl bg-[#7667D9]/10 border border-[#7667D9]/20 mb-5 text-sm text-[#5A4BB5] leading-relaxed">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Sparkles className="w-4 h-4 text-[#7667D9]" aria-hidden="true" />
            <span>فلسفة اللعبة</span>
          </div>
          <p className="text-xs leading-normal">
            &quot;بسيطة في لعبها، ممتعة في تجربتها، وغير متوقعة كل مرة.&quot; الهدف تكسر الروتين بحركات وأفكار لطيفة في الواقع من غير أي التزام أو متابعة مستمرة.
          </p>
        </div>

        {/* Global Safety Rules */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-bold text-[#292638] flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#F28B82]" aria-hidden="true" />
            <span>إرشادات السلامة والراحة</span>
          </h4>

          <ul className="space-y-2.5 text-xs text-[#777386]">
            {DATASET.global_safety_rules_ar.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-[#F8F7F3] p-2.5 rounded-xl border border-[#E9E6F0]"
              >
                <span className="w-5 h-5 rounded-full bg-white text-[#7667D9] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#E9E6F0]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Acknowledge CTA */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#7667D9] hover:bg-[#6858CF] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          فهمت، يلا نلعب!
        </button>
      </div>
    </div>
  );
};
