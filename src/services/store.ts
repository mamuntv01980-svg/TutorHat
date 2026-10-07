import {
  User,
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
  SystemSettings
} from '../types';

import heroImg from '../assets/images/hero_bangladesh_tutoring_1791378378802.jpg';
import tutorProfileImg from '../assets/images/tutor_graduate_profile_1791378392899.jpg';
import guardianStudyImg from '../assets/images/guardian_student_study_1791378404986.jpg';

export { heroImg, tutorProfileImg, guardianStudyImg };

const DEFAULT_SETTINGS: SystemSettings = {
  appName: 'TutorHat',
  publicPhone: '+8809638284290',
  whatsAppRaw: '01752617360',
  whatsAppIntl: '+8801752617360',
  officeAddress: 'House 24, Road 10/A, Dhanmondi, Dhaka 1209, Bangladesh',
  supportEmail: 'support@tutorhat.com',
  noticeMarquee: 'স্বাগতম TutorHat-এ! সারাদেশে বিশ্বস্ত ও ভেরিফাইড টিউটর পেতে আজই ফ্রি রিকোয়েস্ট করুন। নতুন টিউশন সার্কুলার প্রতিদিন প্রকাশিত হয়।',
  requireTutorVerificationToPublish: true,
  allowDirectGuardianTutorCall: false,
  defaultCurrency: '৳',
  socialLinks: {
    facebook: 'https://facebook.com/tutorhatbd',
    whatsapp: 'https://wa.me/8801752617360',
    youtube: 'https://youtube.com/@tutorhatbd',
    linkedin: 'https://linkedin.com/company/tutorhatbd'
  },
  referralRules: 'Earn ৳200 bonus or discount voucher on your child’s tuition after successful demo completion by a referred student or tutor.',
  referralBonusText: '৳200 Credit per verified referral',
  jobAutoApprove: false,
  isDemoDataEnabled: true
};

const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'TutorHat Admin',
    email: 'admin@tutorhat.com',
    phone: '01752617360',
    role: 'admin',
    gender: 'male',
    location: 'Dhanmondi, Dhaka',
    district: 'Dhaka',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user_tutor_01',
    name: 'Rahim Chowdhury',
    email: 'rahim.tutor@example.com',
    phone: '01711223344',
    role: 'tutor',
    gender: 'male',
    location: 'Dhanmondi, Dhaka',
    district: 'Dhaka',
    status: 'active',
    referralCode: 'RAHIM-TH10',
    createdAt: '2026-02-10T10:00:00.000Z'
  },
  {
    id: 'user_tutor_02',
    name: 'Nusrat Jahan',
    email: 'nusrat.du@example.com',
    phone: '01811334455',
    role: 'tutor',
    gender: 'female',
    location: 'Uttara Sector 7, Dhaka',
    district: 'Dhaka',
    status: 'active',
    referralCode: 'NUSRAT-TH20',
    createdAt: '2026-02-15T12:00:00.000Z'
  },
  {
    id: 'user_tutor_03',
    name: 'Hafez Maulana Abdullah',
    email: 'abdullah.quran@example.com',
    phone: '01911445566',
    role: 'tutor',
    gender: 'male',
    location: 'Mohammadpur, Dhaka',
    district: 'Dhaka',
    status: 'active',
    referralCode: 'ABDULLAH-TH30',
    createdAt: '2026-02-18T14:00:00.000Z'
  },
  {
    id: 'user_guardian_01',
    name: 'Mrs. Farhana Begum',
    email: 'farhana.guardian@example.com',
    phone: '01799887766',
    role: 'guardian',
    gender: 'female',
    location: 'Mirpur DOHS, Dhaka',
    district: 'Dhaka',
    status: 'active',
    referralCode: 'FARHANA-TH88',
    createdAt: '2026-03-01T08:00:00.000Z'
  }
];

const INITIAL_TUTORS: TutorProfile[] = [
  {
    id: 'tut_01',
    userId: 'user_tutor_01',
    fullName: 'Rahim Chowdhury',
    photo: tutorProfileImg,
    gender: 'male',
    dateOfBirth: '1999-05-14',
    phone: '01711223344',
    email: 'rahim.tutor@example.com',
    currentAddress: 'House 12, Road 4, Dhanmondi',
    permanentAddress: 'Chandpur Sadar, Chandpur',
    district: 'Dhaka',
    area: 'Dhanmondi',
    preferredAreas: ['Dhanmondi', 'Mirpur', 'Mohammadpur', 'Lalmatia', 'Farmgate'],
    aboutMe: 'Graduated from BUET (EEE). I have over 4 years of experience preparing students for SSC, HSC, and English Medium board exams in Mathematics and Physics. My focus is conceptual clarity and regular weekly model tests.',
    university: 'Bangladesh University of Engineering and Technology (BUET)',
    department: 'Electrical & Electronic Engineering (EEE)',
    programDegree: 'B.Sc. Engineering',
    admissionYear: '2020',
    currentYearSemester: 'Completed / 4th Year',
    institution: 'BUET',
    ssc: {
      schoolOrCollege: 'Dhaka Residential Model College',
      board: 'Dhaka',
      gpa: '5.00',
      groupOrMajor: 'Science',
      passingYear: '2017'
    },
    hsc: {
      schoolOrCollege: 'Notre Dame College, Dhaka',
      board: 'Dhaka',
      gpa: '5.00',
      groupOrMajor: 'Science',
      passingYear: '2019'
    },
    teachingExperienceYears: 4,
    teachingMethod: 'Concept breakdown with real-world applications, interactive practice, formula worksheets, and chapter-wise mock exams.',
    preferredClasses: ['Class 9 (SSC)', 'Class 10 (SSC)', 'HSC 1st Year', 'HSC 2nd Year', 'O Level (Standard)'],
    preferredSubjects: ['Higher Mathematics', 'Physics', 'Mathematics', 'Chemistry'],
    preferredMediums: ['Bangla Medium', 'English Version', 'English Medium (Cambridge / Edexcel)'],
    categories: ['Bangla Medium', 'English Version', 'English Medium'],
    onlineTeaching: true,
    homeTuition: true,
    coachingGroupTuition: false,
    availableDays: ['Saturday', 'Monday', 'Wednesday', 'Thursday'],
    availableTime: 'After 4:30 PM',
    expectedSalary: 7500,
    preferredStudentGender: 'any',
    preferredClassLevel: 'Secondary & Higher Secondary',
    verificationStatus: 'verified',
    completionPercentage: 100,
    rating: 4.9,
    totalReviews: 14,
    featured: true
  },
  {
    id: 'tut_02',
    userId: 'user_tutor_02',
    fullName: 'Nusrat Jahan',
    photo: '',
    gender: 'female',
    dateOfBirth: '2001-08-20',
    phone: '01811334455',
    email: 'nusrat.du@example.com',
    currentAddress: 'Sector 7, Road 11, Uttara',
    permanentAddress: 'Mymensingh Sadar',
    district: 'Dhaka',
    area: 'Uttara',
    preferredAreas: ['Uttara', 'Nikunja', 'Bashundhara R/A', 'Banani'],
    aboutMe: 'Honours student in English at University of Dhaka. Dedicated to helping junior and high school students master English grammar, creative writing, and Cambridge IGCSE English. Very friendly and patient.',
    university: 'University of Dhaka (DU)',
    department: 'Department of English',
    programDegree: 'B.A. (Honours)',
    admissionYear: '2021',
    currentYearSemester: '3rd Year',
    institution: 'University of Dhaka',
    ssc: {
      schoolOrCollege: 'Viqarunnisa Noon School & College',
      board: 'Dhaka',
      gpa: '5.00',
      groupOrMajor: 'Science',
      passingYear: '2018'
    },
    hsc: {
      schoolOrCollege: 'Viqarunnisa Noon College',
      board: 'Dhaka',
      gpa: '5.00',
      groupOrMajor: 'Humanities',
      passingYear: '2020'
    },
    teachingExperienceYears: 3,
    teachingMethod: 'Interactive vocabulary building, grammar fundamentals, daily speaking drills, and comprehension mastery.',
    preferredClasses: ['Class 6', 'Class 7', 'Class 8 (JSC)', 'Class 9 (SSC)', 'O Level (Standard)'],
    preferredSubjects: ['English (1st & 2nd Paper)', 'Bangla (1st & 2nd Paper)', 'Social Science / BGS'],
    preferredMediums: ['Bangla Medium', 'English Version', 'English Medium (Cambridge / Edexcel)'],
    categories: ['English Medium', 'English Version', 'Language Learning (English, Spoken Arabic)'],
    onlineTeaching: true,
    homeTuition: true,
    coachingGroupTuition: true,
    availableDays: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
    availableTime: '3:00 PM - 8:00 PM',
    expectedSalary: 6500,
    preferredStudentGender: 'female',
    preferredClassLevel: 'Junior & Secondary',
    verificationStatus: 'verified',
    completionPercentage: 100,
    rating: 5.0,
    totalReviews: 8,
    featured: true
  },
  {
    id: 'tut_03',
    userId: 'user_tutor_03',
    fullName: 'Hafez Maulana Abdullah',
    photo: '',
    gender: 'male',
    dateOfBirth: '1998-11-05',
    phone: '01911445566',
    email: 'abdullah.quran@example.com',
    currentAddress: 'Town Hall, Mohammadpur',
    permanentAddress: 'Kishoreganj',
    district: 'Dhaka',
    area: 'Mohammadpur',
    preferredAreas: ['Mohammadpur', 'Dhanmondi', 'Shyamoli', 'Lalmatia'],
    aboutMe: 'Hafez-e-Quran and Kamil in Hadith from Islamic Arabic University. 6 years of experience in Noorani Quran reading, Makhraj, Tajweed, Duas, and basic Arabic speaking for children and adults.',
    university: 'Islamic Arabic University',
    department: 'Department of Hadith & Islamic Studies',
    programDegree: 'Masters / Kamil',
    admissionYear: '2019',
    currentYearSemester: 'Completed',
    institution: 'Government Madrasah-e-Alia',
    ssc: {
      schoolOrCollege: 'Darunnajat Siddikia Kamil Madrasah',
      board: 'Madrasah',
      gpa: '5.00',
      groupOrMajor: 'General',
      passingYear: '2016'
    },
    hsc: {
      schoolOrCollege: 'Darunnajat Siddikia Kamil Madrasah',
      board: 'Madrasah',
      gpa: '5.00',
      groupOrMajor: 'General',
      passingYear: '2018'
    },
    teachingExperienceYears: 6,
    teachingMethod: 'Gentle, methodical Tajweed drill, correct articulation (Makhraj), daily revision, Masnoon Duas, and basic manners (Adab).',
    preferredClasses: ['Play / Nursery / KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5 (PEC)', 'Adult / Noorani Quran Learner'],
    preferredSubjects: ['Holy Quran & Tajweed', 'Arabic Grammar & Spoken', 'Islamic Studies'],
    preferredMediums: ['Quran & Arabic Learning', 'Hifz & Tajweed', 'Madrasa / Islamic Curriculum'],
    categories: ['Arabic & Quran', 'Hifz & Tajweed', 'Islamic Studies'],
    onlineTeaching: true,
    homeTuition: true,
    coachingGroupTuition: false,
    availableDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
    availableTime: 'Morning 7:00 AM - 9:00 AM or Evening 5:00 PM - 8:00 PM',
    expectedSalary: 5000,
    preferredStudentGender: 'any',
    preferredClassLevel: 'All Age Groups',
    verificationStatus: 'verified',
    completionPercentage: 100,
    rating: 4.95,
    totalReviews: 19,
    featured: true
  }
];

const INITIAL_REQUESTS: TuitionRequest[] = [
  {
    id: 'req_101',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    phone: '01799887766',
    location: 'Dhaka',
    area: 'Mirpur DOHS',
    studentClass: 'Class 9 (SSC)',
    studentGender: 'male',
    medium: 'Bangla Medium',
    subjects: ['Higher Mathematics', 'Physics', 'Chemistry'],
    daysPerWeek: 4,
    preferredDays: ['Saturday', 'Monday', 'Wednesday', 'Thursday'],
    preferredTime: '5:30 PM - 7:00 PM',
    teachingType: 'home',
    tutorGenderPreference: 'male',
    monthlyBudget: 7500,
    additionalRequirements: 'Prefer BUET or DU Science tutor who can take weekly quizzes and clarify basic physics concepts.',
    status: 'converted_to_job',
    createdAt: '2026-03-02T10:15:00.000Z'
  },
  {
    id: 'req_102',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    phone: '01799887766',
    location: 'Dhaka',
    area: 'Dhanmondi',
    studentClass: 'Class 4',
    studentGender: 'female',
    medium: 'English Version',
    subjects: ['Mathematics', 'General Science', 'English (1st & 2nd Paper)'],
    daysPerWeek: 3,
    preferredDays: ['Sunday', 'Tuesday', 'Thursday'],
    preferredTime: '4:00 PM',
    teachingType: 'home',
    tutorGenderPreference: 'female',
    monthlyBudget: 6000,
    additionalRequirements: 'Caring female tutor from renowned university. Need help with school homework and term exams.',
    status: 'pending',
    createdAt: '2026-03-05T14:20:00.000Z'
  }
];

const INITIAL_JOBS: TuitionJob[] = [
  {
    id: 'JOB-2026-101',
    title: 'Class 9 (SSC) Science Tutor Needed in Mirpur DOHS',
    category: 'Bangla Medium',
    classLevel: 'Class 9 (SSC)',
    medium: 'Bangla Medium',
    subjects: ['Higher Mathematics', 'Physics', 'Chemistry'],
    district: 'Dhaka',
    area: 'Mirpur DOHS',
    daysPerWeek: 4,
    preferredTime: '5:30 PM',
    teachingType: 'home',
    salary: 7500,
    tutorGenderPreference: 'male',
    studentGender: 'male',
    description: 'Looking for a dedicated BUET / DU science background tutor for a Class 9 SSC student. 4 days a week, 1.5 hours per class. Weekly chapter tests required.',
    postedDate: '2026-03-02',
    deadline: '2026-03-25',
    status: 'published',
    guardianRequestId: 'req_101',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    totalApplications: 3
  },
  {
    id: 'JOB-2026-102',
    title: 'O Level Cambridge Physics & Math Tutor in Dhanmondi',
    category: 'English Medium',
    classLevel: 'O Level (Standard)',
    medium: 'English Medium (Cambridge / Edexcel)',
    subjects: ['Mathematics', 'Physics'],
    district: 'Dhaka',
    area: 'Dhanmondi',
    daysPerWeek: 3,
    preferredTime: '6:00 PM',
    teachingType: 'home',
    salary: 9000,
    tutorGenderPreference: 'any',
    studentGender: 'female',
    description: 'Need an experienced tutor who is well-versed in Cambridge IGCSE syllabus and past paper solving. Candidate must have excellent English communication.',
    postedDate: '2026-03-03',
    deadline: '2026-03-28',
    status: 'published',
    guardianId: 'user_guardian_01',
    guardianName: 'Farhana Begum',
    totalApplications: 2
  },
  {
    id: 'JOB-2026-103',
    title: 'Quran with Tajweed & Arabic Learning in Mohammadpur',
    category: 'Arabic & Quran',
    classLevel: 'Class 5 (PEC)',
    medium: 'Quran & Arabic Learning',
    subjects: ['Holy Quran & Tajweed', 'Islamic Studies'],
    district: 'Dhaka',
    area: 'Mohammadpur',
    daysPerWeek: 5,
    preferredTime: '7:30 AM',
    teachingType: 'home',
    salary: 5500,
    tutorGenderPreference: 'male',
    studentGender: 'male',
    description: 'Seeking a knowledgeable Hafez/Maulana to teach morning Quran recitation with accurate Makhraj, Daily Duas, and basics of Salah for two young boys.',
    postedDate: '2026-03-04',
    deadline: '2026-03-30',
    status: 'published',
    totalApplications: 1
  },
  {
    id: 'JOB-2026-104',
    title: 'HSC 2nd Year Biology & Chemistry Online Tuition',
    category: 'Bangla Medium',
    classLevel: 'HSC 2nd Year',
    medium: 'Bangla Medium',
    subjects: ['Biology', 'Chemistry'],
    district: 'Dhaka',
    area: 'Online / Remote',
    daysPerWeek: 3,
    preferredTime: '8:00 PM',
    teachingType: 'online',
    salary: 6000,
    tutorGenderPreference: 'any',
    studentGender: 'female',
    description: 'Online classes via Zoom/Google Meet. Focus on medical admission syllabus foundation and board questions for upcoming HSC exams.',
    postedDate: '2026-03-05',
    deadline: '2026-04-05',
    status: 'published',
    totalApplications: 4
  },
  {
    id: 'JOB-2026-105',
    title: 'Class 7 English Version All Subjects in Uttara Sector 11',
    category: 'English Version',
    classLevel: 'Class 7',
    medium: 'English Version',
    subjects: ['Mathematics', 'General Science', 'English (1st & 2nd Paper)'],
    district: 'Dhaka',
    area: 'Uttara',
    daysPerWeek: 4,
    preferredTime: '4:30 PM',
    teachingType: 'home',
    salary: 8000,
    tutorGenderPreference: 'female',
    studentGender: 'female',
    description: 'Female tutor needed from DU, BRAC, or NSU for Class 7 English Version student. Friendly guidance and continuous monitoring.',
    postedDate: '2026-03-06',
    deadline: '2026-04-10',
    status: 'published',
    totalApplications: 2
  }
];

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_301',
    jobId: 'JOB-2026-101',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    tutorPhoto: tutorProfileImg,
    tutorUniversity: 'BUET (EEE)',
    tutorDepartment: 'Electrical & Electronic Engineering',
    tutorPhone: '01711223344',
    expectedSalary: 7500,
    coverNote: 'Assalamu Alaikum. I am an EEE graduate from BUET. I live near Mirpur DOHS and have successfully mentored several SSC science candidates who achieved Golden GPA-5.',
    appliedDate: '2026-03-03',
    status: 'shortlisted',
    adminNote: 'Strong profile, matched location and academic qualifications.',
    guardianNote: 'Looks very suitable for my son.'
  },
  {
    id: 'app_302',
    jobId: 'JOB-2026-102',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    tutorPhoto: tutorProfileImg,
    tutorUniversity: 'BUET (EEE)',
    tutorDepartment: 'EEE',
    tutorPhone: '01711223344',
    expectedSalary: 9000,
    coverNote: 'Experienced in Cambridge IGCSE Math and Physics syllabus with past papers solutions.',
    appliedDate: '2026-03-04',
    status: 'applied'
  },
  {
    id: 'app_303',
    jobId: 'JOB-2026-103',
    tutorId: 'tut_03',
    tutorName: 'Hafez Maulana Abdullah',
    tutorPhoto: '',
    tutorUniversity: 'Islamic Arabic University',
    tutorDepartment: 'Hadith & Islamic Studies',
    tutorPhone: '01911445566',
    expectedSalary: 5500,
    coverNote: 'InshaAllah I can teach the kids Tajweed and essential Islamic manners with utmost care.',
    appliedDate: '2026-03-04',
    status: 'demo_scheduled'
  }
];

const INITIAL_DEMOS: DemoClass[] = [
  {
    id: 'demo_401',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    tutorPhone: '01711223344',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    guardianPhone: '01799887766',
    jobId: 'JOB-2026-101',
    jobTitle: 'Class 9 (SSC) Science Tutor Needed in Mirpur DOHS',
    date: '2026-03-12',
    time: '5:30 PM',
    mode: 'home',
    notes: 'Demo class scheduled at Guardian residence in Mirpur DOHS. Topic: Newton Laws of Motion.',
    status: 'scheduled'
  }
];

const INITIAL_CONFIRMATIONS: TuitionConfirmation[] = [
  {
    id: 'conf_501',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    studentName: 'Ahsan Habib (Class 9)',
    jobId: 'JOB-2026-101',
    jobTitle: 'Class 9 (SSC) Science Tuition',
    startDate: '2026-03-15',
    monthlyFee: 7500,
    daysPerWeek: 4,
    scheduleTime: '5:30 PM - 7:00 PM',
    location: 'House 45, Road 2, Mirpur DOHS, Dhaka',
    teachingMode: 'home',
    specialInstructions: 'Regular model tests at end of month. Inform guardian if class rescheduled.',
    status: 'confirmed'
  }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_601',
    date: '2026-03-15',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    guardianId: 'user_guardian_01',
    studentName: 'Ahsan Habib',
    jobId: 'JOB-2026-101',
    status: 'present',
    notes: 'Covered Physics Chapter 3: Force & Motion formulas and problems.'
  },
  {
    id: 'att_602',
    date: '2026-03-17',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    guardianId: 'user_guardian_01',
    studentName: 'Ahsan Habib',
    jobId: 'JOB-2026-101',
    status: 'present',
    notes: 'Higher Math coordinate geometry basics.'
  }
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-2026-001',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    jobId: 'JOB-2026-101',
    amount: 7500,
    month: 'March 2026',
    paymentDate: '2026-04-01',
    status: 'due',
    notes: 'Monthly tuition salary for Ahsan Habib (Class 9 SSC)'
  }
];

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-TH-8821',
    tutorId: 'tut_01',
    tutorName: 'Rahim Chowdhury',
    title: 'Excellence in Science & Mathematics Mentorship',
    issueDate: '2026-01-15',
    description: 'Awarded for demonstrating superior pedagogical methodology, 100% attendance punctuality, and stellar student exam outcomes on TutorHat platform.',
    status: 'active',
    verificationCode: 'TH-VER-2026-0199'
  }
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev_701',
    tutorId: 'tut_01',
    guardianId: 'user_guardian_01',
    guardianName: 'Mrs. Farhana Begum',
    rating: 5,
    comment: 'Rahim sir is exceptionally punctual, polite, and explains complex physics concepts in very simple language. My child’s marks have improved significantly within 2 months!',
    date: '2026-02-28',
    status: 'approved'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_801',
    userId: 'user_tutor_01',
    title: 'Shortlisted for Tuition Job!',
    message: 'Congratulations! You have been shortlisted for JOB-2026-101 in Mirpur DOHS.',
    type: 'application',
    read: false,
    date: '2026-03-04T12:00:00.000Z',
    actionUrl: 'applications'
  },
  {
    id: 'notif_802',
    userId: 'user_tutor_01',
    title: 'Demo Class Scheduled',
    message: 'Demo class confirmed for JOB-2026-101 on March 12 at 5:30 PM with Mrs. Farhana Begum.',
    type: 'demo',
    read: false,
    date: '2026-03-05T09:30:00.000Z',
    actionUrl: 'demo-classes'
  },
  {
    id: 'notif_803',
    userId: 'user_guardian_01',
    title: 'Tutor Profiles Ready for Review',
    message: '3 qualified verified tutors have applied for your Class 9 SSC tuition requirement.',
    type: 'application',
    read: false,
    date: '2026-03-03T16:00:00.000Z',
    actionUrl: 'requests'
  }
];

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

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_01',
    name: 'Kabir Ahmed',
    mobile: '01712000000',
    email: 'kabir@example.com',
    subject: 'Corporate Quran Tuition Query',
    message: 'Assalamu Alaikum. Can you arrange home Quran tutor for 3 family members in Banani?',
    date: '2026-03-05',
    status: 'read'
  },
  {
    id: 'msg_02',
    name: 'Shirin Akter',
    mobile: '01819000000',
    email: 'shirin@example.com',
    subject: 'English Medium Math Tutor in Uttara',
    message: 'Need Edexcel IGCSE Math tutor immediately for my daughter in Sector 4, Uttara.',
    date: '2026-03-06',
    status: 'unread'
  }
];

const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref_01',
    referrerId: 'user_tutor_01',
    referrerName: 'Rahim Chowdhury',
    referredUserId: 'user_tutor_02',
    referredUserName: 'Nusrat Jahan',
    referralCode: 'RAHIM-TH10',
    date: '2026-02-20',
    status: 'completed',
    rewardStatus: 'credited',
    rewardDetails: '৳200 referral bonus credited to wallet'
  }
];

const INITIAL_ADMIN_NOTES: AdminNote[] = [
  {
    id: 'anote_01',
    entityType: 'tutor',
    entityId: 'tut_01',
    note: 'Academic credentials cross-verified with BUET portal. Excellent feedback from guardians.',
    createdBy: 'Master Admin',
    createdAt: '2026-02-12T10:00:00.000Z'
  },
  {
    id: 'anote_02',
    entityType: 'guardian',
    entityId: 'user_guardian_01',
    note: 'Verified parent in Mirpur DOHS. Prompt in scheduling demo sessions.',
    createdBy: 'Master Admin',
    createdAt: '2026-03-02T12:00:00.000Z'
  }
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_01',
    action: 'TUTOR_VERIFIED',
    performedBy: 'admin@tutorhat.com',
    timestamp: '2026-02-12T10:05:00.000Z',
    details: 'Verified tutor profile for Rahim Chowdhury (tut_01)'
  },
  {
    id: 'act_02',
    action: 'JOB_PUBLISHED',
    performedBy: 'admin@tutorhat.com',
    timestamp: '2026-03-02T11:00:00.000Z',
    details: 'Published JOB-2026-101 from guardian request req_101'
  }
];

const STORAGE_KEY = 'tutorhat_data_v3';

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
}

export function calculateCvCompletion(tutor: Partial<TutorProfile>): { percent: number; missing: string[] } {
  const missing: string[] = [];
  let score = 0;
  const weights = [
    { field: 'fullName', name: 'Full Name', weight: 10, check: () => !!tutor.fullName?.trim() },
    { field: 'gender', name: 'Gender', weight: 5, check: () => !!tutor.gender },
    { field: 'phone', name: 'Mobile Number', weight: 10, check: () => !!tutor.phone?.trim() },
    { field: 'area', name: 'Current Area', weight: 5, check: () => !!tutor.area?.trim() },
    { field: 'aboutMe', name: 'About Me Bio', weight: 10, check: () => (tutor.aboutMe?.length || 0) > 30 },
    { field: 'university', name: 'University Name', weight: 15, check: () => !!tutor.university?.trim() },
    { field: 'department', name: 'Department / Major', weight: 10, check: () => !!tutor.department?.trim() },
    { field: 'ssc', name: 'SSC Records', weight: 5, check: () => !!tutor.ssc?.schoolOrCollege && !!tutor.ssc?.gpa },
    { field: 'hsc', name: 'HSC Records', weight: 5, check: () => !!tutor.hsc?.schoolOrCollege && !!tutor.hsc?.gpa },
    { field: 'preferredClasses', name: 'Preferred Classes', weight: 5, check: () => (tutor.preferredClasses?.length || 0) > 0 },
    { field: 'preferredSubjects', name: 'Preferred Subjects', weight: 5, check: () => (tutor.preferredSubjects?.length || 0) > 0 },
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
  }

  private loadState(): StoreState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          users: parsed.users || INITIAL_USERS,
          tutors: parsed.tutors || INITIAL_TUTORS,
          requests: parsed.requests || INITIAL_REQUESTS,
          jobs: parsed.jobs || INITIAL_JOBS,
          applications: parsed.applications || INITIAL_APPLICATIONS,
          demos: parsed.demos || INITIAL_DEMOS,
          confirmations: parsed.confirmations || INITIAL_CONFIRMATIONS,
          attendance: parsed.attendance || INITIAL_ATTENDANCE,
          payments: parsed.payments || INITIAL_PAYMENTS,
          certificates: parsed.certificates || INITIAL_CERTIFICATES,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          notices: parsed.notices || INITIAL_NOTICES,
          messages: parsed.messages || INITIAL_MESSAGES,
          referrals: parsed.referrals || INITIAL_REFERRALS,
          adminNotes: parsed.adminNotes || INITIAL_ADMIN_NOTES,
          activityLogs: parsed.activityLogs || INITIAL_ACTIVITY_LOGS,
          shortlists: parsed.shortlists || [{ guardianId: 'user_guardian_01', tutorId: 'tut_01' }]
        };
      }
    } catch {
      // ignore
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
      shortlists: [{ guardianId: 'user_guardian_01', tutorId: 'tut_01' }]
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
        verificationStatus: 'draft',
        completionPercentage: 20,
        rating: 5.0,
        totalReviews: 0
      };
      this.state.tutors = [...this.state.tutors, newTutor];
    }

    this.logActivity('USER_REGISTERED', `Created account ${newUser.name} as ${newUser.role}`);
    this.saveState();
    return newUser;
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
  }

  public submitTutorForVerification(tutorId: string) {
    const tutor = this.getTutorById(tutorId);
    if (!tutor) return;
    const calc = calculateCvCompletion(tutor);
    if (calc.percent < 100) {
      throw new Error(`Profile is ${calc.percent}% complete. Please fill: ${calc.missing.join(', ')}`);
    }

    this.updateTutorProfile(tutorId, {
      verificationStatus: 'pending'
    });

    this.addNotification({
      userId: 'user_admin_01',
      title: 'Tutor Verification Request',
      message: `${tutor.fullName} has submitted their CV for verification.`,
      type: 'verification'
    });
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

    this.logActivity('REQUEST_CONVERTED_TO_JOB', `Converted request ${requestId} to job ${jobId}`);
    this.saveState();
    return newJob;
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
    this.saveState();
    return newJob;
  }

  public editJob(jobId: string, updates: Partial<TuitionJob>) {
    this.state.jobs = this.state.jobs.map(j => j.id === jobId ? { ...j, ...updates } : j);
    this.logActivity('JOB_EDITED', `Updated tuition job ${jobId}`);
    this.saveState();
  }

  public updateJobStatus(jobId: string, status: TuitionJobStatus) {
    this.state.jobs = this.state.jobs.map(j => j.id === jobId ? { ...j, status } : j);
    this.logActivity('JOB_STATUS_UPDATED', `Set job ${jobId} status to ${status}`);
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

  // Demo Classes
  public scheduleDemoClass(demoData: Omit<DemoClass, 'id'>): DemoClass {
    const id = `demo_${Date.now()}`;
    const newDemo: DemoClass = { ...demoData, id };
    this.state.demos = [newDemo, ...this.state.demos];

    const tutor = this.getTutorById(demoData.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'New Demo Class Scheduled',
        message: `Demo class scheduled on ${demoData.date} at ${demoData.time} with ${demoData.guardianName}.`,
        type: 'demo'
      });
    }

    this.addNotification({
      userId: demoData.guardianId,
      title: 'Demo Class Scheduled with Tutor',
      message: `Demo class scheduled on ${demoData.date} at ${demoData.time} with tutor ${demoData.tutorName}.`,
      type: 'demo'
    });

    this.logActivity('DEMO_SCHEDULED', `Scheduled demo for tutor ${demoData.tutorName} on ${demoData.date}`);
    this.saveState();
    return newDemo;
  }

  public updateDemoResult(demoId: string, result: 'selected' | 'not_selected' | 'further_review', notes?: string) {
    this.state.demos = this.state.demos.map(d => {
      if (d.id === demoId) {
        return {
          ...d,
          result,
          status: 'completed',
          notes: notes || d.notes
        };
      }
      return d;
    });
    this.saveState();
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

  // Attendance
  public addAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const id = `att_${Date.now()}`;
    const newRecord: AttendanceRecord = { ...record, id };
    this.state.attendance = [newRecord, ...this.state.attendance];
    this.saveState();
    return newRecord;
  }

  // Payment Tracking
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

  // Certificates
  public issueCertificate(cert: Omit<CertificateRecord, 'id' | 'verificationCode'>): CertificateRecord {
    const id = `CERT-TH-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = `TH-VER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: CertificateRecord = { ...cert, id, verificationCode };
    this.state.certificates = [newCert, ...this.state.certificates];

    const tutor = this.getTutorById(cert.tutorId);
    if (tutor) {
      this.addNotification({
        userId: tutor.userId,
        title: 'New Certificate Awarded!',
        message: `You have been awarded certificate: "${cert.title}". Verification ID: ${verificationCode}`,
        type: 'system'
      });
    }

    this.saveState();
    return newCert;
  }

  // Reviews
  public submitReview(review: Omit<ReviewRecord, 'id' | 'date' | 'status'>): ReviewRecord {
    const id = `rev_${Date.now()}`;
    const newReview: ReviewRecord = {
      ...review,
      id,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    this.state.reviews = [newReview, ...this.state.reviews];

    this.addNotification({
      userId: 'user_admin_01',
      title: 'New Tutor Review Pending Moderation',
      message: `${review.guardianName} rated tutor with ${review.rating} stars.`,
      type: 'system'
    });

    this.saveState();
    return newReview;
  }

  public moderateReview(reviewId: string, status: 'approved' | 'rejected') {
    this.state.reviews = this.state.reviews.map(r => r.id === reviewId ? { ...r, status } : r);

    const target = this.state.reviews.find(r => r.id === reviewId);
    if (target && status === 'approved') {
      const tutorApprovedReviews = this.state.reviews.filter(r => r.tutorId === target.tutorId && r.status === 'approved');
      const avg = tutorApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / tutorApprovedReviews.length;
      this.updateTutorProfile(target.tutorId, {
        rating: Number(avg.toFixed(1)),
        totalReviews: tutorApprovedReviews.length
      });
    }

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
    const id = `act_${Date.now()}`;
    const newLog: ActivityLog = {
      id,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      details
    };
    this.state.activityLogs = [newLog, ...this.state.activityLogs.slice(0, 50)];
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
