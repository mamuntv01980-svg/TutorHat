import React from 'react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksPage: React.FC = () => {
  const { navigateTo, language } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'কীভাবে TutorHat কাজ করে?' : 'How TutorHat Works'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'স্বচ্ছতা, নিরাপত্তা এবং সর্বোচ্চ কোয়ালিটি নিশ্চিত করে আমরা শিক্ষার্থী ও গৃহশিক্ষকের মধ্যে আদর্শ সংযোগ তৈরি করি।'
            : 'Connecting guardians and university educators through a secure, structured 4-step workflow.'}
        </p>
      </div>

      {/* Guardians Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Guardians & Students</span>
            <h2 className="text-xl font-bold text-blue-950">
              {language === 'bn' ? 'অভিভাবকদের জন্য সম্পূর্ণ প্রক্রিয়া' : 'Step-by-Step for Guardians'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Post Requirement', desc: 'Specify subject, class, curriculum, area, and your personal budget.' },
            { num: '02', title: 'Tutor Matching', desc: 'Our platform matches verified university students and sends top CVs.' },
            { num: '03', title: 'Free Demo Class', desc: 'Take a 1-day demo session to evaluate communication and teaching style.' },
            { num: '04', title: 'Confirm & Learn', desc: 'Confirm routine, days, and start regular learning sessions.' }
          ].map((item) => (
            <div key={item.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                STEP {item.num}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => navigateTo('request-tutor')}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'ফ্রি টিউটর রিকোয়েস্ট করুন' : 'Post Tuition Requirement'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tutors Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Tutors & Educators</span>
            <h2 className="text-xl font-bold text-blue-950">
              {language === 'bn' ? 'শিক্ষকদের জন্য সম্পূর্ণ প্রক্রিয়া' : 'Step-by-Step for Tutors'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Create Profile', desc: 'Register with academic credentials and preferred tutoring areas.' },
            { num: '02', title: 'Complete CV 100%', desc: 'Fill university, SSC, HSC and experience to get verified.' },
            { num: '03', title: 'Browse & Apply', desc: 'Filter tuition jobs near you and apply with your expected fee.' },
            { num: '04', title: 'Appointment', desc: 'Conduct successful demo session and secure regular tuition.' }
          ].map((item) => (
            <div key={item.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                STEP {item.num}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => navigateTo('become-a-tutor')}
            className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <span>{language === 'bn' ? 'টিউটর হিসেবে রেজিস্ট্রেশন করুন' : 'Join as Tutor'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
