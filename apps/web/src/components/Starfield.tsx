import { useRef, useMemo, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hue: number;
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 300 + Math.random() * 700;
    const hue = Math.random();
    let color: string;
    if (hue < 0.4) color = '#e8e8ff';
    else if (hue < 0.6) color = '#aaccff';
    else if (hue < 0.75) color = '#ffddaa';
    else if (hue < 0.88) color = '#ffccaa';
    else if (hue < 0.95) color = '#ffbbaa';
    else color = '#d4aaff';

    stars.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.sin(theta),
      size: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
      color,
      hue,
    });
  }
  return stars;
}

function parseColor(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  const stars = useMemo(() => generateStars(2000), []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      time += 0.008;
      const w = canvas.width;
      const h = canvas.height;

      // Fade trail
      ctx.fillStyle = 'rgba(10, 10, 15, 0.25)';
      ctx.fillRect(0, 0, w, h);

      const targetRotX = mouseRef.current.y * 0.03;
      const targetRotY = mouseRef.current.x * 0.03;
      rotationRef.current.x += (targetRotX - rotationRef.current.x) * 0.03;
      rotationRef.current.y += (targetRotY - rotationRef.current.y) * 0.03;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      for (const star of stars) {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y1 = star.y * cosX - z1 * sinX;
        const z2 = star.y * sinX + z1 * cosX;

        const scale = 600 / (600 + z2);
        const sx = x1 * scale + w / 2;
        const sy = y1 * scale + h / 2;

        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.35 + 0.65;
        const alpha = star.opacity * twinkle * Math.min(1, scale * 2.5);
        const size = star.size * scale * 0.8;

        if (size < 0.2) continue;

        const [r, g, b] = parseColor(star.color);

        // Outer glow for brighter stars
        if (star.size > 1.3) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Bright center
        if (star.size > 1.8) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}