import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-slate-950 border-t border-slate-800/80 py-8 px-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-cyan-400 text-xs">
            N
          </div>
          <div>
            <p className="font-semibold text-slate-200">NEXUS TWIN — Environmental Innovation Prototype</p>
            <p className="text-[11px] text-slate-400">AI-Powered Digital Twin for Climate-Resilient Sustainable Cities</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Actual Working ML & Simulation Engine</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Simulated Urban Environment — Not Real-World Measurements</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
