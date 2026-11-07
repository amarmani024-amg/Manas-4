import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dumbbell, ArrowLeft, RotateCcw, CheckCircle2, ChevronRight, FastForward, Award, Sparkles } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';

interface ExerciseSet {
  name: string;
  weight: string;
  targetReps: number;
  subtext: string;
}

const EXERCISES: ExerciseSet[] = [
  { name: 'Bench Press', weight: '225 lbs', targetReps: 1, subtext: 'Chest & core stability' },
  { name: 'Back Squat', weight: '315 lbs', targetReps: 1, subtext: 'Leg drive & unbroken spine' },
  { name: 'Deadlift', weight: '405 lbs', targetReps: 1, subtext: 'Pure grip & posterior power' },
];

export const GymRush: React.FC = () => {
  const { state, setActiveGame, markGameCompleted, addScore } = useArena();

  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ rating: 'PERFECT' | 'GOOD' | 'NICE TRY'; comment: string } | null>(null);
  const [isLifting, setIsLifting] = useState(false);

  // Meter position 0 to 100
  const [meterPos, setMeterPos] = useState(50);
  const directionRef = useRef(1); // 1 = right, -1 = left
  const animFrameRef = useRef<number | null>(null);

  const failedCount = state.failedAttempts['gym'] || 0;

  // Meter animation loop
  useEffect(() => {
    if (!gameStarted || isCompleted) return;

    // Slower speed in Easy Mode for ultimate comfort
    const speed = state.easyMode ? 0.75 : 1.1;

    let pos = 50;
    const loop = () => {
      pos += directionRef.current * speed;
      if (pos >= 96) {
        pos = 96;
        directionRef.current = -1;
      } else if (pos <= 4) {
        pos = 4;
        directionRef.current = 1;
      }
      setMeterPos(pos);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameStarted, isCompleted, state.easyMode]);

  const handleTap = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    if (isCompleted || isLifting) return;

    // Green zone thresholds (generously wide in Easy Mode: 30 to 70!)
    const isEasy = state.easyMode;
    const perfectMin = isEasy ? 44 : 46;
    const perfectMax = isEasy ? 56 : 54;
    const goodMin = isEasy ? 30 : 36;
    const goodMax = isEasy ? 70 : 64;

    setIsLifting(true);
    sound.playLift();

    let rating: 'PERFECT' | 'GOOD' | 'NICE TRY' = 'NICE TRY';
    let comment = 'Dialing in the grip. Smooth reset for the next attempt.';
    let points = 50;

    if (meterPos >= perfectMin && meterPos <= perfectMax) {
      rating = 'PERFECT';
      comment = 'Flawless engineering form. Power cleanly transferred!';
      points = 250;
      sound.playRepSuccess(true);
      triggerVibration([50, 50, 100]);
    } else if (meterPos >= goodMin && meterPos <= goodMax) {
      rating = 'GOOD';
      comment = 'Solid lock-out. That weight belongs to you.';
      points = 150;
      sound.playRepSuccess(false);
      triggerVibration(60);
    } else {
      // Nice try - no failure, positive encouragement
      rating = 'NICE TRY';
      comment = 'Barbell primed. Timing adjusting on the next swing.';
      sound.playHit();
    }

    setFeedback({ rating, comment });
    addScore(points);

    // If Perfect or Good, advance the set!
    if (rating === 'PERFECT' || rating === 'GOOD') {
      setTimeout(() => {
        setCompletedSets((prev) => [...prev, currentSetIdx]);
        if (currentSetIdx < EXERCISES.length - 1) {
          setCurrentSetIdx((prev) => prev + 1);
          setIsLifting(false);
          setFeedback(null);
        } else {
          // Completed all 3 sets!
          setIsCompleted(true);
          markGameCompleted('gym');
        }
      }, 700);
    } else {
      // Reset lifting animation quickly to let them try again immediately
      setTimeout(() => {
        setIsLifting(false);
      }, 500);
    }
  }, [gameStarted, isCompleted, isLifting, meterPos, state.easyMode, currentSetIdx, addScore, markGameCompleted]);

  const handleSkip = () => {
    setCompletedSets([0, 1, 2]);
    setIsCompleted(true);
    markGameCompleted('gym');
  };

  const currentExercise = EXERCISES[currentSetIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveGame('hub')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/70 hover:text-white bg-[#0B1F4D] border border-white/10 hover:border-[#00F0FF]/30 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Arena Hub
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1F4D] border border-white/10 text-xs font-mono text-[#00F0FF]">
            <Dumbbell className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Set {currentSetIdx + 1} of {EXERCISES.length}</span>
          </div>

          {(failedCount >= 2 || state.easyMode) && !isCompleted && (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/40 hover:bg-[#FFD700]/20 transition-all"
              title="Skip trial with full completion credit"
            >
              <FastForward className="w-3.5 h-3.5" />
              Skip Trial
            </button>
          )}
        </div>
      </div>

      {/* Main Gym Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1F4D] to-[#050B1F] border-2 border-[#00F0FF]/30 p-5 sm:p-8 text-center space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.2)] select-none">
        
        {/* Pre-Game Instructions */}
        {!gameStarted && !isCompleted && (
          <div className="space-y-5 py-4 max-w-md mx-auto animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/15 border-2 border-[#00F0FF] mx-auto flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              🏋️
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white font-tech tracking-wide">
                TRIAL 02: GYM RUSH
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                A moving bar glides slowly across the gauge. Tap anywhere when the marker enters the green target zone to complete a rep. No failure—every attempt builds momentum.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-black/40 border border-[#00F0FF]/20 text-[#00F0FF]">
                Bench Press<br />
                <span className="text-white font-bold">225 lbs</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-[#38BDF8]/20 text-[#38BDF8]">
                Squat<br />
                <span className="text-white font-bold">315 lbs</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-[#FFD700]/20 text-[#FFD700]">
                Deadlift<br />
                <span className="text-white font-bold">405 lbs</span>
              </div>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="w-full py-3.5 px-8 rounded-xl bg-[#00F0FF] text-[#050B1F] font-black font-tech text-sm uppercase tracking-wider hover:bg-[#38BDF8] active:scale-95 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              Step Up to the Bar
            </button>
          </div>
        )}

        {/* Active Game Interface */}
        {gameStarted && !isCompleted && (
          <div className="space-y-6">
            
            {/* Current Lift Info */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#00F0FF] tracking-widest uppercase">
                HEAVY IRON TRIAL
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-tech tracking-wide">
                {currentExercise.name} · <span className="text-[#FFD700]">{currentExercise.weight}</span>
              </h3>
              <p className="text-xs text-white/60">
                {currentExercise.subtext}
              </p>
            </div>

            {/* Visual Barbell Graphic */}
            <div className="py-4 relative flex items-center justify-center h-28">
              {/* Floor Shadow */}
              <div className="absolute bottom-2 w-56 h-3 rounded-full bg-black/50 blur-sm" />

              {/* Barbell Assembly */}
              <div
                className={`flex items-center justify-center gap-1 transition-transform duration-300 ${
                  isLifting ? '-translate-y-8 scale-105' : 'translate-y-0'
                }`}
              >
                {/* Left Plates */}
                <div className="flex items-center gap-0.5">
                  <div className="w-3.5 h-20 rounded-md bg-[#00F0FF] border border-white/40 shadow-[0_0_10px_#00F0FF]" />
                  <div className="w-3.5 h-16 rounded-md bg-[#00F0FF]/80 border border-white/30" />
                  <div className="w-3.5 h-12 rounded-md bg-[#38BDF8] border border-white/20" />
                </div>

                {/* Knurled Steel Bar */}
                <div className="w-44 sm:w-60 h-3 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 rounded-sm relative shadow-md">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-black/30 border-x border-white/20" />
                </div>

                {/* Right Plates */}
                <div className="flex items-center gap-0.5">
                  <div className="w-3.5 h-12 rounded-md bg-[#38BDF8] border border-white/20" />
                  <div className="w-3.5 h-16 rounded-md bg-[#00F0FF]/80 border border-white/30" />
                  <div className="w-3.5 h-20 rounded-md bg-[#00F0FF] border border-white/40 shadow-[0_0_10px_#00F0FF]" />
                </div>
              </div>
            </div>

            {/* Timing Meter Gauge */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                <span>PREP</span>
                <span className="text-emerald-400 font-bold">PERFECT ZONE</span>
                <span>LOCKOUT</span>
              </div>

              {/* Meter Track */}
              <div className="relative h-10 rounded-xl bg-[#050B1F] border-2 border-[#00F0FF]/40 overflow-hidden shadow-inner flex items-center">
                
                {/* Wide Green Target Zone in the Middle */}
                <div
                  className={`absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/50 to-emerald-500/20 border-x-2 border-emerald-400 ${
                    state.easyMode ? 'left-[30%] right-[30%]' : 'left-[36%] right-[36%]'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest opacity-80">
                      HIT HERE
                    </span>
                  </div>
                </div>

                {/* Bullseye line */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-[#FFD700] shadow-[0_0_8px_#FFD700] z-10" />

                {/* Moving Indicator Bar */}
                <div
                  className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-gradient-to-b from-white via-[#00F0FF] to-white rounded-sm shadow-[0_0_15px_#00F0FF] z-20 pointer-events-none"
                  style={{ left: `${meterPos}%` }}
                />
              </div>
            </div>

            {/* Feedback Toast */}
            {feedback && (
              <div className="p-3 rounded-xl bg-black/40 border border-[#00F0FF]/30 max-w-md mx-auto animate-in zoom-in-95 duration-150">
                <div
                  className={`text-sm font-black font-tech uppercase tracking-wide ${
                    feedback.rating === 'PERFECT'
                      ? 'text-[#FFD700]'
                      : feedback.rating === 'GOOD'
                      ? 'text-emerald-400'
                      : 'text-[#38BDF8]'
                  }`}
                >
                  {feedback.rating}!
                </div>
                <div className="text-xs text-white/80 font-medium">
                  {feedback.comment}
                </div>
              </div>
            )}

            {/* Big Tap Area Button */}
            <div className="pt-2">
              <button
                onClick={handleTap}
                className="w-full max-w-md py-4 px-6 rounded-2xl bg-[#00F0FF] hover:bg-[#38BDF8] text-[#050B1F] font-black font-tech text-base uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Dumbbell className="w-5 h-5 fill-current" />
                TAP TO LOCK IN REP
              </button>
            </div>

          </div>
        )}

        {/* Victory Screen */}
        {isCompleted && (
          <div className="py-6 space-y-5 max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] mx-auto flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(255,215,0,0.5)]">
              🏋️
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#FFD700] tracking-widest uppercase">
                Achievement Unlocked
              </div>
              <h3 className="text-2xl font-black text-white font-tech">
                IRON WILL CONFIRMED!
              </h3>
              <p className="text-xs text-white/80">
                225 lbs Bench. 315 lbs Squat. 405 lbs Deadlift. Reps locked out with clean mechanical precision. That discipline carries over everywhere.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>3 Sets Mastered · Zero Failed Sets</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentSetIdx(0);
                  setCompletedSets([]);
                  setIsCompleted(false);
                  setFeedback(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Replay Sets
              </button>
              <button
                onClick={() => setActiveGame('boss')}
                className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:bg-[#38BDF8] active:scale-95 transition-all shadow-md flex items-center gap-1.5"
              >
                Confront Impossible
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
