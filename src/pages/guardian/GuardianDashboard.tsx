import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Heart, 
  Calendar, 
  Star, 
  Bell, 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Send,
  LogOut,
  Info,
  Volume2,
  Share2,
  Copy,
  Check,
  Video,
  ExternalLink,
  CalendarClock,
  CalendarX,
  Sparkles,
  Laptop,
  Home,
  DollarSign,
  AlertCircle,
  Receipt,
  FileCheck,
  CheckCheck,
  BookOpen,
  FileText,
  Printer,
  Award,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store, tutorProfileImg } from '../../services/store';
import { CallButton } from '../../components/common/CallButton';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import { TRANSLATIONS } from '../../constants/translations';
import { DemoClass, TuitionConfirmation, PaymentRecord, AttendanceRecord, StudentProgressReport } from '../../types';
import { TuitionAgreementSlipModal } from '../../components/tuition/TuitionAgreementSlipModal';
import { PaymentReceiptModal } from '../../components/tuition/PaymentReceiptModal';
import { PayTuitionSalaryModal } from '../../components/tuition/PayTuitionSalaryModal';
import { ChatHubSection } from '../../components/chat/ChatHubSection';
import { StudentProgressReportModal } from '../../components/progress/StudentProgressReportModal';

export const GuardianDashboard: React.FC = () => {
  const { 
    currentUser, 
    storeState, 
    navigateTo, 
    language, 
    unreadNotifsCount, 
    logout,
    toggleShortlist,
    settings
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'shortlist' | 'applications' | 'demos' | 'confirmations' | 'attendance' | 'payments' | 'messages' | 'progress' | 'reviews' | 'notices' | 'referrals'>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTutorForReview, setSelectedTutorForReview] = useState<string>('tut_01');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Feature 6: In-App Chat & Student Academic Progress Reports
  const [selectedProgressReportForView, setSelectedProgressReportForView] = useState<StudentProgressReport | null>(null);
  const [progressReportModalOpen, setProgressReportModalOpen] = useState(false);

  // Feature 5: Tuition Agreement, Attendance & Payment States & Modals
  const [selectedConfForAgreement, setSelectedConfForAgreement] = useState<TuitionConfirmation | null>(null);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [attendanceVerifyToast, setAttendanceVerifyToast] = useState<string | null>(null);

  // Feature 4: Demo Class States & Modals
  const [demoFilterStatus, setDemoFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [demoActionToast, setDemoActionToast] = useState<string | null>(null);

  // Hire Tutor After Demo Modal
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedDemoForHire, setSelectedDemoForHire] = useState<DemoClass | null>(null);
  const [agreedMonthlyFee, setAgreedMonthlyFee] = useState(7500);
  const [agreedDaysPerWeek, setAgreedDaysPerWeek] = useState(3);
  const [agreedStartDate, setAgreedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [agreedInstructions, setAgreedInstructions] = useState('');

  // Reschedule Modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedDemoForReschedule, setSelectedDemoForReschedule] = useState<DemoClass | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('5:30 PM');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Cancel Modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedDemoForCancel, setSelectedDemoForCancel] = useState<DemoClass | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Feedback & Decision Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedDemoForFeedback, setSelectedDemoForFeedback] = useState<DemoClass | null>(null);
  const [demoResultDecision, setDemoResultDecision] = useState<'selected' | 'further_review' | 'not_selected'>('selected');
  const [guardianFeedbackText, setGuardianFeedbackText] = useState('');

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForHire) return;
    store.hireTutorAfterDemo(
      selectedDemoForHire.id,
      agreedMonthlyFee,
      agreedDaysPerWeek,
      agreedStartDate,
      selectedDemoForHire.location,
      agreedInstructions
    );
    setHireModalOpen(false);
    setSelectedDemoForHire(null);
    setDemoActionToast(language === 'bn' ? 'অভিনন্দন! ডেমো ক্লাসের পর শিক্ষক চূড়ান্ত নিয়োগ সম্পন্ন হয়েছে।' : 'Tutor officially hired! Tuition confirmed.');
    setTimeout(() => setDemoActionToast(null), 4000);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForReschedule || !newRescheduleDate) return;
    store.rescheduleDemo(
      selectedDemoForReschedule.id,
      newRescheduleDate,
      newRescheduleTime,
      rescheduleReason.trim()
    );
    setRescheduleModalOpen(false);
    setSelectedDemoForReschedule(null);
    setDemoActionToast(language === 'bn' ? 'ডেমো ক্লাসের সময়সূচী পরিবর্তন সম্পন্ন হয়েছে।' : 'Demo session rescheduled successfully.');
    setTimeout(() => setDemoActionToast(null), 4000);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForCancel) return;
    store.cancelDemo(selectedDemoForCancel.id, cancelReason.trim());
    setCancelModalOpen(false);
    setSelectedDemoForCancel(null);
    setDemoActionToast(language === 'bn' ? 'ডেমো ক্লাস বাতিল করা হয়েছে।' : 'Demo session cancelled.');
    setTimeout(() => setDemoActionToast(null), 4000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForFeedback) return;
    store.updateDemoResult(
      selectedDemoForFeedback.id,
      demoResultDecision,
      guardianFeedbackText.trim()
    );
    setFeedbackModalOpen(false);
    setSelectedDemoForFeedback(null);
    setDemoActionToast(language === 'bn' ? 'ডেমো ক্লাসের মূল্যায়ন ও সিদ্ধান্ত সংরক্ষিত হয়েছে।' : 'Demo evaluation recorded.');
    setTimeout(() => setDemoActionToast(null), 4000);
  };

  const t = TRANSLATIONS[language];
  const guardianId = currentUser?.id || 'user_guardian_01';
  const myReferralCode = currentUser?.referralCode || 'FARHANA-TH88';

  // Notices for Guardians (Section 35)
  const publishedNotices = store.getPublishedNotices('guardians');
  // Referrals for Guardians (Section 36)
  const guardianReferrals = store.getUserReferrals(guardianId);

  // Guardian requests
  const myRequests = storeState.requests.filter(r => r.guardianId === guardianId);
  // Shortlisted tutors
  const myShortlistedIds = storeState.shortlists.filter(s => s.guardianId === guardianId).map(s => s.tutorId);
  const myShortlistedTutors = storeState.tutors.filter(tut => myShortlistedIds.includes(tut.id));
  // Demos
  const myDemos = storeState.demos.filter(d => d.guardianId === guardianId);
  // Confirmations (Feature 5)
  const myConfirmations = storeState.confirmations.filter(c => c.guardianId === guardianId);
  // Attendance Records (Feature 5)
  const myAttendance = storeState.attendance.filter(a => a.guardianId === guardianId);
  // Payment Records (Feature 5)
  const myPayments = storeState.payments.filter(p => p.guardianId === guardianId);
  // Feature 6: In-App Chat & Student Progress Reports
  const myReports = storeState.progressReports.filter(r => r.guardianId === guardianId || r.guardianName === currentUser?.name);
  const myConversations = store.getConversationsForUser(guardianId);
  const unreadChatCount = myConversations.reduce((acc, c) => acc + (c.unreadCountGuardian || 0), 0);
  // Applications on my jobs
  const myJobIds = storeState.jobs.filter(j => j.guardianId === guardianId).map(j => j.id);
  const applicationsForMe = storeState.applications.filter(a => myJobIds.includes(a.jobId));
  // Notifications
  const myNotifications = storeState.notifications.filter(n => n.userId === guardianId);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.submitReview({
      tutorId: selectedTutorForReview,
      guardianId: guardianId,
      guardianName: currentUser?.name || 'Guardian',
      rating: ratingScore,
      criteria: {
        teachingSkill: ratingScore,
        punctuality: ratingScore,
        behavior: ratingScore,
        studentImprovement: ratingScore
      },
      isVerifiedTuition: true,
      comment: reviewComment
    });
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOpen(false);
      setReviewComment('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      
      {/* Guardian Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100"
                aria-label="Open Guardian Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'অভিভাবক ড্যাশবোর্ড' : 'Guardian Portal'}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
                <span className="hidden sm:inline-block text-xs text-slate-600">
                  {currentUser?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('request-tutor')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'টিউটর রিকোয়েস্ট' : 'Post Request'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('find-tutor')}
                className="hidden sm:flex px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold items-center gap-1.5 shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t.findTutor}</span>
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
                ? 'আপনার সন্তানের মানসম্মত পাঠদানের জন্য বিশ্বস্ত ও ভেরিফাইড গৃহশিক্ষক নির্বাচন করুন অথবা নতুন চাহিদা পোস্ট করুন।' 
                : 'Select verified teachers for your child or submit custom tuition requirements directly.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('request-tutor')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন টিউটর রিকোয়েস্ট' : 'Post New Request'}</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">Tuition Requests</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-950 tabular-nums">{myRequests.length}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">Shortlisted Tutors</span>
            <span className="text-xl sm:text-2xl font-bold text-rose-600 tabular-nums">{myShortlistedTutors.length}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">Applications Received</span>
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 tabular-nums">{applicationsForMe.length}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">Active Tutoring</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">{myConfirmations.length}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'messages', label: `${language === 'bn' ? 'মেসেজ ও চ্যাট' : 'Live Chat'} ${unreadChatCount > 0 ? `(${unreadChatCount})` : `(${myConversations.length})`}` },
            { id: 'progress', label: `${language === 'bn' ? 'প্রগ্রেস রিপোর্ট' : 'Progress'} (${myReports.length})` },
            { id: 'confirmations', label: `${language === 'bn' ? 'টিউশন চুক্তি' : 'Agreements'} (${myConfirmations.length})` },
            { id: 'attendance', label: `${language === 'bn' ? 'হাজিরা ডায়েরি' : 'Attendance'} (${myAttendance.length})` },
            { id: 'payments', label: `${language === 'bn' ? 'বেতন ও রিসিট' : 'Payments'} (${myPayments.length})` },
            { id: 'demos', label: `Demo Classes (${myDemos.length})` },
            { id: 'requests', label: `My Requests (${myRequests.length})` },
            { id: 'shortlist', label: `Shortlist (${myShortlistedTutors.length})` },
            { id: 'applications', label: `Applications (${applicationsForMe.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* My Active Tuition Requests */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'আমার সাম্প্রতিক টিউশন রিকোয়েস্ট' : 'My Recent Tuition Requirements'}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateTo('request-tutor')}
                  className="text-xs font-semibold text-blue-900 hover:underline"
                >
                  + Post New Request
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <p>You haven't submitted any tuition requirements yet.</p>
                  <button
                    type="button"
                    onClick={() => navigateTo('request-tutor')}
                    className="px-4 py-2 bg-blue-900 text-white rounded-xl font-semibold"
                  >
                    Post Requirement Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {req.id}
                          </span>
                          <span className="font-bold text-slate-900">{req.studentClass} ({req.medium})</span>
                        </div>
                        <p className="text-slate-600 mt-1">Area: {req.area}, {req.location} · Budget: <strong>৳{req.monthlyBudget.toLocaleString()}/mo</strong></p>
                        <p className="text-[11px] text-slate-500">Subjects: {req.subjects.join(', ')}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block ${
                          req.status === 'converted_to_job'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status === 'converted_to_job' ? 'Published as Job' : 'Pending Review'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">{req.createdAt.split('T')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Tutor & Rate / Review CTA */}
            {myConfirmations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'বর্তমান শিক্ষক ও ক্লাসের অবস্থা' : 'Active Confirmed Tutors'}</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {myConfirmations.map((conf) => (
                    <div key={conf.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{conf.tutorName}</h4>
                        <p className="text-slate-600">Student: {conf.studentName} · Monthly Fee: ৳{conf.monthlyFee.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-500">Routine: {conf.scheduleTime} ({conf.daysPerWeek} days/wk)</p>
                        
                        <div className="mt-2 p-2.5 bg-white rounded-lg border border-emerald-300 text-[11px] space-y-1">
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            💳 টিউশন ফি পরিশোধ মেথড (bKash & Nagad):
                          </span>
                          <p className="text-slate-600">
                            বিকাশ / নগদ (Personal): <strong className="font-mono text-pink-700 font-bold">{settings.paymentAccounts?.bkashNumber || '01610582917'}</strong>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {settings.paymentAccounts?.paymentInstructionsBn || 'Send Money করে রেফারেন্সে আপনার কনফার্মেশন আইডি দিন।'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedConfForAgreement(conf);
                            setAgreementModalOpen(true);
                          }}
                          className="px-3 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'চুক্তিপত্র' : 'Agreement'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('attendance')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'হাজিরা ডায়েরি' : 'Attendance'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPayModalOpen(true)}
                          className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'বেতন দিন' : 'Pay Fee'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTutorForReview(conf.tutorId);
                            setReviewModalOpen(true);
                          }}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{language === 'bn' ? 'রিভিউ দিন' : 'Review'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Top Rated Tutors */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'প্রস্তাবিত ভেরিফাইড শিক্ষক' : 'Recommended Verified Educators'}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="text-xs font-semibold text-blue-900 hover:underline"
                >
                  Browse All Tutors →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storeState.tutors.slice(0, 2).map((tutor) => (
                  <div key={tutor.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{tutor.fullName}</h4>
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{tutor.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-600">{tutor.university} ({tutor.department})</p>
                    <p className="text-[11px] text-slate-500">Expected: ৳{tutor.expectedSalary}/mo · {tutor.area}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('tutor-detail', { tutorId: tutor.id })}
                        className="flex-1 py-1.5 bg-blue-900 text-white rounded-lg text-center font-semibold"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(tutor.id)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600"
                        title="Shortlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab: Shortlisted Tutors */}
        {activeTab === 'shortlist' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Shortlisted Tutors ({myShortlistedTutors.length})
            </h3>

            {myShortlistedTutors.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <Heart className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No tutors shortlisted yet.</p>
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="px-4 py-2 bg-blue-900 text-white rounded-xl font-semibold"
                >
                  Explore Tutors Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myShortlistedTutors.map((tut) => (
                  <div key={tut.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">{tut.fullName}</h4>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(tut.id)}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-slate-600">{tut.university} ({tut.department})</p>
                    <p className="text-[11px] text-slate-500">{tut.area} · ৳{tut.expectedSalary}/mo</p>
                    <button
                      type="button"
                      onClick={() => navigateTo('tutor-detail', { tutorId: tut.id })}
                      className="w-full py-2 bg-blue-900 text-white rounded-xl font-semibold text-center"
                    >
                      View Full CV & Request Demo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 4: GUARDIAN FREE DEMO & TRIAL SESSIONS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            
            {/* Inline Action Toast */}
            {demoActionToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{demoActionToast}</span>
              </div>
            )}

            {/* Header with Title, Subtitle and Find Tutor CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">
                    {language === 'bn' ? 'ডেমো ও ট্রায়াল' : 'Demo & Trial'}
                  </span>
                  <span className="text-slate-400 font-medium">({myDemos.length} টি ডেমো সেশন)</span>
                </div>
                <h3 className="font-bold text-base text-blue-950 mt-1">
                  {language === 'bn' ? 'ফ্রি ডেমো ক্লাস ও ট্রায়াল সেশন' : 'Free Demo & Trial Sessions'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'শিক্ষক যাচাইয়ের জন্য ১ম ক্লাস সম্পূর্ণ ফ্রি। ডেমো ক্লাসে সন্তুষ্ট হলে সরাসরি এখান থেকে টিউশন কনফার্ম করুন।'
                    : '1st class 100% Free trial. Once satisfied, confirm and hire the tutor directly with agreed monthly salary.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateTo('find-tutor')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-950" />
                  <span>{language === 'bn' ? 'নতুন টিউটর খুঁজুন' : 'Book Another Tutor'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Overview Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">মোট ডেমো</span>
                <span className="font-bold text-slate-900 text-sm tabular-nums">{myDemos.length}</span>
              </div>
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-center">
                <span className="text-[10px] text-blue-700 block">আসন্ন শিডিউল</span>
                <span className="font-bold text-blue-950 text-sm tabular-nums">
                  {myDemos.filter(d => d.status === 'scheduled').length}
                </span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 block">টিউশন কনফার্মড</span>
                <span className="font-bold text-emerald-950 text-sm tabular-nums">
                  {myDemos.filter(d => d.result === 'selected' || d.status === 'completed').length}
                </span>
              </div>
            </div>

            {/* Filter Segmented Control */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-md">
              <button
                type="button"
                onClick={() => setDemoFilterStatus('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'all' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব ({myDemos.length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('scheduled')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'scheduled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                আসন্ন ({myDemos.filter(d => d.status === 'scheduled').length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('completed')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'completed' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                কনফার্মড ({myDemos.filter(d => d.status === 'completed' || d.result === 'selected').length})
              </button>
              <button
                type="button"
                onClick={() => setDemoFilterStatus('cancelled')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                  demoFilterStatus === 'cancelled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাতিল
              </button>
            </div>

            {/* List of Guardian's Demos */}
            {(() => {
              const filtered = myDemos.filter(d => {
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
                        ? 'কোনো আসন্ন ডেমো ক্লাস নির্ধারিত নেই।'
                        : 'কোনো ডেমো সেশন পাওয়া যায়নি।'}
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      পছন্দের যেকোনো ভেরিফাইড টিউটরের প্রোফাইল থেকে "ফ্রি ডেমো বুক করুন" বাটনে ক্লিক করে প্রথম ক্লাস ফ্রি ট্রায়াল দিন।
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTo('find-tutor')}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      ভেরিফাইড টিউটর খুঁজুন →
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((demo) => {
                    const isOnline = demo.mode === 'online';
                    const isUpcoming = demo.status === 'scheduled';
                    const isConfirmed = demo.result === 'selected' || demo.status === 'completed';

                    return (
                      <div
                        key={demo.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isConfirmed
                            ? 'bg-emerald-50/30 border-emerald-300'
                            : isUpcoming
                            ? 'bg-white border-blue-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Header: Tutor Info & Status Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <img
                              src={demo.tutorPhoto || tutorProfileImg}
                              alt={demo.tutorName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 
                                  onClick={() => navigateTo('tutor-detail', { tutorId: demo.tutorId })}
                                  className="font-bold text-slate-900 text-sm hover:text-blue-900 hover:underline cursor-pointer"
                                >
                                  {demo.tutorName}
                                </h4>
                                <span className="font-mono text-[10px] text-slate-400">({demo.id})</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {demo.tutorUniversity || 'University Graduate'}
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <a
                                  href={`tel:${demo.tutorPhone}`}
                                  className="text-blue-900 hover:underline font-semibold text-[11px] flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{demo.tutorPhone}</span>
                                </a>
                                <WhatsAppButton phoneNumber={demo.tutorPhone} message={`সালামু আলাইকুম ${demo.tutorName}, আমি আপনার ডেমো ক্লাসের অভিভাবক ${currentUser?.name || ''}।`} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap sm:self-start">
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
                                {demo.result === 'selected' ? '✓ টিউশনে নিয়োগ চূড়ান্ত' : demo.result === 'further_review' ? 'বিবেচনায় রয়েছে' : 'অন্য শিক্ষক নির্বাচিত'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 text-xs">
                          {/* Student & Subject */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium">শিক্ষার্থী ও বিষয়</span>
                            <p className="font-bold text-slate-900">
                              {demo.studentName || 'শিক্ষার্থী'} ({demo.studentGrade || 'Class'})
                            </p>
                            <p className="text-[11px] text-blue-900 font-semibold">{demo.subject || 'সাধারণ বিষয়'}</p>
                          </div>

                          {/* Date and Time */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-700" />
                              ক্লাসের তারিখ ও সময়
                            </span>
                            <p className="font-bold text-slate-900">{demo.date}</p>
                            <p className="text-[11px] text-blue-900 font-semibold">{demo.time}</p>
                          </div>

                          {/* Meeting Link or Address */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1 sm:col-span-2 md:col-span-1">
                            <span className="text-[10px] text-slate-500 block font-medium">
                              {isOnline ? 'অনলাইন মিটিং রুম' : 'ক্লাসের স্থান ও ঠিকানা'}
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
                                  <span>Google Meet এ যোগ দিন</span>
                                  <ExternalLink className="w-3 h-3 ml-0.5" />
                                </a>
                                <p className="text-[10px] text-slate-500 font-mono truncate">
                                  {demo.meetingLink || 'https://meet.google.com/demo-tutorhat'}
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold text-slate-800 text-[11px] leading-relaxed">
                                {demo.location || 'বাসায় পাঠদান'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Notes and Feedback Blocks */}
                        {(demo.notes || demo.tutorFeedback || demo.guardianFeedback) && (
                          <div className="pt-2 border-t border-slate-100 space-y-2">
                            {demo.notes && (
                              <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                                <strong className="text-slate-700 not-italic">আপনার নোট:</strong> "{demo.notes}"
                              </p>
                            )}

                            {demo.tutorFeedback && (
                              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px]">
                                <span className="font-bold text-blue-950 block">শিক্ষকের মূল্যায়ন (Tutor Assessment):</span>
                                <p className="text-slate-700 mt-0.5">{demo.tutorFeedback}</p>
                              </div>
                            )}

                            {demo.guardianFeedback && (
                              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px]">
                                <span className="font-bold text-emerald-950 block">আপনার সাবমিটকৃত মতামত (Your Decision Note):</span>
                                <p className="text-slate-700 mt-0.5">{demo.guardianFeedback}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Guardian Actions Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Primary Action: Hire Tutor Post-Demo */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDemoForHire(demo);
                                setAgreedMonthlyFee(7500);
                                setAgreedDaysPerWeek(3);
                                setAgreedStartDate(new Date().toISOString().split('T')[0]);
                                setAgreedInstructions('');
                                setHireModalOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-98"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>{demo.result === 'selected' ? 'টিউশন চুক্তি দেখুন / পুনঃনিয়োগ' : 'টিউশন নিশ্চিত করুন (Hire Tutor)'}</span>
                            </button>

                            {/* Secondary Action: Feedback & Decision */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDemoForFeedback(demo);
                                setDemoResultDecision(demo.result || 'selected');
                                setGuardianFeedbackText(demo.guardianFeedback || '');
                                setFeedbackModalOpen(true);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span>মূল্যায়ন ও ফলাফল</span>
                            </button>

                            {/* Reschedule Button if upcoming */}
                            {demo.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDemoForReschedule(demo);
                                  setNewRescheduleDate(demo.date);
                                  setNewRescheduleTime(demo.time);
                                  setRescheduleReason('');
                                  setRescheduleModalOpen(true);
                                }}
                                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
                                <span>সময় পরিবর্তন</span>
                              </button>
                            )}

                            {/* Cancel Button if upcoming */}
                            {demo.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDemoForCancel(demo);
                                  setCancelReason('');
                                  setCancelModalOpen(true);
                                }}
                                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                              >
                                ডেমো বাতিল
                              </button>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400">
                            জব আইডি: {demo.jobId || 'N/A'}
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
            <ChatHubSection userRole="guardian" currentUserId={guardianId} />
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
                    <span>{language === 'bn' ? 'শিক্ষার্থী মাসিক অগ্রগতি ও একাডেমিক মূল্যায়ন' : 'Student Academic Progress Reports'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    {language === 'bn' ? 'শিক্ষার্থীদের প্রগ্রেস কার্ড ও রিপোর্ট' : 'Student Academic Progress Cards'}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {language === 'bn'
                      ? 'টিউটর কর্তৃক জমাকৃত মাসিক উপস্থিতি, পড়ালেখার মনোযোগ, টেস্ট স্কোর ও বিশেষ পরামর্শ পর্যালোচনা করুন।'
                      : 'Review monthly attendance, study engagement, test scores, and tutor evaluation remarks.'}
                  </p>
                </div>
              </div>

              {myReports.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-1" />
                  <p className="font-bold text-slate-700">এখনো কোনো মাসিক অগ্রগতি রিপোর্ট জমা পড়েনি</p>
                  <p className="text-[11px] text-slate-400">
                    টিউটর নিয়মিত পাঠদান শেষে প্রতি মাসে শিক্ষার্থীর প্রগ্রেস কার্ড প্রকাশ করবেন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myReports.map((report) => (
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

                      {/* Score metrics snippet */}
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
                        <span className="font-bold text-blue-950 block mb-0.5">শিক্ষকের মন্তব্য:</span>
                        <p className="line-clamp-2 italic">"{report.tutorRemarks}"</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">শিক্ষক: {report.tutorName}</span>
                        
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
        {/* Feature 5: TUITION AGREEMENTS & CONFIRMATIONS             */}
        {/* ========================================================= */}
        {activeTab === 'confirmations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>{language === 'bn' ? 'অফিসিয়াল টিউশন চুক্তি ও কনফার্মেশন স্লিপ' : 'Official Tuition Agreements'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    {language === 'bn' ? 'আমার সক্রিয় টিউশন চুক্তিসমূহ' : 'Active Tuition Contracts'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' 
                      ? 'প্রতিটি চুক্তির রয়েছে স্বতন্ত্র ভেরিফিকেশন কোড, নির্ধারিত সময়সূচি ও অফিসিয়াল ডিজিটাল স্লিপ।' 
                      : 'Each confirmed tuition has an official verification code, schedule, and printable slip.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(true)}
                    className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{language === 'bn' ? 'বেতন পরিশোধ করুন' : 'Pay Salary'}</span>
                  </button>
                </div>
              </div>

              {myConfirmations.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    {language === 'bn' ? 'বর্তমানে কোনো সক্রিয় টিউশন চুক্তি নেই।' : 'No active tuition contracts yet.'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {language === 'bn' ? 'ডেমো ক্লাস সম্পন্ন করে পছন্দের শিক্ষক নির্বাচন করলে এখানে অফিসিয়াল চুক্তিপত্র দেখা যাবে।' : 'Complete a demo class and hire a tutor to generate official agreement slips.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('demos')}
                    className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-950 cursor-pointer"
                  >
                    {language === 'bn' ? 'ডেমো ক্লাসে যান' : 'Go to Demo Classes'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myConfirmations.map((conf) => (
                    <div 
                      key={conf.id} 
                      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/40 via-white to-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center text-lg shrink-0">
                            {conf.tutorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded font-bold">
                              {conf.agreementCode || `TH-AGR-${conf.id.replace('conf_', '')}`}
                            </span>
                            <h4 className="font-bold text-slate-900 text-base mt-0.5">
                              {conf.jobTitle}
                            </h4>
                            <p className="text-xs text-slate-600">
                              শিক্ষক: <strong className="text-blue-950">{conf.tutorName}</strong>
                              {conf.tutorUniversity && ` (${conf.tutorUniversity})`}
                            </p>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-xs text-slate-500 block">মাসিক সম্মানী</span>
                          <span className="text-xl font-black text-blue-950 tabular-nums">
                            ৳{conf.monthlyFee.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {conf.daysPerWeek} দিন / সপ্তাহ
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-semibold block">শিক্ষার্থী</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{conf.studentName}</span>
                          <span className="text-[11px] text-slate-500">{conf.subject || 'সাধারণ বিষয়াবলী'}</span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-semibold block">শিডিউল ও মাধ্যম</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{conf.scheduleTime}</span>
                          <span className="text-[11px] text-slate-500 capitalize">
                            {conf.teachingMode === 'home' ? 'বাসায় পাঠদান' : 'অনলাইন সেশন'}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 font-semibold block">শুরুর তারিখ ও স্ট্যাটাস</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">{conf.startDate}</span>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            সক্রিয় চুক্তি (Confirmed ✓)
                          </span>
                        </div>
                      </div>

                      {conf.specialInstructions && (
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-950">
                          <strong>নির্দেশনা: </strong>{conf.specialInstructions}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="text-[11px] text-slate-500">
                          মোট সম্পন্ন ক্লাস: <strong className="text-emerald-700 font-bold">{conf.completedClassesCount || 0} টি</strong>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedConfForAgreement(conf);
                              setAgreementModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'অফিসিয়াল চুক্তিপত্র দেখুন / প্রিন্ট' : 'View Agreement Slip'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab('attendance')}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'হাজিরা ডায়েরি' : 'Attendance Diary'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPayModalOpen(true)}
                            className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'বেতন দিন' : 'Pay Salary'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTutorForReview(conf.tutorId);
                              setReviewModalOpen(true);
                            }}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{language === 'bn' ? 'রিভিউ দিন' : 'Review'}</span>
                          </button>
                        </div>
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
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{language === 'bn' ? 'ডিজিটাল ক্লাস হাজিরা ও স্টাডি ডায়েরি' : 'Class Attendance & Study Log'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    {language === 'bn' ? 'শিক্ষার্থীর ক্লাস উপস্থিতি ও পড়ার অগ্রগতি' : 'Student Class Attendance & Learning Log'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' 
                      ? 'শিক্ষক প্রতি ক্লাসের পড়া ও বাড়ির কাজ এখানে লগ করেন। আপনি এক ক্লিকে হাজিরা সত্যায়িত করতে পারেন।' 
                      : 'Real-time logs of topics covered, homework assigned, and duration. Verify attendance with 1 tap.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('confirmations')}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    {language === 'bn' ? 'চুক্তিপত্র দেখুন' : 'View Agreement'}
                  </button>
                </div>
              </div>

              {attendanceVerifyToast && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{attendanceVerifyToast}</span>
                </div>
              )}

              {/* Attendance Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">মোট ক্লাস সম্পন্ন</span>
                  <span className="text-xl font-black text-blue-950 tabular-nums">
                    {myAttendance.length} টি
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-800 block">উপস্থিতি (Present)</span>
                  <span className="text-xl font-black text-emerald-700 tabular-nums">
                    {myAttendance.filter(a => a.status === 'present').length} টি
                  </span>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[11px] text-amber-800 block">বিলম্ব / অফ</span>
                  <span className="text-xl font-black text-amber-700 tabular-nums">
                    {myAttendance.filter(a => a.status === 'late' || a.status === 'cancelled').length} টি
                  </span>
                </div>

                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                  <span className="text-[11px] text-blue-800 block">অভিভাবক সত্যায়িত</span>
                  <span className="text-xl font-black text-blue-900 tabular-nums">
                    {myAttendance.filter(a => a.verifiedByGuardian).length} টি
                  </span>
                </div>
              </div>

              {myAttendance.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    {language === 'bn' ? 'এখনও কোনো ক্লাস হাজিরা লগ করা হয়নি।' : 'No attendance records logged yet.'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? 'শিক্ষক ক্লাস সম্পন্ন করে ডায়েরি আপডেট করলে এখানে তারিখ অনুযায়ী দেখতে পাবেন।' : 'Tutors will log daily topics covered and class attendance after each session.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myAttendance.map((att) => (
                    <div 
                      key={att.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-xs space-y-3"
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
                          <span className="text-xs text-slate-600">
                            শিক্ষক: {att.tutorName}
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

                          <span className="text-[11px] text-slate-500 font-mono">
                            {att.durationMinutes || 90} মিনিট · {att.time || '০৫:৩০ PM'}
                          </span>
                        </div>
                      </div>

                      {/* Topics Covered & Homework */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                          <span className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                            <span>আজকের ক্লাসে যা পড়ানো হয়েছে:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {att.topicsCovered || att.notes || 'নিয়মিত পাঠদান সম্পন্ন।'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1">
                          <span className="font-bold text-blue-950 flex items-center gap-1 text-[11px]">
                            <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                            <span>বাড়ির কাজ / হোমওয়ার্ক:</span>
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {att.homeworkAssigned || 'পরবর্তী ক্লাসের পূর্ববর্তী অনুশীলন রিভিশন।'}
                          </p>
                        </div>
                      </div>

                      {/* Verification Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                        <div>
                          {att.verifiedByGuardian ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>অভিভাবক কর্তৃক সত্যায়িত ✓ {att.verifiedDate && `(${att.verifiedDate})`}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-700 font-semibold">
                              ⌛ আপনার অনুমোদনের অপেক্ষায়
                            </span>
                          )}
                        </div>

                        <div>
                          {!att.verifiedByGuardian && (
                            <button
                              type="button"
                              onClick={() => {
                                store.verifyAttendance(att.id, true);
                                setAttendanceVerifyToast(language === 'bn' ? `${att.date}-এর ক্লাস উপস্থিতি সফলভাবে সত্যায়িত করা হয়েছে ✓` : 'Attendance verified successfully!');
                                setTimeout(() => setAttendanceVerifyToast(null), 3000);
                              }}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'হাজিরা অনুমোদন / ভেরিফাই করুন ✓' : 'Verify Attendance'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Feature 5: TUITION SALARY & MONEY RECEIPTS                */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 font-bold text-[10px]">
                    <Receipt className="w-3.5 h-3.5 text-pink-700" />
                    <span>{language === 'bn' ? 'টিউশন ফি, মাসিক বেতন ও মানি রিসিট ভাউচার' : 'Tuition Salary & Receipts'}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    {language === 'bn' ? 'বেতন পরিশোধ ও অফিসিয়াল ক্যাশ মেমো / রিসিট' : 'Tuition Salary Records & Money Receipts'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' 
                      ? 'বিকাশ ও নগদ অ্যাকাউন্টের মাধ্যমে নিরাপদে গৃহশিক্ষকের সম্মানী পরিশোধ করুন এবং ডিজিটাল রিসিট সংরক্ষণ করুন।' 
                      : 'Securely track salary payments, pay via bKash/Nagad, and generate verified money receipts.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(true)}
                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{language === 'bn' ? '+ বেতন পরিশোধ করুন' : '+ Pay Tuition Salary'}</span>
                  </button>
                </div>
              </div>

              {/* Platform Account Information Reminder */}
              <div className="p-4 bg-gradient-to-r from-pink-50 via-amber-50 to-blue-50 rounded-2xl border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    💳 প্ল্যাটফর্ম অফিসিয়াল বিকাশ ও নগদ নম্বর:
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    বিকাশ (Personal): <strong className="font-mono text-pink-700 font-bold">{settings.paymentAccounts?.bkashNumber || '01610582917'}</strong> · নগদ (Personal): <strong className="font-mono text-amber-700 font-bold">{settings.paymentAccounts?.nagadNumber || '01610582917'}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {settings.paymentAccounts?.paymentInstructionsBn || 'Send Money করে ট্রানজেকশন আইডি প্রদান করুন।'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPayModalOpen(true)}
                  className="px-4 py-2 bg-white border border-pink-300 hover:bg-pink-50 text-pink-800 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                >
                  {language === 'bn' ? 'টাকা পাঠান ও রিসিট নিন' : 'Send & Get Receipt'}
                </button>
              </div>

              {/* Payments List */}
              {myPayments.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    {language === 'bn' ? 'এখনও কোনো পেমেন্ট রেকর্ড নেই।' : 'No payment records found.'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? 'বেতন পরিশোধ করলে তাৎক্ষণিক অফিসিয়াল ডিজিটাল মানি রিসিট প্রস্তুত হবে।' : 'Paid records and official money receipts will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPayments.map((p) => (
                    <div 
                      key={p.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            {p.receiptNumber || p.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'due' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {p.status === 'paid' ? 'পরিশোধিত (Paid ✓)' : p.status === 'due' ? 'বকেয়া (Due)' : p.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">
                          {p.month} — শিক্ষক: {p.tutorName}
                        </h4>
                        <p className="text-slate-600">
                          শিক্ষার্থী: {p.studentName || 'শিক্ষার্থী'} · তারিখ: {p.paidAt ? p.paidAt.split('T')[0] : p.paymentDate}
                        </p>
                        {p.transactionId && (
                          <p className="text-[11px] font-mono text-slate-500">
                            মেথড: {p.paymentMethod?.toUpperCase() || 'BKASH'} · TrxID: {p.transactionId}
                          </p>
                        )}
                        {p.notes && (
                          <p className="text-[11px] text-slate-500 italic">
                            "{p.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <span className="text-xl font-black text-blue-950 tabular-nums">
                          ৳{p.amount.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {p.status === 'paid' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPaymentForReceipt(p);
                                setReceiptModalOpen(true);
                              }}
                              className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'মানি রিসিট দেখুন' : 'View Receipt'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPayModalOpen(true)}
                              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'এখনই পরিশোধ করুন' : 'Pay Now'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab: Notice Board (Section 35) */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>{language === 'bn' ? 'অভিভাবকদের জন্য নোটিশ' : 'Guardian Notice Board'}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{publishedNotices.length} notices</span>
            </div>

            {publishedNotices.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No announcements for guardians at this time.</p>
            ) : (
              <div className="space-y-3">
                {publishedNotices.map((n) => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-950">{n.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        n.category === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {n.category}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.description}</p>
                    <p className="text-[11px] text-slate-400">Date: {n.publishedDate} · {n.createdBy}</p>
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
                <span>{language === 'bn' ? 'রেফারেল প্রোগ্রাম' : 'Refer Friends & Save'}</span>
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-700 text-white space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold block">
                Your Guardian Referral Code
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
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  {codeCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-xs text-amber-100 pt-1">
                Share with parent groups or relatives. {settings.referralBonusText}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900">Program Guidelines:</h4>
              <p className="text-slate-600 leading-relaxed">{settings.referralRules}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">My Referrals & Credits</h4>
              {guardianReferrals.length === 0 ? (
                <p className="text-slate-400 italic py-3 text-center">No referrals tracked yet. Invite fellow guardians!</p>
              ) : (
                <div className="space-y-2">
                  {guardianReferrals.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{ref.referredUserName || 'Referred User'}</span>
                        <p className="text-[11px] text-slate-500">{ref.date} · Code: {ref.referralCode}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ref.rewardStatus === 'credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ref.rewardStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">
                {language === 'bn' ? 'শিক্ষককে রেটিং ও রিভিউ দিন' : 'Rate & Review Tutor'}
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">রিভিউ সফলভাবে জমা হয়েছে!</p>
                <p className="text-slate-600">অ্যাডমিন মডারেশন শেষে আপনার রিভিউটি প্রকাশিত হবে।</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-900 block mb-1">Star Rating (১ থেকে ৫ স্টার)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingScore(star)}
                        className={`p-1.5 rounded-lg ${star <= ratingScore ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                    <span className="font-bold text-slate-700 ml-2">{ratingScore} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    {language === 'bn' ? 'আপনার মূল্যবান মতামত' : 'Your Review Comment'} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="শিক্ষকের সময়ানুবর্তিতা, বোঝানোর কৌশল এবং শিক্ষার্থীর অগ্রগতির বিষয়ে লিখুন..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-900 text-white rounded-xl font-bold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Guardian Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-blue-950 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    G
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{currentUser?.name}</h3>
                    <p className="text-[11px] text-slate-300">Guardian Account</p>
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

              <div className="p-3 space-y-1 text-xs font-medium text-slate-700">
                <button
                  type="button"
                  onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => { navigateTo('find-tutor'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span>Find Tutor</span>
                </button>

                <button
                  type="button"
                  onClick={() => { navigateTo('request-tutor'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  <span>Post Tuition Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-700" />
                    <span>Live Chat & Messages</span>
                  </div>
                  {unreadChatCount > 0 && (
                    <span className="w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('progress'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Student Progress Reports ({myReports.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('shortlist'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Shortlisted Tutors ({myShortlistedTutors.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('demos'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Demo Classes</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('confirmations'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Tuition Agreements ({myConfirmations.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Class Attendance ({myAttendance.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Receipt className="w-4 h-4 text-pink-600" />
                  <span>Payments & Receipts ({myPayments.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('notices'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Notice Board ({publishedNotices.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('referrals'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Refer & Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => { navigateTo('contact'); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-50"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>

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

      {/* Feature 4: Hire Tutor After Demo Modal */}
      {hireModalOpen && selectedDemoForHire && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'টিউটর নিয়োগ চূড়ান্ত করুন (Official Confirmation)' : 'Hire Tutor & Confirm Tuition'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {selectedDemoForHire.tutorName} • ডেমো আইডি: {selectedDemoForHire.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHireModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHireSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedDemoForHire.studentName || 'শিক্ষার্থী'}</span>
                  <p className="text-[11px] text-slate-500">{selectedDemoForHire.subject} • {selectedDemoForHire.studentGrade}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ফ্রি ডেমো সম্পন্ন
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'নির্ধারিত মাসিক বেতন (৳) *' : 'Agreed Monthly Fee (BDT) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={agreedMonthlyFee}
                    onChange={(e) => setAgreedMonthlyFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'সপ্তাহে কত দিন *' : 'Days per Week *'}
                  </label>
                  <select
                    value={agreedDaysPerWeek}
                    onChange={(e) => setAgreedDaysPerWeek(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
                  >
                    <option value={2}>২ দিন / সপ্তাহ (2 days/wk)</option>
                    <option value={3}>৩ দিন / সপ্তাহ (3 days/wk)</option>
                    <option value={4}>৪ দিন / সপ্তাহ (4 days/wk)</option>
                    <option value={5}>৫ দিন / সপ্তাহ (5 days/wk)</option>
                    <option value={6}>৬ দিন / সপ্তাহ (6 days/wk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'ক্লাস শুরুর তারিখ *' : 'Tuition Start Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={agreedStartDate}
                  onChange={(e) => setAgreedStartDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'বিশেষ নির্দেশনা বা শর্ত (ঐচ্ছিক)' : 'Special Instructions (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={agreedInstructions}
                  onChange={(e) => setAgreedInstructions(e.target.value)}
                  placeholder="যেমন: নিয়মিত মডেল টেস্ট নেওয়া এবং সাপ্তাহিক অগ্রগতি রিপোর্ট দেওয়া।"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                🔒 কনফার্ম করার সাথে সাথে শিক্ষক ও আপনার ড্যাশবোর্ডে অফিশিয়াল টিউশন কন্ট্রাক্ট তৈরি হবে এবং নোটিফিকেশন যাবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setHireModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  নিয়োগ চূড়ান্ত করুন ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 4: Reschedule Demo Modal */}
      {rescheduleModalOpen && selectedDemoForReschedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <CalendarClock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'ডেমো ক্লাসের সময় পরিবর্তন' : 'Reschedule Demo Class'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {selectedDemoForReschedule.tutorName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">নতুন তারিখ *</label>
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
                  <label className="font-bold text-slate-800 block mb-1">নতুন সময় *</label>
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
                <label className="font-bold text-slate-800 block mb-1">পরিবর্তনের কারণ বা নোট</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="যেমন: শিক্ষার্থীর পরীক্ষা থাকায় পরের দিন সন্ধ্যায়"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  নতুন সময় নির্ধারণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 4: Cancel Demo Modal */}
      {cancelModalOpen && selectedDemoForCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <CalendarX className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'ডেমো ক্লাস বাতিল করুন' : 'Cancel Demo Class'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {selectedDemoForCancel.tutorName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">বাতিলের কারণ লিখুন *</label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="যেমন: শিক্ষার্থী পারিবারিক কারণে আপাতত টিউশন স্থগিত রেখেছে।"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  হ্যাঁ, বাতিল করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 4: Feedback & Decision Modal */}
      {feedbackModalOpen && selectedDemoForFeedback && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                  <Star className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    {language === 'bn' ? 'ডেমো ক্লাসের মূল্যায়ন ও সিদ্ধান্ত' : 'Demo Evaluation & Decision'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {selectedDemoForFeedback.tutorName} • {selectedDemoForFeedback.subject}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-2">আপনার সিদ্ধান্ত নির্বাচন করুন *</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    demoResultDecision === 'selected' ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="demoDecision"
                      value="selected"
                      checked={demoResultDecision === 'selected'}
                      onChange={() => setDemoResultDecision('selected')}
                      className="text-emerald-600"
                    />
                    <span>শিক্ষক পছন্দ হয়েছে, টিউশন নিয়োগ দিতে চাই (Selected)</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    demoResultDecision === 'further_review' ? 'bg-amber-50/70 border-amber-300 font-bold text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="demoDecision"
                      value="further_review"
                      checked={demoResultDecision === 'further_review'}
                      onChange={() => setDemoResultDecision('further_review')}
                      className="text-amber-600"
                    />
                    <span>বিবেচনায় রাখছি, পরে সিদ্ধান্ত জানাব (Further Review)</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    demoResultDecision === 'not_selected' ? 'bg-rose-50/70 border-rose-300 font-bold text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="demoDecision"
                      value="not_selected"
                      checked={demoResultDecision === 'not_selected'}
                      onChange={() => setDemoResultDecision('not_selected')}
                      className="text-rose-600"
                    />
                    <span>পছন্দ হয়নি, বিকল্প শিক্ষক দেখতে চাই (Not Selected)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">আপনার মূল্যবান মন্তব্য / ফিডব্যাক (ঐচ্ছিক)</label>
                <textarea
                  rows={3}
                  value={guardianFeedbackText}
                  onChange={(e) => setGuardianFeedbackText(e.target.value)}
                  placeholder="যেমন: শিক্ষকের বোঝানোর ভঙ্গি সুন্দর ছিল, শিক্ষার্থী স্বাচ্ছন্দ্য বোধ করেছে।"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  সিদ্ধান্ত সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 5: Official Tuition Agreement Slip Modal */}
      <TuitionAgreementSlipModal
        confirmation={selectedConfForAgreement}
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
      />

      {/* Feature 5: Official Payment Receipt Voucher Modal */}
      <PaymentReceiptModal
        payment={selectedPaymentForReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

      {/* Feature 5: Pay Tuition Salary Modal */}
      <PayTuitionSalaryModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        confirmations={myConfirmations}
        defaultGuardianId={guardianId}
        defaultGuardianName={currentUser?.name || 'Guardian'}
        onPaymentSuccess={(record) => {
          setSelectedPaymentForReceipt(record);
          setReceiptModalOpen(true);
        }}
      />

      {/* Feature 6: Student Academic Progress Report Card Modal */}
      <StudentProgressReportModal
        report={selectedProgressReportForView}
        isOpen={progressReportModalOpen}
        onClose={() => setProgressReportModalOpen(false)}
      />

    </div>
  );
};
