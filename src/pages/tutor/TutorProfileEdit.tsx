import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store, calculateCvCompletion } from '../../services/store';
import { 
  BD_DISTRICTS, 
  DHAKA_AREAS, 
  MEDIUMS, 
  CATEGORIES, 
  CLASS_LEVELS, 
  SUBJECTS_LIST, 
  UNIVERSITIES_LIST,
  MADRASA_BOARDS,
  MADRASA_SANADS_QAWMI,
  MADRASA_DEGREES_ALIA,
  MADRASA_DIVISIONS
} from '../../constants/bangladeshData';
import { TutorCategoryType } from '../../types';

export const TutorProfileEdit: React.FC = () => {
  const { activeTutorProfile, storeState, navigateTo, language } = useApp();

  const tutor = activeTutorProfile || storeState.tutors[0];

  // Local state for all fields
  const [fullName, setFullName] = useState(tutor.fullName);
  const [gender, setGender] = useState<'male' | 'female'>(tutor.gender || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(tutor.dateOfBirth || '');
  const [phone, setPhone] = useState(tutor.phone);
  const [email, setEmail] = useState(tutor.email);
  const [currentAddress, setCurrentAddress] = useState(tutor.currentAddress);
  const [permanentAddress, setPermanentAddress] = useState(tutor.permanentAddress);
  const [district, setDistrict] = useState(tutor.district || 'Dhaka');
  const [area, setArea] = useState(tutor.area || 'Dhanmondi');
  const [preferredAreas, setPreferredAreas] = useState<string[]>(tutor.preferredAreas || []);
  const [newPreferredArea, setNewPreferredArea] = useState('');
  const [aboutMe, setAboutMe] = useState(tutor.aboutMe || '');

  // Category Stream
  const [tutorCategory, setTutorCategory] = useState<TutorCategoryType>(tutor.tutorCategory || 'general');

  // Madrasa Education State (Alia & Qawmi)
  const [madrasaBoard, setMadrasaBoard] = useState(tutor.madrasaDetails?.madrasaBoard || MADRASA_BOARDS[0]);
  const [highestSanadOrDegree, setHighestSanadOrDegree] = useState(tutor.madrasaDetails?.highestSanadOrDegree || 'দাওরায়ে হাদিস / তাকমিল (মাস্টার্স সমমান)');
  const [sanadDivisionOrGpa, setSanadDivisionOrGpa] = useState(tutor.madrasaDetails?.sanadDivisionOrGpa || 'মুমতাজ (Star Marks / Distinction)');
  const [sanadPassingYear, setSanadPassingYear] = useState(tutor.madrasaDetails?.sanadPassingYear || '2022');
  const [isHafiz, setIsHafiz] = useState(tutor.madrasaDetails?.isHafiz || false);
  const [qiratTajweedCertificate, setQiratTajweedCertificate] = useState(tutor.madrasaDetails?.qiratTajweedCertificate || '');
  const [specializationDept, setSpecializationDept] = useState(tutor.madrasaDetails?.specializationDept || '');
  const [currentKhidmatOrInstitution, setCurrentKhidmatOrInstitution] = useState(tutor.madrasaDetails?.currentKhidmatOrInstitution || '');

  // Education
  const [university, setUniversity] = useState(tutor.university || '');
  const [department, setDepartment] = useState(tutor.department || '');
  const [programDegree, setProgramDegree] = useState(tutor.programDegree || '');
  const [admissionYear, setAdmissionYear] = useState(tutor.admissionYear || '');
  const [currentYearSemester, setCurrentYearSemester] = useState(tutor.currentYearSemester || '');
  
  // SSC
  const [sscSchool, setSscSchool] = useState(tutor.ssc?.schoolOrCollege || '');
  const [sscBoard, setSscBoard] = useState(tutor.ssc?.board || 'Dhaka');
  const [sscGpa, setSscGpa] = useState(tutor.ssc?.gpa || '');
  const [sscYear, setSscYear] = useState(tutor.ssc?.passingYear || '');
  
  // HSC
  const [hscCollege, setHscCollege] = useState(tutor.hsc?.schoolOrCollege || '');
  const [hscBoard, setHscBoard] = useState(tutor.hsc?.board || 'Dhaka');
  const [hscGpa, setHscGpa] = useState(tutor.hsc?.gpa || '');
  const [hscYear, setHscYear] = useState(tutor.hsc?.passingYear || '');

  // Teaching
  const [teachingExperienceYears, setTeachingExperienceYears] = useState(tutor.teachingExperienceYears || 1);
  const [teachingMethod, setTeachingMethod] = useState(tutor.teachingMethod || '');
  const [preferredClasses, setPreferredClasses] = useState<string[]>(tutor.preferredClasses || []);
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>(tutor.preferredSubjects || []);
  const [preferredMediums, setPreferredMediums] = useState<string[]>(tutor.preferredMediums || []);
  const [categories, setCategories] = useState<string[]>(tutor.categories || []);
  const [onlineTeaching, setOnlineTeaching] = useState(tutor.onlineTeaching ?? true);
  const [homeTuition, setHomeTuition] = useState(tutor.homeTuition ?? true);
  const [coachingGroupTuition, setCoachingGroupTuition] = useState(tutor.coachingGroupTuition ?? false);
  const [availableDays, setAvailableDays] = useState<string[]>(tutor.availableDays || ['Saturday', 'Monday', 'Wednesday']);
  const [availableTime, setAvailableTime] = useState(tutor.availableTime || '5:00 PM - 8:00 PM');
  const [expectedSalary, setExpectedSalary] = useState(tutor.expectedSalary || 6000);
  const [preferredStudentGender, setPreferredStudentGender] = useState<'any' | 'male' | 'female'>(tutor.preferredStudentGender || 'any');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Real-time CV calculation
  const currentDraft = {
    fullName,
    gender,
    phone,
    area,
    aboutMe,
    tutorCategory,
    madrasaDetails: {
      category: tutorCategory,
      isHafiz,
      qiratTajweedCertificate,
      madrasaBoard,
      highestSanadOrDegree,
      sanadPassingYear,
      sanadDivisionOrGpa,
      specializationDept,
      currentKhidmatOrInstitution
    },
    university,
    department,
    ssc: { schoolOrCollege: sscSchool, gpa: sscGpa, passingYear: sscYear, board: sscBoard },
    hsc: { schoolOrCollege: hscCollege, gpa: hscGpa, passingYear: hscYear, board: hscBoard },
    preferredClasses,
    preferredSubjects,
    preferredAreas,
    expectedSalary,
    teachingExperienceYears
  };

  const completionCalc = calculateCvCompletion(currentDraft as any);

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    store.updateTutorProfile(tutor.id, {
      fullName,
      gender,
      dateOfBirth,
      phone,
      email,
      currentAddress,
      permanentAddress,
      district,
      area,
      preferredAreas,
      aboutMe,
      tutorCategory,
      madrasaDetails: {
        category: tutorCategory,
        isHafiz,
        qiratTajweedCertificate,
        madrasaBoard,
        highestSanadOrDegree,
        sanadPassingYear,
        sanadDivisionOrGpa,
        specializationDept,
        currentKhidmatOrInstitution: currentKhidmatOrInstitution || university
      },
      university: tutorCategory === 'qawmi_madrasa' ? (currentKhidmatOrInstitution || university) : university,
      department: tutorCategory === 'qawmi_madrasa' ? (specializationDept || highestSanadOrDegree) : department,
      programDegree: tutorCategory === 'qawmi_madrasa' ? highestSanadOrDegree : programDegree,
      admissionYear,
      currentYearSemester,
      ssc: { schoolOrCollege: sscSchool, board: sscBoard, gpa: sscGpa, passingYear: sscYear },
      hsc: { schoolOrCollege: hscCollege, board: hscBoard, gpa: hscGpa, passingYear: hscYear },
      teachingExperienceYears: Number(teachingExperienceYears),
      teachingMethod,
      preferredClasses,
      preferredSubjects,
      preferredMediums,
      categories,
      onlineTeaching,
      homeTuition,
      coachingGroupTuition,
      availableDays,
      availableTime,
      expectedSalary: Number(expectedSalary),
      preferredStudentGender
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSubmitForVerification = () => {
    if (completionCalc.percent < 100) {
      setErrorMsg(`Profile must be 100% complete before verification. Missing: ${completionCalc.missing.join(', ')}`);
      return;
    }

    try {
      store.submitTutorForVerification(tutor.id);
      alert('Your CV has been submitted to TutorHat Admin for official verification!');
      navigateTo('tutor-dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('tutor-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-950 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tutor Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-blue-950">
            {language === 'bn' ? 'সম্পূর্ণ সিভি প্রস্তুত ও এডিট' : 'Complete Your Tutor CV'}
          </h1>
        </div>

        {/* Live Completion Indicator */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-xs tabular-nums">
            {completionCalc.percent}%
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">CV Completion</span>
            <span className="text-xs font-bold text-blue-950">
              {completionCalc.percent === 100 ? '✓ Ready for Verification' : `${completionCalc.missing.length} fields missing`}
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider pb-2 border-b border-slate-100">
            1. Basic Personal Information (ব্যক্তিগত তথ্য)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-900 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">District (জেলা - A to Z) *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs font-medium"
              >
                {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <span className="text-[11px] text-slate-400 mt-0.5 block">বাংলাদেশের ৬৪টি জেলা বর্ণানুক্রমে সাজানো</span>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Present Address (বর্তমান ঠিকানা) *</label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setCurrentAddress(e.target.value);
                }}
                placeholder="বাড়ি/রোড নম্বর, এলাকা, থানা/উপজেলা লিখুন (যেমন: ধানমন্ডি-৩২ / আগ্রাবাদ / জিন্দাবাজার)"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">আপনার বর্তমান সঠিক ঠিকানা লিখুন (যেকোনো এলাকা/উপজেলা)</span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-900 block mb-1">About Me (Bio for Guardians) *</label>
            <textarea
              rows={3}
              required
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Describe your university background, subject mastery, and teaching dedication..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">Minimum 30 characters recommended for high matching score.</span>
          </div>
        </div>

        {/* Section 2: Education (University, SSC, HSC) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs">
          <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>2. Academic Background (শিক্ষাগত যোগ্যতা)</span>
          </h2>

          {/* University */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h3 className="font-bold text-blue-950 text-xs uppercase">University / Degree *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  list="univ-list"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. BUET / University of Dhaka"
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
                <datalist id="univ-list">
                  {UNIVERSITIES_LIST.map(u => <option key={u} value={u} />)}
                </datalist>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department / Discipline *</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. EEE / Physics / English"
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Degree Program</label>
                <input
                  type="text"
                  value={programDegree}
                  onChange={(e) => setProgramDegree(e.target.value)}
                  placeholder="e.g. B.Sc. Engineering / B.A. Honours"
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Year / Semester</label>
                <input
                  type="text"
                  value={currentYearSemester}
                  onChange={(e) => setCurrentYearSemester(e.target.value)}
                  placeholder="e.g. 3rd Year / Completed"
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl focus:bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* HSC */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase">Higher Secondary Certificate (HSC) *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">College Name *</label>
                <input
                  type="text"
                  required
                  value={hscCollege}
                  onChange={(e) => setHscCollege(e.target.value)}
                  placeholder="e.g. Notre Dame College"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">HSC GPA *</label>
                <input
                  type="text"
                  required
                  value={hscGpa}
                  onChange={(e) => setHscGpa(e.target.value)}
                  placeholder="5.00"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Passing Year *</label>
                <input
                  type="text"
                  required
                  value={hscYear}
                  onChange={(e) => setHscYear(e.target.value)}
                  placeholder="2020"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SSC */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase">Secondary School Certificate (SSC) *</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  value={sscSchool}
                  onChange={(e) => setSscSchool(e.target.value)}
                  placeholder="e.g. Ideal School & College"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">SSC GPA *</label>
                <input
                  type="text"
                  required
                  value={sscGpa}
                  onChange={(e) => setSscGpa(e.target.value)}
                  placeholder="5.00"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Passing Year *</label>
                <input
                  type="text"
                  required
                  value={sscYear}
                  onChange={(e) => setSscYear(e.target.value)}
                  placeholder="2018"
                  className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Section 3: Teaching Preferences & Experience */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs">
          <h2 className="text-sm font-bold text-blue-950 uppercase tracking-wider pb-2 border-b border-slate-100">
            3. Teaching Preferences & Methods (পাঠদানের পছন্দ)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-900 block mb-1">Experience (Years) *</label>
              <input
                type="number"
                min="0"
                max="25"
                value={teachingExperienceYears}
                onChange={(e) => setTeachingExperienceYears(Number(e.target.value))}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Expected Monthly Fee (৳) *</label>
              <input
                type="number"
                min="2000"
                max="30000"
                step="500"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(Number(e.target.value))}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1">Preferred Student Gender</label>
              <select
                value={preferredStudentGender}
                onChange={(e) => setPreferredStudentGender(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="any">Any (Male or Female)</option>
                <option value="male">Male Students Only</option>
                <option value="female">Female Students Only</option>
              </select>
            </div>
          </div>

          {/* Preferred Classes */}
          <div>
            <label className="font-semibold text-slate-900 block mb-2">Preferred Classes * (Choose at least one)</label>
            <div className="flex flex-wrap gap-1.5">
              {CLASS_LEVELS.map((cls) => {
                const selected = preferredClasses.includes(cls);
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => toggleArrayItem(preferredClasses, setPreferredClasses, cls)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selected ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Subjects */}
          <div>
            <label className="font-semibold text-slate-900 block mb-2">Preferred Subjects * (Choose at least one)</label>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS_LIST.map((sub) => {
                const selected = preferredSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleArrayItem(preferredSubjects, setPreferredSubjects, sub)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selected ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Mediums */}
          <div>
            <label className="font-semibold text-slate-900 block mb-2">Preferred Mediums / Curriculums</label>
            <div className="flex flex-wrap gap-1.5">
              {MEDIUMS.map((m) => {
                const selected = preferredMediums.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleArrayItem(preferredMediums, setPreferredMediums, m)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selected ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Areas */}
          <div>
            <label className="font-semibold text-slate-900 block mb-2">
              পছন্দের টিউশন এলাকা (Preferred Tutoring Areas) *
            </label>
            
            {/* Active Selected Areas */}
            <div className="flex flex-wrap gap-1.5 mb-3 min-h-[32px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {preferredAreas.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 bg-blue-900 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => setPreferredAreas(preferredAreas.filter(x => x !== a))}
                    className="hover:text-rose-200 font-bold ml-0.5"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
              {preferredAreas.length === 0 && (
                <span className="text-xs text-slate-400 italic self-center">কোনো পছন্দের এলাকা যুক্ত করা হয়নি</span>
              )}
            </div>

            {/* Add Custom Area Input for Any District/Area */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPreferredArea}
                onChange={(e) => setNewPreferredArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newPreferredArea.trim() && !preferredAreas.includes(newPreferredArea.trim())) {
                      setPreferredAreas([...preferredAreas, newPreferredArea.trim()]);
                      setNewPreferredArea('');
                    }
                  }
                }}
                placeholder="যেকোনো জেলা/এলাকা বা থানার নাম লিখুন (যেমন: আগ্রাবাদ, উপশহর, বাড্ডা, চকবাজার)..."
                className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newPreferredArea.trim() && !preferredAreas.includes(newPreferredArea.trim())) {
                    setPreferredAreas([...preferredAreas, newPreferredArea.trim()]);
                    setNewPreferredArea('');
                  }
                }}
                className="px-3.5 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                + যোগ করুন
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">কুইক সাজেশন (ক্লিক করে যোগ/বাদ দিন):</span>
              <div className="flex flex-wrap gap-1">
                {DHAKA_AREAS.slice(0, 16).map((a) => {
                  const selected = preferredAreas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleArrayItem(preferredAreas, setPreferredAreas, a)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                        selected ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}{a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-900 block mb-1">Teaching Methodology (পড়ানোর কৌশল)</label>
            <textarea
              rows={2}
              value={teachingMethod}
              onChange={(e) => setTeachingMethod(e.target.value)}
              placeholder="e.g. Concept-oriented discussion, formula flashcards, weekly quizzes..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

        </div>

        {/* Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Draft</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitForVerification}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 min-h-[44px] ${
              completionCalc.percent === 100
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit for Admin Verification ({completionCalc.percent}%)</span>
          </button>
        </div>

      </form>

    </div>
  );
};
