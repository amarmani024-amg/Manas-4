/**
 * Lightweight canvas confetti & fireworks engine
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'confetti' | 'firework';
}

const ARCADE_COLORS = [
  '#00F0FF', // Electric cyan
  '#38BDF8', // Sky cyan
  '#FFD700', // Gold
  '#F59E0B', // Amber
  '#FFFFFF', // Ice white
  '#6366F1', // Indigo
  '#3B82F6', // Cobalt
  '#F43F5E', // Neon coral
];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animFrameId: number | null = null;

function initCanvas(): boolean {
  if (typeof window === 'undefined') return false;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'arena-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  return !!ctx;
}

function loop() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life++;
    p.x += p.vx;
    p.y += p.vy;

    if (p.type === 'confetti') {
      p.vy += 0.15; // gentle gravity
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    } else {
      // Firework spark
      p.vy += 0.08;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }

    if (p.life >= p.maxLife || p.y > canvas.height + 20) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    if (p.type === 'confetti') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
      // Sparkle particle
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(loop);
  } else {
    animFrameId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function launchConfetti(count = 80) {
  if (!initCanvas()) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    const originX = Math.random() < 0.5 ? w * 0.2 : w * 0.8;
    const originY = h * 0.35;

    const angle = (Math.random() * Math.PI) - Math.PI / 2;
    const speed = 6 + Math.random() * 12;

    particles.push({
      x: originX + (Math.random() - 0.5) * 60,
      y: originY + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed + (originX > w / 2 ? -3 : 3),
      vy: Math.sin(angle) * speed - 4,
      size: 8 + Math.random() * 8,
      color: ARCADE_COLORS[Math.floor(Math.random() * ARCADE_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      life: 0,
      maxLife: 120 + Math.random() * 60,
      type: 'confetti',
    });
  }

  if (!animFrameId) {
    animFrameId = requestAnimationFrame(loop);
  }
}

export function launchFireworks(bursts = 5) {
  if (!initCanvas()) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const cx = w * (0.2 + Math.random() * 0.6);
      const cy = h * (0.15 + Math.random() * 0.4);
      const color = ARCADE_COLORS[Math.floor(Math.random() * ARCADE_COLORS.length)];

      const sparkCount = 45;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() * 0.2);
        const speed = 2.5 + Math.random() * 6.5;

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 4,
          color: Math.random() > 0.4 ? color : '#FFD700',
          rotation: 0,
          rotationSpeed: 0,
          alpha: 1,
          life: 0,
          maxLife: 70 + Math.random() * 40,
          type: 'firework',
        });
      }

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(loop);
      }
    }, b * 220);
  }
}
