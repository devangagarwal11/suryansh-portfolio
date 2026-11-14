"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[2, 0, 0]}>
          <MeshDistortMaterial color="#333" speed={3} distort={0.4} roughness={0.5} />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-3, 2, -2]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#222" wireframe />
        </mesh>
      </Float>
    </>
  );
};

/** Once the shapes are in the scene, compile their shaders in parallel (KHR_parallel_shader_compile)
 *  so the first frame doesn't freeze the page while the GPU driver compiles. */
const Warmup = ({ onReady }: { onReady: () => void }) => {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let alive = true;
    gl.compileAsync(scene, camera)
      .catch(() => {})
      .finally(() => alive && onReady());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export const FloatingShapes = () => {
  // Only run the WebGL render loop while the hero is actually on screen.
  // Otherwise it keeps burning GPU behind every other section, which is a
  // major source of scroll jank on the video-heavy sections below.
  const { ref, inView } = useInView({ rootMargin: "100px" });

  // Preparing these shaders blocks the page for ~0.5-1 s, so start the 3D only after the page has
  // loaded and the browser is idle, compile the shaders in parallel, then fade the shapes in.
  const [start, setStart] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const go = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (idle) idle(() => setStart(true), { timeout: 2000 });
      else setTimeout(() => setStart(true), 400);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
      {start && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: shown ? 1 : 0 }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            dpr={[1, 1.5]}
            frameloop={inView && shown ? "always" : "never"}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              // don't block the main thread waiting on shader error logs (dev-only diagnostics)
              gl.debug.checkShaderErrors = false;
            }}
          >
            <Scene />
            <Warmup onReady={() => setShown(true)} />
          </Canvas>
        </div>
      )}
    </div>
  );
};
