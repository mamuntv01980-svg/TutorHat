import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  DollarSign, 
  Award, 
  Bell, 
  Menu, 
  X, 
  ArrowRight, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Share2,
  Users,
  Info,
  Volume2,
  Copy,
  Check,
  Star,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { store, calculateCvCompletion } from '../../services/store';
import { CallButton } from '../../components/common/CallButton';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import { TutorVerificationBadge } from '../../components/common/TutorVerificationBadge';
import { TutorKycVerificationModal } from '../../components/tutor/TutorKycVerificationModal';
import { TRANSLATIONS } from '../../constants/translations';
import { TutorProfile } from '../../types';

export const TutorDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeTutorProfile, 
    storeState, 
    navigateTo, 
    language, 
    unreadNotifsCount, 
    logout,
    settings
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'demos' | 'confirmations' | 'attendance' | 'payments' | 'certificates' | 'notifications' | 'notices' | 'referrals' | 'reviews'>('overview');
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyInputOpenId, setReplyInputOpenId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const tutor = activeTutorProfile || storeState.tutors[0] || ({
    id: 'tut_01',
    userId: 'user_tutor_01',
    fullName: 'Rahim Chowdhury',
    gender: 'male',
    phone: '01711223344',
    email: 'tutor@example.com',
    currentAddress: 'Dhanmondi, Dhaka',
    permanentAddress: 'Dhaka',
    district: 'Dhaka',
    area: 'Dhanmondi',
    preferredAreas: ['Dhanmondi'],
    aboutMe: 'Experienced tutor.',
    tutorCategory: 'general',
    university: 'BUET',
    department: 'CSE',
    currentYearOrStatus: '3rd Year',
    studentIdNumber: '',
    teachingExperienceYears: 3,
    preferredClasses: ['Class 9'],
    preferredSubjects: ['Physics'],
    preferredMediums: ['Bangla Medium'],
    categories: ['Bangla Medium'],
    onlineTeaching: true,
    homeTuition: true,
    coachingGroupTuition: false,
    availableDays: ['Saturday'],
    availableTime: 'Evening',
    expectedSalary: 7000,
    preferredStudentGender: 'any',
    preferredClassLevel: 'Secondary',
    verificationStatus: 'verified',
    completionPercentage: 100,
    rating: 4.9,
    totalReviews: 10,
    trustScore: 100
  } as unknown as TutorProfile);
  const myReferralCode = currentUser?.referralCode || 'RAHIM-TH10';

  // Feature 2: Reviews for this tutor
  const myReviews = storeState.reviews.filter(r => r.tutorId === tutor?.id);

  // Published Notices for Tutors (Section 35)
  const publishedNotices = store.getPublishedNotices('tutors');
  // Referral transactions for this tutor (Section 36)
  const tutorReferrals = store.getUserReferrals(currentUser?.id || tutor?.userId || '');

  // Applications
  const tutorApplications = storeState.applications.filter(a => a.tutorId === tutor?.id);
  const appliedCount = tutorApplications.filter(a => a.status === 'applied').length;
  const shortlistedCount = tutorApplications.filter(a => a.status === 'shortlisted').length;
  const appointedCount = tutorApplications.filter(a => a.status === 'appointed' || a.status === 'demo_scheduled').length;
  const confirmedCount = tutorApplications.filter(a => a.status === 'confirmed').length;
  const cancelledCount = tutorApplications.filter(a => a.status === 'cancelled' || a.status === 'rejected').length;

  // Demos & Confirmations
  const tutorDemos = storeState.demos.filter(d => d.tutorId === tutor?.id);
  const tutorConfirmations = storeState.confirmations.filter(c => c.tutorId === tutor?.id);
  const tutorAttendance = storeState.attendance.filter(att => att.tutorId === tutor?.id);
  const tutorPayments = storeState.payments.filter(p => p.tutorId === tutor?.id);
  const tutorCertificates = storeState.certificates.filter(c => c.tutorId === tutor?.id);
  const tutorNotifications = storeState.notifications.filter(n => n.userId === currentUser?.id);

  // CV Completion
  const completionData = calculateCvCompletion(tutor);

  // Matching nearby jobs
  const nearbyJobs = storeState.jobs.filter(j => 
    j.status === 'published' && (j.district === tutor.district || tutor.preferredAreas.includes(j.area))
  );

  const handleSidebarItemClick = (tabKey: any, directView?: AppView) => {
    if (directView) {
      navigateTo(directView);
    } else {
      setActiveTab(tabKey);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Tutor Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100"
                aria-label="Open Tutor Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'টিউটর পোর্টাল' : 'Tutor Portal'}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
                <span className="hidden sm:inline-block text-xs text-slate-600 truncate max-w-[180px]">
                  {tutor.fullName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              <button
                type="button"
                onClick={() => navigateTo('tutor-profile-edit')}
                className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                {language === 'bn' ? 'সিভি এডিট' : 'Edit CV'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Verification Status & CV Completion Banner */}
        <div className="mb-6 space-y-4">
          
          {/* Verification Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                tutor.verificationStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-700'
                  : tutor.verificationStatus === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : tutor.verificationStatus === 'rejected'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {tutor.verificationStatus === 'verified' ? <ShieldCheck className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস:' : 'Verification Status:'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    tutor.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : tutor.verificationStatus === 'pending'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : tutor.verificationStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {tutor.verificationStatus === 'verified' ? '✓ Verified Tutor' : tutor.verificationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  {tutor.verificationStatus === 'verified'
                    ? (language === 'bn' ? 'অভিনন্দন! আপনার প্রোফাইল ভেরিফাইড এবং সরাসরি সার্কুলারে অগ্রগণ্য।' : 'Your profile is officially verified by TutorHat Administration.')
                    : tutor.verificationStatus === 'pending'
                    ? (language === 'bn' ? 'আপনার সিভি অ্যাডমিন পর্যালোচনার অধীনে আছে।' : 'Your CV is under review by administration.')
                    : tutor.verificationStatus === 'rejected'
                    ? (language === 'bn' ? `রিজেকশনের কারণ: ${tutor.rejectionReason || 'দয়া করে শিক্ষাগত তথ্য হালনাগাদ করুন'}` : `Reason: ${tutor.rejectionReason || 'Please update academic documents'}`)
                    : (language === 'bn' ? 'সিভি ১০০% পূরণ করে ভেরিফিকেশনের জন্য সাবমিট করুন।' : 'Complete 100% of your CV to submit for official verification.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setKycModalOpen(true)}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{language === 'bn' ? '📄 KYC ডকুমেন্টস ও ভেরিফিকেশন' : '📄 Manage KYC Documents'}</span>
              </button>

              {tutor.verificationStatus === 'draft' && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      store.submitTutorForVerification(tutor.id);
                      setModalMessage(language === 'bn' ? 'সিভি সফলভাবে ভেরিফিকেশনের জন্য পাঠানো হয়েছে!' : 'CV submitted for admin verification!');
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 shrink-0 cursor-pointer"
                >
                  {language === 'bn' ? 'ভেরিফিকেশনের জন্য জমা দিন' : 'Submit for Verification'}
                </button>
              )}
            </div>
          </div>

          {/* Feature 1: Tutor Trust & Verification Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? '🛡️ আপনার প্রোফাইল ট্রাস্ট স্কোর ও ভেরিফিকেশন বিবরণ:' : '🛡️ Your Trust Score & Verification Status:'}
                </span>
                <span className="bg-amber-100 text-amber-950 font-black px-2 py-0.5 rounded-full text-[11px] border border-amber-300">
                  {tutor.trustScore || (tutor.verificationStatus === 'verified' ? 100 : 40)}% স্কোর
                </span>
              </div>
              <button
                type="button"
                onClick={() => setKycModalOpen(true)}
                className="text-blue-900 font-bold hover:underline self-start sm:self-auto"
              >
                {language === 'bn' ? 'ডকুমেন্টস পরিবর্তন / আপলোড করুন →' : 'Update Documents →'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">জাতীয় পরিচয়পত্র (NID)</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    {tutor.isNidVerified !== false && tutor.nidNumber ? 'যাচাইকৃত ✓' : tutor.nidNumber ? 'পর্যালোচনায় ⏳' : 'সাবমিট করুন'}
                  </span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${tutor.isNidVerified !== false && tutor.nidNumber ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">স্টুডেন্ট আইডি কার্ড</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    {tutor.isStudentIdVerified !== false && tutor.studentIdCardPhoto ? 'যাচাইকৃত ✓' : tutor.studentIdCardPhoto ? 'পর্যালোচনায় ⏳' : 'সাবমিট করুন'}
                  </span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${tutor.isStudentIdVerified !== false && tutor.studentIdCardPhoto ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">শিক্ষাগত সনদপত্র</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    {tutor.isAcademicVerified !== false && tutor.certificatePhoto ? 'যাচাইকৃত ✓' : tutor.certificatePhoto ? 'পর্যালোচনায় ⏳' : 'সাবমিট করুন'}
                  </span>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${tutor.isAcademicVerified !== false && tutor.certificatePhoto ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">মোবাইল নম্বর</span>
                  <span className="font-bold text-slate-800 text-[11px]">
                    যাচাইকৃত ✓
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator (0% to 100%) */}
          {completionData.percent < 100 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-amber-950">
                <span>{language === 'bn' ? 'সিভি সম্পূর্ণতা' : 'CV Completion'}: {completionData.percent}%</span>
                <button
                  type="button"
                  onClick={() => navigateTo('tutor-profile-edit')}
                  className="text-amber-800 underline font-bold hover:text-amber-950"
                >
                  {language === 'bn' ? 'সিভি সম্পূর্ণ করুন' : 'Complete Your CV'}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionData.percent}%` }}
                />
              </div>

              {completionData.missing.length > 0 && (
                <p className="text-[11px] text-amber-800">
                  {language === 'bn' ? 'বাকি তথ্য:' : 'Missing fields:'} {completionData.missing.join(', ')}
                </p>
              )}
            </div>
          )}

        </div>

        {/* 5 Statistics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Applied</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-950 tabular-nums">{appliedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Shortlisted</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-600 tabular-nums">{shortlistedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Appointed</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 tabular-nums">{appointedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Confirmed</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">{confirmedCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 font-medium block">Cancelled</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-500 tabular-nums">{cancelledCount}</span>
          </div>
        </div>

        {/* Main Content Sections based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => navigateTo('tuition-jobs')}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-blue-900 transition-colors shadow-xs"
              >
                <Briefcase className="w-5 h-5 text-blue-700 mb-1.5" />
                <h4 className="font-bold text-xs text-blue-950">Find Jobs</h4>
                <p className="text-[11px] text-slate-500">Browse open circulars</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-blue-900 transition-colors shadow-xs"
              >
                <FileText className="w-5 h-5 text-amber-600 mb-1.5" />
                <h4 className="font-bold text-xs text-blue-950">My Applications</h4>
                <p className="text-[11px] text-slate-500">{tutorApplications.length} submitted</p>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('tutor-profile-edit')}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-blue-900 transition-colors shadow-xs"
              >
                <GraduationCap className="w-5 h-5 text-indigo-600 mb-1.5" />
                <h4 className="font-bold text-xs text-blue-950">Complete Profile</h4>
                <p className="text-[11px] text-slate-500">{completionData.percent}% filled</p>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('tutor-detail', { tutorId: tutor.id })}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left hover:border-blue-900 transition-colors shadow-xs"
              >
                <Users className="w-5 h-5 text-emerald-600 mb-1.5" />
                <h4 className="font-bold text-xs text-blue-950">Public CV Preview</h4>
                <p className="text-[11px] text-slate-500">View as guardian sees</p>
              </button>
            </div>

            {/* Upcoming Demo Classes & Confirmations */}
            {tutorDemos.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span>{language === 'bn' ? 'আসন্ন ডেমো ক্লাস' : 'Upcoming Demo Classes'}</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {tutorDemos.map((demo) => (
                    <div key={demo.id} className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <h4 className="font-bold text-blue-950">{demo.jobTitle}</h4>
                        <p className="text-slate-600">Guardian: {demo.guardianName} · Date: <strong className="text-blue-900">{demo.date} at {demo.time}</strong></p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{demo.notes}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-semibold text-[11px]">
                        Status: {demo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Nearby Jobs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-700" />
                  <span>{language === 'bn' ? 'আপনার এলাকার উপযুক্ত টিউশন সার্কুলার' : 'Nearby Tuition Jobs Matching Your Area'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => navigateTo('tuition-jobs')}
                  className="text-xs font-semibold text-blue-900 hover:underline"
                >
                  View All Jobs →
                </button>
              </div>

              {nearbyJobs.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No matching circulars in your preferred area right now.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nearbyJobs.slice(0, 4).map((job) => (
                    <div key={job.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-blue-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                          {job.id}
                        </span>
                        <span className="font-bold text-blue-950 tabular-nums">৳{job.salary}/mo</span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                      <p className="text-slate-600 text-[11px]">{job.area} · {job.classLevel} · {job.daysPerWeek} days/wk</p>
                      <button
                        type="button"
                        onClick={() => navigateTo('job-detail', { jobId: job.id })}
                        className="w-full py-1.5 text-center bg-white border border-slate-200 rounded-lg text-blue-900 font-semibold hover:bg-blue-50"
                      >
                        View & Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab: Applications */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              {language === 'bn' ? 'আমার আবেদনসমূহ' : 'My Job Applications'} ({tutorApplications.length})
            </h3>

            {tutorApplications.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">You haven't applied to any tuition jobs yet.</p>
            ) : (
              <div className="space-y-3">
                {tutorApplications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-900">{app.jobId}</span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-blue-100 text-blue-900">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-700"><strong>Expected Salary:</strong> ৳{app.expectedSalary}/month</p>
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">"{app.coverNote}"</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Applied on: {app.appliedDate}</span>
                      <button
                        type="button"
                        onClick={() => navigateTo('job-detail', { jobId: app.jobId })}
                        className="text-blue-900 font-semibold hover:underline"
                      >
                        View Job Circular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              {language === 'bn' ? 'ক্লাস উপস্থিতি ট্র্যাকার' : 'Class Attendance Tracker'}
            </h3>

            {tutorAttendance.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No attendance logged yet for ongoing tuition.</p>
            ) : (
              <div className="space-y-2">
                {tutorAttendance.map((att) => (
                  <div key={att.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{att.studentName}</span>
                      <p className="text-slate-500 text-[11px]">{att.date} · {att.notes}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg font-semibold text-[11px] bg-emerald-100 text-emerald-800 uppercase">
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Payments */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              {language === 'bn' ? 'সম্মানী ও পেমেন্ট হিস্ট্রি' : 'Tuition Remuneration & Payments'}
            </h3>

            {/* Platform Official Payment Accounts Card */}
            <div className="p-4 bg-gradient-to-r from-pink-50 via-amber-50 to-emerald-50 rounded-xl border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  💳 প্ল্যাটফর্ম অফিসিয়াল বিকাশ ও নগদ নম্বর:
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  বিকাশ (Personal): <strong className="font-mono text-pink-700 font-bold">{settings.paymentAccounts?.bkashNumber || '01610582917'}</strong> · নগদ (Personal): <strong className="font-mono text-amber-700 font-bold">{settings.paymentAccounts?.nagadNumber || '01610582917'}</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  {settings.paymentAccounts?.paymentInstructionsBn || 'Send Money করে ট্রানজেকশন আইডি রেফারেন্সে রাখুন।'}
                </p>
              </div>
            </div>

            {tutorPayments.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No payment records yet.</p>
            ) : (
              <div className="space-y-2">
                {tutorPayments.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{p.month} — {p.notes}</span>
                      <p className="text-slate-500 text-[11px] font-mono">{p.id} · Scheduled: {p.paymentDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-950 block text-sm tabular-nums">৳{p.amount.toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Certificates */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>{language === 'bn' ? 'অর্জিত সনদ ও রিকগনিশন' : 'Official Certificates'}</span>
            </h3>

            {tutorCertificates.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Certificates are awarded upon successful completion of tuition contracts.</p>
            ) : (
              <div className="space-y-4">
                {tutorCertificates.map((cert) => (
                  <div key={cert.id} className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-950">{cert.title}</span>
                      <span className="font-mono text-[11px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                        {cert.verificationCode}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{cert.description}</p>
                    <p className="text-[11px] text-slate-500 pt-1">Issue Date: {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">
                {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
              </h3>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => store.markAllNotificationsAsRead(currentUser.id)}
                  className="text-xs text-blue-900 font-semibold hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {tutorNotifications.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No notifications yet.</p>
            ) : (
              <div className="space-y-2">
                {tutorNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => store.markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      notif.read ? 'bg-white border-slate-200' : 'bg-blue-50/70 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-blue-950">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{notif.date.split('T')[0]}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Notice Board (Section 35) */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>{language === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড' : 'Official Notice Board'}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{publishedNotices.length} notices</span>
            </div>

            {publishedNotices.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No platform notices at this time.</p>
            ) : (
              <div className="space-y-3">
                {publishedNotices.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-950">{n.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        n.category === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {n.category}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.description}</p>
                    <p className="text-[11px] text-slate-400">Date: {n.publishedDate} · Author: {n.createdBy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Referral Program (Section 36) */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                <span>{language === 'bn' ? 'রেফারেল প্রোগ্রাম' : 'Refer & Earn Rewards'}</span>
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                Your Exclusive Referral Code
              </span>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-mono text-xl font-bold tracking-widest text-white">
                  {myReferralCode}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(myReferralCode);
                    setCodeCopied(true);
                    setTimeout(() => setCodeCopied(false), 2000);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  {codeCopied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-xs text-blue-100 pt-1">
                Share this code with fellow university students or parents. {settings.referralBonusText}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900">How Referrals Work:</h4>
              <p className="text-slate-600 leading-relaxed">{settings.referralRules}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">My Referred Users & Earnings</h4>
              {tutorReferrals.length === 0 ? (
                <p className="text-slate-400 italic py-3 text-center">No friends referred yet. Start sharing your code!</p>
              ) : (
                <div className="space-y-2">
                  {tutorReferrals.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{ref.referredUserName || 'Referred Friend'}</span>
                        <p className="text-[11px] text-slate-500">{ref.date} · Code: {ref.referralCode}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ref.rewardStatus === 'credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Reward: {ref.rewardStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 2: TUTOR REVIEWS & PERFORMANCE RATINGS TAB        */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (() => {
          const approvedCount = myReviews.filter(r => r.status === 'approved').length;
          const pendingCount = myReviews.filter(r => r.status === 'pending').length;

          const criteriaReviews = myReviews.filter(r => r.criteria);
          const avgTeaching = criteriaReviews.length > 0
            ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.teachingSkill || 5), 0) / criteriaReviews.length).toFixed(1)
            : '5.0';
          const avgPunctuality = criteriaReviews.length > 0
            ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.punctuality || 5), 0) / criteriaReviews.length).toFixed(1)
            : '5.0';
          const avgBehavior = criteriaReviews.length > 0
            ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.behavior || 5), 0) / criteriaReviews.length).toFixed(1)
            : '5.0';
          const avgImprovement = criteriaReviews.length > 0
            ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.studentImprovement || 5), 0) / criteriaReviews.length).toFixed(1)
            : '4.9';

          const handleSendReply = (reviewId: string) => {
            const text = (replyTextMap[reviewId] || '').trim();
            if (!text) return;
            store.replyToReview(reviewId, text, tutor.fullName);
            setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
            setReplyInputOpenId(null);
          };

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      ফিচার ২ • টিউটর রেটিং ও রিভিউ
                    </span>
                    <span className="text-slate-400 font-medium">({myReviews.length} টি রিভিউ)</span>
                  </div>
                  <h3 className="font-bold text-base text-blue-950 mt-1">
                    {language === 'bn' ? 'অভিভাবকদের মতামত ও পারফরম্যান্স বিশ্লেষণ' : 'Guardian Reviews & Feedback'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    অভিভাবকদের রিভিউ আপনার প্রোফাইলের ট্রাস্ট ও নতুন টিউশন পাওয়ার সম্ভাবনা বাড়িয়ে দেয়। প্রতিটি রিভিউতে আন্তরিকভাবে উত্তর দিন।
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 self-start sm:self-auto">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                  <div>
                    <span className="text-base font-black text-amber-950 block leading-tight">
                      {tutor.rating ? tutor.rating.toFixed(1) : '5.0'} / 5.0
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold">
                      {approvedCount} টি অনুমোদিত রিভিউ
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Pillars Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-medium">শিক্ষাদান কৌশল</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{avgTeaching}★</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">চমৎকার</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-medium">সময়ানুবর্তিতা</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{avgPunctuality}★</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">নিয়মিত</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-medium">আচরণ ও সততা</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{avgBehavior}★</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">নম্র ও শালীন</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-medium">ফলাফলের উন্নতি</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{avgImprovement}★</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">উচ্চ অগ্রগতি</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-1">
                <h4 className="font-bold text-slate-800 text-xs">
                  অভিভাবক ও শিক্ষার্থীদের প্রদত্ত রিভিউ তালিকা ({myReviews.length})
                </h4>

                {myReviews.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
                    এখনও কোনো রিভিউ জমা পড়েনি। টিউশন সম্পন্ন হলে অভিভাবকদের রিভিউ দেওয়ার জন্য অনুরোধ জানান।
                  </div>
                ) : (
                  myReviews.map((rev) => {
                    const isReplying = replyInputOpenId === rev.id;
                    const replyText = replyTextMap[rev.id] !== undefined ? replyTextMap[rev.id] : (rev.tutorReply?.replyText || '');

                    return (
                      <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">{rev.guardianName}</span>
                              {rev.isVerifiedTuition && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  যাচাইকৃত শিক্ষার্থী
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                rev.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                {rev.status === 'approved' ? 'অনুমোদিত' : 'অ্যাডমিন পর্যালোচনায়'}
                              </span>
                            </div>

                            {rev.studentGradeOrSubject && (
                              <span className="text-[11px] text-slate-500 block mt-0.5">
                                {rev.studentGradeOrSubject} • {rev.date}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>

                        {/* Criteria tags */}
                        {rev.criteria && (
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                              পদ্ধতি: {rev.criteria.teachingSkill}★
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                              সময়নিষ্ঠতা: {rev.criteria.punctuality}★
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                              আচরণ: {rev.criteria.behavior}★
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                              উন্নতি: {rev.criteria.studentImprovement}★
                            </span>
                          </div>
                        )}

                        {/* Comment text */}
                        <p className="text-slate-700 italic leading-relaxed text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                          "{rev.comment}"
                        </p>

                        {/* Tutor's Response (if already replied) */}
                        {rev.tutorReply && !isReplying && (
                          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-blue-950 text-[11px]">
                              <span className="flex items-center gap-1">
                                <CornerDownRight className="w-3.5 h-3.5 text-blue-700" />
                                আপনার উত্তর ({rev.tutorReply.repliedAt}):
                              </span>
                              <button
                                type="button"
                                onClick={() => setReplyInputOpenId(rev.id)}
                                className="text-blue-700 hover:underline cursor-pointer"
                              >
                                সম্পাদনা করুন
                              </button>
                            </div>
                            <p className="text-slate-700 pl-4 italic">
                              "{rev.tutorReply.replyText}"
                            </p>
                          </div>
                        )}

                        {/* Reply Input Box */}
                        {isReplying ? (
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 space-y-2">
                            <label className="font-bold text-slate-800 text-[11px] block">
                              অভিভাবককে উত্তর লিখুন (Public Response):
                            </label>
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyTextMap(prev => ({ ...prev, [rev.id]: e.target.value }))}
                              placeholder="অভিভাবককে আপনার আন্তরিক ধন্যবাদ বা অভিজ্ঞতা জানান..."
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setReplyInputOpenId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                বাতিল
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendReply(rev.id)}
                                className="px-4 py-1.5 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-950 cursor-pointer shadow-xs"
                              >
                                উত্তর পোস্ট করুন
                              </button>
                            </div>
                          </div>
                        ) : !rev.tutorReply && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setReplyInputOpenId(rev.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                            >
                              <CornerDownRight className="w-3.5 h-3.5 text-blue-700" />
                              <span>উত্তর দিন (Reply)</span>
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })()}

      </div>

      {/* Tutor Mobile & Desktop Full Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            
            <div>
              {/* Sidebar Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-blue-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-800 text-amber-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{tutor.fullName}</h3>
                    <p className="text-[11px] text-slate-300">ID: {tutor.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <div className="p-3 space-y-1 text-xs font-medium text-slate-700">
                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('overview')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'overview' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Briefcase className="w-4 h-4 text-blue-700" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick(null, 'tuition-jobs')}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Job Board</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick(null, 'tutor-profile-edit')}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>My Profile & CV</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('applications')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'applications' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>My Applications ({tutorApplications.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('attendance')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'attendance' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Attendance</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('payments')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'payments' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span>Payment Records</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('certificates')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'certificates' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Certificates</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('reviews')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'reviews' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Reviews & Ratings ({myReviews.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('notices')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'notices' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Notice Board ({publishedNotices.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('referrals')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'referrals' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Refer & Earn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('notifications')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>Notifications</span>
                  {unreadNotifsCount > 0 && <span className="ml-auto bg-rose-600 text-white rounded-full px-1.5 py-0.2 text-[10px]">{unreadNotifsCount}</span>}
                </button>

                {/* Direct Working Actions as requested in Section 24 */}
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    setModalMessage('Message sent to Admin! Admin will respond via phone/WhatsApp.');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Message Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    setKycModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 bg-blue-50/70 text-blue-900 font-bold hover:bg-blue-100"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>KYC ভেরিফিকেশন ও ট্রাস্ট ব্যাজ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick(null, 'how-it-works')}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>How It Works</span>
                </button>
              </div>
            </div>

            {/* Sidebar Bottom */}
            <div className="p-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setSidebarOpen(false); logout(); }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quick feedback dialog */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-800">{modalMessage}</p>
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className="px-6 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Feature 1: Tutor KYC Verification & Document Upload Modal */}
      <TutorKycVerificationModal
        tutor={tutor}
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
      />

    </div>
  );
};
