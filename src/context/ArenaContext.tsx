import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ArenaState, GameType, StrengthKey, Achievement } from '../types';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';
import { launchConfetti } from '../utils/confetti';

const STORAGE_KEY = 'adventure_arena_save_v1';

const INITIAL_ACHIEVEMENTS: Record<string, Achievement> = {
  first_run: {
    id: 'first_run',
    title: 'First Run',
    description: 'Stepped into the arena with purpose.',
    icon: '⚡',
    unlocked: false,
  },
  strength_seeker: {
    id: 'strength_seeker',
    title: 'Core Weapons',
    description: 'Gathered Loyalty, Focus, Hope, Discipline & Knowledge.',
    icon: '💎',
    unlocked: false,
  },
  iron_will: {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Locked in flawless gym timing without breaking stride.',
    icon: '🏋️',
    unlocked: false,
  },
  impossible_crushed: {
    id: 'impossible_crushed',
    title: 'Defeated Impossible',
    description: 'Proved that your strengths make obstacles dissolve.',
    icon: '👑',
    unlocked: false,
  },
  seven_taps: {
    id: 'seven_taps',
    title: 'Secret Hunter',
    description: 'Tapped the hero 7 times to unlock the hidden arcade level.',
    icon: '🕹️',
    unlocked: false,
  },
  mastermind: {
    id: 'mastermind',
    title: 'Terminal Signal',
    description: 'Decoded the hidden keyboard transmission.',
    icon: '📟',
    unlocked: false,
  },
  sharp_eye: {
    id: 'sharp_eye',
    title: 'Corner Observer',
    description: 'Found the clandestine switch hidden in plain sight.',
    icon: '🔍',
    unlocked: false,
  },
  seismic_pulse: {
    id: 'seismic_pulse',
    title: 'Kinetic Spark',
    description: 'Triggered a physical motion tremor across the arena.',
    icon: '💥',
    unlocked: false,
  },
  grand_champion: {
    id: 'grand_champion',
    title: 'Arena Champion',
    description: 'Conquered every trial and unlocked the secret victory code.',
    icon: '🏆',
    unlocked: false,
  },
};

const INITIAL_STATE: ArenaState = {
  easyMode: true, // "Easy mode that is on by default"
  muted: false,
  score: 0,
  highScore: 0,
  gamesCompleted: {
    runner: false,
    gym: false,
    boss: false,
    bonus: false,
  },
  collectedStrengths: [],
  achievements: INITIAL_ACHIEVEMENTS,
  failedAttempts: {
    runner: 0,
    gym: 0,
    boss: 0,
    bonus: 0,
  },
  easterEggs: {
    helloTyped: false,
    cornerFound: false,
    shaken: false,
  },
  heroTaps: 0,
  bonusLevelUnlocked: false,
  continueUsedCount: 0,
};

interface ArenaContextValue {
  state: ArenaState;
  activeGame: GameType | 'hub' | 'trophy' | 'continue' | 'victory';
  recentAchievement: Achievement | null;
  setActiveGame: (game: GameType | 'hub' | 'trophy' | 'continue' | 'victory') => void;
  toggleEasyMode: () => void;
  toggleMute: () => void;
  addScore: (points: number) => void;
  collectStrength: (strength: StrengthKey) => void;
  markGameCompleted: (game: GameType) => void;
  recordFailure: (game: GameType) => void;
  resetGameFailures: (game: GameType) => void;
  tapHero: () => void;
  unlockAchievement: (id: string) => void;
  triggerEasterEgg: (type: 'hello' | 'corner' | 'shake') => void;
  useContinue: () => void;
  resetProgress: () => void;
  dismissAchievement: () => void;
}

const ArenaContext = createContext<ArenaContextValue | undefined>(undefined);

export const ArenaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ArenaState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_STATE,
            ...parsed,
            achievements: {
              ...INITIAL_ACHIEVEMENTS,
              ...(parsed.achievements || {}),
            },
          };
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_STATE;
  });

  const [activeGame, setActiveGame] = useState<GameType | 'hub' | 'trophy' | 'continue' | 'victory'>('hub');
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);

  // Sync mute to sound controller
  useEffect(() => {
    sound.setMuted(state.muted);
  }, [state.muted]);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state]);

  const unlockAchievement = useCallback((id: string) => {
    setState((prev) => {
      const existing = prev.achievements[id];
      if (existing && existing.unlocked) return prev;

      const updated = {
        ...prev.achievements,
        [id]: {
          ...existing,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        },
      };

      const ach = updated[id];
      setRecentAchievement(ach);
      sound.playEasterEgg();
      triggerVibration([50, 50, 100]);

      // Check if all major completed -> grand champion
      return {
        ...prev,
        score: prev.score + 250,
        achievements: updated,
      };
    });
  }, []);

  const dismissAchievement = useCallback(() => {
    setRecentAchievement(null);
  }, []);

  // Auto dismiss achievement banner after 4.5 seconds
  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        setRecentAchievement(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement]);

  const toggleEasyMode = useCallback(() => {
    sound.playClick();
    setState((prev) => ({ ...prev, easyMode: !prev.easyMode }));
  }, []);

  const toggleMute = useCallback(() => {
    sound.playClick();
    setState((prev) => {
      const nextMuted = !prev.muted;
      sound.setMuted(nextMuted);
      return { ...prev, muted: nextMuted };
    });
  }, []);

  const addScore = useCallback((points: number) => {
    setState((prev) => {
      const newScore = prev.score + points;
      return {
        ...prev,
        score: newScore,
        highScore: Math.max(prev.highScore, newScore),
      };
    });
  }, []);

  const collectStrength = useCallback((strength: StrengthKey) => {
    setState((prev) => {
      if (prev.collectedStrengths.includes(strength)) return prev;
      const next = [...prev.collectedStrengths, strength];
      if (next.length === 5) {
        setTimeout(() => unlockAchievement('strength_seeker'), 400);
      }
      return {
        ...prev,
        collectedStrengths: next,
      };
    });
  }, [unlockAchievement]);

  const markGameCompleted = useCallback((game: GameType) => {
    sound.playFanfare();
    launchConfetti(80);
    triggerVibration([80, 50, 150]);

    setState((prev) => {
      const nextCompleted = {
        ...prev.gamesCompleted,
        [game]: true,
      };

      if (game === 'runner') {
        unlockAchievement('first_run');
      } else if (game === 'gym') {
        unlockAchievement('iron_will');
      } else if (game === 'boss') {
        unlockAchievement('impossible_crushed');
        unlockAchievement('grand_champion');
      }

      return {
        ...prev,
        score: prev.score + 500,
        gamesCompleted: nextCompleted,
      };
    });
  }, [unlockAchievement]);

  const recordFailure = useCallback((game: GameType) => {
    setState((prev) => ({
      ...prev,
      failedAttempts: {
        ...prev.failedAttempts,
        [game]: (prev.failedAttempts[game] || 0) + 1,
      },
    }));
  }, []);

  const resetGameFailures = useCallback((game: GameType) => {
    setState((prev) => ({
      ...prev,
      failedAttempts: {
        ...prev.failedAttempts,
        [game]: 0,
      },
    }));
  }, []);

  const tapHero = useCallback(() => {
    sound.playClick();
    triggerVibration(30);

    setState((prev) => {
      const nextTaps = prev.heroTaps + 1;
      if (nextTaps >= 7) {
        sound.playEasterEgg();
        launchConfetti(60);
        unlockAchievement('seven_taps');
        return {
          ...prev,
          heroTaps: 0,
          bonusLevelUnlocked: true,
        };
      }
      return {
        ...prev,
        heroTaps: nextTaps,
      };
    });
  }, [unlockAchievement]);

  const triggerEasterEgg = useCallback((type: 'hello' | 'corner' | 'shake') => {
    sound.playEasterEgg();
    triggerVibration([50, 50, 150]);
    launchConfetti(60);

    if (type === 'hello') unlockAchievement('mastermind');
    if (type === 'corner') unlockAchievement('sharp_eye');
    if (type === 'shake') unlockAchievement('seismic_pulse');

    setState((prev) => ({
      ...prev,
      score: prev.score + 300,
      easterEggs: {
        ...prev.easterEggs,
        [type === 'hello' ? 'helloTyped' : type === 'corner' ? 'cornerFound' : 'shaken']: true,
      },
    }));
  }, [unlockAchievement]);

  const useContinue = useCallback(() => {
    sound.playContinue();
    triggerVibration(70);
    setState((prev) => ({
      ...prev,
      continueUsedCount: prev.continueUsedCount + 1,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    sound.playClick();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    setState(INITIAL_STATE);
    setActiveGame('hub');
  }, []);

  return (
    <ArenaContext.Provider
      value={{
        state,
        activeGame,
        recentAchievement,
        setActiveGame,
        toggleEasyMode,
        toggleMute,
        addScore,
        collectStrength,
        markGameCompleted,
        recordFailure,
        resetGameFailures,
        tapHero,
        unlockAchievement,
        triggerEasterEgg,
        useContinue,
        resetProgress,
        dismissAchievement,
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
};
