import React from 'react';
import { Play, Dumbbell, Shield, Swords, Sparkles, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export const IntroHero: React.FC = () => {
  const { state, setActiveGame, tapHero } = useArena();

  const games = [
    {
      id: 'runner' as const,
      title: 'Strength Runner',
      badge: 'TRIAL 01',
      icon: Play,
      desc: 'One-tap jump. Collect Loyalty, Focus, Hope, Discipline & Knowledge. Dodge daily bugs & procrastination.',
      completed: state.gamesCompleted.runner,
      accent: 'from-[#00F0FF]/20 to-[#0B1F4D]',
      borderColor: 'border-[#00F0FF]/40',
      textColor: 'text-[#00F0FF]',
    },
    {
      id: 'gym' as const,
      title: 'Gym Rush',
      badge: 'TRIAL 02',
      icon: Dumbbell,
      desc: 'Precision tap-timing. Hit the green zone to lift heavy barbells with pure form and discipline.',
      completed: state.gamesCompleted.gym,
      accent: 'from-[#38BDF8]/20 to-[#0B1F4D]',
      borderColor: 'border-[#38BDF8]/40',
      textColor: 'text-[#38BDF8]',
    },
    {
      id: 'boss' as const,
      title: 'Boss Battle',
      badge: 'FINAL TRIAL',
      icon: Swords,
      desc: 'Turn-based encounter against "Impossible". Strike with your gathered strengths. You always prevail.',
      completed: state.gamesCompleted.boss,
      accent: 'from-[#FFD700]/20 to-[#0B1F4D]',
      borderColor: 'border-[#FFD700]/40',
      textColor: 'text-[#FFD700]',
    },
  ];

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-4xl mx-auto px-4">
      
      {/* Cinematic Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0B1F4D] via-[#071330] to-[#050B1F] border border-[#00F0FF]/30 p-6 sm:p-10 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 arcade-grid opacity-30 pointer-events-none" />
        
        {/* Glow ambient circle */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#00F0FF]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left">
          
          {/* Interactive Hero Avatar (Tap 7 times for Secret Level) */}
          <div className="shrink-0 flex flex-col items-center">
            <button
              onClick={tapHero}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#0B1F4D] via-[#11285A] to-[#00F0FF]/30 border-2 border-[#00F0FF] p-1.5 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
              title="Tap to calibrate avatar"
              aria-label="Interactive Hero Avatar"
            >
              {/* Pixel/vector styled hero silhouette */}
              <div className="w-full h-full rounded-xl bg-[#050B1F] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#00F0FF] to-[#38BDF8] shadow-[0_0_12px_#00F0FF] flex items-center justify-center">
                  <span className="font-arcade text-[10px] text-[#050B1F]">A</span>
                </div>
                <div className="w-12 h-6 mt-1 rounded-t-lg bg-[#00F0FF]/70 border-t border-[#00F0FF]" />
                
                {/* Subtle pulse badge */}
                <div className="absolute bottom-1 right-1">
                  <Zap className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                </div>
              </div>
            </button>
            
            <div className="mt-2 text-[10px] font-mono text-white/50 tracking-wider">
              {state.heroTaps > 0 && state.heroTaps < 7 ? (
                <span className="text-[#00F0FF] animate-pulse">
                  Calibrating {state.heroTaps}/7 taps...
                </span>
              ) : state.bonusLevelUnlocked ? (
                <span className="text-[#FFD700]">Secret Stage Unlocked!</span>
              ) : (
                <span>Tap to sync</span>
              )}
            </div>
          </div>

          {/* Hero Headline & Cinematic Intro */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#00F0FF] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              ARCADE PROTOCOL 23
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-tech tracking-wide leading-tight text-wrap-balance">
              &ldquo;Welcome to the arena. Your strengths are the weapons.&rdquo;
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Engineered for you. Every trial in this world mirrors how you operate in real life: sharp focus, steady discipline under heavy iron, and rock-solid loyalty. Take the controls and clear the arena.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                One-tap controls
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                Unlimited retries
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Zero harsh penalties
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Secret Bonus Banner if Unlocked */}
      {state.bonusLevelUnlocked && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFD700]/20 via-[#0B1F4D] to-[#00F0FF]/20 border-2 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 border border-[#FFD700] flex items-center justify-center text-2xl shrink-0">
              🕹️
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#FFD700] font-bold tracking-widest uppercase">
                Secret Protocol Discovered
              </div>
              <div className="text-base font-bold text-white font-tech">
                Secret Stage: Circuit Overdrive
              </div>
              <div className="text-xs text-white/70">
                You tapped the avatar 7 times. High-speed bonus energy crystals await.
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveGame('bonus')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFD700] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            Launch Secret Stage
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* The 3 Mini Games Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00F0FF]" />
            Arena Trials
          </h2>
          <span className="text-xs font-mono text-white/40">
            {Object.values(state.gamesCompleted).filter(Boolean).length}/3 Cleared
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className={`relative rounded-2xl bg-gradient-to-b ${g.accent} border ${g.borderColor} p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_25px_rgba(0,240,255,0.2)]`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-black/40 text-white/80 border border-white/10">
                      {g.badge}
                    </span>
                    {g.completed && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        CLEARED
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${g.textColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white font-tech">
                      {g.title}
                    </h3>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed min-h-[50px]">
                    {g.desc}
                  </p>
                </div>

                <button
                  onClick={() => setActiveGame(g.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold font-tech text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                    g.completed
                      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                      : 'bg-[#00F0FF] hover:bg-[#38BDF8] text-[#050B1F]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {g.completed ? 'Replay Trial' : 'Enter Trial'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Finale Quick Access if all completed */}
      {state.gamesCompleted.boss && (
        <div className="pt-2">
          <button
            onClick={() => setActiveGame('victory')}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#00F0FF] to-[#FFD700] text-[#050B1F] font-black font-tech text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-[#050B1F]" />
            View Victory Finale & Secret Code
            <Sparkles className="w-4 h-4 fill-[#050B1F]" />
          </button>
        </div>
      )}

    </div>
  );
};
