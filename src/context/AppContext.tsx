import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TutorProfile, UserRole, SystemSettings } from '../types';
import { store, StoreState } from '../services/store';

export type AppView = 
  | 'home'
  | 'find-tutor'
  | 'tutor-detail'
  | 'tuition-jobs'
  | 'job-detail'
  | 'become-a-tutor'
  | 'request-tutor'
  | 'how-it-works'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'choose-role'
  | 'fee-calculator'
  | 'login'
  | 'register'
  | 'tutor-dashboard'
  | 'tutor-profile-edit'
  | 'tutor-applications'
  | 'tutor-attendance'
  | 'tutor-payments'
  | 'tutor-certificates'
  | 'guardian-dashboard'
  | 'guardian-requests'
  | 'guardian-shortlist'
  | 'admin-dashboard';

interface AppContextType {
  currentUser: User | null;
  activeTutorProfile: TutorProfile | null;
  activeView: AppView;
  selectedTutorId: string | null;
  selectedJobId: string | null;
  language: 'bn' | 'en';
  storeState: StoreState;
  settings: SystemSettings;
  unreadNotifsCount: number;
  navigateTo: (view: AppView, params?: { tutorId?: string; jobId?: string }) => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  loginAs: (role: UserRole, specificUserId?: string) => void;
  logout: () => void;
  toggleShortlist: (tutorId: string) => void;
  isShortlisted: (tutorId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeState, setStoreState] = useState<StoreState>(store.getState());
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = window.location.pathname.toLowerCase();
        const h = window.location.hash.toLowerCase();
        if (p === '/admin' || p.startsWith('/admin/') || h === '#admin') {
          return 'admin-dashboard';
        }
      } catch {}
    }
    return 'home';
  });
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>('tut_01');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('JOB-2026-101');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Synchronize PWA Manifest, Page Title, and URL for Standalone Admin vs Public
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const isNowAdmin = activeView === 'admin-dashboard';
      
      const manifestEl = document.getElementById('app-manifest') as HTMLLinkElement | null;
      const iconEl = document.getElementById('app-icon') as HTMLLinkElement | null;
      const appleIconEl = document.getElementById('app-apple-icon') as HTMLLinkElement | null;
      const appTitleMeta = document.getElementById('app-title-meta') as HTMLMetaElement | null;

      if (isNowAdmin) {
        if (manifestEl) manifestEl.href = '/manifest-admin.json';
        if (iconEl) iconEl.href = '/icon-admin.svg';
        if (appleIconEl) appleIconEl.href = '/icon-admin.svg';
        if (appTitleMeta) appTitleMeta.content = 'TutorHat Admin';
        document.title = 'TutorHat Admin – Management Console';
        if (window.location.pathname !== '/admin') {
          try {
            window.history.replaceState(null, '', '/admin');
          } catch {}
        }
      } else {
        if (manifestEl) manifestEl.href = '/manifest.json';
        if (iconEl) iconEl.href = '/icon.svg';
        if (appleIconEl) appleIconEl.href = '/icon.svg';
        if (appTitleMeta) appTitleMeta.content = 'TutorHat';
        document.title = 'TutorHat – Find Trusted Tutors & Tuition Jobs in Bangladesh';
        if (window.location.pathname === '/admin') {
          try {
            window.history.replaceState(null, '', '/');
          } catch {}
        }
      }
    } catch {}
  }, [activeView]);

  // Support Browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('/admin') || h === '#admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Active logged-in user (persisted in localStorage, defaults to null for new guests)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('tutorhat_active_user_id') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStoreState({ ...store.getState() });
    });
    return unsubscribe;
  }, []);

  const currentUser = currentUserId 
    ? storeState.users.find(u => u.id === currentUserId) || null 
    : null;

  const activeTutorProfile = currentUser && currentUser.role === 'tutor'
    ? storeState.tutors.find(t => t.userId === currentUser.id) || null
    : null;

  const unreadNotifsCount = currentUser
    ? storeState.notifications.filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  const navigateTo = (view: AppView, params?: { tutorId?: string; jobId?: string }) => {
    if (params?.tutorId) setSelectedTutorId(params.tutorId);
    if (params?.jobId) setSelectedJobId(params.jobId);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAs = (role: UserRole, specificUserId?: string) => {
    let targetId = specificUserId;
    if (role === 'admin') {
      const admin = store.ensureAdminUser();
      targetId = specificUserId || admin.id;
    } else if (!targetId) {
      const matched = storeState.users.find(u => u.role === role);
      if (matched) targetId = matched.id;
    }
    if (targetId) {
      setCurrentUserId(targetId);
      try {
        localStorage.setItem('tutorhat_active_user_id', targetId);
      } catch {}
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    try {
      localStorage.removeItem('tutorhat_active_user_id');
    } catch {}
    setActiveView('home');
  };

  const isShortlisted = (tutorId: string): boolean => {
    if (!currentUser) return false;
    return store.isShortlisted(currentUser.id, tutorId);
  };

  const toggleShortlist = (tutorId: string) => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    store.toggleShortlist(currentUser.id, tutorId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTutorProfile,
        activeView,
        selectedTutorId,
        selectedJobId,
        language,
        storeState,
        settings: storeState.settings,
        unreadNotifsCount,
        navigateTo,
        setLanguage,
        loginAs,
        logout,
        toggleShortlist,
        isShortlisted
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
