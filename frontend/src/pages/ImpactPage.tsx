import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldCheck, Zap, Droplets, Car, CloudRain, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { SimulationResponse } from '../types';

interface ImpactPageProps {
  onNavigate: (page: string) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ onNavigate }) => {
  const [impactData, setImpactData] = useState<SimulationResponse | null>(null);

  useEffect(() => {
    api.getImpact().then(setImpactData).catch(console.error);
  }, []);

  if (!impactData) return <div className="p-8 text-center text-slate-400">Loading Environmental Impact Calculator...</div>;

  const { baseline, scenario, impact } = impactData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">SUSTAINABILITY IMPACT CALCULATOR</h2>
              <p className="text-xs text-slate-400">
                Quantified environmental savings: Baseline state vs Optimized Digital Twin interventions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('simulation-lab')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          Customize What-If Parameters <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Environmental Savings Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Metric 1: CO2 Avoided */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Avoided</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400">{impact.co2_avoided_kg_day} kg CO₂ / day</span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">-{impact.co2_reduction_percent}% Overall Emission Reduction</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Baseline: <strong>{baseline.co2_kg_day} kg/day</strong></span>
            <span>Optimized: <strong>{scenario.co2_kg_day} kg/day</strong></span>
          </div>
        </div>

        {/* Metric 2: Water Saved */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 glow-cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Water Conserved</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-sky-400">{impact.water_saved_l_day.toLocaleString()} L / day</span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">-{impact.water_saved_percent}% Total Water Demand Saved</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Baseline: <strong>{baseline.water_l_day.toLocaleString()} L/day</strong></span>
            <span>Optimized: <strong>{scenario.water_l_day.toLocaleString()} L/day</strong></span>
          </div>
        </div>

        {/* Metric 3: Clean Energy & Grid Savings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grid Energy Saved</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-cyan-400">{impact.energy_saved_kwh_day} kWh / day</span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Grid Dependency reduced from {baseline.grid_dependency_pct}% to {scenario.grid_dependency_pct}%</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Solar Cap: <strong>{scenario.solar_generation_kw} kW Peak</strong></span>
            <span>Grid Reduction: <strong>-{impact.energy_saved_percent}%</strong></span>
          </div>
        </div>

        {/* Metric 4: Traffic Emissions Reduction */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Traffic Reduction</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-400">-{impact.traffic_reduction_percent}%</span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">Private vehicles reduced via public transit shift</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Baseline: <strong>{baseline.traffic_vehicles_cnt} veh/min</strong></span>
            <span>Optimized: <strong>{scenario.traffic_vehicles_cnt} veh/min</strong></span>
          </div>
        </div>

        {/* Metric 5: Flood Risk Delta */}
        <div className={`bg-slate-900/90 border rounded-2xl p-6 space-y-3 ${impact.flood_risk_change_percent > 0 ? 'border-emerald-500/30 glow-emerald' : 'border-rose-500/30 glow-rose'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flood Risk Delta</span>
            <div className={`p-2 rounded-xl ${impact.flood_risk_change_percent > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className={`text-3xl font-black ${impact.flood_risk_change_percent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {impact.flood_risk_change_percent > 0 ? `-${impact.flood_risk_change_percent} pts` : `+${Math.abs(impact.flood_risk_change_percent)} pts`}
            </span>
            <p className="text-xs text-slate-300 mt-1 font-semibold">
              {scenario.flood_risk_category} vs Baseline {baseline.flood_risk_category}
            </p>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between">
            <span>Baseline Score: <strong>{baseline.flood_risk_score}</strong></span>
            <span>Scenario Score: <strong>{scenario.flood_risk_score}</strong></span>
          </div>
        </div>
      </div>

      {/* Environmental Disclaimer Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
        <p className="text-xs text-slate-400 font-mono">
          ⚠️ SIMULATION RESULTS — NOT REAL-WORLD MEASUREMENTS. Prototype estimates based on transparent mathematical baseline formulas.
        </p>
      </div>
    </div>
  );
};
