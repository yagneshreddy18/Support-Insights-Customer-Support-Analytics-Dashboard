import React from 'react';

export const SkeletonCard = () => (
  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse space-y-4">
    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
    <div className="h-8 bg-slate-800 rounded w-2/3"></div>
    <div className="h-3 bg-slate-800 rounded w-1/2"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="h-10 bg-slate-800/60 rounded-xl w-full"></div>
    ))}
  </div>
);
