import React from 'react';
import { PRIORITY_COLORS } from '../../utils/constants';

export const PriorityBadge = ({ priority }) => {
  const colorClass = PRIORITY_COLORS[priority] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md border ${colorClass}`}>
      {priority}
    </span>
  );
};
