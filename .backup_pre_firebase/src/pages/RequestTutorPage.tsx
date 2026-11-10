import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  BookOpen, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { 
  BD_DISTRICTS, 
  DHAKA_AREAS, 
  MEDIUMS, 
  SUBJECTS_LIST, 
  CLASS_LEVELS 
} from '../constants/bangladeshData';
import { TRANSLATIONS } from '../constants/translations';
import { guardianStudyImg } from '../services/store';

export const RequestTutorPage: React.FC = () => {
  const { currentUser, navigateTo, language, settings } = useApp();
  const t = TRANSLATIONS[language];

  // Form State
  const [guardianName, setGuardianName] = useState(currentUser?.role === 'guardian' ? (currentUser.name || '') : '');
  const [phone, setPhone] = useState(currentUser?.role === 'guardian' ? (currentUser.phone || '') : '');
  const [location, setLocation] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [studentClass, setStudentClass] = useState('Class 8 (JSC)');
  const [studentGender, setStudentGender] = useState<'male' | 'female'>('male');
  const [medium, setMedium] = useState('Bangla Medium');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'General Science']);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [preferredDays, setPreferredDays] = useState<string[]>(['Saturday', 'Monday', 'Wednesday']);
  const [preferredTime, setPreferredTime] = useState('5:00 PM - 6:30 PM');
  const [teachingType, setTeachingType] = useState<'home' | 'online' | 'both'>('home');
  const [tutorGenderPreference, setTutorGenderPreference] = useState<'any' | 'male' | 'female'>('any');
  const [monthlyBudget, setMonthlyBudget] = useState(6000);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  // Customise states for all options (Requirement 2)
  const [isCustomisingSubject, setIsCustomisingSubject] = useState(false);
  const [customSubjectText, setCustomSubjectText] = useState('');
  const [isCustomisingClass, setIsCustomisingClass] = useState(false);
  const [customClassText, setCustomClassText] = useState('');
  const [isCustomisingMedium, setIsCustomisingMedium] = useState(false);
  const [customMediumText, setCustomMediumText] = useState('');
  const [isCustomisingSchedule, setIsCustomisingSchedule] = useState(false);
  const [customScheduleText, setCustomScheduleText] = useState('');
  const [isCustomisingMode, setIsCustomisingMode] = useState(false);
  const [customModeText, setCustomModeText] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const guardianId = currentUser?.id || `user_guardian_${Date.now()}`;
    const allSubjects = [...selectedSubjects];
    if (customSubjectText.trim() && !allSubjects.includes(customSubjectText.trim())) {
      allSubjects.push(customSubjectText.trim());
    }

    // Combine custom notes into customRequirements
    const customNotes: string[] = [];
    if (customSubjectText.trim()) customNotes.push(`বিষয়: ${customSubjectText.trim()}`);
    if (customClassText.trim()) customNotes.push(`শ্রেণি: ${customClassText.trim()}`);
    if (customMediumText.trim()) customNotes.push(`কারিকুলাম: ${customMediumText.trim()}`);
    if (customScheduleText.trim()) customNotes.push(`শিডিউল: ${customScheduleText.trim()}`);
    if (customModeText.trim()) customNotes.push(`মোড: ${customModeText.trim()}`);
    const finalCustomRequirements = customNotes.join(' | ');

    const finalClass = customClassText.trim() ? customClassText.trim() : studentClass;
    const finalMedium = customMediumText.trim() ? customMediumText.trim() : medium;

    const newReq = store.createTuitionRequest({
      guardianId,
      guardianName: guardianName.trim(),
      phone: phone.trim(),
      location,
      area,
      studentClass: finalClass,
      studentGender,
      medium: finalMedium,
      subjects: allSubjects,
      daysPerWeek: Number(daysPerWeek),
      preferredDays,
      preferredTime: customScheduleText.trim() ? `${preferredTime} (${customScheduleText.trim()})` : preferredTime,
      teachingType,
      tutorGenderPreference,
      monthlyBudget: Number(monthlyBudget),
      additionalRequirements: additionalRequirements.trim(),
      customRequirements: finalCustomRequirements || undefined,
      customSubjects: customSubjectText.trim() ? [customSubjectText.trim()] : undefined,
      customClass: customClassText.trim() || undefined,
      customMedium: customMediumText.trim() || undefined,
      customSchedule: customScheduleText.trim() || undefined,
      customMode: customModeText.trim() || undefined
    });

    setSubmittedRequestId(newReq.id);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-blue-950">
            {language === 'bn' ? 'টিউটর রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!' : 'Tuition Request Submitted Successfully!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'bn'
              ? `আপনার রিকোয়েস্ট আইডি: ${submittedRequestId}। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন এবং যোগ্য টিউটরদের প্রস্তাব পাঠাবেন।`
              : `Your Request ID is ${submittedRequestId}. Our team is verifying your requirements and will shortlist qualified tutors.`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 text-left max-w-md mx-auto space-y-1">
          <p><strong>Class:</strong> {studentClass} ({medium})</p>
          <p><strong>Area:</strong> {area}, {location}</p>
          <p><strong>Your Budget:</strong> ৳{monthlyBudget.toLocaleString()}/month</p>
          <p><strong>Status:</strong> <span className="text-amber-700 font-semibold uppercase">Pending Admin Review</span></p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigateTo('guardian-dashboard')}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors"
          >
            {language === 'bn' ? 'আমার ড্যাশবোর্ডে যান' : 'Go to Guardian Dashboard'}
          </button>
          <button
            type="button"
            onClick={() => { setIsSubmitted(false); }}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
          >
            {language === 'bn' ? 'আরেকটি রিকোয়েস্ট করুন' : 'Submit Another Request'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'bn' ? '১০০% ফ্রি সার্ভিস অভিভাবকদের জন্য' : '100% Free for Guardians & Students'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
          {language === 'bn' ? 'টিউটর রিকোয়েস্ট ফরম' : 'Request a Qualified Tutor'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'bn'
            ? 'আপনার সন্তানের ক্লাসের উপযোগী বিষয়, সময় এবং আপনার নিজস্ব বাজেট উল্লেখ করে রিকোয়েস্ট সাবমিট করুন।'
            : 'Fill out your child’s educational details and set your own monthly budget.'}
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 1: Guardian & Contact Details */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <span>{language === 'bn' ? '১. অভিভাবক ও যোগাযোগের তথ্য' : '1. Guardian & Contact Info'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'অভিভাবকের নাম' : 'Guardian Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Farhana Begum"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Contact Mobile Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'জেলা (A to Z)' : 'District (A-Z)'}</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-medium"
                >
                  {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <span className="text-[10px] text-slate-400 mt-0.5 block">বাংলাদেশের ৬৪টি জেলা (A-Z)</span>
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'বর্তমান ঠিকানা / এলাকা' : 'Present Address / Area'}</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={language === 'bn' ? 'বাড়ি, রোড, এলাকা বা থানা লিখুন' : 'e.g. Dhanmondi, Agrabad, Uttara...'}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Student Educational Requirements */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>{language === 'bn' ? '২. শিক্ষার্থীর শ্রেণি ও বিষয়' : '2. Student & Curriculum'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-900 block">{language === 'bn' ? 'শ্রেণি' : 'Class / Level'}</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomisingClass(!isCustomisingClass)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Customise {customClassText ? '✓' : ''}</span>
                  </button>
                </div>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                >
                  {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {isCustomisingClass && (
                  <div className="mt-2 p-2 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
                    <input
                      type="text"
                      value={customClassText}
                      onChange={(e) => setCustomClassText(e.target.value)}
                      placeholder="কাস্টম শ্রেণি লিখুন (যেমন: Admission, Alim, IELTS)..."
                      className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                    <span className="text-[10px] text-amber-800 block">✓ এই কাস্টম শ্রেণি সরাসরি অ্যাডমিন দেখতে পাবেন</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'শিক্ষার্থীর লিঙ্গ' : 'Student Gender'}</label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setStudentGender('male')}
                    className={`py-1.5 rounded-lg font-medium transition-colors ${
                      studentGender === 'male' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {language === 'bn' ? 'ছাত্র' : 'Boy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentGender('female')}
                    className={`py-1.5 rounded-lg font-medium transition-colors ${
                      studentGender === 'female' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {language === 'bn' ? 'ছাত্রী' : 'Girl'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-900 block">{language === 'bn' ? 'কারিকুলাম / মাধ্যম' : 'Medium'}</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomisingMedium(!isCustomisingMedium)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Customise {customMediumText ? '✓' : ''}</span>
                  </button>
                </div>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                >
                  {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {isCustomisingMedium && (
                  <div className="mt-2 p-2 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
                    <input
                      type="text"
                      value={customMediumText}
                      onChange={(e) => setCustomMediumText(e.target.value)}
                      placeholder="কাস্টম কারিকুলাম লিখুন (যেমন: Cambridge, Dakhil, IB)..."
                      className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                    <span className="text-[10px] text-amber-800 block">✓ এই কাস্টম কারিকুলাম অ্যাডমিন দেখতে পাবেন</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subjects Chips selection */}
            <div>
              <label className="font-semibold text-slate-900 block mb-2">
                {language === 'bn' ? 'পড়ার বিষয়সমূহ (একাধিক নির্বাচন করুন):' : 'Select Subjects:'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS_LIST.map((sub) => {
                  const selected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}{sub}
                    </button>
                  );
                })}

                {/* Customise Option (Requirement 2) */}
                <button
                  type="button"
                  onClick={() => setIsCustomisingSubject(!isCustomisingSubject)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCustomisingSubject || customSubjectText.trim()
                      ? 'bg-amber-500 text-blue-950 border-amber-600 shadow-sm'
                      : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Customise {customSubjectText.trim() ? `(✓ ${customSubjectText.trim().slice(0, 15)}...)` : ''}</span>
                </button>
              </div>

              {/* Expandable Custom Subject Box */}
              {isCustomisingSubject && (
                <div className="mt-3 p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'bn' ? 'পছন্দমতো কাস্টম বিষয়/টপিক লিখুন:' : 'Type custom subjects / topics:'}</span>
                    </label>
                    {customSubjectText && (
                      <button
                        type="button"
                        onClick={() => setCustomSubjectText('')}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customSubjectText}
                    onChange={(e) => setCustomSubjectText(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: Higher Math, Quran Recitation, Spoken English, ICT, Robotics...' : 'e.g. Higher Math, Arabic Tajweed, Coding, Robotics...'}
                    className="w-full py-2 px-3 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-[10px] text-amber-800">
                    {language === 'bn'
                      ? '✓ এই কাস্টম চাহিদাটি সরাসরি সংরক্ষণ হবে এবং অ্যাডমিন প্যানেলে স্পষ্টভাবে দেখতে পাওয়া যাবে।'
                      : '✓ This custom requirement will be saved and prominently visible in the Admin Panel.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Schedule, Mode & Custom Budget */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              <span>{language === 'bn' ? '৩. শিডিউল ও আপনার নিজস্ব বাজেট' : '3. Schedule & Your Custom Budget'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'সপ্তাহে কয়দিন?' : 'Days per Week'}
                </label>
                <select
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                >
                  {[2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {t.daysPerWeek}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-900 block">{language === 'bn' ? 'পছন্দের সময়' : 'Preferred Time'}</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomisingSchedule(!isCustomisingSchedule)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Customise {customScheduleText ? '✓' : ''}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="e.g. 5:00 PM - 6:30 PM"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
                {isCustomisingSchedule && (
                  <div className="mt-2 p-2 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
                    <input
                      type="text"
                      value={customScheduleText}
                      onChange={(e) => setCustomScheduleText(e.target.value)}
                      placeholder="কাস্টম দিন বা সময় লিখুন (যেমন: শুক্র ও শনি সকাল ১০টা)..."
                      className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'শিক্ষক পছন্দ' : 'Tutor Gender Preference'}
                </label>
                <select
                  value={tutorGenderPreference}
                  onChange={(e) => setTutorGenderPreference(e.target.value as any)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs capitalize"
                >
                  <option value="any">Any (Male or Female)</option>
                  <option value="male">Male Tutor Only</option>
                  <option value="female">Female Tutor Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-900 block">{language === 'bn' ? 'পাঠদানের মোড' : 'Tuition Mode'}</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomisingMode(!isCustomisingMode)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Customise {customModeText ? '✓' : ''}</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                  {(['home', 'online', 'both'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTeachingType(mode)}
                      className={`py-1.5 capitalize rounded-lg font-medium transition-colors ${
                        teachingType === mode ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {mode === 'both' ? 'Both' : mode}
                    </button>
                  ))}
                </div>
                {isCustomisingMode && (
                  <div className="mt-2 p-2 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
                    <input
                      type="text"
                      value={customModeText}
                      onChange={(e) => setCustomModeText(e.target.value)}
                      placeholder="কাস্টম মোড লিখুন (যেমন: বাসায় এসে + অনলাইন ব্যাকআপ)..."
                      className="w-full p-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Monthly Custom Budget (NO FORCED FEES) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-900 block">
                    {language === 'bn' ? 'আপনার মাসিক বাজেট (BDT ৳)' : 'Your Monthly Budget (BDT ৳)'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => navigateTo('fee-calculator')}
                    className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>ক্যালকুলেটরে যাচাই করুন →</span>
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">{settings.defaultCurrency}</span>
                  <input
                    type="number"
                    min="2000"
                    max="40000"
                    step="500"
                    required
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {language === 'bn' ? 'অভিভাবক তাদের নিজস্ব বাজেট দিতে পারেন। কোনো ফিক্সড চার্জ নেই।' : 'You choose your own monthly budget. No hidden fees.'}
                </span>
              </div>
            </div>

            {/* Additional requirements */}
            <div>
              <label className="font-semibold text-slate-900 block mb-1">
                {language === 'bn' ? 'অতিরিক্ত কোনো প্রত্যাশা বা বিশেষ চাহিদা থাকলে লিখুন' : 'Additional Requirements'}
              </label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: BUET বা ঢাকা বিশ্ববিদ্যালয়ের শিক্ষক পছন্দ, সপ্তাহে একটি মডেল টেস্ট নিতে হবে...' : 'e.g. Prefer tutor from BUET/DU, weekly quiz required...'}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] min-h-[48px]"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'টিউটর রিকোয়েস্ট সাবমিট করুন' : 'Submit Tuition Request'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
