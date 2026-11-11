import React from 'react';
import { Users, Palette, Compass, Smile, Brain } from 'lucide-react';
import { ChallengeCategory } from '../types/challenge';
import { CATEGORY_COLORS } from '../lib/validation';

interface CategoryBadgeProps {
  category: ChallengeCategory;
  categoryAr?: string;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  categoryAr,
  className = '',
}) => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.CREATIVE;
  const label = categoryAr || colors.nameAr;

  const renderIcon = () => {
    const iconClass = 'w-3.5 h-3.5';
    switch (category) {
      case 'SOCIAL':
        return <Users className={iconClass} aria-hidden="true" />;
      case 'CREATIVE':
        return <Palette className={iconClass} aria-hidden="true" />;
      case 'EXPLORE':
        return <Compass className={iconClass} aria-hidden="true" />;
      case 'FUN':
        return <Smile className={iconClass} aria-hidden="true" />;
      case 'BRAIN':
        return <Brain className={iconClass} aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colors.badgeBg} ${colors.text} ${colors.border} transition-colors ${className}`}
    >
      {renderIcon()}
      <span>{label}</span>
    </span>
  );
};
