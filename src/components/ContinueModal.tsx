import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

interface ContinueModalProps {
  isOpen: boolean;
  onRevive: () => void;
  onExit: () => void;
  gameTitle: string;
}

export const ContinueModal: React.FC<ContinueModalProps> = ({
  isOpen,
  onRevive,
  onExit,
  gameTitle,
}) => {
  const { useContinue } = useArena();
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(9);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 9));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRevive = () => {
    useContinue();
    onRevive();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0B1F4D] to-[#050B1F] border-2 border-[#00F0FF] p-6 text-center space-y-5 shadow-[0_0_40px_rgba(0,240,255,0.4)]">
        
        <div className="space-y-1">
          <p className="font-arcade text-xs text-[#00F0FF] tracking-widest uppercase">
            {gameTitle}
          </p>
          <h2 className="text-2xl font-black text-white font-tech tracking-wide">
            CONTINUE?
          </h2>
        </div>

        {/* Big Arcade Countdown */}
        <div className="py-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#00F0FF] bg-[#00F0FF]/10 text-4xl font-arcade text-[#00F0FF] text-glow-cyan animate-pulse">
            {countdown}
          </div>
        </div>

        <p className="text-xs text-white/80 leading-relaxed max-w-xs mx-auto">
          In this arena, every setback is just data for the next rep. Take three extra lives—free of charge.
        </p>

        {/* Free Revive Button */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleRevive}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] text-[#050B1F] font-bold text-sm font-tech tracking-wide uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-[#050B1F]" />
            Claim Free Lives & Continue
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={onExit}
            className="w-full py-2.5 px-3 rounded-lg text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restart Trial from Beginning
          </button>
        </div>
      </div>
    </div>
  );
};
