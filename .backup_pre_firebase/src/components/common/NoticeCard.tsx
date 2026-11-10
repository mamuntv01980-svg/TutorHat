import React from 'react';
import { Volume2, Calendar, ShieldAlert } from 'lucide-react';
import { NoticeItem } from '../../types';

export const NoticeCard: React.FC<{ notice: NoticeItem; className?: string }> = ({ notice, className = '' }) => {
  const categoryStyles = {
    general: 'border-blue-200 bg-blue-50/50 text-blue-950',
    tutors: 'border-indigo-200 bg-indigo-50/50 text-indigo-950',
    guardians: 'border-amber-200 bg-amber-50/50 text-amber-950',
    urgent: 'border-rose-200 bg-rose-50/50 text-rose-950'
  };

  return (
    <div className={`p-4 rounded-2xl border ${categoryStyles[notice.category] || categoryStyles.general} space-y-1.5 text-xs ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-sm leading-tight flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span>{notice.title}</span>
        </span>
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 shrink-0">
          {notice.publishedDate}
        </span>
      </div>
      <p className="text-slate-700 leading-relaxed text-xs">
        {notice.description}
      </p>
    </div>
  );
};
