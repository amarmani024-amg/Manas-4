import React, { useState } from 'react';
import { Volume2, VolumeX, Trophy, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export const Header: React.FC = () => {
  const { state, activeGame, setActiveGame, toggleMute, toggleEasyMode, resetProgress } = useArena();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unlockedCount = Object.values(state.achievements).filter((a) => a.unlocked).length;
  const totalCount = Object.keys(state.achievements).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050B1F]/90 backdrop-blur-md border-b border-[#00F0FF]/20 px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveGame('hub')}
              className="flex items-center gap-2 text-left group focus:outline-none"
              title="Return to Main Arena"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#0B1F4D] p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                <span className="font-arcade text-xs text-[#050B1F] font-bold">AA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-wider text-white font-tech group-hover:text-[#00F0FF] transition-colors whitespace-nowrap">
                  ADVENTURE ARENA
                </span>
                <span className="text-[10px] text-[#00F0FF]/80 tracking-widest uppercase font-mono">
                  Engineered For You
                </span>
              </div>
            </button>
          </div>

          {/* Quick Actions & Navigation Zone */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Score Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B1F4D]/80 border border-[#00F0FF]/20 text-xs font-mono tabular-nums text-white shadow-inner">
              <Zap className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
              <span className="text-[#FFD700] font-bold">{state.score.toLocaleString()}</span>
              <span className="hidden md:inline text-white/40 text-[10px]">PTS</span>
            </div>

            {/* Easy Mode Toggle */}
            <button
              onClick={toggleEasyMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                state.easyMode
                  ? 'bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'bg-[#0B1F4D]/50 border-white/10 text-white/60 hover:text-white'
              }`}
              title={state.easyMode ? 'Easy Mode is Active (Relaxed timing & extra forgiveness)' : 'Standard Mode'}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Easy Mode:</span>
              <span className="font-bold">{state.easyMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Trophy Room Modal Trigger */}
            <button
              onClick={() => setActiveGame(activeGame === 'trophy' ? 'hub' : 'trophy')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeGame === 'trophy'
                  ? 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]'
                  : 'bg-[#0B1F4D]/80 border-[#00F0FF]/20 text-white/80 hover:text-[#FFD700] hover:border-[#FFD700]/40'
              }`}
              title="View Unlocked Trophies & Strengths"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
              <span className="hidden sm:inline">Trophies</span>
              <span className="text-[11px] font-mono font-bold text-[#FFD700]">
                {unlockedCount}/{totalCount}
              </span>
            </button>

            {/* Mute/Sound Toggle */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-[#0B1F4D]/80 border border-[#00F0FF]/20 text-white/80 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-colors"
              title={state.muted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={state.muted ? 'Unmute' : 'Mute'}
            >
              {state.muted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#00F0FF]" />
              )}
            </button>

            {/* Reset Progress Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-lg bg-[#0B1F4D]/60 border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
              title="Reset Saved Progress"
              aria-label="Reset Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl bg-[#0B1F4D] border border-[#00F0FF]/40 p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-tech tracking-wide flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#00F0FF]" />
              Reset Saved Progress?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              This will clear your local high scores, achievements, and unlocked strengths so you can replay the arena from scratch.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-white/80 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                Keep Progress
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetProgress();
                }}
                className="px-4 py-2 text-xs font-bold text-[#050B1F] bg-[#00F0FF] hover:bg-[#38BDF8] rounded-lg transition-colors shadow-md"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
