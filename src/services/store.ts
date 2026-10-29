import {
  User,
  AdminRoleLevel,
  TutorProfile,
  TuitionRequest,
  TuitionJob,
  TuitionJobStatus,
  JobApplication,
  DemoClass,
  TuitionConfirmation,
  AttendanceRecord,
  PaymentRecord,
  CertificateRecord,
  ReviewRecord,
  NotificationItem,
  NoticeItem,
  ContactMessage,
  ReferralRecord,
  AdminNote,
  ActivityLog,
  SystemSettings,
  ChatMessage,
  ChatConversation,
  StudentProgressReport
} from '../types';

import heroImg from '../assets/images/hero_bangladesh_tutoring_1791378378802.jpg';
import tutorProfileImg from '../assets/images/tutor_graduate_profile_1791378392899.jpg';
import guardianStudyImg from '../assets/images/guardian_student_study_1791378404986.jpg';

export { heroImg, tutorProfileImg, guardianStudyImg };

const DEFAULT_SETTINGS: SystemSettings = {
  appName: 'TutorHat',
  publicPhone: '+8809638284290',
  whatsAppRaw: '01610582917',
  whatsAppIntl: '+8801610582917',
  officeAddress: 'House 24, Road 10/A, Dhanmondi, Dhaka 1209, Bangladesh',
  supportEmail: 'support@tutorhat.com',
  noticeMarquee: 'স্বাগতম TutorHat-এ! সারাদেশে বিশ্বস্ত ও ভেরিফাইড জেনারেল, আলিয়া ও কওমি মাদ্রাসার টিউটর পেতে আজই ফ্রি রিকোয়েস্ট করুন। নতুন টিউশন সার্কুলার প্রতিদিন প্রকাশিত হয়।',
  requireTutorVerificationToPublish: true,
  allowDirectGuardianTutorCall: false,
  defaultCurrency: '৳',
  socialLinks: {
    facebook: 'https://facebook.com/tutorhatbd',
    whatsapp: 'https://wa.me/8801610582917',
    youtube: 'https://youtube.com/@tutorhatbd',
    linkedin: 'https://linkedin.com/company/tutorhatbd'
  },
  referralRules: 'Earn ৳200 bonus or discount voucher on your child’s tuition after successful demo completion by a referred student or tutor.',
  referralBonusText: '৳200 Credit per verified referral',
  jobAutoApprove: false,
  isDemoDataEnabled: false,
  paymentAccounts: {
    bkashNumber: '01752617360',
    bkashType: 'personal',
    nagadNumber: '01752617360',
    nagadType: 'personal',
    paymentInstructionsBn: 'বিকাশ অথবা নগদ "Send Money" (সেন্ড মানি) অপশন ব্যবহার করে 01752617360 নম্বরে পেমেন্ট করুন। রেফারেন্সে আপনার নাম বা জব আইডি দিন।'
  },
  adminSecurity: {
    requireStrongPassword: false,
    adminPasswordHash: '5078',
    adminPinHash: '9ba5b4d71a7b4455e4230a991e795c0fd2d91c179ee0671b7add49cf9be962fb',
    adminPinSalt: 'tutorhat_sec_salt_',
    biometricPasskeyRegistered: false,
    twoFactorEnabled: false,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
    adminAccountConfigured: true,
    primaryAdminName: 'Super Admin Mamun',
    primaryAdminEmail: 'admin@tutorhat.com',
    primaryAdminPhone: '01752617360'
  }
};

const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'Super Admin Mamun',
    email: 'admin@tutorhat.com',
    phone: '01752617360',
    role: 'admin',
    adminRoleLevel: 'super_admin',
    gender: 'male',
    location: 'Dhanmondi, Dhaka',
    district: 'Dhaka',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

const INITIAL_TUTORS: TutorProfile[] = [];

// Empty initial jobs, requests and applications so the platform starts completely fresh for real users
const INITIAL_REQUESTS: TuitionRequest[] = [];
const INITIAL_JOBS: TuitionJob[] = [];
const INITIAL_APPLICATIONS: JobApplication[] = [];

const INITIAL_DEMOS: DemoClass[] = [];
const INITIAL_CONFIRMATIONS: TuitionConfirmation[] = [];
const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
const INITIAL_PAYMENTS: PaymentRecord[] = [];
const INITIAL_CERTIFICATES: CertificateRecord[] = [];
const INITIAL_REVIEWS: ReviewRecord[] = [];
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not_01',
    title: 'পবিত্র রমজান ও ঈদের টিউশন শিডিউল নির্দেশিকা',
    description: 'সকল গৃহশিক্ষক ও অভিভাবকদের পারস্পরিক সমঝোতার মাধ্যমে রমজানের সুবিধাজনক সময়সূচি নির্ধারণের অনুরোধ করা হচ্ছে। TutorHat সাপোর্ট টিম সার্বক্ষণিক সচল থাকবে।',
    category: 'general',
    publishedDate: '2026-03-01',
    status: 'published',
    createdBy: 'Master Admin'
  },
  {
    id: 'not_02',
    title: 'বুয়েট ও ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য প্রায়োরিটি ভেরিফিকেশন',
    description: 'পাবলিক বিশ্ববিদ্যালয়ের অধ্যয়নরত টিউটররা তাদের স্টুডেন্ট আইডি কার্ড আপলোড করে ২ ঘণ্টার মধ্যে জরুরি ভেরিফিকেশন সম্পন্ন করতে পারবেন।',
    category: 'tutors',
    publishedDate: '2026-03-04',
    status: 'published',
    createdBy: 'Master Admin'
  },
  {
    id: 'not_03',
    title: 'অভিভাবকদের জন্য বিনামূল্যে ডেমো ক্লাসের সুবিধা',
    description: 'সন্তানের জন্য গৃহশিক্ষক চূড়ান্ত করার পূর্বে ১ দিনের ফ্রি ডেমো ক্লাস নিয়ে শিক্ষকের পড়ানোর কৌশল যাচাই করুন। কোনো প্ল্যাটফর্ম চার্জ প্রযোজ্য নয়।',
    category: 'guardians',
    publishedDate: '2026-03-06',
    status: 'published',
    createdBy: 'Master Admin'
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [];
const INITIAL_REFERRALS: ReferralRecord[] = [];
const INITIAL_ADMIN_NOTES: AdminNote[] = [];
const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];
const INITIAL_CONVERSATIONS: ChatConversation[] = [];
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];
const INITIAL_PROGRESS_REPORTS: StudentProgressReport[] = [];

const STORAGE_KEY = 'tutorhat_data_v10';

export interface StoreState {
  settings: SystemSettings;
  users: User[];
  tutors: TutorProfile[];
  requests: TuitionRequest[];
  jobs: TuitionJob[];
  applications: JobApplication[];
  demos: DemoClass[];
  confirmations: TuitionConfirmation[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  certificates: CertificateRecord[];
  reviews: ReviewRecord[];
  notifications: NotificationItem[];
  notices: NoticeItem[];
  messages: ContactMessage[];
  referrals: ReferralRecord[];
  adminNotes: AdminNote[];
  activityLogs: ActivityLog[];
  shortlists: { guardianId: string; tutorId: string }[];
  conversations: ChatConversation[];
  chatMessages: ChatMessage[];
  progressReports: StudentProgressReport[];
  _freshCleanV10?: boolean;
}

export function calculateCvCompletion(tutor?: Partial<TutorProfile> | null): { percent: number; missing: string[] } {
  if (!tutor) {
    return { percent: 0, missing: ['Profile Data'] };
  }
  const missing: string[] = [];
  let score = 0;

  const isQawmi = tutor.tutorCategory === 'qawmi_madrasa';
  const isAlia = tutor.tutorCategory === 'alia_madrasa';

  const weights = [
    { field: 'fullName', name: 'Full Name', weight: 10, check: () => !!tutor.fullName?.trim() },
    { field: 'gender', name: 'Gender', weight: 5, check: () => !!tutor.gender },
    { field: 'phone', name: 'Mobile Number', weight: 10, check: () => !!tutor.phone?.trim() },
    { field: 'area', name: 'Current Area', weight: 5, check: () => !!tutor.area?.trim() },
    { field: 'aboutMe', name: 'About Me Bio', weight: 10, check: () => (tutor.aboutMe?.length || 0) > 20 },
    
    // Academic checks adapting to category:
    {
      field: 'academicInstitution',
      name: isQawmi ? 'Madrasa / Jamiah Name' : 'University / College Name',
      weight: 15,
      check: () => !!tutor.university?.trim() || !!tutor.madrasaDetails?.currentKhidmatOrInstitution?.trim()
    },
    {
      field: 'academicDegree',
      name: isQawmi ? 'Sanad / Department (e.g. Dawra-e-Hadith/Ifta)' : 'Department / Discipline',
      weight: 10,
      check: () => !!tutor.department?.trim() || !!tutor.madrasaDetails?.highestSanadOrDegree?.trim()
    },
    {
      field: 'secondaryRecords',
      name: isQawmi ? 'Sanad / Board Details' : (isAlia ? 'Dakhil / SSC Record' : 'SSC Records'),
      weight: 5,
      check: () => isQawmi 
        ? (!!tutor.madrasaDetails?.madrasaBoard || (!!tutor.ssc?.schoolOrCollege && !!tutor.ssc?.gpa))
        : (!!tutor.ssc?.schoolOrCollege && !!tutor.ssc?.gpa)
    },
    {
      field: 'higherRecords',
      name: isQawmi ? 'Specialization (Hifz/Qirat/Adab/Sanad)' : (isAlia ? 'Alim / HSC Record' : 'HSC Records'),
      weight: 5,
      check: () => isQawmi
        ? (!!tutor.madrasaDetails?.highestSanadOrDegree || !!tutor.madrasaDetails?.isHafiz || (!!tutor.hsc?.schoolOrCollege && !!tutor.hsc?.gpa))
        : (!!tutor.hsc?.schoolOrCollege && !!tutor.hsc?.gpa)
    },

    { field: 'preferredClasses', name: 'Preferred Classes / Learner Levels', weight: 5, check: () => (tutor.preferredClasses?.length || 0) > 0 },
    { field: 'preferredSubjects', name: 'Preferred Subjects', weight: 10, check: () => (tutor.preferredSubjects?.length || 0) > 0 },
    { field: 'preferredAreas', name: 'Preferred Teaching Areas', weight: 5, check: () => (tutor.preferredAreas?.length || 0) > 0 },
    { field: 'expectedSalary', name: 'Expected Salary', weight: 5, check: () => (tutor.expectedSalary || 0) > 0 },
    { field: 'teachingExperienceYears', name: 'Teaching Experience', weight: 5, check: () => typeof tutor.teachingExperienceYears === 'number' }
  ];

  for (const item of weights) {
    if (item.check()) {
      score += item.weight;
    } else {
      missing.push(item.name);
    }
  }

  return {
    percent: Math.min(100, score),
    missing
  };
}

class Store {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    // Guarantee fresh clean state is persisted to v10
    this.state._freshCleanV10 = true;
    this.saveState();

    if (typeof window !== 'undefined') {
      this.syncWithServer();
      setInterval(() => this.syncWithServer(), 3000);
      window.addEventListener('focus', () => this.syncWithServer());
    }
  }

  public async syncWithServer(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/sync', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          return; // Static host / Netlify HTML fallback, skip safely
        }

        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          let changed = false;

          if (Array.isArray(s.requests)) {
            this.state.requests = s.requests;
            changed = true;
          }
          if (Array.isArray(s.jobs)) {
            this.state.jobs = s.jobs;
            changed = true;
          }
          if (Array.isArray(s.applications)) {
            this.state.applications = s.applications;
            changed = true;
          }
          if (Array.isArray(s.tutors)) {
            this.state.tutors = s.tutors.filter((t: TutorProfile) => !t.id.startsWith('tut_01') && !t.id.startsWith('tut_02') && !t.id.startsWith('tut_03') && !t.id.startsWith('tut_04'));
            changed = true;
          }
          if (Array.isArray(s.users)) {
            const serverUsers = s.users.filter((u: User) => !u.id.startsWith('user_tutor_') && u.id !== 'user_guardian_01');
            const hasAdmin = serverUsers.some((u: User) => u.role === 'admin');
            this.state.users = hasAdmin ? serverUsers : [INITIAL_USERS[0], ...serverUsers];
            changed = true;
          }
          if (s.adminSecurity) {
            this.state.settings = {
              ...this.state.settings,
              adminSecurity: {
                ...this.state.settings.adminSecurity,
                ...s.adminSecurity
              }
            };
            changed = true;
          }

          if (changed) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch {}
            this.notify();
          }
        }
      }
    } catch {
      // offline / local fallback
    }
  }

  private loadState(): StoreState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const isFreshClean = parsed._freshCleanV10 === true;
        if (isFreshClean) {
          const rawUsers = (Array.isArray(parsed.users) && parsed.users.length > 0)
            ? parsed.users.filter((u: User) => !u.id.startsWith('user_tutor_') && u.id !== 'user_guardian_01')
            : INITIAL_USERS;
          const hasAdmin = rawUsers.some((u: User) => u.role === 'admin');
          const finalUsers = hasAdmin ? rawUsers : [INITIAL_USERS[0], ...rawUsers];

          const cleanTutors = (Array.isArray(parsed.tutors) ? parsed.tutors : [])
            .filter((t: TutorProfile) => !t.id.startsWith('tut_01') && !t.id.startsWith('tut_02') && !t.id.startsWith('tut_03') && !t.id.startsWith('tut_04'));

          return {
            settings: {
              ...DEFAULT_SETTINGS,
              ...(parsed.settings || {}),
              paymentAccounts: {
                ...DEFAULT_SETTINGS.paymentAccounts,
                ...(parsed.settings?.paymentAccounts || {})
              },
              adminSecurity: {
                ...DEFAULT_SETTINGS.adminSecurity,
                ...(parsed.settings?.adminSecurity || {})
              }
            },
            users: finalUsers,
            tutors: cleanTutors,
            requests: Array.isArray(parsed.requests) ? parsed.requests : [],
            jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
            applications: Array.isArray(parsed.applications) ? parsed.applications : [],
            _freshCleanV10: true,
            demos: Array.isArray(parsed.demos) ? parsed.demos : [],
            confirmations: Array.isArray(parsed.confirmations) ? parsed.confirmations : [],
            attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
            payments: Array.isArray(parsed.payments) ? parsed.payments : [],
            certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
            notices: Array.isArray(parsed.notices) && parsed.notices.length > 0 ? parsed.notices : INITIAL_NOTICES,
            messages: Array.isArray(parsed.messages) ? parsed.messages : [],
            referrals: Array.isArray(parsed.referrals) ? parsed.referrals : [],
            adminNotes: Array.isArray(parsed.adminNotes) ? parsed.adminNotes : [],
            activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [],
            shortlists: Array.isArray(parsed.shortlists) ? parsed.shortlists : [],
            conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
            chatMessages: Array.isArray(parsed.chatMessages) ? parsed.chatMessages : [],
            progressReports: Array.isArray(parsed.progressReports) ? parsed.progressReports : []
          };
        }
      }
    } catch {
      // ignore corrupt data
    }

    return {
      settings: DEFAULT_SETTINGS,
      users: INITIAL_USERS,
      tutors: INITIAL_TUTORS,
      requests: INITIAL_REQUESTS,
      jobs: INITIAL_JOBS,
      applications: INITIAL_APPLICATIONS,
      demos: INITIAL_DEMOS,
      confirmations: INITIAL_CONFIRMATIONS,
      attendance: INITIAL_ATTENDANCE,
      payments: INITIAL_PAYMENTS,
      certificates: INITIAL_CERTIFICATES,
      reviews: INITIAL_REVIEWS,
      notifications: INITIAL_NOTIFICATIONS,
      notices: INITIAL_NOTICES,
      messages: INITIAL_MESSAGES,
      referrals: INITIAL_REFERRALS,
      adminNotes: INITIAL_ADMIN_NOTES,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      shortlists: [],
      conversations: INITIAL_CONVERSATIONS,
      chatMessages: INITIAL_CHAT_MESSAGES,
      progressReports: INITIAL_PROGRESS_REPORTS,
      _freshCleanV10: true
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // storage full or disabled
    }
    this.notify();
  }

  public ensureAdminUser(): User {
    let admin = this.state.users.find(u => u.role === 'admin');
    if (!admin) {
      admin = INITIAL_USERS[0];
      this.state.users = [admin, ...this.state.users];
      this.saveState();
      this.notify();
    }
    return admin;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getState(): StoreState {
    return this.state;
  }

  public getSettings(): SystemSettings {
    return this.state.settings;
  }

  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    if (newSettings.whatsAppRaw) {
      const raw = newSettings.whatsAppRaw.replace(/[^0-9]/g, '');
      const intl = raw.startsWith('880') ? `+${raw}` : raw.startsWith('0') ? `+88${raw}` : `+880${raw}`;
      this.state.settings.whatsAppIntl = intl;
    }
    this.logActivity('SETTINGS_UPDATED', 'Updated central platform configuration.');
    this.saveState();

    if (newSettings.adminSecurity) {
      fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings.adminSecurity)
      }).catch(() => {});
    }
  }

  // Users & Auth
  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const id = `user_${Date.now()}`;
    const referralCode = `${userData.name.split(' ')[0].toUpperCase()}-TH${Math.floor(10 + Math.random() * 90)}`;
    const newUser: User = {
      ...userData,
      id,
      status: 'active',
      referralCode,
      createdAt: new Date().toISOString()
    };
    this.state.users = [...this.state.users, newUser];

    if (userData.role === 'tutor') {
      const tutorId = `tut_${Date.now()}`;
      const newTutor: TutorProfile = {
        id: tutorId,
        userId: id,
        fullName: userData.name,
        photo: '',
        gender: userData.gender === 'female' ? 'female' : 'male',
        phone: userData.phone,
        email: userData.email,
        currentAddress: userData.location,
        permanentAddress: '',
        district: userData.district || 'Dhaka',
        area: '',
        preferredAreas: [],
        aboutMe: '',
        university: '',
        department: '',
        programDegree: '',
        admissionYear: '',
        currentYearSemester: '',
        institution: '',
        ssc: { schoolOrCollege: '', gpa: '', passingYear: '' },
        hsc: { schoolOrCollege: '', gpa: '', passingYear: '' },
        teachingExperienceYears: 0,
        teachingMethod: '',
        preferredClasses: [],
        preferredSubjects: [],
        preferredMediums: [],
        categories: [],
        onlineTeaching: false,
        homeTuition: true,
        coachingGroupTuition: false,
        availableDays: [],
        availableTime: '',
        expectedSalary: 5000,
        preferredStudentGender: 'any',
        preferredClassLevel: '',
        verificationStatus: 'pending',
        completionPercentage: 20,
        rating: 5.0,
        totalReviews: 0
      };
      this.state.tutors = [newTutor, ...this.state.tutors];

      fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTutor)
      }).catch(() => {});
    }

    this.logActivity('USER_REGISTERED', `Created account ${newUser.name} as ${newUser.role}`);
    this.saveState();

    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(() => {});

    return newUser;
  }

  public updateUser(userId: string, updates: Partial<User>): User | undefined {
    let updatedUser: User | undefined;
    this.state.users = this.state.users.map(u => {
      if (u.id === userId) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });
    if (updatedUser) {
      this.logActivity('USER_UPDATED', `Updated user details for ${updatedUser.name} (${userId})`);
      this.saveState();
    }
    return updatedUser;
  }

  public findUserByPhoneOrEmail(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.state.users.find(u => 
      u.email.toLowerCase() === clean || u.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')
    );
  }

  public getGuardians(): User[] {
    return this.state.users.filter(u => u.role === 'guardian');
  }

  public updateGuardianStatus(guardianId: string, status: 'active' | 'suspended') {
    this.state.users = this.state.users.map(u => u.id === guardianId ? { ...u, status } : u);
    this.logActivity('GUARDIAN_STATUS_UPDATED', `Set guardian ${guardianId} status to ${status}`);
    this.saveState();
  }

  public deleteGuardian(guardianId: string, performedBy: string = 'Admin') {
    const guardian = this.getUserById(guardianId);
    this.state.users = this.state.users.filter(u => u.id !== guardianId);
    this.state.requests = this.state.requests.filter(r => r.guardianId !== guardianId);
    this.state.demos = this.state.demos.filter(d => d.guardianId !== guardianId);
    this.state.confirmations = this.state.confirmations.filter(c => c.guardianId !== guardianId);
    this.state.attendance = this.state.attendance.filter(a => a.guardianId !== guardianId);
    this.state.payments = this.state.payments.filter(p => p.guardianId !== guardianId);
    this.state.reviews = this.state.reviews.filter(r => r.guardianId !== guardianId);
    this.logActivity('GUARDIAN_DELETED', `Deleted guardian ${guardian?.name || guardianId}`, performedBy);
    this.saveState();

    fetch(`/api/users/${guardianId}`, { method: 'DELETE' }).catch(() => {});
  }

  // Tutors
  public getTutors(): TutorProfile[] {
    return this.state.tutors;
  }

  public getTutorById(id: string): TutorProfile | undefined {
    return this.state.tutors.find(t => t.id === id);
  }

  public getTutorByUserId(userId: string): TutorProfile | undefined {
    return this.state.tutors.find(t => t.userId === userId);
  }

  public deleteTutor(tutorId: string, performedBy: string = 'Admin') {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;
    this.state.tutors = this.state.tutors.filter(t => t.id !== tutorId);
    if (tutor.userId) {
      this.state.users = this.state.users.filter(u => u.id !== tutor.userId);
    }
    this.state.applications = this.state.applications.filter(a => a.tutorId !== tutorId);
    this.state.demos = this.state.demos.filter(d => d.tutorId !== tutorId);
    this.state.confirmations = this.state.confirmations.filter(c => c.tutorId !== tutorId);
    this.state.attendance = this.state.attendance.filter(a => a.tutorId !== tutorId);
    this.state.payments = this.state.payments.filter(p => p.tutorId !== tutorId);
    this.state.reviews = this.state.reviews.filter(r => r.tutorId !== tutorId);
    this.state.certificates = this.state.certificates.filter(c => c.tutorId !== tutorId);
    this.logActivity('TUTOR_DELETED', `Deleted tutor ${tutor.fullName} (${tutorId})`, performedBy);
    this.saveState();

    fetch(`/api/tutors/${tutorId}`, { method: 'DELETE' }).catch(() => {});
    if (tutor.userId) {
      fetch(`/api/users/${tutor.userId}`, { method: 'DELETE' }).catch(() => {});
    }
  }

  public updateTutorProfile(tutorId: string, updates: Partial<TutorProfile>) {
    this.state.tutors = this.state.tutors.map(t => {
      if (t.id === tutorId) {
        const merged = { ...t, ...updates };
        const calc = calculateCvCompletion(merged);
        merged.completionPercentage = calc.percent;
        return merged;
      }
      return t;
    });
    this.saveState();

    const currentTutor = this.getTutorById(tutorId);
    if (currentTutor) {
      fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTutor)
      }).catch(() => {});
    }
  }

  public submitTutorForVerification(tutorId: string) {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;
    const calc = calculateCvCompletion(tutor);

    this.updateTutorProfile(tutorId, {
      verificationStatus: 'pending',
      verificationSubmittedDate: new Date().toISOString(),
      completionPercentage: calc.percent
    });

    this.addNotification({
      userId: 'user_admin_01',
      title: 'নতুন টিউটর সিভি আবেদন (New Tutor CV)',
      message: `${tutor.fullName} (${tutor.university || tutor.institution || 'টিউটর'}) তার সিভি পূরণ করে অনুমোদনের জন্য পাঠিয়েছেন। সম্পন্ন: ${calc.percent}%`,
      type: 'verification'
    });

    this.logActivity('TUTOR_CV_SUBMITTED', `Tutor ${tutor.fullName} submitted CV for verification (${calc.percent}% complete)`);
    this.syncWithServer().catch(() => {});
  }

  public setTutorVerificationStatus(
    tutorId: string, 
    status: 'verified' | 'rejected' | 'suspended' | 'pending' | 'draft', 
    rejectionReason?: string
  ) {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;

    this.state.tutors = this.state.tutors.map(t => {
      if (t.id === tutorId) {
        return {
          ...t,
          verificationStatus: status,
          rejectionReason: rejectionReason || undefined
        };
      }
      return t;
    });

    let notifTitle = 'Profile Verification Update';
    let notifMsg = `Your tutor profile status is now: ${status.toUpperCase()}.`;
    if (status === 'verified') {
      notifTitle = 'Congratulations! Profile Verified ✓';
      notifMsg = 'Your TutorHat profile has been verified! You now have the verified badge and can receive direct tuition requests.';
    } else if (status === 'rejected') {
      notifTitle = 'Profile Needs Revision';
      notifMsg = `Verification could not be approved. Reason: ${rejectionReason || 'Please update educational documents.'}`;
    }

    this.addNotification({
      userId: tutor.userId,
      title: notifTitle,
      message: notifMsg,
      type: 'verification'
    });

    this.logActivity('TUTOR_VERIFICATION_STATUS', `Tutor ${tutor.fullName} status updated to ${status}`);
    this.saveState();

    const updatedTutor = this.getTutorById(tutorId);
    if (updatedTutor) {
      fetch('/api/tutors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTutor)
      }).catch(() => {});
    }
  }

  // Feature 1: Tutor KYC Document Submission & Review
  public submitTutorKycDocuments(
    tutorId: string,
    docs: {
      nidNumber?: string;
      nidFrontPhoto?: string;
      nidBackPhoto?: string;
      studentIdCardPhoto?: string;
      certificatePhoto?: string;
    }
  ) {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;

    this.state.tutors = this.state.tutors.map(t => {
      if (t.id === tutorId) {
        return {
          ...t,
          ...docs,
          verificationStatus: 'pending' as const,
          verificationSubmittedDate: new Date().toISOString().split('T')[0],
          rejectionReason: undefined
        };
      }
      return t;
    });

    this.addNotification({
      userId: 'user_admin_01',
      title: 'নতুন টিউটর KYC ভেরিফিকেশন আবেদন',
      message: `${tutor.fullName} তাদের NID, আইডি কার্ড ও শিক্ষাগত সনদপত্র ভেরিফিকেশনের জন্য সাবমিট করেছেন।`,
      type: 'verification'
    });

    this.logActivity('TUTOR_KYC_SUBMITTED', `Tutor ${tutor.fullName} submitted KYC documents for admin review.`);
    this.saveState();
  }

  public reviewTutorKycVerification(
    tutorId: string,
    params: {
      status: 'verified' | 'rejected' | 'suspended';
      isNidVerified?: boolean;
      isStudentIdVerified?: boolean;
      isAcademicVerified?: boolean;
      badgeLevel?: 'standard' | 'verified_pro' | 'golden_star' | 'none';
      rejectionReason?: string;
      verificationNotes?: string;
      performedBy?: string;
    }
  ) {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;

    const isVerified = params.status === 'verified';
    let checksPassed = 0;
    if (params.isNidVerified) checksPassed++;
    if (params.isStudentIdVerified) checksPassed++;
    if (params.isAcademicVerified) checksPassed++;
    const trustScore = isVerified ? (checksPassed === 3 ? 100 : checksPassed === 2 ? 85 : 70) : 40;

    this.state.tutors = this.state.tutors.map(t => {
      if (t.id === tutorId) {
        return {
          ...t,
          verificationStatus: params.status,
          rejectionReason: params.rejectionReason,
          isNidVerified: isVerified ? !!params.isNidVerified : false,
          isStudentIdVerified: isVerified ? !!params.isStudentIdVerified : false,
          isAcademicVerified: isVerified ? !!params.isAcademicVerified : false,
          verifiedDate: isVerified ? new Date().toISOString().split('T')[0] : t.verifiedDate,
          badgeLevel: isVerified ? (params.badgeLevel || 'verified_pro') : 'none',
          trustScore: trustScore,
          verificationNotes: params.verificationNotes
        };
      }
      return t;
    });

    this.addNotification({
      userId: tutor.userId,
      title: isVerified ? '🎉 অভিনন্দন! আপনার KYC ভেরিফিকেশন সফল হয়েছে' : '⚠️ KYC ভেরিফিকেশন পুনর্বিবেচনা প্রয়োজন',
      message: isVerified
        ? `আপনার জাতীয় পরিচয়পত্র, স্টুডেন্ট আইডি ও সনদপত্র যাচাই সম্পন্ন হয়েছে। ট্রাস্ট স্কোর: ${trustScore}%`
        : `রিজেকশনের কারণ: ${params.rejectionReason || 'সঠিক ডকুমেন্ট আপলোড করুন'}`,
      type: 'verification'
    });

    this.logActivity('TUTOR_KYC_REVIEWED', `Tutor ${tutor.fullName} KYC set to ${params.status} (Score: ${trustScore}%) by ${params.performedBy || 'Admin'}`);
    this.saveState();
  }

  // Tuition Requests (Guardians)
  public createTuitionRequest(request: Omit<TuitionRequest, 'id' | 'createdAt' | 'status'>): TuitionRequest {
    const id = `req_${Date.now()}`;
    const newReq: TuitionRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.state.requests = [newReq, ...this.state.requests];

    this.addNotification({
      userId: 'user_admin_01',
      title: 'New Tuition Requirement Received',
      message: `${newReq.guardianName} requested a tutor for ${newReq.studentClass} in ${newReq.area}. Budget: ৳${newReq.monthlyBudget}`,
      type: 'job'
    });

    this.logActivity('TUITION_REQUEST_SUBMITTED', `New requirement ${id} submitted by ${newReq.guardianName}`);
    this.saveState();

    // Central server sync for multi-device delivery to Admin
    fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    }).then(() => {
      this.syncWithServer().catch(() => {});
    }).catch(() => {});

    return newReq;
  }

  public convertRequestToJob(requestId: string, jobOverrides?: Partial<TuitionJob>): TuitionJob {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');

    const jobId = `JOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newJob: TuitionJob = {
      id: jobId,
      title: `${req.studentClass} (${req.medium}) Tutor Needed in ${req.area}`,
      category: req.medium.includes('English Medium') ? 'English Medium' : req.medium.includes('Quran') ? 'Arabic & Quran' : 'Bangla Medium',
      classLevel: req.studentClass,
      medium: req.medium,
      subjects: req.subjects,
      district: req.location,
      area: req.area,
      daysPerWeek: req.daysPerWeek,
      preferredTime: req.preferredTime,
      teachingType: req.teachingType === 'both' ? 'home' : req.teachingType,
      salary: req.monthlyBudget,
      tutorGenderPreference: req.tutorGenderPreference,
      studentGender: req.studentGender,
      description: req.additionalRequirements || `Looking for an experienced and caring tutor for ${req.studentClass}. Weekly ${req.daysPerWeek} days.`,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      status: 'published',
      guardianRequestId: req.id,
      guardianId: req.guardianId,
      guardianName: req.guardianName,
      totalApplications: 0,
      ...jobOverrides
    };

    this.state.jobs = [newJob, ...this.state.jobs];
    this.state.requests = this.state.requests.map(r => r.id === requestId ? { ...r, status: 'converted_to_job' } : r);

    this.addNotification({
      userId: req.guardianId,
      title: 'Tuition Requirement Published to Job Board',
      message: `Your request has been approved and published as ${newJob.id}! Tutors are now applying.`,
      type: 'job'
    });

    this.notifyMatchingTutorsForJob(newJob);

    this.logActivity('REQUEST_CONVERTED_TO_JOB', `Converted request ${requestId} to job ${jobId}`);
    this.saveState();

    // Central server sync
    fetch(`/api/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'converted_to_job', createdJob: newJob })
    }).then(() => {
      this.syncWithServer().catch(() => {});
    }).catch(() => {});

    return newJob;
  }

  public updateTuitionRequest(requestId: string, updates: Partial<TuitionRequest>, performedBy: string = 'Admin') {
    this.state.requests = this.state.requests.map(r => r.id === requestId ? { ...r, ...updates } : r);
    this.logActivity('REQUEST_UPDATED', `Updated tuition requirement ${requestId}`, performedBy);
    this.saveState();

    fetch(`/api/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});
  }

  public deleteTuitionRequest(requestId: string, performedBy: string = 'Admin') {
    this.state.requests = this.state.requests.filter(r => r.id !== requestId);
    this.logActivity('REQUEST_DELETED', `Deleted tuition requirement ${requestId}`, performedBy);
    this.saveState();

    fetch(`/api/requests/${requestId}`, {
      method: 'DELETE'
    }).catch(() => {});
  }

  // Automatic Notification to matching tutors based on their preferred areas (Requirement 3)
  public notifyMatchingTutorsForJob(job: TuitionJob) {
    if (!job || job.status !== 'published') return;

    const jobArea = (job.area || '').toLowerCase().trim();
    const jobDistrict = (job.district || '').toLowerCase().trim();

    const matchingTutors = this.state.tutors.filter(t => {
      const areaMatches = Array.isArray(t.preferredAreas) && t.preferredAreas.some(area => {
        const a = area.toLowerCase().trim();
        return a === jobArea || jobArea.includes(a) || a.includes(jobArea);
      });
      const districtMatches = t.district && jobDistrict && t.district.toLowerCase().trim() === jobDistrict;
      return areaMatches || districtMatches;
    });

    matchingTutors.forEach(tutor => {
      const alreadyNotified = this.state.notifications.some(
        n => n.userId === tutor.userId && n.message.includes(job.id)
      );
      if (!alreadyNotified) {
        this.addNotification({
          userId: tutor.userId,
          title: `নতুন টিউশন অফার (${job.area})`,
          message: `আপনার পছন্দের এলাকা "${job.area}, ${job.district}"-এ নতুন টিউশন সার্কুলার [${job.id}] প্রকাশিত হয়েছে: ${job.title} (সম্মানী: ৳${job.salary.toLocaleString()}/মাস)। এখনই বিস্তারিত দেখুন ও আবেদন করুন!`,
          type: 'job',
          actionUrl: 'tuition-jobs'
        });
      }
    });
  }

  // Jobs Management (Admin Section 33)
  public createJob(jobData: Omit<TuitionJob, 'id' | 'totalApplications'>): TuitionJob {
    const id = `JOB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newJob: TuitionJob = {
      ...jobData,
      id,
      totalApplications: 0
    };
    this.state.jobs = [newJob, ...this.state.jobs];
    this.logActivity('JOB_CREATED', `Created tuition job ${id}`);
    
    if (newJob.status === 'published') {
      this.notifyMatchingTutorsForJob(newJob);
    }

    this.saveState();
    return newJob;
  }

  public editJob(jobId: string, updates: Partial<TuitionJob>) {
    this.state.jobs = this.state.jobs.map(j => j.id === jobId ? { ...j, ...updates } : j);
    this.logActivity('JOB_EDITED', `Updated tuition job ${jobId}`);

    const updatedJob = this.state.jobs.find(j => j.id === jobId);
    if (updatedJob && updatedJob.status === 'published') {
      this.notifyMatchingTutorsForJob(updatedJob);
    }

    this.saveState();
  }

  public updateJobStatus(jobId: string, status: TuitionJobStatus) {
    this.state.jobs = this.state.jobs.map(j => j.id === jobId ? { ...j, status } : j);
    this.logActivity('JOB_STATUS_UPDATED', `Set job ${jobId} status to ${status}`);

    if (status === 'published') {
      const updatedJob = this.state.jobs.find(j => j.id === jobId);
      if (updatedJob) {
        this.notifyMatchingTutorsForJob(updatedJob);
      }
    }

    this.saveState();
  }

  public deleteJob(jobId: string, performedBy: string = 'Admin') {
    this.state.jobs = this.state.jobs.filter(j => j.id !== jobId);
    this.logActivity('JOB_DELETED', `Deleted tuition job ${jobId}`, performedBy);
    this.saveState();
  }

  public assignTutorToJob(jobId: string, tutorId: string, tutorName: string) {
    this.state.jobs = this.state.jobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'filled',
          assignedTutorId: tutorId,
          assignedTutorName: tutorName,
          assignedDate: new Date().toISOString().split('T')[0]
        };
      }
      return j;
    });

    const tutor = this.getTutorById(tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'Appointed for Tuition Job!',
        message: `Congratulations! You have been officially assigned as tutor for ${jobId}.`,
        type: 'confirmation'
      });
    }

    this.logActivity('JOB_TUTOR_ASSIGNED', `Assigned ${tutorName} to job ${jobId}`);
    this.saveState();
  }

  // Applications
  public applyToJob(params: {
    jobId: string;
    tutorId: string;
    expectedSalary: number;
    coverNote: string;
  }): JobApplication {
    const existing = this.state.applications.find(a => a.jobId === params.jobId && a.tutorId === params.tutorId);
    if (existing) {
      throw new Error('You have already applied for this tuition job.');
    }

    const tutor = this.getTutorById(params.tutorId);
    if (!tutor) throw new Error('Tutor profile not found.');

    const job = this.state.jobs.find(j => j.id === params.jobId);
    if (!job) throw new Error('Job not found.');

    const appId = `app_${Date.now()}`;
    const newApp: JobApplication = {
      id: appId,
      jobId: params.jobId,
      tutorId: params.tutorId,
      tutorName: tutor.fullName,
      tutorPhoto: tutor.photo,
      tutorUniversity: tutor.university,
      tutorDepartment: tutor.department,
      tutorPhone: tutor.phone,
      expectedSalary: params.expectedSalary,
      coverNote: params.coverNote,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied'
    };

    this.state.applications = [newApp, ...this.state.applications];
    this.state.jobs = this.state.jobs.map(j => j.id === params.jobId ? { ...j, totalApplications: j.totalApplications + 1 } : j);

    if (job.guardianId) {
      this.addNotification({
        userId: job.guardianId,
        title: 'New Tutor Applied',
        message: `${tutor.fullName} (${tutor.university}) applied for tuition ${job.id}.`,
        type: 'application'
      });
    }

    this.addNotification({
      userId: 'user_admin_01',
      title: 'New Job Application',
      message: `${tutor.fullName} applied for ${job.id}.`,
      type: 'application'
    });

    this.logActivity('APPLICATION_SUBMITTED', `${tutor.fullName} applied for job ${job.id}`);
    this.saveState();

    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(() => {});

    return newApp;
  }

  public updateApplicationStatus(appId: string, status: JobApplication['status'], adminNote?: string, guardianNote?: string) {
    let targetApp: JobApplication | undefined;
    this.state.applications = this.state.applications.map(a => {
      if (a.id === appId) {
        targetApp = { ...a, status, adminNote: adminNote ?? a.adminNote, guardianNote: guardianNote ?? a.guardianNote };
        return targetApp;
      }
      return a;
    });

    if (targetApp) {
      const tutor = this.getTutorById(targetApp.tutorId);
      if (tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: `Application Update: ${status.replace('_', ' ').toUpperCase()}`,
          message: `Your application for ${targetApp.jobId} has been updated to: ${status.replace('_', ' ')}.`,
          type: 'application'
        });
      }
    }

    this.saveState();

    fetch(`/api/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote, guardianNote })
    }).catch(() => {});
  }

  public editApplication(appId: string, updates: Partial<JobApplication>, performedBy: string = 'Admin') {
    this.state.applications = this.state.applications.map(a => a.id === appId ? { ...a, ...updates } : a);
    this.logActivity('APPLICATION_EDITED', `Updated application ${appId}`, performedBy);
    this.saveState();

    fetch(`/api/applications/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});
  }

  public deleteApplication(appId: string, performedBy: string = 'Admin') {
    const app = this.state.applications.find(a => a.id === appId);
    if (app) {
      this.state.applications = this.state.applications.filter(a => a.id !== appId);
      this.state.jobs = this.state.jobs.map(j => {
        if (j.id === app.jobId && j.totalApplications > 0) {
          return { ...j, totalApplications: j.totalApplications - 1 };
        }
        return j;
      });
      this.logActivity('APPLICATION_DELETED', `Deleted application ${appId} for job ${app.jobId}`, performedBy);
      this.saveState();

      fetch(`/api/applications/${appId}`, {
        method: 'DELETE'
      }).catch(() => {});
    }
  }

  public clearAllRequestsAndApplications(performedBy: string = 'Admin') {
    this.state.requests = [];
    this.state.jobs = [];
    this.state.applications = [];
    this.logActivity('DATA_RESET', `Cleared all demo guardian requests, tuition circulars and tutor applications`, performedBy);
    this.saveState();
    this.notify();

    fetch('/api/reset-demo', {
      method: 'POST'
    }).catch(() => {});
  }

  // Shortlisting
  public toggleShortlist(guardianId: string, tutorId: string) {
    const exists = this.state.shortlists.some(s => s.guardianId === guardianId && s.tutorId === tutorId);
    if (exists) {
      this.state.shortlists = this.state.shortlists.filter(s => !(s.guardianId === guardianId && s.tutorId === tutorId));
    } else {
      this.state.shortlists = [...this.state.shortlists, { guardianId, tutorId }];
      const tutor = this.getTutorById(tutorId);
      if (tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: 'You Were Shortlisted!',
          message: 'A guardian has added your profile to their shortlist for tuition consideration.',
          type: 'application'
        });
      }
    }
    this.saveState();
  }

  public isShortlisted(guardianId: string, tutorId: string): boolean {
    return this.state.shortlists.some(s => s.guardianId === guardianId && s.tutorId === tutorId);
  }

  // Demo Classes (Feature 4: Free Demo Class Booking & Scheduling System)
  public scheduleDemoClass(demoData: Omit<DemoClass, 'id'>): DemoClass {
    const id = `demo_${Date.now()}`;
    const newDemo: DemoClass = { 
      ...demoData, 
      id,
      meetingLink: demoData.meetingLink || (demoData.mode === 'online' ? `https://meet.google.com/tuh-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}` : undefined),
      createdAt: demoData.createdAt || new Date().toISOString().split('T')[0]
    };
    this.state.demos = [newDemo, ...this.state.demos];

    const tutor = this.getTutorById(demoData.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'নতুন ফ্রি ডেমো ক্লাস বুকিং! (New Demo Request)',
        message: `${demoData.guardianName} আপনার সাথে ${demoData.date} তারিখে ${demoData.time}-এ একটি ডেমো ক্লাস বুক করেছেন। বিষয়: ${demoData.subject || 'সাধারণ পাঠদান'}।`,
        type: 'demo'
      });
    }

    this.addNotification({
      userId: demoData.guardianId,
      title: 'ফ্রি ডেমো ক্লাস নিশ্চিতকরণ',
      message: `শিক্ষক ${demoData.tutorName}-এর সাথে আপনার ডেমো ক্লাস নির্ধারিত হয়েছে। তারিখ: ${demoData.date}, সময়: ${demoData.time}।`,
      type: 'demo'
    });

    this.logActivity('DEMO_SCHEDULED', `Scheduled demo for tutor ${demoData.tutorName} on ${demoData.date}`);
    this.saveState();
    return newDemo;
  }

  public bookFreeDemo(data: {
    tutorId: string;
    tutorName: string;
    tutorPhone?: string;
    tutorPhoto?: string;
    tutorUniversity?: string;
    guardianId: string;
    guardianName: string;
    guardianPhone: string;
    studentName: string;
    studentGrade: string;
    subject: string;
    date: string;
    time: string;
    mode: 'home' | 'online';
    location?: string;
    notes?: string;
    jobId?: string;
    jobTitle?: string;
  }): DemoClass {
    const tutor = this.getTutorById(data.tutorId);
    const tutorPhoto = data.tutorPhoto || tutor?.photo;
    const tutorUniversity = data.tutorUniversity || tutor?.university;
    const tutorPhone = data.tutorPhone || tutor?.phone || '01711223344';

    return this.scheduleDemoClass({
      tutorId: data.tutorId,
      tutorName: data.tutorName,
      tutorPhone,
      tutorPhoto,
      tutorUniversity,
      guardianId: data.guardianId,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      jobId: data.jobId || `JOB-DEMO-${Date.now().toString().slice(-4)}`,
      jobTitle: data.jobTitle || `${data.studentGrade} - ${data.subject} ফ্রি ডেমো ক্লাস`,
      studentName: data.studentName,
      studentGrade: data.studentGrade,
      subject: data.subject,
      location: data.location || (data.mode === 'home' ? 'অভিভাবকের বাসা' : 'অনলাইন সেশন'),
      date: data.date,
      time: data.time,
      mode: data.mode,
      notes: data.notes || 'অভিভাবক কর্তৃক ফ্রি ট্রায়াল ডেমো ক্লাস বুকিং।',
      status: 'scheduled'
    });
  }

  public rescheduleDemo(demoId: string, newDate: string, newTime: string, reason?: string) {
    this.state.demos = this.state.demos.map(d => {
      if (d.id === demoId) {
        return {
          ...d,
          date: newDate,
          time: newTime,
          status: 'rescheduled',
          notes: reason ? `${d.notes || ''} [রি-শিডিউল কারণ: ${reason}]` : d.notes
        };
      }
      return d;
    });

    const targetDemo = this.state.demos.find(d => d.id === demoId);
    if (targetDemo) {
      const tutor = this.getTutorById(targetDemo.tutorId);
      if (tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: 'ডেমো ক্লাসের সময় পরিবর্তন হয়েছে (Rescheduled)',
          message: `${targetDemo.guardianName}-এর ডেমো ক্লাসের নতুন সময়: ${newDate}, ${newTime}।`,
          type: 'demo'
        });
      }
      this.addNotification({
        userId: targetDemo.guardianId,
        title: 'ডেমো ক্লাসের সময় আপডেট হয়েছে',
        message: `শিক্ষক ${targetDemo.tutorName}-এর সাথে ডেমো ক্লাসের নতুন সময়: ${newDate}, ${newTime}।`,
        type: 'demo'
      });
    }

    this.logActivity('DEMO_RESCHEDULED', `Demo ${demoId} rescheduled to ${newDate} at ${newTime}`);
    this.saveState();
  }

  public cancelDemo(demoId: string, reason?: string) {
    this.state.demos = this.state.demos.map(d => {
      if (d.id === demoId) {
        return {
          ...d,
          status: 'cancelled',
          notes: reason ? `${d.notes || ''} [বাতিলের কারণ: ${reason}]` : d.notes
        };
      }
      return d;
    });

    const targetDemo = this.state.demos.find(d => d.id === demoId);
    if (targetDemo) {
      const tutor = this.getTutorById(targetDemo.tutorId);
      if (tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: 'ডেমো ক্লাস বাতিল হয়েছে',
          message: `${targetDemo.guardianName}-এর সাথে ডেমো ক্লাসটি বাতিল করা হয়েছে। কারণ: ${reason || 'অভিভাবকের অনুরোধ'}`,
          type: 'demo'
        });
      }
    }

    this.logActivity('DEMO_CANCELLED', `Demo ${demoId} was cancelled`);
    this.saveState();
  }

  public deleteDemoClass(demoId: string, performedBy: string = 'Admin') {
    const demo = this.state.demos.find(d => d.id === demoId);
    this.state.demos = this.state.demos.filter(d => d.id !== demoId);
    this.logActivity('DEMO_DELETED', `Deleted demo class ${demoId} (${demo?.tutorName || ''})`, performedBy);
    this.saveState();

    fetch(`/api/demos/${demoId}`, { method: 'DELETE' }).catch(() => {});
  }

  public updateDemoResult(
    demoId: string, 
    result: 'selected' | 'not_selected' | 'further_review', 
    guardianFeedback?: string, 
    tutorFeedback?: string
  ) {
    this.state.demos = this.state.demos.map(d => {
      if (d.id === demoId) {
        return {
          ...d,
          result,
          status: 'completed',
          guardianFeedback: guardianFeedback || d.guardianFeedback,
          tutorFeedback: tutorFeedback || d.tutorFeedback
        };
      }
      return d;
    });

    const targetDemo = this.state.demos.find(d => d.id === demoId);
    if (targetDemo) {
      const tutor = this.getTutorById(targetDemo.tutorId);
      if (tutor) {
        const msg = result === 'selected' 
          ? `অভিনন্দন! ডেমো ক্লাস সফল হয়েছে এবং অভিভাবক আপনাকে নির্বাচন করেছেন।`
          : `ডেমো ক্লাসের ফলাফল আপডেট হয়েছে: ${result}।`;
        this.addNotification({
          userId: tutor.userId,
          title: 'ডেমো ক্লাসের মূল্যায়ন ফলাফল',
          message: msg,
          type: 'demo'
        });
      }
    }

    this.logActivity('DEMO_RESULT_UPDATED', `Demo ${demoId} result updated to ${result}`);
    this.saveState();
  }

  public hireTutorAfterDemo(
    demoId: string, 
    monthlyFee: number, 
    daysPerWeek: number, 
    startDate: string,
    location?: string,
    specialInstructions?: string
  ): TuitionConfirmation | null {
    const demo = this.state.demos.find(d => d.id === demoId);
    if (!demo) return null;

    // 1. Mark demo as completed and selected
    this.updateDemoResult(demoId, 'selected', 'অভিভাবক কর্তৃক ডেমো ক্লাসের পর সরাসরি টিউশন কনফার্ম করা হয়েছে।');

    // 2. Create official TuitionConfirmation
    const newConf = this.confirmTuition({
      tutorId: demo.tutorId,
      tutorName: demo.tutorName,
      guardianId: demo.guardianId,
      guardianName: demo.guardianName,
      studentName: demo.studentName || 'শিক্ষার্থী',
      jobId: demo.jobId,
      jobTitle: demo.jobTitle,
      startDate: startDate || new Date().toISOString().split('T')[0],
      monthlyFee: monthlyFee || 7000,
      daysPerWeek: daysPerWeek || 3,
      scheduleTime: demo.time || 'সন্ধ্যা ৬:০০ টা',
      location: location || demo.location || 'অভিভাবকের বাসা',
      teachingMode: demo.mode,
      specialInstructions: specialInstructions || 'ফ্রি ডেমো ক্লাসের সন্তোষজনক মূল্যায়নের ভিত্তিতে চূড়ান্ত টিউশন নিয়োগ।',
      status: 'confirmed'
    });

    return newConf;
  }

  // Tuition Confirmation
  public confirmTuition(confirmationData: Omit<TuitionConfirmation, 'id'>): TuitionConfirmation {
    const id = `conf_${Date.now()}`;
    const newConf: TuitionConfirmation = { ...confirmationData, id };
    this.state.confirmations = [newConf, ...this.state.confirmations];

    const tutor = this.getTutorById(confirmationData.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'Tuition Confirmed!',
        message: `Tuition with ${confirmationData.guardianName} for ${confirmationData.studentName} is confirmed! Start date: ${confirmationData.startDate}`,
        type: 'confirmation'
      });
    }

    this.logActivity('TUITION_CONFIRMED', `Confirmed tuition ${id} between tutor ${confirmationData.tutorName} and guardian ${confirmationData.guardianName}`);
    this.saveState();
    return newConf;
  }

  // Feature 5: Tuition Agreement, Attendance Log, Salary Receipts & Verified Certificates
  public updateConfirmationStatus(confId: string, status: 'confirmed' | 'cancelled' | 'completed') {
    this.state.confirmations = this.state.confirmations.map(c => {
      if (c.id === confId) {
        return { ...c, status };
      }
      return c;
    });

    const target = this.state.confirmations.find(c => c.id === confId);
    if (target) {
      const tutor = this.getTutorById(target.tutorId);
      if (tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: `টিউশন স্ট্যাটাস আপডেট: ${status.toUpperCase()}`,
          message: `${target.guardianName}-এর সাথে "${target.jobTitle}" টিউশনের স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}।`,
          type: 'confirmation'
        });
      }
      this.addNotification({
        userId: target.guardianId,
        title: `টিউশন চুক্তি স্ট্যাটাস আপডেট`,
        message: `শিক্ষক ${target.tutorName}-এর সাথে টিউশন স্ট্যাটাস: ${status}।`,
        type: 'confirmation'
      });
    }

    this.logActivity('CONFIRMATION_STATUS_UPDATED', `Tuition ${confId} status updated to ${status}`);
    this.saveState();
  }

  public deleteTuitionConfirmation(confId: string, performedBy: string = 'Admin') {
    const conf = this.state.confirmations.find(c => c.id === confId);
    this.state.confirmations = this.state.confirmations.filter(c => c.id !== confId);
    this.logActivity('CONFIRMATION_DELETED', `Deleted tuition confirmation ${confId} (${conf?.jobTitle || ''})`, performedBy);
    this.saveState();

    fetch(`/api/confirmations/${confId}`, { method: 'DELETE' }).catch(() => {});
  }

  // Feature 5: Class Attendance & Study Log Tracker
  public logClassAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const id = `att_${Date.now()}`;
    const newRecord: AttendanceRecord = {
      ...record,
      id,
      durationMinutes: record.durationMinutes || 90,
      time: record.time || '০৫:৩০ PM',
      verifiedByGuardian: record.verifiedByGuardian || false
    };
    this.state.attendance = [newRecord, ...this.state.attendance];

    // Increment completed classes count in TuitionConfirmation if matching
    this.state.confirmations = this.state.confirmations.map(c => {
      if ((c.jobId && c.jobId === record.jobId) || (c.tutorId === record.tutorId && c.guardianId === record.guardianId)) {
        return {
          ...c,
          completedClassesCount: (c.completedClassesCount || 0) + 1
        };
      }
      return c;
    });

    // Notify Guardian of class log
    this.addNotification({
      userId: record.guardianId,
      title: 'নতুন ক্লাস হাজিরা ও পড়া লগ করা হয়েছে',
      message: `শিক্ষক ${record.tutorName} আজকের ক্লাস সম্পন্ন করেছেন। শিক্ষার্থী: ${record.studentName}। বিষয়/পাঠ: ${record.topicsCovered || record.notes || 'সাধারণ পাঠদান'}। হাজিরা ভেরিফাই করুন।`,
      type: 'system'
    });

    this.logActivity('ATTENDANCE_LOGGED', `Tutor ${record.tutorName} logged attendance for ${record.studentName} on ${record.date}`);
    this.saveState();
    return newRecord;
  }

  public verifyAttendance(attendanceId: string, verified: boolean = true) {
    this.state.attendance = this.state.attendance.map(a => {
      if (a.id === attendanceId) {
        return {
          ...a,
          verifiedByGuardian: verified,
          verifiedDate: verified ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return a;
    });

    const target = this.state.attendance.find(a => a.id === attendanceId);
    if (target) {
      const tutor = this.getTutorById(target.tutorId);
      if (tutor && verified) {
        this.addNotification({
          userId: tutor.userId,
          title: 'ক্লাস হাজিরা সত্যায়িত হয়েছে ✓',
          message: `অভিভাবক ${target.date} তারিখের (${target.studentName}) ক্লাস উপস্থিতি ও পাঠ অনুমোদন করেছেন।`,
          type: 'system'
        });
      }
    }

    this.logActivity('ATTENDANCE_VERIFIED', `Attendance ${attendanceId} verified: ${verified}`);
    this.saveState();
  }

  public deleteAttendance(attendanceId: string) {
    this.state.attendance = this.state.attendance.filter(a => a.id !== attendanceId);
    this.logActivity('ATTENDANCE_DELETED', `Attendance ${attendanceId} removed`);
    this.saveState();
  }

  // Feature 5: Tuition Salary & Fee Payment Receipts
  public recordTuitionPayment(paymentData: {
    confId?: string;
    tutorId: string;
    tutorName: string;
    guardianId: string;
    guardianName: string;
    studentName?: string;
    jobId: string;
    amount: number;
    month: string;
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash';
    transactionId?: string;
    notes?: string;
  }): PaymentRecord {
    const id = `PAY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const receiptNumber = `TH-REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: PaymentRecord = {
      id,
      tutorId: paymentData.tutorId,
      tutorName: paymentData.tutorName,
      guardianId: paymentData.guardianId,
      guardianName: paymentData.guardianName,
      studentName: paymentData.studentName || 'শিক্ষার্থী',
      jobId: paymentData.jobId,
      amount: paymentData.amount,
      month: paymentData.month,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId || `TRX${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      receiptNumber,
      paidAt: new Date().toISOString(),
      acknowledgedByTutor: false,
      notes: paymentData.notes || `${paymentData.month} মাসের টিউশন ফি পরিশোধিত।`
    };

    // If there was an existing 'due' payment for the same tutor, guardian and month, update or replace it
    const existingDueIndex = this.state.payments.findIndex(
      p => p.tutorId === paymentData.tutorId && p.guardianId === paymentData.guardianId && p.month === paymentData.month && p.status === 'due'
    );

    if (existingDueIndex >= 0) {
      this.state.payments[existingDueIndex] = newPayment;
    } else {
      this.state.payments = [newPayment, ...this.state.payments];
    }

    const tutor = this.getTutorById(paymentData.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'টিউশন ফি / বেতন জমা হয়েছে! ৳' + paymentData.amount.toLocaleString(),
        message: `${paymentData.guardianName} আপনার ${paymentData.month}-এর বেতন পরিশোধ করেছেন (${paymentData.paymentMethod.toUpperCase()} TrxID: ${newPayment.transactionId})। মানি রিসিট নং: ${receiptNumber}।`,
        type: 'payment'
      });
    }

    this.addNotification({
      userId: paymentData.guardianId,
      title: 'পেমেন্ট সফল ও ডিজিটাল মানি রিসিট প্রস্তুত',
      message: `শিক্ষক ${paymentData.tutorName}-কে ৳${paymentData.amount.toLocaleString()} সফলভাবে পরিশোধ হয়েছে। মানি রিসিট নং: ${receiptNumber}।`,
      type: 'payment'
    });

    this.logActivity('PAYMENT_RECORDED', `Payment of ৳${paymentData.amount} recorded by ${paymentData.guardianName} for tutor ${paymentData.tutorName} (Receipt: ${receiptNumber})`);
    this.saveState();
    return newPayment;
  }

  public acknowledgePayment(paymentId: string) {
    this.state.payments = this.state.payments.map(p => {
      if (p.id === paymentId) {
        return { ...p, acknowledgedByTutor: true };
      }
      return p;
    });

    const target = this.state.payments.find(p => p.id === paymentId);
    if (target) {
      this.addNotification({
        userId: target.guardianId,
        title: 'শিক্ষক কর্তৃক বেতন প্রাপ্তি নিশ্চিতকরণ ✓',
        message: `শিক্ষক ${target.tutorName} ${target.month}-এর বেতন (৳${target.amount.toLocaleString()}) হস্তগত হওয়ার স্বীকৃতি দিয়েছেন।`,
        type: 'payment'
      });
    }

    this.logActivity('PAYMENT_ACKNOWLEDGED', `Payment ${paymentId} acknowledged by tutor`);
    this.saveState();
  }

  public requestSalaryInvoice(tutorId: string, guardianId: string, jobId: string, month: string, amount: number, notes?: string): PaymentRecord {
    const id = `PAY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const tutor = this.getTutorById(tutorId);
    const guardian = this.getUserById(guardianId);

    const newBill: PaymentRecord = {
      id,
      tutorId,
      tutorName: tutor?.fullName || 'শিক্ষক',
      guardianId,
      guardianName: guardian?.name || 'অভিভাবক',
      jobId,
      amount,
      month,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'due',
      notes: notes || `${month} মাসের নিয়মিত টিউশন ফি রিকুয়েস্ট।`
    };

    this.state.payments = [newBill, ...this.state.payments];

    this.addNotification({
      userId: guardianId,
      title: `টিউশন বেতনের বিল এসেছে: ${month}`,
      message: `শিক্ষক ${tutor?.fullName || 'টিউটর'} ${month} মাসের সম্মানী বাবদ ৳${amount.toLocaleString()} পরিশোধের অনুরোধ পাঠিয়েছেন। প্ল্যাটফর্মে বিকাশ/নগদে পরিশোধ করে রিসিট সংগ্রহ করুন।`,
      type: 'payment'
    });

    this.logActivity('INVOICE_REQUESTED', `Tutor ${tutor?.fullName} sent salary invoice of ৳${amount} for ${month} to guardian`);
    this.saveState();
    return newBill;
  }

  // Legacy Attendance & Payment helpers (for backwards compatibility)
  public addAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    return this.logClassAttendance(record);
  }

  public addPayment(record: Omit<PaymentRecord, 'id'>): PaymentRecord {
    const id = `PAY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: PaymentRecord = { ...record, id };
    this.state.payments = [newRecord, ...this.state.payments];
    this.saveState();
    return newRecord;
  }

  public updatePaymentStatus(paymentId: string, status: PaymentRecord['status']) {
    this.state.payments = this.state.payments.map(p => p.id === paymentId ? { ...p, status } : p);
    this.saveState();
  }

  public deletePayment(paymentId: string, performedBy: string = 'Admin') {
    this.state.payments = this.state.payments.filter(p => p.id !== paymentId);
    this.logActivity('PAYMENT_DELETED', `Deleted payment record ${paymentId}`, performedBy);
    this.saveState();

    fetch(`/api/payments/${paymentId}`, { method: 'DELETE' }).catch(() => {});
  }

  // Feature 5: Experience Certificate Management
  public issueCertificate(cert: Omit<CertificateRecord, 'id' | 'verificationCode'>): CertificateRecord {
    const id = `CERT-TH-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = `TH-VER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: CertificateRecord = {
      ...cert,
      id,
      verificationCode,
      gradeHonor: cert.gradeHonor || 'Outstanding Mentor',
      issuedBy: cert.issuedBy || 'TutorHat Academic Verification Board'
    };
    this.state.certificates = [newCert, ...this.state.certificates];

    const tutor = this.getTutorById(cert.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'নতুন অফিসিয়াল সার্টিফিকেট প্রদান করা হয়েছে! 🎖️',
        message: `অভিনন্দন! আপনাকে "${cert.title}" প্রশংসাপত্র ও এক্সপেরিয়েন্স সার্টিফিকেট প্রদান করা হয়েছে। ভেরিফিকেশন আইডি: ${verificationCode}। ড্যাশবোর্ড থেকে সার্টিফিকেট ডাউনলোড/প্রিন্ট করুন।`,
        type: 'system'
      });
    }

    this.logActivity('CERTIFICATE_ISSUED', `Issued certificate "${cert.title}" to tutor ${cert.tutorName} (${verificationCode})`);
    this.saveState();
    return newCert;
  }

  public revokeCertificate(certId: string) {
    this.updateCertificateStatus(certId, 'revoked');
    this.logActivity('CERTIFICATE_REVOKED', `Certificate ${certId} was revoked`);
    this.saveState();
  }

  public updateCertificateStatus(certId: string, status: 'active' | 'revoked') {
    this.state.certificates = this.state.certificates.map(c => {
      if (c.id === certId) {
        return { ...c, status };
      }
      return c;
    });
    this.saveState();
  }

  public deleteCertificate(certId: string, performedBy: string = 'Admin') {
    this.state.certificates = this.state.certificates.filter(c => c.id !== certId);
    this.logActivity('CERTIFICATE_DELETED', `Deleted certificate ${certId}`, performedBy);
    this.saveState();

    fetch(`/api/certificates/${certId}`, { method: 'DELETE' }).catch(() => {});
  }

  public getUserById(userId: string): User | undefined {
    return this.state.users.find(u => u.id === userId);
  }

  // Feature 2: Reviews & Ratings System
  public submitReview(review: Omit<ReviewRecord, 'id' | 'date' | 'status'>): ReviewRecord {
    const id = `rev_${Date.now()}`;
    const newReview: ReviewRecord = {
      ...review,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      helpfulCount: review.helpfulCount || 0
    };
    this.state.reviews = [newReview, ...this.state.reviews];

    const tutor = this.getTutorById(review.tutorId);

    // Notify Admin for Moderation
    this.addNotification({
      userId: 'user_admin_01',
      title: 'নতুন টিউটর রিভিউ পেন্ডিং',
      message: `${review.guardianName} টিউটর ${tutor ? tutor.fullName : review.tutorId}-কে ${review.rating}★ রেটিং ও রিভিউ দিয়েছেন।`,
      type: 'system'
    });

    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'আপনার প্রোফাইলে নতুন রিভিউ এসেছে',
        message: `${review.guardianName} আপনাকে ${review.rating}★ রেটিং দিয়েছেন। অ্যাডমিন পর্যালোচনার পর এটি প্রদর্শিত হবে।`,
        type: 'system'
      });
    }

    this.logActivity('REVIEW_SUBMITTED', `Review submitted by ${review.guardianName} for tutor ${tutor?.fullName || review.tutorId}`);
    this.saveState();
    return newReview;
  }

  public moderateReview(reviewId: string, status: 'approved' | 'rejected' | 'pending', isVerifiedTuition?: boolean) {
    this.state.reviews = this.state.reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          status,
          ...(isVerifiedTuition !== undefined ? { isVerifiedTuition } : {})
        };
      }
      return r;
    });

    const target = this.state.reviews.find(r => r.id === reviewId);
    if (target) {
      const tutor = this.getTutorById(target.tutorId);
      const tutorApprovedReviews = this.state.reviews.filter(r => r.tutorId === target.tutorId && r.status === 'approved');
      
      if (tutorApprovedReviews.length > 0) {
        const avg = tutorApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / tutorApprovedReviews.length;
        this.updateTutorProfile(target.tutorId, {
          rating: Number(avg.toFixed(1)),
          totalReviews: tutorApprovedReviews.length
        });
      } else if (tutor) {
        this.updateTutorProfile(target.tutorId, {
          totalReviews: 0
        });
      }

      if (status === 'approved' && tutor) {
        this.addNotification({
          userId: tutor.userId,
          title: 'রিভিউ অনুমোদিত ও প্রকাশিত হয়েছে',
          message: `${target.guardianName}-এর দেওয়া ${target.rating}★ রিভিউ আপনার প্রোফাইলে যুক্ত হয়েছে।`,
          type: 'system'
        });
      }
    }

    this.logActivity('REVIEW_MODERATED', `Review ${reviewId} was ${status}`);
    this.saveState();
  }

  public replyToReview(reviewId: string, replyText: string, tutorName?: string) {
    const review = this.state.reviews.find(r => r.id === reviewId);
    if (!review) return;

    const tutor = this.getTutorById(review.tutorId);
    const resolvedName = tutorName || tutor?.fullName || 'শিক্ষক';

    this.state.reviews = this.state.reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          tutorReply: {
            tutorName: resolvedName,
            replyText,
            repliedAt: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    });

    // Notify Guardian of Tutor's Reply
    this.addNotification({
      userId: review.guardianId,
      title: 'আপনার রিভিউতে টিউটর মন্তব্য করেছেন',
      message: `${resolvedName} আপনার রিভিউতে উত্তর দিয়েছেন: "${replyText.slice(0, 50)}..."`,
      type: 'system'
    });

    this.logActivity('REVIEW_REPLIED', `Tutor replied to review ${reviewId}`);
    this.saveState();
  }

  public markReviewHelpful(reviewId: string) {
    this.state.reviews = this.state.reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpfulCount: (r.helpfulCount || 0) + 1
        };
      }
      return r;
    });
    this.saveState();
  }

  public deleteReview(reviewId: string) {
    const target = this.state.reviews.find(r => r.id === reviewId);
    this.state.reviews = this.state.reviews.filter(r => r.id !== reviewId);
    
    if (target) {
      const tutorApprovedReviews = this.state.reviews.filter(r => r.tutorId === target.tutorId && r.status === 'approved');
      const avg = tutorApprovedReviews.length > 0 
        ? tutorApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / tutorApprovedReviews.length
        : 5.0;
      this.updateTutorProfile(target.tutorId, {
        rating: Number(avg.toFixed(1)),
        totalReviews: tutorApprovedReviews.length
      });
    }

    this.logActivity('REVIEW_DELETED', `Deleted review ${reviewId}`);
    this.saveState();
  }

  // Notice Board (Section 35)
  public createNotice(noticeData: Omit<NoticeItem, 'id' | 'publishedDate'>): NoticeItem {
    const id = `not_${Date.now()}`;
    const newNotice: NoticeItem = {
      ...noticeData,
      id,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    this.state.notices = [newNotice, ...this.state.notices];
    this.logActivity('NOTICE_CREATED', `Created notice: "${newNotice.title}"`);
    this.saveState();
    return newNotice;
  }

  public updateNotice(noticeId: string, updates: Partial<NoticeItem>) {
    this.state.notices = this.state.notices.map(n => n.id === noticeId ? { ...n, ...updates } : n);
    this.saveState();
  }

  public deleteNotice(noticeId: string) {
    this.state.notices = this.state.notices.filter(n => n.id !== noticeId);
    this.saveState();
  }

  public getPublishedNotices(category?: string): NoticeItem[] {
    return this.state.notices.filter(n => {
      if (n.status !== 'published') return false;
      if (!category || category === 'all' || category === 'general') return true;
      return n.category === category || n.category === 'general';
    });
  }

  // Contact Messages (Section 37)
  public submitContactMessage(msgData: Omit<ContactMessage, 'id' | 'date' | 'status'>): ContactMessage {
    const id = `msg_${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msgData,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'unread'
    };
    this.state.messages = [newMsg, ...this.state.messages];

    this.addNotification({
      userId: 'user_admin_01',
      title: 'New Contact Inquiry Received',
      message: `${newMsg.name} sent message: "${newMsg.subject}"`,
      type: 'system'
    });

    this.logActivity('CONTACT_MESSAGE_RECEIVED', `Inquiry received from ${newMsg.name} (${newMsg.mobile})`);
    this.saveState();
    return newMsg;
  }

  public updateMessageStatus(msgId: string, status: ContactMessage['status']) {
    this.state.messages = this.state.messages.map(m => m.id === msgId ? { ...m, status } : m);
    this.saveState();
  }

  // Referral System (Section 36)
  public createReferral(data: Omit<ReferralRecord, 'id' | 'date'>): ReferralRecord {
    const id = `ref_${Date.now()}`;
    const newRef: ReferralRecord = {
      ...data,
      id,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.referrals = [newRef, ...this.state.referrals];
    this.saveState();
    return newRef;
  }

  public getUserReferrals(userId: string): ReferralRecord[] {
    return this.state.referrals.filter(r => r.referrerId === userId || r.referredUserId === userId);
  }

  public updateReferralStatus(referralId: string, status: ReferralRecord['status'], rewardStatus?: ReferralRecord['rewardStatus']) {
    this.state.referrals = this.state.referrals.map(r => {
      if (r.id === referralId) {
        return {
          ...r,
          status,
          rewardStatus: rewardStatus || r.rewardStatus
        };
      }
      return r;
    });
    this.logActivity('REFERRAL_UPDATED', `Updated referral ${referralId} status to ${status}`);
    this.saveState();
  }

  public deleteReferral(referralId: string, performedBy: string = 'Admin') {
    this.state.referrals = this.state.referrals.filter(r => r.id !== referralId);
    this.logActivity('REFERRAL_DELETED', `Deleted referral record ${referralId}`, performedBy);
    this.saveState();
  }

  // Admin Notes (Section 34, 42)
  public addAdminNote(entityType: AdminNote['entityType'], entityId: string, note: string, createdBy: string) {
    const id = `anote_${Date.now()}`;
    const newNote: AdminNote = {
      id,
      entityType,
      entityId,
      note,
      createdBy,
      createdAt: new Date().toISOString()
    };
    this.state.adminNotes = [newNote, ...this.state.adminNotes];
    this.saveState();
    return newNote;
  }

  public getAdminNotes(entityType: AdminNote['entityType'], entityId: string): AdminNote[] {
    return this.state.adminNotes.filter(n => n.entityType === entityType && n.entityId === entityId);
  }

  // Activity Log
  public logActivity(action: string, details: string, performedBy: string = 'System') {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newLog: ActivityLog = {
      id,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      details
    };
    this.state.activityLogs = [newLog, ...this.state.activityLogs.slice(0, 199)];
    this.saveState();
  }

  // Admin Management (Section: Step 4)
  public getAdmins(): User[] {
    return this.state.users.filter(u => u.role === 'admin');
  }

  public createAdmin(data: {
    name: string;
    email: string;
    phone: string;
    adminRoleLevel?: AdminRoleLevel;
    pin?: string;
  }, performedBy: string = 'Super Admin'): User {
    const id = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newAdmin: User = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'admin',
      adminRoleLevel: data.adminRoleLevel || 'moderator',
      gender: 'male',
      location: 'Dhaka, Bangladesh',
      district: 'Dhaka',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.state.users = [newAdmin, ...this.state.users];
    this.logActivity('ADMIN_CREATED', `Created new admin account for ${newAdmin.name} (${newAdmin.email}) [${newAdmin.adminRoleLevel}]`, performedBy);
    this.saveState();
    return newAdmin;
  }

  public updateAdminRole(adminId: string, roleLevel: AdminRoleLevel, performedBy: string = 'Super Admin'): User | undefined {
    let updated: User | undefined;
    this.state.users = this.state.users.map(u => {
      if (u.id === adminId && u.role === 'admin') {
        updated = { ...u, adminRoleLevel: roleLevel };
        return updated;
      }
      return u;
    });
    if (updated) {
      this.logActivity('ADMIN_ROLE_UPDATED', `Updated admin ${updated.name} role to ${roleLevel}`, performedBy);
      this.saveState();
    }
    return updated;
  }

  public updateAdminStatus(adminId: string, status: 'active' | 'suspended', performedBy: string = 'Super Admin'): User | undefined {
    let updated: User | undefined;
    this.state.users = this.state.users.map(u => {
      if (u.id === adminId && u.role === 'admin') {
        updated = { ...u, status };
        return updated;
      }
      return u;
    });
    if (updated) {
      this.logActivity('ADMIN_STATUS_UPDATED', `Changed admin ${updated.name} status to ${status}`, performedBy);
      this.saveState();
    }
    return updated;
  }

  public deleteAdmin(adminId: string, currentAdminId: string, performedBy: string = 'Super Admin'): { success: boolean; message: string } {
    if (adminId === currentAdminId) {
      return { success: false, message: 'You cannot revoke or delete your own active admin account!' };
    }
    const adminCount = this.state.users.filter(u => u.role === 'admin').length;
    if (adminCount <= 1) {
      return { success: false, message: 'Cannot delete the only existing administrator account.' };
    }
    const target = this.state.users.find(u => u.id === adminId);
    if (!target) {
      return { success: false, message: 'Admin account not found.' };
    }
    this.state.users = this.state.users.filter(u => u.id !== adminId);
    this.logActivity('ADMIN_DELETED', `Revoked and deleted admin account ${target.name} (${target.email})`, performedBy);
    this.saveState();
    return { success: true, message: `Admin ${target.name} deleted successfully.` };
  }

  public clearActivityLogs(performedBy: string = 'Super Admin') {
    this.state.activityLogs = [{
      id: `act_${Date.now()}`,
      action: 'AUDIT_LOGS_RESET',
      performedBy,
      timestamp: new Date().toISOString(),
      details: 'Audit logs cleared and reset by administrator.'
    }];
    this.saveState();
  }

  public deleteActivityLog(logId: string, performedBy: string = 'Admin') {
    this.state.activityLogs = this.state.activityLogs.filter(l => l.id !== logId);
    this.saveState();
  }

  // Data Export (CSV with UTF-8 BOM for Google Sheets & Excel)
  public exportDataToCSV(type: 'jobs' | 'tutors' | 'guardians' | 'requests' | 'applications' | 'activityLogs' | 'all'): string {
    const sanitize = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csv = '\uFEFF'; // UTF-8 BOM for Excel and Google Sheets

    if (type === 'jobs' || type === 'all') {
      csv += '=== TUITION JOBS ===\n';
      const headers = ['Job ID', 'Title', 'Class Level', 'Medium', 'Subjects', 'District', 'Area', 'Salary (BDT)', 'Days/Week', 'Teaching Type', 'Tutor Gender', 'Status', 'Total Applications', 'Assigned Tutor', 'Deadline', 'Posted Date'];
      csv += headers.map(sanitize).join(',') + '\n';
      this.state.jobs.forEach(j => {
        csv += [
          j.id, j.title, j.classLevel, j.medium, j.subjects.join('; '), j.district, j.area,
          j.salary, j.daysPerWeek, j.teachingType, j.tutorGenderPreference, j.status,
          j.totalApplications, j.assignedTutorName || '', j.deadline, j.postedDate
        ].map(sanitize).join(',') + '\n';
      });
      csv += '\n';
    }

    if (type === 'tutors' || type === 'all') {
      csv += '=== TUTORS ===\n';
      const headers = ['Tutor ID', 'Full Name', 'Category', 'University', 'Department', 'Phone', 'Email', 'District', 'Area', 'Expected Salary', 'Verification Status', 'CV Completion %'];
      csv += headers.map(sanitize).join(',') + '\n';
      this.state.tutors.forEach(t => {
        csv += [
          t.id, t.fullName, t.tutorCategory || 'general', t.university, t.department,
          t.phone, t.email, t.district, t.area, t.expectedSalary, t.verificationStatus, t.completionPercentage
        ].map(sanitize).join(',') + '\n';
      });
      csv += '\n';
    }

    if (type === 'guardians' || type === 'all') {
      csv += '=== GUARDIANS ===\n';
      const headers = ['Guardian ID', 'Name', 'Phone', 'Email', 'Location', 'District', 'Status', 'Referral Code', 'Joined Date'];
      csv += headers.map(sanitize).join(',') + '\n';
      this.getGuardians().forEach(g => {
        csv += [
          g.id, g.name, g.phone, g.email, g.location, g.district, g.status || 'active', g.referralCode || '', g.createdAt
        ].map(sanitize).join(',') + '\n';
      });
      csv += '\n';
    }

    if (type === 'requests' || type === 'all') {
      csv += '=== TUITION REQUESTS ===\n';
      const headers = ['Request ID', 'Guardian Name', 'Phone', 'Student Class', 'Medium', 'Subjects', 'Area', 'Monthly Budget', 'Status', 'Created Date'];
      csv += headers.map(sanitize).join(',') + '\n';
      this.state.requests.forEach(r => {
        csv += [
          r.id, r.guardianName, r.phone, r.studentClass, r.medium, r.subjects.join('; '), r.area, r.monthlyBudget, r.status, r.createdAt
        ].map(sanitize).join(',') + '\n';
      });
      csv += '\n';
    }

    if (type === 'activityLogs' || type === 'all') {
      csv += '=== AUDIT TRAIL ACTIVITY LOGS ===\n';
      const headers = ['Log ID', 'Action', 'Performed By', 'Timestamp', 'Details'];
      csv += headers.map(sanitize).join(',') + '\n';
      this.state.activityLogs.forEach(l => {
        csv += [
          l.id, l.action, l.performedBy, l.timestamp, l.details
        ].map(sanitize).join(',') + '\n';
      });
      csv += '\n';
    }

    return csv;
  }

  // Notifications
  public addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'date'>) {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: NotificationItem = {
      ...item,
      id,
      read: false,
      date: new Date().toISOString()
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.saveState();
  }

  public markNotificationAsRead(notifId: string) {
    this.state.notifications = this.state.notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    this.saveState();
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications = this.state.notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
    this.saveState();
  }

  // Real Database Statistics (Section 68)
  public getStatistics() {
    const totalTutors = this.state.tutors.length;
    const verifiedTutors = this.state.tutors.filter(t => t.verificationStatus === 'verified').length;
    const pendingTutors = this.state.tutors.filter(t => t.verificationStatus === 'pending').length;
    const totalGuardians = this.state.users.filter(u => u.role === 'guardian').length;
    const totalRequests = this.state.requests.length;
    const publishedJobs = this.state.jobs.filter(j => j.status === 'published').length;
    const totalApplications = this.state.applications.length;
    const confirmedTuitions = this.state.confirmations.filter(c => c.status === 'confirmed').length;
    const pendingReviews = this.state.reviews.filter(r => r.status === 'pending').length;
    const unreadMessages = this.state.messages.filter(m => m.status === 'unread').length;
    const activeNotices = this.state.notices.filter(n => n.status === 'published').length;

    return {
      totalTutors,
      verifiedTutors,
      pendingTutors,
      totalGuardians,
      totalRequests,
      publishedJobs,
      totalApplications,
      confirmedTuitions,
      pendingReviews,
      unreadMessages,
      activeNotices
    };
  }

  // =====================================================================
  // FEATURE 6: IN-APP DIRECT CHAT & LIVE MESSAGING HUB
  // =====================================================================
  public getConversationsForUser(userId: string): ChatConversation[] {
    return this.state.conversations.filter(c => c.participantIds.includes(userId));
  }

  public getMessagesForConversation(conversationId: string): ChatMessage[] {
    return this.state.chatMessages.filter(m => m.conversationId === conversationId);
  }

  public getOrCreateConversation(
    guardianUserId: string,
    tutorIdOrUserId: string,
    jobId?: string,
    jobTitle?: string,
    context?: string
  ): ChatConversation {
    // Find tutor profile or user
    const tutor = this.getTutorById(tutorIdOrUserId) || this.state.tutors.find(t => t.userId === tutorIdOrUserId) || this.state.tutors[0];
    const guardian = this.getUserById(guardianUserId) || this.state.users.find(u => u.id === guardianUserId);

    const tutorUserId = tutor.userId || tutorIdOrUserId;

    // Check if conversation already exists between these users
    const existing = this.state.conversations.find(c => 
      c.participantIds.includes(guardianUserId) && c.participantIds.includes(tutorUserId)
    );

    if (existing) {
      return existing;
    }

    const newConv: ChatConversation = {
      id: `conv_${Date.now()}`,
      participantIds: [guardianUserId, tutorUserId],
      guardianId: guardianUserId,
      guardianName: guardian?.name || 'অভিভাবক',
      guardianPhone: guardian?.phone || '',
      tutorId: tutor.id,
      tutorName: tutor.fullName || 'শিক্ষক',
      tutorPhone: tutor.phone || '',
      jobId: jobId || '',
      jobTitle: jobTitle || '',
      lastMessageText: 'চ্যাট সেশন শুরু হয়েছে',
      lastMessageTime: new Date().toISOString(),
      unreadCountGuardian: 0,
      unreadCountTutor: 0,
      status: 'active',
      subjectOrContext: context || jobTitle || `${tutor.fullName} ও ${guardian?.name || 'অভিভাবক'} টিউশন আলোচনা`
    };

    this.state.conversations = [newConv, ...this.state.conversations];
    this.saveState();
    return newConv;
  }

  public sendChatMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole: 'tutor' | 'guardian' | 'admin';
    receiverId: string;
    receiverName: string;
    text: string;
    messageType?: 'text' | 'template' | 'system' | 'proposal';
    receiverRole?: 'tutor' | 'guardian' | 'admin';
  }): ChatMessage {
    const newMsg: ChatMessage = {
      id: `msg_chat_${Date.now()}`,
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      receiverId: params.receiverId,
      receiverName: params.receiverName,
      text: params.text,
      createdAt: new Date().toISOString(),
      read: false,
      messageType: params.messageType || 'text'
    };

    this.state.chatMessages = [...this.state.chatMessages, newMsg];

    // Update conversation
    this.state.conversations = this.state.conversations.map(c => {
      if (c.id === params.conversationId) {
        const isReceiverGuardian = params.receiverRole === 'guardian' || params.senderRole === 'tutor' || c.guardianId === params.receiverId;
        return {
          ...c,
          lastMessageText: params.text,
          lastMessageTime: newMsg.createdAt,
          unreadCountGuardian: isReceiverGuardian ? c.unreadCountGuardian + 1 : c.unreadCountGuardian,
          unreadCountTutor: !isReceiverGuardian ? c.unreadCountTutor + 1 : c.unreadCountTutor
        };
      }
      return c;
    });

    // Notify receiver
    this.addNotification({
      userId: params.receiverId,
      title: `নতুন মেসেজ: ${params.senderName}`,
      message: params.text.length > 50 ? params.text.substring(0, 50) + '...' : params.text,
      type: 'system'
    });

    this.logActivity('CHAT_MESSAGE_SENT', `Chat message sent from ${params.senderName} to ${params.receiverName}`);
    this.saveState();
    return newMsg;
  }

  public markConversationAsRead(conversationId: string, currentUserId: string) {
    this.state.chatMessages = this.state.chatMessages.map(m => {
      if (m.conversationId === conversationId && m.receiverId === currentUserId && !m.read) {
        return { ...m, read: true };
      }
      return m;
    });

    this.state.conversations = this.state.conversations.map(c => {
      if (c.id === conversationId) {
        if (c.guardianId === currentUserId) {
          return { ...c, unreadCountGuardian: 0 };
        } else {
          return { ...c, unreadCountTutor: 0 };
        }
      }
      return c;
    });

    this.saveState();
  }

  public getAllConversations(): ChatConversation[] {
    return this.state.conversations;
  }

  public deleteConversation(conversationId: string) {
    this.state.conversations = this.state.conversations.filter(c => c.id !== conversationId);
    this.state.chatMessages = this.state.chatMessages.filter(m => m.conversationId !== conversationId);
    this.logActivity('CONVERSATION_DELETED', `Conversation ${conversationId} deleted by admin`);
    this.saveState();
  }

  public getUnreadChatCountForUser(userId: string): number {
    const userConvs = this.getConversationsForUser(userId);
    return userConvs.reduce((acc, c) => {
      if (c.guardianId === userId) return acc + (c.unreadCountGuardian || 0);
      return acc + (c.unreadCountTutor || 0);
    }, 0);
  }

  public broadcastSystemMessage(conversationId: string, text: string): ChatMessage {
    const conv = this.state.conversations.find(c => c.id === conversationId);
    return this.sendChatMessage({
      conversationId,
      senderId: 'admin_sys',
      senderName: 'TutorHat Moderation',
      senderRole: 'admin',
      receiverId: conv?.guardianId || '',
      receiverName: conv?.guardianName || 'User',
      text,
      messageType: 'system'
    });
  }

  // =====================================================================
  // FEATURE 6: STUDENT PROGRESS & MONTHLY EVALUATION REPORTS
  // =====================================================================
  public submitProgressReport(report: Omit<StudentProgressReport, 'id' | 'reportCode' | 'createdAt'>): StudentProgressReport {
    const id = `rep_${Date.now()}`;
    const reportCode = `TH-REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: StudentProgressReport = {
      ...report,
      id,
      reportCode,
      createdAt: new Date().toISOString()
    };

    this.state.progressReports = [newReport, ...this.state.progressReports];

    // Notify guardian
    this.addNotification({
      userId: report.guardianId,
      title: `শিক্ষার্থী মাসিক অগ্রগতি রিপোর্ট: ${report.studentName}`,
      message: `শিক্ষক ${report.tutorName} ${report.studentName}-এর ${report.month} মাসের একাডেমিক অগ্রগতি রিপোর্ট প্রকাশ করেছেন। গ্রেড: ${report.overallGrade}`,
      type: 'confirmation'
    });

    this.logActivity('PROGRESS_REPORT_SUBMITTED', `Progress report submitted for ${report.studentName} (${reportCode})`);
    this.saveState();
    return newReport;
  }

  public getProgressReportsForTutor(tutorId: string): StudentProgressReport[] {
    return this.state.progressReports.filter(r => r.tutorId === tutorId);
  }

  public getProgressReportsForGuardian(guardianId: string): StudentProgressReport[] {
    return this.state.progressReports.filter(r => r.guardianId === guardianId);
  }

  public getAllProgressReports(): StudentProgressReport[] {
    return this.state.progressReports;
  }

  public deleteProgressReport(reportId: string) {
    this.state.progressReports = this.state.progressReports.filter(r => r.id !== reportId);
    this.logActivity('PROGRESS_REPORT_DELETED', `Progress report ${reportId} deleted`);
    this.saveState();
  }

  // Reset & Clear Demo Data (Section 43)
  public resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }

  public clearDemoData() {
    // Keep admin, clear sample items
    const adminUser = this.state.users.find(u => u.role === 'admin') || INITIAL_USERS[0];
    this.state = {
      ...this.state,
      users: [adminUser],
      tutors: [],
      requests: [],
      jobs: [],
      applications: [],
      demos: [],
      confirmations: [],
      attendance: [],
      payments: [],
      certificates: [],
      reviews: [],
      notifications: [],
      messages: [],
      referrals: [],
      settings: { ...this.state.settings, isDemoDataEnabled: false }
    };
    this.saveState();
  }
}

export const store = new Store();
