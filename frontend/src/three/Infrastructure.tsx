import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { WaterSystem, WasteBin, EnergySystem } from '../types';

interface InfrastructureProps {
  water: WaterSystem | null;
  wasteBins: WasteBin[];
  energy: EnergySystem | null;
  onSelectWaterTank: () => void;
  onSelectPipeline: () => void;
  onSelectWasteBin: (bin: WasteBin) => void;
  onSelectSolar: () => void;
  selectedId: string | null;
  activeEvent: string;
}

export const Infrastructure: React.FC<InfrastructureProps> = ({
  water,
  wasteBins,
  energy,
  onSelectWaterTank,
  onSelectPipeline,
  onSelectWasteBin,
  onSelectSolar,
  selectedId,
  activeEvent
}) => {
  const isLeak = activeEvent === 'water_leak' || (water && water.anomaly_status === 'Critical');
  const isWasteOverflow = activeEvent === 'waste_overflow';

  return (
    <group>
      {/* 1. WATER TANK */}
      <group position={[9, 2, 0]}>
        {/* Tank Frame */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectWaterTank();
          }}
          castShadow
        >
          <cylinderGeometry args={[1.5, 1.5, 3.5, 16]} />
          <meshStandardMaterial
            color={selectedId === 'water-tank' ? '#06b6d4' : '#0284c7'}
            transparent
            opacity={0.75}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
        
        {/* Water Liquid Level */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 2.2, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>

        <Html position={[0, 2.2, 0]} center distanceFactor={25}>
          <div
            onClick={onSelectWaterTank}
            className={`cursor-pointer px-2 py-1 rounded text-xs font-bold shadow-lg transition-all ${
              isLeak
                ? 'bg-rose-600 text-white animate-pulse'
                : selectedId === 'water-tank'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/40'
            }`}
          >
            💧 Water Tank ({(water?.tank_level_l || 10500).toLocaleString()} L)
          </div>
        </Html>
      </group>

      {/* 2. WATER PIPELINE (Connecting Tank to Hostel B) */}
      <group>
        <mesh
          position={[7.5, 0.4, -2]}
          rotation={[0, -Math.PI / 4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPipeline();
          }}
        >
          <cylinderGeometry args={[0.2, 0.2, 5, 8]} />
          <meshStandardMaterial
            color={isLeak ? '#f43f5e' : (selectedId === 'pipeline-p04' ? '#06b6d4' : '#0284c7')}
            emissive={isLeak ? '#f43f5e' : '#000000'}
            emissiveIntensity={isLeak ? 0.6 : 0}
          />
        </mesh>

        <Html position={[7.5, 1.2, -2]} center distanceFactor={25}>
          <div
            onClick={onSelectPipeline}
            className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold shadow-md transition-all ${
              isLeak
                ? 'bg-rose-600 text-white animate-bounce ring-2 ring-rose-400'
                : selectedId === 'pipeline-p04'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900/80 text-cyan-300 border border-cyan-600/40'
            }`}
          >
            {isLeak ? '🚨 Pipeline P-04 LEAK' : 'Pipeline P-04'}
          </div>
        </Html>
      </group>

      {/* 3. SOLAR PV PARK */}
      <group position={[-9, 0.5, -4]} rotation={[-0.3, 0.4, 0]}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectSolar();
          }}
          castShadow
        >
          <boxGeometry args={[4, 0.1, 3]} />
          <meshStandardMaterial
            color={selectedId === 'solar-park' ? '#06b6d4' : '#0284c7'}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <Html position={[0, 1.0, 0]} center distanceFactor={25}>
          <div
            onClick={onSelectSolar}
            className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold shadow-md transition-all ${
              selectedId === 'solar-park' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/40'
            }`}
          >
            ☀️ Solar Park ({energy?.solar_gen_kw || 17} kW)
          </div>
        </Html>
      </group>

      {/* 4. WASTE COLLECTION BINS (B-01 to B-05) */}
      {wasteBins.map((bin, i) => {
        const positions: [number, number, number][] = [
          [-4, 0.4, -2], // B-01
          [4.2, 0.4, -2.5], // B-02
          [-4.5, 0.4, 3], // B-03
          [4.5, 0.4, 3],  // B-04 (Community East)
          [0, 0.4, -6.5]  // B-05
        ];
        const pos = positions[i] || [0, 0.4, 0];
        const isBinOverflow = isWasteOverflow && bin.bin_id === 'B-04';

        return (
          <group key={bin.bin_id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectWasteBin(bin);
              }}
              castShadow
            >
              <boxGeometry args={[0.7, 0.8, 0.7]} />
              <meshStandardMaterial
                color={isBinOverflow ? '#f43f5e' : (bin.fill_pct > 75 ? '#f59e0b' : '#10b981')}
              />
            </mesh>
            <Html position={[0, 0.9, 0]} center distanceFactor={25}>
              <div
                onClick={() => onSelectWasteBin(bin)}
                className={`cursor-pointer px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap shadow ${
                  isBinOverflow
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-slate-900/80 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                🗑️ {bin.bin_id} ({bin.fill_pct}%)
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
