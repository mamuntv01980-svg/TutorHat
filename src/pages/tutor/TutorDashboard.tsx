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
  Sparkles,
  Video,
  ExternalLink,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Laptop,
  Home,
  Receipt,
  FileCheck,
  CheckCheck,
  BookOpen,
  Printer,
  Phone,
  TrendingUp
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { store, calculateCvCompletion } from '../../services/store';
import { CallButton } from '../../components/common/CallButton';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import { TutorVerificationBadge } from '../../components/common/TutorVerificationBadge';
import { TutorKycVerificationModal } from '../../components/tutor/TutorKycVerificationModal';
import { TRANSLATIONS } from '../../constants/translations';
import { TutorProfile, DemoClass, TuitionConfirmation, PaymentRecord, AttendanceRecord, CertificateRecord, StudentProgressReport } from '../../types';
import { TuitionAgreementSlipModal } from '../../components/tuition/TuitionAgreementSlipModal';
import { ClassAttendanceModal } from '../../components/tuition/ClassAttendanceModal';
import { PaymentReceiptModal } from '../../components/tuition/PaymentReceiptModal';
import { CertificateViewModal } from '../../components/tuition/CertificateViewModal';
import { ChatHubSection } from '../../components/chat/ChatHubSection';
import { StudentProgressReportModal } from '../../components/progress/StudentProgressReportModal';
import { CreateProgressReportModal } from '../../components/progress/CreateProgressReportModal';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'demos' | 'confirmations' | 'attendance' | 'payments' | 'certificates' | 'messages' | 'progress' | 'notifications' | 'notices' | 'referrals' | 'reviews'>('overview');
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyInputOpenId, setReplyInputOpenId] = useState<string | null>(null);

  // Feature 6: In-App Chat & Student Progress Reports
  const [selectedProgressReportForView, setSelectedProgressReportForView] = useState<StudentProgressReport | null>(null);
  const [progressReportModalOpen, setProgressReportModalOpen] = useState(false);
  const [createReportModalOpen, setCreateReportModalOpen] = useState(false);

  // Feature 5: Tuition Agreement, Attendance Log, Salary Receipts & Certificates
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedConfForAgreement, setSelectedConfForAgreement] = useState<TuitionConfirmation | null>(null);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<CertificateRecord | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [attendanceActionToast, setAttendanceActionToast] = useState<string | null>(null);

  // Feature 4: Demo Class Scheduling & Feedback State
  const [demoFilterStatus, setDemoFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [tutorFeedbackModalOpen, setTutorFeedbackModalOpen] = useState(false);
  const [selectedDemoForFeedback, setSelectedDemoForFeedback] = useState<DemoClass | null>(null);
  const [tutorFeedbackText, setTutorFeedbackText] = useState('');
  const [tutorRescheduleModalOpen, setTutorRescheduleModalOpen] = useState(false);
  const [selectedDemoForReschedule, setSelectedDemoForReschedule] = useState<DemoClass | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('5:30 PM');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const handleSaveTutorFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForFeedback) return;
    store.updateDemoResult(
      selectedDemoForFeedback.id,
      selectedDemoForFeedback.result || 'further_review',
      selectedDemoForFeedback.guardianFeedback,
      tutorFeedbackText.trim()
    );
    setTutorFeedbackModalOpen(false);
    setSelectedDemoForFeedback(null);
    setTutorFeedbackText('');
    setModalMessage(language === 'bn' ? 'ডেমো ক্লাসের মূল্যায়ন ও ফিডব্যাক সফলভাবে সংরক্ষিত হয়েছে!' : 'Demo class feedback saved successfully!');
  };

  const handleTutorReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForReschedule || !newRescheduleDate) return;
    store.rescheduleDemo(
      selectedDemoForReschedule.id,
      newRescheduleDate,
      newRescheduleTime,
      rescheduleReason.trim()
    );
    setTutorRescheduleModalOpen(false);
    setSelectedDemoForReschedule(null);
    setNewRescheduleDate('');
    setRescheduleReason('');
    setModalMessage(language === 'bn' ? 'ডেমো ক্লাসের সময় পরিবর্তনের অনুরোধ আপডেট হয়েছে!' : 'Demo class rescheduled successfully!');
  };

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
  // Feature 6: In-App Chat & Student Progress Reports
  const tutorReports = storeState.progressReports.filter(r => r.tutorId === tutor?.id || r.tutorName === tutor?.fullName);
  const tutorConversations = store.getConversationsForUser(currentUser?.id || tutor?.userId || 'user_tutor_01');
  const unreadChatCount = tutorConversations.reduce((acc, c) => acc + (c.unreadCountTutor || 0), 0);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Main Dashboard Heading - Requirement 4 */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              {language === 'bn' ? 'আপনার এলাকার উপযুক্ত টিউটর/টিউশন খুঁজুন' : 'Find the Right Tutor / Tuition in Your Area'}
            </h2>
            <p className="text-xs text-blue-200">
              {language === 'bn' 
                ? 'আপনার পছন্দের এলাকা ও বিষয়ের সাথে মানানসই সেরা টিউশন অফারে আবেদন করুন এবং নিয়মিত আপডেট পান।' 
                : 'Browse and apply to prime tuition offers matching your preferred areas, subjects and schedule.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('tuition-jobs')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>{language === 'bn' ? 'টিউশন জবস দেখুন' : 'Explore Tuition Jobs'}</span>
          </button>
        </div>

        {/* Verification Status & CV Completion Banner */}
        <div className="space-y-4">
          
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

            {/* Feature 5: Active Tuition Contracts & Quick Actions */}
            {tutorConfirmations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-blue-950">
                      {language === 'bn' ? 'সক্রিয় টিউশন চুক্তি ও ক্লাস ডায়েরি' : 'Active Tuition Contracts'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttendanceModalOpen(true)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + {language === 'bn' ? 'হাজিরা লগ করুন' : 'Log Attendance'}
                  </button>
                </div>

                <div className="space-y-2">
                  {tutorConfirmations.map((conf) => (
                    <div key={conf.id} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-bold">
                            {conf.agreementCode || 'TH-AGR'}
                          </span>
                          <h4 className="font-bold text-slate-900">{conf.studentName} — {conf.jobTitle}</h4>
                        </div>
                        <p className="text-slate-600 mt-1">
                          অভিভাবক: {conf.guardianName} · রুটিন: {conf.scheduleTime} ({conf.daysPerWeek} দিন/সপ্তাহ)
                        </p>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          সম্মানী: ৳{conf.monthlyFee.toLocaleString()}/মাস · সম্পন্ন ক্লাস: {conf.completedClassesCount || 0} টি
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedConfForAgreement(conf);
                            setAgreementModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'চুক্তিপত্র' : 'Agreement'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendanceModalOpen(true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'হাজিরা দিন' : 'Log Class'}</span>
                        </button>
                      </div>
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

        {/* ========================================================= */}
        {/* FEATURE 4: DEMO CLASSES & TRIAL SESSIONS MANAGEMENT HUB   */}
        {/* ========================================================= */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            
            {/* Header with Title and Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">
                    {language === 'bn' ? 'ডেমো ও ট্রায়াল' : 'Demo & Trial'}
                  </span>
                  <span className="text-slate-400 font-medium">({tutorDemos.length} টি ডেমো সেশন)</span>
                </div>
                <h3 className="font-bold text-base text-blue-950 mt-1">
                  {language === 'bn' ? 'ফ্রি ডেমো ক্লাস ও ট্রায়াল সেশন' : 'Free Demo Classes & Trial Sessions'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'অভিভাবকদের সাথে নির্ধারিত ফ্রি ট্রায়াল ক্লাসের সময়সূচী, অনলাইন মিটিং লিংক এবং শিক্ষার্থীর মূল্যায়ন ফিডব্যাক পরিচালনা করুন।'
                    : 'Manage trial sessions, join online Meet calls, reschedule, and submit student assessment feedback.'}
                </p>
              </div>

              {/* Stat Badges */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="px-3 py-1 text-center border-r border-slate-200">
                  <span className="text-[10px] text-slate-500 block">আসন্ন</span>
                  <span className="font-bold text-blue-900 text-sm">
                    {tutorDemos.filter(d => d.status === 'scheduled').length}
                  </span>
                </div>
                <div className="px-3 py-1 text-center border-r border-slate-200">
                  <span className="text-[10px] text-slate-500 block">নির্বাচিত/কনফার্মড</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {tutorDemos.filter(d => d.result === 'selected' || d.status === 'completed').length}
                  </span>
                </div>
                <div className="px-3 py-1 text-center">
                  <span className="text-[10px] text-slate-500 block">মোট ডেমো</span>
                  <span className="font-bold text-slate-800 text-sm">{tutorDemos.length}</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-md">
              <button
                type="button"
                onClick={() => setDemoFilterStatus('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'all' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব সেশন ({tutorDemos.length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('scheduled')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'scheduled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                আসন্ন ({tutorDemos.filter(d => d.status === 'scheduled').length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('completed')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'completed' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সম্পন্ন ({tutorDemos.filter(d => d.status === 'completed' || d.result === 'selected').length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('cancelled')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'cancelled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                স্থগিত / বাতিল
              </button>
            </div>

            {/* List of Demos */}
            {(() => {
              const filtered = tutorDemos.filter(d => {
                if (demoFilterStatus === 'scheduled') return d.status === 'scheduled';
                if (demoFilterStatus === 'completed') return d.status === 'completed' || d.result === 'selected';
                if (demoFilterStatus === 'cancelled') return d.status === 'cancelled' || d.status === 'rescheduled';
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-12 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-slate-200">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-slate-600 font-medium">
                      {demoFilterStatus === 'scheduled'
                        ? 'এই মুহূর্তে কোনো আসন্ন ডেমো ক্লাস নির্ধারিত নেই।'
                        : 'কোনো ডেমো ক্লাসের তথ্য পাওয়া যায়নি।'}
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      অভিভাবকরা আপনার প্রোফাইল দেখে অথবা জব সার্কুলারে আবেদনের ভিত্তিতে ফ্রি ট্রায়াল ডেমো সেশন বুক করবেন।
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo('tuition-jobs')}
                      className="px-4 py-2 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-950 cursor-pointer"
                    >
                      নতুন সার্কুলার খুঁজুন →
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((demo) => {
                    const isOnline = demo.mode === 'online';
                    const isUpcoming = demo.status === 'scheduled';

                    return (
                      <div
                        key={demo.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          demo.result === 'selected'
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : isUpcoming
                            ? 'bg-white border-blue-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                                {demo.id}
                              </span>
                              <span className="font-bold text-slate-900 text-sm">
                                {demo.studentName ? `${demo.studentName} (${demo.studentGrade || 'Class'})` : demo.jobTitle}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-blue-900 font-semibold">{demo.subject || 'সকল বিষয়'}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{demo.jobTitle}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Mode Badge */}
                            <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 ${
                              isOnline ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {isOnline ? <Laptop className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                              <span>{isOnline ? 'অনলাইন (Meet)' : 'হোম টিউশন (বাসায়)'}</span>
                            </span>

                            {/* Status Badge */}
                            <span className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                              demo.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : demo.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-900'
                                : demo.status === 'rescheduled'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {demo.status === 'scheduled' ? 'আসন্ন শিডিউল' : demo.status}
                            </span>

                            {/* Result Badge */}
                            {demo.result && (
                              <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                                demo.result === 'selected'
                                  ? 'bg-emerald-600 text-white'
                                  : demo.result === 'further_review'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {demo.result === 'selected' ? '✓ টিউশনে চূড়ান্ত নির্বাচিত' : demo.result === 'further_review' ? 'বিবেচনায় রয়েছে' : 'অন্য শিক্ষক নির্বাচিত'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 text-xs">
                          {/* Time & Date */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-700" />
                              তারিখ ও সময়
                            </span>
                            <p className="font-bold text-slate-900">{demo.date}</p>
                            <p className="text-[11px] text-blue-900 font-semibold">{demo.time}</p>
                          </div>

                          {/* Guardian Contact */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium">অভিভাবকের তথ্য</span>
                            <p className="font-bold text-slate-900">{demo.guardianName}</p>
                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={`tel:${demo.guardianPhone}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-semibold text-[11px] hover:bg-blue-100"
                              >
                                <Phone className="w-3 h-3" />
                                {demo.guardianPhone}
                              </a>
                              <WhatsAppButton phoneNumber={demo.guardianPhone} message={`সালামু আলাইকুম ${demo.guardianName}, আমি TutorHat থেকে আপনার ডেমো ক্লাসের টিউটর ${tutor.fullName}।`} />
                            </div>
                          </div>

                          {/* Location / Meeting link */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1 sm:col-span-2 md:col-span-1">
                            <span className="text-[10px] text-slate-500 block font-medium">
                              {isOnline ? 'অনলাইন মিটিং লিংক' : 'ক্লাসের স্থান ও ঠিকানা'}
                            </span>
                            {isOnline ? (
                              <div className="space-y-1.5">
                                <a
                                  href={demo.meetingLink || 'https://meet.google.com'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>Google Meet এ প্রবেশ</span>
                                  <ExternalLink className="w-3 h-3 ml-0.5" />
                                </a>
                                <p className="text-[10px] text-slate-500 font-mono truncate">
                                  {demo.meetingLink || 'https://meet.google.com/demo-tutorhat'}
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold text-slate-800 text-[11px] leading-relaxed">
                                {demo.location || 'অভিভাবকের বাসা'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Guardian Notes if provided */}
                        {demo.notes && (
                          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-900 block">অভিভাবকের নির্দেশনা / নোট:</span>
                            <p className="text-slate-700 italic">"{demo.notes}"</p>
                          </div>
                        )}

                        {/* Feedback & Assessment Logs */}
                        {(demo.tutorFeedback || demo.guardianFeedback) && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            {demo.tutorFeedback && (
                              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px]">
                                <span className="font-bold text-blue-950 block">আপনার সাবমিটকৃত মূল্যায়ন (Tutor Feedback):</span>
                                <p className="text-slate-700 mt-0.5">{demo.tutorFeedback}</p>
                              </div>
                            )}

                            {demo.guardianFeedback && (
                              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px]">
                                <span className="font-bold text-emerald-950 block">অভিভাবকের মন্তব্য (Guardian Decision Note):</span>
                                <p className="text-slate-700 mt-0.5">{demo.guardianFeedback}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Tutor Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {demo.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDemoForFeedback(demo);
                                  setTutorFeedbackText(demo.tutorFeedback || '');
                                  setTutorFeedbackModalOpen(true);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{demo.tutorFeedback ? 'মূল্যায়ন আপডেট' : 'ক্লাস মূল্যায়ন ও ফিডব্যাক'}</span>
                              </button>
                            )}

                            {demo.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDemoForReschedule(demo);
                                  setNewRescheduleDate(demo.date);
                                  setNewRescheduleTime(demo.time);
                                  setRescheduleReason('');
                                  setTutorRescheduleModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
                                <span>সময় পরিবর্তনের অনুরোধ</span>
                              </button>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400">
                            বুকিং তারিখ: {demo.createdAt || 'সম্প্রতি'}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 6: IN-APP DIRECT CHAT & LIVE MESSAGING HUB        */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <ChatHubSection userRole="tutor" currentUserId={currentUser?.id || tutor.userId || 'user_tutor_01'} />
          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 6: STUDENT ACADEMIC PROGRESS & EVALUATION REPORTS */}
        {/* ========================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'bn' ? 'শিক্ষার্থী মাসিক অগ্রগতি ও একাডেমিক মূল্যায়ন' : 'Student Progress Reports'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    {language === 'bn' ? 'শিক্ষার্থী একাডেমিক প্রগ্রেস কার্ড ও রিপোর্ট' : 'Student Academic Progress Cards'}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {language === 'bn'
                      ? 'শিক্ষার্থীদের মাসিক উপস্থিতি, পড়ার মনোযোগ, পরীক্ষা ও হোমওয়ার্কের অগ্রগতি রিপোর্ট প্রদান ও মনিটরিং করুন।'
                      : 'Create and manage monthly evaluation reports, scores, and feedback for your students.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreateReportModalOpen(true)}
                  disabled={tutorConfirmations.length === 0}
                  className="px-4 py-2.5 rounded-2xl bg-blue-900 hover:bg-blue-950 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>+ নতুন প্রগ্রেস রিপোর্ট তৈরি</span>
                </button>
              </div>

              {tutorReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-1" />
                  <p className="font-bold text-slate-700">এখনো কোনো মাসিক অগ্রগতি রিপোর্ট তৈরি করা হয়নি</p>
                  <p className="text-[11px] text-slate-400">
                    সক্রিয় টিউশনের শিক্ষার্থীদের জন্য মাসিক মূল্যায়ন কার্ড তৈরি করতে ওপরের বোতামে চাপুন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutorReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-5 rounded-2xl bg-gradient-to-br from-white to-blue-50/40 border border-slate-200 shadow-xs space-y-3.5 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                              {report.reportCode}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{report.month}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{report.studentName}</h4>
                          <p className="text-xs text-slate-600">{report.classLevel} • {report.subject}</p>
                        </div>

                        <div className="text-center px-3 py-1.5 rounded-xl bg-amber-400 text-blue-950 font-black shadow-xs shrink-0">
                          <span className="text-[9px] block uppercase font-bold leading-none text-blue-900">Grade</span>
                          <span className="text-xl leading-tight">{report.overallGrade}</span>
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-white rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">উপস্থিতি:</span>
                          <span className="font-bold text-blue-900 font-mono">{report.attendanceScore}%</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">হোমওয়ার্ক:</span>
                          <span className="font-bold text-emerald-700 font-mono">{report.homeworkCompletionScore}%</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">মনোযোগ:</span>
                          <span className="font-bold text-amber-700 font-mono">{report.classAttentionScore}%</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">টেস্ট/কুইজ:</span>
                          <span className="font-bold text-indigo-900 font-mono">{report.examOrQuizScore}%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/80 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                        <span className="font-bold text-blue-950 block mb-0.5">আপনার মূল্যায়ন মন্তব্য:</span>
                        <p className="line-clamp-2 italic">"{report.tutorRemarks}"</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">অভিভাবক: {report.guardianName}</span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProgressReportForView(report);
                            setProgressReportModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>প্রগ্রেস কার্ড দেখুন</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 5: CLASS ATTENDANCE & STUDY LOG TRACKER           */}
        {/* ========================================================= */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'bn' ? 'ডিজিটাল ক্লাস হাজিরা ও স্টাডি ডায়েরি' : 'Class Attendance & Diary'}</span>
                </div>
                <h3 className="font-extrabold text-base text-blue-950">
                  {language === 'bn' ? 'ক্লাস উপস্থিতি ও দৈনিক পড়া ট্র্যাকার' : 'Class Attendance & Learning Log'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' 
                    ? 'প্রতিটি ক্লাস শেষে পাঠ্য বিষয় ও বাড়ির কাজ লগ করুন। অভিভাবক সরাসরি তা দেখতে ও সত্যায়িত করতে পারেন।' 
                    : 'Log topics covered and homework after each session to maintain transparent records.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? '+ ক্লাস হাজিরা ও পড়া লগ করুন' : '+ Log Class Attendance'}</span>
                </button>
              </div>
            </div>

            {attendanceActionToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">{attendanceActionToast}</span>
              </div>
            )}

            {/* Attendance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 block">মোট ক্লাস সম্পন্ন</span>
                <span className="text-xl font-black text-blue-950 tabular-nums">
                  {tutorAttendance.length} টি
                </span>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[11px] text-emerald-800 block">উপস্থিতি (Present)</span>
                <span className="text-xl font-black text-emerald-700 tabular-nums">
                  {tutorAttendance.filter(a => a.status === 'present').length} টি
                </span>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <span className="text-[11px] text-amber-800 block">বিলম্ব / অফ</span>
                <span className="text-xl font-black text-amber-700 tabular-nums">
                  {tutorAttendance.filter(a => a.status === 'late' || a.status === 'cancelled').length} টি
                </span>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <span className="text-[11px] text-blue-800 block">অভিভাবক সত্যায়িত</span>
                <span className="text-xl font-black text-blue-900 tabular-nums">
                  {tutorAttendance.filter(a => a.verifiedByGuardian).length} টি
                </span>
              </div>
            </div>

            {tutorAttendance.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  {language === 'bn' ? 'এখনও কোনো ক্লাস হাজিরা লগ করা হয়নি।' : 'No attendance logged yet for ongoing tuition.'}
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'bn' 
                    ? 'ক্লাস সম্পন্ন করে ওপরের বোতামে ক্লিক করে পাঠের বিবরণ ও বাড়ির কাজ লিখে হাজিরা সংরক্ষণ করুন।' 
                    : 'Click the button above to log daily attendance and study topics.'}
                </p>
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? 'প্রথম ক্লাস হাজিরা লগ করুন' : 'Log First Class'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tutorAttendance.map((att) => (
                  <div 
                    key={att.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {att.date}
                        </span>
                        <span className="text-xs font-bold text-blue-950">
                          {att.studentName}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-mono">
                          {att.time || '০৫:৩০ PM'} ({att.durationMinutes || 90} মিনিট)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          att.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                          att.status === 'late' ? 'bg-amber-100 text-amber-800' :
                          att.status === 'absent' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {att.status === 'present' ? 'উপস্থিত ✓' : att.status === 'late' ? 'বিলম্ব' : att.status}
                        </span>

                        {att.verifiedByGuardian ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" />
                            <span>অভিভাবক সত্যায়িত ✓</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium text-[10px]">
                            অনুমোদনের অপেক্ষায়
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                        <span className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>আজকের পাঠ / টপিক:</span>
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {att.topicsCovered || att.notes}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1">
                        <span className="font-bold text-blue-950 flex items-center gap-1 text-[11px]">
                          <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                          <span>বাড়ির কাজ / হোমওয়ার্ক:</span>
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {att.homeworkAssigned || 'নিয়মিত নোট ও সূত্র রিভিশন।'}
                        </p>
                      </div>
                    </div>

                    {att.notes && att.notes !== att.topicsCovered && (
                      <p className="text-[11px] text-slate-500 italic pt-1">
                        নোট: {att.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 5: TUITION REMUNERATION & MONEY RECEIPTS          */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 font-bold text-[10px]">
                  <Receipt className="w-3.5 h-3.5 text-pink-700" />
                  <span>{language === 'bn' ? 'টিউশন সম্মানী ও ডিজিটাল মানি রিসিট' : 'Remuneration & Receipts'}</span>
                </div>
                <h3 className="font-extrabold text-base text-blue-950">
                  {language === 'bn' ? 'সম্মানী, পেমেন্ট হিস্ট্রি ও মানি রিসিট' : 'Tuition Remuneration & Payment Records'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' 
                    ? 'মাসিক বেতন প্রাপ্তির ডিজিটাল ক্যাশ মেমো ও বিকাশ/নগদ পেমেন্ট ট্র্যাকিং।' 
                    : 'Track salary payments, acknowledge receipts, and print official vouchers.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (tutorConfirmations.length > 0) {
                      store.requestSalaryInvoice(
                        tutor.id,
                        tutorConfirmations[0].guardianId,
                        tutorConfirmations[0].jobId,
                        'এপ্রিল ২০২৬',
                        tutorConfirmations[0].monthlyFee,
                        'এপ্রিল মাসের নিয়মিত টিউশন ফি রিকুয়েস্ট।'
                      );
                      setAttendanceActionToast(language === 'bn' ? 'অভিভাবকের অ্যাকাউন্টে এপ্রিল মাসের বেতনের রিকুয়েস্ট পাঠানো হয়েছে!' : 'Salary invoice requested successfully!');
                      setTimeout(() => setAttendanceActionToast(null), 3000);
                    }
                  }}
                  className="px-4 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>{language === 'bn' ? '+ বেতনের রিকুয়েস্ট পাঠান' : '+ Request Monthly Bill'}</span>
                </button>
              </div>
            </div>

            {/* Remuneration Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">পরিশোধিত মোট সম্মানী</span>
                <span className="text-2xl font-black text-emerald-950 tabular-nums">
                  ৳{tutorPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  {tutorPayments.filter(p => p.status === 'paid').length} টি পেমেন্ট রিসিট ভেরিফাইড
                </span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[11px] text-amber-800 font-semibold block">বকেয়া সম্মানী (Pending Due)</span>
                <span className="text-2xl font-black text-amber-950 tabular-nums">
                  ৳{tutorPayments.filter(p => p.status === 'due').reduce((s, p) => s + p.amount, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  চলতি মাসের রিকুয়েস্ট
                </span>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-[11px] text-blue-800 font-semibold block">চুক্তিবদ্ধ মাসিক আয়</span>
                <span className="text-2xl font-black text-blue-950 tabular-nums">
                  ৳{tutorConfirmations.reduce((s, c) => s + c.monthlyFee, 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-blue-700 block mt-0.5">
                  {tutorConfirmations.length} টি সক্রিয় টিউশন চুক্তি
                </span>
              </div>
            </div>

            {/* Platform Official Payment Accounts Card */}
            <div className="p-4 bg-gradient-to-r from-pink-50 via-amber-50 to-emerald-50 rounded-2xl border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  💳 প্ল্যাটফর্ম অফিসিয়াল বিকাশ ও নগদ নম্বর:
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
              <div className="space-y-3">
                {tutorPayments.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          {p.receiptNumber || p.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'due' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {p.status === 'paid' ? 'পরিশোধিত (Paid ✓)' : p.status === 'due' ? 'বকেয়া (Due)' : p.status}
                        </span>
                        {p.acknowledgedByTutor && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                            প্রাপ্তি নিশ্চিত ✓
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{p.month} — {p.notes}</h4>
                      <p className="text-slate-600">
                        অভিভাবক: {p.guardianName} · তারিখ: {p.paidAt ? p.paidAt.split('T')[0] : p.paymentDate}
                      </p>
                      {p.transactionId && (
                        <p className="text-[11px] font-mono text-slate-500">
                          মেথড: {p.paymentMethod?.toUpperCase() || 'BKASH'} · TrxID: {p.transactionId}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <span className="font-black text-blue-950 block text-lg tabular-nums">
                        ৳{p.amount.toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {p.status === 'paid' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPaymentForReceipt(p);
                              setReceiptModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'মানি রিসিট দেখুন' : 'View Receipt'}</span>
                          </button>
                        )}

                        {p.status === 'paid' && !p.acknowledgedByTutor && (
                          <button
                            type="button"
                            onClick={() => {
                              store.acknowledgePayment(p.id);
                              setAttendanceActionToast(language === 'bn' ? 'বেতন প্রাপ্তি স্বীকার নিশ্চিত করা হয়েছে ✓' : 'Payment acknowledged!');
                              setTimeout(() => setAttendanceActionToast(null), 3000);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'প্রাপ্তি স্বীকার' : 'Acknowledge'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 5: OFFICIAL CERTIFICATES & RECOGNITION            */}
        {/* ========================================================= */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>{language === 'bn' ? 'অফিসিয়াল রিকগনিশন ও অভিজ্ঞতা সনদ' : 'Verified Certificates'}</span>
                </div>
                <h3 className="font-extrabold text-base text-blue-950 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>{language === 'bn' ? 'অর্জিত সনদ ও অভিজ্ঞতা প্রশংসাপত্র' : 'Official Certificates & Experience Letters'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' 
                    ? 'সফলভাবে টিউশন চুক্তি পরিচালনা, ১০০% উপস্থিতি ও অভিভাবক সন্তুষ্টির ভিত্তিতে প্ল্যাটফর্মের অফিসিয়াল প্রশংসাপত্র।' 
                    : 'Download or print high-fidelity certificates conferring mentorship excellence.'}
                </p>
              </div>
            </div>

            {tutorCertificates.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  {language === 'bn' ? 'বর্তমানে কোনো সনদ ইস্যু করা নেই।' : 'No certificates awarded yet.'}
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {language === 'bn' 
                    ? 'টিউশন চুক্তি সফলভাবে সম্পন্ন করলে টিউটরহ্যাট অ্যাকাডেমিক বোর্ড কর্তৃক এক্সপেরিয়েন্স সার্টিফিকেট প্রদান করা হবে।' 
                    : 'Certificates are awarded upon successful completion of tuition contracts.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tutorCertificates.map((cert) => (
                  <div 
                    key={cert.id} 
                    className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 border-2 border-amber-200/80 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-base text-amber-950 block">
                            {cert.title}
                          </span>
                          <span className="text-[11px] text-amber-800 font-semibold">
                            ★ {cert.gradeHonor || 'Outstanding Mentor'} ★
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg block sm:inline-block">
                          {cert.verificationCode}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          ইস্যু: {cert.issueDate}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-sans">
                      {cert.description}
                    </p>

                    {cert.subject && (
                      <div className="p-2 bg-amber-100/50 rounded-lg text-[11px] text-amber-900 font-medium inline-block">
                        বিষয় ক্ষেত্র: {cert.subject}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                      <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ভেরিফাইড ডিজিটাল সনদপত্র ✓</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCertForView(cert);
                          setCertModalOpen(true);
                        }}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'সনদ দেখুন ও প্রিন্ট করুন' : 'View & Print Certificate'}</span>
                      </button>
                    </div>
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
                      টিউটর রেটিং ও রিভিউ
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
                  onClick={() => handleSidebarItemClick('demos')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'demos' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Demo Classes</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                      {tutorDemos.length}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('messages')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between ${activeTab === 'messages' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-700" />
                    <span>Live Chat & Messages</span>
                  </div>
                  {unreadChatCount > 0 ? (
                    <span className="w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {unreadChatCount}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">
                      {tutorConversations.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSidebarItemClick('progress')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 ${activeTab === 'progress' ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50'}`}
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Student Progress Reports ({tutorReports.length})</span>
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

      {/* Feature 4: Tutor Student Assessment & Feedback Modal */}
      {tutorFeedbackModalOpen && selectedDemoForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'ডেমো ক্লাসের মূল্যায়ন ও ফিডব্যাক' : 'Submit Demo Assessment'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedDemoForFeedback.studentName || 'শিক্ষার্থী'} • {selectedDemoForFeedback.subject}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTutorFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTutorFeedback} className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'শিক্ষার্থী সম্পর্কে আপনার মূল্যায়ন ও মতামত *' : 'Your Assessment & Notes *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={tutorFeedbackText}
                  onChange={(e) => setTutorFeedbackText(e.target.value)}
                  placeholder="যেমন: ছাত্রের গণিত ও বিজ্ঞানের বেসিক ভালো। সিলেবাস ৩ মাসে রিভিশন করিয়ে টেস্ট পরীক্ষার উপযোগী করা সম্ভব। আমি পড়াতে আগ্রহী।"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-950">
                💡 এই মূল্যায়ন অভিভাবক ও টিউটরহ্যাট অ্যাডমিনের কাছে প্রদর্শিত হবে, যা টিউশন কনফার্ম করতে সহায়তা করবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTutorFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  মূল্যায়ন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 4: Tutor Reschedule Request Modal */}
      {tutorRescheduleModalOpen && selectedDemoForReschedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <CalendarClock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'সময় পরিবর্তনের অনুরোধ' : 'Request Reschedule'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    অভিভাবক: {selectedDemoForReschedule.guardianName} ({selectedDemoForReschedule.guardianPhone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTutorRescheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTutorReschedule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'নতুন তারিখ *' : 'New Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newRescheduleDate}
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'নতুন সময় *' : 'New Time *'}
                  </label>
                  <select
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'কারণ বা নোট *' : 'Reason / Note *'}
                </label>
                <input
                  type="text"
                  required
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="যেমন: বিশ্ববিদ্যালয়ের সেমিস্টার পরীক্ষা থাকায় পরের দিন সন্ধ্যায়"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTutorRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  আপডেট ও নোটিফাই
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 5: Tuition Agreement Slip Modal */}
      <TuitionAgreementSlipModal
        confirmation={selectedConfForAgreement}
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
      />

      {/* Feature 5: Daily Class Attendance Log Modal */}
      <ClassAttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        confirmations={tutorConfirmations}
        defaultTutorId={tutor.id}
        defaultTutorName={tutor.fullName}
        onSuccess={() => {
          setAttendanceActionToast(language === 'bn' ? 'ক্লাস হাজিরা ও পড়া সফলভাবে লগ করা হয়েছে!' : 'Attendance logged successfully!');
          setTimeout(() => setAttendanceActionToast(null), 3000);
        }}
      />

      {/* Feature 5: Payment Receipt Voucher Modal */}
      <PaymentReceiptModal
        payment={selectedPaymentForReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

      {/* Feature 5: Certificate View & Print Modal */}
      <CertificateViewModal
        certificate={selectedCertForView}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />

      {/* Feature 6: Student Progress Report Card Modal */}
      <StudentProgressReportModal
        report={selectedProgressReportForView}
        isOpen={progressReportModalOpen}
        onClose={() => setProgressReportModalOpen(false)}
      />

      {/* Feature 6: Create Progress Report Modal */}
      <CreateProgressReportModal
        isOpen={createReportModalOpen}
        onClose={() => setCreateReportModalOpen(false)}
        confirmations={tutorConfirmations}
        tutorId={tutor.id}
        tutorName={tutor.fullName}
        tutorUniversity={tutor.university}
      />

    </div>
  );
};
