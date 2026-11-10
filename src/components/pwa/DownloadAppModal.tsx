import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Zap, 
  BellRing, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'bn' | 'en';
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ 
  isOpen, 
  onClose,
  language = 'bn' 
}) => {
  const { isInstallable, isInstalled, isIOS, triggerInstall, hasDeferredPrompt } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'auto' | 'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'auto'
  );
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (hasDeferredPrompt) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    }
  };

  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-950 to-indigo-950 text-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
              <img 
                src="/pwa-192x192.png" 
                alt="TutorHat App Icon" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-semibold mb-1 border border-amber-400/30">
                <Zap className="w-3 h-3" />
                <span>{isBn ? 'অফিসিয়াল ওয়েব অ্যাপ' : 'Official Web App'}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {isBn ? 'TutorHat অ্যাপ ইনস্টল করুন' : 'Install TutorHat App'}
              </h3>
              <p className="text-xs text-blue-100/90 mt-0.5">
                {isBn 
                  ? 'মোবাইল ও কম্পিউটারে ইনস্টল করে সরাসরি ব্যবহার করুন' 
                  : 'Install on mobile or desktop for the best experience'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {installSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {isBn ? 'অভিনন্দন! অ্যাপটি ইনস্টল হচ্ছে' : 'Congratulations! App Installed'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isBn 
                  ? 'TutorHat অ্যাপটি আপনার ডিভাইসের হোম স্ক্রিন বা অ্যাপ ড্রয়ারে যুক্ত হয়েছে।'
                  : 'TutorHat app has been added to your device home screen or app launcher.'}
              </p>
            </div>
          ) : (
            <>
              {/* Value Proposition Pills */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <div className="flex flex-col items-center">
                  <Zap className="w-4 h-4 text-amber-500 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">
                    {isBn ? 'দ্রুত লোডিং' : 'Fast Speed'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isBn ? 'নো ল্যাগ' : 'No delay'}
                  </span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <BellRing className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">
                    {isBn ? 'অ্যালার্ট' : 'Instant Alert'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isBn ? 'নতুন টিউশন' : 'New jobs'}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">
                    {isBn ? '১০০% নিরাপদ' : 'Safe & Light'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isBn ? 'কম স্টোরেজ' : '<1 MB'}
                  </span>
                </div>
              </div>

              {/* Direct Native Install Button (if browser supports beforeinstallprompt) */}
              {hasDeferredPrompt && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-blue-950">
                      {isBn ? '১-ক্লিকে ইনস্টল রেডি!' : '1-Click Install Ready!'}
                    </p>
                    <p className="text-[11px] text-blue-700">
                      {isBn ? 'নিচের বাটনে চাপ দিয়ে সাথে সাথে যুক্ত করুন' : 'Click the button below to install directly'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{isBn ? 'সরাসরি ইনস্টল করুন' : 'Install Directly'}</span>
                  </button>
                </div>
              )}

              {/* Platform Instructions Tabs */}
              <div>
                <div className="flex border-b border-slate-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab('android')}
                    className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'android' || (activeTab === 'auto' && !isIOS)
                        ? 'border-blue-900 text-blue-900 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Android / Chrome</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ios')}
                    className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'ios'
                        ? 'border-blue-900 text-blue-900 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>iPhone / iOS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('desktop')}
                    className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'desktop'
                        ? 'border-blue-900 text-blue-900 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>PC / Windows / Mac</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="pt-3">
                  {/* Android / Chrome Tab */}
                  {(activeTab === 'android' || (activeTab === 'auto' && !isIOS)) && (
                    <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>{isBn ? 'অ্যান্ড্রয়েড ও ক্রোম ব্রাউজারে ইনস্টল নির্দেশিকা:' : 'Android & Chrome installation steps:'}</span>
                      </p>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">১</span>
                          <span>
                            {isBn 
                              ? 'ব্রাউজারের উপরের ডান কোণায় ৩-ডট মেনু (⋮) তে চাপ দিন।' 
                              : 'Tap the three-dots menu (⋮) at top right of Chrome.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">২</span>
                          <span>
                            {isBn 
                              ? 'মেনু থেকে ' 
                              : 'Select '}
                            <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded text-[11px]">
                              {isBn ? '"Install app" বা "Add to Home screen"' : '"Install app" or "Add to Home screen"'}
                            </strong>
                            {isBn ? ' অপশনটি বেছে নিন।' : '.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                          <span>
                            {isBn 
                              ? 'পপআপে ' 
                              : 'Click '}
                            <strong className="text-blue-900">Install</strong>
                            {isBn ? ' চাপলে স্বয়ংক্রিয়ভাবে অ্যাপ হিসেবে ইনস্টল হয়ে যাবে।' : ' to complete installation.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* iOS / iPhone Tab */}
                  {activeTab === 'ios' && (
                    <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <span>{isBn ? 'আইফোন / আইপ্যাডে ইনস্টল করার নিয়ম (Safari):' : 'iPhone / iPad installation steps (Safari):'}</span>
                      </p>
                      <div className="space-y-2.5 pl-2">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">১</span>
                          <span>
                            {isBn ? 'সাফারি ব্রাউজারের নিচের ' : 'Tap the '}
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              <Share2 className="w-3 h-3 text-blue-700" />
                              {isBn ? 'শেয়ার (Share)' : 'Share'}
                            </span>
                            {isBn ? ' আইকনে চাপ দিন।' : ' icon at the bottom of Safari.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">২</span>
                          <span>
                            {isBn ? 'মেনু স্ক্রোল করে ' : 'Scroll down and tap '}
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <PlusSquare className="w-3 h-3 text-amber-600" />
                              {isBn ? '"Add to Home Screen"' : '"Add to Home Screen"'}
                            </span>
                            {isBn ? ' অপশনে চাপ দিন।' : '.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                          <span>
                            {isBn 
                              ? 'উপরের ডান কোণায় "Add" বাটনে চাপ দিলেই অ্যাপটি হোমস্ক্রিনে চলে আসবে।' 
                              : 'Tap "Add" in top right corner. The app icon will appear on your Home Screen.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Desktop Tab */}
                  {activeTab === 'desktop' && (
                    <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <p className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-indigo-600" />
                        <span>{isBn ? 'কম্পিউটার ও ল্যাপটপে ইনস্টল করার নিয়ম:' : 'Desktop / Laptop installation steps:'}</span>
                      </p>
                      <div className="space-y-2 pl-2">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">১</span>
                          <span>
                            {isBn 
                              ? 'Chrome বা Edge ব্রাউজারের অ্যাড্রেস বারের ডানে '
                              : 'Look at the right side of Chrome or Edge address bar for the '}
                            <strong className="text-blue-950 font-bold bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">
                              {isBn ? 'ইনস্টল আইকন (⤓)' : 'Install icon (⤓)'}
                            </strong>
                            {isBn ? ' দেখতে পাবেন।' : '.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">২</span>
                          <span>
                            {isBn 
                              ? 'অথবা ব্রাউজারের ৩-ডট মেনু থেকে ' 
                              : 'Or open the 3-dots menu and select '}
                            <strong className="text-slate-900 bg-amber-50 px-1.5 py-0.5 rounded">
                              {isBn ? '"Install TutorHat..."' : '"Install TutorHat..."'}
                            </strong>
                            {isBn ? ' অপশন ক্লিক করুন।' : '.'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                          <span>
                            {isBn 
                              ? 'এটি আপনার ডেস্কটপ ও টাস্কবারে একটি ফুলস্ক্রিন স্বতন্ত্র উইন্ডো অ্যাপ হিসেবে চালু হবে।' 
                              : 'It launches as a standalone, dedicated desktop application.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isBn ? 'ভার্সন ১.২.০ • নো স্টোরেজ লস' : 'Version 1.2.0 • Zero bloatware'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isBn ? 'বুঝেছি / বন্ধ করুন' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
