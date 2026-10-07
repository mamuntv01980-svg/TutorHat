import React from 'react';
import { useApp } from '../../context/AppContext';

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; clickable?: boolean }> = ({
  size = 'md',
  clickable = true
}) => {
  const { navigateTo } = useApp();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      {/* Original TutorHat Geometric Crest with Mortarboard & Book in Deep Royal Blue + Warm Gold */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xs p-1.5 ring-1 ring-blue-900/10`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Hat / Mortarboard Roof */}
          <path d="M16 4L3 11L16 18L29 11L16 4Z" fill="#38bdf8" />
          <path d="M16 5.5L5.5 11.2L16 16.8L26.5 11.2L16 5.5Z" fill="#1e3a8a" />
          {/* Warm Gold Tassel */}
          <path d="M25 12.5V20C25 21 24.2 21.8 23.5 21.8C22.8 21.8 22 21 22 20V14.2" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="23.5" cy="21.5" r="1.5" fill="#d97706" />
          {/* Open Learning Pages Base */}
          <path d="M8 17V22C8 23.5 11.5 25.5 16 25.5C20.5 25.5 24 23.5 24 22V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          {/* Shining Accent Star */}
          <path d="M16 11L17 13.5L19.5 14L17.5 15.5L18 18L16 16.5L14 18L14.5 15.5L12.5 14L15 13.5L16 11Z" fill="#fbbf24" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-bold tracking-tight text-blue-950 leading-none`}>
          Tutor<span className="text-blue-600">Hat</span>
        </span>
        <span className="text-[10px] font-medium text-amber-700 tracking-wider uppercase mt-0.5">
          Bangladesh
        </span>
      </div>
    </div>
  );

  if (clickable) {
    return (
      <button
        type="button"
        onClick={() => navigateTo('home')}
        className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5"
      >
        {content}
      </button>
    );
  }

  return content;
};
