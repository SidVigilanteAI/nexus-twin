import React from 'react';
import { Cpu, Zap, Droplets, Car, ArrowUpRight, CloudRain } from 'lucide-react';
import { OverviewState, Building, WaterSystem, EnergySystem, TrafficSystem, WasteBin, Alert } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { AlertBanner } from '../components/AlertBanner';
import { CityCanvas } from '../three/CityCanvas';

interface OverviewProps {
  overviewState: OverviewState | null;
  buildings: Building[];
  water: WaterSystem | null;
  energy: EnergySystem | null;
  traffic: TrafficSystem | null;
  wasteBins: WasteBin[];
  alerts: Alert[];
  anomalies: any[];
  onNavigate: (page: string) => void;
  onTriggerEvent: (event: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  overviewState,
  buildings,
  water,
  energy,
  traffic,
  wasteBins,
  alerts,
  anomalies,
  onNavigate,
  onTriggerEvent
}) => {
  if (!overviewState) {
    return <div className="p-8 text-center text-slate-400">Loading Nexus Twin System State...</div>;
  }

  const activeEvent = overviewState.active_event;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Event Controller */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">VIRTUAL CITY DASHBOARD</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              Live Digital Twin Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated 5-building urban ecosystem monitoring energy, water, mobility, waste, and storm runoff.
          </p>
        </div>

        {/* Quick Event Trigger Controls */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Simulate Event:</span>
          <button
            onClick={() => onTriggerEvent('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'normal' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Normal Mode
          </button>
          <button
            onClick={() => onTriggerEvent('water_leak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'water_leak' ? 'bg-rose-500 text-white shadow-md animate-pulse' : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
            }`}
          >
            💧 Water Leak
          </button>
          <button
            onClick={() => onTriggerEvent('energy_spike')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'energy_spike' ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            ⚡ Energy Spike
          </button>
          <button
            onClick={() => onTriggerEvent('traffic_congestion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'traffic_congestion' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            🚗 Traffic Congestion
          </button>
          <button
            onClick={() => onTriggerEvent('waste_overflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'waste_overflow' ? 'bg-emerald-500 text-slate-950 shadow-md animate-pulse' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
            }`}
          >
            🗑️ Waste Overflow
          </button>
          <button
            onClick={() => onTriggerEvent('heavy_rainfall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeEvent === 'heavy_rainfall' ? 'bg-sky-500 text-slate-950 shadow-md animate-pulse' : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
            }`}
          >
            🌧️ Heavy Rainfall
          </button>
        </div>
      </div>

      {/* Active Alerts Banner if any */}
      <AlertBanner alerts={alerts} anomalies={anomalies} />

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Energy */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Energy Load</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">{energy?.total_consumption_kw || 145} kW</span>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
              <span>Solar Share: <strong className="text-emerald-400">{energy?.solar_contribution_pct || 12}%</strong></span>
              <span>Grid: <strong className="text-slate-200">{energy?.grid_demand_kw || 128} kW</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Water */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Water Consumption</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">{water?.outflow_lhr || 1130} L/hr</span>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
              <span>Tank Level: <strong className="text-sky-400">{(water?.tank_level_l || 10500).toLocaleString()} L</strong></span>
              <span>Status: <StatusBadge status={water?.anomaly_status || 'Normal'} size="sm" /></span>
            </div>
          </div>
        </div>

        {/* Card 3: Mobility */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Traffic Volume</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">{traffic?.total_vehicles || 45} vehicles</span>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
              <span>Avg Speed: <strong className="text-slate-200">{traffic?.avg_speed_kmh || 38} km/h</strong></span>
              <span>Congestion: <StatusBadge status={traffic?.congestion_level || 'Low'} size="sm" /></span>
            </div>
          </div>
        </div>

        {/* Card 4: Environmental CO2 & Weather */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Carbon Rate & Weather</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-100">{energy?.co2_emissions_kg_hr || 96} kg CO₂/h</span>
            <div className="flex items-center justify-between text-xs mt-2 text-slate-400">
              <span>Temp: <strong className="text-slate-200">{overviewState.weather.temperature_c}°C</strong></span>
              <span>Rainfall: <strong className="text-sky-400">{overviewState.weather.rainfall_mm} mm</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* City Resilience Score Banner */}
      {(() => {
        let score = 100;
        if (activeEvent === 'water_leak') score -= 35;
        else if (activeEvent === 'energy_spike') score -= 20;
        else if (activeEvent === 'traffic_congestion') score -= 15;
        else if (activeEvent === 'waste_overflow') score -= 10;
        else if (activeEvent === 'heavy_rainfall') score -= 20;
        score -= Math.min(anomalies.length, 3) * 10;
        if ((energy?.solar_contribution_pct || 0) > 20) score += 5;
        score = Math.max(0, Math.min(100, score));
        const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Stable' : score >= 40 ? 'Stressed' : 'Critical';
        const color = score >= 80 ? 'emerald' : score >= 60 ? 'cyan' : score >= 40 ? 'amber' : 'rose';
        const barColor = { emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', amber: 'bg-amber-500', rose: 'bg-rose-500' }[color];
        const textColor = { emerald: 'text-emerald-400', cyan: 'text-cyan-400', amber: 'text-amber-400', rose: 'text-rose-400' }[color];
        const borderColor = { emerald: 'border-emerald-500/30', cyan: 'border-cyan-500/30', amber: 'border-amber-500/30', rose: 'border-rose-500/30' }[color];
        return (
          <div className={`bg-slate-900/90 border ${borderColor} rounded-2xl px-6 py-4 flex items-center gap-6`}>
            <div className="shrink-0">
              <span className="text-xs font-semibold text-slate-400 block mb-1">CITY RESILIENCE SCORE</span>
              <span className={`text-4xl font-black ${textColor}`}>{score}<span className="text-lg text-slate-500">/100</span></span>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${textColor}`}>{label}</span>
                <span className="text-slate-400 text-[10px]">
                  {activeEvent !== 'normal' ? `Active event: ${activeEvent.replace('_', ' ')}` : 'No active incidents'}
                  {anomalies.length > 0 ? ` · ${anomalies.length} AI anomal${anomalies.length > 1 ? 'ies' : 'y'}` : ''}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-0.5">
                <span>0 — Critical</span>
                <span>40 — Stressed</span>
                <span>60 — Stable</span>
                <span>80+ — Excellent</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Digital Twin 3D Viewport Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">3D VIRTUAL CITY TWIN</h3>
          </div>
          <button
            onClick={() => onNavigate('digital-twin')}
            className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300"
          >
            Fullscreen View <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-[460px] w-full">
          <CityCanvas
            buildings={buildings}
            water={water}
            wasteBins={wasteBins}
            energy={energy}
            traffic={traffic}
            greenCoveragePct={overviewState.weather.green_coverage_pct}
            rainfallMm={overviewState.weather.rainfall_mm}
            activeEvent={activeEvent}
          />
        </div>
      </div>
    </div>
  );
};
