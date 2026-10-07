import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  Star, 
  Settings, 
  PlusCircle, 
  FileText, 
  Check, 
  Phone, 
  MessageCircle,
  Menu, 
  X, 
  Search, 
  Filter,
  Eye,
  Edit3,
  Trash2,
  Volume2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Send,
  Share2,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import { 
  TutorProfile, 
  TuitionJob, 
  TuitionJobStatus,
  TuitionRequest, 
  JobApplication, 
  User, 
  NoticeItem, 
  ContactMessage, 
  ReferralRecord 
} from '../../types';
import { BD_DISTRICTS, DHAKA_AREAS, MEDIUMS, CLASS_LEVELS } from '../../constants/bangladeshData';

export const AdminDashboard: React.FC = () => {
  const { storeState, settings, currentUser, loginAs, language } = useApp();

  type AdminTab = 
    | 'tutors' 
    | 'guardians'
    | 'requests' 
    | 'jobs' 
    | 'applications' 
    | 'demos' 
    | 'confirmations' 
    | 'notices'
    | 'referrals'
    | 'messages'
    | 'payments' 
    | 'certificates' 
    | 'reviews' 
    | 'activity'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('jobs');

  // Job Filters and Search
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [selectedJobForApps, setSelectedJobForApps] = useState<TuitionJob | null>(null);

  // Job Create / Edit Modal State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    category: 'Bangla Medium',
    classLevel: 'Class 9 (SSC)',
    medium: 'Bangla Medium',
    subjects: 'Mathematics, Physics',
    district: 'Dhaka',
    area: 'Dhanmondi',
    daysPerWeek: 3,
    preferredTime: 'Evening 6:00 PM',
    teachingType: 'home' as 'home' | 'online' | 'coaching',
    salary: 6000,
    tutorGenderPreference: 'any' as 'any' | 'male' | 'female',
    studentGender: 'male' as 'male' | 'female',
    description: '',
    deadline: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    status: 'published' as TuitionJobStatus,
    guardianName: 'Platform Assigned Guardian'
  });

  // Assign Tutor Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignJobTarget, setAssignJobTarget] = useState<TuitionJob | null>(null);
  const [selectedTutorToAssign, setSelectedTutorToAssign] = useState<string>('');

  // Guardian Management State (Section 34)
  const [guardianSearch, setGuardianSearch] = useState('');
  const [guardianStatusFilter, setGuardianStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedGuardianForDetail, setSelectedGuardianForDetail] = useState<User | null>(null);
  const [guardianAdminNote, setGuardianAdminNote] = useState('');
  const [guardianNoteSuccess, setGuardianNoteSuccess] = useState(false);

  // Notice Board State (Section 35)
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeFormData, setNoticeFormData] = useState({
    title: '',
    description: '',
    category: 'general' as NoticeItem['category'],
    status: 'published' as NoticeItem['status']
  });

  // Rejection Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetTutorId, setTargetTutorId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Demo Modal
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoTutorId, setDemoTutorId] = useState('');
  const [demoGuardianId, setDemoGuardianId] = useState('');
  const [demoJobId, setDemoJobId] = useState('');
  const [demoDate, setDemoDate] = useState('2026-03-25');
  const [demoTime, setDemoTime] = useState('5:00 PM');
  const [demoNotes, setDemoNotes] = useState('');

  // Settings form state (Section 38)
  const [editPhone, setEditPhone] = useState(settings.publicPhone);
  const [editWhatsApp, setEditWhatsApp] = useState(settings.whatsAppRaw);
  const [editAddress, setEditAddress] = useState(settings.officeAddress);
  const [editEmail, setEditEmail] = useState(settings.supportEmail);
  const [editNotice, setEditNotice] = useState(settings.noticeMarquee);
  const [editCurrency, setEditCurrency] = useState(settings.defaultCurrency || '৳');
  const [editRequireVerification, setEditRequireVerification] = useState(settings.requireTutorVerificationToPublish);
  const [editJobAutoApprove, setEditJobAutoApprove] = useState(settings.jobAutoApprove || false);
  const [editDirectCall, setEditDirectCall] = useState(settings.allowDirectGuardianTutorCall || false);
  const [editReferralBonus, setEditReferralBonus] = useState(settings.referralBonusText || '৳200 Credit per verified referral');
  const [editReferralRules, setEditReferralRules] = useState(settings.referralRules || '');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // First admin setup check
  const adminExists = storeState.users.some(u => u.role === 'admin');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');

  if (!adminExists) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <ShieldCheck className="w-12 h-12 text-blue-900 mx-auto" />
          <h2 className="text-2xl font-bold text-blue-950">Create First Administrator</h2>
          <p className="text-xs text-slate-600">No administrator currently exists. Configure the primary administrator account.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const admin = store.createUser({
              name: 'Master Admin',
              email: newAdminEmail,
              phone: newAdminPhone,
              role: 'admin',
              gender: 'other',
              location: 'Dhaka',
              district: 'Dhaka'
            });
            loginAs('admin', admin.id);
          }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs"
        >
          <div>
            <label className="font-semibold block mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              placeholder="admin@tutorhat.com"
              className="w-full p-2.5 bg-slate-50 border rounded-xl"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Admin Phone</label>
            <input
              type="tel"
              required
              value={newAdminPhone}
              onChange={e => setNewAdminPhone(e.target.value)}
              placeholder="01752617360"
              className="w-full p-2.5 bg-slate-50 border rounded-xl"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition">
            Create First Administrator
          </button>
        </form>
      </div>
    );
  }

  // If user is not admin, provide convenient authentication barrier
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold text-blue-950">Protected Admin Console</h2>
        <p className="text-xs text-slate-600">You must be logged in as an Administrator to view and manage this area.</p>
        <button
          type="button"
          onClick={() => loginAs('admin')}
          className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800 transition"
        >
          Authenticate as Administrator
        </button>
      </div>
    );
  }

  // Filtered Jobs
  const filteredJobs = storeState.jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.id.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.area.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.district.toLowerCase().includes(jobSearch.toLowerCase());
    
    const matchesStatus = jobStatusFilter === 'all' || job.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Guardians
  const guardians = storeState.users.filter(u => u.role === 'guardian');
  const filteredGuardians = guardians.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(guardianSearch.toLowerCase()) ||
      g.phone.includes(guardianSearch) ||
      g.email.toLowerCase().includes(guardianSearch.toLowerCase()) ||
      g.location.toLowerCase().includes(guardianSearch.toLowerCase());
    
    const matchesStatus = guardianStatusFilter === 'all' || (g.status || 'active') === guardianStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers for Job Create / Edit
  const openCreateJobModal = () => {
    setEditingJobId(null);
    setJobFormData({
      title: '',
      category: 'Bangla Medium',
      classLevel: 'Class 9 (SSC)',
      medium: 'Bangla Medium',
      subjects: 'Mathematics, Physics',
      district: 'Dhaka',
      area: 'Dhanmondi',
      daysPerWeek: 3,
      preferredTime: 'Evening 6:00 PM',
      teachingType: 'home',
      salary: 6000,
      tutorGenderPreference: 'any',
      studentGender: 'male',
      description: 'Looking for an experienced and punctual tutor for regular guidance and weekly exams.',
      deadline: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      status: 'published',
      guardianName: 'Guardian'
    });
    setJobModalOpen(true);
  };

  const openEditJobModal = (job: TuitionJob) => {
    setEditingJobId(job.id);
    setJobFormData({
      title: job.title,
      category: job.category,
      classLevel: job.classLevel,
      medium: job.medium,
      subjects: job.subjects.join(', '),
      district: job.district,
      area: job.area,
      daysPerWeek: job.daysPerWeek,
      preferredTime: job.preferredTime,
      teachingType: job.teachingType,
      salary: job.salary,
      tutorGenderPreference: job.tutorGenderPreference,
      studentGender: job.studentGender,
      description: job.description,
      deadline: job.deadline,
      status: job.status,
      guardianName: job.guardianName || 'Guardian'
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = jobFormData.subjects.split(',').map(s => s.trim()).filter(Boolean);

    if (editingJobId) {
      // Edit existing job
      store.editJob(editingJobId, {
        title: jobFormData.title || `${jobFormData.classLevel} (${jobFormData.medium}) Tutor in ${jobFormData.area}`,
        category: jobFormData.category,
        classLevel: jobFormData.classLevel,
        medium: jobFormData.medium,
        subjects: subjectsArray.length > 0 ? subjectsArray : ['General'],
        district: jobFormData.district,
        area: jobFormData.area,
        daysPerWeek: Number(jobFormData.daysPerWeek),
        preferredTime: jobFormData.preferredTime,
        teachingType: jobFormData.teachingType,
        salary: Number(jobFormData.salary),
        tutorGenderPreference: jobFormData.tutorGenderPreference,
        studentGender: jobFormData.studentGender,
        description: jobFormData.description,
        deadline: jobFormData.deadline,
        status: jobFormData.status,
        guardianName: jobFormData.guardianName
      });
    } else {
      // Create new job
      store.createJob({
        title: jobFormData.title || `${jobFormData.classLevel} (${jobFormData.medium}) Tutor Needed in ${jobFormData.area}`,
        category: jobFormData.category,
        classLevel: jobFormData.classLevel,
        medium: jobFormData.medium,
        subjects: subjectsArray.length > 0 ? subjectsArray : ['General'],
        district: jobFormData.district,
        area: jobFormData.area,
        daysPerWeek: Number(jobFormData.daysPerWeek),
        preferredTime: jobFormData.preferredTime,
        teachingType: jobFormData.teachingType,
        salary: Number(jobFormData.salary),
        tutorGenderPreference: jobFormData.tutorGenderPreference,
        studentGender: jobFormData.studentGender,
        description: jobFormData.description,
        postedDate: new Date().toISOString().split('T')[0],
        deadline: jobFormData.deadline,
        status: jobFormData.status,
        guardianName: jobFormData.guardianName
      });
    }
    setJobModalOpen(false);
  };

  // Handlers for Notice Board
  const openCreateNoticeModal = () => {
    setEditingNoticeId(null);
    setNoticeFormData({
      title: '',
      description: '',
      category: 'general',
      status: 'published'
    });
    setNoticeModalOpen(true);
  };

  const openEditNoticeModal = (notice: NoticeItem) => {
    setEditingNoticeId(notice.id);
    setNoticeFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      status: notice.status
    });
    setNoticeModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNoticeId) {
      store.updateNotice(editingNoticeId, {
        title: noticeFormData.title,
        description: noticeFormData.description,
        category: noticeFormData.category,
        status: noticeFormData.status
      });
    } else {
      store.createNotice({
        title: noticeFormData.title,
        description: noticeFormData.description,
        category: noticeFormData.category,
        status: noticeFormData.status,
        createdBy: currentUser.name
      });
    }
    setNoticeModalOpen(false);
  };

  // Settings Save
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      publicPhone: editPhone,
      whatsAppRaw: editWhatsApp,
      officeAddress: editAddress,
      supportEmail: editEmail,
      noticeMarquee: editNotice,
      defaultCurrency: editCurrency,
      requireTutorVerificationToPublish: editRequireVerification,
      jobAutoApprove: editJobAutoApprove,
      allowDirectGuardianTutorCall: editDirectCall,
      referralBonusText: editReferralBonus,
      referralRules: editReferralRules
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Statistics overview for Top Bar
  const stats = store.getStatistics();

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Admin Top Header */}
      <div className="bg-blue-950 text-white sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm tracking-wide">TutorHat Administration Console</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="hidden sm:inline">Active Admin: <strong className="text-white">{currentUser.name}</strong></span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                ● Live Database
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar with Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none">
          {[
            { id: 'jobs', label: `Tuition Jobs (${storeState.jobs.length})` },
            { id: 'requests', label: `Guardian Requests (${storeState.requests.length})` },
            { id: 'tutors', label: `Tutors (${storeState.tutors.length})` },
            { id: 'guardians', label: `Guardians (${guardians.length})` },
            { id: 'applications', label: `Applications (${storeState.applications.length})` },
            { id: 'demos', label: `Demo Classes (${storeState.demos.length})` },
            { id: 'confirmations', label: `Confirmations (${storeState.confirmations.length})` },
            { id: 'notices', label: `Notice Board (${storeState.notices.length})` },
            { id: 'referrals', label: `Referrals (${storeState.referrals.length})` },
            { id: 'messages', label: `Inquiries (${storeState.messages.filter(m => m.status === 'unread').length} new)` },
            { id: 'payments', label: `Payments (${storeState.payments.length})` },
            { id: 'certificates', label: `Certificates (${storeState.certificates.length})` },
            { id: 'reviews', label: `Reviews (${storeState.reviews.length})` },
            { id: 'activity', label: 'Activity Logs' },
            { id: 'settings', label: 'Central Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* SECTION 33: ADMIN JOB MANAGEMENT                         */}
        {/* ========================================================= */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Tuition Jobs Management (টিউশন জব সার্কুলার)</h3>
                <p className="text-slate-500">
                  Create, edit, approve, publish, pause, assign tutors, expire, or close tuition jobs nationwide.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateJobModal}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Tuition Job</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search jobs by Job ID, title, area, district, medium..."
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={jobStatusFilter}
                  onChange={e => setJobStatusFilter(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold capitalize"
                >
                  <option value="all">All Statuses ({storeState.jobs.length})</option>
                  <option value="published">Published</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="filled">Filled (Assigned)</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No tuition jobs found.</p>
                  <p className="text-slate-400 text-[11px]">Adjust your filter or create a new job circular.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-blue-200 transition">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {job.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          job.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          job.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' :
                          job.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                          job.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          job.status === 'expired' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-slate-700">
                        <strong>{job.classLevel}</strong> ({job.medium}) · Subjects: <strong>{job.subjects.join(', ')}</strong> · Location: <strong>{job.area}, {job.district}</strong>
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span>Salary: <strong className="text-blue-900">{settings.defaultCurrency}{job.salary.toLocaleString()}/mo</strong></span>
                        <span>Schedule: {job.daysPerWeek} days/wk ({job.preferredTime})</span>
                        <span>Mode: <strong className="capitalize">{job.teachingType}</strong></span>
                        <span>Tutor Gender: <strong className="capitalize">{job.tutorGenderPreference}</strong></span>
                        <span>Applications: <strong className="text-emerald-700 font-bold">{job.totalApplications}</strong></span>
                        <span>Deadline: {job.deadline}</span>
                      </div>

                      {job.assignedTutorName && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 font-medium text-[11px]">
                          <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                          <span>Assigned Tutor: <strong>{job.assignedTutorName}</strong></span>
                          {job.assignedDate && <span className="text-slate-400">({job.assignedDate})</span>}
                        </div>
                      )}
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* View Applications */}
                      <button
                        type="button"
                        onClick={() => setSelectedJobForApps(job)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold flex items-center gap-1 text-slate-700 cursor-pointer"
                        title="View applicants"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-900" />
                        <span>Apps ({job.totalApplications})</span>
                      </button>

                      {/* Edit Job */}
                      <button
                        type="button"
                        onClick={() => openEditJobModal(job)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold flex items-center gap-1 text-slate-700 cursor-pointer"
                        title="Edit Job"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      {/* Assign Tutor */}
                      <button
                        type="button"
                        onClick={() => {
                          setAssignJobTarget(job);
                          setSelectedTutorToAssign(job.assignedTutorId || '');
                          setAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                        title="Assign Tutor"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </button>

                      {/* Status Dropdown */}
                      <select
                        value={job.status}
                        onChange={(e) => store.updateJobStatus(job.id, e.target.value as TuitionJobStatus)}
                        className="py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg font-semibold capitalize text-slate-800 cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="draft">Draft</option>
                        <option value="paused">Paused</option>
                        <option value="filled">Filled</option>
                        <option value="closed">Closed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 34: ADMIN GUARDIAN MANAGEMENT                     */}
        {/* ========================================================= */}
        {activeTab === 'guardians' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Guardian Accounts Management (অভিভাবক ব্যবস্থাপনা)</h3>
                <p className="text-slate-500">
                  View guardians, profile requests, activity logs, add internal admin notes, suspend or reactivate.
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                Total Guardians: {guardians.length}
              </span>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search guardians by name, phone, email, location..."
                  value={guardianSearch}
                  onChange={e => setGuardianSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={guardianStatusFilter}
                  onChange={e => setGuardianStatusFilter(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold capitalize"
                >
                  <option value="all">All Guardians ({guardians.length})</option>
                  <option value="active">Active Accounts</option>
                  <option value="suspended">Suspended Accounts</option>
                </select>
              </div>
            </div>

            {/* Guardians Table */}
            <div className="space-y-3">
              {filteredGuardians.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No guardian accounts matched your criteria.</p>
                </div>
              ) : (
                filteredGuardians.map((guardian) => {
                  const guardianRequests = storeState.requests.filter(r => r.guardianId === guardian.id);
                  const guardianNotes = store.getAdminNotes('guardian', guardian.id);

                  return (
                    <div key={guardian.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-blue-950">{guardian.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border">
                            {guardian.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            (guardian.status || 'active') === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {guardian.status || 'active'}
                          </span>
                        </div>

                        {/* Guardian Contact Info - Only visible to authorized admin */}
                        <div className="text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <span>Phone: <strong className="font-mono text-blue-950">{guardian.phone}</strong></span>
                          <span>Email: <strong>{guardian.email}</strong></span>
                          <span>Location: {guardian.location}, {guardian.district}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                          <span>Tuition Requests: <strong className="text-blue-900 font-bold">{guardianRequests.length}</strong></span>
                          <span>Referral Code: <strong className="font-mono">{guardian.referralCode || 'N/A'}</strong></span>
                          <span>Joined: {guardian.createdAt.split('T')[0]}</span>
                          {guardianNotes.length > 0 && (
                            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {guardianNotes.length} Admin Notes
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* View Details Modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedGuardianForDetail(guardian)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold flex items-center gap-1.5 text-blue-900 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile & Notes</span>
                        </button>

                        {/* Suspend / Reactivate */}
                        {(guardian.status || 'active') === 'active' ? (
                          <button
                            type="button"
                            onClick={() => {
                              store.updateGuardianStatus(guardian.id, 'suspended');
                              store.addAdminNote('guardian', guardian.id, 'Guardian account suspended by Admin.', currentUser.name);
                            }}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              store.updateGuardianStatus(guardian.id, 'active');
                              store.addAdminNote('guardian', guardian.id, 'Guardian account reactivated by Admin.', currentUser.name);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 35: NOTICE BOARD                                  */}
        {/* ========================================================= */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Notice Board System (নোটিশ বোর্ড)</h3>
                <p className="text-slate-500">
                  Publish platform updates, urgent guidelines, and announcements visible to tutors and guardians.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateNoticeModal}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {storeState.notices.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <Volume2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No notices on the notice board.</p>
                </div>
              ) : (
                storeState.notices.map((notice) => (
                  <div key={notice.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{notice.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          notice.category === 'urgent' ? 'bg-rose-100 text-rose-800' :
                          notice.category === 'tutors' ? 'bg-blue-100 text-blue-800' :
                          notice.category === 'guardians' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {notice.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          notice.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {notice.status}
                        </span>
                      </div>
                      <p className="text-slate-600">{notice.description}</p>
                      <p className="text-[11px] text-slate-400">
                        Date: {notice.publishedDate} · Created By: {notice.createdBy}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditNoticeModal(notice)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 cursor-pointer"
                      >
                        Edit
                      </button>

                      {notice.status === 'published' ? (
                        <button
                          type="button"
                          onClick={() => store.updateNotice(notice.id, { status: 'draft' })}
                          className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-semibold cursor-pointer"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => store.updateNotice(notice.id, { status: 'published' })}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Publish
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete notice "${notice.title}"?`)) {
                            store.deleteNotice(notice.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 36: REFERRAL SYSTEM                               */}
        {/* ========================================================= */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Referral Program Tracking (রেফারেল প্রোগ্রাম)</h3>
                <p className="text-slate-500">
                  Monitor unique referral codes, referred signups, and credit or manage reward statuses.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="px-3.5 py-2 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 font-semibold rounded-xl cursor-pointer"
              >
                Configure Referral Rules & Bonus
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-950">Current Platform Bonus Rule:</span>
              <p className="text-amber-900">{settings.referralBonusText}</p>
              <p className="text-[11px] text-amber-800">{settings.referralRules}</p>
            </div>

            <div className="space-y-3">
              {storeState.referrals.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <Share2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No referral transactions yet.</p>
                </div>
              ) : (
                storeState.referrals.map((ref) => (
                  <div key={ref.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border">
                          {ref.id}
                        </span>
                        <span className="font-bold text-slate-900">Referrer: {ref.referrerName}</span>
                        <span className="font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-bold">
                          Code: {ref.referralCode}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Referred User: <strong>{ref.referredUserName || 'Pending Signup'}</strong> · Date: {ref.date}
                      </p>
                      <p className="text-[11px] text-slate-500">Reward: {ref.rewardDetails}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${
                        ref.rewardStatus === 'credited' ? 'bg-emerald-100 text-emerald-800' :
                        ref.rewardStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Reward: {ref.rewardStatus}
                      </span>

                      {ref.rewardStatus !== 'credited' && (
                        <button
                          type="button"
                          onClick={() => store.updateReferralStatus(ref.id, 'completed', 'credited')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          ✓ Credit Reward
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 37: CONTACT FORM INQUIRIES                        */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Contact & Support Messages (যোগাযোগ বার্তা)</h3>
                <p className="text-slate-500">
                  Messages submitted through the public Contact Page and WhatsApp inquiries.
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                Total: {storeState.messages.length} inquiries
              </span>
            </div>

            <div className="space-y-3">
              {storeState.messages.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <MessageCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No contact messages received yet.</p>
                </div>
              ) : (
                storeState.messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-blue-950">{msg.name}</span>
                        <span className="font-mono text-slate-600">{msg.mobile}</span>
                        {msg.email && <span className="text-slate-400">({msg.email})</span>}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          msg.status === 'unread' ? 'bg-amber-100 text-amber-800' :
                          msg.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{msg.date}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-900 block">{msg.subject}</span>
                      <p className="text-slate-700">{msg.message}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${msg.mobile}`}
                          className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 rounded-lg font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Sender</span>
                        </a>
                        <a
                          href={`https://wa.me/880${msg.mobile.replace(/^0+/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => store.updateMessageStatus(msg.id, 'resolved')}
                            className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold cursor-pointer"
                          >
                            ✓ Mark Resolved
                          </button>
                        )}
                        {msg.status === 'unread' && (
                          <button
                            type="button"
                            onClick={() => store.updateMessageStatus(msg.id, 'read')}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg font-semibold cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TUTORS MANAGEMENT                                         */}
        {/* ========================================================= */}
        {activeTab === 'tutors' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Tutor Verification & Profile Moderation</h3>
                <p className="text-slate-500">Approve, reject with reason, suspend, or reactivate tutor profiles.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {storeState.tutors.map((tutor) => (
                <div key={tutor.id} className="py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-blue-950">{tutor.fullName}</span>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{tutor.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tutor.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        tutor.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        tutor.verificationStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tutor.verificationStatus}
                      </span>
                    </div>

                    <p className="text-slate-700">
                      <strong>{tutor.university}</strong> ({tutor.department}) · {tutor.phone} · {tutor.email}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Area: {tutor.area}, {tutor.district} · Fee: {settings.defaultCurrency}{tutor.expectedSalary} · CV: {tutor.completionPercentage}%
                    </p>
                    {tutor.rejectionReason && (
                      <p className="text-[11px] text-rose-600 font-medium">Rejection Note: {tutor.rejectionReason}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {tutor.verificationStatus !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        ✓ Approve & Verify
                      </button>
                    )}

                    {tutor.verificationStatus !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTargetTutorId(tutor.id);
                          setRejectModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-semibold cursor-pointer"
                      >
                        Reject with Reason
                      </button>
                    )}

                    {tutor.verificationStatus === 'verified' && (
                      <button
                        type="button"
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'suspended')}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg font-semibold cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}

                    {tutor.verificationStatus === 'suspended' && (
                      <button
                        type="button"
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'verified')}
                        className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* GUARDIAN REQUESTS                                         */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Guardian Tuition Requirements</h3>
                <p className="text-slate-500">Approve requests and convert them directly into public tuition circulars.</p>
              </div>
            </div>

            <div className="space-y-3">
              {storeState.requests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900">{req.id}</span>
                      <span className="font-bold text-slate-900">{req.guardianName} ({req.phone})</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold">{req.status}</span>
                    </div>
                    <p className="text-slate-700">{req.studentClass} ({req.medium}) · Area: {req.area}, {req.location}</p>
                    <p className="text-slate-600">Subjects: {req.subjects.join(', ')} · Routine: {req.daysPerWeek} days/wk ({req.preferredTime})</p>
                    <p className="text-blue-950 font-bold">Guardian Budget: {settings.defaultCurrency}{req.monthlyBudget.toLocaleString()}/month</p>
                    {req.additionalRequirements && <p className="text-[11px] text-slate-500 italic">"{req.additionalRequirements}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => {
                          store.convertRequestToJob(req.id);
                          alert('Converted and published as live Job on Tuition Job Board!');
                        }}
                        className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer"
                      >
                        Convert to Live Job Circular
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* APPLICATIONS MANAGEMENT                                   */}
        {/* ========================================================= */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Tutor Job Applications ({storeState.applications.length})
            </h3>

            <div className="space-y-3">
              {storeState.applications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-blue-900">{app.jobId}</span> · Applicant: <strong className="text-slate-900">{app.tutorName}</strong> ({app.tutorUniversity})
                      <p className="text-[11px] text-slate-500">Phone: {app.tutorPhone} · Expected: {settings.defaultCurrency}{app.expectedSalary}/mo · Applied: {app.appliedDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => store.updateApplicationStatus(app.id, e.target.value as any)}
                        className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg font-semibold uppercase text-[11px]"
                      >
                        <option value="applied">Applied</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="demo_scheduled">Demo Scheduled</option>
                        <option value="appointed">Appointed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          setDemoTutorId(app.tutorId);
                          setDemoJobId(app.jobId);
                          setDemoGuardianId('user_guardian_01');
                          setDemoModalOpen(true);
                        }}
                        className="px-3 py-1 bg-blue-900 text-white rounded-lg font-semibold text-[11px] cursor-pointer"
                      >
                        Schedule Demo
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                    "{app.coverNote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DEMO CLASSES MANAGEMENT                                   */}
        {/* ========================================================= */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Demo Classes Scheduled ({storeState.demos.length})
            </h3>

            <div className="space-y-3">
              {storeState.demos.map((demo) => (
                <div key={demo.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{demo.jobTitle}</h4>
                    <p className="text-slate-600">Tutor: {demo.tutorName} ({demo.tutorPhone}) · Guardian: {demo.guardianName} ({demo.guardianPhone})</p>
                    <p className="text-[11px] text-blue-900 font-semibold">{demo.date} at {demo.time} ({demo.mode} mode)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        store.updateDemoResult(demo.id, 'selected');
                        store.confirmTuition({
                          tutorId: demo.tutorId,
                          tutorName: demo.tutorName,
                          guardianId: demo.guardianId,
                          guardianName: demo.guardianName,
                          studentName: 'Student',
                          jobId: demo.jobId,
                          jobTitle: demo.jobTitle,
                          startDate: new Date().toISOString().split('T')[0],
                          monthlyFee: 7500,
                          daysPerWeek: 4,
                          scheduleTime: '5:30 PM',
                          location: 'Guardian Residence',
                          teachingMode: 'home',
                          specialInstructions: 'Regular model tests',
                          status: 'confirmed'
                        });
                        alert('Marked as Selected and Created Confirmation Record!');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      ✓ Selected & Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => store.updateDemoResult(demo.id, 'not_selected')}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold cursor-pointer"
                    >
                      Not Selected
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TUITION CONFIRMATIONS                                     */}
        {/* ========================================================= */}
        {activeTab === 'confirmations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Active Tuition Confirmations ({storeState.confirmations.length})
            </h3>

            <div className="space-y-3">
              {storeState.confirmations.map((conf) => (
                <div key={conf.id} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{conf.jobTitle} — {conf.studentName}</h4>
                    <p className="text-slate-700">Tutor: {conf.tutorName} · Guardian: {conf.guardianName}</p>
                    <p className="text-[11px] text-slate-500">Monthly Fee: {settings.defaultCurrency}{conf.monthlyFee.toLocaleString()} · Schedule: {conf.scheduleTime} ({conf.daysPerWeek} days/wk)</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] uppercase">
                    {conf.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAYMENTS                                                  */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Payment Management ({storeState.payments.length})
            </h3>

            <div className="space-y-3">
              {storeState.payments.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-blue-900">{p.id}</span>
                    <h4 className="font-bold text-slate-900">{p.month} — Tutor: {p.tutorName}</h4>
                    <p className="text-slate-600">Guardian: {p.guardianName} · Amount: <strong>{settings.defaultCurrency}{p.amount.toLocaleString()}</strong></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={p.status}
                      onChange={(e) => store.updatePaymentStatus(p.id, e.target.value as any)}
                      className="py-1 px-3 bg-white border border-slate-200 rounded-lg font-semibold uppercase text-[11px]"
                    >
                      <option value="due">Due</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CERTIFICATES                                              */}
        {/* ========================================================= */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">Issued Certificates ({storeState.certificates.length})</h3>
              <button
                type="button"
                onClick={() => {
                  store.issueCertificate({
                    tutorId: 'tut_01',
                    tutorName: 'Rahim Chowdhury',
                    title: 'Star Mentor Certificate 2026',
                    issueDate: new Date().toISOString().split('T')[0],
                    description: 'Recognized for excellent pedagogy and parent satisfaction.',
                    status: 'active'
                  });
                  alert('Issued new certificate to Rahim Chowdhury!');
                }}
                className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-semibold cursor-pointer"
              >
                + Issue New Certificate
              </button>
            </div>

            <div className="space-y-3">
              {storeState.certificates.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cert.title} — {cert.tutorName}</span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{cert.verificationCode}</span>
                  </div>
                  <p className="text-slate-600">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* REVIEWS MODERATION                                        */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950 pb-2 border-b border-slate-100">
              Review Moderation ({storeState.reviews.length})
            </h3>

            <div className="space-y-3">
              {storeState.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.guardianName} rated Tutor ({rev.tutorId})</span>
                      <span className="text-amber-500 font-bold">{rev.rating} ★</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 italic">"{rev.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => store.moderateReview(rev.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    {rev.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => store.moderateReview(rev.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* AUDIT ACTIVITY LOGS                                       */}
        {/* ========================================================= */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">System Audit Trail & Activity Logs</h3>
              <span className="text-[11px] text-slate-500">Recent 50 Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {storeState.activityLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                      <span className="text-slate-700 font-medium">{log.details}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">By: {log.performedBy}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 38: CENTRALIZED PLATFORM SETTINGS                 */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs max-w-3xl">
            <div>
              <h3 className="font-bold text-base text-blue-950">Central Platform Settings (সেন্ট্রাল প্ল্যাটফর্ম কনফিগারেশন)</h3>
              <p className="text-slate-500">
                Updating contact information, phone, WhatsApp, and rules here updates headers, footers, WhatsApp links, and buttons globally.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Central platform configuration saved and applied globally!</span>
              </div>
            )}

            <form onSubmit={handleSettingsSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    Public Contact Phone (সর্বসাধারণের জন্য ফোন)
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Default: +8809638284290</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">
                    WhatsApp Number (হোয়াটসঅ্যাপ নম্বর)
                  </label>
                  <input
                    type="text"
                    required
                    value={editWhatsApp}
                    onChange={e => setEditWhatsApp(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Link target: https://wa.me/880{editWhatsApp.replace(/^0+/, '')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-900 block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-900 block mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={editCurrency}
                    onChange={e => setEditCurrency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">Office Physical Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={e => setEditAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-900 block mb-1">Top Banner Marquee Notice</label>
                <textarea
                  rows={2}
                  value={editNotice}
                  onChange={e => setEditNotice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-blue-950">Referral Program Configuration</h4>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Referral Reward Display Text</label>
                  <input
                    type="text"
                    value={editReferralBonus}
                    onChange={e => setEditReferralBonus(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Referral Program Rules</label>
                  <textarea
                    rows={2}
                    value={editReferralRules}
                    onChange={e => setEditReferralRules(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={editRequireVerification}
                    onChange={e => setEditRequireVerification(e.target.checked)}
                    className="rounded accent-blue-900"
                  />
                  <span>Require Tutor Verification before public listing in 'Find Tutor'</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={editJobAutoApprove}
                    onChange={e => setEditJobAutoApprove(e.target.checked)}
                    className="rounded accent-blue-900"
                  />
                  <span>Auto-Approve Guardian Tuition Requests to Live Job Board</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={editDirectCall}
                    onChange={e => setEditDirectCall(e.target.checked)}
                    className="rounded accent-blue-900"
                  />
                  <span>Allow Direct Guardian-to-Tutor Phone Calls</span>
                </label>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Central Configuration
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset store data back to initial seeds?')) {
                        store.resetDemoData();
                        alert('Demo data reloaded.');
                      }
                    }}
                    className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold cursor-pointer"
                  >
                    Reload Demo Seeds
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all demo data and start with empty database?')) {
                        store.clearDemoData();
                        alert('Database cleared.');
                      }
                    }}
                    className="px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-semibold cursor-pointer"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT TUITION JOB (Section 33)              */}
      {/* ========================================================= */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">
                {editingJobId ? `Edit Tuition Job (${editingJobId})` : 'Create New Tuition Job Circular'}
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Job Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 (SSC) Physics & Math Tutor Needed in Dhanmondi"
                  value={jobFormData.title}
                  onChange={e => setJobFormData({ ...jobFormData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Class / Level</label>
                  <select
                    value={jobFormData.classLevel}
                    onChange={e => setJobFormData({ ...jobFormData, classLevel: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Medium / Curriculum</label>
                  <select
                    value={jobFormData.medium}
                    onChange={e => setJobFormData({ ...jobFormData, medium: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={jobFormData.category}
                    onChange={e => setJobFormData({ ...jobFormData, category: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Subjects (Comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="Mathematics, Physics, Chemistry"
                  value={jobFormData.subjects}
                  onChange={e => setJobFormData({ ...jobFormData, subjects: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">District</label>
                  <select
                    value={jobFormData.district}
                    onChange={e => setJobFormData({ ...jobFormData, district: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Area / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhanmondi, Road 12"
                    value={jobFormData.area}
                    onChange={e => setJobFormData({ ...jobFormData, area: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Days Per Week</label>
                  <select
                    value={jobFormData.daysPerWeek}
                    onChange={e => setJobFormData({ ...jobFormData, daysPerWeek: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {[1, 2, 3, 4, 5, 6].map(d => <option key={d} value={d}>{d} days / week</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Preferred Time</label>
                  <input
                    type="text"
                    placeholder="5:30 PM - 7:00 PM"
                    value={jobFormData.preferredTime}
                    onChange={e => setJobFormData({ ...jobFormData, preferredTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Monthly Salary ({settings.defaultCurrency})</label>
                  <input
                    type="number"
                    required
                    value={jobFormData.salary}
                    onChange={e => setJobFormData({ ...jobFormData, salary: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Teaching Type</label>
                  <select
                    value={jobFormData.teachingType}
                    onChange={e => setJobFormData({ ...jobFormData, teachingType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize"
                  >
                    <option value="home">Home Tuition</option>
                    <option value="online">Online Tuition</option>
                    <option value="coaching">Group / Batch</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Tutor Gender Preference</label>
                  <select
                    value={jobFormData.tutorGenderPreference}
                    onChange={e => setJobFormData({ ...jobFormData, tutorGenderPreference: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize"
                  >
                    <option value="any">Any Gender</option>
                    <option value="male">Male Tutor Preferred</option>
                    <option value="female">Female Tutor Preferred</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select
                    value={jobFormData.status}
                    onChange={e => setJobFormData({ ...jobFormData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="filled">Filled</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description & Requirements</label>
                <textarea
                  rows={3}
                  value={jobFormData.description}
                  onChange={e => setJobFormData({ ...jobFormData, description: e.target.value })}
                  placeholder="Additional instructions for applicants..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingJobId ? 'Save Changes' : 'Publish Job Circular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ASSIGN TUTOR TO JOB (Section 33)                    */}
      {/* ========================================================= */}
      {assignModalOpen && assignJobTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">Assign Tutor to Job</h3>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Job: <strong>{assignJobTarget.id}</strong> — {assignJobTarget.title}
            </p>

            <div>
              <label className="font-semibold block mb-1">Select Registered Tutor</label>
              <select
                value={selectedTutorToAssign}
                onChange={e => setSelectedTutorToAssign(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="">-- Choose Tutor --</option>
                {storeState.tutors.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.university} - {t.department}) [{t.verificationStatus}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedTutorToAssign}
                onClick={() => {
                  const targetTutor = store.getTutorById(selectedTutorToAssign);
                  if (targetTutor) {
                    store.assignTutorToJob(assignJobTarget.id, targetTutor.id, targetTutor.fullName);
                    setAssignModalOpen(false);
                    alert(`Assigned ${targetTutor.fullName} to job ${assignJobTarget.id}. Status changed to FILLED.`);
                  }
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW APPLICATIONS FOR SPECIFIC JOB                 */}
      {/* ========================================================= */}
      {selectedJobForApps && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Applicants for {selectedJobForApps.id}</h3>
                <p className="text-slate-500">{selectedJobForApps.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForApps(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {storeState.applications.filter(a => a.jobId === selectedJobForApps.id).length === 0 ? (
                <p className="text-center py-6 text-slate-500">No applications received yet for this job circular.</p>
              ) : (
                storeState.applications.filter(a => a.jobId === selectedJobForApps.id).map(app => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 text-sm">{app.tutorName}</strong>
                        <p className="text-slate-600">{app.tutorUniversity} ({app.tutorDepartment}) · Mobile: {app.tutorPhone}</p>
                        <p className="text-[11px] text-slate-500">Expected: {settings.defaultCurrency}{app.expectedSalary}/mo · Applied: {app.appliedDate}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => store.updateApplicationStatus(app.id, e.target.value as any)}
                          className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg font-semibold uppercase text-[11px]"
                        >
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="demo_scheduled">Demo Scheduled</option>
                          <option value="appointed">Appointed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            store.assignTutorToJob(selectedJobForApps.id, app.tutorId, app.tutorName);
                            store.updateApplicationStatus(app.id, 'appointed');
                            setSelectedJobForApps(null);
                            alert(`Appointed ${app.tutorName} to job!`);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Appoint
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                      "{app.coverNote}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GUARDIAN PROFILE DETAILS & ADMIN NOTES (Section 34) */}
      {/* ========================================================= */}
      {selectedGuardianForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Guardian Profile & Private Admin Record</h3>
                <p className="text-slate-500 font-mono text-[11px]">User ID: {selectedGuardianForDetail.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuardianForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[11px]">Full Name</span>
                <span className="font-bold text-slate-900">{selectedGuardianForDetail.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Mobile Phone</span>
                <span className="font-mono font-bold text-blue-900">{selectedGuardianForDetail.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email</span>
                <span className="text-slate-700">{selectedGuardianForDetail.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="text-slate-700">{selectedGuardianForDetail.location}, {selectedGuardianForDetail.district}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span className="font-bold capitalize">{selectedGuardianForDetail.status || 'active'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Referral Code</span>
                <span className="font-mono font-bold text-amber-700">{selectedGuardianForDetail.referralCode || 'N/A'}</span>
              </div>
            </div>

            {/* Tuition Requests by this Guardian */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-950">Tuition Requests by this Guardian</h4>
              {storeState.requests.filter(r => r.guardianId === selectedGuardianForDetail.id).length === 0 ? (
                <p className="text-slate-500 italic">No tuition requests submitted yet.</p>
              ) : (
                storeState.requests.filter(r => r.guardianId === selectedGuardianForDetail.id).map(req => (
                  <div key={req.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold">{req.studentClass} ({req.medium})</span>
                      <p className="text-[11px] text-slate-500">{req.area} · Budget: {settings.defaultCurrency}{req.monthlyBudget} · {req.status}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold uppercase">{req.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-blue-950">Internal Admin Notes (Visible Only to Admins)</h4>
              
              <div className="space-y-2">
                {store.getAdminNotes('guardian', selectedGuardianForDetail.id).map(note => (
                  <div key={note.id} className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <p className="text-amber-950 font-medium">{note.note}</p>
                    <span className="text-[10px] text-amber-800 block mt-1">Logged by: {note.createdBy} ({new Date(note.createdAt).toLocaleDateString()})</span>
                  </div>
                ))}
              </div>

              {/* Add Note Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add internal administrator note..."
                  value={guardianAdminNote}
                  onChange={e => setGuardianAdminNote(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  disabled={!guardianAdminNote.trim()}
                  onClick={() => {
                    store.addAdminNote('guardian', selectedGuardianForDetail.id, guardianAdminNote.trim(), currentUser.name);
                    setGuardianAdminNote('');
                    setGuardianNoteSuccess(true);
                    setTimeout(() => setGuardianNoteSuccess(false), 2000);
                  }}
                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Note
                </button>
              </div>
              {guardianNoteSuccess && <span className="text-emerald-700 font-semibold block text-[11px]">Note saved!</span>}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT NOTICE (Section 35)                   */}
      {/* ========================================================= */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">
                {editingNoticeId ? 'Edit Notice' : 'Create Platform Notice'}
              </h3>
              <button
                type="button"
                onClick={() => setNoticeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. নতুন টিউশন সংক্রান্ত জরুরী নির্দেশনা"
                  value={noticeFormData.title}
                  onChange={e => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Target Category</label>
                <select
                  value={noticeFormData.category}
                  onChange={e => setNoticeFormData({ ...noticeFormData, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize"
                >
                  <option value="general">General (All Users)</option>
                  <option value="tutors">Tutors Only</option>
                  <option value="guardians">Guardians Only</option>
                  <option value="urgent">Urgent Announcement</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Notice Description / Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the full announcement text..."
                  value={noticeFormData.description}
                  onChange={e => setNoticeFormData({ ...noticeFormData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Status</label>
                <select
                  value={noticeFormData.status}
                  onChange={e => setNoticeFormData({ ...noticeFormData, status: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize font-bold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Saved only)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingNoticeId ? 'Save Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REJECT TUTOR PROFILE WITH REASON                   */}
      {/* ========================================================= */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-bold text-base text-rose-700">Reject Tutor Profile</h3>
            <p className="text-slate-600">Enter reason for rejection. The tutor will see this reason in their dashboard.</p>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Please upload clear NID scan or updated university admission slip..."
              className="w-full p-2.5 bg-slate-50 border rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  store.setTutorVerificationStatus(targetTutorId, 'rejected', rejectionReason);
                  setRejectModalOpen(false);
                  setRejectionReason('');
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SCHEDULE DEMO CLASS                                */}
      {/* ========================================================= */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-bold text-base text-blue-950">Schedule Official Demo Class</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Date</label>
                <input
                  type="date"
                  value={demoDate}
                  onChange={e => setDemoDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Time</label>
                <input
                  type="text"
                  value={demoTime}
                  onChange={e => setDemoTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">Notes / Instructions</label>
              <textarea
                rows={2}
                value={demoNotes}
                onChange={e => setDemoNotes(e.target.value)}
                placeholder="Topic for demo class..."
                className="w-full p-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="px-3 py-1.5 text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  store.scheduleDemoClass({
                    tutorId: demoTutorId,
                    tutorName: 'Rahim Chowdhury',
                    tutorPhone: '01711223344',
                    guardianId: demoGuardianId,
                    guardianName: 'Mrs. Farhana Begum',
                    guardianPhone: '01799887766',
                    jobId: demoJobId,
                    jobTitle: 'Tuition Demo Session',
                    date: demoDate,
                    time: demoTime,
                    mode: 'home',
                    notes: demoNotes || 'Introductory evaluation demo session',
                    status: 'scheduled'
                  });
                  setDemoModalOpen(false);
                  alert('Demo session scheduled! Tutor and Guardian notified.');
                }}
                className="px-4 py-1.5 bg-blue-900 text-white rounded-lg font-bold cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
