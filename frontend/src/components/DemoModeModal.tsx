import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, X, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  actionName: string;
  targetPage: string;
  triggerEvent?: string;
  simulationParams?: any;
  highlightCard?: string;
}

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onApplySimulation: (params: any) => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onApplySimulation
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: DemoStep[] = [
    {
      stepNumber: 1,
      title: "STEP 1: Normal City State Monitoring",
      subtitle: "Baseline Operational State",
      description: "NEXUS TWIN continuously monitors the virtual neighborhood across 5 buildings, water systems, grid energy, traffic, and waste points.",
      actionName: "Inspect Baseline Twin",
      targetPage: "digital-twin",
      triggerEvent: "normal"
    },
    {
      stepNumber: 2,
      title: "STEP 2: Unexpected Water Anomaly Appears",
      subtitle: "Simulating Infrastructure Failure",
      description: "Triggering a sudden subsurface pipe fracture in Hostel Zone B (Pipeline P-04). Water outflow spikes to 1,650 L/hr.",
      actionName: "Trigger Water Leak Event",
      targetPage: "digital-twin",
      triggerEvent: "water_leak"
    },
    {
      stepNumber: 3,
      title: "STEP 3: AI Isolation Forest Detection",
      subtitle: "Anomaly Identification & Isolation",
      description: "The AI Anomaly Detector compares live pressure and flow against diurnal historical baseline models, detecting anomalous leak signature with 94% confidence.",
      actionName: "View AI Detection Output",
      targetPage: "ai-insights"
    },
    {
      stepNumber: 4,
      title: "STEP 4: Predictive Machine Learning Forecast",
      subtitle: "Estimating Cumulative Losses",
      description: "Multi-domain Random Forest Regressors project next 3-hour consumption, calculating an estimated daily loss of ~15,600 L/day.",
      actionName: "View Loss Prediction",
      targetPage: "monitoring"
    },
    {
      stepNumber: 5,
      title: "STEP 5: Open Simulation Lab",
      subtitle: "Decision Support Workspace",
      description: "City Planners enter the Simulation Lab to test interventions virtually before deploying physical crews in the real world.",
      actionName: "Enter Simulation Lab",
      targetPage: "simulation-lab"
    },
    {
      stepNumber: 6,
      title: "STEP 6: Apply Water Conservation Intervention",
      subtitle: "Testing 15% Water Reduction",
      description: "Modifying scenario parameters: set Water Reduction to 15% and test pipeline isolation bypass.",
      actionName: "Apply Water Intervention",
      targetPage: "simulation-lab",
      simulationParams: { solar_capacity: 20, public_transport_share: 18, green_cover: 15, water_reduction: 15, rainfall: 10, drainage_capacity: 100 }
    },
    {
      stepNumber: 7,
      title: "STEP 7: Measure Water Savings",
      subtitle: "Baseline vs Intervention Comparison",
      description: "Simulation Engine computes direct impact: 2,775 L/day water saved, restoring grid pressure without baseline degradation.",
      actionName: "Inspect Water Delta",
      targetPage: "impact"
    },
    {
      stepNumber: 8,
      title: "STEP 8: Simulate Extreme Climate Event",
      subtitle: "Heavy Storm Rainfall (80 mm)",
      description: "Simulating severe weather shock: 80 mm storm rainfall exceeding municipal storm channel baseline.",
      actionName: "Trigger Extreme Rainfall",
      targetPage: "digital-twin",
      triggerEvent: "heavy_rainfall"
    },
    {
      stepNumber: 9,
      title: "STEP 9: Identify Flood-Risk Zones",
      subtitle: "Visualizing Vulnerable Infrastructure",
      description: "Digital Twin renders 3D dynamic flood overlay across low-elevation zones, calculating Critical Flood Risk (82/100).",
      actionName: "View Flood Risk Zones",
      targetPage: "digital-twin"
    },
    {
      stepNumber: 10,
      title: "STEP 10: Apply Green Infrastructure Intervention",
      subtitle: "Green Cover (+15%) & Drainage (+20%)",
      description: "Testing climate resiliency interventions: expand urban eco-park canopy cover to 30% and boost storm drainage rating to 120%.",
      actionName: "Apply Resilience Interventions",
      targetPage: "simulation-lab",
      simulationParams: { solar_capacity: 50, public_transport_share: 35, green_cover: 30, water_reduction: 15, rainfall: 80, drainage_capacity: 120 }
    },
    {
      stepNumber: 11,
      title: "STEP 11: Verify Flood Risk Reduction",
      subtitle: "Risk Score Reduction (Critical -> Moderate)",
      description: "What-If Engine demonstrates runoff absorption: flood risk score decreases by -42% to Moderate Risk level.",
      actionName: "Inspect Reduced Risk",
      targetPage: "simulation-lab"
    },
    {
      stepNumber: 12,
      title: "STEP 12: Final Environmental Impact Dashboard",
      subtitle: "Quantified Sustainability Metrics",
      description: "Final overview: CO₂ avoided: 260 kg/day, Water saved: 4,300 L/day, Energy saved: 185 kWh/day, Flood risk reduced.",
      actionName: "View Final Dashboard",
      targetPage: "impact"
    }
  ];

  const currentStep = steps[currentStepIndex];

  const executeStepActions = async (step: DemoStep) => {
    if (step.targetPage) {
      onNavigate(step.targetPage);
    }
    if (step.triggerEvent) {
      await api.triggerEvent(step.triggerEvent);
    }
    if (step.simulationParams) {
      onApplySimulation(step.simulationParams);
    }
  };

  useEffect(() => {
    if (isOpen) {
      executeStepActions(steps[currentStepIndex]);
    }
  }, [currentStepIndex, isOpen]);

  useEffect(() => {
    let timer: any;
    if (isPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 10000); // 10 seconds per step auto advance
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-slate-900/95 border border-cyan-500/50 backdrop-blur-xl rounded-2xl shadow-2xl p-5 text-slate-100 glow-cyan">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950 text-sm">
            {currentStep.stepNumber}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-cyan-400 tracking-wide">{currentStep.title}</h3>
            <p className="text-xs text-slate-300 font-medium">{currentStep.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-amber-400" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
            {isPlaying ? 'Pause Auto-Play' : 'Auto-Play Demo'}
          </button>

          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Reset Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description & Action */}
      <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          {currentStep.description}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              } else {
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-md"
          >
            {currentStepIndex < steps.length - 1 ? 'Next Step' : 'Finish Demo'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStepIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentStepIndex
                ? 'w-8 bg-cyan-400'
                : idx < currentStepIndex
                ? 'w-3 bg-cyan-800'
                : 'w-3 bg-slate-800'
            }`}
            title={`Step ${s.stepNumber}: ${s.subtitle}`}
          />
        ))}
      </div>
    </div>
  );
};
