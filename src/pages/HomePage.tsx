import React from 'react';
import { 
  Search, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  ArrowRight, 
  Star,
  Users,
  Compass,
  Briefcase,
  Sparkles,
  Calendar,
  MessageSquare,
  Award,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { heroImg, tutorProfileImg } from '../services/store';
import { CallButton } from '../components/common/CallButton';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { TRANSLATIONS } from '../constants/translations';

export const HomePage: React.FC = () => {
  const { storeState, navigateTo, language, settings } = useApp();
  const t = TRANSLATIONS[language];

  // Dynamic real stats from state
  const totalVerifiedTutors = storeState.tutors.filter(tut => tut.verificationStatus === 'verified').length;
  const activeJobs = storeState.jobs.filter(j => j.status === 'published');
  const totalApplications = storeState.applications.length;

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'bn' ? 'বাংলাদেশ-ব্যাপী নির্ভরযোগ্য টিউশন প্ল্যাটফর্ম' : 'Trusted Tuition Platform across Bangladesh'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-blue-950 leading-[1.18] text-balance">
                {language === 'bn'
                  ? 'আপনার এলাকার উপযুক্ত টিউটর/টিউশন খুঁজুন'
                  : 'Find the Right Tutor / Tuition in Your Area'}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {language === 'bn'
                  ? 'সারা বাংলাদেশে স্কুল, কলেজ, বিশ্ববিদ্যালয়, কুরআন, আরবি ও ইংলিশ মিডিয়াম শিক্ষার জন্য বিশ্বস্ত ও ভেরিফাইড শিক্ষকদের সাথে সরাসরি যুক্ত হোন।'
                  : 'Connect with trusted tutors for school, college, university, Quran, Arabic and more across Bangladesh.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="px-6 py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-900/10 flex items-center gap-2 transition-all active:scale-[0.98] min-h-[48px]"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.findTutor}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('become-a-tutor')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-blue-950 font-semibold text-sm border border-slate-300 shadow-xs flex items-center gap-2 transition-all active:scale-[0.98] min-h-[48px]"
                >
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>{t.becomeTutor}</span>
                </button>
              </div>

              {/* Direct Quick Contact Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <CallButton variant="compact" />
                <WhatsAppButton variant="compact" />
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{totalVerifiedTutors} {language === 'bn' ? 'যাচাইকৃত সক্রিয় টিউটর' : 'Verified Active Tutors'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>{activeJobs.length} {language === 'bn' ? 'চলমান টিউশন জব' : 'Live Tuition Circulars'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>{language === 'bn' ? '১০০% ফ্রি রিকোয়েস্ট' : '100% Free Request'}</span>
                </div>
              </div>

            </div>

            {/* Right Educational Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={heroImg}
                  alt="Bangladeshi University Tutor guiding student in Dhaka"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                
                {/* Floating Micro Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-950">
                        {language === 'bn' ? 'মানসম্মত হোম ও অনলাইন শিক্ষা' : 'Qualified Home & Online Mentorship'}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        {language === 'bn' ? 'বুয়েট, ঢাবি, মেডিকেল ও শীর্ষ বিশ্ববিদ্যালয়ের শিক্ষার্থী' : 'Tutors from BUET, DU, Medical & Premier Universities'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR PATH (Role Selection Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
            {language === 'bn' ? 'আপনার পথ বেছে নিন' : 'Choose Your Path'}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {language === 'bn' 
              ? 'আপনি কি গৃহশিক্ষকতা করতে চান নাকি সন্তানের জন্য উপযুক্ত শিক্ষক খুঁজছেন?' 
              : 'Are you seeking tutoring jobs or looking for a qualified tutor for your child?'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Tutor */}
          <div className="rounded-2xl border-2 border-slate-200/80 hover:border-blue-700 bg-white p-7 transition-all hover:shadow-lg group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-950">{t.tutorCardTitle}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'bn'
                    ? 'টিউশনের দারুণ সুযোগ খুঁজছেন? প্রফেশনাল সিভি তৈরি করে কাঙ্ক্ষিত টিউশনে আবেদন করুন।'
                    : 'Looking for tuition opportunities? Build your verified CV and apply to matching jobs.'}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? '১০০% নিরাপদ টিউশন সার্কুলার' : 'Direct verified tuition circulars'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'নিজের সুবিধাজনক এলাকা ও সম্মানীতে আবেদন' : 'Select preferred location and fee'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => navigateTo('become-a-tutor')}
                className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <span>{t.joinAsTutor}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Guardian / Student */}
          <div className="rounded-2xl border-2 border-slate-200/80 hover:border-amber-600 bg-white p-7 transition-all hover:shadow-lg group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-950">{t.guardianCardTitle}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'bn'
                    ? 'সন্তানের উজ্জ্বল ভবিষ্যতের জন্য সঠিক শিক্ষক খুঁজছেন? আপনার বাজেট অনুযায়ী টিউটর রিকোয়েস্ট করুন।'
                    : 'Looking for the right tutor? Post your requirements with your own custom budget.'}
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'অভিভাবকের বাজেট অনুযায়ী শিক্ষক নির্বাচন' : 'Set your own monthly budget'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'ফ্রি ডেমো ক্লাসের সুযোগ' : 'Free initial demo class evaluation'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <span>{t.requestTutor}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TRUST SECTION (Dynamic Real Data) */}
      <section className="bg-slate-50 py-12 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-blue-950 tabular-nums">
                {totalVerifiedTutors}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {language === 'bn' ? 'যাচাইকৃত টিউটর' : 'Verified Tutors'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-blue-950 tabular-nums">
                {activeJobs.length}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {language === 'bn' ? 'লাইভ টিউশন সার্কুলার' : 'Active Tuition Jobs'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-blue-950 tabular-nums">
                12+
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {language === 'bn' ? 'মেট্রোপলিটন জেলা ও এলাকা' : 'Districts & Metro Areas'}
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
                100%
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {language === 'bn' ? 'বিশ্বস্ত কাস্টমার সাপোর্ট' : 'Quality Support'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW TUTORHAT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
            {language === 'bn' ? 'টিউটরহ্যাট যেভাবে কাজ করে' : 'How TutorHat Works'}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {language === 'bn'
              ? 'সহজ ও সুসংগঠিত ধাপে সেরা টিউটর ও টিউশন খুঁজে নেওয়ার নির্ভরযোগ্য প্রক্রিয়া।'
              : 'A transparent, reliable step-by-step process for students and tutors.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* For Guardians */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                ১
              </div>
              <h3 className="text-lg font-bold text-blue-950">
                {language === 'bn' ? 'অভিভাবকদের জন্য' : 'For Guardians / Students'}
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { step: '01', title: language === 'bn' ? 'রিকোয়েস্ট সাবমিট করুন' : 'Submit your requirement', desc: language === 'bn' ? 'শ্রেণি, বিষয়, এলাকা ও আপনার বাজেট উল্লেখ করে ফ্রি ফর্ম পূরণ করুন।' : 'Post your class, subjects, location and custom budget for free.' },
                { step: '02', title: language === 'bn' ? 'উপযুক্ত শিক্ষকদের প্রোফাইল যাচাই' : 'Review suitable tutors', desc: language === 'bn' ? 'আবেদনকারী ভেরিফাইড শিক্ষকদের শিক্ষাগত তথ্য ও অভিজ্ঞতা পর্যালোচনা করুন।' : 'Review verified educational records, qualifications and ratings.' },
                { step: '03', title: language === 'bn' ? 'ডেমো ক্লাস ও পছন্দ নির্বাচন' : 'Select your preferred tutor', desc: language === 'bn' ? 'বিনামূল্যে ডেমো ক্লাস নিয়ে শিক্ষকের পড়ানোর কৌশল যাচাই করুন।' : 'Evaluate teaching methodology via an scheduled demo class.' },
                { step: '04', title: language === 'bn' ? 'নিশ্চিত ও পাঠদান শুরু' : 'Start learning', desc: language === 'bn' ? 'টিউশন নিশ্চিত করে নিয়মিত পড়াশোনা শুরু করুন।' : 'Confirm schedule, days, and begin the learning journey.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'bn' ? 'এখনই টিউটর রিকোয়েস্ট করুন' : 'Request a Tutor Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* For Tutors */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                ২
              </div>
              <h3 className="text-lg font-bold text-blue-950">
                {language === 'bn' ? 'টিউটরদের জন্য' : 'For Tutors'}
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { step: '01', title: language === 'bn' ? 'অ্যাকাউন্ট ও প্রোফাইল তৈরি' : 'Create your profile', desc: language === 'bn' ? 'টিউটর হিসেবে রেজিস্ট্রেশন করে প্রাথমিক তথ্য দিন।' : 'Register as a tutor with your university and contact details.' },
                { step: '02', title: language === 'bn' ? 'সিভি সম্পূর্ণ ও ভেরিফিকেশন' : 'Complete your CV', desc: language === 'bn' ? 'বিশ্ববিদ্যালয়, এসএসসি, এইচএসসি এবং পাঠদানের অভিজ্ঞতা ১০০% পূরণ করুন।' : 'Fill 100% of educational records and submit for admin badge.' },
                { step: '03', title: language === 'bn' ? 'টিউশন জব সার্কুলার ব্রাউজ' : 'Browse tuition jobs', desc: language === 'bn' ? 'আপনার সুবিধাজনক এলাকা ও পছন্দের শ্রেণির টিউশন খুঁজুন।' : 'Filter jobs by nearby area, preferred subject and salary.' },
                { step: '04', title: language === 'bn' ? 'আবেদন ও সিলেকশন' : 'Apply & get selected', desc: language === 'bn' ? 'আবেদন করুন, ডেমো ক্লাসে অংশ নিন এবং টিউশন নিশ্চিত করুন।' : 'Submit application, attend demo class and secure tuition.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigateTo('become-a-tutor')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'bn' ? 'টিউটর রেজিস্ট্রেশন গাইড দেখুন' : 'View Tutor Registration Guide'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Feature 3 Spotlight: Smart Tuition Fee Calculator Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400 text-blue-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্মার্ট টিউশন ফি ক্যালকুলেটর' : 'Smart Fee Calculator'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'bn' ? 'টিউশন ফি কত হওয়া উচিত বুঝতে পারছেন না?' : 'Unsure what tuition fees should be?'}
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              {language === 'bn'
                ? 'শ্রেণি, মাধ্যম (বাংলা/ইংরেজি), এলাকা এবং শিক্ষকের ব্যাকগ্রাউন্ডের ভিত্তিতে বর্তমান বাংলাদেশের সঠিক বাজার রেট জেনে নিন নিমেষেই।'
                : 'Estimate standard market rates instantly based on class, curriculum, subjects, location and tutor background.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('fee-calculator')}
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>{language === 'bn' ? 'ক্যালকুলেটরে হিসাব দেখুন' : 'Calculate Fee Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Feature 4 Spotlight: Free Demo Class Booking & Trial Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-400 text-blue-950 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ফ্রি ডেমো ক্লাস ও ট্রায়াল নিশ্চয়তা' : 'Free Trial Demo Class'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'bn' ? 'শিক্ষক নেওয়ার আগে ১ম ক্লাস সম্পূর্ণ ফ্রি যাচাই করুন!' : 'Try Before You Hire — 1st Class 100% Free!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {language === 'bn'
                ? 'কোনো অগ্রিম ফি বা চুক্তি ছাড়াই আপনার পছন্দের শিক্ষক দিয়ে ১টি ট্রায়াল ক্লাস নিন (বাসায় অথবা অনলাইনে)। পাঠদান ও বোঝানোর স্টাইল পছন্দ হলে তবেই টিউশন চূড়ান্ত করুন।'
                : 'Zero advance risk. Schedule a 1-on-1 free trial session (Home or Online Meet) with any verified tutor before committing to tuition.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigateTo('find-tutor')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'ফ্রি ডেমো টিউটর খুঁজুন' : 'Find Tutors with Free Demo'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('guardian-dashboard')}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'bn' ? 'আমার ডেমো সেশন' : 'My Demo Sessions'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Official Tuition Agreement & Digital Receipts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400 text-blue-950 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডিজিটাল টিউশন চুক্তিপত্র ও কনফার্মেশন স্লিপ' : 'Official Tuition Agreement Slip'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'bn' ? 'নিরাপদ টিউশন নিয়োগের অফিসিয়াল চুক্তি ও ভাউচার' : 'Legal Tuition Agreements & Verified Payment Slips'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'অনুমোদিত টিউশনের জন্য অভিভাবক ও শিক্ষক উভয় পক্ষের স্বাক্ষর, অফিসিয়াল সিল ও কিউআর কোড সংবলিত প্রিন্টযোগ্য চুক্তিপত্র স্লিপ এবং নিয়মিত পেমেন্ট মানি রিসিট।'
                : '100% formal and legally clear. Official downloadable agreement slips featuring verified seals, QR codes, and digital monthly fee vouchers.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigateTo('guardian-dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'bn' ? 'চুক্তিপত্র ড্যাশবোর্ড' : 'View Agreements'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* In-App Direct Chat & Monthly Student Progress Report Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-800/80 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2.5 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-blue-950 text-xs font-black shadow-xs">
              <MessageSquare className="w-3.5 h-3.5 text-blue-950" />
              <span>{language === 'bn' ? 'ইন-অ্যাপ লাইভ চ্যাট ও শিক্ষার্থী প্রগ্রেস কার্ড' : 'In-App Live Chat & Progress Cards'}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === 'bn' 
                ? 'সরাসরি রিয়েল-টাইম চ্যাট এবং মাসিক একাডেমিক প্রগ্রেস রিপোর্ট!' 
                : 'Direct In-App Chat & Monthly Academic Progress Cards!'}
            </h3>
            
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {language === 'bn'
                ? 'অভিভাবক ও শিক্ষক প্ল্যাটফর্মের ভেতরেই নিরাপদ ও সরাসরি মেসেজিং করতে পারবেন। এছাড়াও প্রতি মাসের শেষে শিক্ষার্থীর উপস্থিতি, বাড়ির কাজ, পরীক্ষার নম্বর ও শিক্ষকের মন্তব্যের অফিশিয়াল প্রগ্রেস কার্ড ডাউনলোড ও প্রিন্ট করার সম্পূর্ণ সুবিধা।'
                : 'Communicate safely inside TutorHat with built-in instant chat. Plus, receive monthly student evaluation report cards tracking attendance, study engagement, test performance, and tutor remarks.'}
            </p>

            {/* Feature 6 Bullet Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-indigo-100">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                💬 {language === 'bn' ? 'সরাসরি মেসেজিং' : 'Direct In-App Messaging'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                📊 {language === 'bn' ? 'মাসিক অগ্রগতি কার্ড' : 'Monthly Progress Cards'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 flex items-center gap-1.5 font-medium">
                🎓 {language === 'bn' ? 'একাডেমিক গ্রেডিং ও প্রিন্ট' : 'Printable Evaluation'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto relative z-10">
            <button
              type="button"
              onClick={() => navigateTo('find-tutor')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-blue-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'bn' ? 'শিক্ষকদের সাথে চ্যাট করুন' : 'Chat with Tutors'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('guardian-dashboard')}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'প্রগ্রেস রিপোর্ট কার্ড' : 'Progress Reports'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED TUITION JOBS (Real Database Jobs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
              {t.featuredJobs}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {language === 'bn' ? 'সারাদেশের যাচাইকৃত অভিভাবক কর্তৃক পোস্টকৃত সাম্প্রতিক সার্কুলার' : 'Latest verified circulars posted by guardians'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('tuition-jobs')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200"
          >
            <span>{language === 'bn' ? 'সব টিউশন জব দেখুন' : 'View All Jobs'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">{t.noJobsFound}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn' ? 'শীঘ্রই নতুন টিউশন সার্কুলার যুক্ত হবে।' : 'New circulars will appear here as soon as approved.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {job.id}
                    </span>
                    <span>{job.postedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-blue-950 line-clamp-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Metadata unboxed text */}
                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.area}, {job.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.medium} · {job.classLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.daysPerWeek} {t.daysPerWeek} · {job.teachingType === 'home' ? 'Home' : 'Online'}</span>
                    </div>
                  </div>

                  {/* Subjects list */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.subjects.map((sub) => (
                      <span key={sub} className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t.salary}</span>
                    <span className="text-base font-bold text-blue-950 tabular-nums">
                      {settings.defaultCurrency}{job.salary.toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">{t.perMonth}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('job-detail', { jobId: job.id })}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors"
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {language === 'bn' ? 'সহজ ও নিরাপদ যোগাযোগ' : 'Direct & Safe Communication'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                {language === 'bn'
                  ? 'আপনার প্রয়োজন অনুযায়ী সেরা গৃহশিক্ষক নিশ্চিত করুন'
                  : 'Get the Best Tutor Tailored to Your Specific Curriculum'}
              </h3>
              <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                {language === 'bn'
                  ? 'অভিভাবকরা পাচ্ছেন ফ্রি রিকোয়েস্ট ও ডেমো ক্লাস। টিউটররা পাচ্ছেন নিয়মিত বিশ্বস্ত টিউশন।'
                  : 'Guardians enjoy free tutoring requests and initial demo classes. Tutors access legitimate tuition circulars across Bangladesh.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md active:scale-95"
              >
                {t.requestTutor}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('become-a-tutor')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 text-center transition-all"
              >
                {language === 'bn' ? 'টিউটর প্রোফাইল তৈরি করুন' : 'Create Tutor Profile'}
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
