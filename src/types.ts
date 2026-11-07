export type GameType = 'runner' | 'gym' | 'boss' | 'bonus';

export type StrengthKey = 'Loyalty' | 'Focus' | 'Hope' | 'Discipline' | 'Knowledge';

export interface StrengthInfo {
  key: StrengthKey;
  title: string;
  tagline: string;
  iconName: string;
  color: string;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GameProgress {
  runner: boolean;
  gym: boolean;
  boss: boolean;
  bonus: boolean;
}

export interface EasterEggsState {
  helloTyped: boolean;
  cornerFound: boolean;
  shaken: boolean;
}

export interface ArenaState {
  easyMode: boolean;
  muted: boolean;
  score: number;
  highScore: number;
  gamesCompleted: GameProgress;
  collectedStrengths: StrengthKey[];
  achievements: Record<string, Achievement>;
  failedAttempts: Record<string, number>;
  easterEggs: EasterEggsState;
  heroTaps: number;
  bonusLevelUnlocked: boolean;
  continueUsedCount: number;
}
