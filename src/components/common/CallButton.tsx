import React from 'react';
import { Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CallButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'primary' | 'outline' | 'compact';
}

export const CallButton: React.FC<CallButtonProps> = ({
  className = '',
  showIcon = true,
  variant = 'outline'
}) => {
  const { settings, language } = useApp();
  const label = language === 'bn' ? 'কল করুন' : 'Call Now';

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl min-h-[44px] px-4 text-sm active:scale-[0.98]';
  const variantClasses = {
    primary: 'bg-blue-900 hover:bg-blue-800 text-white shadow-sm',
    outline: 'border border-blue-900/30 text-blue-900 hover:bg-blue-50 bg-white',
    compact: 'px-3 py-1.5 min-h-[38px] text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 rounded-lg'
  };

  return (
    <a
      href={`tel:${settings.publicPhone.replace(/[^0-9+]/g, '')}`}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={`Call TutorHat support at ${settings.publicPhone}`}
    >
      {showIcon && <Phone className="w-4 h-4 text-blue-700" />}
      <span>{label}: <strong className="font-semibold tabular-nums">{settings.publicPhone}</strong></span>
    </a>
  );
};
