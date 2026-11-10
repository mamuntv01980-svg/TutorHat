import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  BookOpen, 
  Calendar, 
  Clock, 
  GraduationCap, 
  MapPin, 
  Laptop, 
  Home, 
  TrendingUp, 
  Info,
  DollarSign,
  HelpCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TuitionFeeCalculatorProps {
  onApplyBudget?: (budget: number, classLevel?: string, medium?: string) => void;
  isModal?: boolean;
}

export const TuitionFeeCalculator: React.FC<TuitionFeeCalculatorProps> = ({
  onApplyBudget,
  isModal = false
}) => {
  const { navigateTo, language, settings } = useApp();

  // State Inputs
  const [classGroup, setClassGroup] = useState<'primary' | 'junior' | 'ssc' | 'hsc' | 'olevel' | 'admission' | 'quran'>('ssc');
  const [medium, setMedium] = useState<'bangla' | 'english_version' | 'english_medium' | 'madrasa'>('bangla');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [durationHours, setDurationHours] = useState<number>(1.5);
  const [subjectType, setSubjectType] = useState<'all' | 'science' | 'math_english' | 'single' | 'quran'>('science');
  const [tutorTier, setTutorTier] = useState<'buet_du_medical' | 'public_varsity' | 'private_national' | 'expert_teacher'>('buet_du_medical');
  const [locationTier, setLocationTier] = useState<'dhaka_premium' | 'dhaka_standard' | 'divisional_metro' | 'district'>('dhaka_standard');
  const [teachingMode, setTeachingMode] = useState<'home' | 'online'>('home');
  const [copied, setCopied] = useState(false);

  // Calculation Logic
  const calculationResult = useMemo(() => {
    // 1. Base Salary by Class Group (for 3 days/week, 1.5 hr/class in Bangla Medium)
    const baseByClass: Record<string, number> = {
      primary: 3500,     // Class 1 - 5
      junior: 4800,      // Class 6 - 8
      ssc: 7000,         // Class 9 - 10 (SSC)
      hsc: 9500,         // HSC 1st & 2nd Year
      olevel: 12000,     // O / A Levels
      admission: 11000,  // Engineering / Medical Admission
      quran: 4000        // Quran & Islamic
    };

    const base = baseByClass[classGroup] || 6000;

    // 2. Medium Multiplier
    const mediumMultiplier: Record<string, number> = {
      bangla: 1.0,
      english_version: 1.25,
      english_medium: 1.60,
      madrasa: 1.0
    };

    // 3. Days per week factor (normalized to 3 days base)
    const daysMultiplier: Record<number, number> = {
      2: 0.75,
      3: 1.0,
      4: 1.28,
      5: 1.55,
      6: 1.80
    };

    // 4. Duration factor (normalized to 1.5 hr)
    const durationMultiplier: Record<number, number> = {
      1.0: 0.85,
      1.5: 1.0,
      2.0: 1.25
    };

    // 5. Subject category factor
    const subjectMultiplier: Record<string, number> = {
      all: 1.05,
      science: 1.15,      // Physics, Chem, Math, Bio
      math_english: 1.0,
      single: 0.85,       // single subject
      quran: 0.90
    };

    // 6. Tutor qualification factor
    const tutorMultiplier: Record<string, number> = {
      buet_du_medical: 1.20,
      public_varsity: 1.05,
      private_national: 0.92,
      expert_teacher: 1.30
    };

    // 7. Location factor
    const locationMultiplier: Record<string, number> = {
      dhaka_premium: 1.15,
      dhaka_standard: 1.0,
      divisional_metro: 0.92,
      district: 0.82
    };

    // 8. Teaching Mode factor
    const modeMultiplier = teachingMode === 'online' ? 0.80 : 1.0;

    // Computed estimated monthly fee
    const rawTotal = 
      base * 
      mediumMultiplier[medium] * 
      daysMultiplier[daysPerWeek] * 
      durationMultiplier[durationHours] * 
      subjectMultiplier[subjectType] * 
      tutorMultiplier[tutorTier] * 
      locationMultiplier[locationTier] * 
      modeMultiplier;

    // Round to nearest 250 or 500 BDT
    const roundedMid = Math.round(rawTotal / 250) * 250;
    const minFee = Math.round((roundedMid * 0.92) / 250) * 250;
    const maxFee = Math.round((roundedMid * 1.08) / 250) * 250;

    // Per class and per hour
    const totalClassesPerMonth = daysPerWeek * 4;
    const perClassFee = Math.round(roundedMid / totalClassesPerMonth);
    const totalHoursPerMonth = totalClassesPerMonth * durationHours;
    const perHourFee = Math.round(roundedMid / totalHoursPerMonth);

    return {
      mid: roundedMid,
      min: minFee,
      max: maxFee,
      perClass: perClassFee,
      perHour: perHourFee,
      totalClasses: totalClassesPerMonth,
      totalHours: totalHoursPerMonth
    };
  }, [classGroup, medium, daysPerWeek, durationHours, subjectType, tutorTier, locationTier, teachingMode]);

  const currency = settings.defaultCurrency || '৳';

  const classLabels: Record<string, { bn: string; en: string }> = {
    primary: { bn: 'প্রাথমিক (১ম - ৫ম শ্রেণি)', en: 'Primary (Class 1-5)' },
    junior: { bn: 'জুনিয়র (৬ষ্ঠ - ৮ম শ্রেণি)', en: 'Junior (Class 6-8)' },
    ssc: { bn: 'এসএসসি (৯ম - ১০ম শ্রেণি)', en: 'SSC (Class 9-10)' },
    hsc: { bn: 'এইচএসসি (একাদশ - দ্বাদশ শ্রেণি)', en: 'HSC (Class 11-12)' },
    olevel: { bn: 'ও / এ লেভেল (O / A Level)', en: 'O / A Levels' },
    admission: { bn: 'বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি', en: 'Varsity/Medical/Engr Admission' },
    quran: { bn: 'কুরআন ও তাজবীদ শিক্ষা', en: 'Quran & Arabic Recitation' }
  };

  const mediumLabels: Record<string, { bn: string; en: string }> = {
    bangla: { bn: 'বাংলা মাধ্যম', en: 'Bangla Medium' },
    english_version: { bn: 'ইংলিশ ভার্সন (NCTB)', en: 'English Version' },
    english_medium: { bn: 'ইংলিশ মিডিয়াম (Cambridge/Edexcel)', en: 'English Medium' },
    madrasa: { bn: 'মাদ্রাসা / ইসলামিক কারিকুলাম', en: 'Madrasa Curriculum' }
  };

  const handleCopyBreakdown = () => {
    const text = `TutorHat টিউশন ফি প্রাক্কলন:\nশ্রেণি: ${classLabels[classGroup].bn}\nকারিকুলাম: ${mediumLabels[medium].bn}\nসপ্তাহে: ${daysPerWeek} দিন (${durationHours} ঘণ্টা/ক্লাস)\nপ্রস্তাবিত মাসিক ফি: ${currency}${calculationResult.min.toLocaleString()} - ${currency}${calculationResult.max.toLocaleString()}\nপ্রতি ক্লাস ফি: ~${currency}${calculationResult.perClass.toLocaleString()}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToRequest = () => {
    if (onApplyBudget) {
      onApplyBudget(calculationResult.mid, classLabels[classGroup].bn, mediumLabels[medium].bn);
    } else {
      navigateTo('request-tutor');
    }
  };

  const handleSearchWithBudget = () => {
    navigateTo('find-tutor');
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden ${isModal ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {language === 'bn' ? 'স্মার্ট টিউশন ফি ক্যালকুলেটর' : 'Smart Fee Calculator'}
            </span>
            <span className="text-xs text-slate-400 font-medium">বাংলাদেশ স্ট্যান্ডার্ড</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-950 mt-1 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-800" />
            <span>{language === 'bn' ? 'টিউশন ফি ও স্যালারি প্রাক্কলন ক্যালকুলেটর' : 'Tuition Fee & Salary Calculator'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'শ্রেণি, মাধ্যম, এলাকা ও শিক্ষকের যোগ্যতার ভিত্তিতে বর্তমান বাংলাদেশের বাস্তবসম্মত টিউশন ফি মুহূর্তেই হিসাব করুন।'
              : 'Estimate fair and realistic market tuition fees based on class, medium, area, and tutor credentials.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyBreakdown}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 self-start sm:self-auto transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'হিসাব কপি করুন' : 'Copy Estimate')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-5 text-xs">
          
          {/* 1. Class / Grade Group */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-700" />
              <span>{language === 'bn' ? '১. শিক্ষার্থীর শ্রেণি বা লেভেল নির্বাচন করুন' : '1. Student Class / Level'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'primary', label: '১ম - ৫ম (Primary)' },
                { id: 'junior', label: '৬ষ্ঠ - ৮ম (Junior)' },
                { id: 'ssc', label: '৯ম - ১০ম (SSC)' },
                { id: 'hsc', label: 'একাদশ - দ্বাদশ (HSC)' },
                { id: 'olevel', label: 'O / A Levels' },
                { id: 'admission', label: 'ভর্তি প্রস্তুতি (Admission)' },
                { id: 'quran', label: 'কুরআন / আরবি শিক্ষা' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setClassGroup(item.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer font-semibold ${
                    classGroup === item.id
                      ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Medium & Curriculum */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
              <span>{language === 'bn' ? '২. শিক্ষার মাধ্যম / কারিকুলাম' : '2. Curriculum / Medium'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bangla', label: 'বাংলা মাধ্যম (NCTB)' },
                { id: 'english_version', label: 'ইংলিশ ভার্সন (NCTB)' },
                { id: 'english_medium', label: 'ইংলিশ মিডিয়াম (Cambridge / Edexcel)' },
                { id: 'madrasa', label: 'মাদ্রাসা ও ইসলামিক শিক্ষা' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMedium(item.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer font-semibold ${
                    medium === item.id
                      ? 'bg-indigo-900 text-white border-indigo-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Days Per Week & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'bn' ? '৩. সপ্তাহে দিনসংখ্যা' : '3. Days Per Week'}</span>
              </label>
              <div className="flex gap-1.5">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      daysPerWeek === d
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d} দিন
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'bn' ? '৪. প্রতি ক্লাসের সময়কাল' : '4. Class Duration'}</span>
              </label>
              <div className="flex gap-1.5">
                {[
                  { hours: 1.0, label: '১ ঘণ্টা' },
                  { hours: 1.5, label: '১.৫ ঘণ্টা (স্ট্যান্ডার্ড)' },
                  { hours: 2.0, label: '২ ঘণ্টা' }
                ].map(item => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setDurationHours(item.hours)}
                    className={`flex-1 py-2 px-1 rounded-xl text-center font-bold border transition-all cursor-pointer text-[11px] ${
                      durationHours === item.hours
                        ? 'bg-amber-500 text-blue-950 border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Subject Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-700" />
              <span>{language === 'bn' ? '৫. পড়ার বিষয়াবলী' : '5. Subjects Category'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'সব বিষয় (All Subjects)' },
                { id: 'science', label: 'বিজ্ঞান ও উচ্চতর গণিত' },
                { id: 'math_english', label: 'সাধারণ গণিত ও ইংরেজি' },
                { id: 'single', label: 'যেকোনো একটি নির্দিষ্ট বিষয়' },
                { id: 'quran', label: 'কুরআন ও তাজবীদ' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSubjectType(item.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer font-medium ${
                    subjectType === item.id
                      ? 'bg-purple-900 text-white border-purple-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Tutor Background & Institution Tier */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              <span>{language === 'bn' ? '৬. টিউটরের প্রতিষ্ঠান ও ব্যাকগ্রাউন্ড' : '6. Tutor Background & Tier'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'buet_du_medical', label: 'বুয়েট / মেডিকেল / ঢাবি (Top Tier)' },
                { id: 'public_varsity', label: 'অন্যান্য পাবলিক বিশ্ববিদ্যালয়' },
                { id: 'private_national', label: 'প্রাইভেট / জাতীয় বিশ্ববিদ্যালয়' },
                { id: 'expert_teacher', label: 'অভিজ্ঞ প্রফেশনাল সিনিয়র শিক্ষক' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTutorTier(item.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer font-semibold ${
                    tutorTier === item.id
                      ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Location & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-700" />
                <span>{language === 'bn' ? '৭. এলাকা / অবস্থান' : '7. Location Tier'}</span>
              </label>
              <select
                value={locationTier}
                onChange={(e) => setLocationTier(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold focus:bg-white focus:outline-hidden"
              >
                <option value="dhaka_premium">ঢাকা প্রিমিয়াম (ধানমন্ডি, গুলশান, উত্তরা, বনানী, বসুন্ধরা)</option>
                <option value="dhaka_standard">ঢাকা স্ট্যান্ডার্ড (মিরপুর, বাড্ডা, খিলগাঁও, মালিবাগ ইত্যাদি)</option>
                <option value="divisional_metro">বিভাগীয় মেট্রো (চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা)</option>
                <option value="district">অন্যান্য জেলা ও উপজেলা সদর</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-700" />
                <span>{language === 'bn' ? '৮. পাঠদানের মাধ্যম' : '8. Mode of Tuition'}</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTeachingMode('home')}
                  className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    teachingMode === 'home'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>বাসায় (Home)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTeachingMode('online')}
                  className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    teachingMode === 'online'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>অনলাইন (Online -20%)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output Dashboard (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-blue-900/60">
          
          <div className="space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  প্রস্তাবিত মার্কেট রেট
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                {teachingMode === 'home' ? 'বাসায় পাঠদান' : 'অনলাইন পাঠদান'}
              </span>
            </div>

            {/* Big Fee Display */}
            <div className="space-y-1">
              <span className="text-xs text-blue-200 block">
                {language === 'bn' ? 'প্রস্তাবিত মাসিক টিউশন ফি রেঞ্জ:' : 'Estimated Monthly Fee Range:'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                <span className="text-amber-400 font-bold">{currency}</span>
                <span>{calculationResult.min.toLocaleString()}</span>
                <span className="text-slate-400 text-2xl font-normal">–</span>
                <span>{calculationResult.max.toLocaleString()}</span>
                <span className="text-xs font-normal text-blue-300 ml-1">/ মাস</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                গড় যৌক্তিক বাজেট: {currency}{calculationResult.mid.toLocaleString()} BDT
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-300 block">প্রতি ক্লাস গড় খরচ</span>
                <span className="text-base font-bold text-amber-300">
                  {currency}{calculationResult.perClass.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  মাসে {calculationResult.totalClasses} টি ক্লাস
                </span>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-slate-300 block">প্রতি ঘণ্টা গড় রেট</span>
                <span className="text-base font-bold text-amber-300">
                  {currency}{calculationResult.perHour.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  মাসে {calculationResult.totalHours} ঘণ্টা
                </span>
              </div>
            </div>

            {/* Smart Market Insights */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs space-y-2 text-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>বাজার বিশ্লেষণ ও পরামর্শ:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {classGroup === 'ssc' || classGroup === 'hsc'
                  ? 'বিজ্ঞান বিভাগের উচ্চতর গণিত ও পদার্থবিজ্ঞানের জন্য বুয়েট/মেডিকেল ব্যাকগ্রাউন্ডের টিউটরদের ডিমান্ড বেশি থাকায় ফি একটু প্রিমিয়াম হয়ে থাকে।'
                  : classGroup === 'olevel'
                  ? 'ইংরেজি মাধ্যম (Cambridge/Edexcel)-এ কারিকুলাম ও বইয়ের ভিন্নতার কারণে প্রতি ঘণ্টা ফি সাধারণত তুলনামূলক বেশি হয়।'
                  : classGroup === 'quran'
                  ? 'সহিহ তাজবীদ ও কুরআনের বুনিয়াদি শিক্ষার জন্য নিয়মিত ৩-৪ দিনের হোম টিউটরিং অত্যন্ত কার্যকরী।'
                  : 'প্রাথমিক ও জুনিয়র শিক্ষার্থীদের জন্য সব বিষয়ে যত্নশীল এবং ধৈর্যশীল গৃহশিক্ষক নির্বাচন সর্বোত্তম ফল বয়ে আনে।'}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleApplyToRequest}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>এই বাজেটে টিউটর রিকোয়েস্ট করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSearchWithBudget}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
            >
              <span>এই বাজেটের উপযোগী টিউটর খুঁজুন</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
