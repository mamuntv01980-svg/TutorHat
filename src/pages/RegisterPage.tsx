import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  Clock,
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { 
  BD_DISTRICTS, 
  DHAKA_AREAS, 
  CLASS_LEVELS, 
  SUBJECTS_LIST, 
  MEDIUMS, 
  UNIVERSITIES_LIST,
  MADRASA_BOARDS,
  MADRASA_SANADS_QAWMI,
  MADRASA_DEGREES_ALIA,
  MADRASA_DIVISIONS
} from '../constants/bangladeshData';
import { TutorCategoryType } from '../types';

export const RegisterPage: React.FC = () => {
  const { navigateTo, language, loginAs } = useApp();

  const [role, setRole] = useState<'tutor' | 'guardian'>('tutor');
  const [currentStep, setCurrentStep] = useState(1); // 1 to 8 for tutor

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Personal Info & Category Stream
  const [tutorCategory, setTutorCategory] = useState<TutorCategoryType>('general');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [aboutMe, setAboutMe] = useState('');

  // Step 3: Education (General & Madrasa)
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [programDegree, setProgramDegree] = useState('B.Sc. / B.A.');
  const [hscCollege, setHscCollege] = useState('');
  const [hscGpa, setHscGpa] = useState('5.00');
  const [sscSchool, setSscSchool] = useState('');
  const [sscGpa, setSscGpa] = useState('5.00');

  // Specialized Madrasa details (Alia & Qawmi)
  const [madrasaBoard, setMadrasaBoard] = useState(MADRASA_BOARDS[0]);
  const [highestSanadOrDegree, setHighestSanadOrDegree] = useState('দাওরায়ে হাদিস / তাকমিল (মাস্টার্স সমমান)');
  const [sanadDivisionOrGpa, setSanadDivisionOrGpa] = useState('মুমতাজ (Star Marks / Distinction)');
  const [sanadPassingYear, setSanadPassingYear] = useState('2022');
  const [isHafiz, setIsHafiz] = useState(false);
  const [qiratTajweedCertificate, setQiratTajweedCertificate] = useState('');
  const [specializationDept, setSpecializationDept] = useState('');
  const [currentKhidmatOrInstitution, setCurrentKhidmatOrInstitution] = useState('');

  // Step 4: Teaching Experience
  const [experienceYears, setExperienceYears] = useState(1);
  const [teachingMethod, setTeachingMethod] = useState('');

  // Step 5: Subjects & Classes
  const [preferredClasses, setPreferredClasses] = useState<string[]>(['Class 9 (SSC)', 'Class 10 (SSC)']);
  const [customClass, setCustomClass] = useState('');
  const [showCustomClass, setShowCustomClass] = useState(false);
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [customMedium, setCustomMedium] = useState('');
  const [showCustomMedium, setShowCustomMedium] = useState(false);

  // Step 6: Teaching Preferences
  const [preferredMediums, setPreferredMediums] = useState<string[]>(['Bangla Medium', 'English Version']);
  const [preferredAreas, setPreferredAreas] = useState<string[]>(['Dhanmondi']);
  const [customArea, setCustomArea] = useState('');
  const [expectedSalary, setExpectedSalary] = useState(6000);
  const [homeTuition, setHomeTuition] = useState(true);
  const [onlineTeaching, setOnlineTeaching] = useState(true);
  const [customTuitionType, setCustomTuitionType] = useState('');
  const [showCustomTuitionType, setShowCustomTuitionType] = useState(false);

  // Step 7: Availability
  const [availableDays, setAvailableDays] = useState<string[]>(['Saturday', 'Monday', 'Wednesday']);
  const [availableTime, setAvailableTime] = useState('5:00 PM - 7:30 PM');
  const [preferredStudentGender, setPreferredStudentGender] = useState<'any' | 'male' | 'female'>('any');

  // Step 8: Terms & Submit
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const validateStep = (step: number): boolean => {
    setError('');
    if (step === 1) {
      if (!mobileNumber.trim()) {
        setError('Please enter your mobile phone number.');
        return false;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      const existing = store.findUserByPhoneOrEmail(mobileNumber);
      if (existing) {
        setError('This mobile phone number is already registered.');
        return false;
      }
    } else if (step === 2) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
    } else if (step === 3) {
      if (tutorCategory === 'qawmi_madrasa') {
        if (!currentKhidmatOrInstitution.trim() && !university.trim()) {
          setError('অনুগ্রহ করে আপনার প্রধান মাদরাসা / জামিয়ার নাম উল্লেখ করুন।');
          return false;
        }
      } else {
        if (!university.trim() || !department.trim()) {
          setError('Please provide your university/institution name and department.');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(8, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    const newUser = store.createUser({
      name: fullName.trim() || 'New User',
      email: email.trim() || `${mobileNumber}@tutorhat.user`,
      phone: mobileNumber.trim(),
      role,
      gender,
      location: `${area}, ${district}`,
      district
    });

    // If tutor, update full CV details
    if (role === 'tutor') {
      const tutor = store.getTutorByUserId(newUser.id);
      if (tutor) {
        store.updateTutorProfile(tutor.id, {
          fullName,
          gender,
          dateOfBirth,
          district,
          area,
          preferredAreas,
          aboutMe,
          tutorCategory,
          madrasaDetails: {
            category: tutorCategory,
            isHafiz,
            qiratTajweedCertificate,
            madrasaBoard,
            highestSanadOrDegree,
            sanadPassingYear,
            sanadDivisionOrGpa,
            specializationDept,
            currentKhidmatOrInstitution: currentKhidmatOrInstitution || university
          },
          university: tutorCategory === 'qawmi_madrasa' ? (currentKhidmatOrInstitution || university || 'আল-জামিয়াতুল আহলিয়া') : university,
          department: tutorCategory === 'qawmi_madrasa' ? (specializationDept || highestSanadOrDegree || 'দাওরায়ে হাদিস') : department,
          programDegree: tutorCategory === 'qawmi_madrasa' ? highestSanadOrDegree : programDegree,
          hsc: { schoolOrCollege: hscCollege || 'College / Alim Madrasah', board: 'Dhaka', gpa: hscGpa, passingYear: '2020' },
          ssc: { schoolOrCollege: sscSchool || 'School / Dakhil Madrasah', board: 'Dhaka', gpa: sscGpa, passingYear: '2018' },
          teachingExperienceYears: Number(experienceYears),
          teachingMethod,
          preferredClasses,
          preferredSubjects,
          preferredMediums,
          expectedSalary: Number(expectedSalary),
          availableDays,
          availableTime,
          homeTuition,
          onlineTeaching,
          preferredStudentGender,
          verificationStatus: 'pending',
          verificationSubmittedDate: new Date().toISOString()
        });

        store.addNotification({
          userId: 'user_admin_01',
          title: 'নতুন টিউটর সিভি আবেদন (New Tutor CV)',
          message: `${fullName} (${university || department || 'টিচার'}) তার সিভি পূরণ করে অনুমোদনের জন্য পাঠিয়েছেন।`,
          type: 'verification'
        });

        store.syncWithServer().catch(() => {});
      }
    }

    loginAs(role, newUser.id);

    if (role === 'tutor') {
      navigateTo('tutor-dashboard');
    } else {
      navigateTo('guardian-dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      
      {/* Title & Role Switcher */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
          {language === 'bn' ? 'TutorHat নিবন্ধন' : 'TutorHat Registration'}
        </h1>
        <p className="text-xs text-slate-600">
          {role === 'tutor' 
            ? (language === 'bn' ? '৮টি সহজ ধাপে সম্পূর্ণ ভেরিফাইড সিভি তৈরি করুন' : 'Complete 8 organized steps to build your verified CV') 
            : (language === 'bn' ? 'অভিভাবক হিসেবে ফ্রি অ্যাকাউন্ট তৈরি করুন' : 'Create free account as Guardian / Student')}
        </p>

        {/* Role Toggle */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mt-2">
          <button
            type="button"
            onClick={() => { setRole('tutor'); setCurrentStep(1); }}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'tutor' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Tutor (শিক্ষক)
          </button>
          <button
            type="button"
            onClick={() => { setRole('guardian'); setCurrentStep(1); }}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'guardian' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Guardian (অভিভাবক)
          </button>
        </div>
      </div>

      {/* Tutor Multi-Step Progress Indicator (Section 57: Step X of 8) */}
      {role === 'tutor' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-950">
            <span>Step {currentStep} of 8: {[
              'Account',
              'Personal Information',
              'Education',
              'Teaching Experience',
              'Subjects & Classes',
              'Teaching Preferences',
              'Availability',
              'Review & Submit'
            ][currentStep - 1]}</span>
            <span className="font-mono text-blue-800">{Math.round((currentStep / 8) * 100)}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 font-medium">
          {error}
        </div>
      )}

      {/* Main Form Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-xs">
        
        {/* ===================== TUTOR STEPS ===================== */}
        {role === 'tutor' && (
          <div className="space-y-5">
            
            {/* Step 1: Account */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 1: Account Credentials</h3>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number (মোবাইল নম্বর) *</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address (ইমেইল) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@university.edu"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-sm text-blue-950">Step 2: Personal Info & Tutor Category</h3>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    সকল শ্রেণির টিউটরদের জন্য
                  </span>
                </div>

                {/* Category Selection Tabs */}
                <div>
                  <label className="font-semibold block mb-1 text-slate-800">
                    আপনার টিউটরিং ক্যাটাগরি নির্বাচন করুন *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    জেনারেল, আলিয়া মাদ্রাসা ও কওমি মাদ্রাসা — যেকোনো ক্যাটাগরিতে আবেদন করতে পারেন।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTutorCategory('general')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tutorCategory === 'general'
                          ? 'bg-blue-50/80 border-blue-600 text-blue-950 ring-2 ring-blue-600/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-xs">🎓 জেনারেল টিউটর</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">স্কুল, কলেজ ও বিশ্ববিদ্যালয় (বাংলা/ইংরেজি মাধ্যম)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTutorCategory('alia_madrasa')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tutorCategory === 'alia_madrasa'
                          ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 ring-2 ring-emerald-600/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-xs">🕌 আলিয়া মাদ্রাসা টিউটর</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">দাখিল, আলিম, ফাজিল ও কামিল (আরবি ও সাধারণ)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTutorCategory('qawmi_madrasa')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tutorCategory === 'qawmi_madrasa'
                          ? 'bg-amber-50/85 border-amber-600 text-amber-950 ring-2 ring-amber-600/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-xs">📖 কওমি মাদ্রাসা টিউটর</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">হিফজ, দাওরায়ে হাদিস, মুফতি, বেফাক/হাইয়াতুল উলয়া</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Full Name (পুরো নাম) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={
                      tutorCategory === 'qawmi_madrasa' 
                        ? 'e.g. Hafez Maulana Abdullah / মুফতি আব্দুর রহমান' 
                        : 'e.g. Rahim Chowdhury'
                    }
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="male">Male (পুরুষ)</option>
                      <option value="female">Female (মহিলা)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    >
                    </input>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-900">
                      District (জেলা - A to Z) *
                    </label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium"
                    >
                      {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      বাংলাদেশের ৬৪টি জেলা বর্ণানুক্রমে (A-Z) সাজানো
                    </span>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-slate-900">
                      Present Address (বর্তমান ঠিকানা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      placeholder="বাড়ি/রোড নম্বর, এলাকা, থানা/উপজেলা লিখুন (যেমন: ধানমন্ডি-৩২ / আগ্রাবাদ / জিন্দাবাজার)"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white text-xs sm:text-sm"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      আপনার বর্তমান সঠিক ঠিকানা লিখুন (যেকোনো এলাকা/উপজেলা)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">About Me (Bio for Guardians)</label>
                  <textarea
                    rows={2}
                    value={aboutMe}
                    onChange={e => setAboutMe(e.target.value)}
                    placeholder={
                      tutorCategory === 'qawmi_madrasa'
                        ? 'কওমি মাদ্রাসার শিক্ষাগত সনদ, হিফজ/দাওরায়ে হাদিস অভিজ্ঞতা এবং তাজবীদসহ পাঠদানের নিয়ম সম্পর্কে লিখুন...'
                        : tutorCategory === 'alia_madrasa'
                        ? 'আলিয়া মাদ্রাসা ও ইসলামিক শিক্ষা ব্যাকগ্রাউন্ড এবং পাঠদান দক্ষতা সম্পর্কে লিখুন...'
                        : 'Brief introduction about your passion for tutoring...'
                    }
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-sm text-blue-950">
                    Step 3: Academic Background ({
                      tutorCategory === 'general' ? 'জেনারেল শিক্ষা' :
                      tutorCategory === 'alia_madrasa' ? 'আলিয়া মাদ্রাসা শিক্ষা' : 'কওমি মাদ্রাসা ও দ্বীনি শিক্ষা'
                    })
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Category: {tutorCategory.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* QAWMI MADRASA STREAM FORM */}
                {tutorCategory === 'qawmi_madrasa' && (
                  <div className="space-y-4 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/70">
                    <div>
                      <label className="font-semibold block mb-1 text-amber-950">
                        প্রধান মাদরাসা / জামিয়ার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={currentKhidmatOrInstitution}
                        onChange={e => setCurrentKhidmatOrInstitution(e.target.value)}
                        placeholder="যেমন: আল-জামিয়াতুল আহলিয়া দারুল উলুম মুঈনুল ইসলাম (হাটহাজারী) / জামিয়া নূরিয়া / জামিয়া ইমদাদিয়া"
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          মাদরাসা শিক্ষাবোর্ড *
                        </label>
                        <select
                          value={madrasaBoard}
                          onChange={e => setMadrasaBoard(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        >
                          {MADRASA_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          সর্বোচ্চ শিক্ষাগত সনদ / ডিগ্রি *
                        </label>
                        <select
                          value={highestSanadOrDegree}
                          onChange={e => setHighestSanadOrDegree(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        >
                          {MADRASA_SANADS_QAWMI.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          সনদ পাসের বিভাগ / ফলাফল
                        </label>
                        <select
                          value={sanadDivisionOrGpa}
                          onChange={e => setSanadDivisionOrGpa(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        >
                          {MADRASA_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">সনদ পাসের সন</label>
                        <input
                          type="text"
                          value={sanadPassingYear}
                          onChange={e => setSanadPassingYear(e.target.value)}
                          placeholder="e.g. 2022 / 2023"
                          className="w-full p-2.5 bg-white border rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          বিশেষ বিভাগ / তাকাহ্হুস (যদি থাকে)
                        </label>
                        <input
                          type="text"
                          value={specializationDept}
                          onChange={e => setSpecializationDept(e.target.value)}
                          placeholder="ইফতা (মুফতি), আদব (সাহিত্য), উলুমুল কুরআন"
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          ক্বিরাআত / তাজবীদ বিশেষ সনদ
                        </label>
                        <input
                          type="text"
                          value={qiratTajweedCertificate}
                          onChange={e => setQiratTajweedCertificate(e.target.value)}
                          placeholder="যেমন: ইজাযাহ / কারী সনদপত্র"
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-amber-200">
                        <input
                          type="checkbox"
                          checked={isHafiz}
                          onChange={e => setIsHafiz(e.target.checked)}
                          className="w-4 h-4 accent-amber-600 rounded"
                        />
                        <span className="font-bold text-xs text-amber-950">
                          ✓ আমি একজন হাফেজ-এ-কুরআন (সম্পূর্ণ ৩০ পারা হিফজ সম্পন্ন)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ALIA MADRASA STREAM FORM */}
                {tutorCategory === 'alia_madrasa' && (
                  <div className="space-y-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/70">
                    <div>
                      <label className="font-semibold block mb-1 text-emerald-950">
                        মাদ্রাসা / ইসলামি আরবি বিশ্ববিদ্যালয়ের নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={e => setUniversity(e.target.value)}
                        placeholder="যেমন: ঢাকা সরকারি মাদ্রাসা-ই-আলিয়া / দারুন্নাজাত সিদ্দিকিয়া কামিল মাদ্রাসা / ইসলামিক আরবি বিশ্ববিদ্যালয়"
                        className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">
                          বিভাগ / সাবজেক্ট *
                        </label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          placeholder="যেমন: আল-হাদিস / তাফসির / আল-ফিকহ / আরবি"
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">ডিগ্রি / শ্রেণি</label>
                        <select
                          value={programDegree}
                          onChange={e => setProgramDegree(e.target.value)}
                          className="w-full p-2.5 bg-white border rounded-xl text-xs"
                        >
                          {MADRASA_DEGREES_ALIA.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">আলিম (Alim) মাদ্রাসা ও GPA</label>
                        <input
                          type="text"
                          value={hscCollege}
                          onChange={e => setHscCollege(e.target.value)}
                          placeholder="মাদ্রাসার নাম"
                          className="w-full p-2 bg-white border rounded-xl mb-1 text-xs"
                        />
                        <input
                          type="text"
                          value={hscGpa}
                          onChange={e => setHscGpa(e.target.value)}
                          placeholder="GPA 5.00"
                          className="w-full p-2 bg-white border rounded-xl font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-semibold block mb-1 text-slate-800">দাখিল (Dakhil) মাদ্রাসা ও GPA</label>
                        <input
                          type="text"
                          value={sscSchool}
                          onChange={e => setSscSchool(e.target.value)}
                          placeholder="মাদ্রাসার নাম"
                          className="w-full p-2 bg-white border rounded-xl mb-1 text-xs"
                        />
                        <input
                          type="text"
                          value={sscGpa}
                          onChange={e => setSscGpa(e.target.value)}
                          placeholder="GPA 5.00"
                          className="w-full p-2 bg-white border rounded-xl font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={isHafiz}
                          onChange={e => setIsHafiz(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded"
                        />
                        <span className="font-bold text-xs text-emerald-950">
                          ✓ আমি একজন হাফেজ-এ-কুরআন (হিফজুল কুরআন সনদধারী)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* GENERAL UNIVERSITY STREAM FORM */}
                {tutorCategory === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-semibold block mb-1">University Name (বিশ্ববিদ্যালয়) *</label>
                      <input
                        type="text"
                        required
                        list="univ-options"
                        value={university}
                        onChange={e => setUniversity(e.target.value)}
                        placeholder="e.g. University of Dhaka / BUET / NSU"
                        className="w-full p-2.5 bg-slate-50 border rounded-xl"
                      />
                      <datalist id="univ-options">
                        {UNIVERSITIES_LIST.map(u => <option key={u} value={u} />)}
                      </datalist>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold block mb-1">Department / Subject *</label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          placeholder="e.g. Physics / EEE / English"
                          className="w-full p-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Degree</label>
                        <input
                          type="text"
                          value={programDegree}
                          onChange={e => setProgramDegree(e.target.value)}
                          placeholder="e.g. B.Sc. Honours / BBA"
                          className="w-full p-2.5 bg-slate-50 border rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="font-semibold block mb-1">HSC College & GPA</label>
                        <input
                          type="text"
                          value={hscCollege}
                          onChange={e => setHscCollege(e.target.value)}
                          placeholder="College Name"
                          className="w-full p-2 bg-slate-50 border rounded-xl mb-1"
                        />
                        <input
                          type="text"
                          value={hscGpa}
                          onChange={e => setHscGpa(e.target.value)}
                          placeholder="GPA 5.00"
                          className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">SSC School & GPA</label>
                        <input
                          type="text"
                          value={sscSchool}
                          onChange={e => setSscSchool(e.target.value)}
                          placeholder="School Name"
                          className="w-full p-2 bg-slate-50 border rounded-xl mb-1"
                        />
                        <input
                          type="text"
                          value={sscGpa}
                          onChange={e => setSscGpa(e.target.value)}
                          placeholder="GPA 5.00"
                          className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Teaching Experience */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 4: Teaching Experience</h3>
                <div>
                  <label className="font-semibold block mb-1">Years of Teaching Experience *</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teaching Methodology (পাঠদানের পদ্ধতি)</label>
                  <textarea
                    rows={3}
                    value={teachingMethod}
                    onChange={e => setTeachingMethod(e.target.value)}
                    placeholder="Explain how you simplify concepts and take regular quizzes..."
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Subjects & Classes */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 5: Classes & Subjects</h3>
                
                {/* Classes */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold block">Select Preferred Classes / Student Levels *</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomClass(!showCustomClass)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>+ Customise Class</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {CLASS_LEVELS.map(c => {
                      const sel = preferredClasses.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleItem(preferredClasses, setPreferredClasses, c)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            sel ? 'bg-blue-900 text-white border-blue-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{c}
                        </button>
                      );
                    })}
                  </div>
                  {showCustomClass && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Admission Test, O-Level, Madrasa, Special Care..."
                        value={customClass}
                        onChange={(e) => setCustomClass(e.target.value)}
                        className="flex-1 py-1 px-2.5 bg-amber-50/50 border border-amber-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customClass.trim() && !preferredClasses.includes(customClass.trim())) {
                            setPreferredClasses([...preferredClasses, customClass.trim()]);
                            setCustomClass('');
                          }
                        }}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Subjects */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold block">Select Preferred Subjects (সকল সাধারণ ও ইসলামি বিষয়) *</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomSubject(!showCustomSubject)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>+ Customise Subject</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {SUBJECTS_LIST.map(s => {
                      const sel = preferredSubjects.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleItem(preferredSubjects, setPreferredSubjects, s)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            sel ? 'bg-blue-900 text-white border-blue-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{s}
                        </button>
                      );
                    })}
                  </div>
                  {showCustomSubject && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Higher Math, Arabic Tajweed, Python Programming, Art..."
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="flex-1 py-1 px-2.5 bg-amber-50/50 border border-amber-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customSubject.trim() && !preferredSubjects.includes(customSubject.trim())) {
                            setPreferredSubjects([...preferredSubjects, customSubject.trim()]);
                            setCustomSubject('');
                          }
                        }}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Mediums with Customise (Requirement 2) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold block">Select Preferred Medium (কারিকুলাম / মাধ্যম) *</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomMedium(!showCustomMedium)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>+ Customise Medium</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {MEDIUMS.map(m => {
                      const sel = preferredMediums.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleItem(preferredMediums, setPreferredMediums, m)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            sel ? 'bg-blue-900 text-white border-blue-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{m}
                        </button>
                      );
                    })}
                  </div>
                  {showCustomMedium && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Cambridge IGCSE, Qawmi Hifz, Special Child Care..."
                        value={customMedium}
                        onChange={(e) => setCustomMedium(e.target.value)}
                        className="flex-1 py-1 px-2.5 bg-amber-50/50 border border-amber-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customMedium.trim() && !preferredMediums.includes(customMedium.trim())) {
                            setPreferredMediums([...preferredMediums, customMedium.trim()]);
                            setCustomMedium('');
                          }
                        }}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Step 6: Teaching Preferences */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 6: Preferences & Expected Fee</h3>
                <div>
                  <label className="font-semibold block mb-1">Expected Monthly Fee (BDT ৳) *</label>
                  <input
                    type="number"
                    min="2000"
                    max="25000"
                    step="500"
                    value={expectedSalary}
                    onChange={e => setExpectedSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm font-bold"
                  />
                </div>
                
                <div>
                  <label className="font-semibold block mb-1.5 text-xs text-slate-800">
                    পাঠদানের মোড (Tuition Modes) *
                  </label>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homeTuition}
                        onChange={e => setHomeTuition(e.target.checked)}
                        className="accent-blue-900 rounded"
                      />
                      <span>Home Tuition (ছাত্র/ছাত্রীর বাসায়)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlineTeaching}
                        onChange={e => setOnlineTeaching(e.target.checked)}
                        className="accent-blue-900 rounded"
                      />
                      <span>Online Tuition</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showCustomTuitionType}
                        onChange={e => setShowCustomTuitionType(e.target.checked)}
                        className="accent-amber-600 rounded"
                      />
                      <span className="font-bold text-amber-950 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Customise</span>
                      </span>
                    </label>
                  </div>

                  {showCustomTuitionType && (
                    <div className="mt-2.5 p-2.5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
                      <label className="text-[11px] font-bold text-amber-950 block">কাস্টম পাঠদান পদ্ধতি লিখুন:</label>
                      <input
                        type="text"
                        value={customTuitionType}
                        onChange={(e) => setCustomTuitionType(e.target.value)}
                        placeholder="যেমন: গ্রুপ কোচিং, সেন্টারে পড়ানো, স্পেশাল চাইল্ড কেয়ার..."
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Availability & Preferred Tutoring Areas (Requirement 3) */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 7: Schedule & Tutoring Areas</h3>
                
                {/* Requirement 3: কোন কোন এলাকায় টিউশন করতে চান */}
                <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2">
                  <div>
                    <label className="font-bold text-xs text-blue-950 block">
                      কোন কোন এলাকায় টিউশন করতে চান (Preferred Tutoring Areas) *
                    </label>
                    <p className="text-[11px] text-blue-800 mt-0.5">
                      অ্যাডমিন বা কোনো অভিভাবক এই এলাকায় নতুন টিউশন অফার পোস্ট করলে আপনি সাথে সাথে স্বয়ংক্রিয় নোটিফিকেশন পাবেন।
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-white rounded-xl border border-blue-200">
                    {preferredAreas.map(a => (
                      <span key={a} className="inline-flex items-center gap-1 bg-blue-900 text-white px-2 py-0.5 rounded-lg text-xs font-semibold">
                        <span>{a}</span>
                        <button
                          type="button"
                          onClick={() => setPreferredAreas(preferredAreas.filter(x => x !== a))}
                          className="hover:text-rose-200 font-bold ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {preferredAreas.length === 0 && (
                      <span className="text-xs text-slate-400 italic">কমপক্ষে একটি এলাকা যুক্ত করুন</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="পছন্দের এলাকার নাম লিখুন (যেমন: Dhanmondi, Mirpur, Uttara...)"
                      value={customArea}
                      onChange={e => setCustomArea(e.target.value)}
                      className="flex-1 py-1.5 px-3 bg-white border border-blue-300 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customArea.trim() && !preferredAreas.includes(customArea.trim())) {
                          setPreferredAreas([...preferredAreas, customArea.trim()]);
                          setCustomArea('');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Add Area
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] text-slate-500 self-center mr-1">Quick Select:</span>
                    {DHAKA_AREAS.slice(0, 8).map(a => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          if (!preferredAreas.includes(a)) setPreferredAreas([...preferredAreas, a]);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                          preferredAreas.includes(a) ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        + {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Available Daily Time</label>
                  <input
                    type="text"
                    value={availableTime}
                    onChange={e => setAvailableTime(e.target.value)}
                    placeholder="e.g. 5:00 PM - 7:30 PM"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1.5">Available Days of Week</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => {
                      const sel = availableDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleItem(availableDays, setAvailableDays, d)}
                          className={`px-3 py-1.5 rounded-xl border font-medium ${
                            sel ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Review & Submit */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 8: Review & Final Submission</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border space-y-1.5 text-xs text-slate-700">
                  <p><strong>Name:</strong> {fullName} ({gender})</p>
                  <p><strong>Phone:</strong> {mobileNumber} · <strong>Email:</strong> {email}</p>
                  <p><strong>University:</strong> {university} ({department})</p>
                  <p><strong>Present Address (বর্তমান ঠিকানা):</strong> {area}, {district}</p>
                  <p><strong>Expected Fee:</strong> ৳{expectedSalary}/month</p>
                  <p><strong>Preferred Subjects:</strong> {preferredSubjects.join(', ')}</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded accent-blue-900"
                    />
                    <span>
                      I certify that all educational information provided is authentic and agree to TutorHat Terms & Conditions.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-blue-800"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Tutor Registration</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* ===================== GUARDIAN FORM ===================== */}
        {role === 'guardian' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Guardian Registration Form</h3>
            
            <div>
              <label className="font-semibold block mb-1">Guardian Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Farhana Begum"
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl tabular-nums"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-900">District (জেলা - A to Z)</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium"
                >
                  {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">বাংলাদেশের ৬৪টি জেলা (A-Z)</span>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-900">Present Address (বর্তমান ঠিকানা / এলাকা)</label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="বাড়ি/রোড নম্বর, এলাকা বা থানা লিখুন"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-blue-900"
                />
                <span>I agree to TutorHat Terms & Conditions and Privacy Policy.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
            >
              Complete Guardian Registration
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
