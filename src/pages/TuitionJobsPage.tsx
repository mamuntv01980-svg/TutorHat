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
import { ChatBoxModal } from '../components/chat/ChatBoxModal';
import { TuitionJob } from '../types';

export const TuitionJobsPage: React.FC = () => {
  const { storeState, navigateTo, language, currentUser, activeTutorProfile, settings } = useApp();
  const [selectedChatJob, setSelectedChatJob] = useState<TuitionJob | null>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const t = TRANSLATIONS[language];

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
          job.subjects.some(s => s.toLowerCase().includes(term));
        if (!matches) return false;
      }

      if (selectedDistrict !== 'All' && job.district !== selectedDistrict) return false;
      if (selectedArea !== 'All' && selectedArea.trim() !== '' && !job.area.toLowerCase().includes(selectedArea.toLowerCase())) return false;
      if (selectedMedium !== 'All' && job.medium !== selectedMedium) return false;
      if (selectedClass !== 'All' && job.classLevel !== selectedClass) return false;
      if (selectedSubject !== 'All' && !job.subjects.includes(selectedSubject)) return false;
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
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                {language === 'bn' ? 'কোনো টিউশন জব পাওয়া যায়নি' : 'No jobs found matching your filters'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn' ? 'ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try resetting your search terms or filters.'}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded-xl"
              >
                {language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}
              </button>
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
                      {job.subjects.map((sub) => (
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

                  {/* Bottom Footer: Salary + Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{t.salary}</span>
                      <span className="text-lg font-bold text-blue-950 tabular-nums">
                        {settings.defaultCurrency}{job.salary.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500">{t.perMonth}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChatJob(job);
                          setChatModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100 transition-colors"
                        title={language === 'bn' ? 'অভিভাবকের সাথে সরাসরি চ্যাট করুন' : 'Direct Message Guardian'}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(job.id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        title="Share circular link"
                      >
                        {copiedJobId === job.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateTo('job-detail', { jobId: job.id })}
                        className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors min-h-[40px] flex items-center justify-center"
                      >
                        {t.viewDetails}
                      </button>

                      {applied ? (
                        <span className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center min-h-[40px]">
                          ✓ Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigateTo('job-detail', { jobId: job.id })}
                          className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold rounded-xl bg-blue-900 hover:bg-blue-800 text-white transition-colors min-h-[40px] flex items-center justify-center"
                        >
                          {t.applyNow}
                        </button>
                      )}
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

    </div>
  );
};
