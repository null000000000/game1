export type ChallengeCategory =
  | "SOCIAL"
  | "CREATIVE"
  | "EXPLORE"
  | "FUN"
  | "BRAIN";

export type Difficulty = "easy" | "medium";

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  category_ar: string;
  title_ar: string;
  description_ar: string;
  duration_minutes: number;
  difficulty: Difficulty;
  safety_note_ar: string;
}

export interface CategoryMeta {
  id: ChallengeCategory;
  name_ar: string;
  color_token: "coral" | "primary" | "mint" | "yellow" | "sky";
}

export interface ChallengeDataset {
  schema_version: string;
  language: string;
  total_challenges: number;
  category_counts: Record<ChallengeCategory, number>;
  categories: CategoryMeta[];
  global_safety_rules_ar: string[];
  challenges: Challenge[];
}

export type GameStatus =
  | "HOME"
  | "REVEALING"
  | "REVEALED"
  | "ACTIVE"
  | "COMPLETED";

export interface GameState {
  schemaVersion: 1;
  remainingIds: string[];
  currentChallengeId: string | null;
  lastDrawnId: string | null;
  status: GameStatus;
  completedIds: string[];
  drawCount: number;
}
