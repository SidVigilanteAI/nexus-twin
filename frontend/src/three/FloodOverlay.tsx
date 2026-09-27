import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface FloodOverlayProps {
  rainfallMm: number;
  activeEvent: string;
}

export const FloodOverlay: React.FC<FloodOverlayProps> = ({
  rainfallMm,
  activeEvent
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHeavyRain = activeEvent === 'heavy_rainfall' || rainfallMm > 40;

  useFrame(({ clock }) => {
    if (meshRef.current && isHeavyRain) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = 0.15 + 0.05 * Math.sin(t * 2);
    }
  });

  if (!isHeavyRain) return null;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, 0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.5}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      <Html position={[0, 1.8, -2]} center distanceFactor={25}>
        <div className="bg-rose-600/90 text-white font-bold px-3 py-1 rounded shadow-xl border border-rose-300 animate-pulse text-xs">
          ⚠️ FLOOD RISK ZONE ACTIVE ({rainfallMm.toFixed(0)} mm Heavy Storm Runoff)
        </div>
      </Html>
    </group>
  );
};
