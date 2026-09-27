import React from 'react';
import { X, Activity, AlertTriangle, Zap, Droplets, Trash2, Car, Sun, Trees } from 'lucide-react';
import { Building, WaterSystem, WasteBin, EnergySystem, TrafficSystem } from '../types';

interface SelectedObjectDetails {
  type: 'building' | 'water_tank' | 'pipeline' | 'waste_bin' | 'solar' | 'green' | 'road';
  data: Building | WaterSystem | WasteBin | EnergySystem | TrafficSystem | any;
}

interface ObjectDetailsModalProps {
  details: SelectedObjectDetails | null;
  onClose: () => void;
}

export const ObjectDetailsModal: React.FC<ObjectDetailsModalProps> = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div className="absolute top-4 right-4 z-40 w-96 bg-slate-900/95 border border-slate-700/80 backdrop-blur-md rounded-xl shadow-2xl p-5 text-slate-100 animate-in fade-in slide-in-from-right-5 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {details.type === 'building' && <Zap className="w-5 h-5 text-cyan-400" />}
          {details.type === 'water_tank' && <Droplets className="w-5 h-5 text-sky-400" />}
          {details.type === 'pipeline' && <Droplets className="w-5 h-5 text-sky-400" />}
          {details.type === 'waste_bin' && <Trash2 className="w-5 h-5 text-emerald-400" />}
          {details.type === 'solar' && <Sun className="w-5 h-5 text-amber-400" />}
          {details.type === 'green' && <Trees className="w-5 h-5 text-emerald-400" />}
          {details.type === 'road' && <Car className="w-5 h-5 text-amber-400" />}
          <h3 className="font-bold text-base text-slate-100">
            {details.type === 'building' && (details.data as Building).name}
            {details.type === 'water_tank' && 'Central Water Tank (T-01)'}
            {details.type === 'pipeline' && 'Underground Water Pipeline P-04'}
            {details.type === 'waste_bin' && `Smart Bin ${(details.data as WasteBin).bin_id}`}
            {details.type === 'solar' && 'Solar Array Park'}
            {details.type === 'green' && 'Community Eco-Park'}
            {details.type === 'road' && 'Arterial Road Network (R-01/R-02)'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        {details.type === 'building' && (
          <>
            <p className="text-slate-300 text-xs">{ (details.data as Building).description }</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">Occupancy</span>
                <span className="font-bold text-slate-100">{ (details.data as Building).occupancy } people</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">Electricity Draw</span>
                <span className="font-bold text-cyan-400">{ (details.data as Building).electricity_kw } kW</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">Water Demand</span>
                <span className="font-bold text-sky-400">{ (details.data as Building).water_lhr } L/hr</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block">CO₂ Rate</span>
                <span className="font-bold text-slate-100">{ (details.data as Building).co2_kg } kg/hr</span>
              </div>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-400">Anomaly Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                (details.data as Building).anomaly_status === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                (details.data as Building).anomaly_status === 'Warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {(details.data as Building).anomaly_status}
              </span>
            </div>
          </>
        )}

        {details.type === 'water_tank' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Current Storage:</span>
              <span className="font-bold text-sky-400">{ (details.data as WaterSystem).tank_level_l.toLocaleString() } / { (details.data as WaterSystem).tank_capacity_l.toLocaleString() } L</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Inflow Rate:</span>
              <span className="font-bold text-emerald-400">{ (details.data as WaterSystem).inflow_lhr } L/hr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Outflow Rate:</span>
              <span className="font-bold text-slate-100">{ (details.data as WaterSystem).outflow_lhr } L/hr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">System Pressure:</span>
              <span className="font-bold text-slate-100">{ (details.data as WaterSystem).pressure_psi } PSI</span>
            </div>
          </div>
        )}

        {details.type === 'pipeline' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Pipeline Segment:</span>
              <span className="font-bold text-slate-100">P-04 (Hostel Zone B)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Leakage Probability:</span>
              <span className={`font-bold ${(details.data as WaterSystem).leak_prob > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {((details.data as WaterSystem).leak_prob * 100).toFixed(0)}%
              </span>
            </div>
            {(details.data as WaterSystem).estimated_daily_loss_l > 0 && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400 inline mr-1" />
                Estimated Daily Water Loss: <strong>{(details.data as WaterSystem).estimated_daily_loss_l.toLocaleString()} L/day</strong>
              </div>
            )}
          </div>
        )}

        {details.type === 'waste_bin' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Location:</span>
              <span className="font-bold text-slate-100">{(details.data as WasteBin).location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Fill Level:</span>
              <span className="font-bold text-emerald-400">{(details.data as WasteBin).fill_pct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Waste Stream:</span>
              <span className="font-bold text-slate-100">{(details.data as WasteBin).waste_type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Predicted Overflow:</span>
              <span className="font-bold text-amber-400">In ~{(details.data as WasteBin).predicted_overflow_hrs} hrs</span>
            </div>
          </div>
        )}

        {details.type === 'solar' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Current Generation:</span>
              <span className="font-bold text-amber-400">{(details.data as EnergySystem).solar_gen_kw} kW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Installed Capacity:</span>
              <span className="font-bold text-slate-100">{(details.data as EnergySystem).solar_cap_kw} kW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Solar Contribution:</span>
              <span className="font-bold text-emerald-400">{(details.data as EnergySystem).solar_contribution_pct}%</span>
            </div>
          </div>
        )}

        {details.type === 'green' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Canopy Coverage:</span>
              <span className="font-bold text-emerald-400">{details.data.greenCoveragePct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Stormwater Retention:</span>
              <span className="font-bold text-sky-400">~{ (details.data.greenCoveragePct * 4.2).toFixed(0) } L/sqm</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Microclimate Cooling:</span>
              <span className="font-bold text-cyan-400">~1.8 °C Reduction</span>
            </div>
          </div>
        )}

        {details.type === 'road' && (
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Traffic Volume:</span>
              <span className="font-bold text-amber-400">{(details.data as TrafficSystem).total_vehicles} vehicles/min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Average Speed:</span>
              <span className="font-bold text-slate-100">{(details.data as TrafficSystem).avg_speed_kmh} km/h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">EV Fleet Share:</span>
              <span className="font-bold text-emerald-400">{(details.data as TrafficSystem).evs_cnt} vehicles</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Congestion Index:</span>
              <span className="font-bold text-slate-100">{(details.data as TrafficSystem).congestion_level}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
