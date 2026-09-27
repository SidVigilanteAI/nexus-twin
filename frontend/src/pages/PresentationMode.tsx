import React from 'react';
import { Cpu, AlertTriangle, Play } from 'lucide-react';
import { CityCanvas } from '../three/CityCanvas';
import { Building, WaterSystem, WasteBin, EnergySystem, TrafficSystem, Alert } from '../types';

interface PresentationModeProps {
  buildings: Building[];
  water: WaterSystem | null;
  wasteBins: WasteBin[];
  energy: EnergySystem | null;
  traffic: TrafficSystem | null;
  greenCoveragePct: number;
  rainfallMm: number;
  activeEvent: string;
  alerts: Alert[];
  anomalies: any[];
  onStartDemo: () => void;
  onTriggerEvent: (evt: string) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  buildings,
  water,
  wasteBins,
  energy,
  traffic,
  greenCoveragePct,
  rainfallMm,
  activeEvent,
  alerts: _alerts,
  anomalies,
  onStartDemo,
  onTriggerEvent
}) => {
  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-12 gap-4 p-2 overflow-hidden">
      {/* Central Dominant 3D Digital Twin Viewport */}
      <div className="lg:col-span-8 h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
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

        {/* Presenter Quick Event Overlay Bar */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-2 flex items-center gap-2 z-10">
          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black px-3 py-1 rounded-lg text-xs animate-pulse shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            2-MIN GUIDED DEMO
          </button>
          <span className="h-4 w-px bg-slate-800"></span>
          <button
            onClick={() => onTriggerEvent('normal')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${activeEvent === 'normal' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            Normal
          </button>
          <button
            onClick={() => onTriggerEvent('water_leak')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${activeEvent === 'water_leak' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-rose-300'}`}
          >
            Leak
          </button>
          <button
            onClick={() => onTriggerEvent('energy_spike')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${activeEvent === 'energy_spike' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-300'}`}
          >
            Spike
          </button>
          <button
            onClick={() => onTriggerEvent('traffic_congestion')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${activeEvent === 'traffic_congestion' ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-orange-300'}`}
          >
            Traffic
          </button>
          <button
            onClick={() => onTriggerEvent('heavy_rainfall')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${activeEvent === 'heavy_rainfall' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-300'}`}
          >
            Storm
          </button>
        </div>
      </div>

      {/* Right Status & Insights Sidebar */}
      <div className="lg:col-span-4 h-full flex flex-col gap-4 overflow-y-auto pr-1">
        {/* Live System Status Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
          <h3 className="font-extrabold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" /> LIVE METRICS MONITOR
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Energy Load</span>
              <span className="font-bold text-cyan-400">{energy?.total_consumption_kw || 145} kW</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Water Outflow</span>
              <span className="font-bold text-sky-400">{water?.outflow_lhr || 1130} L/h</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Traffic Flow</span>
              <span className="font-bold text-amber-400">{traffic?.total_vehicles || 45} veh/m</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Carbon Rate</span>
              <span className="font-bold text-slate-200">{energy?.co2_emissions_kg_hr || 96} kg/h</span>
            </div>
          </div>
        </div>

        {/* AI Anomaly Insights Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 flex-1 overflow-y-auto">
          <h3 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> AI DETECTED ANOMALIES
          </h3>
          {anomalies.length === 0 ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-emerald-400 font-semibold">
              ✓ All environmental systems normal.
            </div>
          ) : (
            anomalies.map((anom, i) => (
              <div key={i} className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl text-xs space-y-1 glow-rose">
                <div className="flex items-center justify-between font-bold text-rose-300">
                  <span>{anom.type}</span>
                  <span>{anom.confidence_pct}% Conf</span>
                </div>
                <p className="text-slate-300 text-[11px]">{anom.observed} vs expected {anom.expected}</p>
                <p className="text-[10px] text-rose-400 font-medium">Zone: {anom.affected_zone}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
