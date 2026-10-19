import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  Heart, 
  SlidersHorizontal, 
  X,
  PhoneCall,
  Check,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  BD_DISTRICTS, 
  DHAKA_AREAS, 
  MEDIUMS, 
  SUBJECTS_LIST, 
  CLASS_LEVELS 
} from '../constants/bangladeshData';
import { TRANSLATIONS } from '../constants/translations';
import { TutorVerificationBadge } from '../components/common/TutorVerificationBadge';
import { BookDemoModal } from '../components/demo/BookDemoModal';
import { ChatBoxModal } from '../components/chat/ChatBoxModal';
import { TutorProfile } from '../types';

export const FindTutorPage: React.FC = () => {
  const { storeState, navigateTo, language, isShortlisted, toggleShortlist, settings } = useApp();
  const [selectedDemoTutor, setSelectedDemoTutor] = useState<TutorProfile | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedChatTutor, setSelectedChatTutor] = useState<TutorProfile | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'alia_madrasa' | 'qawmi_madrasa'>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'home' | 'online'>('all');
  const [maxSalary, setMaxSalary] = useState<number>(15000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating_desc' | 'salary_asc' | 'salary_desc' | 'experience_desc'>('rating_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Filter tutors based on criteria
  const filteredTutors = useMemo(() => {
    return storeState.tutors.filter((tutor) => {
      // Strictly require admin verification: pending/draft tutors only appear after admin approves
      if (tutor.verificationStatus !== 'verified') {
        return false;
      }

      // Feature 1: Only Verified Tutors filter
      if (onlyVerified && tutor.verificationStatus !== 'verified') {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = tutor.fullName.toLowerCase().includes(term);
        const matchUni = tutor.university.toLowerCase().includes(term);
        const matchSub = tutor.preferredSubjects.some(s => s.toLowerCase().includes(term));
        const matchArea = 
          tutor.area.toLowerCase().includes(term) || 
          (tutor.currentAddress && tutor.currentAddress.toLowerCase().includes(term)) ||
          tutor.preferredAreas.some(a => a.toLowerCase().includes(term));
        if (!matchName && !matchUni && !matchSub && !matchArea) return false;
      }

      // Category filter (General, Alia Madrasa, Qawmi Madrasa)
      if (selectedCategory !== 'all' && (tutor.tutorCategory || 'general') !== selectedCategory) {
        return false;
      }

      // District
      if (selectedDistrict !== 'All' && tutor.district !== selectedDistrict) {
        return false;
      }

      // Area (Present Address or Preferred Areas across Bangladesh)
      if (selectedArea !== 'All' && selectedArea.trim() !== '') {
        const areaQuery = selectedArea.toLowerCase();
        const matchesArea = 
          tutor.area.toLowerCase().includes(areaQuery) || 
          (tutor.currentAddress && tutor.currentAddress.toLowerCase().includes(areaQuery)) ||
          tutor.preferredAreas.some(a => a.toLowerCase().includes(areaQuery));
        if (!matchesArea) return false;
      }

      // Medium
      if (selectedMedium !== 'All' && !tutor.preferredMediums.includes(selectedMedium)) {
        return false;
      }

      // Class
      if (selectedClass !== 'All' && !tutor.preferredClasses.includes(selectedClass)) {
        return false;
      }

      // Subject
      if (selectedSubject !== 'All' && !tutor.preferredSubjects.includes(selectedSubject)) {
        return false;
      }

      // Gender
      if (selectedGender !== 'all' && tutor.gender !== selectedGender) {
        return false;
      }

      // Mode
      if (selectedMode === 'home' && !tutor.homeTuition) return false;
      if (selectedMode === 'online' && !tutor.onlineTeaching) return false;

      // Salary
      if (tutor.expectedSalary > maxSalary) {
        return false;
      }

      return true;
    });
  }, [
    storeState.tutors, 
    storeState.settings.requireTutorVerificationToPublish,
    searchTerm, 
    selectedDistrict, 
    selectedArea, 
    selectedMedium, 
    selectedClass, 
    selectedSubject, 
    selectedGender, 
    selectedMode, 
    maxSalary
  ]);

  const sortedTutors = useMemo(() => {
    return [...filteredTutors].sort((a, b) => {
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'salary_asc') return a.expectedSalary - b.expectedSalary;
      if (sortBy === 'salary_desc') return b.expectedSalary - a.expectedSalary;
      if (sortBy === 'experience_desc') return b.teachingExperienceYears - a.teachingExperienceYears;
      return 0;
    });
  }, [filteredTutors, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedTutors.length / ITEMS_PER_PAGE));
  const paginatedTutors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTutors.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTutors, currentPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDistrict('All');
    setSelectedArea('All');
    setSelectedMedium('All');
    setSelectedClass('All');
    setSelectedSubject('All');
    setSelectedGender('all');
    setSelectedMode('all');
    setMaxSalary(15000);
  };

  const filterControls = (
    <div className="space-y-5 text-xs text-slate-700">
      
      {/* Search Input */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'নাম, বিষয় বা বিশ্ববিদ্যালয়' : 'Keyword Search'}
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'যেমন: BUET, Physics, ধানমন্ডি...' : 'e.g. BUET, Physics, Dhanmondi...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
          />
        </div>
      </div>

      {/* District & Area */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'জেলা (A to Z - ৬৪ জেলা)' : 'District (A-Z - All 64)'}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs font-medium"
        >
          <option value="All">All Districts (সকল জেলা)</option>
          {BD_DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'এলাকা / বর্তমান ঠিকানা' : 'Area / Present Address'}
        </label>
        <div className="relative">
          <input
            type="text"
            list="bd-filter-areas"
            value={selectedArea === 'All' ? '' : selectedArea}
            onChange={(e) => setSelectedArea(e.target.value ? e.target.value : 'All')}
            placeholder={language === 'bn' ? 'যেকোনো এলাকা বা ঠিকানা লিখুন...' : 'Type any area or address...'}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs"
          />
          {selectedArea !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedArea('All')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
          <datalist id="bd-filter-areas">
            {DHAKA_AREAS.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Medium */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'মাধ্যম' : 'Curriculum / Medium'}
        </label>
        <select
          value={selectedMedium}
          onChange={(e) => setSelectedMedium(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs"
        >
          <option value="All">All Mediums</option>
          {MEDIUMS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'বিষয়' : 'Subject'}
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none text-xs"
        >
          <option value="All">All Subjects</option>
          {SUBJECTS_LIST.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Gender Segmented Control */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'শিক্ষকের লিঙ্গ' : 'Tutor Gender'}
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          {(['all', 'male', 'female'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGender(g)}
              className={`py-1.5 capitalize font-medium rounded-lg transition-colors ${
                selectedGender === g ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Teaching Mode */}
      <div>
        <label className="font-semibold text-slate-900 block mb-1.5">
          {language === 'bn' ? 'পাঠদানের মাধ্যম' : 'Tuition Mode'}
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          {(['all', 'home', 'online'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMode(m)}
              className={`py-1.5 capitalize font-medium rounded-lg transition-colors ${
                selectedMode === m ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-semibold text-slate-900">
            {language === 'bn' ? 'সর্বোচ্চ প্রত্যাশিত ফি' : 'Max Expected Fee'}
          </label>
          <span className="font-mono font-bold text-blue-950">
            ৳{maxSalary.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="3000"
          max="20000"
          step="500"
          value={maxSalary}
          onChange={(e) => setMaxSalary(Number(e.target.value))}
          className="w-full accent-blue-900 cursor-pointer"
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
        >
          {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
        </button>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
            {language === 'bn' ? 'যাচাইকৃত টিউটরদের ডিরেক্টরি' : 'Find Qualified Tutors'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'bn'
              ? `${filteredTutors.length} জন যাচাইকৃত শিক্ষক উপলব্ধ`
              : `${filteredTutors.length} verified educators matching your preferences`}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-semibold shadow-xs min-h-[44px]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'bn' ? 'ফিল্টার করুন' : 'Filters'}</span>
        </button>
      </div>

      {/* Main Grid: Sidebar Filters + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-700" />
                {language === 'bn' ? 'সার্চ ফিল্টার' : 'Filter Criteria'}
              </span>
            </div>
            {filterControls}
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Quick Stream / Category Filter Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🌟 {language === 'bn' ? 'সকল টিউটর' : 'All Tutors'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('general')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'general'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-blue-50/60 text-blue-950 hover:bg-blue-100/70'
              }`}
            >
              🎓 {language === 'bn' ? 'জেনারেল টিউটর' : 'General Tutors'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('alia_madrasa')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'alia_madrasa'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              🕌 {language === 'bn' ? 'আলিয়া মাদ্রাসা' : 'Alia Madrasah'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('qawmi_madrasa')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'qawmi_madrasa'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50/70 text-amber-950 hover:bg-amber-100'
              }`}
            >
              📖 {language === 'bn' ? 'কওমি মাদ্রাসা' : 'Qawmi Madrasah'}
            </button>

            {/* Feature 1: Only Verified Toggle */}
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ml-auto cursor-pointer ${
                onlyVerified
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '🛡️ শুধুমাত্র ভেরিফাইড' : '🛡️ Verified Only'}</span>
            </button>
          </div>

          {filteredTutors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                {language === 'bn' ? 'কোনো টিউটর পাওয়া যায়নি' : 'No tutors match the selected criteria'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {language === 'bn'
                  ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা সরাসরি টিউটর রিকোয়েস্ট পোস্ট করুন।'
                  : 'Try relaxing your filters or submit a custom tuition request for our team to match.'}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100"
              >
                {language === 'bn' ? 'সব ফিল্টার মুছুন' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTutors.map((tutor) => {
                const shortlisted = isShortlisted(tutor.id);

                return (
                  <div
                    key={tutor.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header with Avatar & Verified */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-blue-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                            {tutor.photo ? (
                              <img
                                src={tutor.photo}
                                alt={tutor.fullName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <GraduationCap className="w-7 h-7 text-blue-700" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-base font-bold text-blue-950 leading-tight">
                                {tutor.fullName}
                              </h3>
                            </div>
                            
                            {/* Category Pill */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              {tutor.tutorCategory === 'qawmi_madrasa' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                  📖 কওমি মাদ্রাসা
                                </span>
                              ) : tutor.tutorCategory === 'alia_madrasa' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  🕌 আলিয়া মাদ্রাসা
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                                  🎓 জেনারেল টিউটর
                                </span>
                              )}

                              {tutor.madrasaDetails?.isHafiz && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                                  ✨ হাফেজ
                                </span>
                              )}

                              {/* Feature 1: Dynamic Verification & Trust Badge */}
                              <TutorVerificationBadge tutor={tutor} size="sm" />
                            </div>
                          </div>
                        </div>

                        {/* Shortlist Toggle Button */}
                        <button
                          type="button"
                          onClick={() => toggleShortlist(tutor.id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            shortlisted
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                          aria-label="Toggle shortlist"
                        >
                          <Heart className={`w-4 h-4 ${shortlisted ? 'fill-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Education & Bio */}
                      <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-start gap-1.5 font-medium text-slate-800">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{tutor.university} ({tutor.department})</span>
                        </div>
                        <div className="flex items-center gap-1.5" title={`বর্তমান ঠিকানা: ${tutor.currentAddress || tutor.area}, ${tutor.district}`}>
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{tutor.currentAddress || tutor.area}, {tutor.district}</span>
                        </div>
                      </div>

                      {/* Subjects */}
                      <div className="mt-3">
                        <span className="text-[11px] text-slate-400 block mb-1">{language === 'bn' ? 'প্রধান বিষয়সমূহ:' : 'Subjects:'}</span>
                        <div className="flex flex-wrap gap-1">
                          {tutor.preferredSubjects.slice(0, 3).map((sub) => (
                            <span key={sub} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                          {tutor.preferredSubjects.length > 3 && (
                            <span className="text-[11px] text-slate-400 px-1 py-0.5">
                              +{tutor.preferredSubjects.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Experience and Rating */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{tutor.teachingExperienceYears} {t.years} {t.experience}</span>
                        <div className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="tabular-nums">{tutor.rating}</span>
                          <span className="text-slate-400 font-normal">({tutor.totalReviews})</span>
                        </div>
                      </div>

                    </div>

                    {/* Footer Fee & Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.salary}</span>
                        <span className="text-sm font-bold text-blue-950 tabular-nums">
                          {settings.defaultCurrency}{tutor.expectedSalary.toLocaleString()}
                          <span className="text-[11px] font-normal text-slate-500">{t.perMonth}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChatTutor(tutor);
                            setChatModalOpen(true);
                          }}
                          className="p-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl transition-colors min-h-[38px] flex items-center justify-center cursor-pointer shadow-2xs"
                          title={language === 'bn' ? 'শিক্ষককে সরাসরি মেসেজ পাঠান' : 'Direct Message'}
                        >
                          <MessageSquare className="w-4 h-4 text-blue-900" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDemoTutor(tutor);
                            setDemoModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl transition-colors min-h-[38px] flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-950" />
                          <span>ফ্রি ডেমো</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateTo('tutor-detail', { tutorId: tutor.id })}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-xl transition-colors min-h-[38px] cursor-pointer"
                        >
                          {t.viewDetails}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-base text-blue-950">
                {language === 'bn' ? 'ফিল্টার নির্বাচন' : 'Filter Tutors'}
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {filterControls}

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-900 text-white text-xs font-semibold rounded-xl"
              >
                {language === 'bn' ? 'ফলাফল দেখুন' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 4: Book Demo Modal for Selected Tutor */}
      {selectedDemoTutor && (
        <BookDemoModal
          tutor={selectedDemoTutor}
          isOpen={demoModalOpen}
          onClose={() => {
            setDemoModalOpen(false);
            setSelectedDemoTutor(null);
          }}
        />
      )}

      {/* Feature 6: In-App Direct Chat Modal */}
      {selectedChatTutor && (
        <ChatBoxModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedChatTutor(null);
          }}
          targetTutor={selectedChatTutor}
        />
      )}

    </div>
  );
};
