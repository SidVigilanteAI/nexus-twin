import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ToastItem {
  id: string;
  type: string;
  severity: string;
  zone: string;
}

interface AnomalyToastProps {
  anomalies: any[];
}

export const AnomalyToast: React.FC<AnomalyToastProps> = ({ anomalies }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prevKeysRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<number[]>([]);

  // Clear all dismiss timers on unmount
  useEffect(() => () => { timersRef.current.forEach(window.clearTimeout); }, []);

  const typeKey = anomalies.map((a: any) => a.type).sort().join(',');

  useEffect(() => {
    const currentKeys = new Set<string>(anomalies.map((a: any) => a.type));
    const newEntries: ToastItem[] = anomalies
      .filter((a: any) => !prevKeysRef.current.has(a.type))
      .map((a: any) => ({
        id: `${a.type}-${Date.now()}`,
        type: a.type,
        severity: a.severity,
        zone: a.affected_zone,
      }));

    prevKeysRef.current = currentKeys;
    if (newEntries.length === 0) return;

    setToasts(prev => [...prev, ...newEntries]);

    // Schedule dismissal — store handle so we can clear on unmount
    const ids = newEntries.map(e => e.id);
    const handle = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => !ids.includes(t.id)));
      timersRef.current = timersRef.current.filter(h => h !== handle);
    }, 6000);
    timersRef.current.push(handle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeKey]);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3 rounded-xl shadow-2xl border backdrop-blur-sm text-sm ${
            toast.severity === 'Critical'
              ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 glow-rose'
              : 'bg-amber-950/90 border-amber-500/60 text-amber-100'
          }`}
        >
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${toast.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs">AI Anomaly Detected</p>
            <p className="text-[11px] opacity-90 mt-0.5 truncate">{toast.type}</p>
            <p className="text-[10px] opacity-70 mt-0.5">Zone: {toast.zone}</p>
          </div>
          <button onClick={() => dismiss(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
