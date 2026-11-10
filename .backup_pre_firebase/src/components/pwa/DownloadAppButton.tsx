import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { DownloadAppModal } from './DownloadAppModal';

interface DownloadAppButtonProps {
  language?: 'bn' | 'en';
  variant?: 'navbar' | 'top-pill' | 'banner' | 'mobile-item';
  className?: string;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  language = 'bn',
  variant = 'navbar',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, triggerInstall, hasDeferredPrompt } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = async () => {
    // If native prompt is available (e.g. Android/Chrome/Edge), trigger it directly
    if (hasDeferredPrompt) {
      const outcome = await triggerInstall();
      if (outcome === 'dismissed' || outcome === 'manual') {
        setModalOpen(true);
      }
    } else {
      // Otherwise open the guide modal with platform-specific instructions (iOS Safari / Desktop / Android)
      setModalOpen(true);
    }
  };

  const isBn = language === 'bn';

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 ${className}`}>
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">{isBn ? 'অ্যাপ ইনস্টল্ড' : 'App Installed'}</span>
      </div>
    );
  }

  // Variant: Top announcement pill or banner
  if (variant === 'top-pill') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`group flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer border border-amber-300/40 ${className}`}
          title={isBn ? 'TutorHat অ্যাপ ডাউনলোড করুন' : 'Download TutorHat App'}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>{isBn ? 'অ্যাপ ডাউনলোড' : 'Download App'}</span>
        </button>

        <DownloadAppModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          language={language}
        />
      </>
    );
  }

  // Variant: Mobile menu item
  if (variant === 'mobile-item') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-blue-900/10 border border-amber-400/40 text-slate-900 font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">
                {isBn ? 'মোবাইল অ্যাপ ডাউনলোড করুন' : 'Download Mobile App'}
              </div>
              <div className="text-[10px] text-slate-500 font-normal">
                {isBn ? 'হোমস্ক্রিনে সরাসরি শর্টকাট ইনস্টল' : 'Add to home screen directly'}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
            {isBn ? 'ফ্রি' : 'Free'}
          </span>
        </button>

        <DownloadAppModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          language={language}
        />
      </>
    );
  }

  // Default: Navbar button
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-[0.97] cursor-pointer border border-amber-300/60 ${className}`}
        aria-label={isBn ? 'TutorHat অ্যাপ ডাউনলোড করুন' : 'Download TutorHat App'}
        title={isBn ? 'মোবাইল বা কম্পিউটারে অ্যাপ ইনস্টল করুন' : 'Install App on Mobile or PC'}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
        </span>
        <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
        <span className="hidden sm:inline font-bold">
          {isBn ? 'অ্যাপ ডাউনলোড' : 'Download App'}
        </span>
        <span className="sm:hidden font-bold">
          {isBn ? 'অ্যাপ' : 'App'}
        </span>
      </button>

      <DownloadAppModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        language={language}
      />
    </>
  );
};
