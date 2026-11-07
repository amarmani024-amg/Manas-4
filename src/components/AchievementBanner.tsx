import React from 'react';
import { Trophy, X } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export const AchievementBanner: React.FC = () => {
  const { recentAchievement, dismissAchievement } = useArena();

  if (!recentAchievement) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="bg-[#0B1F4D]/95 border-2 border-[#FFD700] rounded-xl p-3.5 shadow-[0_0_25px_rgba(255,215,0,0.35)] backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/50 flex items-center justify-center text-xl shrink-0">
            {recentAchievement.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-[#FFD700] uppercase">
              <Trophy className="w-3 h-3" />
              Achievement Unlocked!
            </div>
            <div className="text-sm font-bold text-white font-tech">
              {recentAchievement.title}
            </div>
            <div className="text-xs text-white/70 line-clamp-1">
              {recentAchievement.description}
            </div>
          </div>
        </div>
        <button
          onClick={dismissAchievement}
          className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
