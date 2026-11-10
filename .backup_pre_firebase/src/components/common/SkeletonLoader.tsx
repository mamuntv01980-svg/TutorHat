import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
