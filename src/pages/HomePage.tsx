import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  Calculator, 
  Calendar, 
  FileText, 
  MessageSquare,
  School,
  ChevronRight,
  Sparkles,
  Users,
  CheckCircle2,
  Star,
  Award,
  Shield,
  Building,
  UserCheck,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { heroImg } from '../services/store';
import { CallButton } from '../components/common/CallButton';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { TRANSLATIONS } from '../constants/translations';
import { BD_DISTRICTS } from '../constants/bangladeshData';

export const HomePage: React.FC = () => {
  const { storeState, navigateTo, language } = useApp();
  const t = TRANSLATIONS[language];

  // Dynamic real metrics from store
  const totalVerifiedTutors = storeState.tutors.filter(tut => tut.verificationStatus === 'verified').length;
  const activeJobs = storeState.jobs.filter(j => j.status === 'published');

  // Interactive Caretutors-style Hero Quick Search State
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Dual perspective tab (Parents vs Tutors)
  const [activeAudienceTab, setActiveAudienceTab] = useState<'guardians' | 'tutors'>('guardians');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to find-tutor directory
    navigateTo('find-tutor');
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-12">
      
      {/* 1. TOP HERO & CARETUTORS-STYLE INTERACTIVE SEARCH ENGINE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/90 via-slate-50 to-white pt-5 pb-7 sm:pt-9 sm:pb-11 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Value Proposition & Fast Helpline */}
            <div className="lg:col-span-7 space-y-3.5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'bn' ? 'বাংলাদেশব্যাপী বিশ্বস্ত টিউশন প্ল্যাটফর্ম' : 'Trusted Tuition Platform across Bangladesh'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-blue-950 leading-[1.2] text-balance">
                {language === 'bn'
                  ? 'আপনার এলাকার সেরা ও বিশ্বস্ত গৃহশিক্ষক খুঁজে নিন'
                  : 'Find the Best & Trusted Tutors in Your Area'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'ঢাকা, চট্টগ্রামসহ দেশের ৬৪ জেলায় বাংলা ও ইংলিশ মিডিয়াম, মাদরাসা, কুরআন শিক্ষা ও ভর্তি পরীক্ষার জন্য বুয়েট, ঢাবি ও মেডিকেল শিক্ষকদের সরাসরি সংযোগ।'
                  : 'Connect with verified tutors from BUET, DU, Medical and top institutions across all 64 districts.'}
              </p>

              {/* Direct Quick Helpline */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">{language === 'bn' ? 'সরাসরি হেল্পলাইন:' : 'Helpline:'}</span>
                <CallButton variant="compact" />
                <WhatsAppButton variant="compact" />
              </div>

            </div>

            {/* Right Educational Visual (Compact Credibility Card) */}
            <div className="lg:col-span-5 relative hidden sm:block">
              <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-white aspect-[16/10] bg-slate-100">
                <img
                  src={heroImg}
                  alt="TutorHat Tutoring in Bangladesh"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-xs border border-white/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-950 leading-tight">
                        {language === 'bn' ? '১০০% এনআইডি ও সনদ ভেরিফাইড' : '100% Verified Tutors'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {language === 'bn' ? 'বুয়েট, ঢাবি, মেডিকেল ও পাবলিক বিশ্ববিদ্যালয়' : 'BUET, DU, Medical & Premier Universities'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {language === 'bn' ? 'নিরাপদ' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* CARETUTORS-STYLE INTERACTIVE HERO QUICK SEARCH WIDGET */}
          <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-white shadow-md border border-blue-200/90">
            <div className="text-xs font-bold text-blue-950 mb-2.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-900" />
              <span>{language === 'bn' ? 'তাত্ক্ষণিক টিউটর ম্যাচিং ফিল্টার' : 'Instant Tutor Matching Filter'}</span>
            </div>

            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Medium Selection */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  {language === 'bn' ? 'শিক্ষামাধ্যম' : 'Medium'}
                </label>
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">{language === 'bn' ? 'সকল মাধ্যম' : 'All Mediums'}</option>
                  <option value="Bangla Medium">{language === 'bn' ? 'বাংলা মাধ্যম' : 'Bangla Medium'}</option>
                  <option value="English Version">{language === 'bn' ? 'ইংলিশ ভার্সন' : 'English Version'}</option>
                  <option value="English Medium">{language === 'bn' ? 'ইংলিশ মিডিয়াম (Cambridge/Edexcel)' : 'English Medium'}</option>
                  <option value="Madrasa">{language === 'bn' ? 'মাদরাসা ও ইসলামিক কারিকুলাম' : 'Madrasah Curriculum'}</option>
                  <option value="Quran">{language === 'bn' ? 'কুরআন শিক্ষা ও হিফজ' : 'Quran & Hifz'}</option>
                  <option value="Admission">{language === 'bn' ? 'ভর্তি পরীক্ষা প্রস্তুতি (বুয়েট/মেডিকেল/ঢাবি)' : 'Admission Test Prep'}</option>
                </select>
              </div>

              {/* Class Selection */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  {language === 'bn' ? 'শ্রেণি / লেভেল' : 'Class / Level'}
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">{language === 'bn' ? 'সকল শ্রেণি' : 'All Classes'}</option>
                  <option value="primary">{language === 'bn' ? 'প্লে - ৫ম শ্রেণি' : 'Play to Class 5'}</option>
                  <option value="middle">{language === 'bn' ? '৬ষ্ঠ - ৮ম শ্রেণি' : 'Class 6 to Class 8'}</option>
                  <option value="ssc">{language === 'bn' ? '৯ম - ১০ম শ্রেণি / SSC / O-Level' : 'Class 9-10 / SSC / O-Level'}</option>
                  <option value="hsc">{language === 'bn' ? 'একাদশ - দ্বাদশ / HSC / A-Level' : 'Class 11-12 / HSC / A-Level'}</option>
                  <option value="quran">{language === 'bn' ? 'কুরআন তিলাওয়াত ও তাজবিদ' : 'Quran & Tajweed'}</option>
                  <option value="hifz">{language === 'bn' ? 'হিফজুল কুরআন' : 'Hifz-ul-Quran'}</option>
                </select>
              </div>

              {/* District Selection */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                  {language === 'bn' ? 'জেলা / এলাকা' : 'District / Area'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">{language === 'bn' ? 'সারাদেশ (৬৪ জেলা)' : 'All 64 Districts'}</option>
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Barishal">Barishal (বরিশাল)</option>
                  <option value="Rangpur">Rangpur (রংপুর)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  <option value="Cumilla">Cumilla (কুমিল্লা)</option>
                  <option value="Gazipur">Gazipur (গাজীপুর)</option>
                  <option value="Narayanganj">Narayanganj (নারায়ণগঞ্জ)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'টিউটর খুঁজুন' : 'Find Tutor'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('request-tutor')}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পোস্ট টিউশন' : 'Post'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* 2. TOP PRIORITY 4-ACTION GRID (Find Tutor, Post Tuition, Tuition Jobs, Arabic & Quran) */}
          <div className="mt-5 pt-4 border-t border-slate-200/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Action 1: Find Tutor (টিউটর খুঁজুন) */}
              <button
                type="button"
                onClick={() => navigateTo('find-tutor')}
                className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white shadow-md shadow-blue-900/15 transition-all active:scale-[0.98] text-left cursor-pointer border border-blue-800"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-amber-300 flex items-center justify-center transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                    {language === 'bn' ? '১. টিউটর খুঁজুন' : '1. Find Tutor'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-blue-100/90 mt-0.5 sm:mt-1 line-clamp-1">
                    {language === 'bn' ? 'ভেরিফাইড শিক্ষক তালিকা' : 'Browse verified tutors'}
                  </p>
                </div>
              </button>

              {/* Action 2: Post Tuition Requirement (পোস্ট টিউশন / টিউটর রিকোয়েস্ট) */}
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] text-left cursor-pointer border border-amber-400"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/10 group-hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition-colors">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-950/50 group-hover:text-slate-950 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-black text-slate-950 leading-tight">
                    {language === 'bn' ? '২. পোস্ট টিউশন' : '2. Post Tuition'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-800 mt-0.5 sm:mt-1 line-clamp-1">
                    {language === 'bn' ? '১০০% ফ্রি চাহিদা ফর্ম' : 'Request tutor with budget'}
                  </p>
                </div>
              </button>

              {/* Action 3: Tuition Jobs Board (টিউশন জব বোর্ড) - Approved jobs live here exclusively */}
              <button
                type="button"
                onClick={() => navigateTo('tuition-jobs')}
                className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15 transition-all active:scale-[0.98] text-left cursor-pointer border border-emerald-500"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">
                    {activeJobs.length} {language === 'bn' ? 'লাইভ' : 'Live'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                    {language === 'bn' ? '৩. টিউশন জবস' : '3. Tuition Jobs'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-emerald-100 mt-0.5 sm:mt-1 line-clamp-1">
                    {language === 'bn' ? 'লাইভ সার্কুলার ও আবেদন' : 'View all active circulars'}
                  </p>
                </div>
              </button>

              {/* Action 4: Arabic & Quran Tutor (আরবি ও কুরআন শিক্ষক) */}
              <button
                type="button"
                onClick={() => navigateTo('find-tutor')}
                className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white shadow-md shadow-purple-900/15 transition-all active:scale-[0.98] text-left cursor-pointer border border-purple-800"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-amber-300 flex items-center justify-center transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-white leading-tight">
                    {language === 'bn' ? '৪. আরবি ও কুরআন' : '4. Quran & Arabic'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-purple-200 mt-0.5 sm:mt-1 line-clamp-1">
                    {language === 'bn' ? 'হিফজ, তাজবিদ ও দ্বীনি শিক্ষা' : 'Quran recitation & Tajweed'}
                  </p>
                </div>
              </button>

            </div>

            {/* 3. INTEGRATED 4 MICRO-TOOLS BAR (Right below the 4 main buttons) */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/70">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Micro Tool 1: Fee Calculator */}
                <button
                  type="button"
                  onClick={() => navigateTo('fee-calculator')}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white hover:bg-blue-50/70 border border-slate-200 shadow-2xs hover:border-blue-300 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-blue-950 truncate leading-none">
                      {language === 'bn' ? 'ফি ক্যালকুলেটর' : 'Fee Calculator'}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">
                      {language === 'bn' ? 'বর্তমান রেট হিসাব' : 'Estimate rate'}
                    </p>
                  </div>
                </button>

                {/* Micro Tool 2: Free Demo Class */}
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-blue-950 truncate leading-none">
                      {language === 'bn' ? 'ফ্রি ট্রায়াল ডেমো' : 'Free Demo Class'}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">
                      {language === 'bn' ? '১ম ক্লাস যাচাই' : '1st class trial'}
                    </p>
                  </div>
                </button>

                {/* Micro Tool 3: Digital Agreement Slip */}
                <button
                  type="button"
                  onClick={() => navigateTo('guardian-dashboard')}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white hover:bg-amber-50/70 border border-slate-200 shadow-2xs hover:border-amber-300 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-blue-950 truncate leading-none">
                      {language === 'bn' ? 'অফিসিয়াল চুক্তিপত্র' : 'Agreement Slip'}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">
                      {language === 'bn' ? 'নিরাপদ ভাউচার' : 'Digital voucher'}
                    </p>
                  </div>
                </button>

                {/* Micro Tool 4: Direct Chat & Progress */}
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white hover:bg-purple-50/70 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-50 group-hover:bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-blue-950 truncate leading-none">
                      {language === 'bn' ? 'চ্যাট ও প্রগ্রেস' : 'Chat & Progress'}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">
                      {language === 'bn' ? 'মেসেজ ও রিপোর্ট' : 'Live messaging'}
                    </p>
                  </div>
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. TOP UNIVERSITY & INSTITUTION CREDIBILITY RIBBON (Caretutors Signature Trust) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-950 uppercase tracking-wide">
                <GraduationCap className="w-4 h-4 text-blue-900" />
                <span>{language === 'bn' ? 'শীর্ষ বিশ্ববিদ্যালয়ের মেধাবী ও ভেরিফাইড শিক্ষক নেটওয়ার্ক' : 'Premier University Verified Tutor Network'}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? 'সকল শিক্ষকের জাতীয় পরিচয়পত্র ও অ্যাকাডেমিক পরিচয় যাচাইকৃত' : 'All tutors verified via NID & Academic ID cards'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                {language === 'bn' ? '১০০% ব্যাকগ্রাউন্ড চেক' : '100% Background Checked'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
            {[
              { name: 'BUET', label: language === 'bn' ? 'বুয়েট' : 'BUET', tag: language === 'bn' ? 'ইঞ্জিনিয়ারিং' : 'Engineering' },
              { name: 'Dhaka University', label: language === 'bn' ? 'ঢাকা বিশ্ববিদ্যালয়' : 'Dhaka Univ', tag: language === 'bn' ? 'বিজ্ঞান ও কলা' : 'Science & Arts' },
              { name: 'Medical Colleges', label: language === 'bn' ? 'মেডিকেল কলেজ' : 'DMC & Medical', tag: language === 'bn' ? 'বায়োলজি ও চিকিৎসা' : 'Medical Prep' },
              { name: 'RUET / CUET / KUET', label: language === 'bn' ? 'প্রকৌশল বিশ্ববিদ্যালয়' : 'Tech Universities', tag: language === 'bn' ? 'গণিত ও পদার্থ' : 'Math & Physics' },
              { name: 'Jahangirnagar Univ', label: language === 'bn' ? 'জাহাঙ্গীরনগর' : 'JU & Public', tag: language === 'bn' ? 'মানবিক ও কমার্স' : 'Commerce/Hum' },
              { name: 'Madrasah & Hifz', label: language === 'bn' ? 'শীর্ষ মাদরাসা' : 'Madrasah & Hifz', tag: language === 'bn' ? 'হিফজ ও তাজবিদ' : 'Islamic Studies' }
            ].map((uni, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-center"
              >
                <div className="text-xs font-black text-blue-950 truncate">{uni.label}</div>
                <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{uni.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL VALUE PROPOSITION: GUARDIANS VS TUTORS (Caretutors Benchmark Feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-blue-950">
                {language === 'bn' ? 'কেন টিউটরহ্যাট বেছে নেবেন?' : 'Why Choose TutorHat?'}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? 'অভিভাবক ও শিক্ষকদের জন্য স্বচ্ছ ও নির্ভরযোগ্য সেবা' : 'Transparent, reliable experience for both parents & tutors'}
              </p>
            </div>

            {/* Audience Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveAudienceTab('guardians')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeAudienceTab === 'guardians'
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'অভিভাবকদের জন্য' : 'For Guardians'}
              </button>
              <button
                type="button"
                onClick={() => setActiveAudienceTab('tutors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeAudienceTab === 'tutors'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'bn' ? 'শিক্ষকদের জন্য' : 'For Tutors'}
              </button>
            </div>
          </div>

          {activeAudienceTab === 'guardians' ? (
            /* GUARDIANS VALUE PROPOSITION */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? '০% প্ল্যাটফর্ম ফি (সম্পূর্ণ ফ্রি)' : '0% Platform Fee for Parents'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'অভিভাবকদের জন্য টিউটর রিকোয়েস্ট ও শিক্ষক চূড়ান্তকরণ একদম বিনামূল্যে।' : 'Free tutor matching service with no hidden charge for parents.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? '১ম ক্লাস ফ্রি ট্রায়াল ডেমো' : '1st Trial Class Free Demo'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'শিক্ষক নিয়োগের পূর্বে প্রথম ক্লাস দেখে নিশ্চিত হওয়ার পূর্ণ সুবিধা।' : 'Assess tutor capability with a complimentary first trial session.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'সহজে শিক্ষক পরিবর্তনের নিশ্চয়তা' : 'Tutor Replacement Guarantee'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'যেকোনো সময় শিক্ষক পরিবর্তনে দ্রুত বিকল্প অভিজ্ঞ শিক্ষক প্রদান করা হয়।' : 'Swift replacement support if student needs change anytime.'}
                </p>
              </div>

            </div>
          ) : (
            /* TUTORS VALUE PROPOSITION */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'পছন্দের এলাকায় ১০০% লাইভ সার্কুলার' : 'Targeted Local Circulars'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'আপনার বাসা বা ভার্সিটি সংলগ্ন এলাকা অনুযায়ী রিয়েল-টাইম সার্কুলার।' : 'Instant circulars around your campus or residential neighborhood.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'ডিজিটাল প্রোফাইল ও টিউটর আইডি' : 'Digital CV & Tutor ID Badge'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'প্রফেশনাল ডিজিটাল প্রোফাইল দিয়ে সেরা টিউশন পাওয়ার সর্বোচ্চ সুযোগ।' : 'Verified badge to elevate credibility and tutor hiring rate.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs mb-2.5">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'অফিসিয়াল চুক্তিপত্র ও সম্মানীর সুরক্ষা' : 'Payment Security & Slip'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {language === 'bn' ? 'ডিজিটাল ভাউচার ও চুক্তিপত্র মাধ্যমে নিয়মিত ও সুরক্ষিত সম্মানী নিশ্চিত।' : 'Transparent agreement slips for on-time honorarium.'}
                </p>
              </div>

            </div>
          )}

          {/* Quick Dual Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'bn'
                ? activeAudienceTab === 'guardians'
                  ? 'আপনার সন্তানের জন্য কোনো চার্জ ছাড়াই শিক্ষক রিকোয়েস্ট করুন।'
                  : 'টিউশন জব সার্কুলার দেখতে জব বোর্ডে ভিজিট করুন।'
                : 'Free tutor assistance for parents. Verified circulars for tutors.'}
            </span>
            {activeAudienceTab === 'guardians' ? (
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="text-blue-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'bn' ? 'এখনই টিউশন পোস্ট করুন' : 'Post Tuition Now'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('tuition-jobs')}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'bn' ? 'লাইভ জব বোর্ড দেখুন' : 'Explore Tuition Jobs'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 4. REAL GUARDIAN REVIEWS & TESTIMONIALS (Trust & Credibility) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{language === 'bn' ? 'সন্তুষ্ট অভিভাবক ও শিক্ষার্থীদের মতামত' : 'Parent Reviews & Experiences'}</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? 'ঢাকা, চট্টগ্রাম ও বিভিন্ন জেলার যাচাইকৃত অভিভাবক রেটিং' : 'Authentic verified reviews from parents across Bangladesh'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>৪.৯ / ৫.০</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                name: language === 'bn' ? 'তানজিলা রহমান' : 'Tanjila Rahman',
                location: language === 'bn' ? 'ধানমন্ডি, ঢাকা' : 'Dhanmondi, Dhaka',
                tag: language === 'bn' ? 'এসএসসি বিজ্ঞান' : 'SSC Science',
                quote: language === 'bn' 
                  ? '“মাত্র ২৪ ঘণ্টায় আমার মেয়ের জন্য বুয়েটের একজন চমৎকার গণিত শিক্ষক পেয়েছি। ১ম দিন ডেমো ক্লাসের পরই নিশ্চিত হতে পেরেছি।”'
                  : '“Found a brilliant BUET tutor for my daughter in 24 hours. The free trial demo gave complete confidence.”',
                rating: 5
              },
              {
                name: language === 'bn' ? 'প্রকৌশলী আব্দুল্লাহ' : 'Engr. Abdullah',
                location: language === 'bn' ? 'উত্তরা, ঢাকা' : 'Uttara, Dhaka',
                tag: language === 'bn' ? 'হিফজ ও তাজবিদ' : 'Hifz & Tajweed',
                quote: language === 'bn'
                  ? '“ছোট ছেলের কুরআন সহিহ তিলাওয়াত ও হিফজের জন্য অভিজ্ঞ মাদরাসার হাফেজ শিক্ষক পেয়েছি। তাদের চুক্তিপত্র সিস্টেম খুব স্বচ্ছ।”'
                  : '“Found an experienced Hafez tutor for my son’s Quran recitation. Transparent agreement voucher.”',
                rating: 5
              },
              {
                name: language === 'bn' ? 'মো. ইকবাল হোসেন' : 'Md. Iqbal Hossain',
                location: language === 'bn' ? 'জিইসি, চট্টগ্রাম' : 'GEC, Chattogram',
                tag: language === 'bn' ? 'ইংলিশ মিডিয়াম' : 'English Medium',
                quote: language === 'bn'
                  ? '“ইংলিশ মিডিয়াম ও-লেভেল পদার্থ ও রসায়নের জন্য নির্ভরযোগ্য শিক্ষক পাওয়া কষ্টকর ছিল, টিউটরহ্যাট খুব সহজে সমাধান করে দিয়েছে।”'
                  : '“Finding qualified O-level Physics and Chemistry tutor in Chattogram was hassle-free with TutorHat.”',
                rating: 5
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {rev.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">
                    {rev.quote}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-950">{rev.name}</p>
                    <p className="text-[10px] text-slate-500">{rev.location}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                    {language === 'bn' ? 'ভেরিফাইড অভিভাবক' : 'Verified'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 3-TIER VERIFICATION & SAFETY ASSURANCE (Caretutors Trust Pillar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="text-center max-w-xl mx-auto mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? '৩ স্তরের নিরাপত্তা ও ভেরিফিকেশন নিশ্চয়তা' : '3-Tier Safety & Verification Guarantee'}</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'bn' ? 'সন্তানের নিরাপত্তা ও পাঠদানের মান রক্ষায় আমরা কঠোরভাবে প্রতিটি প্রোফাইল যাচাই করি' : 'Every tutor undergoes multi-level identity and background checks'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center font-bold text-xs shrink-0">
                ০১
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'এনআইডি ও মোবাইল নম্বর যাচাই' : '1. NID & Phone Verification'}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
                  {language === 'bn' ? 'জাতীয় পরিচয়পত্র/জন্মসনদ এবং সক্রিয় মোবাইল ওটিপি কনফার্মেশন।' : 'National ID card & OTP authenticated mobile contact.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-950 flex items-center justify-center font-bold text-xs shrink-0">
                ০২
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'বিশ্ববিদ্যালয় আইডি ও সনদ চেক' : '2. Academic Credential Audit'}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
                  {language === 'bn' ? 'বিশ্ববিদ্যালয়ের বৈধ স্টুডেন্ট আইডি ও রেজাল্ট সনদপত্র যাচাই।' : 'University student ID and academic credential checks.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold text-xs shrink-0">
                ০৩
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950">
                  {language === 'bn' ? 'ফ্রি ট্রায়াল ডেমো ক্লাস মনিটরিং' : '3. Trial Demo Monitoring'}
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">
                  {language === 'bn' ? '১ম ক্লাসে সন্তুষ্টি যাচাই এবং অফিসিয়াল চুক্তিপত্রের নিশ্চয়তা।' : 'First class demo trial and official confirmation agreement.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPACT REAL-TIME METRIC STRIP (1 row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-slate-800">
          <div className="grid grid-cols-3 divide-x divide-slate-800 text-center">
            
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-base sm:text-2xl tabular-nums">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>{totalVerifiedTutors}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">
                {language === 'bn' ? 'যাচাইকৃত শিক্ষক' : 'Verified Tutors'}
              </p>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-base sm:text-2xl tabular-nums">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                <span>{activeJobs.length}</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">
                {language === 'bn' ? 'লাইভ সার্কুলার' : 'Active Circulars'}
              </p>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-blue-400 font-bold text-base sm:text-2xl tabular-nums">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                <span>৬৪</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium">
                {language === 'bn' ? 'সারাদেশে ৬৪ জেলা' : 'All 64 Districts'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-bold">
              {language === 'bn' ? 'সন্তানের জন্য সেরা শিক্ষক খুঁজছেন বা টিউশন করতে চান?' : 'Need a trusted tutor or looking for tuition?'}
            </h3>
            <p className="text-[10px] sm:text-xs text-blue-200">
              {language === 'bn' ? 'টিউটরহ্যাট-এ যুক্ত হয়ে নিশ্চিন্তে মানসম্মত শিক্ষা নিশ্চিত করুন।' : 'Join TutorHat for verified home and online tuition across Bangladesh.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('request-tutor')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              {language === 'bn' ? 'টিউশন পোস্ট' : 'Post Tuition'}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('tuition-jobs')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              {language === 'bn' ? 'জব বোর্ড দেখুন' : 'View Jobs'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
