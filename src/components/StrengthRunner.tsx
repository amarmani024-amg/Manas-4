import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, ArrowLeft, RotateCcw, Heart, FastForward, Shield, Sparkles } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';
import { ContinueModal } from './ContinueModal';
import { StrengthKey } from '../types';

interface RunnerItem {
  x: number;
  y: number;
  type: 'orb' | 'obstacle';
  name: string;
  collected?: boolean;
  width: number;
  height: number;
  color: string;
}

const REQUIRED_STRENGTHS: StrengthKey[] = ['Loyalty', 'Focus', 'Hope', 'Discipline', 'Knowledge'];

export const StrengthRunner: React.FC = () => {
  const { state, setActiveGame, collectStrength, markGameCompleted, recordFailure, addScore } = useArena();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [lives, setLives] = useState(3);
  const [collectedInRun, setCollectedInRun] = useState<StrengthKey[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Runner physics state in ref to avoid re-renders inside 60fps loop
  const gameStateRef = useRef({
    playerY: 0,
    playerVy: 0,
    isGrounded: true,
    invulnerableTime: 0,
    cameraX: 0,
    items: [] as RunnerItem[],
    finishX: 2800,
    isRunning: false,
    groundY: 260,
  });

  const failedCount = state.failedAttempts['runner'] || 0;

  // Initialize level track
  const setupLevel = useCallback(() => {
    const isEasy = state.easyMode;
    const spacing = isEasy ? 450 : 350;

    const items: RunnerItem[] = [
      // 1. Loyalty orb
      { x: 450, y: 190, type: 'orb', name: 'Loyalty', width: 34, height: 34, color: '#00F0FF' },
      // Obstacle: Procrastination
      { x: 750, y: 220, type: 'obstacle', name: 'Procrastination', width: 44, height: 40, color: '#F43F5E' },
      // 2. Focus orb
      { x: 1050, y: 180, type: 'orb', name: 'Focus', width: 34, height: 34, color: '#38BDF8' },
      // Obstacle: Bugs in Code
      { x: 1380, y: 225, type: 'obstacle', name: 'Bugs in Code', width: 44, height: 35, color: '#FB923C' },
      // 3. Hope orb
      { x: 1680, y: 190, type: 'orb', name: 'Hope', width: 34, height: 34, color: '#FFD700' },
      // Obstacle: Skipped Gym Day
      { x: 2000, y: 220, type: 'obstacle', name: 'Skipped Gym Day', width: 44, height: 40, color: '#E11D48' },
      // 4. Discipline orb
      { x: 2280, y: 180, type: 'orb', name: 'Discipline', width: 34, height: 34, color: '#00F0FF' },
      // 5. Knowledge orb
      { x: 2550, y: 185, type: 'orb', name: 'Knowledge', width: 34, height: 34, color: '#F59E0B' },
    ];

    gameStateRef.current = {
      playerY: 0,
      playerVy: 0,
      isGrounded: true,
      invulnerableTime: 0,
      cameraX: 0,
      items,
      finishX: 2800,
      isRunning: true,
      groundY: 260,
    };

    setLives(3);
    setCollectedInRun([]);
    setIsCompleted(false);
  }, [state.easyMode]);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setupLevel();
      return;
    }

    const g = gameStateRef.current;
    if (g.isGrounded && g.isRunning) {
      sound.playJump();
      triggerVibration(25);
      g.playerVy = state.easyMode ? -13.5 : -12.5; // Floaty, easy jump
      g.isGrounded = false;
    }
  }, [gameStarted, setupLevel, state.easyMode]);

  // Main canvas animation loop
  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    let animId: number;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = state.easyMode ? 0.48 : 0.55;
    const runSpeed = state.easyMode ? 3.8 : 4.6; // Gentle, relaxed run

    const render = () => {
      const g = gameStateRef.current;

      if (g.isRunning) {
        // Physics update
        g.playerVy += gravity;
        g.playerY += g.playerVy;

        if (g.playerY >= 0) {
          g.playerY = 0;
          g.playerVy = 0;
          g.isGrounded = true;
        }

        g.cameraX += runSpeed;

        if (g.invulnerableTime > 0) {
          g.invulnerableTime--;
        }

        // Check collisions
        const playerBox = {
          x: 100,
          y: g.groundY - 45 + g.playerY,
          w: 32,
          h: 45,
        };

        g.items.forEach((item) => {
          if (item.collected) return;
          const itemScreenX = item.x - g.cameraX + 100;

          // Box collision
          if (
            playerBox.x < itemScreenX + item.width &&
            playerBox.x + playerBox.w > itemScreenX &&
            playerBox.y < item.y + item.height &&
            playerBox.y + playerBox.h > item.y
          ) {
            if (item.type === 'orb') {
              item.collected = true;
              sound.playCollect();
              triggerVibration(40);
              addScore(150);
              const strengthName = item.name as StrengthKey;
              collectStrength(strengthName);
              setCollectedInRun((prev) => [...prev, strengthName]);
            } else if (item.type === 'obstacle' && g.invulnerableTime === 0) {
              // Hit obstacle - friendly continue, no instant death!
              sound.playHit();
              triggerVibration(80);
              g.invulnerableTime = 70; // ~1.2s flash immunity
              setLives((prev) => {
                const nextLives = prev - 1;
                if (nextLives <= 0) {
                  g.isRunning = false;
                  recordFailure('runner');
                  setShowContinue(true);
                  return 0;
                }
                return nextLives;
              });
            }
          }
        });

        // Check finish line
        if (g.cameraX >= g.finishX) {
          g.isRunning = false;
          setIsCompleted(true);
          REQUIRED_STRENGTHS.forEach((s) => collectStrength(s));
          markGameCompleted('runner');
        }
      }

      // Drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Cyberpunk gradient sky
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#071330');
      grad.addColorStop(0.7, '#0B1F4D');
      grad.addColorStop(1, '#050B1F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Parallax background stars & city skyline
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      for (let i = 0; i < 15; i++) {
        const sx = ((i * 120 - g.cameraX * 0.2) % canvas.width + canvas.width) % canvas.width;
        ctx.fillRect(sx, 70 + (i % 4) * 20, 2, 2);
      }

      // Distant retro grid horizon
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, g.groundY);
        ctx.lineTo(x + 20, canvas.height);
        ctx.stroke();
      }

      // 3. Ground line & neon strip
      ctx.fillStyle = '#050B1F';
      ctx.fillRect(0, g.groundY, canvas.width, canvas.height - g.groundY);

      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, g.groundY);
      ctx.lineTo(canvas.width, g.groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. Render Items (Orbs and Obstacles)
      g.items.forEach((item) => {
        if (item.collected) return;
        const screenX = item.x - g.cameraX + 100;
        if (screenX < -100 || screenX > canvas.width + 100) return;

        if (item.type === 'orb') {
          // Glowing Strength Orb
          ctx.save();
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(screenX + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
          ctx.fill();

          // Text badge inside orb
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#050B1F';
          ctx.font = 'bold 9px "Outfit", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.name[0], screenX + item.width / 2, item.y + item.height / 2);

          // Name label above orb
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px "Chakra Petch", sans-serif';
          ctx.fillText(item.name, screenX + item.width / 2, item.y - 8);
          ctx.restore();
        } else {
          // Obstacle with humorous sign
          ctx.save();
          ctx.fillStyle = '#0F172A';
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 2;
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 8;

          // Roadblock card
          ctx.strokeRect(screenX, item.y, item.width, item.height);
          ctx.fillRect(screenX, item.y, item.width, item.height);

          // Obstacle Title
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px "Outfit", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.name, screenX + item.width / 2, item.y - 6);

          // Icon inside
          ctx.fillStyle = item.color;
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const symbol = item.name.includes('Code') ? '⚙️' : item.name.includes('Gym') ? '💤' : '⏳';
          ctx.fillText(symbol, screenX + item.width / 2, item.y + item.height / 2);

          ctx.restore();
        }
      });

      // 5. Render Finish Banner
      const finishScreenX = g.finishX - g.cameraX + 100;
      if (finishScreenX > -50 && finishScreenX < canvas.width + 100) {
        ctx.save();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(finishScreenX, g.groundY);
        ctx.lineTo(finishScreenX, g.groundY - 120);
        ctx.stroke();

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.fillText('FINISH', finishScreenX + 10, g.groundY - 90);
        ctx.restore();
      }

      // 6. Render Player Hero
      const isFlashing = g.invulnerableTime > 0 && Math.floor(g.invulnerableTime / 5) % 2 === 0;
      if (!isFlashing) {
        const px = 100;
        const py = g.groundY - 45 + g.playerY;

        ctx.save();
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;

        // Torso & head
        ctx.fillStyle = '#00F0FF';
        ctx.beginPath();
        ctx.arc(px + 16, py + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0B1F4D';
        ctx.fillRect(px + 8, py + 22, 16, 20);

        // Legs animated running
        const legPhase = (g.cameraX * 0.15) % Math.PI;
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px + 12, py + 42);
        ctx.lineTo(px + 8 + Math.sin(legPhase) * 8, py + 45);
        ctx.moveTo(px + 20, py + 42);
        ctx.lineTo(px + 24 - Math.sin(legPhase) * 8, py + 45);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameStarted, state.easyMode, addScore, collectStrength, markGameCompleted, recordFailure]);

  // Handle keyboard spacebar jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const handleRevive = () => {
    setShowContinue(false);
    setLives(3);
    gameStateRef.current.invulnerableTime = 90;
    gameStateRef.current.isRunning = true;
  };

  const handleSkip = () => {
    REQUIRED_STRENGTHS.forEach((s) => collectStrength(s));
    markGameCompleted('runner');
    setIsCompleted(true);
  };

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
          {/* Lives display */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0B1F4D] border border-white/10">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 transition-all ${
                  heart <= lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-white/20 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Skip button if attempts >= 2 */}
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

      {/* Main Game Screen Card */}
      <div className="relative rounded-2xl bg-[#050B1F] border-2 border-[#00F0FF]/30 overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.2)]">
        
        {/* Canvas Display */}
        <div
          onClick={jump}
          className="relative w-full h-[320px] sm:h-[360px] cursor-pointer touch-none select-none flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            width={720}
            height={340}
            className="w-full h-full object-cover"
          />

          {/* Pre-Game Instructions Overlay */}
          {!gameStarted && !isCompleted && (
            <div className="absolute inset-0 bg-[#050B1F]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div className="space-y-1.5 max-w-md">
                <h2 className="text-xl sm:text-2xl font-black text-white font-tech tracking-wide">
                  TRIAL 01: STRENGTH RUNNER
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  One-tap jump. Leap over daily roadblocks (<span className="text-rose-400">Procrastination</span>, <span className="text-amber-400">Code Bugs</span>, <span className="text-rose-400">Skipped Gym Days</span>) and gather your 5 core weapons.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#00F0FF]">
                <span className="px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#00F0FF]/30">3 Free Lives</span>
                <span className="px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#00F0FF]/30">Hits Never Stop Run</span>
                <span className="px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#00F0FF]/30">Tap Anywhere to Jump</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameStarted(true);
                  setupLevel();
                }}
                className="py-3 px-8 rounded-xl bg-[#00F0FF] text-[#050B1F] font-black font-tech text-sm uppercase tracking-wider hover:bg-[#38BDF8] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Tap to Start Run
              </button>
            </div>
          )}

          {/* Completed Victory Screen Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-[#050B1F]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                🏆
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-[#FFD700] tracking-widest uppercase">
                  Trial Cleared
                </div>
                <h3 className="text-2xl font-black text-white font-tech">
                  STRENGTH RUNNER CONQUERED!
                </h3>
                <p className="text-xs text-white/80 max-w-sm">
                  You dodged every distraction and secured all 5 core strengths. Your arsenal is loaded for the upcoming trials.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {REQUIRED_STRENGTHS.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-[#0B1F4D] border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#FFD700]" />
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setupLevel();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay
                </button>
                <button
                  onClick={() => setActiveGame('gym')}
                  className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#050B1F] font-bold font-tech text-xs uppercase tracking-wider hover:bg-[#38BDF8] active:scale-95 transition-all shadow-md"
                >
                  Proceed to Gym Rush &rarr;
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Interactive Tap Bar for Mobile/Touch */}
        <div
          onClick={jump}
          className="bg-[#0B1F4D]/90 border-t border-[#00F0FF]/20 px-4 py-3 flex items-center justify-between text-xs font-mono cursor-pointer hover:bg-[#11285A] transition-colors"
        >
          <div className="flex items-center gap-2 text-white/70">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span>Tap screen or spacebar to JUMP</span>
          </div>
          <div className="text-[#00F0FF] font-bold">
            Orbs: {collectedInRun.length}/5
          </div>
        </div>

      </div>

      {/* Continue Modal */}
      <ContinueModal
        isOpen={showContinue}
        onRevive={handleRevive}
        onExit={() => {
          setShowContinue(false);
          setupLevel();
        }}
        gameTitle="STRENGTH RUNNER"
      />

    </div>
  );
};
