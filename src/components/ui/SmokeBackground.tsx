"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 14;
const BASE_OPACITY = 0.05; // keep it subtle so text stays readable
// The smoke is soft and blurry anyway, so render it at a fraction of the screen
// resolution and let CSS scale it up. Big perf win, no visible difference.
const RENDER_SCALE = 0.5;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface Particle {
  x: number;
  y: number;
  r0: number;
  grow: number;
  vx: number;
  vy: number;
  opacity: number;
  phase: number;
  age: number;
  life: number;
}

function createParticle(w: number, h: number, scatterAge = false): Particle {
  const r0 = rand(120, 320) * RENDER_SCALE;
  const maxR = rand(340, 520) * RENDER_SCALE;
  const grow = rand(0.06, 0.18) * RENDER_SCALE; // radius px per 60fps frame
  const life = (maxR - r0) / grow; // frames
  return {
    x: rand(0, w),
    y: rand(0, h),
    r0,
    grow,
    vx: rand(-0.18, 0.18) * RENDER_SCALE,
    vy: rand(-0.1, 0.1) * RENDER_SCALE,
    opacity: rand(BASE_OPACITY * 0.4, BASE_OPACITY),
    phase: rand(0, Math.PI * 2),
    age: scatterAge ? rand(0, life) : 0,
    life,
  };
}

export default function SmokeBackground({ style = {} }: { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];

    const resize = () => {
      W = Math.max(1, Math.round(canvas.offsetWidth * RENDER_SCALE));
      H = Math.max(1, Math.round(canvas.offsetHeight * RENDER_SCALE));
      canvas.width = W;
      canvas.height = H;
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(W, H, true));
    };
    resize();

    let resizeTimer: number;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });
    ro.observe(canvas);

    let rafId = 0;
    let running = false;
    let lastTime = 0;
    let tick = 0;

    const draw = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 16.667, 3) : 1; // in 60fps frames
      lastTime = time;
      tick += dt;

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const radius = p.r0 + p.age * p.grow;

        // Fade in and out over the particle's life instead of popping in/out
        // at full strength (that pop was a visible flicker).
        const lifeFade = Math.sin(Math.PI * Math.min(1, p.age / p.life));
        const pulse = Math.sin(tick * 0.008 + p.phase) * 0.012;
        const a = Math.max(0, (p.opacity + pulse) * lifeFade);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(240,240,245,${(a * 0.55).toFixed(3)})`);
        grad.addColorStop(1, "rgba(220,220,230,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.age += dt;

        const margin = radius + 60 * RENDER_SCALE;
        if (p.age >= p.life || p.x < -margin || p.x > W + margin || p.y < -margin || p.y > H + margin) {
          particles[i] = createParticle(W, H);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    if (reduceMotion) {
      draw(0);
      cancelAnimationFrame(rafId); // single static frame
    } else {
      start();
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
        ...style,
      }}
    />
  );
}
