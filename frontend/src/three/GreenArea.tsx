import React from 'react';
import { Html } from '@react-three/drei';

interface GreenAreaProps {
  greenCoveragePct: number;
  onSelectGreenArea: () => void;
  isSelected: boolean;
}

export const GreenArea: React.FC<GreenAreaProps> = ({
  greenCoveragePct,
  onSelectGreenArea,
  isSelected
}) => {
  return (
    <group position={[0, 0.01, 5]}>
      {/* Park Grass Terrain */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectGreenArea();
        }}
        receiveShadow
      >
        <planeGeometry args={[7, 6]} />
        <meshStandardMaterial
          color={isSelected ? '#059669' : '#10b981'}
          roughness={0.8}
        />
      </mesh>

      {/* 3D Stylized Trees */}
      <Tree position={[-2, 0.6, -1]} />
      <Tree position={[2, 0.6, -1.5]} />
      <Tree position={[-1.5, 0.6, 1.5]} />
      <Tree position={[1.8, 0.6, 1.8]} />

      <Html position={[0, 1.2, 0]} center distanceFactor={25}>
        <div
          onClick={onSelectGreenArea}
          className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold shadow-md transition-all ${
            isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/90 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          🌳 Eco-Park ({greenCoveragePct}% Canopy)
        </div>
      </Html>
    </group>
  );
};

const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.8, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.7, 1.2, 8]} />
        <meshStandardMaterial color="#047857" />
      </mesh>
    </group>
  );
};
