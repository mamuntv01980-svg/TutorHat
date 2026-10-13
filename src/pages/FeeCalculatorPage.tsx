import React from 'react';
import { Calculator, Sparkles, HelpCircle, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { TuitionFeeCalculator } from '../components/calculator/TuitionFeeCalculator';
import { useApp } from '../context/AppContext';
import { CallButton } from '../components/common/CallButton';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const FeeCalculatorPage: React.FC = () => {
  const { language, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
          <span>{language === 'bn' ? 'ফিচার ৩ • অফিসিয়াল স্যালারি ও ফি প্রাক্কলন' : 'Feature 3 • Tuition Remuneration Guide'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
          {language === 'bn' ? 'টিউশন ফি ও টিউটর স্যালারি ক্যালকুলেটর' : 'Tuition Fee & Salary Calculator'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'আপনার সন্তানের শ্রেণি, মাধ্যম, পছন্দসই এলাকা ও দিনসংখ্যার ওপর ভিত্তি করে সঠিক ও বাজারসম্মত টিউশন ফি প্রাক্কলন করুন। কোনো লুকানো চার্জ ছাড়াই সরাসরি হিসাব করুন।'
            : 'Estimate standard and fair market tuition fees based on class, curriculum, subjects, location and tutor background in Bangladesh.'}
        </p>
      </div>

      {/* Calculator Core */}
      <TuitionFeeCalculator />

      {/* Market FAQ & Guidelines Section */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">সহায়িকা ও নির্দেশিকা</span>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mt-1">
            বাংলাদেশে টিউশন ফি নির্ধারণ সংক্রান্ত সচরাচর জিজ্ঞাসা
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>টিউশন ফি কীভাবে নির্ধারিত হয়?</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              টিউশন ফি মূলত শিক্ষার্থীর শ্রেণি (Class), পাঠদানের মাধ্যম (Bangla / English / English Medium), সপ্তাহে দিনসংখ্যা, দূরত্ব এবং শিক্ষকের প্রাতিষ্ঠানিক যোগ্যতার ওপর নির্ভর করে নির্ধারিত হয়।
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>ইংলিশ মিডিয়াম ও বাংলা মাধ্যমের ফির পার্থক্য কেন?</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              ইংলিশ মিডিয়ামে ক্যামব্রিজ/এডেক্সেল কারিকুলাম, বিশেষায়িত বইপত্র এবং আন্তর্জাতিক প্রশ্নপদ্ধতির জন্য শিক্ষককে অতিরিক্ত প্রস্তুতি নিতে হয়। তাই সেখানে ফি সাধারণত তুলনামূলক বেশি থাকে।
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>অনলাইন টিউশনে কি খরচ কম হয়?</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              হ্যাঁ, অনলাইন টিউশনে শিক্ষকের যাতায়াত খরচ ও সময় বেঁচে যায়। তাই সাধারণত অফলাইন বা হোম টিউশনের তুলনায় প্রায় ২০% থেকে ২৫% সাশ্রয়ী বাজেটে অনলাইন শিক্ষক পাওয়া যায়।
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>অভিভাবকদের জন্য পরামর্শ কি?</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              শুধুমাত্র কম খরচের দিকে না তাকিয়ে শিক্ষকের সত্যতা ও ভেরিফিকেশন যাচাই করা গুরুত্বপূর্ণ। TutorHat-এ ১০০% ভেরিফাইড শিক্ষকদের প্রোফাইল দেখে ১টি ফ্রি ডেমো ক্লাস নিয়ে শিক্ষক চূড়ান্ত করুন।
            </p>
          </div>
        </div>

        {/* Support Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">সঠিক বাজেট নির্ধারণে সহায়তা প্রয়োজন?</h4>
              <p className="text-slate-500 text-xs">আমাদের কাউন্সিলর দল আপনাকে উপযুক্ত শিক্ষক ও বাজেট নির্বাচনে সরাসরি সহায়তা করবে।</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CallButton variant="compact" />
            <WhatsAppButton variant="compact" />
          </div>
        </div>
      </section>

    </div>
  );
};
