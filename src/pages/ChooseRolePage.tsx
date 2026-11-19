import React from 'react';
import { GraduationCap, Users, ArrowRight, LogIn, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const ChooseRolePage: React.FC = () => {
  const { navigateTo, language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <BrandLogo size="lg" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>{language === 'bn' ? 'নিরাপদ ও যাচাইকৃত টিউশন প্ল্যাটফর্ম' : 'Trusted & Verified Tuition Platform'}</span>
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'TutorHat-এ স্বাগতম — আপনার ভূমিকা নির্বাচন করুন' : 'Welcome to TutorHat — Choose How to Join'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {language === 'bn'
            ? 'মাত্র ৩টি তথ্য (Gmail বা মোবাইল নম্বর এবং পাসওয়ার্ড) দিয়ে কয়েক সেকেন্ডে আপনার অ্যাকাউন্ট তৈরি করে সরাসরি ড্যাশবোর্ডে প্রবেশ করুন।'
            : 'Create your account in seconds with just Gmail or Mobile Number and Password, and step straight into your dashboard.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
        {/* Become a Guardian */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-600 p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {language === 'bn' ? 'অভিভাবক / শিক্ষার্থী' : 'Parent / Student'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mt-2">
                Become a Guardian
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {language === 'bn'
                  ? 'আপনার সন্তানের জন্য বিশ্বস্ত ও ভেরিফাইড গৃহশিক্ষক খুঁজতে অভিভাবক অ্যাকাউন্ট খুলুন।'
                  : 'Create a Guardian account to find trusted university or madrasa tutors and manage tuitions.'}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 pt-2">
              <li>✓ {language === 'bn' ? 'প্রথমে শুধু Gmail/মোবাইল ও পাসওয়ার্ড' : 'Sign up with only Gmail/Mobile & Password'}</li>
              <li>✓ {language === 'bn' ? 'সরাসরি Guardian Dashboard-এ প্রবেশ' : 'Direct access to Guardian Dashboard'}</li>
              <li>✓ {language === 'bn' ? 'ধাপে ধাপে প্রোফাইল ও টিউশন রিকোয়েস্ট' : 'Step-by-step profile & free tutor requests'}</li>
            </ul>
          </div>

          <div className="pt-7">
            <button
              type="button"
              onClick={() => navigateTo('register-guardian')}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer shadow-xs"
            >
              <span>Become a Guardian</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Become a Tutor */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-800 p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {language === 'bn' ? 'শিক্ষক / টিউটর' : 'Educator / Tutor'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mt-2">
                Become a Tutor
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {language === 'bn'
                  ? 'টিউশন খুঁজতে এবং নিজের ভেরিফাইড সিভি তৈরি করতে টিউটর অ্যাকাউন্ট খুলুন।'
                  : 'Create a Tutor account to apply to verified tuition circulars and build your CV inside your dashboard.'}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 pt-2">
              <li>✓ {language === 'bn' ? 'প্রথমে শুধু Gmail/মোবাইল ও পাসওয়ার্ড' : 'Sign up with only Gmail/Mobile & Password'}</li>
              <li>✓ {language === 'bn' ? 'সরাসরি Tutor Dashboard-এ প্রবেশ' : 'Direct access to Tutor Dashboard'}</li>
              <li>✓ {language === 'bn' ? 'ড্যাশবোর্ড থেকে ধাপে ধাপে CV (0–100%)' : 'Build photo & verified CV step-by-step (0–100%)'}</li>
            </ul>
          </div>

          <div className="pt-7">
            <button
              type="button"
              onClick={() => navigateTo('register-tutor')}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] cursor-pointer shadow-xs"
            >
              <span>Become a Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Actions: Login or Browse Public Site */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs">
        <button
          type="button"
          onClick={() => navigateTo('login')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-blue-900" />
          <span>{language === 'bn' ? 'আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Sign In'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <Globe className="w-4 h-4 text-slate-600" />
          <span>{language === 'bn' ? 'ওয়েবসাইট ও জব বোর্ড দেখুন' : 'Explore Website & Jobs'}</span>
        </button>
      </div>
    </div>
  );
};
