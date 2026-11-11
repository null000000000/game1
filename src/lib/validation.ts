import rawDataset from '../data/challenges.json';
import { Challenge, ChallengeCategory, ChallengeDataset } from '../types/challenge';

export const DATASET = rawDataset as unknown as ChallengeDataset;

export const ALL_CHALLENGES: Challenge[] = DATASET.challenges;

export const CHALLENGE_MAP: Map<string, Challenge> = new Map(
  ALL_CHALLENGES.map((c) => [c.id, c])
);

export const ALL_CHALLENGE_IDS: string[] = ALL_CHALLENGES.map((c) => c.id);

export const CATEGORY_COLORS: Record<
  ChallengeCategory,
  {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    accent: string;
    nameAr: string;
  }
> = {
  SOCIAL: {
    bg: 'bg-[#F28B82]/10',
    text: 'text-[#C94A40]',
    border: 'border-[#F28B82]/30',
    badgeBg: 'bg-[#F28B82]/20',
    accent: '#F28B82',
    nameAr: 'اجتماعي',
  },
  CREATIVE: {
    bg: 'bg-[#7667D9]/10',
    text: 'text-[#5A4BB5]',
    border: 'border-[#7667D9]/30',
    badgeBg: 'bg-[#7667D9]/20',
    accent: '#7667D9',
    nameAr: 'إبداعي',
  },
  EXPLORE: {
    bg: 'bg-[#91C9B7]/15',
    text: 'text-[#2D7A63]',
    border: 'border-[#91C9B7]/40',
    badgeBg: 'bg-[#91C9B7]/25',
    accent: '#91C9B7',
    nameAr: 'استكشاف',
  },
  FUN: {
    bg: 'bg-[#F4D58D]/20',
    text: 'text-[#8F6715]',
    border: 'border-[#F4D58D]/50',
    badgeBg: 'bg-[#F4D58D]/35',
    accent: '#F4D58D',
    nameAr: 'مرح وهزار',
  },
  BRAIN: {
    bg: 'bg-[#73C9F5]/15',
    text: 'text-[#1B70A6]',
    border: 'border-[#73C9F5]/40',
    badgeBg: 'bg-[#73C9F5]/25',
    accent: '#73C9F5',
    nameAr: 'ذكاء وملاحظة',
  },
};

export function validateChallengeDataset(dataset: ChallengeDataset): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const challenges = dataset.challenges || [];

  if (challenges.length !== 100) {
    errors.push(`Expected exactly 100 challenges, found ${challenges.length}`);
  }

  const idSet = new Set<string>();
  const categoryCounts: Record<string, number> = {};

  for (const item of challenges) {
    if (!item.id || typeof item.id !== 'string') {
      errors.push(`Invalid id in item: ${JSON.stringify(item)}`);
    } else {
      if (idSet.has(item.id)) {
        errors.push(`Duplicate challenge ID: ${item.id}`);
      }
      idSet.add(item.id);
    }

    if (!item.title_ar || item.title_ar.trim() === '') {
      errors.push(`Missing title_ar in challenge ${item.id}`);
    }
    if (!item.description_ar || item.description_ar.trim() === '') {
      errors.push(`Missing description_ar in challenge ${item.id}`);
    }
    if (!item.duration_minutes || item.duration_minutes <= 0) {
      errors.push(`Invalid duration_minutes in challenge ${item.id}`);
    }
    if (!['easy', 'medium'].includes(item.difficulty)) {
      errors.push(`Invalid difficulty in challenge ${item.id}: ${item.difficulty}`);
    }

    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  const requiredCategories: ChallengeCategory[] = [
    'SOCIAL',
    'CREATIVE',
    'EXPLORE',
    'FUN',
    'BRAIN',
  ];

  for (const cat of requiredCategories) {
    const count = categoryCounts[cat] || 0;
    if (count !== 20) {
      errors.push(`Expected 20 challenges for category ${cat}, found ${count}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
