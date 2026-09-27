import React, { useState, useEffect } from 'react';
import { Info, Cpu, CheckCircle2, ShieldCheck, Database, FileText } from 'lucide-react';
import { api } from '../services/api';

export const AssumptionsPage: React.FC = () => {
  const [mlEval, setMlEval] = useState<any[]>([]);
  const [assumptions, setAssumptions] = useState<any>(null);

  useEffect(() => {
    api.getMLEvaluation().then(setMlEval).catch(console.error);
    api.getAssumptions().then(setAssumptions).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">MACHINE LEARNING & METHODOLOGY AUDIT</h2>
              <p className="text-xs text-slate-400">
                Transparent model architecture, evaluation metrics, formulas, and assumptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ML Evaluation Section */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> DEPLOYED MACHINE LEARNING MODELS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mlEval.map((ml, i) => (
            <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-100">{ml.model_name}</h4>
                  <span className="text-xs text-cyan-400 font-mono">{ml.algorithm}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {ml.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Training Samples:</span>
                  <span className="font-bold text-slate-200">{ml.training_samples.toLocaleString()} synthetic records</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Features Evaluated:</span>
                  <span className="font-bold text-slate-200">{ml.features_used.join(', ')}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Performance Metrics</span>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-cyan-300">
                  {Object.entries(ml.metrics).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400 text-[10px] block">{k}:</span>
                      <strong>{typeof v === 'number' ? v : String(v)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Transparency & Disclaimer Card */}
      {assumptions && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> METHODOLOGY & SCIENTIFIC ASSUMPTIONS
          </h3>

          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono font-bold">
            {assumptions.disclaimer}
          </div>

          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            {assumptions.assumptions.map((asm: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{asm}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
