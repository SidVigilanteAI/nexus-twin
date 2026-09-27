import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '../services/api';
import { Recommendation, Prediction } from '../types';

interface AIInsightsProps {
  anomalies: any[];
  predictions: Prediction[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ anomalies, predictions }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    api.getRecommendations().then(setRecommendations).catch(console.error);
  }, [anomalies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">AI INSIGHTS & RECOMMENDATIONS</h2>
              <p className="text-xs text-slate-400">
                Machine learning anomaly detection, predictive forecasting, and automated decision recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detected Anomalies Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            DETECTED ENVIRONMENTAL ANOMALIES (ISOLATION FOREST)
          </h3>

          {anomalies.length === 0 ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">No Anomalies Detected</p>
              <p className="text-xs text-slate-400">All environmental parameters operating within expected 3-sigma thresholds.</p>
            </div>
          ) : (
            anomalies.map((anom, i) => (
              <div key={i} className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-5 space-y-3 glow-rose">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {anom.type}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {anom.confidence_pct}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Observed Reading</span>
                    <span className="font-bold text-rose-400">{anom.observed}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Expected Diurnal Baseline</span>
                    <span className="font-bold text-slate-300">{anom.expected}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong>Affected Zone:</strong> {anom.affected_zone}</p>
                  <p><strong>Possible Cause:</strong> {anom.possible_cause}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: AI Actionable Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            RECOMMENDED INTERVENTIONS
          </h3>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {rec.category}
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    rec.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                    rec.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-100">{rec.title}</h4>
                <p className="text-xs text-slate-300"><strong className="text-slate-400">Trigger Reason:</strong> {rec.trigger_reason}</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-cyan-300 space-y-1">
                  <p><strong className="text-slate-200">Recommended Action:</strong> {rec.recommended_action}</p>
                  <p><strong className="text-emerald-400">Estimated Impact:</strong> {rec.impact_estimate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
