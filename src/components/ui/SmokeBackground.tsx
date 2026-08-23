"use client";

import { useEffect, useRef } from "react";

// ── Smoke particle config ──────────────────────────────────────────────────
const PARTICLE_COUNT = 18;
const BASE_OPACITY   = 0.05;   // keep it subtle so text stays readable

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

function createParticle(canvasW: number, canvasH: number) {
  return {
    x:        randomBetween(0, canvasW),
    y:        randomBetween(0, canvasH),
    radius:   randomBetween(120, 320),
    speedX:   randomBetween(-0.18, 0.18),
    speedY:   randomBetween(-0.10, 0.10),
    opacity:  randomBetween(BASE_OPACITY * 0.4, BASE_OPACITY),
    grow:     randomBetween(0.06, 0.18),   // radius growth per frame
    maxR:     randomBetween(340, 520),
    phase:    randomBetween(0, Math.PI * 2), // for pulsing
  };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function SmokeBackground({ style = {} }: { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{ particles: any[], raf: number | null }>({ particles: [], raf: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── resize handling ──
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── init particles ──
    stateRef.current.particles = Array.from(
      { length: PARTICLE_COUNT },
      () => createParticle(canvas.width, canvas.height)
    );

    // ── draw loop ──
    let tick = 0;
    const draw = () => {
      tick++;
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      stateRef.current.particles.forEach((p, i) => {
        // pulse opacity gently
        const pulse = Math.sin(tick * 0.008 + p.phase) * 0.012;

        // radial gradient → soft smoke puff
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0,   `rgba(255,255,255,${(p.opacity + pulse).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(240,240,245,${((p.opacity + pulse) * 0.55).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(220,220,230,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // drift & grow
        p.x      += p.speedX;
        p.y      += p.speedY;
        p.radius += p.grow;

        // wrap edges & reset when puff is too large / drifted off-screen
        const margin = p.radius + 60;
        if (
          p.radius > p.maxR ||
          p.x < -margin || p.x > W + margin ||
          p.y < -margin || p.y > H + margin
        ) {
          stateRef.current.particles[i] = createParticle(W, H);
        }
      });

      stateRef.current.raf = requestAnimationFrame(draw);
    };

    stateRef.current.raf = requestAnimationFrame(draw);

    return () => {
      if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
