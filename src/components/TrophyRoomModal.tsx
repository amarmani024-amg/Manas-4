import React from 'react';
import { Trophy, CheckCircle2, Lock, X, Award, Shield, Sparkles } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export const TrophyRoomModal: React.FC = () => {
  const { state, setActiveGame } = useArena();

  const achievementsList = Object.values(state.achievements);
  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;

  const STRENGTH_DESCRIPTIONS: Record<string, { label: string; desc: string; icon: string }> = {
    Loyalty: {
      label: 'Loyalty',
      desc: 'Unwavering reliability. You protect the people in your corner.',
      icon: '🛡️',
    },
    Focus: {
      label: 'Focus',
      desc: 'Deep work and noise cancellation. Complex systems submit to clarity.',
      icon: '🎯',
    },
    Hope: {
      label: 'Hope',
      desc: 'Unshakable optimism. Seeing the breakthrough when the build is rough.',
      icon: '🌅',
    },
    Discipline: {
      label: 'Discipline',
      desc: 'Early alarms, heavy barbells, and consistency that never wavers.',
      icon: '⚡',
    },
    Knowledge: {
      label: 'Knowledge',
      desc: 'Rigorous engineering curiosity. Understanding how the gears mesh.',
      icon: '💡',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#071330] border-2 border-[#00F0FF]/30 p-4 sm:p-6 text-white shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00F0FF]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 border border-[#FFD700]/40 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-tech tracking-wide text-white">
                THE TROPHY ROOM
              </h2>
              <p className="text-xs text-[#00F0FF]/80 font-mono">
                {unlockedCount} of {achievementsList.length} Honors Unlocked
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveGame('hub')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close Trophy Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Quote Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0B1F4D] to-[#050B1F] border border-[#00F0FF]/20 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#FFD700] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Arena Dossier
            </div>
            <p className="text-sm text-white/90 font-medium leading-relaxed">
              Every honor in this room reflects real attributes: your discipline in training, your technical craft, and your quiet integrity.
            </p>
          </div>
        </div>

        {/* Core Strengths Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#00F0FF]" />
            Forged Core Strengths ({state.collectedStrengths.length}/5)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {Object.keys(STRENGTH_DESCRIPTIONS).map((strKey) => {
              const isCollected = state.collectedStrengths.includes(strKey as any);
              const info = STRENGTH_DESCRIPTIONS[strKey];
              return (
                <div
                  key={strKey}
                  className={`p-3 rounded-xl border transition-all ${
                    isCollected
                      ? 'bg-[#0B1F4D] border-[#00F0FF]/40 shadow-sm'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm font-bold font-tech text-white">
                      {info.label}
                    </span>
                    {isCollected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] ml-auto" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/70 leading-normal">
                    {info.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-[#FFD700]" />
            Arcade Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'bg-[#0B1F4D]/80 border-[#FFD700]/30'
                    : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                    ach.unlocked ? 'bg-[#FFD700]/15' : 'bg-white/5'
                  }`}
                >
                  {ach.unlocked ? ach.icon : <Lock className="w-4 h-4 text-white/30" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-tech text-white flex items-center gap-1.5">
                    {ach.title}
                    {ach.unlocked && (
                      <span className="text-[10px] text-[#00F0FF] font-mono">UNLOCKED</span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/65 leading-tight">
                    {ach.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setActiveGame('hub')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#050B1F] font-bold text-xs uppercase tracking-wider font-tech hover:bg-[#38BDF8] active:scale-95 transition-all shadow-md"
          >
            Return to Arena
          </button>
        </div>

      </div>
    </div>
  );
};
