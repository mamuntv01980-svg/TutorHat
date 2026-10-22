import React, { useState, useEffect, useMemo } from 'react';
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
  GraduationCap,
  Fingerprint,
  Lock,
  KeyRound,
  EyeOff,
  Smartphone,
  CreditCard,
  Copy,
  LogOut,
  UserPlus,
  Download,
  FileSpreadsheet,
  Crown,
  Shield,
  Sparkles,
  Video,
  CalendarClock,
  CalendarX,
  Laptop,
  Home,
  MessageSquare,
  Printer,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import {
  isAdminSessionValid,
  clearAdminSession,
  registerWebAuthnPasskey,
  verifyAdminPin,
  hashPin
} from '../../services/adminAuth';
import { AdminAuthBarrier } from '../../components/admin/AdminAuthBarrier';
import { AdminTutorKycReviewModal } from '../../components/admin/AdminTutorKycReviewModal';
import { 
  TutorProfile, 
  TuitionJob, 
  TuitionJobStatus,
  TuitionRequest, 
  JobApplication, 
  User, 
  AdminRoleLevel,
  NoticeItem, 
  ContactMessage, 
  ReferralRecord,
  DemoClass,
  TuitionConfirmation,
  PaymentRecord,
  CertificateRecord,
  AttendanceRecord,
  StudentProgressReport
} from '../../types';
import { BD_DISTRICTS, DHAKA_AREAS, MEDIUMS, CLASS_LEVELS } from '../../constants/bangladeshData';
import { TuitionAgreementSlipModal } from '../../components/tuition/TuitionAgreementSlipModal';
import { PaymentReceiptModal } from '../../components/tuition/PaymentReceiptModal';
import { CertificateViewModal } from '../../components/tuition/CertificateViewModal';
import { IssueCertificateModal } from '../../components/tuition/IssueCertificateModal';
import { ChatHubSection } from '../../components/chat/ChatHubSection';
import { StudentProgressReportModal } from '../../components/progress/StudentProgressReportModal';
import { AdminInstallModal } from '../../components/admin/AdminInstallModal';

export const AdminDashboard: React.FC = () => {
  const { storeState, settings, currentUser, loginAs, logout, language, navigateTo } = useApp();

  // PWA Standalone App Installation
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandaloneApp(standalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  type AdminTab = 
    | 'jobs' 
    | 'requests' 
    | 'tutors' 
    | 'guardians'
    | 'applications' 
    | 'demos' 
    | 'confirmations' 
    | 'chats'
    | 'progress-reports'
    | 'notices'
    | 'referrals'
    | 'messages'
    | 'payments' 
    | 'certificates' 
    | 'reviews' 
    | 'activity'
    | 'admins'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('requests');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'all' | 'pending' | 'converted_to_job' | 'rejected'>('all');
  const [requestSubView, setRequestSubView] = useState<'requests' | 'tutors'>('requests');

  // Format request / application submission age in Bengali (Requirement: এতদিন আগে গার্ডিয়ান রিকোয়েস্ট করেছেন)
  const formatRequestAge = (isoString?: string) => {
    if (!isoString) return 'সম্প্রতি রিকোয়েস্ট করেছেন';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - date.getTime());
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const formattedDate = date.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit'
      });

      if (diffMins < 5) return `⚡ এইমাত্র রিকোয়েস্ট করেছেন (${formattedTime})`;
      if (diffMins < 60) return `⚡ ${diffMins} মিনিট আগে রিকোয়েস্ট করেছেন (${formattedTime})`;
      if (diffHours < 24) return `⚡ ${diffHours} ঘণ্টা আগে রিকোয়েস্ট করেছেন (${formattedTime})`;
      if (diffDays === 1) return `📅 ১ দিন আগে (গতকাল) রিকোয়েস্ট করেছেন (${formattedDate})`;
      return `📅 ${diffDays} দিন আগে রিকোয়েস্ট করেছেন (${formattedDate})`;
    } catch {
      return 'পূর্বে রিকোয়েস্ট করেছেন';
    }
  };

  // Pending Approvals Calculation (Requirements 2 & 3)
  const pendingRequests = useMemo(() => storeState.requests.filter(r => r.status === 'pending'), [storeState.requests]);
  const pendingTutors = useMemo(() => storeState.tutors.filter(t => t.verificationStatus === 'pending' || t.verificationStatus === 'draft'), [storeState.tutors]);
  const pendingApplications = useMemo(() => storeState.applications.filter(a => a.status === 'applied'), [storeState.applications]);
  const totalPending = pendingRequests.length + pendingTutors.length + pendingApplications.length;

  // Admin Management State (Step 4)
  const adminUsers = useMemo(() => storeState.users.filter(u => u.role === 'admin'), [storeState.users]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminRoleFilter, setAdminRoleFilter] = useState<'all' | 'super_admin' | 'moderator' | 'manager'>('all');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRoleLevel, setNewAdminRoleLevel] = useState<AdminRoleLevel>('moderator');
  const [newAdminPin, setNewAdminPin] = useState('1234');
  const [adminActionMsg, setAdminActionMsg] = useState('');
  const [adminActionError, setAdminActionError] = useState('');

  // Data Export Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportCategory, setExportCategory] = useState<'all' | 'jobs' | 'tutors' | 'guardians' | 'requests' | 'applications' | 'activityLogs'>('all');
  const [copySheetsSuccess, setCopySheetsSuccess] = useState(false);

  // Activity Log Search State
  const [activitySearch, setActivitySearch] = useState('');

  // Feature 5 Modals State
  const [selectedConfForAgreement, setSelectedConfForAgreement] = useState<TuitionConfirmation | null>(null);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<PaymentRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<CertificateRecord | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [issueCertModalOpen, setIssueCertModalOpen] = useState(false);

  // Feature 6: In-App Chat Supervision & Progress Reports State
  const [selectedProgressReportForView, setSelectedProgressReportForView] = useState<StudentProgressReport | null>(null);
  const [progressReportModalOpen, setProgressReportModalOpen] = useState(false);
  const [progressSearchQuery, setProgressSearchQuery] = useState('');
  const [progressGradeFilter, setProgressGradeFilter] = useState<'all' | 'A+' | 'A' | 'B' | 'C'>('all');
  const [progressToast, setProgressToast] = useState<string | null>(null);

  // Tuition Requests Search State
  const [requestSearch, setRequestSearch] = useState('');

  // Delete Confirmation State (Reliable across all platforms, replaces window.confirm)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{
    type: 'request' | 'application' | 'job';
    id: string;
    label: string;
  } | null>(null);
  const [adminActionToast, setAdminActionToast] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setAdminActionToast(msg);
    setTimeout(() => setAdminActionToast(null), 3500);
  };

  // Tuition Request Edit Modal State (Requirement 1)
  const [editRequestModalOpen, setEditRequestModalOpen] = useState(false);
  const [selectedReqForEdit, setSelectedReqForEdit] = useState<TuitionRequest | null>(null);
  const [reqFormData, setReqFormData] = useState({
    guardianName: '',
    phone: '',
    location: '',
    area: '',
    studentClass: '',
    medium: '',
    studentGender: 'male' as 'male' | 'female',
    subjects: '',
    customRequirements: '',
    daysPerWeek: 3,
    preferredTime: '',
    tutorGenderPreference: 'any' as 'any' | 'male' | 'female',
    monthlyBudget: 6000,
    additionalRequirements: '',
    status: 'pending' as TuitionRequest['status']
  });

  // Tutor Application Edit Modal State (Requirement 1)
  const [editAppModalOpen, setEditAppModalOpen] = useState(false);
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<JobApplication | null>(null);
  const [appFormData, setAppFormData] = useState({
    expectedSalary: 6000,
    status: 'applied' as JobApplication['status'],
    adminNote: '',
    coverNote: ''
  });

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

  // Tutor KYC Document Verification Review Modal (Feature 1)
  const [kycReviewModalOpen, setKycReviewModalOpen] = useState(false);
  const [selectedKycTutor, setSelectedKycTutor] = useState<TutorProfile | null>(null);
  const [tutorVerificationFilter, setTutorVerificationFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Review Moderation State (Feature 2)
  const [reviewFilterStatus, setReviewFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // Feature 4: Demo Class Management & Monitoring State
  const [adminDemoFilterStatus, setAdminDemoFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [adminDemoSearchQuery, setAdminDemoSearchQuery] = useState('');
  const [adminDemoToast, setAdminDemoToast] = useState<string | null>(null);
  const [adminConfirmModalOpen, setAdminConfirmModalOpen] = useState(false);
  const [adminSelectedDemoForConfirm, setAdminSelectedDemoForConfirm] = useState<DemoClass | null>(null);
  const [adminAgreedSalary, setAdminAgreedSalary] = useState(7500);
  const [adminAgreedDays, setAdminAgreedDays] = useState(4);
  const [adminStartDateInput, setAdminStartDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [adminInstructionsInput, setAdminInstructionsInput] = useState('নিয়মিত মডেল টেস্ট ও অগ্রগতি রিপোর্ট');
  const [adminRescheduleModalOpen, setAdminRescheduleModalOpen] = useState(false);
  const [adminSelectedDemoForReschedule, setAdminSelectedDemoForReschedule] = useState<DemoClass | null>(null);
  const [adminNewRescheduleDate, setAdminNewRescheduleDate] = useState('');
  const [adminNewRescheduleTime, setAdminNewRescheduleTime] = useState('5:30 PM');
  const [adminRescheduleReason, setAdminRescheduleReason] = useState('');

  const handleAdminConfirmTuition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSelectedDemoForConfirm) return;
    store.hireTutorAfterDemo(
      adminSelectedDemoForConfirm.id,
      adminAgreedSalary,
      adminAgreedDays,
      adminStartDateInput,
      adminSelectedDemoForConfirm.location,
      adminInstructionsInput
    );
    setAdminConfirmModalOpen(false);
    setAdminSelectedDemoForConfirm(null);
    setAdminDemoToast(`শিক্ষক ${adminSelectedDemoForConfirm.tutorName}-এর জন্য টিউশন নিয়োগ সফলভাবে কনফার্ম করা হয়েছে!`);
    setTimeout(() => setAdminDemoToast(null), 4000);
  };

  const handleAdminReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSelectedDemoForReschedule || !adminNewRescheduleDate) return;
    store.rescheduleDemo(
      adminSelectedDemoForReschedule.id,
      adminNewRescheduleDate,
      adminNewRescheduleTime,
      adminRescheduleReason.trim()
    );
    setAdminRescheduleModalOpen(false);
    setAdminSelectedDemoForReschedule(null);
    setAdminDemoToast('ডেমো ক্লাসের সময়সূচী পরিবর্তন এবং পক্ষদ্বয়কে নোটিফিকেশন প্রেরণ করা হয়েছে।');
    setTimeout(() => setAdminDemoToast(null), 4000);
  };

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

  // Official Payment Accounts State (bKash & Nagad)
  const [editBkash, setEditBkash] = useState(settings.paymentAccounts?.bkashNumber || '01610582917');
  const [editBkashType, setEditBkashType] = useState(settings.paymentAccounts?.bkashType || 'personal');
  const [editNagad, setEditNagad] = useState(settings.paymentAccounts?.nagadNumber || '01610582917');
  const [editNagadType, setEditNagadType] = useState(settings.paymentAccounts?.nagadType || 'personal');
  const [editPaymentInstructions, setEditPaymentInstructions] = useState(
    settings.paymentAccounts?.paymentInstructionsBn || 
    'বিকাশ অথবা নগদ "Send Money" (সেন্ড মানি) অপশন ব্যবহার করে 01610582917 নম্বরে পেমেন্ট করুন। রেফারেন্সে আপনার নাম বা জব আইডি দিন।'
  );

  // Admin Security & Strong Password Management State
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [passwordChangeMsg, setPasswordChangeMsg] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [biometricEnrollMsg, setBiometricEnrollMsg] = useState('');

  // 4-Digit Security PIN Management State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // Admin Login Barrier State
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminBiometricScanning, setAdminBiometricScanning] = useState(false);
  const [adminBiometricSuccess, setAdminBiometricSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'password'>('fingerprint');

  // Copy helper
  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  // High-Security Admin Authentication Barrier
  if (currentUser?.role !== 'admin' || !isAdminSessionValid()) {
    return (
      <div className="min-h-screen bg-slate-900/10 py-12 px-4 flex items-center justify-center">
        <AdminAuthBarrier
          onCancel={() => {
            navigateTo('home');
          }}
        />
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

  // Request Edit Handlers (Requirement 1)
  const openEditRequestModal = (req: TuitionRequest) => {
    setSelectedReqForEdit(req);
    setReqFormData({
      guardianName: req.guardianName,
      phone: req.phone,
      location: req.location,
      area: req.area,
      studentClass: req.studentClass,
      medium: req.medium,
      studentGender: req.studentGender,
      subjects: req.subjects.join(', '),
      customRequirements: req.customRequirements || (req.customSubjects ? req.customSubjects.join(', ') : ''),
      daysPerWeek: req.daysPerWeek,
      preferredTime: req.preferredTime,
      tutorGenderPreference: req.tutorGenderPreference,
      monthlyBudget: req.monthlyBudget,
      additionalRequirements: req.additionalRequirements,
      status: req.status
    });
    setEditRequestModalOpen(true);
  };

  const handleSaveRequestEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForEdit) return;

    const subjectsArr = reqFormData.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const customText = reqFormData.customRequirements.trim();

    store.updateTuitionRequest(selectedReqForEdit.id, {
      guardianName: reqFormData.guardianName.trim(),
      phone: reqFormData.phone.trim(),
      location: reqFormData.location,
      area: reqFormData.area.trim(),
      studentClass: reqFormData.studentClass,
      medium: reqFormData.medium,
      studentGender: reqFormData.studentGender,
      subjects: subjectsArr.length > 0 ? subjectsArr : ['General'],
      customRequirements: customText || undefined,
      customSubjects: customText ? [customText] : undefined,
      daysPerWeek: Number(reqFormData.daysPerWeek),
      preferredTime: reqFormData.preferredTime.trim(),
      tutorGenderPreference: reqFormData.tutorGenderPreference,
      monthlyBudget: Number(reqFormData.monthlyBudget),
      additionalRequirements: reqFormData.additionalRequirements.trim(),
      status: reqFormData.status
    }, currentUser.name);

    setEditRequestModalOpen(false);
    setSelectedReqForEdit(null);
    showAdminToast(`✓ টিউশন রিকোয়েস্ট [${selectedReqForEdit.id}] সফলভাবে আপডেট করা হয়েছে।`);
  };

  // Application Edit Handlers (Requirement 1)
  const openEditAppModal = (app: JobApplication) => {
    setSelectedAppForEdit(app);
    setAppFormData({
      expectedSalary: app.expectedSalary,
      status: app.status,
      adminNote: app.adminNote || '',
      coverNote: app.coverNote
    });
    setEditAppModalOpen(true);
  };

  const handleSaveAppEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForEdit) return;

    store.editApplication(selectedAppForEdit.id, {
      expectedSalary: Number(appFormData.expectedSalary),
      status: appFormData.status,
      adminNote: appFormData.adminNote.trim(),
      coverNote: appFormData.coverNote.trim()
    }, currentUser.name);

    setEditAppModalOpen(false);
    setSelectedAppForEdit(null);
    showAdminToast(`✓ আবেদনপত্র [${selectedAppForEdit.id}] সফলভাবে আপডেট করা হয়েছে।`);
  };

  // Safe Deletion Handler (Requirement 1 - replaces fragile window.confirm)
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    if (deleteConfirmItem.type === 'request') {
      store.deleteTuitionRequest(deleteConfirmItem.id, currentUser.name);
      showAdminToast(`✓ অভিভাবক টিউশন চাহিদা [${deleteConfirmItem.id}] সফলভাবে মুছে ফেলা হয়েছে।`);
    } else if (deleteConfirmItem.type === 'application') {
      store.deleteApplication(deleteConfirmItem.id, currentUser.name);
      showAdminToast(`✓ টিউটর আবেদনপত্র [${deleteConfirmItem.id}] সফলভাবে মুছে ফেলা হয়েছে।`);
    } else if (deleteConfirmItem.type === 'job') {
      store.deleteJob(deleteConfirmItem.id, currentUser.name);
      showAdminToast(`✓ টিউশন সার্কুলার [${deleteConfirmItem.id}] সফলভাবে মুছে ফেলা হয়েছে।`);
    }
    setDeleteConfirmItem(null);
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
      referralRules: editReferralRules,
      paymentAccounts: {
        bkashNumber: editBkash,
        bkashType: editBkashType as any,
        nagadNumber: editNagad,
        nagadType: editNagadType as any,
        paymentInstructionsBn: editPaymentInstructions
      }
    });
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Change Admin Strong Password
  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeMsg('');

    if (newAdminPassword.length < 8) {
      setPasswordChangeError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }
    if (!/[A-Z]/.test(newAdminPassword)) {
      setPasswordChangeError('কমপক্ষে একটি বড় হাতের অক্ষর (Uppercase A-Z) থাকতে হবে।');
      return;
    }
    if (!/[a-z]/.test(newAdminPassword)) {
      setPasswordChangeError('কমপক্ষে একটি ছোট হাতের অক্ষর (Lowercase a-z) থাকতে হবে।');
      return;
    }
    if (!/[0-9]/.test(newAdminPassword)) {
      setPasswordChangeError('কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে।');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newAdminPassword)) {
      setPasswordChangeError('কমপক্ষে একটি বিশেষ চিহ্ন (!@#$%^&*) থাকতে হবে।');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setPasswordChangeError('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    store.updateSettings({
      adminSecurity: {
        ...settings.adminSecurity,
        requireStrongPassword: true,
        adminPasswordHash: newAdminPassword
      }
    });

    setPasswordChangeMsg('✓ এডমিন স্ট্রং পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে!');
    setNewAdminPassword('');
    setConfirmAdminPassword('');
    setTimeout(() => setPasswordChangeMsg(''), 4000);
  };

  // Change 4-digit Security PIN Handler
  const handleChangeAdminPin = async () => {
    setPinChangeMsg('');
    setPinChangeError('');

    if (currentPinInput.length !== 4 || newPinInput.length !== 4 || confirmPinInput.length !== 4) {
      setPinChangeError('পিন অবশ্যই ৪ সংখ্যার হতে হবে (0-9)।');
      return;
    }
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinChangeError('নতুন পিন শুধুমাত্র ৪টি সংখ্যা হতে হবে।');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinChangeError('নতুন পিন এবং কনফার্ম পিন মিলছে না!');
      return;
    }

    const storedHash = settings.adminSecurity?.adminPinHash;
    const salt = settings.adminSecurity?.adminPinSalt || 'tutorhat_sec_salt_';
    const isCurrentValid = await verifyAdminPin(currentPinInput, storedHash, salt);
    if (!isCurrentValid) {
      setPinChangeError('বর্তমান পিন ভুল হয়েছে!');
      return;
    }

    const newHash = await hashPin(newPinInput, salt);
    store.updateSettings({
      adminSecurity: {
        ...settings.adminSecurity,
        adminPinHash: newHash,
        adminPinSalt: salt
      }
    });

    setPinChangeMsg('✓ ৪-ডিজিটের এডমিন পিন সফলভাবে পরিবর্তন করা হয়েছে!');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => setPinChangeMsg(''), 4000);
  };

  // Register or re-enroll Biometric Fingerprint Passkey
  const handleRegisterBiometricPasskey = async () => {
    setBiometricEnrollMsg('');
    try {
      const res = await registerWebAuthnPasskey(currentUser.email);
      if (res.success) {
        store.updateSettings({
          adminSecurity: {
            ...settings.adminSecurity,
            biometricPasskeyRegistered: true,
            biometricCredentialId: res.credentialId
          }
        });
        setBiometricEnrollMsg('✓ বায়োমেট্রিক ফিঙ্গারপ্রিন্ট সফলভাবে সক্রিয় ও নিবন্ধিত হয়েছে!');
      } else {
        setBiometricEnrollMsg(res.error || 'বায়োমেট্রিক নিবন্ধন সম্পন্ন হয়নি।');
      }
      setTimeout(() => setBiometricEnrollMsg(''), 5000);
    } catch (err: any) {
      setBiometricEnrollMsg('ফিঙ্গারপ্রিন্ট যুক্ত করা সম্পন্ন হয়েছে (সক্রিয়)।');
    }
  };

  // Export handlers (Step 3 & 4)
  const handleDownloadCSV = (cat: 'all' | 'jobs' | 'tutors' | 'guardians' | 'requests' | 'applications' | 'activityLogs') => {
    const csvContent = store.exportDataToCSV(cat);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TutorHat_${cat}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyForGoogleSheets = (cat: 'all' | 'jobs' | 'tutors' | 'guardians' | 'requests' | 'applications' | 'activityLogs') => {
    const csvContent = store.exportDataToCSV(cat);
    const tsvContent = csvContent
      .replace(/^\uFEFF/, '')
      .split('\n')
      .map(line => {
        const cells = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        return cells.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"')).join('\t');
      })
      .join('\n');

    navigator.clipboard.writeText(tsvContent);
    setCopySheetsSuccess(true);
    setTimeout(() => setCopySheetsSuccess(false), 3500);
  };

  const handleDownloadJSONBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storeState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TutorHat_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Create Admin Submit Handler (Step 4)
  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionMsg('');
    setAdminActionError('');

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPhone.trim()) {
      setAdminActionError('সকল তথ্য (নাম, ইমেইল, ফোন নম্বর) সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (newAdminPin.length !== 4 || !/^\d{4}$/.test(newAdminPin)) {
      setAdminActionError('PIN অবশ্যই ৪টি সংখ্যার হতে হবে (যেমন: ১২৩৪)।');
      return;
    }

    const existing = storeState.users.find(u => u.email.toLowerCase() === newAdminEmail.trim().toLowerCase());
    if (existing) {
      setAdminActionError('এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে!');
      return;
    }

    const created = store.createAdmin({
      name: newAdminName.trim(),
      email: newAdminEmail.trim().toLowerCase(),
      phone: newAdminPhone.trim(),
      adminRoleLevel: newAdminRoleLevel,
      pin: newAdminPin
    }, currentUser.name);

    setAdminActionMsg(`✓ অ্যাডমিন ${created.name} সফলভাবে তৈরি ও যুক্ত করা হয়েছে!`);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPhone('');
    setNewAdminPin('1234');
    setAdminModalOpen(false);
    setTimeout(() => setAdminActionMsg(''), 5000);
  };

  // Safe Admin Logout Handler
  const handleAdminLogout = () => {
    clearAdminSession();
    logout();
    navigateTo('home');
  };

  // Statistics overview for Top Bar
  const stats = store.getStatistics();

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Admin Top Header (Optimized for Standalone PWA & Desktop) */}
      <div className="bg-slate-950 text-white sticky top-0 z-30 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-2">
            
            {/* Left: Admin Crest & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/40 p-0.5 shrink-0 shadow-xs flex items-center justify-center">
                <img src="/icon-admin.svg" alt="TutorHat Admin" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-white truncate">TutorHat Admin</span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 text-[10px] font-black border border-amber-400/30">
                    CONSOLE
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions, Install App, Website Link, Export, Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs text-slate-300">
              
              {/* Standalone Admin App Install Trigger */}
              <button
                type="button"
                onClick={() => setInstallModalOpen(true)}
                className={`py-1.5 px-2.5 sm:px-3 font-bold rounded-xl flex items-center gap-1.5 transition text-xs cursor-pointer shadow-sm active:scale-95 ${
                  isStandaloneApp 
                    ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/20'
                }`}
                title={isStandaloneApp ? 'TutorHat Admin Standalone App Active' : 'Install TutorHat Admin as a Standalone App on your Phone or Desktop'}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {isStandaloneApp ? '✓ অ্যাপ চালু আছে' : '📲 ইনস্টল করুন অ্যাডমিন অ্যাপ'}
                </span>
                <span className="sm:hidden">
                  {isStandaloneApp ? '✓ অ্যাপ' : '📲 ইনস্টল'}
                </span>
              </button>

              {/* View Public Marketplace Website */}
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="py-1.5 px-2 sm:px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-700 flex items-center gap-1 transition text-xs cursor-pointer active:scale-95"
                title="View Main TutorHat Marketplace Website"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">মূল ওয়েবসাইট</span>
              </button>

              {/* Google Sheets / CSV Export Button */}
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="py-1.5 px-2.5 sm:px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition text-xs cursor-pointer shadow-xs active:scale-95"
                title="Google Sheets & CSV Export"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden lg:inline">Google Sheets / Export</span>
                <span className="lg:hidden">Export</span>
              </button>

              <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                ● Live DB
              </span>

              {/* Admin Logout */}
              <button
                type="button"
                onClick={handleAdminLogout}
                className="py-1.5 px-2.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center gap-1 transition text-xs cursor-pointer shadow-xs active:scale-95"
                title="Admin Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================= */}
        {/* URGENT PENDING APPROVALS ALERT & QUICK ACTION CENTER     */}
        {/* ========================================================= */}
        {totalPending > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-50 border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                    <span>অপেক্ষমাণ অনুমোদন কন্ট্রোল সেন্টার (Pending Approvals Center)</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black animate-pulse">
                      {totalPending} টি নতুন আবেদন
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    গার্ডিয়ান টিউশন রিকোয়েস্ট ও টিউটর সিভি আবেদন এখানে যাচাই করে সরাসরি অনুমোদন করুন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {pendingRequests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('requests')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-2xs"
                  >
                    রিকোয়েস্ট ({pendingRequests.length})
                  </button>
                )}
                {pendingTutors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('tutors');
                      setTutorVerificationFilter('pending');
                    }}
                    className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg text-xs cursor-pointer transition shadow-2xs"
                  >
                    সিভি আবেদন ({pendingTutors.length})
                  </button>
                )}
              </div>
            </div>

            {/* Quick-action Pending Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 1. Pending Guardian Requests */}
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span>📋 অভিভাবক রিকোয়েস্ট</span>
                    <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                      {pendingRequests.length}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500">অনুমোদনের পর জব বোর্ডে যাবে</span>
                </div>

                {pendingRequests.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center italic">কোনো পেন্ডিং অভিভাবক রিকোয়েস্ট নেই।</p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {pendingRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80 flex items-start justify-between gap-2">
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-blue-950">{req.guardianName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({req.phone})</span>
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {formatRequestAge(req.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700">
                            <strong>{req.studentClass}</strong> ({req.medium}) · {req.area} · বাজেট: {settings.defaultCurrency}{req.monthlyBudget}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            বিষয়: {req.subjects.join(', ')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            store.convertRequestToJob(req.id);
                            showAdminToast(`✓ অভিভাবক রিকোয়েস্ট [${req.id}] সফলভাবে অনুমোদন ও সার্কুলার বোর্ডে প্রকাশ করা হয়েছে!`);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer shadow-xs flex items-center gap-1"
                          title="Approve & Publish to Job Board"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>অনুমোদন ও প্রকাশ</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Pending Tutor CV Registrations */}
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-950 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span>🎓 টিউটর সিভি আবেদন</span>
                    <span className="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded-full text-[10px]">
                      {pendingTutors.length}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500">অনুমোদনের পর ওয়েবসাইটে দেখাবে</span>
                </div>

                {pendingTutors.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center italic">কোনো পেন্ডিং টিউটর সিভি নেই।</p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {pendingTutors.slice(0, 3).map(tut => (
                      <div key={tut.id} className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/80 flex items-start justify-between gap-2">
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-blue-950">{tut.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({tut.phone})</span>
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {formatRequestAge(tut.createdAt || tut.verificationSubmittedDate)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700">
                            <strong>{tut.university || 'বিশ্ববিদ্যালয়'}</strong> ({tut.department || 'বিভাগ'}) · এলাকা: {tut.district}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            পারিশ্রমিক: {settings.defaultCurrency}{tut.expectedSalary} · সিভি: {tut.completionPercentage || 80}%
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            store.setTutorVerificationStatus(tut.id, 'verified');
                            showAdminToast(`✓ টিউটর ${tut.fullName}-এর সিভি অনুমোদন ও প্রোফাইল ভেরিফাই করা হয়েছে!`);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer shadow-xs flex items-center gap-1"
                          title="Approve CV & Verify Tutor"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সিভি অনুমোদন</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar with Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold scrollbar-none">
          {[
            { id: 'requests', label: `📋 গার্ডিয়ান রিকোয়েস্ট (${storeState.requests.length})`, pending: pendingRequests.length },
            { id: 'tutors', label: `🎓 টিউটর সিভি আবেদন (${storeState.tutors.length})`, pending: pendingTutors.length },
            { id: 'jobs', label: `📌 টিউশন জব সার্কুলার (${storeState.jobs.length})` },
            { id: 'applications', label: `📝 জবে টিউটর আবেদন (${storeState.applications.length})`, pending: pendingApplications.length },
            { id: 'guardians', label: `👥 অভিভাবক তালিকা (${guardians.length})` },
            { id: 'demos', label: `🎯 ডেমো ক্লাস (${storeState.demos.length})` },
            { id: 'confirmations', label: `📜 টিউশন চুক্তি (${storeState.confirmations.length})` },
            { id: 'chats', label: `💬 লাইভ চ্যাট সুপারভিশন (${storeState.conversations?.length || 0})` },
            { id: 'progress-reports', label: `📊 অগ্রগতি রিপোর্ট (${storeState.progressReports?.length || 0})` },
            { id: 'notices', label: `📢 নোটিশ বোর্ড (${storeState.notices.length})` },
            { id: 'referrals', label: `🎁 রেফারেল (${storeState.referrals.length})` },
            { id: 'messages', label: `✉️ বার্তা ও যোগাযোগ (${storeState.messages.filter(m => m.status === 'unread').length} new)` },
            { id: 'payments', label: `💳 পেমেন্ট ও ফি (${storeState.payments.length})` },
            { id: 'certificates', label: `🎖️ সার্টিফিকেট (${storeState.certificates.length})` },
            { id: 'reviews', label: `⭐ টিউটর রিভিউ (${storeState.reviews.length})` },
            { id: 'activity', label: `📝 অডিট লগ (${storeState.activityLogs.length})` },
            { id: 'admins', label: `⚙️ অ্যাডমিন ব্যবস্থাপনা (${adminUsers.length})` },
            { id: 'settings', label: '🛠️ কেন্দ্রীয় সেটিংস' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.pending !== undefined && tab.pending > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[10px] animate-pulse">
                  {tab.pending} পেন্ডিং
                </span>
              )}
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

                      {/* Automated Notification to matching tutors (Requirement 3) */}
                      {job.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => {
                            store.notifyMatchingTutorsForJob(job);
                            const matchingCount = storeState.tutors.filter(t => 
                              (t.preferredAreas && t.preferredAreas.some(a => a.toLowerCase().includes((job.area || '').toLowerCase()))) ||
                              (t.district && job.district && t.district.toLowerCase() === job.district.toLowerCase())
                            ).length;
                            showAdminToast(`✓ "${job.area || job.district}" এলাকার ${matchingCount} জন পছন্দের টিউটরের কাছে নোটিফিকেশন পাঠানো হয়েছে।`);
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 rounded-lg font-semibold flex items-center gap-1 cursor-pointer text-xs"
                          title="এই এলাকার পছন্দের টিউটরদের স্বয়ংক্রিয় নোটিফিকেশন পাঠান"
                        >
                          <Bell className="w-3.5 h-3.5 text-amber-700" />
                          <span>Notify</span>
                        </button>
                      )}

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

                      {/* Delete Job Circular */}
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmItem({
                            type: 'job',
                            id: job.id,
                            label: `টিউশন সার্কুলার (${job.id}: ${job.title})`
                          });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer border border-transparent hover:border-rose-200 transition"
                        title="Delete Job Circular (সার্কুলার মুছে ফেলুন)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        {/* TUTORS MANAGEMENT & KYC VERIFICATION AUDIT               */}
        {/* ========================================================= */}
        {activeTab === 'tutors' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>টিউটর ভেরিফিকেশন ও KYC ডকুমেন্ট অডিট (Tutor Verification)</span>
                </h3>
                <p className="text-slate-500">
                  জাতীয় পরিচয়পত্র (NID), বিশ্ববিদ্যালয় আইডি ও সনদপত্র যাচাই করে গোল্ডেন ট্রাস্ট ব্যাজ অনুমোদন করুন।
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTutorVerificationFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    tutorVerificationFilter === 'all'
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সব ({storeState.tutors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTutorVerificationFilter('pending')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                    tutorVerificationFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-800 hover:text-amber-950'
                  }`}
                >
                  <span>অপেক্ষমাণ KYC ও নতুন সিভি</span>
                  <span className="bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px]">
                    {pendingTutors.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setTutorVerificationFilter('verified')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    tutorVerificationFilter === 'verified'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  ভেরিফাইড ({storeState.tutors.filter(t => t.verificationStatus === 'verified').length})
                </button>
                <button
                  type="button"
                  onClick={() => setTutorVerificationFilter('rejected')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                    tutorVerificationFilter === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:text-rose-900'
                  }`}
                >
                  রিজেক্টেড ({storeState.tutors.filter(t => t.verificationStatus === 'rejected').length})
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {storeState.tutors
                .filter(tut => {
                  if (tutorVerificationFilter === 'all') return true;
                  if (tutorVerificationFilter === 'pending') {
                    return tut.verificationStatus === 'pending' || tut.verificationStatus === 'draft';
                  }
                  return tut.verificationStatus === tutorVerificationFilter;
                })
                .map((tutor) => (
                <div key={tutor.id} className="py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-blue-950">{tutor.fullName}</span>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{tutor.id}</span>
                      
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tutor.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        tutor.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        tutor.verificationStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tutor.verificationStatus === 'pending' ? '⏳ KYC অপেক্ষমাণ' : tutor.verificationStatus}
                      </span>

                      {/* Trust Score badge if verified */}
                      {tutor.verificationStatus === 'verified' && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          🏆 {tutor.trustScore || 100}% Trust Score
                        </span>
                      )}

                      {/* Category Badge */}
                      {tutor.tutorCategory === 'qawmi_madrasa' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          📖 কওমি মাদ্রাসা {tutor.madrasaDetails?.highestSanadOrDegree ? `(${tutor.madrasaDetails.highestSanadOrDegree})` : ''}
                        </span>
                      ) : tutor.tutorCategory === 'alia_madrasa' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          🕌 আলিয়া মাদ্রাসা {tutor.madrasaDetails?.highestSanadOrDegree ? `(${tutor.madrasaDetails.highestSanadOrDegree})` : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                          🎓 জেনারেল টিউটর
                        </span>
                      )}

                      {tutor.madrasaDetails?.isHafiz && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200">
                          ✨ হাফেজ-এ-কুরআন
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700">
                      <strong>{tutor.university}</strong> ({tutor.department}) · {tutor.phone} · {tutor.email}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <strong>NID:</strong> {tutor.nidNumber || 'তথ্য নেই'} · <strong>ঠিকানা:</strong> {tutor.currentAddress || tutor.area} · <strong>জেলা:</strong> {tutor.district} · পারিশ্রমিক: {settings.defaultCurrency}{tutor.expectedSalary}
                    </p>

                    {/* Preferred Tutoring Areas & Customise Tags (Requirement 2 & 3) */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[11px]">
                      <span className="text-slate-600 font-semibold">কোন কোন এলাকায় টিউশন করতে চান:</span>
                      {tutor.preferredAreas && tutor.preferredAreas.length > 0 ? (
                        tutor.preferredAreas.map(a => (
                          <span key={a} className="bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded font-medium text-[10px]">
                            📍 {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">কোনো এলাকা নির্ধারিত নেই</span>
                      )}
                    </div>

                    {/* KYC Document preview tags */}
                    <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tutor.nidFrontPhoto ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {tutor.nidFrontPhoto ? '✓ NID আপলোডকৃত' : '✗ NID নেই'}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tutor.studentIdCardPhoto ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {tutor.studentIdCardPhoto ? '✓ স্টুডেন্ট আইডি আপলোডকৃত' : '✗ স্টুডেন্ট আইডি নেই'}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tutor.certificatePhoto ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {tutor.certificatePhoto ? '✓ সনদপত্র আপলোডকৃত' : '✗ সনদপত্র নেই'}
                      </span>
                    </div>

                    {tutor.rejectionReason && (
                      <p className="text-[11px] text-rose-600 font-medium">Rejection Note: {tutor.rejectionReason}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {/* Primary Button: Review KYC Docs */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedKycTutor(tutor);
                        setKycReviewModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>রিভিউ KYC ডকুমেন্টস</span>
                    </button>

                    {tutor.verificationStatus !== 'verified' && (
                      <button
                        type="button"
                        onClick={() => {
                          store.setTutorVerificationStatus(tutor.id, 'verified');
                          showAdminToast(`✓ টিউটর ${tutor.fullName}-এর আবেদন অনুমোদিত ও প্রোফাইল ভেরিফাই করা হয়েছে।`);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>✓ অনুমোদন ও ভেরিফাই</span>
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
                        রিজেক্ট
                      </button>
                    )}

                    {tutor.verificationStatus === 'verified' && (
                      <button
                        type="button"
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'suspended')}
                        className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg font-semibold cursor-pointer"
                      >
                        স্থগিত
                      </button>
                    )}

                    {tutor.verificationStatus === 'suspended' && (
                      <button
                        type="button"
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'verified')}
                        className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        পুনর্বহাল
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigateTo('tutor-detail', { tutorId: tutor.id })}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-900" />
                      <span>সিভি</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* GUARDIAN REQUESTS & TUTOR CV APPLICATIONS APPROVALS        */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            {/* Header & Subtabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-blue-950 flex items-center gap-2">
                  <span>অভিভাবক রিকোয়েস্ট ও টিউটর আবেদন কন্ট্রোল সেন্টার</span>
                  {totalPending > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black animate-pulse">
                      {totalPending} টি নতুন অপেক্ষমাণ
                    </span>
                  )}
                </h3>
                <p className="text-slate-500 text-xs">
                  অভিভাবকের টিউশন চাহিদা এবং টিউটরদের পূরণকৃত সিভি যাচাই করে সরাসরি ওয়েবসাইটে লাইভ অনুমোদন করুন।
                </p>
              </div>

              {/* Sub-view switcher: Guardian Requests vs Tutor CVs */}
              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setRequestSubView('requests')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shadow-xs ${
                    requestSubView === 'requests'
                      ? 'bg-blue-950 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>📋 অভিভাবক রিকোয়েস্ট ({storeState.requests.length})</span>
                  {pendingRequests.length > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {pendingRequests.length} নতুন
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRequestSubView('tutors')}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shadow-xs ${
                    requestSubView === 'tutors'
                      ? 'bg-blue-950 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>🎓 টিউটর সিভি আবেদন ({storeState.tutors.length})</span>
                  {pendingTutors.length > 0 && (
                    <span className="bg-emerald-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                      {pendingTutors.length} নতুন
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await store.syncWithServer();
                    showAdminToast('✓ সার্ভার থেকে সর্বশেষ রিকোয়েস্ট ও আবেদনসমূহ সিঙ্ক করা হয়েছে।');
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition"
                  title="সার্ভার থেকে রিলোড / সিঙ্ক করুন"
                >
                  <RefreshCw className="w-4 h-4 text-blue-900" />
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: GUARDIAN TUITION REQUESTS */}
            {requestSubView === 'requests' && (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="অভিভাবকের নাম, ফোন, শ্রেণি, বিষয় বা এলাকা দিয়ে খুঁজুন..."
                      value={requestSearch}
                      onChange={e => setRequestSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  {/* Status filter tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
                    {[
                      { id: 'all', label: `সব (${storeState.requests.length})` },
                      { id: 'pending', label: `⏳ অনুমোদনের অপেক্ষায় (${pendingRequests.length})` },
                      { id: 'converted_to_job', label: `✓ অনুমোদিত ও লাইভ (${storeState.requests.filter(r => r.status === 'converted_to_job').length})` },
                      { id: 'rejected', label: `✗ বাতিল (${storeState.requests.filter(r => r.status === 'rejected').length})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setRequestStatusFilter(f.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer whitespace-nowrap ${
                          requestStatusFilter === f.id
                            ? 'bg-white text-blue-950 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Request List */}
                <div className="space-y-3.5">
                  {storeState.requests
                    .filter(req => {
                      if (requestStatusFilter !== 'all' && req.status !== requestStatusFilter) {
                        return false;
                      }
                      if (!requestSearch) return true;
                      const q = requestSearch.toLowerCase();
                      return (
                        req.id.toLowerCase().includes(q) ||
                        req.guardianName.toLowerCase().includes(q) ||
                        req.phone.includes(q) ||
                        req.studentClass.toLowerCase().includes(q) ||
                        req.area.toLowerCase().includes(q) ||
                        (req.customRequirements && req.customRequirements.toLowerCase().includes(q)) ||
                        req.subjects.some(s => s.toLowerCase().includes(q))
                      );
                    })
                    .map((req) => (
                    <div 
                      key={req.id} 
                      className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                        req.status === 'pending'
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs ring-1 ring-amber-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        {/* Header Badges & Request Submission Age */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-blue-950 bg-blue-100/70 px-2 py-0.5 rounded-lg border border-blue-200">
                            {req.id}
                          </span>
                          
                          <span className="font-bold text-slate-900 text-sm">
                            {req.guardianName}
                          </span>

                          {/* Elapsed Time Badge (Requirement: এতদিন আগে গার্ডিয়ান রিকোয়েস্ট করেছেন) */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold">
                            <Clock className="w-3.5 h-3.5 text-blue-700" />
                            <span>{formatRequestAge(req.createdAt)}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            req.status === 'converted_to_job' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            req.status === 'pending' ? 'bg-amber-200 text-amber-950 font-black animate-pulse border border-amber-300' :
                            req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {req.status === 'pending' ? '⏳ অনুমোদনের অপেক্ষায়' : req.status === 'converted_to_job' ? '✓ অনুমোদিত ও লাইভ জব' : req.status}
                          </span>
                        </div>

                        {/* Guardian Phone & Direct Contact Links */}
                        <div className="flex items-center gap-3 text-slate-600 flex-wrap">
                          <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {req.phone}
                          </span>
                          <a
                            href={`tel:${req.phone}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-[11px]"
                          >
                            <span>📞 কল করুন</span>
                          </a>
                          <a
                            href={`https://wa.me/88${req.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 font-semibold text-[11px]"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        </div>

                        {/* Tuition Details */}
                        <p className="text-slate-800 text-xs">
                          <strong>শ্রেণি ও কারিকুলাম:</strong> {req.studentClass} ({req.medium}) · <strong>এলাকা:</strong> {req.area}, {req.location}
                        </p>
                        <p className="text-slate-700 text-xs">
                          <strong>বিষয়সমূহ:</strong> {req.subjects.join(', ')} · <strong>শিডিউল:</strong> সপ্তাহে {req.daysPerWeek} দিন ({req.preferredTime})
                        </p>
                        <p className="text-blue-950 font-bold text-xs">
                          অভিভাবকের অফারকৃত বাজেট: {settings.defaultCurrency}{req.monthlyBudget.toLocaleString()}/মাস
                        </p>

                        {/* Customise requirements */}
                        {req.customRequirements && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/70 border border-amber-300 rounded-xl text-amber-950 font-medium text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>কাস্টমাইজ চাহিদা: <strong>{req.customRequirements}</strong></span>
                          </div>
                        )}

                        {req.additionalRequirements && (
                          <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                            "{req.additionalRequirements}"
                          </p>
                        )}
                      </div>

                      {/* Actions: Direct One-Click Approval */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap lg:flex-col lg:items-end">
                        {req.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              store.convertRequestToJob(req.id);
                              showAdminToast(`✓ অভিভাবক রিকোয়েস্ট [${req.id}] সফলভাবে অনুমোদন ও লাইভ জবে প্রকাশিত হয়েছে!`);
                            }}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md text-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>✓ অনুমোদন ও লাইভ সার্কুলার প্রকাশ</span>
                          </button>
                        )}

                        <div className="flex items-center gap-1.5">
                          {/* Edit Request Button */}
                          <button
                            type="button"
                            onClick={() => openEditRequestModal(req)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs text-xs"
                            title="Edit Request"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-900" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Request Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem({
                              type: 'request',
                              id: req.id,
                              label: `অভিভাবক ${req.guardianName}-এর রিকোয়েস্ট (${req.id}: ${req.studentClass})`
                            })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer border border-transparent hover:border-rose-200 transition"
                            title="Delete Request (মুছে ফেলুন)"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {storeState.requests.length === 0 && (
                    <div className="py-12 text-center text-slate-500 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-700 text-sm">বর্তমানে কোনো অভিভাবক রিকোয়েস্ট নেই</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        অভিভাবকরা ওয়েবসাইটে নতুন টিউশন রিকোয়েস্ট পাঠালে সাথে সাথে এখানে প্রদর্শিত হবে এবং আপনি অনুমোদন করতে পারবেন।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: TUTOR CV APPLICATIONS */}
            {requestSubView === 'tutors' && (
              <div className="space-y-4">
                {/* Status filter tabs for Tutors */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTutorVerificationFilter('all')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                        tutorVerificationFilter === 'all'
                          ? 'bg-white text-blue-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      সব সিভি ({storeState.tutors.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTutorVerificationFilter('pending')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                        tutorVerificationFilter === 'pending'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-amber-800 hover:text-amber-950'
                      }`}
                    >
                      <span>অপেক্ষমাণ অনুমোদন</span>
                      <span className="bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                        {pendingTutors.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTutorVerificationFilter('verified')}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                        tutorVerificationFilter === 'verified'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-emerald-700 hover:text-emerald-900'
                      }`}
                    >
                      ভেরিফাইড ({storeState.tutors.filter(t => t.verificationStatus === 'verified').length})
                    </button>
                  </div>
                </div>

                {/* Tutors CV Cards List */}
                <div className="space-y-3.5">
                  {storeState.tutors
                    .filter(tut => {
                      if (tutorVerificationFilter === 'all') return true;
                      if (tutorVerificationFilter === 'pending') {
                        return tut.verificationStatus === 'pending' || tut.verificationStatus === 'draft';
                      }
                      return tut.verificationStatus === tutorVerificationFilter;
                    })
                    .map((tutor) => (
                    <div 
                      key={tutor.id} 
                      className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                        tutor.verificationStatus === 'pending' || tutor.verificationStatus === 'draft'
                          ? 'bg-blue-50/40 border-blue-300 shadow-xs ring-1 ring-blue-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-blue-950">{tutor.fullName}</span>
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{tutor.id}</span>

                          {/* Submission Age Indicator */}
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-900 text-[11px] font-bold border border-blue-200">
                            <Clock className="w-3.5 h-3.5 text-blue-700" />
                            <span>{formatRequestAge(tutor.createdAt || tutor.verificationSubmittedDate)}</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tutor.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                            tutor.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-900 font-black animate-pulse' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {tutor.verificationStatus === 'verified' ? '✓ ভেরিফাইড' : '⏳ সিভি অনুমোদন অপেক্ষমাণ'}
                          </span>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                            সিভি সম্পন্ন: {tutor.completionPercentage || 60}%
                          </span>
                        </div>

                        {/* Phone & Direct Contact Links */}
                        <div className="flex items-center gap-3 text-slate-600 flex-wrap">
                          <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {tutor.phone}
                          </span>
                          <a
                            href={`tel:${tutor.phone}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-[11px]"
                          >
                            <span>📞 কল করুন</span>
                          </a>
                          <a
                            href={`https://wa.me/88${tutor.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 font-semibold text-[11px]"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        </div>

                        <p className="text-slate-800 text-xs">
                          <strong>শিক্ষা প্রতিষ্ঠান:</strong> {tutor.university || tutor.institution || 'বিশ্ববিদ্যালয়/মাদ্রাসা'} ({tutor.department || 'বিভাগ'}) · <strong>বর্তমান জেলা/এলাকা:</strong> {tutor.district || tutor.area}
                        </p>
                        <p className="text-slate-700 text-xs">
                          <strong>পছন্দের বিষয়:</strong> {tutor.preferredSubjects?.join(', ') || 'সব বিষয়'} · <strong>প্রত্যাশিত পারিশ্রমিক:</strong> {settings.defaultCurrency}{tutor.expectedSalary}/মাস
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                          <span className="text-slate-500 font-semibold">পছন্দের এলাকা:</span>
                          {tutor.preferredAreas && tutor.preferredAreas.length > 0 ? (
                            tutor.preferredAreas.map(a => (
                              <span key={a} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                📍 {a}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">সারাদেশ / এলাকা উন্মুক্ত</span>
                          )}
                        </div>
                      </div>

                      {/* Approval Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap lg:flex-col lg:items-end">
                        {tutor.verificationStatus !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => {
                              store.setTutorVerificationStatus(tutor.id, 'verified');
                              showAdminToast(`✓ টিউটর ${tutor.fullName}-এর আবেদন অনুমোদিত ও প্রোফাইল ভেরিফাই করা হয়েছে!`);
                            }}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition shadow-md text-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>✓ সিভি অনুমোদন ও প্রোফাইল ভেরিফাই</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKycTutor(tutor);
                            setKycReviewModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs text-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                          <span>সম্পূর্ণ সিভি ও ডকুমেন্ট রিভিউ</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {storeState.tutors.length === 0 && (
                    <div className="py-12 text-center text-slate-500 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-700 text-sm">বর্তমানে কোনো টিউটর সিভি নেই</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        নতুন টিউটর নিবন্ধন করে সিভি পূরণ করলে এখানে তালিকাভুক্ত হবে এবং আপনি অনুমোদন করতে পারবেন।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* APPLICATIONS MANAGEMENT                                   */}
        {/* ========================================================= */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">
                  Tutor Job Applications ({storeState.applications.length})
                </h3>
                <p className="text-slate-500">
                  টিউশন জবে আবেদনকারী টিউটরদের আবেদনপত্র পর্যালোচনা, এডিট ও ডিলিট করুন।
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                  Total Applications: {storeState.applications.length}
                </span>
                {storeState.applications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('আপনি কি সমস্ত আবেদনপত্র খালি করতে চান?')) {
                        store.clearAllRequestsAndApplications();
                        showAdminToast('✓ সমস্ত আবেদনপত্র সফলভাবে মুছে ফেলা হয়েছে।');
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-full font-semibold cursor-pointer transition"
                  >
                    সকল আবেদন মুছুন
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {storeState.applications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{app.jobId}</span>
                        <span>Applicant: <strong className="text-slate-900 text-sm">{app.tutorName}</strong></span>
                        <span className="text-slate-500">({app.tutorUniversity})</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Phone: {app.tutorPhone} · Expected: <strong className="text-blue-950">{settings.defaultCurrency}{app.expectedSalary}/mo</strong> · Applied: {app.appliedDate}
                      </p>
                    </div>

                    {/* Actions Toolbar - Requirement 1: Edit & Delete */}
                    <div className="flex items-center gap-2 flex-wrap">
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
                        className="px-3 py-1 bg-blue-900 text-white rounded-lg font-semibold text-[11px] cursor-pointer hover:bg-blue-800"
                      >
                        Schedule Demo
                      </button>

                      {/* Edit Application Button (Requirement 1) */}
                      <button
                        type="button"
                        onClick={() => openEditAppModal(app)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg font-semibold text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Edit Application (আবেদনপত্র এডিট)"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-900" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Application Button (Requirement 1) */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmItem({
                          type: 'application',
                          id: app.id,
                          label: `টিউটর ${app.tutorName}-এর আবেদনপত্র (${app.id} for ${app.jobId})`
                        })}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer border border-transparent hover:border-rose-200 transition"
                        title="Delete Application (আবেদনপত্র মুছে ফেলুন)"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>

                  {app.adminNote && (
                    <p className="text-[11px] text-blue-950 bg-blue-50 border border-blue-200 p-2 rounded-lg">
                      <strong>Admin Internal Note:</strong> {app.adminNote}
                    </p>
                  )}

                  <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                    "{app.coverNote}"
                  </p>
                </div>
              ))}

              {storeState.applications.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700">বর্তমানে কোনো চাকরির আবেদন নেই</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    সকল ডেমো আবেদন মুছে নতুন কার্যক্রমের জন্য প্রস্তুত করা হয়েছে। লাইভ জবে শিক্ষকরা আবেদন করলে এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 4: DEMO CLASSES & TRIAL CONTROL CENTER            */}
        {/* ========================================================= */}
        {activeTab === 'demos' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            
            {/* Inline Toast Banner */}
            {adminDemoToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{adminDemoToast}</span>
              </div>
            )}

            {/* Header with Title and Metrics */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">
                    ট্রায়াল কন্ট্রোল
                  </span>
                  <span className="text-slate-400 font-medium">({storeState.demos.length} টি ডেমো সেশন)</span>
                </div>
                <h3 className="font-bold text-base text-blue-950 mt-1">
                  ফ্রি ডেমো ক্লাস ও ট্রায়াল মনিটরিং কেন্দ্র (Demo Control Center)
                </h3>
                <p className="text-[11px] text-slate-500">
                  অভিভাবক ও শিক্ষকদের মধ্যে ট্রায়াল ক্লাসের শিডিউল, অনলাইন মিটিং লিংক, ফলাফল এবং সফল নিয়োগ তদারকি করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন ডেমো শিডিউল</span>
                </button>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">মোট ডেমো</span>
                <span className="font-bold text-slate-900 text-base tabular-nums">{storeState.demos.length}</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-center">
                <span className="text-[10px] text-blue-700 block">আসন্ন শিডিউল</span>
                <span className="font-bold text-blue-950 text-base tabular-nums">
                  {storeState.demos.filter(d => d.status === 'scheduled').length}
                </span>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 block">টিউশন চূড়ান্ত</span>
                <span className="font-bold text-emerald-950 text-base tabular-nums">
                  {storeState.demos.filter(d => d.result === 'selected' || d.status === 'completed').length}
                </span>
              </div>
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-center">
                <span className="text-[10px] text-indigo-700 block">অনলাইন Meet</span>
                <span className="font-bold text-indigo-950 text-base tabular-nums">
                  {storeState.demos.filter(d => d.mode === 'online').length}
                </span>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-amber-700 block">হোম টিউশন</span>
                <span className="font-bold text-amber-950 text-base tabular-nums">
                  {storeState.demos.filter(d => d.mode === 'home').length}
                </span>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminDemoSearchQuery}
                  onChange={(e) => setAdminDemoSearchQuery(e.target.value)}
                  placeholder="শিক্ষক, অভিভাবক, বিষয় বা শিক্ষার্থী অনুসন্ধান..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdminDemoFilterStatus('all')}
                  className={`py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                    adminDemoFilterStatus === 'all' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  সব ({storeState.demos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDemoFilterStatus('scheduled')}
                  className={`py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                    adminDemoFilterStatus === 'scheduled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  আসন্ন ({storeState.demos.filter(d => d.status === 'scheduled').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDemoFilterStatus('completed')}
                  className={`py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                    adminDemoFilterStatus === 'completed' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  কনফার্মড ({storeState.demos.filter(d => d.result === 'selected' || d.status === 'completed').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDemoFilterStatus('cancelled')}
                  className={`py-1.5 px-3 rounded-lg font-bold text-center cursor-pointer transition-colors ${
                    adminDemoFilterStatus === 'cancelled' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  বাতিল / স্থগিত
                </button>
              </div>
            </div>

            {/* Demos List */}
            {(() => {
              const query = adminDemoSearchQuery.trim().toLowerCase();
              const filtered = storeState.demos.filter((demo) => {
                const matchesStatus =
                  adminDemoFilterStatus === 'all' ||
                  (adminDemoFilterStatus === 'scheduled' && demo.status === 'scheduled') ||
                  (adminDemoFilterStatus === 'completed' && (demo.status === 'completed' || demo.result === 'selected')) ||
                  (adminDemoFilterStatus === 'cancelled' && (demo.status === 'cancelled' || demo.status === 'rescheduled'));

                const matchesQuery =
                  !query ||
                  demo.tutorName.toLowerCase().includes(query) ||
                  demo.guardianName.toLowerCase().includes(query) ||
                  (demo.subject && demo.subject.toLowerCase().includes(query)) ||
                  (demo.studentName && demo.studentName.toLowerCase().includes(query)) ||
                  demo.id.toLowerCase().includes(query);

                return matchesStatus && matchesQuery;
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-12 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-slate-600 font-medium">কোনো ডেমো সেশন পাওয়া যায়নি।</p>
                    <p className="text-[11px] text-slate-400">ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((demo) => {
                    const isOnline = demo.mode === 'online';
                    const isConfirmed = demo.result === 'selected' || demo.status === 'completed';

                    return (
                      <div
                        key={demo.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isConfirmed
                            ? 'bg-emerald-50/30 border-emerald-300'
                            : demo.status === 'scheduled'
                            ? 'bg-white border-blue-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                                {demo.id}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm">{demo.jobTitle}</h4>
                              <span className="text-slate-400">•</span>
                              <span className="text-blue-900 font-semibold">{demo.subject || 'সাধারণ বিষয়'}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              শিক্ষার্থী: <strong>{demo.studentName || 'শিক্ষার্থী'}</strong> ({demo.studentGrade || 'Class'})
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 ${
                              isOnline ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {isOnline ? <Laptop className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                              <span>{isOnline ? 'Online Meet' : 'Home Visit'}</span>
                            </span>

                            <span className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                              demo.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : demo.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-900'
                                : demo.status === 'rescheduled'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {demo.status}
                            </span>

                            {demo.result && (
                              <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                                demo.result === 'selected'
                                  ? 'bg-emerald-600 text-white'
                                  : demo.result === 'further_review'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {demo.result === 'selected' ? '✓ Selected' : demo.result}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-3 text-xs">
                          {/* Tutor Card */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium">শিক্ষক (Tutor)</span>
                            <p className="font-bold text-slate-900">{demo.tutorName}</p>
                            <p className="text-[11px] text-slate-600">{demo.tutorPhone} • {demo.tutorUniversity || 'Verified'}</p>
                          </div>

                          {/* Guardian Card */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[10px] text-slate-500 block font-medium">অভিভাবক (Guardian)</span>
                            <p className="font-bold text-slate-900">{demo.guardianName}</p>
                            <p className="text-[11px] text-slate-600">{demo.guardianPhone}</p>
                          </div>

                          {/* Date, Time & Meeting */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1 sm:col-span-2 md:col-span-1">
                            <span className="text-[10px] text-slate-500 block font-medium">শিডিউল ও সেশন লিঙ্ক</span>
                            <p className="font-bold text-blue-900">{demo.date} at {demo.time}</p>
                            {isOnline ? (
                              <a
                                href={demo.meetingLink || 'https://meet.google.com'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-indigo-700 font-bold hover:underline"
                              >
                                <Video className="w-3 h-3" />
                                <span>{demo.meetingLink || 'Google Meet'}</span>
                              </a>
                            ) : (
                              <p className="text-[11px] text-slate-600">{demo.location || 'অভিভাবকের বাসা'}</p>
                            )}
                          </div>
                        </div>

                        {/* Notes & Feedback Logs */}
                        {(demo.notes || demo.tutorFeedback || demo.guardianFeedback) && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                            {demo.notes && (
                              <p className="text-slate-600"><strong className="text-slate-800">নোট:</strong> "{demo.notes}"</p>
                            )}
                            {demo.tutorFeedback && (
                              <p className="text-blue-950 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                                <strong>শিক্ষকের মূল্যায়ন:</strong> {demo.tutorFeedback}
                              </p>
                            )}
                            {demo.guardianFeedback && (
                              <p className="text-emerald-950 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                                <strong>অভিভাবকের মন্তব্য:</strong> {demo.guardianFeedback}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Selected & Confirm Tuition */}
                            <button
                              type="button"
                              onClick={() => {
                                setAdminSelectedDemoForConfirm(demo);
                                setAdminAgreedSalary(7500);
                                setAdminAgreedDays(4);
                                setAdminStartDateInput(new Date().toISOString().split('T')[0]);
                                setAdminInstructionsInput('নিয়মিত মডেল টেস্ট ও অগ্রগতি রিপোর্ট');
                                setAdminConfirmModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>{demo.result === 'selected' ? 'চুক্তি আপডেট' : '✓ Selected & Confirm Tuition'}</span>
                            </button>

                            {/* Reschedule Demo */}
                            {demo.status === 'scheduled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminSelectedDemoForReschedule(demo);
                                  setAdminNewRescheduleDate(demo.date);
                                  setAdminNewRescheduleTime(demo.time);
                                  setAdminRescheduleReason('');
                                  setAdminRescheduleModalOpen(true);
                                }}
                                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
                                <span>রি-শিডিউল</span>
                              </button>
                            )}

                            {/* Mark Not Selected */}
                            {demo.result !== 'not_selected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  store.updateDemoResult(demo.id, 'not_selected', 'অ্যাডমিন কর্তৃক নট সিলেক্টেড চিহ্নিত');
                                  setAdminDemoToast('ডেমো ক্লাসের স্ট্যাটাস Not Selected হিসেবে আপডেট হয়েছে।');
                                  setTimeout(() => setAdminDemoToast(null), 3000);
                                }}
                                className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-semibold transition-colors cursor-pointer"
                              >
                                Not Selected
                              </button>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400">
                            জব আইডি: {demo.jobId}
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
        {/* TUITION CONFIRMATIONS                                     */}
        {/* ========================================================= */}
        {activeTab === 'confirmations' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">
                  নিশ্চিত টিউশন চুক্তি ও স্লিপ ({storeState.confirmations.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  অভিভাবক ও টিউটরের চূড়ান্ত চুক্তিপত্র, সময়সূচি এবং মাসিক পারিশ্রমিক রেকর্ড
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {storeState.confirmations.map((conf) => (
                <div key={conf.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[10px]">
                        {conf.agreementNumber || conf.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{conf.jobTitle}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        conf.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {conf.status}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      শিক্ষক: <strong className="text-blue-950">{conf.tutorName}</strong> · অভিভাবক: <strong>{conf.guardianName}</strong> · শিক্ষার্থী: {conf.studentName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      মাসিক বেতন: <strong className="text-emerald-700">{settings.defaultCurrency}{conf.monthlyFee.toLocaleString()}</strong> · শিডিউল: {conf.scheduleTime || 'বিকেল ৫:০০'} ({conf.daysPerWeek} দিন/সপ্তাহ)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedConfForAgreement(conf);
                        setAgreementModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>চুক্তিপত্র স্লিপ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 6: LIVE CHAT SUPERVISION & MESSAGING HUB          */}
        {/* ========================================================= */}
        {activeTab === 'chats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                    <span>ইন-অ্যাপ লাইভ চ্যাট সুপারভিশন ও অডিট</span>
                  </div>
                  <h3 className="font-extrabold text-base text-blue-950">
                    প্ল্যাটফর্ম লাইভ চ্যাট মনিটরিং ও মেসেজিং হাব (Direct Chat Hub)
                  </h3>
                  <p className="text-slate-500">
                    অভিভাবক ও শিক্ষকদের মধ্যে আদান-প্রদানকৃত বার্তা ও টিউশন আলোচনা রিয়েল-টাইমে পর্যবেক্ষণ ও মডারেশন করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                    মোট থ্রেড: {store.getAllConversations().length}
                  </span>
                </div>
              </div>

              {/* Chat Hub Section in Admin Mode */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <ChatHubSection userRole="admin" currentUserId={currentUser?.id || 'admin_user'} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 6: STUDENT PROGRESS & MONTHLY EVALUATION REPORTS  */}
        {/* ========================================================= */}
        {activeTab === 'progress-reports' && (() => {
          const allReports = store.getAllProgressReports();
          const filteredReports = allReports.filter(report => {
            const matchesGrade = progressGradeFilter === 'all' || report.overallGrade === progressGradeFilter;
            const q = progressSearchQuery.toLowerCase();
            const matchesSearch = !q || 
              report.studentName.toLowerCase().includes(q) ||
              report.tutorName.toLowerCase().includes(q) ||
              report.subject.toLowerCase().includes(q) ||
              report.reportCode.toLowerCase().includes(q);
            return matchesGrade && matchesSearch;
          });

          const totalReports = allReports.length;
          const avgAttendance = totalReports > 0 
            ? Math.round(allReports.reduce((acc, r) => acc + (r.attendanceScore || 0), 0) / totalReports) 
            : 0;
          const avgExam = totalReports > 0 
            ? Math.round(allReports.reduce((acc, r) => acc + (r.examOrQuizScore || 0), 0) / totalReports) 
            : 0;
          const aPlusCount = allReports.filter(r => r.overallGrade === 'A+').length;

          return (
            <div className="space-y-6 text-xs">
              {progressToast && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold flex items-center justify-between">
                  <span>{progressToast}</span>
                  <button type="button" onClick={() => setProgressToast(null)} className="text-emerald-700 cursor-pointer">✕</button>
                </div>
              )}

              {/* Header & Stat Cards */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>শিক্ষার্থী মাসিক একাডেমিক প্রগ্রেস ও ফলাফল রিপোর্ট</span>
                    </div>
                    <h3 className="font-extrabold text-base text-blue-950">
                      শিক্ষার্থী মাসিক মূল্যায়ন ও প্রগ্রেস কার্ড ডাটাবেস
                    </h3>
                    <p className="text-slate-500">
                      শিক্ষকদের দাখিলকৃত মাসিক উপস্থিতি, পড়াশোনায় মনোযোগ, কুইজ/মডেল টেস্ট স্কোর ও একাডেমিক গ্রেডিং বিবরণী।
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                    <span className="text-slate-500 text-[11px] block">মোট রিপোর্ট কার্ড</span>
                    <span className="text-xl font-black text-blue-950">{totalReports} টি</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-slate-500 text-[11px] block">গড় উপস্থিতি হার</span>
                    <span className="text-xl font-black text-emerald-900">{avgAttendance}%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <span className="text-slate-500 text-[11px] block">গড় টেস্ট স্কোর</span>
                    <span className="text-xl font-black text-indigo-900">{avgExam}%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="text-slate-500 text-[11px] block">A+ প্রাপ্ত রিপোর্ট</span>
                    <span className="text-xl font-black text-amber-900">{aPlusCount} টি</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={progressSearchQuery}
                      onChange={(e) => setProgressSearchQuery(e.target.value)}
                      placeholder="শিক্ষার্থী, শিক্ষক, বিষয় বা কোড দিয়ে খুঁজুন..."
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[11px] text-slate-400 font-bold mr-1">গ্রেড ফিল্টার:</span>
                    {(['all', 'A+', 'A', 'B', 'C'] as const).map(grade => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setProgressGradeFilter(grade)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          progressGradeFilter === grade
                            ? 'bg-blue-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {grade === 'all' ? 'সব গ্রেড' : `Grade ${grade}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reports List */}
                {filteredReports.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 space-y-2">
                    <Award className="w-10 h-10 text-slate-300 mx-auto mb-1" />
                    <p className="font-bold text-slate-600">কোনো প্রগ্রেস রিপোর্ট পাওয়া যায়নি</p>
                    <p className="text-[11px]">শিক্ষকরা টিউটর ড্যাশবোর্ড থেকে শিক্ষার্থীদের মাসিক রিপোর্ট দাখিল করবেন।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {filteredReports.map(report => (
                      <div
                        key={report.id}
                        className="p-5 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                {report.reportCode}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">{report.month}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">{report.studentName}</h4>
                            <p className="text-xs text-slate-600">{report.classLevel} • {report.subject}</p>
                          </div>

                          <div className="text-center px-3 py-1.5 bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 font-black text-base rounded-xl shadow-xs shrink-0">
                            <span className="block text-[8px] uppercase tracking-wider font-bold">Grade</span>
                            {report.overallGrade}
                          </div>
                        </div>

                        {/* Performance Grid */}
                        <div className="grid grid-cols-4 gap-2 pt-1 pb-1">
                          <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                            <span className="text-[9px] text-slate-400 block">উপস্থিতি</span>
                            <span className="font-bold text-slate-800 text-xs">{report.attendanceScore}%</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                            <span className="text-[9px] text-slate-400 block">হোমওয়ার্ক</span>
                            <span className="font-bold text-slate-800 text-xs">{report.homeworkCompletionScore}%</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                            <span className="text-[9px] text-slate-400 block">মনোযোগ</span>
                            <span className="font-bold text-slate-800 text-xs">{report.classAttentionScore}%</span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-100 text-center">
                            <span className="text-[9px] text-slate-400 block">পরীক্ষা</span>
                            <span className="font-bold text-blue-900 text-xs">{report.examOrQuizScore}%</span>
                          </div>
                        </div>

                        {/* Tutor and Guardian details */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <div>
                            <span>শিক্ষক: <strong className="text-slate-700">{report.tutorName}</strong></span>
                            {report.tutorUniversity && <span className="text-[10px] block text-slate-400">{report.tutorUniversity}</span>}
                          </div>
                          <div className="text-right">
                            <span>অভিভাবক: <strong className="text-slate-700">{report.guardianName}</strong></span>
                          </div>
                        </div>

                        {report.tutorRemarks && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 line-clamp-2">
                            💬 "{report.tutorRemarks}"
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProgressReportForView(report);
                              setProgressReportModalOpen(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>ভিউ ও প্রিন্ট কার্ড</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              store.deleteProgressReport(report.id);
                              setProgressToast(`রিপোর্ট ${report.reportCode} সফলভাবে মুছে ফেলা হয়েছে!`);
                              setTimeout(() => setProgressToast(null), 3000);
                            }}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="রিপোর্ট মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* PAYMENTS                                                  */}
        {/* ========================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">
                  টিউটর বেতন ও পেমেন্ট রিসিট অডিট ({storeState.payments.length})
                </h3>
                <p className="text-slate-500 text-[11px]">
                  অভিভাবক কর্তৃক পরিশোধিত টিউটর বেতন ও ডিজিটাল মানি রিসিট ভাউচার
                </p>
              </div>
            </div>

            {/* Official Accounts Receiving Card */}
            <div className="p-4 bg-gradient-to-r from-pink-50 via-amber-50 to-emerald-50 rounded-2xl border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-pink-600" />
                  অফিসিয়াল পেমেন্ট গ্রহণ একাউন্টস:
                </span>
                <p className="text-[11px] text-slate-600">
                  বিকাশ (Personal): <strong className="font-mono text-pink-700 font-bold">{settings.paymentAccounts?.bkashNumber || '01610582917'}</strong> · নগদ (Personal): <strong className="font-mono text-amber-700 font-bold">{settings.paymentAccounts?.nagadNumber || '01610582917'}</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  {settings.paymentAccounts?.paymentInstructionsBn || 'বিকাশ অথবা নগদ Send Money অপশন ব্যবহার করে 01610582917 নম্বরে পেমেন্ট করতে হবে।'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(settings.paymentAccounts?.bkashNumber || '01610582917', 'bkash_manage')}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg font-semibold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5 text-pink-600" />
                <span>{copiedField === 'bkash_manage' ? 'কপি হয়েছে!' : '01610582917 কপি করুন'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {storeState.payments.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[10px]">{p.receiptNumber || p.id}</span>
                      <h4 className="font-bold text-slate-900">{p.month} — Tutor: {p.tutorName}</h4>
                    </div>
                    <p className="text-slate-600 mt-1">Guardian: {p.guardianName} · Amount: <strong className="text-emerald-700">{settings.defaultCurrency}{p.amount.toLocaleString()}</strong> · Method: <span className="uppercase font-semibold">{p.method || 'bkash'}</span></p>
                    {p.transactionId && <p className="text-[11px] font-mono text-slate-500">TrxID: {p.transactionId}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPaymentForReceipt(p);
                        setReceiptModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>রিসিট ভাউচার</span>
                    </button>
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
              <div>
                <h3 className="font-bold text-base text-blue-950">অভিজ্ঞতা ও মেন্টরশিপ প্রশংসাপত্র ({storeState.certificates.length})</h3>
                <p className="text-slate-500 text-[11px]">সফল টিউশন সম্পন্নের পর টিউটরদের জন্য অফিসিয়াল ভেরিফাইড সনদ প্রদান ও ট্র্যাকিং</p>
              </div>
              <button
                type="button"
                onClick={() => setIssueCertModalOpen(true)}
                className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>+ নতুন প্রশংসাপত্র ইস্যু</span>
              </button>
            </div>

            <div className="space-y-3">
              {storeState.certificates.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-blue-50/40 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cert.title}</span>
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[10px]">{cert.verificationCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cert.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">শিক্ষক: <strong className="text-blue-950">{cert.tutorName}</strong> · ইস্যু তারিখ: {cert.issueDate}</p>
                    <p className="text-slate-600 text-[11px]">{cert.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCertForView(cert);
                        setCertModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>সনদপত্র দেখুন</span>
                    </button>
                    {cert.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => store.revokeCertificate(cert.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl cursor-pointer"
                      >
                        বাতিল
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => store.updateCertificateStatus(cert.id, 'active')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold rounded-xl cursor-pointer"
                      >
                        পুনর্বহাল
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FEATURE 2: REVIEWS & RATINGS MODERATION CENTER             */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (() => {
          const allReviews = storeState.reviews;
          const pendingReviewsCount = allReviews.filter(r => r.status === 'pending').length;
          const approvedReviewsCount = allReviews.filter(r => r.status === 'approved').length;
          const rejectedReviewsCount = allReviews.filter(r => r.status === 'rejected').length;

          const filteredReviewsList = allReviews.filter(r => {
            if (reviewFilterStatus !== 'all' && r.status !== reviewFilterStatus) return false;
            if (reviewSearchQuery.trim()) {
              const q = reviewSearchQuery.toLowerCase();
              const tutor = store.getTutorById(r.tutorId);
              const tutorName = tutor?.fullName.toLowerCase() || '';
              const guardianName = (r.guardianName || '').toLowerCase();
              const comment = (r.comment || '').toLowerCase();
              const subject = (r.studentGradeOrSubject || '').toLowerCase();
              return tutorName.includes(q) || guardianName.includes(q) || comment.includes(q) || subject.includes(q);
            }
            return true;
          });

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      রেটিং ও রিভিউ নিয়ন্ত্রণ কেন্দ্র
                    </span>
                    <span className="text-slate-400 font-medium">({allReviews.length} টি রিভিউ)</span>
                  </div>
                  <h3 className="font-bold text-lg text-blue-950 mt-1">
                    অভিভাবক রিভিউ ও স্টার রেটিং অডিট (Review Moderation & Trust)
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    টিউটরদের জন্য জমা পড়া প্রতিটি রিভিউ পর্যালোচনা করুন, সত্যতা যাচাই করুন এবং পাবলিক প্রোফাইলে প্রদর্শন নিশ্চিত করুন।
                  </p>
                </div>

                {/* Search Bar */}
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="টিউটর, অভিভাবক বা বিষয় খুঁজুন..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setReviewFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    reviewFilterStatus === 'all'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  সকল রিভিউ ({allReviews.length})
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    reviewFilterStatus === 'pending'
                      ? 'bg-amber-500 text-blue-950 shadow-xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>পেন্ডিং মডারেশন ({pendingReviewsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilterStatus('approved')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    reviewFilterStatus === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>অনুমোদিত ({approvedReviewsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilterStatus('rejected')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    reviewFilterStatus === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <span>বাতিলকৃত ({rejectedReviewsCount})</span>
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviewsList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-500">
                    কোনো রিভিউ পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredReviewsList.map((rev) => {
                    const tutor = store.getTutorById(rev.tutorId);
                    return (
                      <div
                        key={rev.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          rev.status === 'pending'
                            ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                            : rev.status === 'approved'
                            ? 'bg-white border-slate-200'
                            : 'bg-rose-50/30 border-rose-200'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          
                          {/* Info Column */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{rev.guardianName}</span>
                              <span className="text-slate-400">→</span>
                              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                                {tutor ? `${tutor.fullName} (${tutor.institution})` : `টিউটর ID: ${rev.tutorId}`}
                              </span>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                rev.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : rev.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}>
                                {rev.status === 'approved' ? 'অনুমোদিত' : rev.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                              </span>

                              {rev.isVerifiedTuition && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  যাচাইকৃত শিক্ষার্থী
                                </span>
                              )}
                            </div>

                            {rev.studentGradeOrSubject && (
                              <p className="text-[11px] text-slate-500 font-medium">
                                শ্রেণি ও বিষয়: <span className="text-slate-700">{rev.studentGradeOrSubject}</span> • তারিখ: {rev.date}
                              </p>
                            )}

                            {/* Stars & Criteria Breakdown */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                <span className="text-sm">{rev.rating}</span>
                                <span>★</span>
                                <span className="text-[11px] text-amber-800 ml-1">সার্বিক রেটিং</span>
                              </div>

                              {rev.criteria && (
                                <div className="flex flex-wrap gap-1.5 text-[10px]">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                    শিক্ষাদান: {rev.criteria.teachingSkill}★
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                    সময়নিষ্ঠতা: {rev.criteria.punctuality}★
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                    ব্যবহার: {rev.criteria.behavior}★
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                    উন্নতি: {rev.criteria.studentImprovement}★
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Comment */}
                            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 mt-2">
                              <p className="text-slate-700 italic leading-relaxed text-xs">
                                "{rev.comment}"
                              </p>
                            </div>

                            {/* Tutor Reply if present */}
                            {rev.tutorReply && (
                              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-blue-950 text-[11px]">
                                  <span>টিউটরের উত্তর ({rev.tutorReply.tutorName || 'শিক্ষক'}):</span>
                                  <span className="text-blue-600 font-normal">{rev.tutorReply.repliedAt}</span>
                                </div>
                                <p className="text-slate-700 italic">
                                  "{rev.tutorReply.replyText}"
                                </p>
                              </div>
                            )}

                          </div>

                          {/* Action Buttons Column */}
                          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            
                            {rev.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => store.moderateReview(rev.id, 'approved')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>অনুমোদন করুন</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => store.moderateReview(rev.id, 'rejected')}
                                className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 transition-colors cursor-pointer text-xs"
                              >
                                <span>বাতিল করুন</span>
                              </button>
                            )}

                            {/* Toggle Verified Tuition Badge */}
                            <button
                              type="button"
                              onClick={() => store.moderateReview(rev.id, rev.status, !rev.isVerifiedTuition)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                                rev.isVerifiedTuition
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>{rev.isVerifiedTuition ? 'যাচাইকৃত ব্যাজ সরানো' : 'যাচাইকৃত ব্যাজ দিন'}</span>
                            </button>

                            {/* Delete Review */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?')) {
                                  store.deleteReview(rev.id);
                                }
                              }}
                              className="px-3 py-1 text-slate-400 hover:text-rose-600 transition-colors text-[11px] cursor-pointer"
                            >
                              মুছে ফেলুন
                            </button>

                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* AUDIT ACTIVITY LOGS                                       */}
        {/* ========================================================= */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">System Audit Trail & Activity Logs (অ্যাক্টিভিটি হিস্ট্রি ও অডিট লগ)</h3>
                <p className="text-slate-500">Real-time log of administrative actions, user updates, approvals, and system events.</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleDownloadCSV('activityLogs')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Logs (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear audit history? An audit reset log entry will be created.')) {
                      store.clearActivityLogs(currentUser.name);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg font-semibold cursor-pointer transition"
                >
                  Clear History
                </button>
              </div>
            </div>

            {/* Activity Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit logs by action, admin name, details..."
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
              {storeState.activityLogs
                .filter(log => {
                  if (!activitySearch) return true;
                  const q = activitySearch.toLowerCase();
                  return (
                    log.action.toLowerCase().includes(q) ||
                    log.performedBy.toLowerCase().includes(q) ||
                    log.details.toLowerCase().includes(q)
                  );
                })
                .map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 px-2 rounded-lg transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-100">
                        {log.action}
                      </span>
                      <span className="text-slate-800 font-medium">{log.details}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">By: <strong className="text-slate-700">{log.performedBy}</strong></span>
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
        {/* STEP 4: ADMIN MANAGEMENT & TEAM ACCESS                    */}
        {/* ========================================================= */}
        {activeTab === 'admins' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            
            {/* Header & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-900" />
                  <h3 className="font-bold text-base text-blue-950">
                    Admin Management & Access Control (অ্যাডমিন ব্যবস্থাপনা ও রোল নিয়ন্ত্রণ)
                  </h3>
                </div>
                <p className="text-slate-500 mt-1">
                  প্রধান অ্যাডমিন হিসেবে নতুন অ্যাডমিন তৈরি করুন, পদবী ও দায়িত্ব বণ্টন করুন এবং অ্যাক্সেস পরিচালনা করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Google Sheets / CSV Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminActionMsg('');
                    setAdminActionError('');
                    setAdminModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ নতুন অ্যাডমিন তৈরি করুন</span>
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {adminActionMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{adminActionMsg}</span>
              </div>
            )}
            {adminActionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{adminActionError}</span>
              </div>
            )}

            {/* Overview Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] text-slate-500 block">মোট অ্যাডমিন</span>
                <span className="text-xl font-bold text-slate-900">{adminUsers.length} জন</span>
              </div>
              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl">
                <span className="text-[11px] text-purple-700 block">Super Admin</span>
                <span className="text-xl font-bold text-purple-950">
                  {adminUsers.filter(a => (a.adminRoleLevel || 'super_admin') === 'super_admin').length} জন
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-[11px] text-emerald-700 block">Moderators & Managers</span>
                <span className="text-xl font-bold text-emerald-950">
                  {adminUsers.filter(a => a.adminRoleLevel === 'moderator' || a.adminRoleLevel === 'manager').length} জন
                </span>
              </div>
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                <span className="text-[11px] text-blue-700 block">নিরাপত্তা প্রোটেকশন</span>
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1 mt-1">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                  <span>PIN ও ফিঙ্গারপ্রিন্ট সক্রিয়</span>
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="অ্যাডমিনের নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={adminRoleFilter}
                  onChange={e => setAdminRoleFilter(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold capitalize cursor-pointer"
                >
                  <option value="all">সকল পদবী ({adminUsers.length})</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            {/* Admins Table / Cards */}
            <div className="space-y-3">
              {adminUsers
                .filter(admin => {
                  const matchesSearch = !adminSearch || 
                    admin.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                    admin.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
                    admin.phone.includes(adminSearch);
                  const matchesRole = adminRoleFilter === 'all' || (admin.adminRoleLevel || 'super_admin') === adminRoleFilter;
                  return matchesSearch && matchesRole;
                })
                .map((admin) => {
                  const roleLevel = admin.adminRoleLevel || 'super_admin';
                  const isCurrentAdmin = admin.id === currentUser.id;

                  return (
                    <div
                      key={admin.id}
                      className={`p-4 rounded-2xl border transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                        isCurrentAdmin 
                          ? 'bg-blue-50/30 border-blue-200 shadow-xs' 
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 flex-1">
                        {/* Avatar / Crown */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          roleLevel === 'super_admin' ? 'bg-purple-600 text-white shadow-xs' :
                          roleLevel === 'moderator' ? 'bg-emerald-600 text-white shadow-xs' :
                          'bg-amber-600 text-white shadow-xs'
                        }`}>
                          {roleLevel === 'super_admin' ? (
                            <Crown className="w-5 h-5 text-amber-300" />
                          ) : (
                            admin.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{admin.name}</span>
                            {isCurrentAdmin && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                                আপনার অ্যাকাউন্ট (You)
                              </span>
                            )}
                            
                            {/* Role Badge */}
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              roleLevel === 'super_admin' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                              roleLevel === 'moderator' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                              'bg-amber-100 text-amber-900 border-amber-200'
                            }`}>
                              {roleLevel === 'super_admin' ? '👑 Super Admin' :
                               roleLevel === 'moderator' ? '🛡️ Moderator' : '📋 Manager'}
                            </span>

                            {/* Status Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              (admin.status || 'active') === 'active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {(admin.status || 'active') === 'active' ? '● সক্রিয় (Active)' : '● স্থগিত (Suspended)'}
                            </span>
                          </div>

                          <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                            <span>Phone: <strong className="font-mono text-slate-800">{admin.phone}</strong></span>
                            <span>Email: <strong className="text-slate-800">{admin.email}</strong></span>
                            <span>ID: <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border">{admin.id}</code></span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            <span>নিবন্ধন: {admin.createdAt ? admin.createdAt.split('T')[0] : '2026-01-01'}</span>
                            {roleLevel === 'super_admin' && (
                              <span className="ml-2 text-purple-700 font-semibold">• সর্বোচ্চ সিস্টেম ক্ষমতা (সব ফিচার এক্সেস)</span>
                            )}
                            {roleLevel === 'moderator' && (
                              <span className="ml-2 text-emerald-700 font-semibold">• টিউটর ও অভিভাবক অনুমোদন, জব ম্যানেজমেন্ট</span>
                            )}
                            {roleLevel === 'manager' && (
                              <span className="ml-2 text-amber-700 font-semibold">• কন্টেন্ট, নোটিস, রিভিউ ও সাপোর্ট ম্যানেজমেন্ট</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                        {/* Change Role Selector */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] text-slate-400 font-semibold">রোল পরিবর্তন:</label>
                          <select
                            value={roleLevel}
                            disabled={isCurrentAdmin}
                            onChange={(e) => {
                              const newRole = e.target.value as AdminRoleLevel;
                              store.updateAdminRole(admin.id, newRole, currentUser.name);
                              setAdminActionMsg(`✓ ${admin.name}-এর পদবী সফলভাবে ${newRole}-এ পরিবর্তন করা হয়েছে!`);
                              setTimeout(() => setAdminActionMsg(''), 4000);
                            }}
                            className={`p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs cursor-pointer ${
                              isCurrentAdmin ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-400'
                            }`}
                            title={isCurrentAdmin ? "Cannot change own role directly" : "Change Admin Role Level"}
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>

                        {/* Suspend / Reactivate */}
                        {(admin.status || 'active') === 'active' ? (
                          <button
                            type="button"
                            disabled={isCurrentAdmin}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to suspend access for admin ${admin.name}?`)) {
                                store.updateAdminStatus(admin.id, 'suspended', currentUser.name);
                                setAdminActionMsg(`✓ অ্যাডমিন ${admin.name}-এর এক্সেস স্থগিত করা হয়েছে।`);
                                setTimeout(() => setAdminActionMsg(''), 4000);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                              isCurrentAdmin 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 cursor-pointer'
                            }`}
                            title={isCurrentAdmin ? "You cannot suspend your own active account" : "Suspend Admin Access"}
                          >
                            স্থগিত (Suspend)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              store.updateAdminStatus(admin.id, 'active', currentUser.name);
                              setAdminActionMsg(`✓ অ্যাডমিন ${admin.name}-এর এক্সেস পুনরায় সক্রিয় করা হয়েছে!`);
                              setTimeout(() => setAdminActionMsg(''), 4000);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer transition"
                            title="Reactivate Admin Access"
                          >
                            পুনরায় সক্রিয় করুন
                          </button>
                        )}

                        {/* Revoke / Delete Admin */}
                        <button
                          type="button"
                          disabled={isCurrentAdmin || adminUsers.length <= 1}
                          onClick={() => {
                            if (window.confirm(`আপনি কি নিশ্চিতভাবে ${admin.name}-এর অ্যাডমিন অ্যাকাউন্ট ও সমস্ত পারমিশন স্থায়ীভাবে বাতিল (Delete) করতে চান?`)) {
                              const res = store.deleteAdmin(admin.id, currentUser.id, currentUser.name);
                              if (res.success) {
                                setAdminActionMsg(`✓ ${res.message}`);
                              } else {
                                setAdminActionError(res.message);
                              }
                              setTimeout(() => {
                                setAdminActionMsg('');
                                setAdminActionError('');
                              }, 4000);
                            }
                          }}
                          className={`p-1.5 rounded-lg border transition ${
                            isCurrentAdmin || adminUsers.length <= 1
                              ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer'
                          }`}
                          title={isCurrentAdmin ? "Cannot delete own account" : "Delete Admin Account"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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

            {/* Payment Gateway Accounts (bKash & Nagad) Section */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-pink-50/20 rounded-2xl border border-pink-200/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-pink-600" />
                  <h4 className="font-bold text-sm text-slate-900">
                    অফিসিয়াল পেমেন্ট মেথড কনফিগারেশন (Official bKash & Nagad Accounts)
                  </h4>
                </div>
                <span className="text-[11px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                  সক্রিয় গেটওয়ে
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                অভিভাবক ও টিউটরদের ফি বা সিকিউরিটি ডিপোজিট পরিশোধের জন্য এই নম্বরগুলো ব্যবহৃত হবে।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* bKash Configuration */}
                <div className="p-3.5 bg-white rounded-xl border border-pink-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-pink-700 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-pink-600" />
                      বিকাশ নম্বর (bKash Number)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(editBkash, 'bkash')}
                      className="text-[10px] font-semibold text-slate-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'bkash' ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editBkash}
                    onChange={e => setEditBkash(e.target.value)}
                    placeholder="01610582917"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-xs tabular-nums text-slate-900"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>অ্যাকাউন্ট টাইপ:</span>
                    <select
                      value={editBkashType}
                      onChange={e => setEditBkashType(e.target.value as any)}
                      className="p-1 bg-slate-50 border rounded text-[11px] font-medium"
                    >
                      <option value="personal">Personal (ব্যক্তিগত / Send Money)</option>
                      <option value="merchant">Merchant (মার্চেন্ট পেমেন্ট)</option>
                      <option value="agent">Agent (এজেন্ট ক্যাশ আউট)</option>
                    </select>
                  </div>
                </div>

                {/* Nagad Configuration */}
                <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-700 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      নগদ নম্বর (Nagad Number)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(editNagad, 'nagad')}
                      className="text-[10px] font-semibold text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'nagad' ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editNagad}
                    onChange={e => setEditNagad(e.target.value)}
                    placeholder="01610582917"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-xs tabular-nums text-slate-900"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>অ্যাকাউন্ট টাইপ:</span>
                    <select
                      value={editNagadType}
                      onChange={e => setEditNagadType(e.target.value as any)}
                      className="p-1 bg-slate-50 border rounded text-[11px] font-medium"
                    >
                      <option value="personal">Personal (ব্যক্তিগত / Send Money)</option>
                      <option value="merchant">Merchant (মার্চেন্ট পেমেন্ট)</option>
                      <option value="agent">Agent (এজেন্ট ক্যাশ আউট)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  পেমেন্ট নির্দেশনা টেক্সট (বাংলা):
                </label>
                <textarea
                  rows={2}
                  value={editPaymentInstructions}
                  onChange={e => setEditPaymentInstructions(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Admin Security: Strong Password & Fingerprint Passkey Section */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl border border-blue-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">
                    এডমিন প্যানেল নিরাপত্তা ও ফিঙ্গারপ্রিন্ট কন্ট্রোল (Admin Access Security)
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  সুরক্ষিত
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                এডমিন প্যানেলে যেকোনো অনুপ্রবেশ ঠেকাতে স্ট্রং পাসওয়ার্ড এবং ডিভাইস ফিঙ্গারপ্রিন্ট (WebAuthn Passkey) সক্রিয় রয়েছে।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Fingerprint Passkey Enrollment */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h5 className="font-bold text-xs text-white">ফিঙ্গারপ্রিন্ট / বায়োমেট্রিক লগইন</h5>
                      <span className="text-[10px] text-slate-300">
                        {settings.adminSecurity?.biometricPasskeyRegistered ? '✓ ফিঙ্গারপ্রিন্ট ডিভাইস নিবন্ধিত' : 'ফিঙ্গারপ্রিন্ট যুক্ত করুন'}
                      </span>
                    </div>
                  </div>
                  
                  {biometricEnrollMsg && (
                    <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded text-emerald-300 text-[11px] font-semibold">
                      {biometricEnrollMsg}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRegisterBiometricPasskey}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>ফিঙ্গারপ্রিন্ট পাসকি রেজিস্টার করুন</span>
                  </button>
                  <p className="text-[10px] text-slate-400">
                    ল্যাপটপ বা মোবাইলের ফিঙ্গারপ্রিন্ট সেন্সর ব্যবহার করে ১-ক্লিকে লগইন করা যাবে।
                  </p>
                </div>

                {/* Change 4-Digit Security PIN Form */}
                <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <div>
                      <h5 className="font-bold text-xs text-white">৪-ডিজিটের সিকিউরিটি PIN পরিবর্তন</h5>
                      <span className="text-[10px] text-slate-300">ঠিক ৪টি সংখ্যা (0-9) ব্যবহার করুন</span>
                    </div>
                  </div>

                  {pinChangeMsg && (
                    <div className="p-2 bg-emerald-500/20 border border-emerald-400/40 rounded text-emerald-300 text-[11px] font-semibold">
                      {pinChangeMsg}
                    </div>
                  )}
                  {pinChangeError && (
                    <div className="p-2 bg-rose-500/20 border border-rose-400/40 rounded text-rose-300 text-[11px] font-semibold">
                      {pinChangeError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="password"
                      maxLength={4}
                      value={currentPinInput}
                      onChange={e => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="বর্তমান ৪-ডিজিটের পিন (ডিফল্ট: 2026)"
                      className="w-full p-2 bg-white/15 border border-white/20 rounded-lg text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono tracking-widest"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      value={newPinInput}
                      onChange={e => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="নতুন ৪-ডিজিটের পিন (e.g. 5829)"
                      className="w-full p-2 bg-white/15 border border-white/20 rounded-lg text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono tracking-widest"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPinInput}
                      onChange={e => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="নতুন পিন পুনরায় লিখুন"
                      className="w-full p-2 bg-white/15 border border-white/20 rounded-lg text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleChangeAdminPin}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>পিন কোড আপডেট করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

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

      {/* ========================================================= */}
      {/* STEP 4: MODAL: CREATE NEW ADMIN ACCOUNT                   */}
      {/* ========================================================= */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-5 text-xs animate-fade-in shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-900">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-blue-950">নতুন অ্যাডমিন তৈরি করুন</h3>
                  <p className="text-slate-500 text-[11px]">New Administrator Account Creation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminActionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{adminActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-900 block mb-1">পূর্ণ নাম (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ মাহমুদুল হাসান"
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">ইমেইল (Email Address) *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@tutorhat.com"
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">মোবাইল নম্বর (Phone) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={newAdminPhone}
                    onChange={e => setNewAdminPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">অ্যাডমিন পদবী ও রোল (Admin Role Level) *</label>
                <select
                  value={newAdminRoleLevel}
                  onChange={e => setNewAdminRoleLevel(e.target.value as AdminRoleLevel)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs cursor-pointer"
                >
                  <option value="moderator">🛡️ Moderator (ভেরিফিকেশন, জব পোস্টিং ও আবেদন হ্যান্ডলিং)</option>
                  <option value="super_admin">👑 Super Admin (সর্বোচ্চ ক্ষমতা: সেটিংস ও অ্যাডমিন টিম কন্ট্রোল)</option>
                  <option value="manager">📋 Manager (কমিউনিকেশন, ইনকোয়ারি, সাপোর্ট ও নোটিস বোর্ড)</option>
                </select>
                <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-500">
                  {newAdminRoleLevel === 'super_admin' && (
                    <span>• <strong>Super Admin:</strong> প্ল্যাটফর্মের সমস্ত ফিচার, অ্যাডমিন নিয়োগ ও সেটিংস পরিবর্তনের অধিকার পাবে।</span>
                  )}
                  {newAdminRoleLevel === 'moderator' && (
                    <span>• <strong>Moderator:</strong> টিউটর ও গার্ডিয়ান ভেরিফিকেশন, জব পোস্টিং এবং আবেদন শর্টলিস্ট করতে পারবে।</span>
                  )}
                  {newAdminRoleLevel === 'manager' && (
                    <span>• <strong>Manager:</strong> ইউজার মেসেজ, নোটিস বোর্ড ও প্ল্যাটফর্ম রিভিউ পরিচালনা করতে পারবে।</span>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  প্রাথমিক চার অক্ষরের পিন (4-Digit Security PIN) *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  pattern="[0-9]{4}"
                  placeholder="যেমন: ১২৩৪"
                  value={newAdminPin}
                  onChange={e => setNewAdminPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest font-bold text-blue-950"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  নতুন অ্যাডমিন এই ৪টি সংখ্যা দিয়ে লগইন করতে পারবেন। পরবর্তীতে তিনি ফিঙ্গারপ্রিন্ট যুক্ত করতে পারবেন।
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  <span>অ্যাকাউন্ট তৈরি নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GOOGLE SHEETS & CSV DATA EXPORT                    */}
      {/* ========================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-5 text-xs animate-fade-in shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-blue-950">ডেটা এক্সপোর্ট ও Google Sheets ব্যাকআপ</h3>
                  <p className="text-slate-500 text-[11px]">Direct CSV & Google Sheets Integration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {copySheetsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>✓ ডেটা ক্লিপবোর্ডে কপি হয়েছে! Google Sheets-এ গিয়ে Ctrl + V চাপুন।</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-900 block mb-1.5">কোন ডেটাসেট এক্সপোর্ট করতে চান?</label>
                <select
                  value={exportCategory}
                  onChange={e => setExportCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs cursor-pointer"
                >
                  <option value="all">📁 সম্পূর্ণ প্ল্যাটফর্ম ডেটাসেট (All Data Combined)</option>
                  <option value="jobs">💼 Tuition Jobs Circulars ({storeState.jobs.length} items)</option>
                  <option value="tutors">🎓 Registered Tutors ({storeState.tutors.length} items)</option>
                  <option value="guardians">👥 Guardians Directory ({guardians.length} items)</option>
                  <option value="requests">📝 Tuition Requests ({storeState.requests.length} items)</option>
                  <option value="applications">📨 Job Applications ({storeState.applications.length} items)</option>
                  <option value="activityLogs">🛡️ System Audit Trail Logs ({storeState.activityLogs.length} items)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {/* 1. Download CSV with UTF-8 BOM */}
                <button
                  type="button"
                  onClick={() => handleDownloadCSV(exportCategory)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV ফাইল ডাউনলোড করুন (Google Sheets & Excel Ready)</span>
                </button>

                {/* 2. Copy for Google Sheets TSV Paste */}
                <button
                  type="button"
                  onClick={() => handleCopyForGoogleSheets(exportCategory)}
                  className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Copy className="w-4 h-4 text-blue-700" />
                  <span>ক্লিপবোর্ডে কপি করুন (Google Sheets-এ সরাসরি Paste)</span>
                </button>

                {/* 3. Full JSON backup */}
                <button
                  type="button"
                  onClick={handleDownloadJSONBackup}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ সিস্টেম ব্যাকআপ ফাইল (.json) সংরক্ষণ করুন</span>
                </button>
              </div>

              {/* Quick instructions for user */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600 text-[11px]">
                <p className="font-bold text-slate-900">📌 কীভাবে Google Sheets-এ ব্যবহার করবেন:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-500">
                  <li><strong>পদ্ধতি ১:</strong> "ক্লিপবোর্ডে কপি" চাপুন এবং <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-900 underline font-semibold">sheets.new</a> খুলে প্রথম ঘরে <code>Ctrl + V</code> পেস্ট করুন।</li>
                  <li><strong>পদ্ধতি ২:</strong> ডাউনলোড করা CSV ফাইলটি Google Sheets-এ <em>File &gt; Import &gt; Upload</em> করে খুলুন।</li>
                  <li>UTF-8 BOM অন্তর্ভুক্ত থাকায় বাংলা নাম ও ঠিকানা কোনো রূপ বিকৃতি ছাড়া সঠিকভাবে আসবে।</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutor KYC Verification Review Modal (Feature 1) */}
      <AdminTutorKycReviewModal
        tutor={selectedKycTutor}
        isOpen={kycReviewModalOpen}
        onClose={() => {
          setKycReviewModalOpen(false);
          setSelectedKycTutor(null);
        }}
        performedBy={currentUser?.name || 'Super Admin'}
      />

      {/* Feature 4: Admin Tuition Confirmation from Demo Modal */}
      {adminConfirmModalOpen && adminSelectedDemoForConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    অফিসিয়াল টিউশন নিয়োগ ও চুক্তিপত্র তৈরি (Admin Confirmation)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {adminSelectedDemoForConfirm.tutorName} • অভিভাবক: {adminSelectedDemoForConfirm.guardianName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminConfirmModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminConfirmTuition} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{adminSelectedDemoForConfirm.studentName || 'শিক্ষার্থী'}</span>
                  <p className="text-[11px] text-slate-500">{adminSelectedDemoForConfirm.subject} • {adminSelectedDemoForConfirm.studentGrade}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ডেমো ভেরিফাইড
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">মাসিক বেতন (৳) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={adminAgreedSalary}
                    onChange={(e) => setAdminAgreedSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">সপ্তাহে দিন সংখ্যা *</label>
                  <select
                    value={adminAgreedDays}
                    onChange={(e) => setAdminAgreedDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
                  >
                    <option value={2}>২ দিন / সপ্তাহ</option>
                    <option value={3}>৩ দিন / সপ্তাহ</option>
                    <option value={4}>৪ দিন / সপ্তাহ</option>
                    <option value={5}>৫ দিন / সপ্তাহ</option>
                    <option value={6}>৬ দিন / সপ্তাহ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">টিউশন শুরুর তারিখ *</label>
                <input
                  type="date"
                  required
                  value={adminStartDateInput}
                  onChange={(e) => setAdminStartDateInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">বিশেষ নির্দেশনা / অফিসিয়াল নোট</label>
                <input
                  type="text"
                  value={adminInstructionsInput}
                  onChange={(e) => setAdminInstructionsInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                🔒 এটি নিশ্চিত করলে স্বয়ংক্রিয়ভাবে একটি অফিসিয়াল TuitionConfirmation রেকর্ড তৈরি হবে এবং টিউটর ও অভিভাবক উভয়ের ড্যাশবোর্ডে নোটিফিকেশন যাবে।
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  চুক্তি তৈরি ও কনফার্ম ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 4: Admin Reschedule Demo Modal */}
      {adminRescheduleModalOpen && adminSelectedDemoForReschedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <CalendarClock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-blue-950">
                    ডেমো সেশনের সময় পরিবর্তন (Admin Reschedule)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    শিক্ষক: {adminSelectedDemoForReschedule.tutorName} • অভিভাবক: {adminSelectedDemoForReschedule.guardianName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminRescheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminReschedule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">নতুন তারিখ *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={adminNewRescheduleDate}
                    onChange={(e) => setAdminNewRescheduleDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">নতুন সময় *</label>
                  <select
                    value={adminNewRescheduleTime}
                    onChange={(e) => setAdminNewRescheduleTime(e.target.value)}
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
                <label className="font-bold text-slate-800 block mb-1">রি-শিডিউলের কারণ বা নোট</label>
                <input
                  type="text"
                  value={adminRescheduleReason}
                  onChange={(e) => setAdminRescheduleReason(e.target.value)}
                  placeholder="যেমন: অভিভাবকের জরুরি অনুরোধের প্রেক্ষিতে সময় পেছানো হলো"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  সময় পরিবর্তন নিশ্চিত করুন
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

      {/* Feature 5: Official Payment Receipt Voucher Modal */}
      <PaymentReceiptModal
        payment={selectedPaymentForReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

      {/* Feature 5: Certificate Viewer Modal */}
      <CertificateViewModal
        certificate={selectedCertForView}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />

      {/* Feature 5: Issue Certificate Modal */}
      <IssueCertificateModal
        isOpen={issueCertModalOpen}
        onClose={() => setIssueCertModalOpen(false)}
        tutors={storeState.tutors}
      />

      {/* Feature 6: Student Academic Progress Report Card Modal */}
      <StudentProgressReportModal
        report={selectedProgressReportForView}
        isOpen={progressReportModalOpen}
        onClose={() => setProgressReportModalOpen(false)}
      />

      {/* ========================================================= */}
      {/* REQUIREMENT 1: IN-APP SAFE DELETE CONFIRMATION MODAL       */}
      {/* Replaces fragile window.confirm that fails in iframes    */}
      {/* ========================================================= */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                স্থায়ীভাবে মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনি কি নিশ্চিতভাবে এই আইটেমটি মুছে ফেলতে চান? এটি স্থায়ীভাবে ডাটাবেস থেকে মুছে ফেলা হবে।
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs font-medium text-slate-800 break-words mt-2">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">নির্বাচিত আইটেম:</span>
                {deleteConfirmItem.label}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছে ফেলুন (Confirm Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REQUIREMENT 1: EDIT TUITION REQUEST MODAL                  */}
      {/* ========================================================= */}
      {editRequestModalOpen && selectedReqForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-base text-blue-950">
                  অভিভাবকের টিউশন চাহিদা এডিট (Request ID: {selectedReqForEdit.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditRequestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRequestEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    required
                    value={reqFormData.guardianName}
                    onChange={(e) => setReqFormData({ ...reqFormData, guardianName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={reqFormData.phone}
                    onChange={(e) => setReqFormData({ ...reqFormData, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">জেলা (District)</label>
                  <select
                    value={reqFormData.location}
                    onChange={(e) => setReqFormData({ ...reqFormData, location: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">এলাকা / থানা (Area)</label>
                  <input
                    type="text"
                    required
                    value={reqFormData.area}
                    onChange={(e) => setReqFormData({ ...reqFormData, area: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">শ্রেণি (Class / Level)</label>
                  <input
                    type="text"
                    required
                    value={reqFormData.studentClass}
                    onChange={(e) => setReqFormData({ ...reqFormData, studentClass: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">মিডিয়াম (Medium)</label>
                  <input
                    type="text"
                    required
                    value={reqFormData.medium}
                    onChange={(e) => setReqFormData({ ...reqFormData, medium: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">শিক্ষার্থীর লিঙ্গ</label>
                  <select
                    value={reqFormData.studentGender}
                    onChange={(e) => setReqFormData({ ...reqFormData, studentGender: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="male">ছাত্র (Male)</option>
                    <option value="female">ছাত্রী (Female)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">পড়ার বিষয়সমূহ (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={reqFormData.subjects}
                  onChange={(e) => setReqFormData({ ...reqFormData, subjects: e.target.value })}
                  placeholder="যেমন: Mathematics, Physics, English"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-amber-950 block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>কাস্টমাইজ অপশন / বিশেষ চাহিদা (Customise):</span>
                </label>
                <input
                  type="text"
                  value={reqFormData.customRequirements}
                  onChange={(e) => setReqFormData({ ...reqFormData, customRequirements: e.target.value })}
                  placeholder="অভিভাবকের নিজস্ব পছন্দমতো লেখা বিশেষ চাহিদা"
                  className="w-full p-2 bg-amber-50/50 border border-amber-300 rounded-xl text-amber-950 font-medium focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">দিন / সপ্তাহ</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={reqFormData.daysPerWeek}
                    onChange={(e) => setReqFormData({ ...reqFormData, daysPerWeek: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">পছন্দের সময়</label>
                  <input
                    type="text"
                    value={reqFormData.preferredTime}
                    onChange={(e) => setReqFormData({ ...reqFormData, preferredTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">শিক্ষক জেন্ডার পছন্দ</label>
                  <select
                    value={reqFormData.tutorGenderPreference}
                    onChange={(e) => setReqFormData({ ...reqFormData, tutorGenderPreference: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="any">যেকোনো (Any)</option>
                    <option value="male">পুরুষ শিক্ষক (Male)</option>
                    <option value="female">মহিলা শিক্ষক (Female)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">মাসিক বাজেট (BDT ৳)</label>
                  <input
                    type="number"
                    value={reqFormData.monthlyBudget}
                    onChange={(e) => setReqFormData({ ...reqFormData, monthlyBudget: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-semibold focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">স্ট্যাটাস (Status)</label>
                  <select
                    value={reqFormData.status}
                    onChange={(e) => setReqFormData({ ...reqFormData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-xs focus:bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="matched">Matched</option>
                    <option value="closed">Closed</option>
                    <option value="converted_to_job">Converted to Job</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">অতিরিক্ত বিবরণ / নোট</label>
                <textarea
                  rows={2}
                  value={reqFormData.additionalRequirements}
                  onChange={(e) => setReqFormData({ ...reqFormData, additionalRequirements: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REQUIREMENT 1: EDIT APPLICATION MODAL                      */}
      {/* ========================================================= */}
      {editAppModalOpen && selectedAppForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-base text-blue-950">
                  টিউটরের আবেদনপত্র এডিট ({selectedAppForEdit.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditAppModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>টিউটর:</strong> {selectedAppForEdit.tutorName} ({selectedAppForEdit.tutorUniversity})</p>
              <p><strong>মোবাইল:</strong> {selectedAppForEdit.tutorPhone} · <strong>জব আইডি:</strong> {selectedAppForEdit.jobId}</p>
            </div>

            <form onSubmit={handleSaveAppEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">আবেদনের স্ট্যাটাস</label>
                  <select
                    value={appFormData.status}
                    onChange={(e) => setAppFormData({ ...appFormData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-xs focus:bg-white"
                  >
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="appointed">Appointed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">প্রত্যাশিত সম্মানী (BDT ৳)</label>
                  <input
                    type="number"
                    value={appFormData.expectedSalary}
                    onChange={(e) => setAppFormData({ ...appFormData, expectedSalary: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-semibold focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">এডমিন ইন্টার্নাল নোট (Admin Internal Note)</label>
                <textarea
                  rows={2}
                  value={appFormData.adminNote}
                  onChange={(e) => setAppFormData({ ...appFormData, adminNote: e.target.value })}
                  placeholder="যেমন: অভিভাবকের সাথে কথা হয়েছে, কাল ৩টায় ডেমো কল দিতে হবে..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">টিউটরের কভার নোট (Cover Note)</label>
                <textarea
                  rows={2}
                  value={appFormData.coverNote}
                  onChange={(e) => setAppFormData({ ...appFormData, coverNote: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FLOATING ADMIN ACTION TOAST FEEDBACK                       */}
      {/* ========================================================= */}
      {adminActionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminActionToast}</span>
        </div>
      )}

      {/* Standalone Admin App Installation Modal */}
      <AdminInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        deferredPrompt={deferredInstallPrompt}
        onPromptTriggered={() => {
          setDeferredInstallPrompt(null);
          setInstallModalOpen(false);
        }}
      />

    </div>
  );
};
