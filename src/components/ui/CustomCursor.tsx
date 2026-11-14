"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * A real-time 3D pointer: a bevelled pearl-white arrow whose tip is the exact click point. It leans and
 * turns in 3D with your motion, and sheds a little star dust when you move fast. (No environment map:
 * building one cost a ~0.7 s main-thread freeze and made no visible difference at cursor size.)
 *   - links / buttons: the arrow grows a touch and tips forward
 *   - videos ([data-cursor='video']): the arrow grows and a "Watch" tag rides next to it
 *   - click: the arrow presses in
 */
const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary, .cursor-pointer";
const VIDEO_ZONE = "[data-cursor='video']";

const SIZE = 120; // css px of the 3D viewport; the arrow tip sits at its centre (= the pointer position)

type Mode = "idle" | "hover" | "video";
const SCALE: Record<Mode, number> = { idle: 1, hover: 1.18, video: 1.32 };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Classic pointer silhouette, tip at (0,0), pointing up-left, in world units (~1.75 tall). */
function arrowShape() {
  const s = 0.0875;
  const pts: [number, number][] = [
    [0, 0],
    [0, -17.5],
    [4.4, -13.4],
    [7.4, -20.2],
    [10.2, -19],
    [7.3, -12.4],
    [13, -12.4],
  ];
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? shape.lineTo(x * s, y * s) : shape.moveTo(x * s, y * s)));
  shape.closePath();
  return shape;
}

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false); // real mouse/trackpad only
  const wrapRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current!;
    const glCanvas = glCanvasRef.current!;
    const dust = dustRef.current!;
    const tag = tagRef.current!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- three.js scene ----------
    const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.debug.checkShaderErrors = false; // a sync shader-log check stalls the page for no benefit in production

    const scene = new THREE.Scene();

    // perspective so the 3D turns read; the tip (world origin) is the screen centre
    // fov 24 at z=20 → ~14 css px per world unit, so the arrow is ~24 px tall at rest
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 60);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3d45, 1.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 4, 6);
    scene.add(key);
    const glint = new THREE.PointLight(0xffffff, 40, 0, 2); // close light → a moving hotspot across the face
    glint.position.set(-1.2, 1.6, 2.6);
    scene.add(glint);
    const rim = new THREE.DirectionalLight(0xc8d8ff, 1.2);
    rim.position.set(4, -2, -3);
    scene.add(rim);

    const pivot = new THREE.Group(); // rotates and scales around the tip
    scene.add(pivot);

    const depth = 0.5;
    const geo = new THREE.ExtrudeGeometry(arrowShape(), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.07,
      bevelSegments: 5,
      curveSegments: 1,
    });
    geo.translate(0, 0, -depth / 2);
    // glossy pearl-white body with a chrome clearcoat: bright on the dark site, stars glint in the bevels
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.35,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.2,
      iridescence: 0.55, // faint holographic sheen as it turns, like light off a nebula
      iridescenceIOR: 1.35,
    });
    const arrow = new THREE.Mesh(geo, mat);
    pivot.add(arrow);

    // ---------- star dust (2D, full screen) ----------
    const dctx = dust.getContext("2d")!;
    type Speck = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
    let specks: Speck[] = [];
    let dustDirty = false;
    const sizeDust = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      dust.width = window.innerWidth * dpr;
      dust.height = window.innerHeight * dpr;
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeDust();

    // ---------- state ----------
    let mode: Mode = "idle";
    let visible = false;
    let first = true;
    const target = { x: -200, y: -200 };
    const pos = { x: -200, y: -200 };
    const vel = { x: 0, y: 0 };
    let scale = SCALE.idle;
    let press = 0; // 0..1, decays after a click
    let rx = 0;
    let ry = 0;
    let rz = 0;
    let shown = 0;
    let t = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (first) {
        first = false;
        pos.x = target.x;
        pos.y = target.y;
      }
      visible = true;
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const overVideo = !!el?.closest?.(VIDEO_ZONE) && !el?.closest?.("button, input");
      mode = overVideo ? "video" : el?.closest?.(INTERACTIVE) ? "hover" : "idle";
      tag.style.opacity = mode === "video" ? "1" : "0";
      tag.style.transform = mode === "video" ? "translate(0,0)" : "translate(-6px,0)";
    };
    const onDown = () => (press = 1);
    const hide = () => (visible = false);
    const show = () => !first && (visible = true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("resize", sizeDust);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // the tip must stay glued to the real pointer: follow almost instantly, measure velocity for the lean
      const k = 1 - Math.pow(0.00002, dt);
      const nx = pos.x + (target.x - pos.x) * k;
      const ny = pos.y + (target.y - pos.y) * k;
      vel.x += ((nx - pos.x) / Math.max(dt, 1e-3) - vel.x) * 0.25;
      vel.y += ((ny - pos.y) / Math.max(dt, 1e-3) - vel.y) * 0.25;
      pos.x = nx;
      pos.y = ny;
      const speed = Math.hypot(vel.x, vel.y);

      shown += ((visible ? 1 : 0) - shown) * Math.min(1, dt * 12);
      wrap.style.opacity = shown.toFixed(3);
      wrap.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      press = Math.max(0, press - dt * 5);
      scale += (SCALE[mode] - scale) * Math.min(1, dt * 12);
      pivot.scale.setScalar(scale * (1 - 0.18 * Math.sin(press * Math.PI)));

      // 3D lean into the motion + a slow idle sway so it always feels alive
      const sway = reduceMotion ? 0 : 1;
      // capped so the arrow never turns edge-on and disappears
      const wantY = THREE.MathUtils.clamp(vel.x / 2200, -0.55, 0.55) + sway * 0.2 * Math.sin(t * 1.3);
      const wantX = THREE.MathUtils.clamp(-vel.y / 2200, -0.5, 0.5) + sway * 0.12 * Math.sin(t * 0.9 + 1) + (mode === "hover" ? 0.3 : 0);
      const wantZ = THREE.MathUtils.clamp(-vel.x / 4000, -0.25, 0.25) + (mode === "video" ? 0.12 : 0);
      const f = Math.min(1, dt * 8);
      rx += (wantX - rx) * f;
      ry += (wantY - ry) * f;
      rz += (wantZ - rz) * f;
      // resting pose is turned a little in 3D so the thickness and bevels always show
      pivot.rotation.set(0.34 + rx + press * 0.5, -0.4 + ry, rz);

      renderer.render(scene, camera);

      // star dust: shed specks when moving quickly
      if (!reduceMotion && visible && speed > 380 && specks.length < 90) {
        const n = Math.min(3, Math.floor(speed / 650) + 1);
        for (let i = 0; i < n; i++) {
          specks.push({
            x: pos.x + rand(2, 12),
            y: pos.y + rand(4, 18),
            vx: -vel.x * 0.04 + rand(-12, 12),
            vy: -vel.y * 0.04 + rand(-12, 12),
            life: 0,
            max: rand(0.4, 0.85),
            r: rand(0.5, 1.3),
          });
        }
      }
      // full-screen clear only while there is dust on it (an idle cursor costs nothing here)
      if (specks.length || dustDirty) dctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      dustDirty = specks.length > 0;
      specks = specks.filter((s) => (s.life += dt) < s.max);
      for (const s of specks) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        dctx.fillStyle = `rgba(255,255,255,${((1 - s.life / s.max) * 0.8).toFixed(3)})`;
        dctx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);
      }

      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    // compile the arrow's shaders in parallel (off the main thread) before the first frame
    let disposed = false;
    renderer
      .compileAsync(scene, camera)
      .catch(() => {})
      .finally(() => {
        if (disposed) return;
        // only now hide the system cursor (globals.css), so there is never a moment with no cursor
        document.documentElement.classList.add("has-custom-cursor");
        if (document.hidden) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      });

    return () => {
      disposed = true;
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", sizeDust);
      document.removeEventListener("visibilitychange", onVisibility);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={dustRef} className="fixed inset-0 w-screen h-screen pointer-events-none z-[9997]" aria-hidden="true" />
      <div
        ref={wrapRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ opacity: 0, willChange: "transform" }}
        aria-hidden="true"
      >
        <canvas
          ref={glCanvasRef}
          className="absolute"
          style={{
            width: SIZE,
            height: SIZE,
            left: -SIZE / 2,
            top: -SIZE / 2,
            // crisp dark edge so the silver arrow still reads on white buttons and bright video frames
            filter: "drop-shadow(0 0 0.6px rgba(0,0,0,0.95)) drop-shadow(0 3px 5px rgba(0,0,0,0.45))",
          }}
        />
        {/* tag that rides beside the arrow on videos */}
        <div
          ref={tagRef}
          className="absolute left-[30px] top-[30px] flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/25 bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-[opacity,transform] duration-300"
          style={{ opacity: 0, transform: "translate(-6px,0)" }}
        >
          <svg width="7" height="8" viewBox="0 0 7 8" aria-hidden="true">
            <path d="M0 0 L7 4 L0 8 Z" fill="currentColor" />
          </svg>
          Watch
        </div>
      </div>
    </>
  );
};
