import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';

export const FloatingChatButton: React.FC = () => {
  const { currentUser, navigateTo, language } = useApp();

  const unreadCount = currentUser ? store.getUnreadChatCountForUser(currentUser.id) : 0;

  const handleClick = () => {
    if (!currentUser) {
      navigateTo('find-tutor');
      return;
    }

    if (currentUser.role === 'admin') {
      navigateTo('admin-dashboard');
    } else if (currentUser.role === 'tutor') {
      navigateTo('tutor-dashboard');
    } else {
      navigateTo('guardian-dashboard');
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 print:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 active:scale-95 cursor-pointer"
        aria-label="Open In-App Direct Chat"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black tracking-tight leading-none text-white flex items-center gap-1">
            <span>{language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span className="text-[9px] text-blue-200/90 leading-tight">
            {language === 'bn' ? 'সরাসরি বার্তা' : 'Direct Message'}
          </span>
        </div>
      </button>
    </div>
  );
};
