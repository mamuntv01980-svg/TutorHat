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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { CallButton } from '../../components/common/CallButton';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';
import { TRANSLATIONS } from '../../constants/translations';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'shortlist' | 'applications' | 'demos' | 'reviews' | 'notices' | 'referrals'>('overview');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTutorForReview, setSelectedTutorForReview] = useState<string>('tut_01');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

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
  // Confirmations
  const myConfirmations = storeState.confirmations.filter(c => c.guardianId === guardianId);
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
            { id: 'requests', label: `My Requests (${myRequests.length})` },
            { id: 'shortlist', label: `Shortlist (${myShortlistedTutors.length})` },
            { id: 'applications', label: `Applications (${applicationsForMe.length})` },
            { id: 'demos', label: `Demo Classes (${myDemos.length})` }
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
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTutorForReview(conf.tutorId);
                          setReviewModalOpen(true);
                        }}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{language === 'bn' ? 'শিক্ষককে রিভিউ দিন' : 'Rate & Review'}</span>
                      </button>
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

        {/* Tab: Demos */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Scheduled Demo Sessions ({myDemos.length})
            </h3>

            {myDemos.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">No demo classes scheduled at this time.</p>
            ) : (
              <div className="space-y-3">
                {myDemos.map((demo) => (
                  <div key={demo.id} className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950">{demo.jobTitle}</span>
                      <span className="font-bold uppercase text-[10px] bg-blue-900 text-white px-2 py-0.5 rounded">
                        {demo.status}
                      </span>
                    </div>
                    <p className="text-slate-700">Tutor: <strong>{demo.tutorName}</strong></p>
                    <p className="text-slate-600">Date & Time: <strong>{demo.date} at {demo.time}</strong></p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200">Notes: {demo.notes}</p>
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

    </div>
  );
};
