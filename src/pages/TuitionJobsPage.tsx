import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  BookOpen, 
  Calendar, 
  SlidersHorizontal, 
  X, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  MessageSquare,
  Compass,
  Send,
  Eye,
  AlertCircle,
  ExternalLink,
  Map,
  Navigation
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
import { ChatBoxModal } from '../components/chat/ChatBoxModal';
import { TuitionJob } from '../types';

export const TuitionJobsPage: React.FC = () => {
  const { storeState, navigateTo, language, currentUser, activeTutorProfile, settings } = useApp();
  const [selectedChatJob, setSelectedChatJob] = useState<TuitionJob | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Caretutors 3 Buttons: Location Modal State
  const [selectedLocationJob, setSelectedLocationJob] = useState<TuitionJob | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Caretutors 3 Buttons: Quick Apply Modal State
  const [selectedApplyJob, setSelectedApplyJob] = useState<TuitionJob | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyExpectedSalary, setApplyExpectedSalary] = useState<number>(5000);
  const [applyCoverNote, setApplyCoverNote] = useState('');
  const [applyErrorMessage, setApplyErrorMessage] = useState<string | null>(null);
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedMode, setSelectedMode] = useState<'all' | 'home' | 'online'>('all');
  const [selectedGenderPref, setSelectedGenderPref] = useState<'all' | 'any' | 'male' | 'female'>('all');
  const [minSalary, setMinSalary] = useState(3000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  // Google Maps Direction URL Generator (Caretutors requirement)
  const getDirectionsUrl = (job: TuitionJob, tutorOrigin?: string) => {
    const destination = encodeURIComponent(`${job.area}, ${job.district}, Bangladesh`);
    if (tutorOrigin && tutorOrigin.trim()) {
      const origin = encodeURIComponent(`${tutorOrigin.trim()}, Bangladesh`);
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  const handleOpenApplyModal = (job: TuitionJob) => {
    setSelectedApplyJob(job);
    setApplyExpectedSalary(job.salary);
    setApplyCoverNote(
      language === 'bn'
        ? `আসসালামু আলাইকুম, আমি ${job.area}-এ ${job.classLevel} (${job.medium})-এর এই টিউশনটিতে পড়াতে আগ্রহী এবং নিষ্ঠার সাথে পাঠদান করতে সক্ষম।`
        : `Assalamu Alaikum, I am very interested in tutoring for ${job.classLevel} in ${job.area} and confident in providing regular guidance.`
    );
    setApplyErrorMessage(null);
    setApplyModalOpen(true);
  };

  const handleSubmitApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplyJob) return;

    if (!currentUser) {
      navigateTo('login');
      return;
    }

    if (currentUser.role !== 'tutor') {
      setApplyErrorMessage(language === 'bn' ? 'শুধুমাত্র টিউটররা আবেদন করতে পারেন।' : 'Only registered tutors can apply.');
      return;
    }

    const tutorProfile = activeTutorProfile || storeState.tutors.find(t => t.userId === currentUser.id);
    if (!tutorProfile) {
      setApplyErrorMessage(language === 'bn' ? 'টিউটর প্রোফাইল পাওয়া যায়নি।' : 'Tutor profile not found.');
      return;
    }

    try {
      store.applyToJob({
        jobId: selectedApplyJob.id,
        tutorId: tutorProfile.id,
        expectedSalary: Number(applyExpectedSalary),
        coverNote: applyCoverNote.trim() || 'Interested in tutoring this student.'
      });
      setApplySuccessId(selectedApplyJob.id);
      setApplyModalOpen(false);
      setTimeout(() => setApplySuccessId(null), 5000);
    } catch (err: any) {
      setApplyErrorMessage(err.message || 'Failed to submit application.');
    }
  };

  // Published Jobs
  const publishedJobs = useMemo(() => {
    return storeState.jobs.filter((job) => {
      if (job.status !== 'published') return false;

      // search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches = 
          job.title.toLowerCase().includes(term) ||
          job.id.toLowerCase().includes(term) ||
          job.area.toLowerCase().includes(term) ||
          (Array.isArray(job.subjects) && job.subjects.some(s => s.toLowerCase().includes(term)));
        if (!matches) return false;
      }

      if (selectedDistrict !== 'All' && job.district !== selectedDistrict) return false;
      if (selectedArea !== 'All' && selectedArea.trim() !== '' && !job.area.toLowerCase().includes(selectedArea.toLowerCase())) return false;
      if (selectedMedium !== 'All' && job.medium !== selectedMedium) return false;
      if (selectedClass !== 'All' && job.classLevel !== selectedClass) return false;
      if (selectedSubject !== 'All' && (!Array.isArray(job.subjects) || !job.subjects.includes(selectedSubject))) return false;
      if (selectedMode !== 'all' && job.teachingType !== selectedMode) return false;
      if (selectedGenderPref !== 'all' && job.tutorGenderPreference !== selectedGenderPref) return false;
      if (job.salary < minSalary) return false;

      return true;
    });
  }, [
    storeState.jobs,
    searchTerm,
    selectedDistrict,
    selectedArea,
    selectedMedium,
    selectedClass,
    selectedSubject,
    selectedMode,
    selectedGenderPref,
    minSalary
  ]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('All');
    setSelectedArea('All');
    setSelectedMedium('All');
    setSelectedClass('All');
    setSelectedSubject('All');
    setSelectedMode('all');
    setSelectedGenderPref('all');
    setMinSalary(3000);
  };

  const handleShare = (jobId: string) => {
    navigator.clipboard?.writeText(window.location.origin + `#job=${jobId}`);
    setCopiedJobId(jobId);
    setTimeout(() => setCopiedJobId(null), 2000);
  };

  const isAlreadyApplied = (jobId: string) => {
    if (!activeTutorProfile) return false;
    return storeState.applications.some(a => a.jobId === jobId && a.tutorId === activeTutorProfile.id);
  };

  const filterControls = (
    <div className="space-y-4 text-xs text-slate-700">
      <div>
        <label className="font-semibold text-slate-900 block mb-1">
          {language === 'bn' ? 'সার্চ করুন (Job ID / এলাকা / বিষয়)' : 'Search Jobs'}
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. JOB-2026, Mirpur, Physics"
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
        />
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">
          {language === 'bn' ? 'জেলা (A to Z - ৬৪ জেলা)' : 'District (A-Z - All 64)'}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
        >
          <option value="All">All Districts (সকল জেলা)</option>
          {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'এলাকা / লোকেশন' : 'Area / Location'}</label>
        <div className="relative">
          <input
            type="text"
            list="bd-jobs-areas"
            value={selectedArea === 'All' ? '' : selectedArea}
            onChange={(e) => setSelectedArea(e.target.value ? e.target.value : 'All')}
            placeholder={language === 'bn' ? 'যেকোনো এলাকা লিখুন...' : 'Type any area...'}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
          <datalist id="bd-jobs-areas">
            {DHAKA_AREAS.map(a => <option key={a} value={a} />)}
          </datalist>
        </div>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'কারিকুলাম / মিডিয়াম' : 'Medium'}</label>
        <select
          value={selectedMedium}
          onChange={(e) => setSelectedMedium(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
        >
          <option value="All">All Mediums</option>
          {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'শ্রেণি' : 'Class'}</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
        >
          <option value="All">All Classes</option>
          {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'বিষয়' : 'Subject'}</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
        >
          <option value="All">All Subjects</option>
          {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold text-slate-900 block mb-1">{language === 'bn' ? 'টিউশন টাইপ' : 'Teaching Type'}</label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          {(['all', 'home', 'online'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedMode(mode)}
              className={`py-1.5 capitalize rounded-lg font-medium transition-colors ${
                selectedMode === mode ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-semibold text-slate-900">{language === 'bn' ? 'নূন্যতম সম্মানী' : 'Min Salary'}</label>
          <span className="font-mono font-bold text-blue-950">৳{minSalary.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="3000"
          max="12000"
          step="500"
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
          className="w-full accent-blue-900 cursor-pointer"
        />
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
        >
          {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-950 tracking-tight">
            {language === 'bn' ? 'লাইভ টিউশন সার্কুলার' : 'Tuition Job Board'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'bn'
              ? `${publishedJobs.length} টি সক্রিয় টিউশন জব উপলব্ধ`
              : `${publishedJobs.length} live tuition openings across Bangladesh`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-semibold min-h-[44px]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'bn' ? 'ফিল্টার করুন' : 'Filters'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Bar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-700" />
                <span>{language === 'bn' ? 'ফিল্টারসমূহ' : 'Job Filters'}</span>
              </span>
            </div>
            {filterControls}
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3 space-y-5">
          {publishedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-2xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg font-bold text-blue-950">
                  {language === 'bn' 
                    ? (storeState.jobs.filter(j => j.status === 'published').length === 0 
                        ? 'সারাদেশের টিউশন সার্কুলার শিগগিরই লাইভ হচ্ছে' 
                        : 'কোনো টিউশন জব পাওয়া যায়নি')
                    : (storeState.jobs.filter(j => j.status === 'published').length === 0
                        ? 'Live Tuition Circulars Coming Soon'
                        : 'No tuition openings match your filters')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {language === 'bn'
                    ? (storeState.jobs.filter(j => j.status === 'published').length === 0
                        ? 'অভিভাবকরা নতুন টিউশন চাহিদা পোস্ট করলে এবং তা অ্যাডমিন প্যানেল থেকে অনুমোদিত হলে সাথে সাথে এখানে লাইভ দেখতে পাবেন।'
                        : 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা সব ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।')
                    : (storeState.jobs.filter(j => j.status === 'published').length === 0
                        ? 'When guardians post tuition requirements and admin approves them, they appear live here across Bangladesh.'
                        : 'Try resetting your search terms or broadening your selected criteria.')}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('request-tutor')}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? '✓ টিউশন শিক্ষক রিকোয়েস্ট করুন' : 'Post Tuition Request'}
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('become-a-tutor')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? '🎓 শিক্ষক হিসেবে সিভি জমা দিন' : 'Register as Tutor'}
                </button>

                {publishedJobs.length === 0 && storeState.jobs.filter(j => j.status === 'published').length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    {language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            publishedJobs.map((job) => {
              const applied = isAlreadyApplied(job.id);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Job ID + Date + Applications */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded">
                          {job.id}
                        </span>
                        <span>{job.postedDate}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {job.totalApplications} {language === 'bn' ? 'জন আবেদন করেছেন' : 'applicants'}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-lg font-bold text-blue-950 leading-snug">
                      {job.title}
                    </h3>

                    {/* Metadata unboxed text */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.area}, {job.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.medium} · {job.classLevel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.daysPerWeek} {t.daysPerWeek} ({job.preferredTime})</span>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(Array.isArray(job.subjects) && job.subjects.length > 0 ? job.subjects : ['সব বিষয়']).map((sub) => (
                        <span key={sub} className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {sub}
                        </span>
                      ))}
                      <span className="text-[11px] font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                        Preference: {job.tutorGenderPreference} tutor
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {job.description}
                    </p>

                  </div>

                  {/* Bottom Footer: Caretutors 3 Actions (Location, Direction, Apply) + Secondary Controls */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="flex items-center justify-between lg:block">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">{t.salary}</span>
                        <span className="text-xl font-black text-blue-950 tabular-nums">
                          {settings.defaultCurrency}{job.salary.toLocaleString()}
                          <span className="text-xs font-normal text-slate-500">{t.perMonth}</span>
                        </span>
                      </div>
                      <span className="lg:hidden text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        📍 {job.area}
                      </span>
                    </div>

                    {/* Caretutors 3 Buttons Cluster */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Button 1: লোকেশন (Location) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLocationJob(job);
                          setLocationModalOpen(true);
                        }}
                        className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                        title={language === 'bn' ? 'টিউশনের লোকেশন ও ম্যাপ প্রাকদর্শন' : 'View Job Location & Map'}
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        <span>{language === 'bn' ? 'লোকেশন' : 'Location'}</span>
                      </button>

                      {/* Button 2: ডিরেকশন (Direction) */}
                      <a
                        href={getDirectionsUrl(job, activeTutorProfile?.area || activeTutorProfile?.currentAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                        title={language === 'bn' ? 'গুগল ম্যাপসে আপনার অবস্থান থেকে সরাসরি রুট দেখুন' : 'Get Google Maps Directions from Your Location'}
                      >
                        <Compass className="w-3.5 h-3.5 text-indigo-700" />
                        <span>{language === 'bn' ? 'ডিরেকশন' : 'Direction'}</span>
                      </a>

                      {/* Button 3: এপ্লাই (Apply) */}
                      {applied || applySuccessId === job.id ? (
                        <span className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'bn' ? '✓ আবেদন সম্পন্ন' : '✓ Applied'}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(job)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'bn' ? 'এপ্লাই করুন' : 'Apply Now'}</span>
                        </button>
                      )}

                      {/* Secondary Buttons: Details, Chat, Share */}
                      <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                        <button
                          type="button"
                          onClick={() => navigateTo('job-detail', { jobId: job.id })}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title={language === 'bn' ? 'সার্কুলারের সম্পূর্ণ বিবরণ দেখুন' : 'View Full Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChatJob(job);
                            setChatModalOpen(true);
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-blue-900 transition-colors"
                          title={language === 'bn' ? 'অভিভাবকের সাথে সরাসরি চ্যাট করুন' : 'Direct Message Guardian'}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShare(job.id)}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                          title="Share circular link"
                        >
                          {copiedJobId === job.id ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-base text-blue-950">
                {language === 'bn' ? 'ফিল্টার নির্বাচন' : 'Filter Jobs'}
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
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-blue-900 text-white text-xs font-semibold rounded-xl"
              >
                {language === 'bn' ? 'ফলাফল প্রয়োগ করুন' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 6: In-App Chat Modal with Guardian */}
      {selectedChatJob && (
        <ChatBoxModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedChatJob(null);
          }}
          targetGuardianId={selectedChatJob.guardianId}
          targetGuardianName={selectedChatJob.guardianName}
          jobId={selectedChatJob.id}
          jobTitle={selectedChatJob.title}
        />
      )}

      {/* Caretutors Feature: Location Preview & Route Modal */}
      {locationModalOpen && selectedLocationJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-blue-950">
                    {language === 'bn' ? 'টিউশন লোকেশন ও ম্যাপ' : 'Tuition Location & Map'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedLocationJob.id} · {selectedLocationJob.area}, {selectedLocationJob.district}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocationModalOpen(false);
                  setSelectedLocationJob(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Address & Spec Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">এলাকা ও জেলা</span>
                  <span className="font-bold text-slate-900 text-sm">📍 {selectedLocationJob.area}, {selectedLocationJob.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">শ্রেণী ও মাধ্যম</span>
                  <span className="font-bold text-slate-900">{selectedLocationJob.classLevel} ({selectedLocationJob.medium})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">সময়সূচি</span>
                  <span className="font-medium text-slate-700">{selectedLocationJob.daysPerWeek} দিন/সপ্তাহ ({selectedLocationJob.preferredTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">সম্মানী</span>
                  <span className="font-bold text-blue-950">৳{selectedLocationJob.salary.toLocaleString()}/মাস</span>
                </div>
              </div>
            </div>

            {/* Interactive Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
              <iframe
                title="Tuition Location Map"
                className="w-full h-52 sm:h-60 border-0"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${selectedLocationJob.area}, ${selectedLocationJob.district}, Bangladesh`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            {/* Travel & Directions Advice */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <span>🧭 আপনার অবস্থান থেকে যাওয়ার দিকনির্দেশনা:</span>
              </p>
              <p className="text-[11px] text-slate-600">
                অভিভাবকের ঠিকানায় সরাসরি পৌঁছানোর সঠিক রুট, যানজটের অবস্থা ও আনুমানিক ভ্রমণ সময় জানতে নিচের গুগল ম্যাপস ডিরেকশন বাটনে চাপুন।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <a
                href={getDirectionsUrl(selectedLocationJob, activeTutorProfile?.area || activeTutorProfile?.currentAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Compass className="w-4 h-4 text-indigo-200" />
                <span>{language === 'bn' ? 'গুগল ম্যাপসে ডিরেকশন দেখুন' : 'Get Directions on Google Maps'}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const job = selectedLocationJob;
                  setLocationModalOpen(false);
                  setSelectedLocationJob(null);
                  handleOpenApplyModal(job);
                }}
                className="w-full sm:w-auto py-3 px-5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Caretutors Feature: Quick Apply Modal */}
      {applyModalOpen && selectedApplyJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">
                  {language === 'bn' ? 'টিউশনে সরাসরি আবেদন' : 'Apply for Tuition Job'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApplyJob.id} · {selectedApplyJob.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setApplyModalOpen(false);
                  setSelectedApplyJob(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {applyErrorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{applyErrorMessage}</span>
              </div>
            )}

            {!currentUser ? (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-xs">
                <p className="font-bold text-blue-950">
                  {language === 'bn' ? 'আবেদন করতে টিউটর একাউন্টে লগইন করুন' : 'Please Sign In as Tutor to Apply'}
                </p>
                <p className="text-slate-600">
                  {language === 'bn' ? 'আপনার প্রোফাইল অভিভাবক ও অ্যাডমিন কর্তৃক মূল্যায়নের জন্য টিউটর লগইন আবশ্যক।' : 'You need a registered tutor account to submit applications.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  className="w-full py-2.5 bg-blue-900 text-white font-bold rounded-xl text-center cursor-pointer"
                >
                  {language === 'bn' ? 'টিউটর লগইন / রেজিস্ট্রেশন' : 'Tutor Login / Register'}
                </button>
              </div>
            ) : currentUser.role !== 'tutor' ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-bold">
                  {language === 'bn' ? 'শুধুমাত্র রেজিস্টার্ড টিউটররা আবেদন করতে পারেন' : 'Tutor Role Required'}
                </p>
                <p>
                  {language === 'bn' ? 'আপনি বর্তমানে অভিভাবক বা অ্যাডমিন অ্যাকাউন্টে আছেন। টিউটর অ্যাকাউন্টে সুইচ করে আবেদন করুন।' : 'You are currently logged in as guardian/admin.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApply} className="space-y-4 text-xs">
                {activeTutorProfile && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">আবেদনকারী টিউটর প্রোফাইল</span>
                    <p className="font-bold text-blue-950 text-sm mt-0.5">{activeTutorProfile.fullName}</p>
                    <p className="text-[11px] text-slate-500">{activeTutorProfile.university} ({activeTutorProfile.department})</p>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'প্রত্যাশিত মাসিক সম্মানী (BDT ৳)' : 'Expected Monthly Salary (৳)'}
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="35000"
                    step="500"
                    value={applyExpectedSalary}
                    onChange={(e) => setApplyExpectedSalary(Number(e.target.value))}
                    required
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    অভিভাবকের নির্ধারিত বাজেট: ৳{selectedApplyJob.salary.toLocaleString()}/মাস
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'কভার নোট বা বার্তা (অভিভাবকের জন্য)' : 'Cover Note for Guardian'}
                  </label>
                  <textarea
                    rows={3}
                    value={applyCoverNote}
                    onChange={(e) => setApplyCoverNote(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার শিক্ষকতা অভিজ্ঞতা ও কীভাবে পড়াবেন সংক্ষেপে লিখুন...' : 'Write your teaching strategy...'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setApplyModalOpen(false);
                      setSelectedApplyJob(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    {language === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm & Apply'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
