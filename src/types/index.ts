export type UserRole = 'tutor' | 'guardian' | 'admin';
export type AdminRoleLevel = 'super_admin' | 'moderator' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  gender: 'male' | 'female' | 'other';
  location: string;
  district: string;
  avatar?: string;
  status?: 'active' | 'suspended';
  referralCode?: string;
  adminNotes?: string;
  createdAt: string;
  passwordHash?: string;
  adminRoleLevel?: AdminRoleLevel;
  lastActiveAt?: string;
  adminPinHash?: string;
  adminPinSalt?: string;
}

export interface EducationEntry {
  schoolOrCollege: string;
  board?: string;
  gpa: string;
  groupOrMajor?: string;
  passingYear: string;
}

export type TutorCategoryType = 'general' | 'alia_madrasa' | 'qawmi_madrasa';

export interface MadrasaEducationDetails {
  category: TutorCategoryType; // 'general', 'alia_madrasa', or 'qawmi_madrasa'
  isHafiz?: boolean; // হাফেজ-এ-কুরআন
  qiratTajweedCertificate?: string; // ক্বেরাত ও তাজবীদ সনদ
  madrasaBoard?: string; // বেফাকুল মাদারিসিল আরাবিয়া (Befaq), আল-হাইয়াতুল উলয়া, বাংলাদেশ মাদরাসা শিক্ষা বোর্ড (Alia)
  highestSanadOrDegree?: string; // দাওরায়ে হাদিস (মাস্টার্স সমমান), তাকমিল, ফযিলত, সানাবিয়া, কামিল, ফাজিল, আলিম, দাখিল
  sanadPassingYear?: string;
  sanadDivisionOrGpa?: string; // মুমতাজ / জাইয়্যিদ জিদ্দান / First Class
  specializationDept?: string; // ইফতা (মুফতি), আদব (আরবি সাহিত্য), তাফসির, হাদিস, হিফজ
  currentKhidmatOrInstitution?: string; // বর্তমান খেদমত / প্রতিষ্ঠান
}

export interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  photo: string;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  phone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  district: string;
  area: string;
  preferredAreas: string[];
  aboutMe: string;

  // Tutor Stream / Category (General, Alia Madrasa, Qawmi Madrasa)
  tutorCategory?: TutorCategoryType;
  madrasaDetails?: MadrasaEducationDetails;

  // Education
  university: string;
  department: string;
  programDegree: string;
  admissionYear: string;
  currentYearSemester: string;
  institution: string;
  ssc: EducationEntry;
  hsc: EducationEntry;
  jsc?: EducationEntry;

  // Teaching Information
  teachingExperienceYears: number;
  teachingMethod: string;
  preferredClasses: string[];
  preferredSubjects: string[];
  preferredMediums: string[];
  categories: string[];
  onlineTeaching: boolean;
  homeTuition: boolean;
  coachingGroupTuition: boolean;
  availableDays: string[];
  availableTime: string;
  expectedSalary: number;
  preferredStudentGender: 'any' | 'male' | 'female';
  preferredClassLevel: string;

  // Verification & Status
  verificationStatus: 'draft' | 'pending' | 'verified' | 'rejected' | 'suspended';
  rejectionReason?: string;
  completionPercentage: number;
  rating: number;
  totalReviews: number;
  featured?: boolean;
  createdAt?: string;

  // KYC & Trust Verification Documents
  nidNumber?: string;
  nidFrontPhoto?: string;
  nidBackPhoto?: string;
  studentIdCardPhoto?: string;
  certificatePhoto?: string;
  isNidVerified?: boolean;
  isStudentIdVerified?: boolean;
  isAcademicVerified?: boolean;
  verificationSubmittedDate?: string;
  verifiedDate?: string;
  verifiedByAdminId?: string;
  verificationNotes?: string;
  trustScore?: number; // e.g. 100%
  badgeLevel?: 'basic' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'verified_expert' | string;
  customSubjects?: string[];
  customClasses?: string[];
  customMediums?: string[];
}

export interface TuitionRequest {
  id: string;
  guardianId: string;
  guardianName: string;
  phone: string;
  location: string;
  area: string;
  studentClass: string;
  studentGender: 'male' | 'female';
  medium: string;
  subjects: string[];
  daysPerWeek: number;
  preferredDays: string[];
  preferredTime: string;
  teachingType: 'home' | 'online' | 'both';
  tutorGenderPreference: 'any' | 'male' | 'female';
  monthlyBudget: number; // Guardian sets their own budget
  additionalRequirements: string;
  customRequirements?: string;
  customSubjects?: string[];
  customClass?: string;
  customMedium?: string;
  customSchedule?: string;
  customMode?: string;
  status: 'pending' | 'approved' | 'converted_to_job' | 'rejected';
  createdAt: string;
}

export type TuitionJobStatus = 
  | 'draft' 
  | 'pending_approval' 
  | 'published' 
  | 'paused' 
  | 'filled' 
  | 'closed' 
  | 'cancelled' 
  | 'expired';

export interface TuitionJob {
  id: string;
  title: string;
  category: string;
  classLevel: string;
  medium: string;
  subjects: string[];
  district: string;
  area: string;
  daysPerWeek: number;
  preferredTime: string;
  teachingType: 'home' | 'online' | 'coaching';
  salary: number;
  tutorGenderPreference: 'any' | 'male' | 'female';
  studentGender: 'male' | 'female';
  description: string;
  postedDate: string;
  deadline: string;
  status: TuitionJobStatus;
  guardianRequestId?: string;
  guardianId?: string;
  guardianName?: string;
  totalApplications: number;
  assignedTutorId?: string;
  assignedTutorName?: string;
  assignedDate?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  tutorId: string;
  tutorName: string;
  tutorPhoto: string;
  tutorUniversity: string;
  tutorDepartment: string;
  tutorPhone: string;
  expectedSalary: number;
  coverNote: string;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'demo_scheduled' | 'appointed' | 'confirmed' | 'rejected' | 'cancelled';
  adminNote?: string;
  guardianNote?: string;
}

export interface DemoClass {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorPhone: string;
  tutorPhoto?: string;
  tutorUniversity?: string;
  guardianId: string;
  guardianName: string;
  guardianPhone: string;
  jobId: string;
  jobTitle: string;
  studentName?: string;
  studentGrade?: string;
  subject?: string;
  location?: string;
  date: string;
  time: string;
  mode: 'home' | 'online';
  meetingLink?: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  result?: 'selected' | 'not_selected' | 'further_review';
  guardianFeedback?: string;
  tutorFeedback?: string;
  createdAt?: string;
}

export interface TuitionConfirmation {
  id: string;
  tutorId: string;
  tutorName: string;
  guardianId: string;
  guardianName: string;
  studentName: string;
  jobId: string;
  jobTitle: string;
  startDate: string;
  monthlyFee: number;
  daysPerWeek: number;
  scheduleTime: string;
  location: string;
  teachingMode: 'home' | 'online';
  specialInstructions: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  agreementCode?: string; // e.g. TH-AGR-2026-901
  agreementNumber?: string; // alias
  subject?: string;
  studentClass?: string;
  guardianPhone?: string;
  tutorPhone?: string;
  tutorUniversity?: string;
  completedClassesCount?: number;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  tutorId: string;
  tutorName: string;
  guardianId: string;
  studentName: string;
  jobId: string;
  status: 'present' | 'absent' | 'late' | 'cancelled';
  notes: string;
  topicsCovered?: string; // আজকের পাঠ/টপিক
  homeworkAssigned?: string; // বাড়ির কাজ
  durationMinutes?: number; // পাঠদানের সময়কাল
  time?: string; // সময়
  verifiedByGuardian?: boolean; // অভিভাবক কর্তৃক সত্যায়িত
  verifiedDate?: string;
}

export interface PaymentRecord {
  id: string;
  tutorId: string;
  tutorName: string;
  guardianId: string;
  guardianName: string;
  jobId: string;
  amount: number;
  month: string;
  paymentDate: string;
  status: 'pending' | 'due' | 'paid' | 'cancelled';
  notes: string;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'cash';
  method?: string; // alias
  transactionId?: string; // TrxID
  receiptNumber?: string; // TH-REC-2026-XXXX
  paidAt?: string;
  studentName?: string;
  paymentSlipUrl?: string;
  acknowledgedByTutor?: boolean;
}

export interface CertificateRecord {
  id: string;
  tutorId: string;
  tutorName: string;
  title: string;
  issueDate: string;
  description: string;
  status: 'active' | 'revoked';
  verificationCode: string;
  subject?: string;
  totalHoursCompleted?: number;
  gradeHonor?: 'Outstanding Mentor' | 'Distinguished Educator' | 'Verified Star Tutor';
  issuedBy?: string;
}

export interface ReviewCriteria {
  teachingSkill: number; // 1 to 5
  punctuality: number; // 1 to 5
  behavior: number; // 1 to 5
  studentImprovement: number; // 1 to 5
}

export interface ReviewRecord {
  id: string;
  tutorId: string;
  guardianId: string;
  guardianName: string;
  studentGradeOrSubject?: string;
  rating: number; // 1 to 5
  criteria?: ReviewCriteria;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerifiedTuition?: boolean; // Hired & Completed through TutorHat
  helpfulCount?: number;
  tutorReply?: {
    replyText: string;
    repliedAt: string;
    tutorName?: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'application' | 'demo' | 'confirmation' | 'verification' | 'payment' | 'system' | 'notice';
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'tutors' | 'guardians' | 'urgent';
  publishedDate: string;
  status: 'published' | 'draft' | 'archived';
  createdBy: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'resolved';
}

// Feature 6: In-App Direct Chat & Messaging
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'tutor' | 'guardian' | 'admin';
  receiverId: string;
  receiverName: string;
  text: string;
  createdAt: string;
  read: boolean;
  messageType?: 'text' | 'template' | 'system' | 'proposal';
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // [guardianUserId, tutorUserId]
  guardianId: string;
  guardianName: string;
  guardianPhone?: string;
  tutorId: string;
  tutorName: string;
  tutorPhone?: string;
  tutorAvatar?: string;
  jobId?: string;
  jobTitle?: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCountGuardian: number;
  unreadCountTutor: number;
  status: 'active' | 'archived';
  subjectOrContext?: string;
}

// Feature 6: Student Progress & Monthly Evaluation Report
export interface StudentProgressReport {
  id: string;
  reportCode: string; // e.g. TH-REP-2026-801
  tutorId: string;
  tutorName: string;
  tutorUniversity?: string;
  guardianId: string;
  guardianName: string;
  studentName: string;
  subject: string;
  classLevel: string;
  month: string; // e.g. 'মার্চ ২০২৬'
  attendanceScore: number; // e.g. 95 (%)
  homeworkCompletionScore: number; // e.g. 90 (%)
  classAttentionScore: number; // e.g. 88 (%)
  examOrQuizScore: number; // e.g. 85 (%)
  overallGrade: 'A+' | 'A' | 'B' | 'C';
  strengths: string;
  improvementsNeeded: string;
  tutorRemarks: string;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referredUserId?: string;
  referredUserName?: string;
  referralCode: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  rewardStatus: 'pending' | 'credited' | 'withdrawn';
  rewardDetails: string;
}

export interface AdminNote {
  id: string;
  entityType: 'tutor' | 'guardian' | 'job' | 'application';
  entityId: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface SocialLinks {
  facebook?: string;
  whatsapp?: string;
  youtube?: string;
  linkedin?: string;
}

export interface PaymentAccountsConfig {
  bkashNumber: string;
  bkashType: 'personal' | 'merchant' | 'agent';
  nagadNumber: string;
  nagadType: 'personal' | 'merchant' | 'agent';
  rocketNumber?: string;
  paymentInstructionsBn: string;
}

export interface AdminSecurityConfig {
  requireStrongPassword?: boolean;
  adminPasswordHash?: string;
  adminPinHash?: string;
  adminPinSalt?: string;
  biometricPasskeyRegistered?: boolean;
  biometricCredentialId?: string;
  biometricCredentialName?: string;
  twoFactorEnabled?: boolean;
  maxFailedAttempts?: number;
  lockoutDurationMinutes?: number;
  adminAccountConfigured?: boolean;
  primaryAdminName?: string;
  primaryAdminEmail?: string;
  primaryAdminPhone?: string;
}

export interface SystemSettings {
  appName: string;
  publicPhone: string;
  whatsAppRaw: string;
  whatsAppIntl: string;
  officeAddress: string;
  supportEmail: string;
  noticeMarquee: string;
  requireTutorVerificationToPublish: boolean;
  allowDirectGuardianTutorCall: boolean;
  defaultCurrency: string;
  socialLinks: SocialLinks;
  referralRules: string;
  referralBonusText: string;
  jobAutoApprove: boolean;
  isDemoDataEnabled: boolean;
  paymentAccounts?: PaymentAccountsConfig;
  adminSecurity?: AdminSecurityConfig;
}
