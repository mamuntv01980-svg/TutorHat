import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, X, ExternalLink, Share2, Sparkles } from 'lucide-react';

interface AdminInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onPromptTriggered: () => void;
}

export const AdminInstallModal: React.FC<AdminInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onPromptTriggered
}) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          onPromptTriggered();
        }
      } catch (e) {
        console.error('Install prompt error:', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-amber-400 p-1 shadow-lg shrink-0 flex items-center justify-center">
              <img src="/icon-admin.svg" alt="TutorHat Admin" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>অফিসিয়াল ম্যানেজমেন্ট অ্যাপ</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">TutorHat Admin App</h3>
              <p className="text-xs text-slate-300">ফোন বা কম্পিউটারে সরাসরি ইনস্টল করুন</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">অ্যাপটি ইতিমধ্যে সফলভাবে ইনস্টল করা আছে!</p>
                <p className="text-xs text-emerald-700">আপনি বর্তমানে সম্পূর্ণ স্ট্যান্ডঅ্যালন অ্যাপ মোডে ড্যাশবোর্ড পরিচালনা করছেন।</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-900" />
                  <span>আলাদা অ্যাপ হিসেবে ব্যবহারের সুবিধাসমূহ:</span>
                </p>
                <ul className="space-y-1.5 pl-5 list-disc">
                  <li>সাধারণ ওয়েবসাইট থেকে সম্পূর্ণ আলাদা অ্যাপ আইকন।</li>
                  <li>ব্রাউজার অ্যাড্রেস বার ছাড়াই ফুলস্ক্রিন নেটিভ অ্যাপ ইন্টারফেস।</li>
                  <li>অভিভাবকের রিকোয়েস্ট ও টিউটরদের আবেদন চোখের পলকে যাচাই ও অনুমোদন।</li>
                  <li>গুগল ক্রোম, এজ বা সাফারি ব্রাউজার থেকে সরাসরি ইনস্টলযোগ্য।</li>
                </ul>
              </div>

              {deferredPrompt ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/25 transition-all active:scale-[0.98] cursor-pointer text-sm"
                >
                  <Download className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span>এক ক্লিকে ইনস্টল করুন (Install Now)</span>
                </button>
              ) : isIOS ? (
                <div className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950">
                  <p className="font-bold text-sm flex items-center gap-1 text-amber-900">
                    <Share2 className="w-4 h-4 text-amber-700" />
                    <span>iPhone / iPad এ যেভাবে ইনস্টল করবেন:</span>
                  </p>
                  <ol className="space-y-2 list-decimal pl-5">
                    <li>সাফারি ব্রাউজারের নিচের <strong>Share (শেয়ার 📤)</strong> বাটনে চাপ দিন।</li>
                    <li>মেনুটি স্ক্রোল করে <strong>"Add to Home Screen" (হোম স্ক্রিনে যোগ করুন ➕)</strong> অপশনে চাপ দিন।</li>
                    <li>উপরে ডানদিকের <strong>"Add"</strong> বাটনে চাপ দিলেই আপনার হোমস্ক্রিনে TutorHat Admin অ্যাপ চলে আসবে।</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                  <p className="font-bold text-sm text-slate-900 flex items-center gap-1">
                    <ExternalLink className="w-4 h-4 text-blue-900" />
                    <span>অ্যান্ড্রয়েড বা কম্পিউটারে ব্রাউজার মেনু থেকে ইনস্টল:</span>
                  </p>
                  <p>
                    ব্রাউজারের ওপরের ডানদিকের <strong>তিনটি ডট মেনু (⋮)</strong>-তে ক্লিক করে <strong>"Install TutorHat Admin"</strong> অথবা <strong>"Add to Home Screen"</strong> নির্বাচন করুন।
                  </p>
                </div>
              )}
            </>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ডাইরেক্ট অ্যাপ রুট: <strong className="text-slate-800">/admin</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
