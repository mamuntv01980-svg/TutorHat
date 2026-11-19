import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TutorProfile, UserRole, SystemSettings, TutorCategoryType } from '../types';
import { store, StoreState } from '../services/store';
import { isAdminSessionValid, getAdminSession, clearAdminSession } from '../services/adminAuth';
import { signOutFirebaseUser } from '../services/userAuth';

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
  | 'register-guardian'
  | 'register-tutor'
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
  editingTutorCategory: TutorCategoryType | null;
  language: 'bn' | 'en';
  storeState: StoreState;
  settings: SystemSettings;
  unreadNotifsCount: number;
  isAdminAuthenticated: boolean;
  navigateTo: (view: AppView, params?: { tutorId?: string; jobId?: string; tutorCategory?: TutorCategoryType }) => void;
  setLanguage: (lang: 'bn' | 'en') => void;
  loginAs: (role: UserRole, specificUserId?: string) => void;
  refreshAdminSession: (adminId?: string) => void;
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
        const storedUserId = localStorage.getItem('tutorhat_active_user_id');
        if (storedUserId) {
          return 'home';
        }
      } catch {}
    }
    return 'choose-role';
  });
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [editingTutorCategory, setEditingTutorCategory] = useState<TutorCategoryType | null>(null);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => isAdminSessionValid());

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

  // Active logged-in user (persisted in localStorage; restores valid Admin session in /admin PWA)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      const storedId = localStorage.getItem('tutorhat_active_user_id') || null;
      const p = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      const h = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      const isAdminRoute = p === '/admin' || p.startsWith('/admin/') || h === '#admin';
      const validSession = getAdminSession();
      if (isAdminRoute && validSession) {
        const admin = store.ensureAdminUser();
        const targetAdminId = validSession.adminId || admin.id;
        localStorage.setItem('tutorhat_active_user_id', targetAdminId);
        return targetAdminId;
      }
      return storedId;
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

  // Keep reactive admin session synchronized across app resume, focus, and storage updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncAdminAuth = () => {
      const session = getAdminSession();
      const valid = Boolean(session);
      setIsAdminAuthenticated(valid);

      if (valid && activeView === 'admin-dashboard') {
        const admin = store.ensureAdminUser();
        const resolvedId =
          store.getState().users.find(u => u.role === 'admin' && u.id === session?.adminId)?.id ||
          admin.id;
        setCurrentUserId(prev => (prev === resolvedId ? prev : resolvedId));
        try {
          localStorage.setItem('tutorhat_active_user_id', resolvedId);
        } catch {}
      }
    };

    syncAdminAuth();
    window.addEventListener('focus', syncAdminAuth);
    window.addEventListener('storage', syncAdminAuth);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncAdminAuth();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', syncAdminAuth);
      window.removeEventListener('storage', syncAdminAuth);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [activeView]);

  const resolvedUser = currentUserId
    ? storeState.users.find(u => u.id === currentUserId) || null
    : null;

  // Fallback: if admin session is actively valid on /admin and Firestore users synced, resolve admin cleanly
  const currentUser =
    resolvedUser ||
    (activeView === 'admin-dashboard' && isAdminAuthenticated
      ? storeState.users.find(u => u.role === 'admin') || null
      : null);

  const activeTutorProfile = currentUser && currentUser.role === 'tutor'
    ? storeState.tutors.find(t => t.userId === currentUser.id) || null
    : null;

  const unreadNotifsCount = currentUser
    ? storeState.notifications.filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  const navigateTo = (view: AppView, params?: { tutorId?: string; jobId?: string; tutorCategory?: TutorCategoryType }) => {
    if (params?.tutorId) setSelectedTutorId(params.tutorId);
    if (params?.jobId) setSelectedJobId(params.jobId);
    if (params?.tutorCategory) setEditingTutorCategory(params.tutorCategory);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshAdminSession = (adminId?: string) => {
    const valid = isAdminSessionValid();
    setIsAdminAuthenticated(valid);
    if (!valid) return;

    const admin = store.ensureAdminUser();
    const users = store.getState().users;
    const matched =
      (adminId ? users.find(u => u.role === 'admin' && u.id === adminId) : null) ||
      users.find(u => u.role === 'admin') ||
      admin;

    if (matched?.id) {
      setCurrentUserId(matched.id);
      try {
        localStorage.setItem('tutorhat_active_user_id', matched.id);
      } catch {}
    }
  };

  const loginAs = (role: UserRole, specificUserId?: string) => {
    let targetId = specificUserId;
    if (role === 'admin') {
      // Security barrier: admin role can ONLY be activated after verified AdminAuthBarrier session
      if (!isAdminSessionValid()) {
        setIsAdminAuthenticated(false);
        return;
      }
      setIsAdminAuthenticated(true);
      const admin = store.ensureAdminUser();
      const users = store.getState().users;
      const validSpecific = specificUserId
        ? users.find(u => u.role === 'admin' && u.id === specificUserId)
        : null;
      targetId = validSpecific?.id || admin.id;
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
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('tutorhat_active_user_id');
    } catch {}
    clearAdminSession();
    signOutFirebaseUser().catch(() => {});
    setActiveView('choose-role');
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
        editingTutorCategory,
        language,
        storeState,
        settings: storeState.settings,
        unreadNotifsCount,
        isAdminAuthenticated,
        navigateTo,
        setLanguage,
        loginAs,
        refreshAdminSession,
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
