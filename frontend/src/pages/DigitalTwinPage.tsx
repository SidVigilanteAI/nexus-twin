import React from 'react';
import { Cpu } from 'lucide-react';
import { CityCanvas } from '../three/CityCanvas';
import { Building, WaterSystem, WasteBin, EnergySystem, TrafficSystem } from '../types';

interface DigitalTwinPageProps {
  buildings: Building[];
  water: WaterSystem | null;
  wasteBins: WasteBin[];
  energy: EnergySystem | null;
  traffic: TrafficSystem | null;
  greenCoveragePct: number;
  rainfallMm: number;
  activeEvent: string;
  onTriggerEvent: (event: string) => void;
  onNavigate: (page: string) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  buildings,
  water,
  wasteBins,
  energy,
  traffic,
  greenCoveragePct,
  rainfallMm,
  activeEvent,
  onTriggerEvent,
  onNavigate: _onNavigate
}) => {
  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">3D DIGITAL TWIN ENVIRONMENT</h2>
          </div>
          <p className="text-xs text-slate-400">
            Interactive low-poly 3D spatial model. Click any building, water pipeline, tank, or solar array to inspect real-time metrics.
          </p>
        </div>

        {/* Subsystem event triggers */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Inject Scenario:</span>
          <button
            onClick={() => onTriggerEvent('normal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'normal' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Normal
          </button>
          <button
            onClick={() => onTriggerEvent('water_leak')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'water_leak' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-rose-300'}`}
          >
            Water Leak
          </button>
          <button
            onClick={() => onTriggerEvent('energy_spike')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'energy_spike' ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-amber-300'}`}
          >
            Energy Spike
          </button>
          <button
            onClick={() => onTriggerEvent('traffic_congestion')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'traffic_congestion' ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-amber-300'}`}
          >
            Traffic Jam
          </button>
          <button
            onClick={() => onTriggerEvent('waste_overflow')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'waste_overflow' ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-emerald-300'}`}
          >
            Waste Overflow
          </button>
          <button
            onClick={() => onTriggerEvent('heavy_rainfall')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activeEvent === 'heavy_rainfall' ? 'bg-sky-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-sky-300'}`}
          >
            Storm Rain
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Box */}
      <div className="h-[calc(100vh-250px)] min-h-[550px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <CityCanvas
          buildings={buildings}
          water={water}
          wasteBins={wasteBins}
          energy={energy}
          traffic={traffic}
          greenCoveragePct={greenCoveragePct}
          rainfallMm={rainfallMm}
          activeEvent={activeEvent}
        />
      </div>
    </div>
  );
};
