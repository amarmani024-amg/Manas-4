import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, RotateCcw, Copy, Check, Shield, Award } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { launchFireworks, launchConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';

export const VictoryFinale: React.FC = () => {
  const { state, setActiveGame, resetProgress } = useArena();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sound.playFanfare();
    launchFireworks(6);
    launchConfetti(100);
    triggerVibration([100, 50, 100, 50, 200]);

    // Secondary burst after 1.5s
    const t = setTimeout(() => {
      launchFireworks(4);
    }, 1500);

    return () => clearTimeout(t);
  }, []);

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('ARENAKING').catch(() => {});
      setCopied(true);
      triggerVibration(40);
      sound.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-center animate-in fade-in duration-300">
      
      {/* Giant "A" Insignia with Fireworks Glow */}
      <div className="relative inline-block py-2">
        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-br from-[#0B1F4D] via-[#050B1F] to-[#11285A] border-4 border-[#00F0FF] shadow-[0_0_50px_rgba(0,240,255,0.6)] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#00F0FF]/10 animate-pulse pointer-events-none" />
          <span className="font-arcade text-5xl sm:text-7xl text-[#00F0FF] text-glow-cyan select-none">
            A
          </span>
        </div>
        
        {/* Orbiting sparkles */}
        <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
          ✨
        </div>
        <div className="absolute -bottom-1 -left-1 text-2xl animate-pulse">
          ⚡
        </div>
      </div>

      {/* Navy & Gold Trophy Display */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 text-xs font-mono font-bold text-[#FFD700] uppercase tracking-widest">
          <Trophy className="w-3.5 h-3.5" />
          ARENA CONQUERED
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-tech tracking-wide uppercase">
          THE ARENA IS YOURS
        </h1>

        <p className="text-sm sm:text-base text-white/85 max-w-lg mx-auto leading-relaxed font-normal">
          23 years of unmatched discipline, quiet brilliance, and rock-solid loyalty. You cleared the track, mastered the heavy barbell, and dismantled &ldquo;Impossible&rdquo;.
        </p>
      </div>

      {/* The Gold Secret Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#11285A] via-[#0B1F4D] to-[#071330] border-2 border-[#FFD700] shadow-[0_0_45px_rgba(255,215,0,0.4)] max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#FFD700] uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          EXCLUSIVE MASTER CIPHER
        </div>

        <div className="py-2">
          <div className="inline-block px-5 py-3 rounded-xl bg-[#050B1F] border-2 border-[#FFD700] shadow-inner">
            <span className="font-arcade text-xl sm:text-2xl text-[#FFD700] tracking-wider text-glow-gold select-all">
              Secret Code: ARENAKING
            </span>
          </div>
        </div>

        <p className="text-xs text-white/70 leading-normal">
          Keep this code safe. It stands for every early workout, every solved equation, and every time you showed up for others.
        </p>

        <div className="pt-1">
          <button
            onClick={handleCopyCode}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FFD700] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Secret Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Strengths Recapped */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {state.collectedStrengths.map((str) => (
          <span
            key={str}
            className="px-3 py-1.5 rounded-lg bg-[#0B1F4D] border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[#FFD700]" />
            {str}
          </span>
        ))}
      </div>

      {/* Action Buttons: Replay / Explore Trophies */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={() => setActiveGame('trophy')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B1F4D] border border-[#00F0FF]/40 text-white font-bold font-tech text-xs uppercase tracking-wider hover:bg-[#11285A] transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-[#FFD700]" />
          View Complete Trophy Room
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveGame('hub');
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00F0FF] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:bg-[#38BDF8] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Replay Arena Trials
        </button>
      </div>

    </div>
  );
};
