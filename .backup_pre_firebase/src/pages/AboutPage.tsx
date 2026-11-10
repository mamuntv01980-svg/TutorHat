import React from 'react';
import { ShieldCheck, Target, Heart, Award, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';

export const AboutPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'TutorHat সম্পর্কে' : 'About TutorHat'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'বাংলাদেশের প্রতিটি শিক্ষার্থীর মানসম্মত শিক্ষা নিশ্চিত করতে এবং দক্ষ শিক্ষকদের সম্মানের সাথে উপযুক্ত কাজের সুযোগ তৈরি করতে TutorHat অঙ্গীকারাবদ্ধ।'
            : 'TutorHat is built to provide trustworthy, high-caliber private tutoring solutions across Bangladesh while empowering university students with dignified teaching opportunities.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-950">
            {language === 'bn' ? 'আমাদের লক্ষ্য ও উদ্দেশ্য' : 'Empowering Education Across Bangladesh'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'আমাদের লক্ষ্য হলো অভিভাবকদের নির্ভরযোগ্য, যাচাইকৃত ও মানসম্মত শিক্ষক খুঁজে পাওয়ার প্রক্রিয়াকে সম্পূর্ণ নির্ঝঞ্ঝাট করা। আমরা ঢাকা, চট্টগ্রাম, সিলেট সহ সারা দেশে বুয়েট, ঢাকা বিশ্ববিদ্যালয়, মেডিকেল কলেজ এবং শীর্ষ প্রতিষ্ঠানের শিক্ষার্থীদের সাথে শিক্ষার্থীদের সংযোগ তৈরি করি।'
              : 'Our mission is to eliminate uncertainty in private tutoring. By thoroughly vetting tutor credentials and fostering transparent communication, we deliver academic excellence directly to homes and online classrooms.'}
          </p>
        </div>

        <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <h3 className="font-bold text-sm text-blue-950">Why Choose TutorHat:</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Rigorous academic document verification (SSC, HSC, University ID)</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No forced fees: Guardians set their own realistic monthly budget</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free initial demo evaluation session before final commitment</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dedicated phone & WhatsApp support in Bangladesh</span>
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <ShieldCheck className="w-8 h-8 text-blue-700" />
          <h4 className="font-bold text-base text-blue-950">Integrity & Trust</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every tutor profile and tuition circular is vetted by human moderators before publication.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <Heart className="w-8 h-8 text-amber-600" />
          <h4 className="font-bold text-base text-blue-950">Student Centricity</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            We focus on conceptual depth and continuous mentorship rather than rote memorization.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <Award className="w-8 h-8 text-emerald-600" />
          <h4 className="font-bold text-base text-blue-950">Dignity for Tutors</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tutors are empowered with clear schedules, attendance records, performance certificates, and fair pay.
          </p>
        </div>
      </div>

    </div>
  );
};
