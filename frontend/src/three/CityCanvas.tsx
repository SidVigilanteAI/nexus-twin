import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Grid } from '@react-three/drei';
import { Buildings } from './Buildings';
import { RoadsVehicles } from './RoadsVehicles';
import { Infrastructure } from './Infrastructure';
import { GreenArea } from './GreenArea';
import { FloodOverlay } from './FloodOverlay';
import { ObjectDetailsModal } from './ObjectDetailsModal';
import { Building, WaterSystem, WasteBin, EnergySystem, TrafficSystem } from '../types';

interface CityCanvasProps {
  buildings: Building[];
  water: WaterSystem | null;
  wasteBins: WasteBin[];
  energy: EnergySystem | null;
  traffic: TrafficSystem | null;
  greenCoveragePct: number;
  rainfallMm: number;
  activeEvent: string;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  buildings,
  water,
  wasteBins,
  energy,
  traffic,
  greenCoveragePct,
  rainfallMm,
  activeEvent
}) => {
  const [selectedDetails, setSelectedDetails] = useState<{
    type: 'building' | 'water_tank' | 'pipeline' | 'waste_bin' | 'solar' | 'green' | 'road';
    data: any;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectBuilding = (bldg: Building) => {
    setSelectedId(bldg.id);
    setSelectedDetails({ type: 'building', data: bldg });
  };

  const handleSelectWaterTank = () => {
    setSelectedId('water-tank');
    setSelectedDetails({ type: 'water_tank', data: water });
  };

  const handleSelectPipeline = () => {
    setSelectedId('pipeline-p04');
    setSelectedDetails({ type: 'pipeline', data: water });
  };

  const handleSelectWasteBin = (bin: WasteBin) => {
    setSelectedId(bin.bin_id);
    setSelectedDetails({ type: 'waste_bin', data: bin });
  };

  const handleSelectSolar = () => {
    setSelectedId('solar-park');
    setSelectedDetails({ type: 'solar', data: energy });
  };

  const handleSelectGreenArea = () => {
    setSelectedId('green-area');
    setSelectedDetails({ type: 'green', data: { greenCoveragePct } });
  };

  const handleSelectRoad = () => {
    setSelectedId('road-network');
    setSelectedDetails({ type: 'road', data: traffic });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [16, 16, 18], fov: 45 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[20, 30, 20]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight args={['#38bdf8', '#0f172a', 0.5]} />

        {/* Environment Sky */}
        <Sky sunPosition={[10, 20, 10]} turbidity={8} rayleigh={2} mieCoefficient={0.005} />

        {/* Terrain Grid Base */}
        <Grid
          position={[0, -0.01, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={1}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#334155"
          fadeDistance={35}
        />

        {/* 3D Subsystems */}
        <Buildings
          buildings={buildings}
          onSelectBuilding={handleSelectBuilding}
          selectedId={selectedId}
          activeEvent={activeEvent}
        />
        <RoadsVehicles
          traffic={traffic}
          onSelectRoad={handleSelectRoad}
          isSelected={selectedId === 'road-network'}
          activeEvent={activeEvent}
        />
        <Infrastructure
          water={water}
          wasteBins={wasteBins}
          energy={energy}
          onSelectWaterTank={handleSelectWaterTank}
          onSelectPipeline={handleSelectPipeline}
          onSelectWasteBin={handleSelectWasteBin}
          onSelectSolar={handleSelectSolar}
          selectedId={selectedId}
          activeEvent={activeEvent}
        />
        <GreenArea
          greenCoveragePct={greenCoveragePct}
          onSelectGreenArea={handleSelectGreenArea}
          isSelected={selectedId === 'green-area'}
        />
        <FloodOverlay
          rainfallMm={rainfallMm}
          activeEvent={activeEvent}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={35}
        />
      </Canvas>

      {/* Interactive Floating Details Panel */}
      <ObjectDetailsModal
        details={selectedDetails}
        onClose={() => {
          setSelectedDetails(null);
          setSelectedId(null);
        }}
      />

      {/* Control Overlay Hint */}
      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 flex items-center gap-3">
        <span>🖱️ Left-Click + Drag: Rotate</span>
        <span>Scroll: Zoom</span>
        <span>Right-Click: Pan</span>
        <span className="text-cyan-400 font-semibold">Click any building/object to inspect</span>
      </div>
    </div>
  );
};
