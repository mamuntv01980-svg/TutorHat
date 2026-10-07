import React from 'react';
import { Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NoticeBanner: React.FC = () => {
  const { settings } = useApp();

  if (!settings.noticeMarquee) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white text-xs py-2 px-4 border-b border-blue-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium text-[11px] border border-amber-500/30">
            <Volume2 className="w-3 h-3 animate-pulse" />
            <span>Notice</span>
          </span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <p className="truncate text-slate-200 font-medium">
            {settings.noticeMarquee}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-300 shrink-0">
          <span>হেল্পলাইন:</span>
          <a href={`tel:${settings.publicPhone}`} className="hover:text-amber-300 font-semibold text-white tabular-nums">
            {settings.publicPhone}
          </a>
        </div>
      </div>
    </div>
  );
};
