"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[2, 0, 0]}>
          <MeshDistortMaterial
            color="#333"
            speed={3}
            distort={0.4}
            roughness={0.5}
          />
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
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Scene />
      </Canvas>
    </div>
  );
};
