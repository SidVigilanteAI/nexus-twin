import React from 'react';

interface StatusBadgeProps {
  status: 'Normal' | 'Warning' | 'Critical' | 'Low' | 'Moderate' | 'High' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const isCritical = ['Critical', 'High'].includes(status);
  const isWarning = ['Warning', 'Moderate'].includes(status);
  const isNormal = ['Normal', 'Low', 'Active'].includes(status);

  const py = size === 'sm' ? 'py-0.5 px-2 text-[10px]' : 'py-1 px-2.5 text-xs';

  if (isCritical) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${py}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        {status}
      </span>
    );
  }

  if (isWarning) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${py}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${py}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      {status}
    </span>
  );
};
