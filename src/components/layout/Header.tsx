import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  GraduationCap, 
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { store } from '../../services/store';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageToggle } from '../common/LanguageToggle';
import { TRANSLATIONS } from '../../constants/translations';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    navigateTo, 
    language, 
    unreadNotifsCount, 
    logout,
    loginAs
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitchOpen, setRoleSwitchOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const navLinks: { label: string; view: AppView }[] = [
    { label: t.findTutor, view: 'find-tutor' },
    { label: t.tuitionJobs, view: 'tuition-jobs' },
    { label: language === 'bn' ? 'ফি ক্যালকুলেটর' : 'Fee Calculator', view: 'fee-calculator' },
    { label: t.becomeTutor, view: 'become-a-tutor' },
    { label: t.howItWorks, view: 'how-it-works' },
    { label: t.contact, view: 'contact' }
  ];

  const handleNavClick = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const getDashboardView = (): AppView => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'tutor') return 'tutor-dashboard';
    return 'guardian-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark / Crest */}
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
          </div>

          {/* Zone 2: Primary Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  type="button"
                  onClick={() => handleNavClick(link.view)}
                  className={`transition-colors py-1 relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-blue-900 font-semibold'
                      : 'text-slate-600 hover:text-blue-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions & User State */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />

            {/* Quick Demo Role Switcher (Convenient for evaluation) */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setRoleSwitchOpen(!roleSwitchOpen)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
                title="Switch Role for Evaluation"
              >
                <span>Role: <strong className="capitalize text-blue-900">{currentUser?.role || 'Guest'}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleSwitchOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setRoleSwitchOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Role Switch
                  </div>
                  <button
                    type="button"
                    onClick={() => { loginAs('tutor'); setRoleSwitchOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Tutor (Rahim)</span>
                    {currentUser?.role === 'tutor' && <span className="text-blue-600">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => { loginAs('guardian'); setRoleSwitchOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Guardian (Farhana)</span>
                    {currentUser?.role === 'guardian' && <span className="text-blue-600">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="relative">
                <div className="flex items-center gap-1.5">
                  {/* Feature 6: In-App Chat Header Shortcut */}
                  <button
                    type="button"
                    onClick={() => handleNavClick(getDashboardView())}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-blue-900 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                    title={language === 'bn' ? 'ইন-অ্যাপ চ্যাট ও মেসেজ' : 'In-App Messages'}
                  >
                    <MessageSquare className="w-4 h-4 text-blue-900" />
                    {store.getUnreadChatCountForUser(currentUser.id) > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold ring-2 ring-white">
                        {store.getUnreadChatCountForUser(currentUser.id)}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavClick(getDashboardView())}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold border border-blue-200 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-700" />
                    <span className="hidden sm:inline">Dashboard</span>
                    {unreadNotifsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    aria-label="User profile menu"
                  >
                    <UserIcon className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => { handleNavClick(getDashboardView()); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-700" />
                      <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { handleNavClick(getDashboardView()); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-700" />
                      <span>{language === 'bn' ? 'ইন-অ্যাপ চ্যাট মেসেজ' : 'In-App Messages'}</span>
                    </button>

                    {currentUser.role === 'tutor' && (
                      <button
                        type="button"
                        onClick={() => { handleNavClick('tutor-profile-edit'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-700" />
                        <span>{language === 'bn' ? 'আমার সিভি / প্রোফাইল' : 'My CV / Profile'}</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => { handleNavClick('admin-dashboard'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('choose-role')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                >
                  {t.register}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl p-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.view}
                type="button"
                onClick={() => handleNavClick(link.view)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === link.view
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 space-y-2">
            <div className="text-xs font-semibold text-slate-400 px-3 uppercase tracking-wider">
              {language === 'bn' ? 'সরাসরি ভূমিকা নির্বাচন' : 'Switch Persona'}
            </div>
            <div className="grid grid-cols-2 gap-2 px-1">
              <button
                type="button"
                onClick={() => { loginAs('tutor'); setMobileMenuOpen(false); }}
                className={`py-2 text-xs font-medium rounded-lg border text-center ${
                  currentUser?.role === 'tutor'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => { loginAs('guardian'); setMobileMenuOpen(false); }}
                className={`py-2 text-xs font-medium rounded-lg border text-center ${
                  currentUser?.role === 'guardian'
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Guardian
              </button>
            </div>

            {currentUser ? (
              <button
                type="button"
                onClick={() => { handleNavClick(getDashboardView()); setMobileMenuOpen(false); }}
                className="w-full mt-2 py-2.5 px-4 bg-blue-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Go to Dashboard'}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="py-2.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-xl"
                >
                  {t.login}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('choose-role')}
                  className="py-2.5 text-xs font-semibold text-white bg-blue-900 rounded-xl"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
