import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
