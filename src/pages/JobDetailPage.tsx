import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  CheckCircle2,
  AlertCircle, 
  Share2, 
  Send, 
  UserCheck, 
  ShieldAlert,
  GraduationCap,
  MessageSquare,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { TRANSLATIONS } from '../constants/translations';
import { ChatBoxModal } from '../components/chat/ChatBoxModal';

export const JobDetailPage: React.FC = () => {
  const { 
    selectedJobId, 
    storeState, 
    navigateTo, 
    language, 
    currentUser, 
    activeTutorProfile,
    settings
  } = useApp();

  const t = TRANSLATIONS[language];

  const job = storeState.jobs.find(j => j.id === selectedJobId) || storeState.jobs[0];

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [expectedSalary, setExpectedSalary] = useState(job ? job.salary : 6000);
  const [coverNote, setCoverNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Google Maps Direction URL Generator (Caretutors requirement)
  const getDirectionsUrl = (jobItem: typeof job, tutorOrigin?: string) => {
    if (!jobItem) return '#';
    const destination = encodeURIComponent(`${jobItem.area}, ${jobItem.district}, Bangladesh`);
    if (tutorOrigin && tutorOrigin.trim()) {
      const origin = encodeURIComponent(`${tutorOrigin.trim()}, Bangladesh`);
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <button
          type="button"
          onClick={() => navigateTo('tuition-jobs')}
          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Tuition Jobs
        </button>
      </div>
    );
  }

  // Check if tutor already applied
  const existingApp = activeTutorProfile 
    ? storeState.applications.find(a => a.jobId === job.id && a.tutorId === activeTutorProfile.id)
    : null;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTutorProfile) return;

    try {
      store.applyToJob({
        jobId: job.id,
        tutorId: activeTutorProfile.id,
        expectedSalary: Number(expectedSalary),
        coverNote: coverNote.trim() || 'Assalamu Alaikum, I am very interested in tutoring this student and confident in providing excellent guidance.'
      });
      setApplySuccess(true);
      setApplyModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit application.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigateTo('tuition-jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'টিউশন জব তালিকায় ফিরে যান' : 'Back to Tuition Jobs'}</span>
        </button>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                {job.id}
              </span>
              <span>{language === 'bn' ? 'পোস্ট তারিখ:' : 'Posted:'} {job.postedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-600 font-medium">Deadline: {job.deadline}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-950 leading-tight">
              {job.title}
            </h1>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block">{t.salary}</span>
            <span className="text-2xl font-bold text-blue-950 tabular-nums">
              {settings.defaultCurrency}{job.salary.toLocaleString()}
              <span className="text-xs font-normal text-slate-500">{t.perMonth}</span>
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
          <div>
            <span className="text-slate-400 block">{t.location}</span>
            <span className="font-semibold text-slate-900">{job.area}, {job.district}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.class} & {t.medium}</span>
            <span className="font-semibold text-slate-900">{job.classLevel} ({job.medium})</span>
          </div>
          <div>
            <span className="text-slate-400 block">{language === 'bn' ? 'সময় ও দিন' : 'Schedule'}</span>
            <span className="font-semibold text-slate-900">{job.daysPerWeek} {t.daysPerWeek} ({job.preferredTime})</span>
          </div>
          <div>
            <span className="text-slate-400 block">{language === 'bn' ? 'শিক্ষক পছন্দ' : 'Tutor Preference'}</span>
            <span className="font-semibold text-slate-900 capitalize">{job.tutorGenderPreference} Tutor</span>
          </div>
        </div>

        {/* Caretutors 3 Interactive Action Ribbon */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-300 shrink-0">
              🧭
            </span>
            <div>
              <p className="font-bold text-white text-sm">
                {language === 'bn' ? 'টিউশন লোকেশন ও গুগল ম্যাপস ডিরেকশন' : 'Tuition Location & Directions'}
              </p>
              <p className="text-[11px] text-blue-200">
                📍 {job.area}, {job.district} · {job.teachingType === 'home' ? 'Home Tuition (শিক্ষার্থীর বাসায়)' : 'Online Tuition'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 1. লোকেশন বাটন */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'bn' ? 'লোকেশন' : 'Location'}</span>
            </button>

            {/* 2. ডিরেকশন বাটন */}
            <a
              href={getDirectionsUrl(job, activeTutorProfile?.area || activeTutorProfile?.currentAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-white" />
              <span>{language === 'bn' ? 'ডিরেকশন' : 'Direction'}</span>
            </a>

            {/* 3. এপ্লাই বাটন */}
            {existingApp || applySuccess ? (
              <span className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs">
                ✓ {language === 'bn' ? 'আবেদন সম্পন্ন' : 'Applied'}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-blue-950" />
                <span>{language === 'bn' ? 'এপ্লাই' : 'Apply'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subjects required */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
            {language === 'bn' ? 'পাঠদানের বিষয়সমূহ' : 'Subjects Required'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(job.subjects) && job.subjects.length > 0 ? job.subjects : ['সব বিষয়']).map((sub) => (
              <span key={sub} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
            {language === 'bn' ? 'বিস্তারিত তথ্য ও আবশ্যকতা' : 'Job Requirements & Details'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {job.description}
          </p>
        </div>

        {/* Additional Student Context */}
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <strong>{language === 'bn' ? 'শিক্ষার্থীর লিঙ্গ:' : 'Student Gender:'}</strong> {job.studentGender}
          </p>
          <p>
            <strong>{language === 'bn' ? 'পাঠদানের পদ্ধতি:' : 'Teaching Mode:'}</strong> {job.teachingType === 'home' ? 'Home Tuition (শিক্ষার্থীর বাসায়)' : 'Online Tuition'}
          </p>
        </div>

        {/* Application CTA Section */}
        <div className="pt-6 border-t border-slate-100">
          
          {existingApp || applySuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>{language === 'bn' ? 'আপনার আবেদন সফলভাবে জমা হয়েছে' : 'Application Submitted Successfully'}</span>
              </div>
              <p className="text-emerald-700">
                {language === 'bn'
                  ? `আপনি ${existingApp?.appliedDate || 'আজ'} এই সার্কুলারে আবেদন করেছেন। বর্তমান অবস্থা: ${(existingApp?.status || 'applied').toUpperCase()}`
                  : `You applied for this job on ${existingApp?.appliedDate || 'today'}. Status: ${(existingApp?.status || 'applied').toUpperCase()}`}
              </p>
            </div>
          ) : !currentUser ? (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div>
                <h4 className="font-bold text-blue-950 text-sm">
                  {language === 'bn' ? 'আবেদন করতে টিউটর লগইন করুন' : 'Sign in as Tutor to Apply'}
                </h4>
                <p className="text-slate-600 mt-0.5">
                  {language === 'bn' ? 'টিউশনে আবেদন করতে আপনার টিউটর অ্যাকাউন্ট প্রয়োজন।' : 'You need a registered TutorHat profile to apply.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shrink-0"
              >
                {t.login} / {t.register}
              </button>
            </div>
          ) : currentUser.role !== 'tutor' ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'শুধুমাত্র রেজিস্টার্ড টিউটররা টিউশনে আবেদন করতে পারেন। আপনি অভিভাবক অ্যাকাউন্টে লগইন অবস্থায় আছেন।'
                  : 'Only registered tutors can apply for tuition circulars. You are currently logged in as a Guardian/Admin.'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span>{language === 'bn' ? 'আপনার সিভি অভিভাবক ও অ্যাডমিন কর্তৃক মূল্যায়িত হবে।' : 'Your CV will be reviewed by platform admins.'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* লোকেশন বাটন */}
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>{language === 'bn' ? 'লোকেশন' : 'Location'}</span>
                </button>

                {/* ডিরেকশন বাটন */}
                <a
                  href={getDirectionsUrl(job, activeTutorProfile?.area || activeTutorProfile?.currentAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-700" />
                  <span>{language === 'bn' ? 'ডিরেকশন' : 'Direction'}</span>
                </a>

                {/* মেসেজ বাটন */}
                <button
                  type="button"
                  onClick={() => setChatModalOpen(true)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title={language === 'bn' ? 'অভিভাবককে সরাসরি মেসেজ দিন' : 'Message Guardian'}
                >
                  <MessageSquare className="w-4 h-4 text-blue-700" />
                </button>

                {/* এপ্লাই বাটন */}
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{t.applyNow}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Application Form Modal */}
      {applyModalOpen && activeTutorProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">
                  {language === 'bn' ? 'টিউশন জবে আবেদন' : 'Apply for Tuition Job'}
                </h3>
                <p className="text-xs text-slate-500">{job.id} · {job.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'আপনার নাম ও শিক্ষাপ্রতিষ্ঠান' : 'Applicant Info'}
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                  <p className="font-semibold text-blue-950">{activeTutorProfile.fullName}</p>
                  <p className="text-[11px] text-slate-500">{activeTutorProfile.university} ({activeTutorProfile.department})</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'প্রত্যাশিত মাসিক সম্মানী (BDT ৳)' : 'Expected Monthly Salary (৳)'}
                </label>
                <input
                  type="number"
                  min="2000"
                  max="30000"
                  step="500"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  required
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Guardian Budget: ৳{job.salary}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">
                  {language === 'bn' ? 'কভার নোট বা বার্তা (অভিভাবকের জন্য)' : 'Cover Note for Guardian'}
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার শিক্ষকতা অভিজ্ঞতা ও কীভাবে শিক্ষার্থীকে পড়াবেন সংক্ষেপে লিখুন...' : 'Briefly mention your teaching method and relevant experience...'}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  {language === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm & Apply'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Feature 6: In-App Chat with Guardian Modal */}
      {job && (
        <ChatBoxModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          targetGuardianId={job.guardianId}
          targetGuardianName={job.guardianName}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}

      {/* Caretutors Feature: Location Preview & Route Modal */}
      {locationModalOpen && job && (
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
                  <p className="text-xs text-slate-500 font-mono">{job.id} · {job.area}, {job.district}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
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
                  <span className="font-bold text-slate-900 text-sm">📍 {job.area}, {job.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">শ্রেণী ও মাধ্যম</span>
                  <span className="font-bold text-slate-900">{job.classLevel} ({job.medium})</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">সময়সূচি</span>
                  <span className="font-medium text-slate-700">{job.daysPerWeek} দিন/সপ্তাহ ({job.preferredTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">সম্মানী</span>
                  <span className="font-bold text-blue-950">৳{job.salary.toLocaleString()}/মাস</span>
                </div>
              </div>
            </div>

            {/* Interactive Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
              <iframe
                title="Tuition Location Map"
                className="w-full h-52 sm:h-60 border-0"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${job.area}, ${job.district}, Bangladesh`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            {/* Travel & Directions Advice */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <span>🧭 আপনার অবস্থান থেকে যাওয়ার দিকনির্দেশনা:</span>
              </p>
              <p className="text-[11px] text-slate-600">
                অভিভাবকের ঠিকানায় সরাসরি পৌঁছানোর সঠিক রুট, ট্রাফিক ও আনুমানিক ভ্রমণ সময় জানতে নিচের গুগল ম্যাপস ডিরেকশন বাটনে চাপুন।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <a
                href={getDirectionsUrl(job, activeTutorProfile?.area || activeTutorProfile?.currentAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Compass className="w-4 h-4 text-indigo-200" />
                <span>{language === 'bn' ? 'গুগল ম্যাপসে ডিরেকশন দেখুন' : 'Get Directions on Google Maps'}</span>
              </a>

              {!(existingApp || applySuccess) && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationModalOpen(false);
                    setApplyModalOpen(true);
                  }}
                  className="w-full sm:w-auto py-3 px-5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
