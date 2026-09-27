import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Building } from '../types';

interface BuildingsProps {
  buildings: Building[];
  onSelectBuilding: (building: Building) => void;
  selectedId: string | null;
  activeEvent: string;
}

export const Buildings: React.FC<BuildingsProps> = ({
  buildings,
  onSelectBuilding,
  selectedId,
  activeEvent
}) => {
  const getBldg = (id: string) => buildings.find(b => b.id === id);

  const bldgA = getBldg('bldg-a');
  const bldgB = getBldg('bldg-b');
  const bldgC = getBldg('bldg-c');
  const bldgD = getBldg('bldg-d');
  const bldgE = getBldg('bldg-e');

  return (
    <group>
      {/* Building A: Academic */}
      {bldgA && (
        <BuildingMesh
          position={[-6, 3, -4]}
          args={[3.5, 6, 4]}
          color="#1e293b"
          roofColor="#0284c7"
          label="Bldg A (Academic)"
          buildingData={bldgA}
          isSelected={selectedId === 'bldg-a'}
          onClick={() => onSelectBuilding(bldgA)}
          hasSolar
          isWarning={activeEvent === 'energy_spike'}
        />
      )}

      {/* Building B: Hostel (High Water Consumption) */}
      {bldgB && (
        <BuildingMesh
          position={[6, 2.5, -4]}
          args={[4.5, 5, 3.5]}
          color="#334155"
          roofColor="#38bdf8"
          label="Bldg B (Hostel)"
          buildingData={bldgB}
          isSelected={selectedId === 'bldg-b'}
          onClick={() => onSelectBuilding(bldgB)}
          isCritical={activeEvent === 'water_leak'}
        />
      )}

      {/* Building C: Commercial */}
      {bldgC && (
        <BuildingMesh
          position={[-6, 2, 5]}
          args={[4, 4, 4]}
          color="#0f172a"
          roofColor="#10b981"
          label="Bldg C (Commercial)"
          buildingData={bldgC}
          isSelected={selectedId === 'bldg-c'}
          onClick={() => onSelectBuilding(bldgC)}
        />
      )}

      {/* Building D: Community */}
      {bldgD && (
        <BuildingMesh
          position={[6, 1.75, 5]}
          args={[4.2, 3.5, 4.2]}
          color="#1e293b"
          roofColor="#f59e0b"
          label="Bldg D (Community)"
          buildingData={bldgD}
          isSelected={selectedId === 'bldg-d'}
          onClick={() => onSelectBuilding(bldgD)}
        />
      )}

      {/* Building E: Industrial / Service */}
      {bldgE && (
        <BuildingMesh
          position={[0, 2.25, -8]}
          args={[5, 4.5, 3]}
          color="#334155"
          roofColor="#64748b"
          label="Bldg E (Innovation Lab)"
          buildingData={bldgE}
          isSelected={selectedId === 'bldg-e'}
          onClick={() => onSelectBuilding(bldgE)}
          isWarning={activeEvent === 'energy_spike'}
        />
      )}
    </group>
  );
};

interface BuildingMeshProps {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  roofColor: string;
  label: string;
  buildingData: Building;
  isSelected: boolean;
  onClick: () => void;
  hasSolar?: boolean;
  isWarning?: boolean;
  isCritical?: boolean;
}

const BuildingMesh: React.FC<BuildingMeshProps> = ({
  position,
  args,
  color,
  roofColor,
  label,
  buildingData,
  isSelected,
  onClick,
  hasSolar,
  isWarning,
  isCritical
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current && (isCritical || isWarning)) {
      const t = clock.getElapsedTime();
      const s = 1 + 0.03 * Math.sin(t * 8);
      meshRef.current.scale.set(s, s, s);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const displayColor = isCritical ? '#f43f5e' : (isWarning ? '#f59e0b' : (isSelected ? '#06b6d4' : color));

  return (
    <group position={position}>
      {/* Main Building Structure */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={displayColor}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Roof cap */}
      <mesh position={[0, args[1] / 2 + 0.1, 0]}>
        <boxGeometry args={[args[0] - 0.2, 0.2, args[2] - 0.2]} />
        <meshStandardMaterial color={roofColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Solar Panel Array on Roof if applicable */}
      {hasSolar && (
        <group position={[0, args[1] / 2 + 0.25, 0]} rotation={[-0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[args[0] - 0.8, 0.05, args[2] - 1.2]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Selection Halo / Marker */}
      {isSelected && (
        <mesh position={[0, args[1] / 2 + 1.2, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
        </mesh>
      )}

      {/* HTML Label */}
      <Html position={[0, args[1] / 2 + 0.8, 0]} center distanceFactor={25}>
        <div
          onClick={onClick}
          className={`cursor-pointer px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg transition-all ${
            isCritical
              ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
              : isWarning
              ? 'bg-amber-600 text-white animate-bounce'
              : isSelected
              ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
              : 'bg-slate-900/90 text-slate-200 border border-slate-700 hover:border-cyan-400'
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
};
