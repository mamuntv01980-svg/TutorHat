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
  Sparkles
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
  ReferralRecord 
} from '../../types';
import { BD_DISTRICTS, DHAKA_AREAS, MEDIUMS, CLASS_LEVELS } from '../../constants/bangladeshData';

export const AdminDashboard: React.FC = () => {
  const { storeState, settings, currentUser, loginAs, logout, language, navigateTo } = useApp();

  type AdminTab = 
    | 'jobs' 
    | 'requests' 
    | 'tutors' 
    | 'guardians'
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
    | 'admins'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('jobs');

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

  // Tuition Requests Search State
  const [requestSearch, setRequestSearch] = useState('');

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
      
      {/* Admin Top Header */}
      <div className="bg-blue-950 text-white sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm tracking-wide">TutorHat Administration Console</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300">
              <span className="hidden md:inline">Active: <strong className="text-white">{currentUser.name}</strong></span>
              
              {/* Google Sheets / CSV Export Button */}
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="py-1 px-2.5 sm:px-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition text-xs cursor-pointer shadow-xs active:scale-95"
                title="Google Sheets & CSV Export"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">Google Sheets / Export</span>
                <span className="sm:hidden">Export</span>
              </button>

              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                ● Live Database
              </span>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="py-1 px-3 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition text-xs cursor-pointer shadow-xs active:scale-95"
                title="Admin Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
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
            { id: 'activity', label: `Activity Logs (${storeState.activityLogs.length})` },
            { id: 'admins', label: `Admin Management (${adminUsers.length})` },
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

                      {/* Delete Job Circular */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`আপনি কি নিশ্চিতভাবে এই টিউশন সার্কুলারটি (${job.id}: ${job.title}) মুছে ফেলতে চান?`)) {
                            store.deleteJob(job.id, currentUser.name);
                          }
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
                  <span>অপেক্ষমাণ KYC</span>
                  <span className="bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full text-[10px]">
                    {storeState.tutors.filter(t => t.verificationStatus === 'pending').length}
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
                        onClick={() => store.setTutorVerificationStatus(tutor.id, 'verified')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        ✓ কুইক ভেরিফাই
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
        {/* GUARDIAN REQUESTS                                         */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-blue-950">Guardian Tuition Requirements (অভিভাবকের টিউশন চাহিদা)</h3>
                <p className="text-slate-500">Approve requests and convert them directly into public tuition circulars.</p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                Total Requests: {storeState.requests.length}
              </span>
            </div>

            {/* Request Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search requests by ID, guardian name, phone, class, area, subject..."
                value={requestSearch}
                onChange={e => setRequestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              {storeState.requests
                .filter(req => {
                  if (!requestSearch) return true;
                  const q = requestSearch.toLowerCase();
                  return (
                    req.id.toLowerCase().includes(q) ||
                    req.guardianName.toLowerCase().includes(q) ||
                    req.phone.includes(q) ||
                    req.studentClass.toLowerCase().includes(q) ||
                    req.area.toLowerCase().includes(q) ||
                    req.subjects.some(s => s.toLowerCase().includes(q))
                  );
                })
                .map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900">{req.id}</span>
                      <span className="font-bold text-slate-900">{req.guardianName} ({req.phone})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.status === 'converted_to_job' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-700">{req.studentClass} ({req.medium}) · Area: {req.area}, {req.location}</p>
                    <p className="text-slate-600">Subjects: {req.subjects.join(', ')} · Routine: {req.daysPerWeek} days/wk ({req.preferredTime})</p>
                    <p className="text-blue-950 font-bold">Guardian Budget: {settings.defaultCurrency}{req.monthlyBudget.toLocaleString()}/month</p>
                    {req.additionalRequirements && <p className="text-[11px] text-slate-500 italic">"{req.additionalRequirements}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            store.convertRequestToJob(req.id);
                            alert('Converted and published as live Job on Tuition Job Board!');
                          }}
                          className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold cursor-pointer transition shadow-xs"
                        >
                          Convert to Live Job
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Reject this guardian tuition requirement?')) {
                              store.updateTuitionRequest(req.id, { status: 'rejected' }, currentUser.name);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold cursor-pointer transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete tuition request ${req.id}?`)) {
                          store.deleteTuitionRequest(req.id, currentUser.name);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer border border-transparent hover:border-rose-200 transition"
                      title="Delete Request"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-blue-950">
                Payment Management ({storeState.payments.length})
              </h3>
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
                      ফিচার ২ • রেটিং ও রিভিউ নিয়ন্ত্রণ কেন্দ্র
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

    </div>
  );
};
