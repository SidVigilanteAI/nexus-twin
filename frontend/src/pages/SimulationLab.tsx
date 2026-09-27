import React, { useState, useEffect } from 'react';
import { Sliders, Zap, Droplets, Car, CloudRain, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { SimulationResponse, SimulationParams } from '../types';

interface SimulationLabProps {
  externalParams?: SimulationParams;
}

export const SimulationLab: React.FC<SimulationLabProps> = ({ externalParams }) => {
  const [params, setParams] = useState<SimulationParams>({
    solar_capacity: 50,
    public_transport_share: 35,
    green_cover: 30,
    water_reduction: 15,
    rainfall: 10,
    drainage_capacity: 100
  });

  const [simResult, setSimResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (externalParams) {
      setParams(externalParams);
    }
  }, [externalParams]);

  const runSimulation = async (updatedParams: SimulationParams) => {
    setLoading(true);
    try {
      const res = await api.runSimulation(updatedParams);
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(params);
  }, [params]);

  const handleReset = async () => {
    const defaultParams: SimulationParams = {
      solar_capacity: 20,
      public_transport_share: 18,
      green_cover: 15,
      water_reduction: 0,
      rainfall: 10,
      drainage_capacity: 100
    };
    setParams(defaultParams);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">SIMULATION LAB</h2>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                "Test environmental decisions in a virtual city before implementing them in the real world."
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Baseline
        </button>
      </div>

      {/* Main Grid: Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Slider Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Intervention Parameters</span>
            <span className="text-[10px] text-slate-400 font-normal">Real-Time Recalculation</span>
          </h3>

          {/* Slider 1: Solar Capacity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Solar PV Installation
              </span>
              <span className="font-mono font-bold text-amber-400">{params.solar_capacity} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={params.solar_capacity}
              onChange={(e) => setParams({ ...params, solar_capacity: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 kW</span>
              <span>Baseline: 20 kW</span>
              <span>200 kW</span>
            </div>
          </div>

          {/* Slider 2: Public Transport Share */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-cyan-400" /> Public Transit Adoption
              </span>
              <span className="font-mono font-bold text-cyan-400">{params.public_transport_share}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={params.public_transport_share}
              onChange={(e) => setParams({ ...params, public_transport_share: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10%</span>
              <span>Baseline: 18%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Slider 3: Green Canopy Cover */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Urban Green Cover
              </span>
              <span className="font-mono font-bold text-emerald-400">{params.green_cover}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={params.green_cover}
              onChange={(e) => setParams({ ...params, green_cover: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5%</span>
              <span>Baseline: 15%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Slider 4: Water Reduction Target */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Water Efficiency Target
              </span>
              <span className="font-mono font-bold text-sky-400">-{params.water_reduction}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={params.water_reduction}
              onChange={(e) => setParams({ ...params, water_reduction: parseFloat(e.target.value) })}
              className="w-full accent-sky-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Standard)</span>
              <span>50% (Max Saving)</span>
            </div>
          </div>

          {/* Slider 5: Rainfall Shock */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-400" /> Storm Rainfall Shock
              </span>
              <span className="font-mono font-bold text-sky-400">{params.rainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="5"
              value={params.rainfall}
              onChange={(e) => setParams({ ...params, rainfall: parseFloat(e.target.value) })}
              className="w-full accent-sky-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 mm (Normal)</span>
              <span>80 mm (Heavy Storm)</span>
              <span>150 mm (Extreme)</span>
            </div>
          </div>

          {/* Slider 6: Drainage Capacity Rating */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Storm Drainage Capacity
              </span>
              <span className="font-mono font-bold text-cyan-400">{params.drainage_capacity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="10"
              value={params.drainage_capacity}
              onChange={(e) => setParams({ ...params, drainage_capacity: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50% (Clogged)</span>
              <span>100% (Baseline)</span>
              <span>250% (Upgraded)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Baseline vs Simulated Comparison */}
        <div className="lg:col-span-7 space-y-6">
          {simResult && (
            <>
              {/* Top Impact Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-medium">CO₂ Reduction</span>
                  <span className="text-2xl font-black text-emerald-400 block mt-1">-{simResult.impact.co2_reduction_percent}%</span>
                  <span className="text-[10px] text-slate-400">{simResult.impact.co2_avoided_kg_day} kg/day</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Water Saved</span>
                  <span className="text-2xl font-black text-sky-400 block mt-1">-{simResult.impact.water_saved_percent}%</span>
                  <span className="text-[10px] text-slate-400">{simResult.impact.water_saved_l_day.toLocaleString()} L/day</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Grid Energy Saved</span>
                  <span className="text-2xl font-black text-cyan-400 block mt-1">-{simResult.impact.energy_saved_percent}%</span>
                  <span className="text-[10px] text-slate-400">{simResult.impact.energy_saved_kwh_day} kWh/day</span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Flood Risk Delta</span>
                  <span className={`text-2xl font-black block mt-1 ${simResult.impact.flood_risk_change_percent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {simResult.impact.flood_risk_change_percent > 0 ? `-${simResult.impact.flood_risk_change_percent} pts` : `+${Math.abs(simResult.impact.flood_risk_change_percent)} pts`}
                  </span>
                  <span className="text-[10px] text-slate-400">{simResult.scenario.flood_risk_category}</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Table Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center justify-between">
                  <span>BASELINE vs SIMULATED SCENARIO</span>
                  <span className="text-xs font-normal text-cyan-400">Formula-Calculated Output</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Baseline Column */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase block tracking-wider">BASELINE STATE</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">CO₂ Emissions:</span>
                        <span className="font-bold text-slate-200">{simResult.baseline.co2_kg_day} kg/day</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Water Consumption:</span>
                        <span className="font-bold text-slate-200">{simResult.baseline.water_l_day.toLocaleString()} L/day</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Grid Dependency:</span>
                        <span className="font-bold text-slate-200">{simResult.baseline.grid_dependency_pct}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Traffic Vehicles:</span>
                        <span className="font-bold text-slate-200">{simResult.baseline.traffic_vehicles_cnt} /min</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Flood Risk Score:</span>
                        <span className="font-bold text-slate-200">{simResult.baseline.flood_risk_score} ({simResult.baseline.flood_risk_category})</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Column */}
                  <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/40 space-y-3 glow-cyan">
                    <span className="text-xs font-bold text-cyan-400 uppercase block tracking-wider">SIMULATED INTERVENTION</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-cyan-900/40">
                        <span className="text-slate-400">CO₂ Emissions:</span>
                        <span className="font-bold text-emerald-400">{simResult.scenario.co2_kg_day} kg/day</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-cyan-900/40">
                        <span className="text-slate-400">Water Consumption:</span>
                        <span className="font-bold text-sky-400">{simResult.scenario.water_l_day.toLocaleString()} L/day</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-cyan-900/40">
                        <span className="text-slate-400">Grid Dependency:</span>
                        <span className="font-bold text-cyan-400">{simResult.scenario.grid_dependency_pct}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-cyan-900/40">
                        <span className="text-slate-400">Traffic Vehicles:</span>
                        <span className="font-bold text-amber-400">{simResult.scenario.traffic_vehicles_cnt} /min</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Flood Risk Score:</span>
                        <span className="font-bold text-emerald-400">{simResult.scenario.flood_risk_score} ({simResult.scenario.flood_risk_category})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documented Assumptions Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" /> Documented Model Formulas & Assumptions
                </h4>
                <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside pl-1">
                  {simResult.assumptions.map((asm, i) => (
                    <li key={i}>{asm}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
