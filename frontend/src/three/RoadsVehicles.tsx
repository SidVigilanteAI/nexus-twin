import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TrafficSystem } from '../types';

interface RoadsVehiclesProps {
  traffic: TrafficSystem | null;
  onSelectRoad: () => void;
  isSelected: boolean;
  activeEvent: string;
}

export const RoadsVehicles: React.FC<RoadsVehiclesProps> = ({
  traffic,
  onSelectRoad,
  isSelected,
  activeEvent
}) => {
  const isCongested = activeEvent === 'traffic_congestion' || (traffic && traffic.congestion_level === 'Critical');

  return (
    <group>
      {/* Road 1: North-South Arterial */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectRoad();
        }}
        receiveShadow
      >
        <planeGeometry args={[2.5, 24]} />
        <meshStandardMaterial color={isCongested ? '#475569' : '#1e293b'} roughness={0.7} />
      </mesh>

      {/* Road 2: East-West Connector */}
      <mesh
        position={[0, 0.025, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectRoad();
        }}
        receiveShadow
      >
        <planeGeometry args={[2.5, 24]} />
        <meshStandardMaterial color={isCongested ? '#475569' : '#1e293b'} roughness={0.7} />
      </mesh>

      {/* Yellow Center Lines */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 24]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.1, 24]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Road Label */}
      <Html position={[0, 0.5, 0]} center distanceFactor={25}>
        <div
          onClick={onSelectRoad}
          className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold shadow-md transition-all ${
            isCongested
              ? 'bg-rose-600 text-white animate-bounce'
              : isSelected
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900/80 text-amber-400 border border-amber-500/40'
          }`}
        >
          {isCongested ? '🚨 Arterial Road R-01 (Congested)' : 'Road R-01 / R-02'}
        </div>
      </Html>

      {/* Moving 3D Simulated Vehicles */}
      <AnimatedVehicle speed={isCongested ? 0.3 : 1.2} route="NS" color="#ef4444" offset={0} label="Car" />
      <AnimatedVehicle speed={isCongested ? 0.25 : 1.0} route="NS" color="#3b82f6" offset={6} label="Bus" isBus />
      <AnimatedVehicle speed={isCongested ? 0.35 : 1.4} route="EW" color="#10b981" offset={2} label="EV" />
      <AnimatedVehicle speed={isCongested ? 0.2 : 0.9} route="EW" color="#f59e0b" offset={8} label="Two-Wheeler" isTwoWheeler />
    </group>
  );
};

interface AnimatedVehicleProps {
  speed: number;
  route: 'NS' | 'EW';
  color: string;
  offset: number;
  label: string;
  isBus?: boolean;
  isTwoWheeler?: boolean;
}

const AnimatedVehicle: React.FC<AnimatedVehicleProps> = ({
  speed,
  route,
  color,
  offset,
  isBus,
  isTwoWheeler
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    const pos = (t % 22) - 11;
    
    if (route === 'NS') {
      meshRef.current.position.set(0.6, isTwoWheeler ? 0.25 : 0.35, pos);
    } else {
      meshRef.current.position.set(pos, isTwoWheeler ? 0.25 : 0.35, -0.6);
      meshRef.current.rotation.y = Math.PI / 2;
    }
  });

  const width = isBus ? 0.8 : (isTwoWheeler ? 0.3 : 0.5);
  const height = isBus ? 0.8 : (isTwoWheeler ? 0.4 : 0.4);
  const depth = isBus ? 1.6 : (isTwoWheeler ? 0.6 : 0.9);

  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};
