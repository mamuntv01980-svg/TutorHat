import React from 'react';
import { Home, Search, Briefcase, PlusCircle, UserCheck } from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { activeView, navigateTo, currentUser, unreadNotifsCount } = useApp();

  const getDashboardTarget = (): AppView => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'tutor') return 'tutor-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    return 'guardian-dashboard';
  };

  const navItems = [
    { label: 'Home', view: 'home' as AppView, icon: Home },
    { label: 'Tutors', view: 'find-tutor' as AppView, icon: Search },
    { label: 'Jobs', view: 'tuition-jobs' as AppView, icon: Briefcase },
    { label: 'Post', view: 'request-tutor' as AppView, icon: PlusCircle, highlight: true },
    { label: currentUser ? 'My Hat' : 'Sign In', view: getDashboardTarget(), icon: UserCheck, hasBadge: unreadNotifsCount > 0 }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto h-14">
        {navItems.map((item) => {
          const isActive = activeView === item.view || (item.view === getDashboardTarget() && activeView.includes('dashboard'));
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigateTo(item.view)}
                className="flex flex-col items-center justify-center -mt-4 group min-h-[44px]"
                aria-label="Post Tuition Request"
              >
                <div className="w-11 h-11 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center shadow-md ring-4 ring-white group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-blue-950 mt-0.5">
                  Request
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigateTo(item.view)}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors relative ${
                isActive ? 'text-blue-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
