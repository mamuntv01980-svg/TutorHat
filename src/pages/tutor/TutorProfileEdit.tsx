import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Eye,
  BookOpen,
  Building2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  store,
  getTutorSelectedCategories,
  getCategoryCvData,
  calculateOverallTutorProfileCompletion,
  TUTOR_CATEGORY_ORDER
} from '../../services/store';
import {
  BD_DISTRICTS,
  DHAKA_AREAS,
  MEDIUMS,
  CLASS_LEVELS,
  SUBJECTS_LIST,
  UNIVERSITIES_LIST,
  MADRASA_BOARDS,
  MADRASA_SANADS_QAWMI,
  MADRASA_DEGREES_ALIA,
  MADRASA_DIVISIONS
} from '../../constants/bangladeshData';
import {
  TutorCategoryType,
  GeneralTutorCvData,
  QawmiTutorCvData,
  AliaTutorCvData,
  TutorProfile
} from '../../types';
import { TutorPhotoUpload } from '../../components/tutor/TutorPhotoUpload';

const CATEGORY_META: Record<
  TutorCategoryType,
  { title: string; titleBn: string; badge: string; desc: string; border: string; bg: string }
> = {
  general: {
    title: 'General Tutor CV',
    titleBn: 'জেনারেল টিউটর সিভি',
    badge: 'General Tutor',
    desc: 'University, College/School Academics, Bangla/English Medium & English Version',
    border: 'border-blue-300',
    bg: 'bg-blue-50/70'
  },
  qawmi_madrasa: {
    title: 'Qawmi Madrasa Tutor CV',
    titleBn: 'কওমি মাদ্রাসা টিউটর সিভি',
    badge: 'Qawmi Madrasa Tutor',
    desc: 'Jamiah / Madrasa, Sanad/Dawra, Hifz, Tajweed, Qirat, Quran & Arabic',
    border: 'border-amber-300',
    bg: 'bg-amber-50/70'
  },
  alia_madrasa: {
    title: 'Alia Madrasa Tutor CV',
    titleBn: 'আলিয়া মাদ্রাসা টিউটর সিভি',
    badge: 'Alia Madrasa Tutor',
    desc: 'Dakhil, Alim, Fazil, Kamil, Board Results & Islamic Studies Subjects',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/70'
  }
};

const QAWMI_SUGGESTED_SUBJECTS = [
  'Holy Quran & Tajweed',
  'Noorani Quran (সহজ কুরআন শিক্ষা)',
  'Hifz Revision (হিফজ দৌড়/ইয়াদ)',
  'Arabic Grammar (নাহু ও সরফ)',
  'Arabic Spoken & Literature (আদব)',
  'Hadith & Usul-ul-Hadith',
  'Fiqh & Islamic Jurisprudence (ফিকহ)',
  'Tafsir & Usul-ut-Tafsir',
  'Masnun Dua & Salat',
  'Urdu & Farsi Kitab'
];

const ALIA_SUGGESTED_SUBJECTS = [
  'Holy Quran & Tajweed',
  'Arabic 1st & 2nd Paper',
  'Fiqh & Islamic Studies',
  'Hadith & Tafsir',
  'Bangla (1st & 2nd Paper)',
  'English (1st & 2nd Paper)',
  'Mathematics',
  'General Science',
  'ICT / Computer Studies',
  'Islamic History'
];

export const TutorProfileEdit: React.FC = () => {
  const { activeTutorProfile, storeState, navigateTo, language, currentUser, editingTutorCategory } = useApp();

  const currentUserTutor =
    currentUser?.role === 'tutor'
      ? storeState.tutors.find((t) => t.userId === currentUser.id)
      : undefined;
  const tutor = activeTutorProfile || currentUserTutor;

  if (!currentUser || currentUser.role !== 'tutor' || !tutor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-blue-950">
          {language === 'bn' ? 'সিভি সম্পাদনা করতে লগইন করুন' : 'Sign in to Edit Your Tutor CV'}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {language === 'bn' ? 'সাইন ইন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('register-tutor')}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Become a Tutor
          </button>
        </div>
      </div>
    );
  }

  const initialSelectedCats = getTutorSelectedCategories(tutor);
  const initialActiveCat: TutorCategoryType =
    editingTutorCategory || initialSelectedCats[0] || tutor.tutorCategory || 'general';

  // Basic Personal Information state (shared across tutor account)
  const [photo, setPhoto] = useState(tutor.photo || '');
  const [fullName, setFullName] = useState(tutor.fullName === 'New User' ? '' : (tutor.fullName || ''));
  const [gender, setGender] = useState<'male' | 'female'>(tutor.gender || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(tutor.dateOfBirth || '');
  const [phone, setPhone] = useState(tutor.phone || '');
  const [email, setEmail] = useState(tutor.email || '');
  const [district, setDistrict] = useState(tutor.district || '');
  const [area, setArea] = useState(tutor.area || '');
  const [currentAddress, setCurrentAddress] = useState(tutor.currentAddress || tutor.area || '');
  const [aboutMe, setAboutMe] = useState(tutor.aboutMe || '');

  // Selected categories & currently active CV form tab
  const [selectedCategories, setSelectedCategories] = useState<TutorCategoryType[]>(initialSelectedCats);
  const [activeCategory, setActiveCategory] = useState<TutorCategoryType>(initialActiveCat);

  // Separate persistent drafts for each category so switching never loses data
  const [generalDraft, setGeneralDraft] = useState<GeneralTutorCvData>(() =>
    getCategoryCvData(tutor, 'general')
  );
  const [qawmiDraft, setQawmiDraft] = useState<QawmiTutorCvData>(() =>
    getCategoryCvData(tutor, 'qawmi_madrasa')
  );
  const [aliaDraft, setAliaDraft] = useState<AliaTutorCvData>(() =>
    getCategoryCvData(tutor, 'alia_madrasa')
  );

  // Custom item input helpers
  const [customGeneralClass, setCustomGeneralClass] = useState('');
  const [customGeneralSubject, setCustomGeneralSubject] = useState('');
  const [customGeneralMedium, setCustomGeneralMedium] = useState('');
  const [customGeneralArea, setCustomGeneralArea] = useState('');

  const [customQawmiSubject, setCustomQawmiSubject] = useState('');
  const [customQawmiArea, setCustomQawmiArea] = useState('');

  const [customAliaSubject, setCustomAliaSubject] = useState('');
  const [customAliaArea, setCustomAliaArea] = useState('');

  const [savedMessage, setSavedMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live preview object for accurate real-time per-category & overall completion
  const previewTutor: Partial<TutorProfile> = useMemo(
    () => ({
      ...tutor,
      photo,
      fullName,
      gender,
      phone,
      email,
      district,
      area,
      currentAddress,
      aboutMe,
      selectedCategories,
      tutorCategory: activeCategory,
      categoryCvs: {
        ...(tutor.categoryCvs || {}),
        general: generalDraft,
        qawmi_madrasa: qawmiDraft,
        alia_madrasa: aliaDraft
      }
    }),
    [
      tutor,
      photo,
      fullName,
      gender,
      phone,
      email,
      district,
      area,
      currentAddress,
      aboutMe,
      selectedCategories,
      activeCategory,
      generalDraft,
      qawmiDraft,
      aliaDraft
    ]
  );

  const overallCompletion = useMemo(
    () => calculateOverallTutorProfileCompletion(previewTutor),
    [previewTutor]
  );

  const activeCategoryProgress = overallCompletion.categoriesProgress[activeCategory];

  const toggleListValue = (list: string[], value: string): string[] => {
    const clean = value.trim();
    if (!clean) return list;
    return list.includes(clean) ? list.filter((x) => x !== clean) : [...list, clean];
  };

  const handleToggleCategory = (category: TutorCategoryType) => {
    const isCurrentlySelected = selectedCategories.includes(category);
    const nextSelected = isCurrentlySelected
      ? selectedCategories.filter((c) => c !== category)
      : Array.from(new Set([...selectedCategories, category]));

    setSelectedCategories(nextSelected);
    store.toggleTutorCategory(tutor.id, category, !isCurrentlySelected);

    if (!isCurrentlySelected) {
      setActiveCategory(category);
    } else if (activeCategory === category && nextSelected.length > 0) {
      setActiveCategory(nextSelected[0]);
    }
  };

  const buildBasicUpdates = (): Partial<TutorProfile> => ({
    fullName: fullName.trim() || tutor.fullName,
    photo,
    gender,
    dateOfBirth,
    phone: phone.trim(),
    email: email.trim(),
    district,
    area: area.trim(),
    currentAddress: currentAddress.trim() || area.trim(),
    aboutMe
  });

  const handleSaveCategoryCv = (categoryToSave: TutorCategoryType) => {
    setErrorMsg('');
    const nextSelected = selectedCategories.includes(categoryToSave)
      ? selectedCategories
      : [...selectedCategories, categoryToSave];
    setSelectedCategories(nextSelected);

    const payload =
      categoryToSave === 'general'
        ? generalDraft
        : categoryToSave === 'qawmi_madrasa'
        ? qawmiDraft
        : aliaDraft;

    store.saveCategoryCv(tutor.id, categoryToSave, payload, buildBasicUpdates());
    setSavedMessage(
      `${CATEGORY_META[categoryToSave].badge} CV saved successfully!`
    );
    setTimeout(() => setSavedMessage(''), 3500);
  };

  const handleSaveBasicOnly = () => {
    setErrorMsg('');
    store.updateTutorProfile(tutor.id, {
      ...buildBasicUpdates(),
      selectedCategories
    });
    setSavedMessage('Basic personal details saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSubmitForVerification = () => {
    setErrorMsg('');
    if (!(fullName.trim() || tutor.fullName) || !phone.trim()) {
      setErrorMsg('অনুগ্রহ করে অন্তত আপনার পূর্ণ নাম এবং মোবাইল নম্বর লিখুন।');
      return;
    }

    const categoriesToPersist = selectedCategories.length > 0 ? selectedCategories : [activeCategory];
    setSelectedCategories(categoriesToPersist);

    const activePayload =
      activeCategory === 'general'
        ? generalDraft
        : activeCategory === 'qawmi_madrasa'
        ? qawmiDraft
        : aliaDraft;

    store.saveCategoryCv(tutor.id, activeCategory, activePayload, buildBasicUpdates());

    // Also persist any edits in other selected categories
    for (const cat of categoriesToPersist) {
      if (cat !== activeCategory) {
        const draft =
          cat === 'general' ? generalDraft : cat === 'qawmi_madrasa' ? qawmiDraft : aliaDraft;
        store.saveCategoryCv(tutor.id, cat, draft);
      }
    }

    store.submitTutorForVerification(tutor.id);
    setSavedMessage('Your Multi-Category CV has been saved and submitted for admin verification!');
    setTimeout(() => {
      navigateTo('tutor-dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('tutor-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-950 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tutor Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-blue-950">
            {language === 'bn' ? 'মাল্টি-ক্যাটাগরি টিউটর সিভি ফরম' : 'Multi-Category Tutor CV Builder'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'General, Qawmi ও Alia মাদ্রাসার জন্য আলাদা আলাদা সিভি পূরণ, এডিট ও সংরক্ষণ করুন।'
              : 'Select one or more tutor categories and complete each category CV separately.'}
          </p>
        </div>

        {/* Live Overall Completion Badge + View Profile */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => navigateTo('tutor-detail', { tutorId: tutor.id })}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-blue-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-700" />
            <span>View Profile</span>
          </button>
          <div className="bg-white p-2.5 px-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-xs tabular-nums ${
                overallCompletion.percent === 100 ? 'bg-emerald-600' : 'bg-blue-900'
              }`}
            >
              {overallCompletion.percent}%
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Overall Completion</span>
              <span className="text-xs font-bold text-blue-950">
                {overallCompletion.percent === 100
                  ? '✓ 100% Complete'
                  : `${overallCompletion.missing.length} required items left`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Overall + Per-Category Progress Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-sm text-blue-950">
              1. Tutor Category Selection (Select One or Multiple)
            </h2>
            <p className="text-[11px] text-slate-500">
              Deselecting a category never deletes your saved CV data—you can re-enable it anytime.
            </p>
          </div>
          <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Selected: {selectedCategories.length} of 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TUTOR_CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isSelected = selectedCategories.includes(cat);
            const isActiveTab = activeCategory === cat;
            const prog = overallCompletion.categoriesProgress[cat];

            return (
              <div
                key={cat}
                className={`rounded-2xl border p-4 space-y-2.5 transition-all ${
                  isActiveTab
                    ? `${meta.bg} ${meta.border} ring-2 ring-blue-900/15`
                    : isSelected
                    ? 'bg-white border-slate-300'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-blue-950">{meta.badge}</h3>
                    <p className="text-[11px] text-slate-500">{meta.titleBn}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    {isSelected ? 'Selected ✓' : 'Select Category'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-slate-600">CV Completion</span>
                    <span className={prog.percent === 100 ? 'text-emerald-700' : 'text-blue-950'}>
                      {prog.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 border border-slate-200 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        prog.percent === 100 ? 'bg-emerald-600' : 'bg-blue-900'
                      }`}
                      style={{ width: `${prog.percent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedCategories.includes(cat)) {
                      handleToggleCategory(cat);
                    } else {
                      setActiveCategory(cat);
                    }
                  }}
                  className={`w-full py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    isActiveTab
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-blue-950 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isActiveTab ? 'Currently Editing Below' : prog.percent < 100 ? 'Open & Complete CV' : 'Edit This CV'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Basic Profile Info (Shared) */}
      <div className="space-y-4">
        <TutorPhotoUpload
          currentPhoto={photo}
          tutorName={fullName || tutor.fullName}
          onPhotoChanged={(newPhotoUrl) => {
            setPhoto(newPhotoUrl);
            if (tutor.id) {
              store.updateTutorPhoto(tutor.id, newPhotoUrl);
            }
          }}
        />

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider">
                2. Basic Personal Information (সাধারণ ব্যক্তিগত তথ্য)
              </h2>
              <span className="text-[11px] text-slate-500">
                Basic Info Progress: <strong>{overallCompletion.basicPercent}%</strong>
                {overallCompletion.basicMissing.length > 0 && ` — Missing: ${overallCompletion.basicMissing.join(', ')}`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSaveBasicOnly}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-950 font-bold border border-slate-300 cursor-pointer self-start sm:self-auto"
            >
              Save Basic Info
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-900 block mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম লিখুন"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Mobile Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">District (জেলা) *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-medium"
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Present Area / Address *</label>
              <input
                type="text"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setCurrentAddress(e.target.value);
                }}
                placeholder="বাড়ি/রোড, এলাকা, থানা (যেমন: ধানমন্ডি / মিরপুর)"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-900 block mb-1">
              About Me / Teaching Bio (Minimum 20 characters) *
            </label>
            <textarea
              rows={2}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="আপনার পড়ানোর অভিজ্ঞতা ও শিক্ষাগত পরিচয় সংক্ষেপে লিখুন..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Dedicated Category CV Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        {/* Category Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex flex-wrap gap-2">
            {TUTOR_CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isActive = activeCategory === cat;
              const isSelected = selectedCategories.includes(cat);
              const prog = overallCompletion.categoriesProgress[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{meta.title}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isSelected
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {prog.percent}%
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleSaveCategoryCv(activeCategory)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save {CATEGORY_META[activeCategory].badge} CV</span>
          </button>
        </div>

        {/* Dedicated Category Completion Tracker */}
        <div
          className={`p-4 rounded-2xl border space-y-2 ${
            activeCategoryProgress.percent === 100
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-950 text-sm">
              {CATEGORY_META[activeCategory].title} Progress: {activeCategoryProgress.percent}%
            </span>
            <span className="text-[11px] font-bold text-slate-700">
              {activeCategoryProgress.completedCount} / {activeCategoryProgress.totalRequired} required completed
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2.5 border border-slate-200 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeCategoryProgress.percent === 100 ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
              style={{ width: `${activeCategoryProgress.percent}%` }}
            />
          </div>
          {activeCategoryProgress.missing.length > 0 ? (
            <p className="text-[11px] text-rose-800 leading-relaxed">
              <strong>Missing Required Fields:</strong> {activeCategoryProgress.missing.join(' • ')}
            </p>
          ) : (
            <p className="text-[11px] text-emerald-800 font-semibold">
              ✓ All required fields for {CATEGORY_META[activeCategory].title} are complete (optional fields do not block 100%).
            </p>
          )}
        </div>

        {/* ===================================================== */}
        {/* FORM A: GENERAL TUTOR CV                              */}
        {/* ===================================================== */}
        {activeCategory === 'general' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <h3 className="font-bold text-blue-950 text-xs uppercase flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Academic Qualifications & University Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">University / Institution Name *</label>
                  <input
                    type="text"
                    list="general-univ-list"
                    value={generalDraft.institution}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, institution: e.target.value }))}
                    placeholder="e.g. University of Dhaka / BUET"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <datalist id="general-univ-list">
                    {UNIVERSITIES_LIST.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department / Major *</label>
                  <input
                    type="text"
                    value={generalDraft.department}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. CSE / Physics / English"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Degree Program (Optional)</label>
                  <input
                    type="text"
                    value={generalDraft.programDegree || ''}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, programDegree: e.target.value }))}
                    placeholder="e.g. B.Sc. / B.A. Honours"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Year / Semester (Optional)</label>
                  <input
                    type="text"
                    value={generalDraft.currentYearSemester || ''}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, currentYearSemester: e.target.value }))}
                    placeholder="e.g. 3rd Year / Completed"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* HSC & SSC Exam Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase">HSC Examination Details *</h4>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={generalDraft.hsc.schoolOrCollege}
                    onChange={(e) =>
                      setGeneralDraft((p) => ({
                        ...p,
                        hsc: { ...p.hsc, schoolOrCollege: e.target.value }
                      }))
                    }
                    placeholder="College Name *"
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={generalDraft.hsc.board || 'Dhaka'}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          hsc: { ...p.hsc, board: e.target.value }
                        }))
                      }
                      placeholder="Board"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={generalDraft.hsc.gpa}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          hsc: { ...p.hsc, gpa: e.target.value }
                        }))
                      }
                      placeholder="GPA *"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={generalDraft.hsc.passingYear}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          hsc: { ...p.hsc, passingYear: e.target.value }
                        }))
                      }
                      placeholder="Year *"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase">SSC Examination Details *</h4>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={generalDraft.ssc.schoolOrCollege}
                    onChange={(e) =>
                      setGeneralDraft((p) => ({
                        ...p,
                        ssc: { ...p.ssc, schoolOrCollege: e.target.value }
                      }))
                    }
                    placeholder="School Name *"
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={generalDraft.ssc.board || 'Dhaka'}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          ssc: { ...p.ssc, board: e.target.value }
                        }))
                      }
                      placeholder="Board"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={generalDraft.ssc.gpa}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          ssc: { ...p.ssc, gpa: e.target.value }
                        }))
                      }
                      placeholder="GPA *"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={generalDraft.ssc.passingYear}
                      onChange={(e) =>
                        setGeneralDraft((p) => ({
                          ...p,
                          ssc: { ...p.ssc, passingYear: e.target.value }
                        }))
                      }
                      placeholder="Year *"
                      className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mediums (Bangla Medium, English Medium, English Version) */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">
                Preferred Mediums * (Bangla Medium, English Medium, English Version)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {['Bangla Medium', 'English Medium', 'English Version', ...MEDIUMS.slice(0, 3)].map((m, idx, arr) => {
                  if (arr.indexOf(m) !== idx) return null;
                  const active = generalDraft.preferredMediums.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredMediums: toggleListValue(p.preferredMediums, m)
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {m}
                    </button>
                  );
                })}
                {generalDraft.preferredMediums
                  .filter((m) => !['Bangla Medium', 'English Medium', 'English Version', ...MEDIUMS].includes(m))
                  .map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredMediums: toggleListValue(p.preferredMediums, m)
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl border text-xs font-medium bg-blue-900 text-white border-blue-900 cursor-pointer"
                    >
                      ✓ {m}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGeneralMedium}
                  onChange={(e) => setCustomGeneralMedium(e.target.value)}
                  placeholder="Add custom medium (e.g. IB, Edexcel)"
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGeneralMedium.trim()) {
                      setGeneralDraft((p) => ({
                        ...p,
                        preferredMediums: Array.from(new Set([...p.preferredMediums, customGeneralMedium.trim()]))
                      }));
                      setCustomGeneralMedium('');
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Class Levels */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Class Levels *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {CLASS_LEVELS.slice(0, 16).map((cls) => {
                  const active = generalDraft.preferredClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredClasses: toggleListValue(p.preferredClasses, cls)
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {cls}
                    </button>
                  );
                })}
                {generalDraft.preferredClasses
                  .filter((c) => !CLASS_LEVELS.includes(c))
                  .map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredClasses: toggleListValue(p.preferredClasses, cls)
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl border text-xs font-medium bg-blue-900 text-white border-blue-900 cursor-pointer"
                    >
                      ✓ {cls}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGeneralClass}
                  onChange={(e) => setCustomGeneralClass(e.target.value)}
                  placeholder="Add custom class level (e.g. Admission / IELTS)"
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGeneralClass.trim()) {
                      setGeneralDraft((p) => ({
                        ...p,
                        preferredClasses: Array.from(new Set([...p.preferredClasses, customGeneralClass.trim()]))
                      }));
                      setCustomGeneralClass('');
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Subjects */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Subjects *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUBJECTS_LIST.slice(0, 14).map((sub) => {
                  const active = generalDraft.preferredSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredSubjects: toggleListValue(p.preferredSubjects, sub)
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {sub}
                    </button>
                  );
                })}
                {generalDraft.preferredSubjects
                  .filter((s) => !SUBJECTS_LIST.slice(0, 14).includes(s))
                  .map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredSubjects: toggleListValue(p.preferredSubjects, sub)
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl border text-xs font-medium bg-blue-900 text-white border-blue-900 cursor-pointer"
                    >
                      ✓ {sub}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGeneralSubject}
                  onChange={(e) => setCustomGeneralSubject(e.target.value)}
                  placeholder="Add custom subject (e.g. Statistics, Coding)"
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGeneralSubject.trim()) {
                      setGeneralDraft((p) => ({
                        ...p,
                        preferredSubjects: Array.from(new Set([...p.preferredSubjects, customGeneralSubject.trim()]))
                      }));
                      setCustomGeneralSubject('');
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Experience, Salary & Tuition Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Teaching Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={generalDraft.teachingExperienceYears}
                  onChange={(e) =>
                    setGeneralDraft((p) => ({ ...p, teachingExperienceYears: Number(e.target.value) }))
                  }
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Expected Monthly Salary (৳) *</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={generalDraft.expectedSalary}
                  onChange={(e) =>
                    setGeneralDraft((p) => ({ ...p, expectedSalary: Number(e.target.value) }))
                  }
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Preferred Student Gender (Optional)</label>
                <select
                  value={generalDraft.preferredStudentGender || 'any'}
                  onChange={(e) =>
                    setGeneralDraft((p) => ({
                      ...p,
                      preferredStudentGender: e.target.value as 'any' | 'male' | 'female'
                    }))
                  }
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="any">Any</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                </select>
              </div>
            </div>

            {/* Tuition Modes */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="font-semibold text-slate-900 block">Tuition Preferences & Modes (Optional)</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(generalDraft.homeTuition)}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, homeTuition: e.target.checked }))}
                    className="accent-blue-900"
                  />
                  <span>Home Tuition</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(generalDraft.onlineTuition)}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, onlineTuition: e.target.checked }))}
                    className="accent-blue-900"
                  />
                  <span>Online Tuition</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(generalDraft.coachingTuition)}
                    onChange={(e) => setGeneralDraft((p) => ({ ...p, coachingTuition: e.target.checked }))}
                    className="accent-blue-900"
                  />
                  <span>Coaching / Batch</span>
                </label>
              </div>
              <input
                type="text"
                value={generalDraft.teachingMethod || ''}
                onChange={(e) => setGeneralDraft((p) => ({ ...p, teachingMethod: e.target.value }))}
                placeholder="Teaching method or schedule notes (optional)"
                className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Preferred Areas */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Preferred Tuition Areas *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {generalDraft.preferredAreas.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 bg-blue-900 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredAreas: p.preferredAreas.filter((x) => x !== a)
                        }))
                      }
                      className="font-bold hover:text-rose-200 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customGeneralArea}
                  onChange={(e) => setCustomGeneralArea(e.target.value)}
                  placeholder="Type area (e.g. Dhanmondi, Mirpur, Uttara)..."
                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGeneralArea.trim()) {
                      setGeneralDraft((p) => ({
                        ...p,
                        preferredAreas: Array.from(new Set([...p.preferredAreas, customGeneralArea.trim()]))
                      }));
                      setCustomGeneralArea('');
                    }
                  }}
                  className="px-3.5 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add Area
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {DHAKA_AREAS.slice(0, 12).map((a) => {
                  const active = generalDraft.preferredAreas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        setGeneralDraft((p) => ({
                          ...p,
                          preferredAreas: toggleListValue(p.preferredAreas, a)
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                        active ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* FORM B: QAWMI MADRASA TUTOR CV                        */}
        {/* ===================================================== */}
        {activeCategory === 'qawmi_madrasa' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <h3 className="font-bold text-amber-950 text-xs uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Qawmi Madrasa Qualifications & Examination Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Madrasa / Jamiah Name *</label>
                  <input
                    type="text"
                    value={qawmiDraft.madrasaName}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, madrasaName: e.target.value }))}
                    placeholder="যেমন: জামিয়া আরাবিয়া / দারুল উলূম..."
                    className="w-full py-2.5 px-3 bg-white border border-amber-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Education Level / Sanad *</label>
                  <select
                    value={qawmiDraft.educationLevel}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, educationLevel: e.target.value }))}
                    className="w-full py-2.5 px-3 bg-white border border-amber-200 rounded-xl text-xs font-medium"
                  >
                    <option value="">সর্বোচ্চ স্তর নির্বাচন করুন</option>
                    {MADRASA_SANADS_QAWMI.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Qawmi Madrasa Board *</label>
                  <select
                    value={qawmiDraft.madrasaBoard}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, madrasaBoard: e.target.value }))}
                    className="w-full py-2.5 px-3 bg-white border border-amber-200 rounded-xl text-xs"
                  >
                    <option value="">বোর্ড নির্বাচন করুন</option>
                    {MADRASA_BOARDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Exam Division / Result *</label>
                  <select
                    value={qawmiDraft.examDivisionOrResult}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, examDivisionOrResult: e.target.value }))}
                    className="w-full py-2.5 px-3 bg-white border border-amber-200 rounded-xl text-xs"
                  >
                    <option value="">বিভাগ / ফলাফল নির্বাচন করুন</option>
                    {MADRASA_DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Passing Year (Optional)</label>
                  <input
                    type="text"
                    value={qawmiDraft.passingYear || ''}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, passingYear: e.target.value }))}
                    placeholder="e.g. 2022 / 1444 Hijri"
                    className="w-full py-2.5 px-3 bg-white border border-amber-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Hifz, Tajweed, Quran & Arabic Skills */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 uppercase">Hifz, Tajweed, Quran & Arabic Skills *</h4>
              <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-white rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={Boolean(qawmiDraft.isHafiz)}
                  onChange={(e) => setQawmiDraft((p) => ({ ...p, isHafiz: e.target.checked }))}
                  className="accent-amber-700 w-4 h-4"
                />
                <span className="font-bold text-amber-950">I am Hafiz-e-Quran (হাফেজ-এ-কুরআন - পূর্ণ ৩০ পারা)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Tajweed & Qirat Certification / Skill *
                  </label>
                  <input
                    type="text"
                    value={qawmiDraft.tajweedQiratSkill}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, tajweedQiratSkill: e.target.value }))}
                    placeholder="যেমন: হুসনে সউত / নূরানী ও তাজবীদ মুআল্লিম প্রশিক্ষণপ্রাপ্ত"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Quran & Arabic Specialization Skills *
                  </label>
                  <input
                    type="text"
                    value={qawmiDraft.quranArabicSkills}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, quranArabicSkills: e.target.value }))}
                    placeholder="যেমন: কুরআন তাজবীদ, নাহু-সরফ, আরবি সাহিত্য ও ফিকহ"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Hifz / Qirat Additional Details (Optional)</label>
                <input
                  type="text"
                  value={qawmiDraft.hifzDetails || ''}
                  onChange={(e) => setQawmiDraft((p) => ({ ...p, hifzDetails: e.target.value }))}
                  placeholder="Optional: Hifz completion year, Wafaq position, etc."
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Qawmi Subjects */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Qawmi Teaching Subjects *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QAWMI_SUGGESTED_SUBJECTS.map((sub) => {
                  const active = qawmiDraft.qawmiSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setQawmiDraft((p) => ({
                          ...p,
                          qawmiSubjects: toggleListValue(p.qawmiSubjects, sub)
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active ? 'bg-amber-700 text-white border-amber-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {sub}
                    </button>
                  );
                })}
                {qawmiDraft.qawmiSubjects
                  .filter((s) => !QAWMI_SUGGESTED_SUBJECTS.includes(s))
                  .map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setQawmiDraft((p) => ({
                          ...p,
                          qawmiSubjects: toggleListValue(p.qawmiSubjects, sub)
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl border text-xs font-medium bg-amber-700 text-white border-amber-700 cursor-pointer"
                    >
                      ✓ {sub}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQawmiSubject}
                  onChange={(e) => setCustomQawmiSubject(e.target.value)}
                  placeholder="Add custom Qawmi subject (e.g. Mishkat, Bukhari, Qaida)..."
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customQawmiSubject.trim()) {
                      setQawmiDraft((p) => ({
                        ...p,
                        qawmiSubjects: Array.from(new Set([...p.qawmiSubjects, customQawmiSubject.trim()]))
                      }));
                      setCustomQawmiSubject('');
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Experience, Areas, Tuition Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Teaching Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={qawmiDraft.teachingExperienceYears}
                  onChange={(e) =>
                    setQawmiDraft((p) => ({ ...p, teachingExperienceYears: Number(e.target.value) }))
                  }
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Expected Monthly Hadiya / Salary (৳) *</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={qawmiDraft.expectedSalary}
                  onChange={(e) => setQawmiDraft((p) => ({ ...p, expectedSalary: Number(e.target.value) }))}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Tuition Preferences *</label>
              <div className="flex flex-wrap gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(qawmiDraft.homeTuition)}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, homeTuition: e.target.checked }))}
                    className="accent-amber-700"
                  />
                  <span>Home Quran/Kitab Tuition</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(qawmiDraft.onlineTuition)}
                    onChange={(e) => setQawmiDraft((p) => ({ ...p, onlineTuition: e.target.checked }))}
                    className="accent-amber-700"
                  />
                  <span>Online Quran Teaching</span>
                </label>
              </div>
              <input
                type="text"
                value={qawmiDraft.tuitionPreferences}
                onChange={(e) => setQawmiDraft((p) => ({ ...p, tuitionPreferences: e.target.value }))}
                placeholder="e.g. Morning Fajr to 9 AM or Evening, 5 days/week Home/Online"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Preferred Teaching Areas */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Preferred Teaching Areas *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {qawmiDraft.preferredAreas.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 bg-amber-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQawmiDraft((p) => ({
                          ...p,
                          preferredAreas: p.preferredAreas.filter((x) => x !== a)
                        }))
                      }
                      className="font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customQawmiArea}
                  onChange={(e) => setCustomQawmiArea(e.target.value)}
                  placeholder="Type teaching area (e.g. Jatrabari, Mohammadpur, Mirpur)..."
                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customQawmiArea.trim()) {
                      setQawmiDraft((p) => ({
                        ...p,
                        preferredAreas: Array.from(new Set([...p.preferredAreas, customQawmiArea.trim()]))
                      }));
                      setCustomQawmiArea('');
                    }
                  }}
                  className="px-3.5 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add Area
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {DHAKA_AREAS.slice(0, 10).map((a) => {
                  const active = qawmiDraft.preferredAreas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        setQawmiDraft((p) => ({
                          ...p,
                          preferredAreas: toggleListValue(p.preferredAreas, a)
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                        active ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* FORM C: ALIA MADRASA TUTOR CV                         */}
        {/* ===================================================== */}
        {activeCategory === 'alia_madrasa' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-950 text-xs uppercase flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>Alia Madrasa Qualifications & Board Examination Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Alia Madrasa Name *</label>
                  <input
                    type="text"
                    value={aliaDraft.madrasaName}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, madrasaName: e.target.value }))}
                    placeholder="যেমন: সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা / তামীরুল মিল্লাত"
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Education Level *</label>
                  <input
                    type="text"
                    value={aliaDraft.educationLevel}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, educationLevel: e.target.value }))}
                    placeholder="e.g. Kamil Honours / Fazil 3rd Year / Alim Completed"
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Degree / Qualification (Dakhil / Alim / Fazil / Kamil) *
                  </label>
                  <select
                    value={aliaDraft.highestDegree}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, highestDegree: e.target.value }))}
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs font-medium"
                  >
                    <option value="">ডিগ্রি নির্বাচন করুন</option>
                    {MADRASA_DEGREES_ALIA.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Board / Islamic Arabic University *</label>
                  <select
                    value={aliaDraft.boardName}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, boardName: e.target.value }))}
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs"
                  >
                    <option value="">বোর্ড নির্বাচন করুন</option>
                    {MADRASA_BOARDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Examination Year *</label>
                  <input
                    type="text"
                    value={aliaDraft.examYear}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, examYear: e.target.value }))}
                    placeholder="e.g. 2023"
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Result / GPA / Division *</label>
                  <input
                    type="text"
                    value={aliaDraft.examResult}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, examResult: e.target.value }))}
                    placeholder="e.g. GPA 5.00 / 1st Class"
                    className="w-full py-2.5 px-3 bg-white border border-emerald-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Optional Dakhil & Alim Academic Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Dakhil Details (Optional)</span>
                <input
                  type="text"
                  value={aliaDraft.dakhilInfo?.schoolOrCollege || ''}
                  onChange={(e) =>
                    setAliaDraft((p) => ({
                      ...p,
                      dakhilInfo: {
                        schoolOrCollege: e.target.value,
                        board: p.dakhilInfo?.board || 'Madrasa Board',
                        gpa: p.dakhilInfo?.gpa || '',
                        passingYear: p.dakhilInfo?.passingYear || ''
                      }
                    }))
                  }
                  placeholder="Dakhil Madrasa Name (Optional)"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={aliaDraft.dakhilInfo?.gpa || ''}
                    onChange={(e) =>
                      setAliaDraft((p) => ({
                        ...p,
                        dakhilInfo: {
                          schoolOrCollege: p.dakhilInfo?.schoolOrCollege || '',
                          board: p.dakhilInfo?.board || 'Madrasa Board',
                          gpa: e.target.value,
                          passingYear: p.dakhilInfo?.passingYear || ''
                        }
                      }))
                    }
                    placeholder="Dakhil GPA"
                    className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={aliaDraft.dakhilInfo?.passingYear || ''}
                    onChange={(e) =>
                      setAliaDraft((p) => ({
                        ...p,
                        dakhilInfo: {
                          schoolOrCollege: p.dakhilInfo?.schoolOrCollege || '',
                          board: p.dakhilInfo?.board || 'Madrasa Board',
                          gpa: p.dakhilInfo?.gpa || '',
                          passingYear: e.target.value
                        }
                      }))
                    }
                    placeholder="Dakhil Year"
                    className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Alim Details (Optional)</span>
                <input
                  type="text"
                  value={aliaDraft.alimInfo?.schoolOrCollege || ''}
                  onChange={(e) =>
                    setAliaDraft((p) => ({
                      ...p,
                      alimInfo: {
                        schoolOrCollege: e.target.value,
                        board: p.alimInfo?.board || 'Madrasa Board',
                        gpa: p.alimInfo?.gpa || '',
                        passingYear: p.alimInfo?.passingYear || ''
                      }
                    }))
                  }
                  placeholder="Alim Madrasa Name (Optional)"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={aliaDraft.alimInfo?.gpa || ''}
                    onChange={(e) =>
                      setAliaDraft((p) => ({
                        ...p,
                        alimInfo: {
                          schoolOrCollege: p.alimInfo?.schoolOrCollege || '',
                          board: p.alimInfo?.board || 'Madrasa Board',
                          gpa: e.target.value,
                          passingYear: p.alimInfo?.passingYear || ''
                        }
                      }))
                    }
                    placeholder="Alim GPA"
                    className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={aliaDraft.alimInfo?.passingYear || ''}
                    onChange={(e) =>
                      setAliaDraft((p) => ({
                        ...p,
                        alimInfo: {
                          schoolOrCollege: p.alimInfo?.schoolOrCollege || '',
                          board: p.alimInfo?.board || 'Madrasa Board',
                          gpa: p.alimInfo?.gpa || '',
                          passingYear: e.target.value
                        }
                      }))
                    }
                    placeholder="Alim Year"
                    className="py-2 px-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Alia Teaching Subjects */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Teaching Subjects *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ALIA_SUGGESTED_SUBJECTS.map((sub) => {
                  const active = aliaDraft.teachingSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setAliaDraft((p) => ({
                          ...p,
                          teachingSubjects: toggleListValue(p.teachingSubjects, sub)
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {sub}
                    </button>
                  );
                })}
                {aliaDraft.teachingSubjects
                  .filter((s) => !ALIA_SUGGESTED_SUBJECTS.includes(s))
                  .map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() =>
                        setAliaDraft((p) => ({
                          ...p,
                          teachingSubjects: toggleListValue(p.teachingSubjects, sub)
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl border text-xs font-medium bg-emerald-700 text-white border-emerald-700 cursor-pointer"
                    >
                      ✓ {sub}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAliaSubject}
                  onChange={(e) => setCustomAliaSubject(e.target.value)}
                  placeholder="Add custom Alia subject (e.g. Balagat, Mantik, Economics)..."
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAliaSubject.trim()) {
                      setAliaDraft((p) => ({
                        ...p,
                        teachingSubjects: Array.from(new Set([...p.teachingSubjects, customAliaSubject.trim()]))
                      }));
                      setCustomAliaSubject('');
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Experience, Salary & Tuition Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Teaching Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={aliaDraft.teachingExperienceYears}
                  onChange={(e) =>
                    setAliaDraft((p) => ({ ...p, teachingExperienceYears: Number(e.target.value) }))
                  }
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-900 block mb-1">Expected Monthly Salary (৳) *</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={aliaDraft.expectedSalary}
                  onChange={(e) => setAliaDraft((p) => ({ ...p, expectedSalary: Number(e.target.value) }))}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Tuition Preferences *</label>
              <div className="flex flex-wrap gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(aliaDraft.homeTuition)}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, homeTuition: e.target.checked }))}
                    className="accent-emerald-700"
                  />
                  <span>Home Tuition</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(aliaDraft.onlineTuition)}
                    onChange={(e) => setAliaDraft((p) => ({ ...p, onlineTuition: e.target.checked }))}
                    className="accent-emerald-700"
                  />
                  <span>Online Tuition</span>
                </label>
              </div>
              <input
                type="text"
                value={aliaDraft.tuitionPreferences}
                onChange={(e) => setAliaDraft((p) => ({ ...p, tuitionPreferences: e.target.value }))}
                placeholder="e.g. Dakhil/Alim Arabic & General subjects, 4 days/week"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Preferred Tuition Areas */}
            <div>
              <label className="font-bold text-slate-900 block mb-2">Preferred Tuition Areas *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {aliaDraft.preferredAreas.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-semibold"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAliaDraft((p) => ({
                          ...p,
                          preferredAreas: p.preferredAreas.filter((x) => x !== a)
                        }))
                      }
                      className="font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={customAliaArea}
                  onChange={(e) => setCustomAliaArea(e.target.value)}
                  placeholder="Type area (e.g. Motijheel, Badda, Uttara)..."
                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAliaArea.trim()) {
                      setAliaDraft((p) => ({
                        ...p,
                        preferredAreas: Array.from(new Set([...p.preferredAreas, customAliaArea.trim()]))
                      }));
                      setCustomAliaArea('');
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add Area
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {DHAKA_AREAS.slice(0, 10).map((a) => {
                  const active = aliaDraft.preferredAreas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        setAliaDraft((p) => ({
                          ...p,
                          preferredAreas: toggleListValue(p.preferredAreas, a)
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                        active ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => handleSaveCategoryCv(activeCategory)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save {CATEGORY_META[activeCategory].badge} CV ({activeCategoryProgress.percent}%)</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitForVerification}
            className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save & Submit for Verification (Overall {overallCompletion.percent}%)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
