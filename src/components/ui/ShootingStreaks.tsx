"use client";

import { useEffect, useRef } from "react";

interface Streak {
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;
  alpha: number;
  lineWidth: number;
  progress: number;
  totalDistance: number;
}

export default function ShootingStreaks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
    }

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.0 + 0.1,
      opacity: Math.random() * 0.15 + 0.05,
      twinkleSpeed: Math.random() * 0.03 + 0.005,
    }));

    let streaks: Streak[] = [];
    const MAX_STREAKS = 25;

    const createStreak = (): Streak => {
      const angle = (30 + Math.random() * 20) * (Math.PI / 180);
      const totalDistance = Math.sqrt(width * width + height * height) * 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        angle,
        length: 80 + Math.random() * 140,
        speed: 1800 + Math.random() * 2200,
        alpha: 0.55 + Math.random() * 0.3,
        lineWidth: 0.6 + Math.random() * 0.4,
        progress: 0,
        totalDistance,
      };
    };

    let lastSpawn = 0;
    const spawnInterval = 50 + Math.random() * 250;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint glowing stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.opacity + twinkle)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn logic
      if (streaks.length < MAX_STREAKS && time - lastSpawn > spawnInterval) {
        streaks.push(createStreak());
        lastSpawn = time;
      }

      streaks = streaks.filter((s) => {
        const delta = 16 / 1000; // rough 60fps delta
        s.progress += (s.speed * delta) / s.totalDistance;

        if (s.progress >= 1) return false;

        let currentAlpha = s.alpha;
        if (s.progress < 0.15) {
          currentAlpha *= s.progress / 0.15;
        } else if (s.progress > 0.8) {
          currentAlpha *= (1 - s.progress) / 0.2;
        }

        const headX = s.x + Math.cos(s.angle) * s.progress * s.totalDistance;
        const headY = s.y + Math.sin(s.angle) * s.progress * s.totalDistance;
        const tailX = headX - Math.cos(s.angle) * s.length;
        const tailY = headY - Math.sin(s.angle) * s.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${currentAlpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.lineWidth;
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
