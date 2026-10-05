"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
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

export const FloatingShapes = () => {
  // Only run the WebGL render loop while the hero is actually on screen.
  // Otherwise it keeps burning GPU behind every other section, which is a
  // major source of scroll jank on the video-heavy sections below.
  const { ref, inView } = useInView({ rootMargin: "100px" });

  return (
    <div ref={ref} className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
