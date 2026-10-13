/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NoticeBanner } from './components/common/NoticeBanner';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { FindTutorPage } from './pages/FindTutorPage';
import { TutorDetailPage } from './pages/TutorDetailPage';
import { TuitionJobsPage } from './pages/TuitionJobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { BecomeTutorPage } from './pages/BecomeTutorPage';
import { RequestTutorPage } from './pages/RequestTutorPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage, TermsPage } from './pages/PolicyPages';
import { ChooseRolePage } from './pages/ChooseRolePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FeeCalculatorPage } from './pages/FeeCalculatorPage';
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorProfileEdit } from './pages/tutor/TutorProfileEdit';
import { GuardianDashboard } from './pages/guardian/GuardianDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'find-tutor':
        return <FindTutorPage />;
      case 'tutor-detail':
        return <TutorDetailPage />;
      case 'tuition-jobs':
        return <TuitionJobsPage />;
      case 'job-detail':
        return <JobDetailPage />;
      case 'become-a-tutor':
        return <BecomeTutorPage />;
      case 'request-tutor':
        return <RequestTutorPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FAQPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'choose-role':
        return <ChooseRolePage />;
      case 'fee-calculator':
        return <FeeCalculatorPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'tutor-dashboard':
        return <TutorDashboard />;
      case 'tutor-profile-edit':
        return <TutorProfileEdit />;
      case 'guardian-dashboard':
        return <GuardianDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
      <NoticeBanner />
      <Header />
      
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />
      <BottomNavigation />
      
      {/* Floating WhatsApp Quick Action Button for Mobile & Desktop */}
      <WhatsAppButton variant="floating" showIcon={true} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
