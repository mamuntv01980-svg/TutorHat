import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppButtonProps {
  className?: string;
  showIcon?: boolean;
  variant?: 'green' | 'outline' | 'compact' | 'floating';
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  className = '',
  showIcon = true,
  variant = 'green',
  customMessage
}) => {
  const { settings, language } = useApp();
  const label = language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp';
  
  // Clean international format without '+' or spaces for wa.me link
  const intlClean = settings.whatsAppIntl.replace(/[^0-9]/g, '');
  const messageText = encodeURIComponent(
    customMessage || (language === 'bn' 
      ? 'আসসালামু আলাইকুম! আমি TutorHat-এর সার্ভিস সম্পর্কে জানতে চাই।' 
      : 'Hello! I would like to inquire about TutorHat services.')
  );

  const url = `https://wa.me/${intlClean}?text=${messageText}`;

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl min-h-[44px] px-4 text-sm active:scale-[0.98]';
  const variantClasses = {
    green: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    outline: 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-white',
    compact: 'px-3 py-1.5 min-h-[38px] text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg',
    floating: 'fixed bottom-20 right-4 z-40 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-full p-3.5 border-2 border-white'
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={`Chat with TutorHat on WhatsApp at ${settings.whatsAppRaw}`}
    >
      {showIcon && <MessageCircle className="w-4 h-4 fill-current" />}
      <span>{label} (<span className="tabular-nums font-mono">{settings.whatsAppRaw}</span>)</span>
    </a>
  );
};
