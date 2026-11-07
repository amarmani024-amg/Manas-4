import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Sparkles, Zap, Award } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';
import { launchConfetti } from '../utils/confetti';

interface EnergyDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  points: number;
  symbol: string;
}

export const SecretBonusLevel: React.FC = () => {
  const { setActiveGame, addScore, unlockAchievement } = useArena();

  const [scoreEarned, setScoreEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [drops, setDrops] = useState<EnergyDrop[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Spawn falling crystals
  useEffect(() => {
    if (!started || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          sound.playFanfare();
          launchConfetti(80);
          unlockAchievement('seven_taps');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      const symbols = ['⚡', '💎', '⭐', '🔋'];
      const colors = ['#00F0FF', '#FFD700', '#38BDF8', '#34D399'];
      const pick = Math.floor(Math.random() * symbols.length);

      setDrops((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80, // % width
          y: -10,
          speed: 1.5 + Math.random() * 2.5,
          color: colors[pick],
          points: 100 + pick * 50,
          symbol: symbols[pick],
        },
      ]);
    }, 600);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [started, isFinished, unlockAchievement]);

  // Movement loop for drops
  useEffect(() => {
    if (!started || isFinished) return;

    const mover = setInterval(() => {
      setDrops((prev) =>
        prev
          .map((d) => ({ ...d, y: d.y + d.speed }))
          .filter((d) => d.y < 105)
      );
    }, 50);

    return () => clearInterval(mover);
  }, [started, isFinished]);

  const handleCatch = useCallback((drop: EnergyDrop) => {
    sound.playCollect();
    triggerVibration(30);
    addScore(drop.points);
    setScoreEarned((prev) => prev + drop.points);
    setDrops((prev) => prev.filter((d) => d.id !== drop.id));
  }, [addScore]);

  const handleRestart = () => {
    setScoreEarned(0);
    setTimeLeft(25);
    setDrops([]);
    setIsFinished(false);
    setStarted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveGame('hub')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/70 hover:text-white bg-[#0B1F4D] border border-white/10 hover:border-[#00F0FF]/30 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Arena Hub
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-[#0B1F4D] border border-[#FFD700]/30 text-xs font-mono text-[#FFD700]">
            Time: {timeLeft}s
          </div>
          <div className="px-3 py-1 rounded-lg bg-[#0B1F4D] border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF]">
            +{scoreEarned} PTS
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      <div
        ref={containerRef}
        className="relative h-[420px] rounded-2xl bg-gradient-to-b from-[#0B1F4D] via-[#050B1F] to-[#050B1F] border-2 border-[#FFD700]/40 overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] select-none"
      >
        <div className="absolute inset-0 arcade-grid opacity-20 pointer-events-none" />

        {/* Start Overlay */}
        {!started && !isFinished && (
          <div className="absolute inset-0 bg-[#050B1F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,215,0,0.4)]">
              🕹️
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#FFD700] tracking-widest uppercase">
                Hidden Sector 07
              </div>
              <h2 className="text-2xl font-black text-white font-tech">
                CIRCUIT OVERDRIVE
              </h2>
              <p className="text-xs text-white/80 max-w-sm">
                You cracked the 7-tap hero sequence. Tap falling power crystals to absorb bonus score before the timer elapses.
              </p>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="py-3 px-8 rounded-xl bg-[#FFD700] text-[#050B1F] font-black font-tech text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Engage Overdrive
            </button>
          </div>
        )}

        {/* Falling Crystals Area */}
        {started && !isFinished && (
          <div className="relative w-full h-full overflow-hidden">
            {drops.map((drop) => (
              <button
                key={drop.id}
                onClick={() => handleCatch(drop)}
                style={{
                  left: `${drop.x}%`,
                  top: `${drop.y}%`,
                  borderColor: drop.color,
                }}
                className="absolute w-12 h-12 -ml-6 -mt-6 rounded-xl bg-[#0B1F4D]/90 border-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center text-xl cursor-pointer active:scale-125 transition-transform hover:brightness-125"
                title="Tap to catch"
              >
                {drop.symbol}
              </button>
            ))}
          </div>
        )}

        {/* Completion Overlay */}
        {isFinished && (
          <div className="absolute inset-0 bg-[#050B1F]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-20 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(255,215,0,0.5)]">
              ⭐
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#FFD700] tracking-widest uppercase">
                Overdrive Complete
              </div>
              <h3 className="text-2xl font-black text-white font-tech">
                +{scoreEarned.toLocaleString()} BONUS POINTS!
              </h3>
              <p className="text-xs text-white/80 max-w-sm">
                Secret Hunter status cemented. Your curiosity and precision rewarded.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
              <button
                onClick={() => setActiveGame('hub')}
                className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Return to Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
