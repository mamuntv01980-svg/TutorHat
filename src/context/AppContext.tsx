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
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>('tut_01');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('JOB-2026-101');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Default logged-in user: Let's start with a tutor for easy demonstration, or let users choose
  const [currentUserId, setCurrentUserId] = useState<string | null>('user_tutor_01');

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
    if (specificUserId) {
      setCurrentUserId(specificUserId);
      return;
    }
    const matched = storeState.users.find(u => u.role === role);
    if (matched) {
      setCurrentUserId(matched.id);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
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
