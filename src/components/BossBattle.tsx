import React, { useState } from 'react';
import { Swords, ArrowLeft, RotateCcw, Shield, Zap, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { useArena } from '../context/ArenaContext';
import { sound } from '../utils/audio';
import { triggerVibration } from '../utils/vibrate';
import { StrengthKey } from '../types';

interface StrengthAttack {
  key: StrengthKey;
  name: string;
  label: string;
  desc: string;
  damage: number;
  icon: string;
  reaction: string;
}

const ATTACKS: StrengthAttack[] = [
  {
    key: 'Discipline',
    name: 'Discipline',
    label: 'Consistent Reps Strike',
    desc: '5:30 AM workouts and uninterrupted consistency.',
    damage: 28,
    icon: '⚡',
    reaction: '"Wait! Nobody maintains this routine every single week without skipping!"',
  },
  {
    key: 'Knowledge',
    name: 'Knowledge',
    label: 'Root Cause Analysis',
    desc: 'Understanding the system architecture from the silicon up.',
    damage: 25,
    icon: '💡',
    reaction: '"Ouch! Your engineering logic dismantled my whole premise!"',
  },
  {
    key: 'Loyalty',
    name: 'Loyalty',
    label: 'Shield of Integrity',
    desc: 'Standing firm for the people who count on you.',
    damage: 25,
    icon: '🛡️',
    reaction: '"Such steadfast reliability... my doubts have zero leverage here!"',
  },
  {
    key: 'Focus',
    name: 'Focus',
    label: 'Laser Deep Work',
    desc: 'Silencing all noise. Code compiles on the first build.',
    damage: 26,
    icon: '🎯',
    reaction: '"Total concentration?! Not even complex concurrency can shake you!"',
  },
  {
    key: 'Hope',
    name: 'Hope',
    label: 'Unshakable Optimism',
    desc: 'Seeing the horizon clear long before the milestone hits.',
    damage: 24,
    icon: '🌅',
    reaction: '"Your optimism is relentless... I have nowhere left to stand!"',
  },
];

const BOSS_QUOTES = [
  '"You have tough exams, gym sessions, and complex builds. Surely you want to quit?"',
  '"That distributed architecture is way too complicated for one person!"',
  '"The weights are too heavy today. Just skip the session!"',
  '"Nobody stays this mature, helpful, and disciplined at 23!"',
];

export const BossBattle: React.FC = () => {
  const { state, setActiveGame, markGameCompleted, addScore } = useArena();

  const [gameStarted, setGameStarted] = useState(false);
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [currentBossQuote, setCurrentBossQuote] = useState(BOSS_QUOTES[0]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [usedAttacks, setUsedAttacks] = useState<StrengthKey[]>([]);

  const handleAttack = (atk: StrengthAttack) => {
    if (isAttacking || isCompleted) return;

    setIsAttacking(true);
    sound.playAttack();
    triggerVibration(50);
    setUsedAttacks((prev) => [...prev, atk.key]);

    // Apply attack damage to Boss
    setTimeout(() => {
      sound.playBossHit();
      triggerVibration([60, 40, 80]);
      addScore(300);

      const nextHp = Math.max(0, bossHp - atk.damage);
      setBossHp(nextHp);

      const newLog = [
        `You unleashed ${atk.label}!`,
        `Impossible reacts: ${atk.reaction}`,
      ];
      setBattleLog(newLog);

      if (nextHp <= 0) {
        // Boss Defeated! Player always wins!
        setTimeout(() => {
          setIsCompleted(true);
          setIsAttacking(false);
          markGameCompleted('boss');
        }, 800);
      } else {
        // Boss playful retaliate
        setTimeout(() => {
          const randomQuote = BOSS_QUOTES[Math.floor(Math.random() * BOSS_QUOTES.length)];
          setCurrentBossQuote(randomQuote);
          setPlayerHp((prev) => Math.max(40, prev - 8)); // Never goes low, player is safe
          setIsAttacking(false);
        }, 600);
      }
    }, 400);
  };

  const handleReset = () => {
    setBossHp(100);
    setPlayerHp(100);
    setCurrentBossQuote(BOSS_QUOTES[0]);
    setBattleLog([]);
    setUsedAttacks([]);
    setIsCompleted(false);
    setIsAttacking(false);
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

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1F4D] border border-white/10 text-xs font-mono text-[#FFD700]">
          <Swords className="w-3.5 h-3.5" />
          <span>Final Encounter</span>
        </div>
      </div>

      {/* Main Battle Arena Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0B1F4D] via-[#071330] to-[#050B1F] border-2 border-[#FFD700]/40 p-5 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
        
        {/* Pre-Battle Instructions */}
        {!gameStarted && !isCompleted && (
          <div className="space-y-5 py-4 max-w-md mx-auto text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD700]/15 border-2 border-[#FFD700] mx-auto flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              👾
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white font-tech tracking-wide">
                FINAL TRIAL: CONFRONT &ldquo;IMPOSSIBLE&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                The gatekeeper calls itself &ldquo;Impossible&rdquo;—the voice that doubts your capacity. Strike back using the 5 core strengths you forged.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#00F0FF]/20 text-xs text-white/70">
              Pick your moves in turn. The outcome is predetermined: your discipline and character always win.
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="w-full py-3.5 px-8 rounded-xl bg-[#FFD700] text-[#050B1F] font-black font-tech text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,215,0,0.4)] flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4 fill-current" />
              Engage &ldquo;Impossible&rdquo;
            </button>
          </div>
        )}

        {/* Active Turn-Based Battle */}
        {gameStarted && !isCompleted && (
          <div className="space-y-6">
            
            {/* Top Gauges: Boss vs Player */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Boss Gauge */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    BOSS: &ldquo;IMPOSSIBLE&rdquo;
                  </span>
                  <span className="text-white/60 tabular-nums">{bossHp}% HP</span>
                </div>
                <div className="h-3 rounded-full bg-[#050B1F] border border-rose-500/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${bossHp}%` }}
                  />
                </div>
              </div>

              {/* Player Gauge */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-[#00F0FF]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#00F0FF] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    YOU (THE ARCHITECT)
                  </span>
                  <span className="text-white/60 tabular-nums">{playerHp}% HP</span>
                </div>
                <div className="h-3 rounded-full bg-[#050B1F] border border-[#00F0FF]/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] transition-all duration-300"
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Boss Hologram & Speech */}
            <div className="p-5 rounded-2xl bg-[#050B1F] border border-white/10 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
              
              {/* Boss Sprite Animation */}
              <div
                className={`relative mb-3 transition-transform duration-300 ${
                  isAttacking ? 'scale-90 rotate-3 opacity-70' : 'scale-100 animate-pulse'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                  👾
                </div>
              </div>

              {/* Speech Bubble */}
              <div className="text-xs sm:text-sm font-mono text-white/90 italic max-w-lg px-4">
                {currentBossQuote}
              </div>
            </div>

            {/* Battle Log */}
            {battleLog.length > 0 && (
              <div className="p-3 rounded-xl bg-black/50 border border-[#FFD700]/30 space-y-1 text-center font-mono text-xs">
                <div className="text-[#FFD700] font-bold">{battleLog[0]}</div>
                <div className="text-white/80">{battleLog[1]}</div>
              </div>
            )}

            {/* Attack Options: The 5 Gathered Strengths */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
                Select Your Weapon
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ATTACKS.map((atk) => {
                  const wasUsed = usedAttacks.includes(atk.key);
                  return (
                    <button
                      key={atk.key}
                      disabled={isAttacking}
                      onClick={() => handleAttack(atk)}
                      className={`p-3 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-2 ${
                        wasUsed
                          ? 'bg-[#0B1F4D]/50 border-white/10 opacity-75'
                          : 'bg-[#0B1F4D] border-[#00F0FF]/40 hover:border-[#00F0FF] hover:bg-[#11285A] shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{atk.icon}</span>
                        <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
                          +{atk.damage} PWR
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-tech">
                          {atk.label}
                        </div>
                        <div className="text-[11px] text-white/65 line-clamp-1">
                          {atk.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Victory Screen */}
        {isCompleted && (
          <div className="py-6 space-y-5 max-w-md mx-auto text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] mx-auto flex items-center justify-center text-3xl shadow-[0_0_35px_rgba(255,215,0,0.5)]">
              👑
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-mono font-bold text-[#FFD700] tracking-widest uppercase">
                Final Trial Cleared
              </div>
              <h3 className="text-2xl font-black text-white font-tech">
                &ldquo;IMPOSSIBLE&rdquo; HAS FALLEN!
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                It tried to argue with excuses. You answered with discipline, focus, and unwavering character. The arena bows to you.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-[#FFD700]/40 text-xs font-mono text-[#FFD700] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>All 3 Arena Trials Conquered</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Fight Again
              </button>
              <button
                onClick={() => setActiveGame('victory')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#00F0FF] text-[#050B1F] font-black font-tech text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
              >
                Claim Grand Victory
                <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
