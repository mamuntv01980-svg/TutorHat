import React from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Award, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CallButton } from '../components/common/CallButton';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { tutorProfileImg } from '../services/store';

export const BecomeTutorPage: React.FC = () => {
  const { navigateTo, language } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-blue-700" />
          <span>{language === 'bn' ? 'বিশ্ববিদ্যালয় শিক্ষার্থী ও শিক্ষকদের জন্য' : 'For University Students & Educators'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'TutorHat-এ সম্মানিত শিক্ষক হিসেবে যুক্ত হোন' : 'Become a Respected Tutor on TutorHat'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'আপনার মেধা ও জ্ঞানকে কাজে লাগিয়ে উপযুক্ত সম্মানীর নির্ভরযোগ্য টিউশন পান। একটি পেশাদার সিভি তৈরি করুন এবং সরাসরি যাচাইকৃত সার্কুলারে আবেদন করুন।'
            : 'Turn your academic knowledge into a rewarding tutoring career. Create a verified CV, apply to legitimate tuition circulars, and earn with dignity.'}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="px-6 py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'টিউটর হিসেবে রেজিস্ট্রেশন করুন' : 'Register as a Tutor'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => navigateTo('tuition-jobs')}
            className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            {language === 'bn' ? 'টিউশন জব বোর্ড দেখুন' : 'Explore Tuition Jobs'}
          </button>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-blue-950">
            {language === 'bn' ? '১০০% যাচাইকৃত সার্কুলার' : '100% Genuine Jobs'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'প্রতিটি টিউশন সরাসরি আমাদের টিম অভিভাবকের সাথে ভেরিফাই করে। কোনো ফেক বা ভুয়া বিজ্ঞপ্তি নেই।'
              : 'Every single circular is directly verified with guardians by our operations team before posting.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-blue-950">
            {language === 'bn' ? 'ভেরিফাইড ব্যাজ ও গ্রহণযোগ্যতা' : 'Verified Badge & Recognition'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? '১০০% সিভি পূর্ণ করে অ্যাডমিন ভেরিফিকেশন লাভ করুন এবং অভিভাবকদের প্রথম পছন্দে পরিণত হোন।'
              : 'Complete 100% of your CV to get the official Verified Tutor badge and direct guardian proposals.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-blue-950">
            {language === 'bn' ? 'পছন্দের সময় ও এলাকা' : 'Flexible Hours & Location'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'আপনার নিজের সুবিধা অনুযায়ী ক্লাসের দিন, সময় ও বাসা থেকে নিকটবর্তী এলাকা নির্বাচন করুন।'
              : 'Set your preferred days, times, and tutoring areas near your university or home.'}
          </p>
        </div>

      </div>

      {/* Steps to Become Tutor */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/80 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-950">
            {language === 'bn' ? 'টিউটর হিসেবে সফল হওয়ার ৪টি ধাপ' : '4 Simple Steps to Success'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {language === 'bn' ? 'সহজ ও স্পষ্ট ধাপে টিউশন নিশ্চিত করুন' : 'From registration to your first confirmed tuition'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: language === 'bn' ? 'ফ্রি সাইন আপ' : 'Free Registration', desc: language === 'bn' ? 'মোবাইল নম্বর ও ইমেইল দিয়ে কয়েক সেকেন্ডে অ্যাকাউন্ট খুলুন।' : 'Sign up with mobile and basic credentials.' },
            { step: '02', title: language === 'bn' ? '১০০% সিভি পূরণ' : 'Complete 100% CV', desc: language === 'bn' ? 'বিশ্ববিদ্যালয়, এসএসসি, এইচএসসি এবং পাঠদানের অভিজ্ঞতা পূরণ করুন।' : 'Add degree, institution, SSC, HSC and subjects.' },
            { step: '03', title: language === 'bn' ? 'জবে আবেদন' : 'Apply to Jobs', desc: language === 'bn' ? 'লাইভ জব বোর্ড থেকে আপনার এলাকার সার্কুলারে সরাসরি আবেদন করুন।' : 'Browse live circulars and submit applications.' },
            { step: '04', title: language === 'bn' ? 'ডেমো ও টিউশন শুরু' : 'Demo & Appointed', desc: language === 'bn' ? 'বিনামূল্যে একটি ডেমো ক্লাস নিয়ে টিউশন কনফার্ম করুন।' : 'Conduct the demo class and start teaching with dignity.' }
          ].map((item) => (
            <div key={item.step} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                STEP {item.step}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md"
          >
            {language === 'bn' ? 'এখনই আবেদন শুরু করুন' : 'Start Application Now'}
          </button>
        </div>
      </div>

      {/* Support Strip */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-blue-950">
            {language === 'bn' ? 'কোনো জিজ্ঞাসা বা সমস্যার মুখোমুখি হচ্ছেন?' : 'Have Questions About Tutor Registration?'}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bn' ? 'আমাদের হেল্পলাইনে সরাসরি কল বা হোয়াটসঅ্যাপে বার্তা পাঠান।' : 'Reach out directly to our tutor support team via phone or WhatsApp.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CallButton variant="compact" />
          <WhatsAppButton variant="compact" />
        </div>
      </div>

    </div>
  );
};
