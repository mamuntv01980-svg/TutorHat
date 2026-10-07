import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  BookOpen, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { 
  BD_DISTRICTS, 
  DHAKA_AREAS, 
  CLASS_LEVELS, 
  SUBJECTS_LIST, 
  MEDIUMS, 
  UNIVERSITIES_LIST 
} from '../constants/bangladeshData';

export const RegisterPage: React.FC = () => {
  const { navigateTo, language, loginAs } = useApp();

  const [role, setRole] = useState<'tutor' | 'guardian'>('tutor');
  const [currentStep, setCurrentStep] = useState(1); // 1 to 8 for tutor

  // Step 1: Account
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Personal Info
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [aboutMe, setAboutMe] = useState('');

  // Step 3: Education
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [programDegree, setProgramDegree] = useState('B.Sc. / B.A.');
  const [hscCollege, setHscCollege] = useState('');
  const [hscGpa, setHscGpa] = useState('5.00');
  const [sscSchool, setSscSchool] = useState('');
  const [sscGpa, setSscGpa] = useState('5.00');

  // Step 4: Teaching Experience
  const [experienceYears, setExperienceYears] = useState(1);
  const [teachingMethod, setTeachingMethod] = useState('');

  // Step 5: Subjects & Classes
  const [preferredClasses, setPreferredClasses] = useState<string[]>(['Class 9 (SSC)', 'Class 10 (SSC)']);
  const [preferredSubjects, setPreferredSubjects] = useState<string[]>(['Mathematics', 'Physics']);

  // Step 6: Teaching Preferences
  const [preferredMediums, setPreferredMediums] = useState<string[]>(['Bangla Medium', 'English Version']);
  const [preferredAreas, setPreferredAreas] = useState<string[]>(['Dhanmondi']);
  const [expectedSalary, setExpectedSalary] = useState(6000);
  const [homeTuition, setHomeTuition] = useState(true);
  const [onlineTeaching, setOnlineTeaching] = useState(true);

  // Step 7: Availability
  const [availableDays, setAvailableDays] = useState<string[]>(['Saturday', 'Monday', 'Wednesday']);
  const [availableTime, setAvailableTime] = useState('5:00 PM - 7:30 PM');
  const [preferredStudentGender, setPreferredStudentGender] = useState<'any' | 'male' | 'female'>('any');

  // Step 8: Terms & Submit
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const validateStep = (step: number): boolean => {
    setError('');
    if (step === 1) {
      if (!mobileNumber.trim()) {
        setError('Please enter your mobile phone number.');
        return false;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      const existing = store.findUserByPhoneOrEmail(mobileNumber);
      if (existing) {
        setError('This mobile phone number is already registered.');
        return false;
      }
    } else if (step === 2) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
    } else if (step === 3) {
      if (!university.trim() || !department.trim()) {
        setError('Please provide your university name and department.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(8, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }

    const newUser = store.createUser({
      name: fullName.trim() || 'New User',
      email: email.trim() || `${mobileNumber}@tutorhat.user`,
      phone: mobileNumber.trim(),
      role,
      gender,
      location: `${area}, ${district}`,
      district
    });

    // If tutor, update full CV details
    if (role === 'tutor') {
      const tutor = store.getTutorByUserId(newUser.id);
      if (tutor) {
        store.updateTutorProfile(tutor.id, {
          fullName,
          gender,
          dateOfBirth,
          district,
          area,
          preferredAreas,
          aboutMe,
          university,
          department,
          programDegree,
          hsc: { schoolOrCollege: hscCollege || 'College', board: 'Dhaka', gpa: hscGpa, passingYear: '2020' },
          ssc: { schoolOrCollege: sscSchool || 'School', board: 'Dhaka', gpa: sscGpa, passingYear: '2018' },
          teachingExperienceYears: Number(experienceYears),
          teachingMethod,
          preferredClasses,
          preferredSubjects,
          preferredMediums,
          expectedSalary: Number(expectedSalary),
          availableDays,
          availableTime,
          homeTuition,
          onlineTeaching,
          preferredStudentGender
        });
      }
    }

    loginAs(role, newUser.id);

    if (role === 'tutor') {
      navigateTo('tutor-dashboard');
    } else {
      navigateTo('guardian-dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      
      {/* Title & Role Switcher */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
          {language === 'bn' ? 'TutorHat নিবন্ধন' : 'TutorHat Registration'}
        </h1>
        <p className="text-xs text-slate-600">
          {role === 'tutor' 
            ? (language === 'bn' ? '৮টি সহজ ধাপে সম্পূর্ণ ভেরিফাইড সিভি তৈরি করুন' : 'Complete 8 organized steps to build your verified CV') 
            : (language === 'bn' ? 'অভিভাবক হিসেবে ফ্রি অ্যাকাউন্ট তৈরি করুন' : 'Create free account as Guardian / Student')}
        </p>

        {/* Role Toggle */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mt-2">
          <button
            type="button"
            onClick={() => { setRole('tutor'); setCurrentStep(1); }}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'tutor' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Tutor (শিক্ষক)
          </button>
          <button
            type="button"
            onClick={() => { setRole('guardian'); setCurrentStep(1); }}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'guardian' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Guardian (অভিভাবক)
          </button>
        </div>
      </div>

      {/* Tutor Multi-Step Progress Indicator (Section 57: Step X of 8) */}
      {role === 'tutor' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-950">
            <span>Step {currentStep} of 8: {[
              'Account',
              'Personal Information',
              'Education',
              'Teaching Experience',
              'Subjects & Classes',
              'Teaching Preferences',
              'Availability',
              'Review & Submit'
            ][currentStep - 1]}</span>
            <span className="font-mono text-blue-800">{Math.round((currentStep / 8) * 100)}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 font-medium">
          {error}
        </div>
      )}

      {/* Main Form Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-xs">
        
        {/* ===================== TUTOR STEPS ===================== */}
        {role === 'tutor' && (
          <div className="space-y-5">
            
            {/* Step 1: Account */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 1: Account Credentials</h3>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number (মোবাইল নম্বর) *</label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Email Address (ইমেইল) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@university.edu"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 2: Personal Information</h3>
                <div>
                  <label className="font-semibold block mb-1">Full Name (পুরো নাম) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahim Chowdhury"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">District *</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    >
                      {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Living Area *</label>
                    <select
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    >
                      {DHAKA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">About Me (Bio for Guardians)</label>
                  <textarea
                    rows={2}
                    value={aboutMe}
                    onChange={e => setAboutMe(e.target.value)}
                    placeholder="Brief introduction about your passion for tutoring..."
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 3: Academic Background</h3>
                <div>
                  <label className="font-semibold block mb-1">University Name *</label>
                  <input
                    type="text"
                    required
                    list="univ-options"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    placeholder="e.g. University of Dhaka / BUET"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                  <datalist id="univ-options">
                    {UNIVERSITIES_LIST.map(u => <option key={u} value={u} />)}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Department / Subject *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="e.g. Physics / EEE"
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Degree</label>
                    <input
                      type="text"
                      value={programDegree}
                      onChange={e => setProgramDegree(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-semibold block mb-1">HSC College & GPA</label>
                    <input
                      type="text"
                      value={hscCollege}
                      onChange={e => setHscCollege(e.target.value)}
                      placeholder="College Name"
                      className="w-full p-2 bg-slate-50 border rounded-xl mb-1"
                    />
                    <input
                      type="text"
                      value={hscGpa}
                      onChange={e => setHscGpa(e.target.value)}
                      placeholder="GPA 5.00"
                      className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">SSC School & GPA</label>
                    <input
                      type="text"
                      value={sscSchool}
                      onChange={e => setSscSchool(e.target.value)}
                      placeholder="School Name"
                      className="w-full p-2 bg-slate-50 border rounded-xl mb-1"
                    />
                    <input
                      type="text"
                      value={sscGpa}
                      onChange={e => setSscGpa(e.target.value)}
                      placeholder="GPA 5.00"
                      className="w-full p-2 bg-slate-50 border rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Teaching Experience */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 4: Teaching Experience</h3>
                <div>
                  <label className="font-semibold block mb-1">Years of Teaching Experience *</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Teaching Methodology (পাঠদানের পদ্ধতি)</label>
                  <textarea
                    rows={3}
                    value={teachingMethod}
                    onChange={e => setTeachingMethod(e.target.value)}
                    placeholder="Explain how you simplify concepts and take regular quizzes..."
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Subjects & Classes */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 5: Classes & Subjects</h3>
                <div>
                  <label className="font-semibold block mb-1.5">Select Preferred Classes *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CLASS_LEVELS.slice(0, 10).map(c => {
                      const sel = preferredClasses.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleItem(preferredClasses, setPreferredClasses, c)}
                          className={`px-2.5 py-1 rounded-lg border font-medium ${
                            sel ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1.5">Select Preferred Subjects *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS_LIST.slice(0, 8).map(s => {
                      const sel = preferredSubjects.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleItem(preferredSubjects, setPreferredSubjects, s)}
                          className={`px-2.5 py-1 rounded-lg border font-medium ${
                            sel ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Teaching Preferences */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 6: Preferences & Expected Fee</h3>
                <div>
                  <label className="font-semibold block mb-1">Expected Monthly Fee (BDT ৳) *</label>
                  <input
                    type="number"
                    min="2000"
                    max="25000"
                    step="500"
                    value={expectedSalary}
                    onChange={e => setExpectedSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm font-bold"
                  />
                </div>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homeTuition}
                      onChange={e => setHomeTuition(e.target.checked)}
                      className="accent-blue-900 rounded"
                    />
                    <span>Home Tuition (ছাত্র/ছাত্রীর বাসায়)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlineTeaching}
                      onChange={e => setOnlineTeaching(e.target.checked)}
                      className="accent-blue-900 rounded"
                    />
                    <span>Online Tuition</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 7: Availability */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 7: Schedule & Availability</h3>
                <div>
                  <label className="font-semibold block mb-1">Available Daily Time</label>
                  <input
                    type="text"
                    value={availableTime}
                    onChange={e => setAvailableTime(e.target.value)}
                    placeholder="e.g. 5:00 PM - 7:30 PM"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1.5">Available Days of Week</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => {
                      const sel = availableDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleItem(availableDays, setAvailableDays, d)}
                          className={`px-3 py-1.5 rounded-xl border font-medium ${
                            sel ? 'bg-blue-900 text-white border-blue-900' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Review & Submit */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Step 8: Review & Final Submission</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border space-y-1.5 text-xs text-slate-700">
                  <p><strong>Name:</strong> {fullName} ({gender})</p>
                  <p><strong>Phone:</strong> {mobileNumber} · <strong>Email:</strong> {email}</p>
                  <p><strong>University:</strong> {university} ({department})</p>
                  <p><strong>Living Area:</strong> {area}, {district}</p>
                  <p><strong>Expected Fee:</strong> ৳{expectedSalary}/month</p>
                  <p><strong>Preferred Subjects:</strong> {preferredSubjects.join(', ')}</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded accent-blue-900"
                    />
                    <span>
                      I certify that all educational information provided is authentic and agree to TutorHat Terms & Conditions.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {currentStep < 8 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-blue-800"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Tutor Registration</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* ===================== GUARDIAN FORM ===================== */}
        {role === 'guardian' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h3 className="font-bold text-sm text-blue-950 border-b pb-2">Guardian Registration Form</h3>
            
            <div>
              <label className="font-semibold block mb-1">Guardian Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Farhana Begum"
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl tabular-nums"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">District</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Area</label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {DHAKA_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-blue-900"
                />
                <span>I agree to TutorHat Terms & Conditions and Privacy Policy.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
            >
              Complete Guardian Registration
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
