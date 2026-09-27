import React from 'react';
import {
  Activity, Cpu, Eye, Sliders, Brain, TrendingUp, Play, PlayCircle, Info
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onStartDemo: () => void;
  onTogglePresentationMode: () => void;
  isPresentationMode: boolean;
  simulatedTime?: string;
  activeEvent?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onStartDemo,
  onTogglePresentationMode,
  isPresentationMode,
  simulatedTime,
  activeEvent
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'digital-twin', label: 'Digital Twin', icon: Cpu },
    { id: 'monitoring', label: 'Live Stream', icon: Eye },
    { id: 'simulation-lab', label: 'Simulation Lab', icon: Sliders },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'impact', label: 'Sustainability Impact', icon: TrendingUp },
    { id: 'assumptions', label: 'ML & Assumptions', icon: Info },
  ];

  if (isPresentationMode) {
    return (
      <header className="h-14 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950 text-lg">
            N
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 tracking-wider">NEXUS TWIN</h1>
            <p className="text-[10px] text-cyan-400">PRESENTATION MODE — JUDGES VIEW</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 text-xs transition-all animate-pulse"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            GUIDED DEMO MODE
          </button>
          <button
            onClick={onTogglePresentationMode}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            Exit Fullscreen View
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 lg:px-8">
      <div className="h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('overview')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-cyan-400 text-lg">
              N
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-wider text-slate-100">NEXUS TWIN</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Simulated Urban Environment
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Simulate today. Sustain tomorrow.</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Active Event Badge */}
          {activeEvent && activeEvent !== 'normal' && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse border ${
              activeEvent === 'water_leak' ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' :
              activeEvent === 'energy_spike' ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' :
              activeEvent === 'heavy_rainfall' ? 'bg-sky-950/60 border-sky-500/50 text-sky-300' :
              activeEvent === 'traffic_congestion' ? 'bg-orange-950/60 border-orange-500/50 text-orange-300' :
              'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {activeEvent === 'water_leak' ? '💧 Water Leak' :
               activeEvent === 'energy_spike' ? '⚡ Energy Spike' :
               activeEvent === 'heavy_rainfall' ? '🌧️ Storm Active' :
               activeEvent === 'traffic_congestion' ? '🚗 Traffic Jam' :
               '🗑️ Waste Overflow'}
            </div>
          )}

          {/* Live Sim Badge */}
          {simulatedTime && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Sim Time:</span>
              <span className="font-mono text-cyan-400 font-bold">{simulatedTime}</span>
            </div>
          )}

          {/* Start Demo Button */}
          <button
            onClick={onStartDemo}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
          >
            <PlayCircle className="w-4 h-4 fill-slate-950" />
            START DEMO MODE
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentationMode}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium px-3 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            Judges View
          </button>
        </div>
      </div>

      {/* Subnav for smaller screens */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
