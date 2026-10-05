"use client";

import { useEffect, useRef } from "react";

interface Streak {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number; // px / second
  alpha: number;
  lineWidth: number;
  progress: number;
  totalDistance: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

export default function ShootingStreaks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: Star[] = [];
    let streaks: Streak[] = [];

    const buildStars = () => {
      const count = width < 768 ? 90 : 200;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.0 + 0.1,
        opacity: Math.random() * 0.15 + 0.05,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    };
    resize();

    const MAX_STREAKS = width < 768 ? 8 : 14;
    const SPAWN_INTERVAL = 350; // ms

    const createStreak = (): Streak => {
      const angle = (30 + Math.random() * 20) * (Math.PI / 180);
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        angle,
        length: 80 + Math.random() * 140,
        speed: 1800 + Math.random() * 2200,
        alpha: 0.55 + Math.random() * 0.3,
        lineWidth: 0.6 + Math.random() * 0.4,
        progress: 0,
        totalDistance: Math.sqrt(width * width + height * height) * 0.4,
      };
    };

    const drawStars = (time: number) => {
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.04;
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, star.opacity + twinkle)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let rafId = 0;
    let running = false;
    let lastTime = 0;
    let lastSpawn = 0;

    const frame = (time: number) => {
      // Real elapsed time, clamped so a background tab / long frame can't make
      // streaks teleport. (The old code assumed 16ms/frame, so everything ran
      // 2x too fast on 120Hz screens and skipped on slow frames.)
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      drawStars(time);

      if (streaks.length < MAX_STREAKS && time - lastSpawn > SPAWN_INTERVAL) {
        streaks.push(createStreak());
        lastSpawn = time;
      }

      streaks = streaks.filter((s) => {
        s.progress += (s.speed * dt) / s.totalDistance;
        if (s.progress >= 1) return false;

        let a = s.alpha;
        if (s.progress < 0.15) a *= s.progress / 0.15;
        else if (s.progress > 0.8) a *= (1 - s.progress) / 0.2;

        const headX = s.x + Math.cos(s.angle) * s.progress * s.totalDistance;
        const headY = s.y + Math.sin(s.angle) * s.progress * s.totalDistance;
        const tailX = headX - Math.cos(s.angle) * s.length;
        const tailY = headY - Math.sin(s.angle) * s.length;

        const g = ctx.createLinearGradient(tailX, tailY, headX, headY);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${a})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = g;
        ctx.lineWidth = s.lineWidth;
        ctx.stroke();
        return true;
      });

      // Always keep the *latest* id so cleanup cancels the loop that is really
      // running (the old code only cancelled the first frame -> leaked loops).
      rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    if (reduceMotion) {
      drawStars(0); // static starfield only
    } else {
      start();
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduceMotion) drawStars(0);
      }, 150);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
