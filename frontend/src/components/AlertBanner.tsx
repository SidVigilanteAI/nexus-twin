import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, Anomaly } from '../types';

interface AlertBannerProps {
  alerts: Alert[];
  anomalies: Anomaly[];
  onSelectAlert?: (alert: any) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, anomalies }) => {
  const allItems = [
    ...anomalies.map(a => ({
      id: a.metric,
      title: `${a.type}: ${a.metric}`,
      description: `Observed ${a.observed} vs expected ${a.expected}. Possible cause: ${a.possible_cause}.`,
      severity: a.severity,
      zone: a.affected_zone,
      confidence: a.confidence_pct,
      isAnomaly: true
    })),
    ...alerts.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      severity: a.severity,
      zone: a.system_zone,
      confidence: a.confidence_score * 100,
      isAnomaly: false
    }))
  ];

  if (allItems.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {allItems.map((item, index) => {
        const isCritical = item.severity === 'Critical' || item.severity === 'High';
        return (
          <div
            key={index}
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              isCritical
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 glow-rose'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-200 glow-amber'
            }`}
          >
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  {item.title}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-cyan-400">
                    Confidence: {item.confidence.toFixed(0)}%
                  </span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                  Zone: {item.zone}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-300">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
