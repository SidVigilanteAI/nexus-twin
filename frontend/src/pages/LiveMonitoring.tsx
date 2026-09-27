import React, { useState, useEffect } from 'react';
import { Eye, Zap, Droplets, Car, Trash2, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, LineChart, Line, BarChart, Bar, Cell, Legend
} from 'recharts';
import { WaterSystem, EnergySystem, TrafficSystem, WasteBin, Prediction, Building } from '../types';
import { api } from '../services/api';

interface LiveMonitoringProps {
  water: WaterSystem | null;
  energy: EnergySystem | null;
  traffic: TrafficSystem | null;
  wasteBins: WasteBin[];
  predictions: Prediction[];
  simulatedTime: string;
  buildings: Building[];
}

const TOOLTIP_STYLE = { backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' };

function getBinColor(fillPct: number): string {
  if (fillPct >= 85) return '#f43f5e';
  if (fillPct >= 65) return '#f59e0b';
  return '#10b981';
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({
  water,
  energy,
  traffic,
  wasteBins,
  predictions,
  simulatedTime,
  buildings
}) => {
  const [history, setHistory] = useState<any[]>([]);

  // Fetch backend history every 3 seconds (same cadence as App.tsx polling)
  useEffect(() => {
    const fetch = () => api.getHistory().then(setHistory).catch(console.error);
    fetch();
    const id = setInterval(fetch, 3000);
    return () => clearInterval(id);
  }, []);

  // Building comparison data
  const buildingChartData = buildings.map(b => ({
    name: b.name.replace('Building ', 'Bldg ').split(' (')[0],
    electricity: b.electricity_kw,
    water: b.water_lhr,
    co2: b.co2_kg,
    status: b.anomaly_status,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">REAL-TIME SENSOR DATA STREAMS</h2>
          </div>
          <p className="text-xs text-slate-400">
            Live telemetry stream synthesized via Python simulation engine · {history.length} historical snapshots loaded
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-cyan-400 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Sim Time: {simulatedTime}</span>
        </div>
      </div>

      {/* Grid of Time-Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Energy vs Solar Generation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Electricity Demand & Solar Generation (kW)
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">{energy?.total_consumption_kw ?? 145} kW Load</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval="preserveStartEnd" />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="energy_kw" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEnergy)" name="Demand (kW)" />
                <Area type="monotone" dataKey="solar_kw" stroke="#10b981" fillOpacity={1} fill="url(#colorSolar)" name="Solar (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Water Outflow & Pressure */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              Water Flow Rate (L/hr) & Line Pressure (PSI)
            </h3>
            <span className="text-xs font-mono text-sky-400 font-bold">{water?.outflow_lhr ?? 1130} L/hr</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval="preserveStartEnd" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="water_outflow_lhr" stroke="#38bdf8" strokeWidth={2.5} name="Outflow (L/hr)" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="water_pressure_psi" stroke="#f43f5e" strokeWidth={2} name="Pressure (PSI)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Traffic Volume & Speed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              Traffic Volume (veh/min) & Avg Speed (km/h)
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">{traffic?.total_vehicles ?? 45} veh/min</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval="preserveStartEnd" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="traffic_vehicles" stroke="#f59e0b" strokeWidth={2.5} name="Vehicles/min" dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="traffic_speed_kmh" stroke="#a78bfa" strokeWidth={2} name="Avg Speed (km/h)" strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Waste Bin Fill Levels (color-coded) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              Smart Waste Bin Fill Levels (%)
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-semibold">
              <span className="text-emerald-400">● Normal</span>
              <span className="text-amber-400">● High</span>
              <span className="text-rose-400">● Critical</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteBins} margin={{ top: 16, right: 8, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin_id" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(val: number, _name: string, entry: any) => [
                    `${val}% — ${entry.payload.collection_priority} Priority`,
                    entry.payload.location
                  ]}
                />
                <Bar dataKey="fill_pct" name="Fill Level (%)" radius={[4, 4, 0, 0]}
                  label={{ position: 'top', fontSize: 10, fill: '#94a3b8', formatter: (v: number) => `${v}%` }}
                >
                  {wasteBins.map((bin) => (
                    <Cell key={bin.bin_id} fill={getBinColor(bin.fill_pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Building Comparison Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          PER-BUILDING ENERGY & WATER CONSUMPTION BREAKDOWN
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy per building */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Electricity Draw (kW) — all 5 buildings</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildingChartData} margin={{ top: 12, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} kW`, 'Electricity']} />
                  <Bar dataKey="electricity" name="Electricity (kW)" radius={[4, 4, 0, 0]}
                    label={{ position: 'top', fontSize: 9, fill: '#94a3b8', formatter: (v: number) => `${v}kW` }}
                  >
                    {buildingChartData.map((b) => (
                      <Cell key={b.name} fill={
                        b.status === 'Critical' ? '#f43f5e' :
                        b.status === 'Warning' ? '#f59e0b' : '#06b6d4'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Water per building */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Water Demand (L/hr) — all 5 buildings</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildingChartData} margin={{ top: 12, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} L/hr`, 'Water']} />
                  <Bar dataKey="water" name="Water (L/hr)" radius={[4, 4, 0, 0]}
                    label={{ position: 'top', fontSize: 9, fill: '#94a3b8', formatter: (v: number) => `${Math.round(v)}` }}
                  >
                    {buildingChartData.map((b) => (
                      <Cell key={b.name} fill={
                        b.status === 'Critical' ? '#f43f5e' :
                        b.status === 'Warning' ? '#f59e0b' : '#38bdf8'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Risk Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          AI 3-HOUR PREDICTIVE FORECASTS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictions.map((p, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{p.metric_name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  p.risk_level === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  p.risk_level === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {p.risk_level} Risk
                </span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-extrabold text-slate-100">{p.predicted_value}</span>
                <span className="text-xs text-slate-400">{p.unit}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                <span>Now: <strong>{p.current_value} {p.unit}</strong></span>
                <span>MAE ±{p.mae}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
