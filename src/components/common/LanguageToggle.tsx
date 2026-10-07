import React from 'react';
import { useApp } from '../../context/AppContext';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useApp();

  return (
    <div className={`inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          language === 'bn'
            ? 'bg-blue-900 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="বাংলা ভাষা নির্বাচন করুন"
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-md transition-all ${
          language === 'en'
            ? 'bg-blue-900 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Select English Language"
      >
        EN
      </button>
    </div>
  );
};
