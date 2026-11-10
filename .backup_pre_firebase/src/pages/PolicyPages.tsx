import React from 'react';
import { useApp } from '../context/AppContext';

export const PrivacyPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-700 leading-relaxed bg-white rounded-3xl border border-slate-200 p-8 my-8 shadow-xs">
      <h1 className="text-2xl font-bold text-blue-950 pb-4 border-b border-slate-100">
        {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
      </h1>

      <p>
        TutorHat values and respects your personal privacy. This Privacy Policy details how we collect, store, protect, and handle data when you use the TutorHat application and services.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">1. Information We Collect</h3>
      <p>
        We collect user information during account registration, profile creation, and tuition requests. For tutors, this includes educational qualifications, phone numbers, and location details. For guardians, this includes contact details and educational requirements.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">2. Phone Number & Privacy Protection</h3>
      <p>
        Personal phone numbers are strictly protected. We do not publish tutors' or guardians' direct contact numbers openly on the internet. Contact numbers are shared solely after an official demo class arrangement or confirmation by platform administration.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">3. Data Security</h3>
      <p>
        All sensitive information is securely handled. We never sell or distribute user information to unauthorized third-party commercial marketing entities.
      </p>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-700 leading-relaxed bg-white rounded-3xl border border-slate-200 p-8 my-8 shadow-xs">
      <h1 className="text-2xl font-bold text-blue-950 pb-4 border-b border-slate-100">
        {language === 'bn' ? 'শর্তাবলী ও নিয়মাবলী (Terms & Conditions)' : 'Terms & Conditions'}
      </h1>

      <p>
        By using the TutorHat platform, you agree to adhere to these Terms & Conditions.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">1. Tutor Responsibilities</h3>
      <p>
        Tutors must provide 100% accurate and genuine educational certificates and identity proof. Providing falsified information will lead to immediate profile suspension and permanent ban.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">2. Guardian Commitments</h3>
      <p>
        Guardians agree to maintain a safe, respectful environment for tutors during home tuition sessions and fulfill agreed monthly remuneration in a timely manner.
      </p>

      <h3 className="text-sm font-bold text-blue-950 pt-2">3. Demo Sessions</h3>
      <p>
        One free demo class is coordinated to ensure compatibility. If both parties agree, a formal confirmation schedule is established on TutorHat.
      </p>
    </div>
  );
};
