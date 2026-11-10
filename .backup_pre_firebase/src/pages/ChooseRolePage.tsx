import React from 'react';
import { GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';

export const ChooseRolePage: React.FC = () => {
  const { navigateTo, language } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'আপনার ভূমিকা নির্বাচন করুন' : 'Choose Your Role'}
        </h1>
        <p className="text-sm text-slate-600">
          {language === 'bn'
            ? 'TutorHat-এ আপনি কীভাবে যুক্ত হতে চান তা নির্বাচন করুন।'
            : 'Select how you want to join TutorHat to proceed with registration.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        
        {/* Tutor Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-800 p-8 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-950">TUTOR</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {language === 'bn'
                  ? 'আপনি যদি গৃহশিক্ষকতা করতে আগ্রহী হন এবং টিউশনের সুযোগ খুঁজছেন।'
                  : "Select if you're looking for tuition opportunities."}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-500 pt-2">
              <li>✓ Create professional verified CV</li>
              <li>✓ Apply directly to tuition jobs</li>
              <li>✓ Manage schedule, attendance & payments</li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => navigateTo('register')}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <span>{language === 'bn' ? 'টিউটর হিসেবে এগিয়ে যান' : 'Continue as Tutor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Guardian / Student Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-600 p-8 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-950">GUARDIAN / STUDENT</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {language === 'bn'
                  ? 'আপনি যদি নিজের বা সন্তানের জন্য উপযুক্ত গৃহশিক্ষক খুঁজছেন।'
                  : "Select if you're looking for a tutor."}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-500 pt-2">
              <li>✓ Free tuition request submission</li>
              <li>✓ Verified university tutor directory</li>
              <li>✓ Free demo class before confirmation</li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => navigateTo('request-tutor')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <span>{language === 'bn' ? 'অভিভাবক হিসেবে এগিয়ে যান' : 'Continue as Guardian'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
