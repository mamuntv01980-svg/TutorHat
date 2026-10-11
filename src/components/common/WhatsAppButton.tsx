import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WhatsAppButtonProps {
  className?: string;
  showIcon?: boolean;
  showNumber?: boolean;
  variant?: 'green' | 'outline' | 'compact' | 'floating';
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  className = '',
  showIcon = true,
  showNumber = false,
  variant = 'green',
  customMessage
}) => {
  const { settings, language } = useApp();
  const label = language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp Chat';
  
  // Clean international format without '+' or spaces for wa.me link
  const intlClean = (settings.whatsAppIntl || settings.publicPhone || '01610582917').replace(/[^0-9]/g, '');
  const messageText = encodeURIComponent(
    customMessage || (language === 'bn' 
      ? 'আসসালামু আলাইকুম! আমি TutorHat-এর সার্ভিস সম্পর্কে জানতে চাই।' 
      : 'Hello! I would like to inquire about TutorHat services.')
  );

  const url = `https://wa.me/${intlClean}?text=${messageText}`;

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/90 ${className}`}
        aria-label={language === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Chat with us on WhatsApp'}
        title={language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-none drop-shadow-sm transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Hover pill tooltip without displaying phone number */}
        <span className="pointer-events-none absolute right-full mr-3 hidden sm:group-hover:flex items-center px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {language === 'bn' ? '💬 হোয়াটসঅ্যাপে মেসেজ দিন' : '💬 Chat on WhatsApp'}
        </span>
      </a>
    );
  }

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl min-h-[44px] px-4 text-sm active:scale-[0.98]';
  const variantClasses = {
    green: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    outline: 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-white',
    compact: 'px-3 py-1.5 min-h-[38px] text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg',
    floating: ''
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="WhatsApp"
    >
      {showIcon && <MessageCircle className="w-4 h-4 fill-current" />}
      <span>{label}</span>
      {showNumber && (
        <span className="tabular-nums font-mono text-xs opacity-90">({settings.whatsAppRaw})</span>
      )}
    </a>
  );
};
