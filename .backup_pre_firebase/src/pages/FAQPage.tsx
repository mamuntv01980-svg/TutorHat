import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FAQPage: React.FC = () => {
  const { language } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'অভিভাবক হিসেবে কি টিউটর রিকোয়েস্ট করতে কোনো ফি দিতে হয়?',
      a: 'না, TutorHat-এ অভিভাবকদের জন্য টিউটর রিকোয়েস্ট করা সম্পূর্ণ বিনামূল্যে (১০০% ফ্রি)। আপনি নিজের সুবিধাজনক বাজেট উল্লেখ করে ফর্ম জমা দিলে আমরা সেরা শিক্ষকদের প্রোফাইল প্রদান করব।'
    },
    {
      q: 'ডেমো ক্লাস কীভাবে কাজ করে?',
      a: 'অভিভাবক পছন্দের টিউটর শর্টলিস্ট করার পর একটি নির্ধারিত তারিখে ডেমো ক্লাস আয়োজিত হয়। এই ক্লাসে শিক্ষার্থী ও শিক্ষক পরস্পর পরিচিত হন এবং পাঠদান মূল্যায়ন করা হয়। সন্তুষ্ট হলেই নিয়মিত টিউশন নিশ্চিত হয়।'
    },
    {
      q: 'টিউটরদের ভেরিফিকেশন কীভাবে সম্পন্ন হয়?',
      a: 'টিউটরদের জাতীয় পরিচয়পত্র (NID), বিশ্ববিদ্যালয়ের আইডি কার্ড এবং এসএসসি/এইচএসসি সনদের কপি সংগ্রহ করে আমাদের অ্যাডমিন টিম যাচাই করে। তথ্য সঠিক প্রমাণিত হলে প্রোফাইলে ভেরিফাইড ব্যাজ প্রদান করা হয়।'
    },
    {
      q: 'টিউটর হিসেবে কাজ করতে হলে কী যোগ্যতা প্রয়োজন?',
      a: 'যেকোনো পাবলিক বিশ্ববিদ্যালয়, স্বনামধন্য প্রাইভেট বিশ্ববিদ্যালয়, মেডিকেল কলেজ, প্রকৌশল বিশ্ববিদ্যালয় বা জাতীয় বিশ্ববিদ্যালয়ের অধ্যয়নরত অথবা উত্তীর্ণ শিক্ষার্থীরা আবেদন করতে পারেন। কুরআন ও আরবি শিক্ষার ক্ষেত্রে স্বীকৃত কওমি/আলিয়া মাদরাসার উত্তীর্ণরা আবেদন করতে পারেন।'
    },
    {
      q: 'সম্মানী কীভাবে নির্ধারিত হয়?',
      a: 'অভিভাবক নিজেই তার প্রয়োজন ও আর্থিক সামর্থ্য অনুযায়ী বাজেট উল্লেখ করেন। টিউটররা সেই বাজেটের সাথে একমত হলে আবেদন করেন, অথবা নিজস্ব প্রত্যাশিত সম্মানী প্রস্তাব করতে পারেন।'
    },
    {
      q: 'কোনো সমস্যা বা অনাকাঙ্ক্ষিত পরিস্থিতিতে কার সাথে যোগাযোগ করব?',
      a: 'আমাদের কেন্দ্রীয় হেল্পলাইন +8809638284290 অথবা হোয়াটসঅ্যাপ 01752617360 নম্বরে সরাসরি যোগাযোগ করতে পারেন।'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold text-blue-950">
          {language === 'bn' ? 'সাধারণ জিজ্ঞাসাসমূহ (FAQ)' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === 'bn' ? 'TutorHat প্ল্যাটফর্ম সম্পর্কিত জরুরি প্রশ্ন ও উত্তর' : 'Common questions regarding tutor hiring and tuition jobs'}
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-blue-950"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
