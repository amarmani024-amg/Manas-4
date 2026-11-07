import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Sparkles, Smartphone, X } from 'lucide-react';
import { useArena } from '../context/ArenaContext';

export const EasterEggs: React.FC = () => {
  const { triggerEasterEgg, state } = useArena();
  const [modalMessage, setModalMessage] = useState<{ title: string; body: string; code?: string } | null>(null);
  const [showVirtualTerminal, setShowVirtualTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const keySequenceRef = useRef<string[]>([]);

  // 1. Keyboard listener for typing "hello"
  useEffect(() => {
    const target = 'hello';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const char = e.key.toLowerCase();
      if (!/^[a-z]$/.test(char)) return;

      keySequenceRef.current.push(char);
      if (keySequenceRef.current.length > target.length) {
        keySequenceRef.current.shift();
      }

      if (keySequenceRef.current.join('') === target) {
        keySequenceRef.current = [];
        triggerEasterEgg('hello');
        setModalMessage({
          title: 'TRANSMISSION DECODED',
          body: 'Hello. Your engineering instincts are sharp, your lifts are heavy, and your character is second to none. Keep building with precision.',
          code: 'AUTH_OK_CODE_23',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerEasterEgg]);

  // 2. Shake detection via DeviceMotionEvent
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = 0;
    const SHAKE_THRESHOLD = 15;

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current || current.x === null || current.y === null || current.z === null) return;

      const now = Date.now();
      if (now - lastTime > 150) {
        const diffTime = now - lastTime;
        lastTime = now;

        const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
          triggerEasterEgg('shake');
          setModalMessage({
            title: 'SEISMIC MOTION DETECTED',
            body: 'Physical motion activated. When you move, the whole arena shifts with you.',
          });
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [triggerEasterEgg]);

  // Handle hidden corner button click
  const handleCornerClick = () => {
    triggerEasterEgg('corner');
    setModalMessage({
      title: 'HIDDEN SWITCH DISCOVERED',
      body: 'You notice the edge cases others overlook. That attention to nuance makes great systems work.',
      code: 'CORNER_OVERRIDE_ACTIVE',
    });
  };

  const handleManualShake = () => {
    triggerEasterEgg('shake');
    setModalMessage({
      title: 'KINETIC ENERGY UNLEASHED',
      body: 'Arena tremor confirmed. Raw momentum and focus in every motion.',
    });
  };

  const handleVirtualTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim().toLowerCase() === 'hello') {
      setShowVirtualTerminal(false);
      setTerminalInput('');
      triggerEasterEgg('hello');
      setModalMessage({
        title: 'TRANSMISSION DECODED',
        body: 'Hello. Your engineering instincts are sharp, your lifts are heavy, and your character is second to none. Keep building with precision.',
        code: 'AUTH_OK_CODE_23',
      });
    } else {
      setTerminalInput('');
    }
  };

  return (
    <>
      {/* Discreet Corner Button (Bottom-Right) */}
      <button
        onClick={handleCornerClick}
        className="fixed bottom-1.5 right-1.5 z-30 w-3 h-3 rounded-full bg-[#00F0FF]/25 hover:bg-[#00F0FF] hover:scale-150 transition-all focus:outline-none"
        title="Arcade pixel"
        aria-label="Secret arcade pixel"
      />

      {/* Floating Utility Pills on Bottom Bar: Shake & Mobile Terminal */}
      <aside aria-label="Arena utility controls" className="fixed bottom-2.5 left-3 z-30 flex items-center gap-2">
        <button
          onClick={handleManualShake}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B1F4D]/80 border border-[#00F0FF]/30 text-[11px] font-mono text-[#00F0FF] hover:bg-[#00F0FF]/20 active:scale-95 transition-all shadow-md backdrop-blur-sm"
          title="Trigger arena kinetic tremor & confetti"
        >
          <Smartphone className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Shake Confetti</span>
        </button>

        <button
          onClick={() => setShowVirtualTerminal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B1F4D]/80 border border-[#FFD700]/30 text-[11px] font-mono text-[#FFD700] hover:bg-[#FFD700]/20 active:scale-95 transition-all shadow-md backdrop-blur-sm"
          title="Open mobile arcade terminal"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prompt</span>
        </button>
      </aside>

      {/* Virtual Terminal Modal (for touch devices) */}
      {showVirtualTerminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl bg-[#071330] border-2 border-[#00F0FF]/40 p-4 shadow-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs text-[#00F0FF] font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                TERMINAL PROMPT
              </span>
              <button
                onClick={() => setShowVirtualTerminal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-white/70">
              Type the five-letter greeting to decrypt the system broadcast:
            </p>
            <form onSubmit={handleVirtualTerminalSubmit} className="space-y-3">
              <div className="flex items-center gap-2 bg-[#050B1F] border border-[#00F0FF]/30 rounded-lg px-3 py-2">
                <span className="text-[#00F0FF] text-xs">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type here..."
                  autoFocus
                  className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-white/30"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVirtualTerminal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#00F0FF] text-[#050B1F] hover:bg-[#38BDF8]"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret Message Modal */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0B1F4D] to-[#071330] border-2 border-[#FFD700] p-6 shadow-[0_0_40px_rgba(255,215,0,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#FFD700]/30 pb-3">
              <div className="flex items-center gap-2 text-[#FFD700] font-tech font-bold text-sm tracking-wide">
                <Sparkles className="w-4 h-4" />
                {modalMessage.title}
              </div>
              <button
                onClick={() => setModalMessage(null)}
                className="text-white/50 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/90 leading-relaxed font-medium">
              {modalMessage.body}
            </p>

            {modalMessage.code && (
              <div className="p-2.5 rounded-lg bg-[#050B1F] border border-[#00F0FF]/30 text-center font-mono text-xs text-[#00F0FF]">
                {modalMessage.code}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalMessage(null)}
                className="w-full py-2.5 rounded-xl bg-[#FFD700] text-[#050B1F] font-bold text-xs uppercase tracking-wider font-tech hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
