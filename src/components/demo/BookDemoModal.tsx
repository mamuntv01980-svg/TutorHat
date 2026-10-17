import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Laptop, 
  Home, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  BookOpen, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { TutorProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import { store, tutorProfileImg } from '../../services/store';

interface BookDemoModalProps {
  tutor: TutorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, language, navigateTo } = useApp();

  // Helper date for default tomorrow
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Form State
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState(tutor?.preferredClasses?.[0] || 'Class 9 (SSC)');
  const [subject, setSubject] = useState(tutor?.preferredSubjects?.[0] || 'General Science');
  const [date, setDate] = useState(getTomorrowDate());
  const [time, setTime] = useState('5:30 PM');
  const [mode, setMode] = useState<'home' | 'online'>(tutor?.homeTuition ? 'home' : 'online');
  const [location, setLocation] = useState(currentUser?.location || 'Dhanmondi, Dhaka');
  const [guardianPhone, setGuardianPhone] = useState(currentUser?.phone || '01799887766');
  const [guardianName, setGuardianName] = useState(currentUser?.name || 'অভিভাবক');
  const [notes, setNotes] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !tutor) return null;

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '3:30 PM',
    '4:30 PM',
    '5:30 PM',
    '6:30 PM',
    '7:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMsg(language === 'bn' ? 'শিক্ষার্থীর নাম লিখুন।' : 'Please enter student name.');
      return;
    }
    if (!guardianPhone.trim()) {
      setErrorMsg(language === 'bn' ? 'মোবাইল নম্বর লিখুন।' : 'Please enter contact number.');
      return;
    }

    try {
      store.bookFreeDemo({
        tutorId: tutor.id,
        tutorName: tutor.fullName,
        tutorPhone: tutor.phone,
        tutorPhoto: tutor.photo,
        tutorUniversity: tutor.university,
        guardianId: currentUser?.id || 'user_guardian_01',
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        studentName: studentName.trim(),
        studentGrade: studentGrade.trim(),
        subject: subject.trim(),
        date,
        time,
        mode,
        location: mode === 'home' ? location : 'Online Google Meet',
        notes: notes.trim()
      });

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg(language === 'bn' ? 'ডেমো বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Failed to book demo. Please try again.');
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  const handleGoToDemos = () => {
    handleClose();
    navigateTo('guardian-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-blue-950 leading-tight">
                {language === 'bn' ? 'ফ্রি ডেমো ক্লাস বুক করুন' : 'Book Free Demo Class'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? '১ম ক্লাস সম্পূর্ণ ফ্রি • কোনো অগ্রিম ফি নেই' : '1st class 100% Free • No advance payment'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Tutor Info Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={tutor.photo || tutorProfileImg}
                alt={tutor.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{tutor.fullName}</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {tutor.university} • {tutor.department}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-amber-500 font-bold">★ {tutor.rating ? tutor.rating.toFixed(1) : '5.0'}</span>
                  <span className="text-slate-400">({tutor.totalReviews} রিভিউ)</span>
                  {tutor.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold text-[10px] ml-1 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      ভেরিফাইড
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300 shrink-0">
              ফ্রি ট্রায়াল
            </span>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-lg text-slate-900">
                  {language === 'bn' ? 'ডেমো ক্লাস সফলভাবে বুক হয়েছে!' : 'Demo Class Booked Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {language === 'bn'
                    ? `শিক্ষক ${tutor.fullName}-এর কাছে রিকোয়েস্ট ও শিডিউল নোটিফিকেশন পাঠানো হয়েছে। নির্ধারিত সময়ে ক্লাস অনুষ্ঠিত হবে।`
                    : `Notification sent to ${tutor.fullName}. The session is confirmed on your dashboard schedule.`}
                </p>
              </div>

              {/* Schedule Summary Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 max-w-sm mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">তারিখ ও সময়:</span>
                  <span className="font-bold text-slate-900">{date} • {time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">শিক্ষার্থী ও বিষয়:</span>
                  <span className="font-bold text-slate-900">{studentName} ({studentGrade}) - {subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পাঠদানের মোড:</span>
                  <span className="font-bold text-blue-900 capitalize">
                    {mode === 'home' ? 'বাসায় (Home Tutoring)' : 'অনলাইন (Live Google Meet)'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleGoToDemos}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>আমার ড্যাশবোর্ডে দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student Name & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'শিক্ষার্থীর নাম *' : 'Student Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="যেমন: তাহমিদ হাসান"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'শ্রেণি / লেভেল *' : 'Class / Grade *'}
                  </label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                  >
                    {tutor.preferredClasses && tutor.preferredClasses.length > 0 ? (
                      tutor.preferredClasses.map(c => <option key={c} value={c}>{c}</option>)
                    ) : (
                      <>
                        <option value="Class 8 (JSC)">Class 8 (Junior)</option>
                        <option value="Class 9 (SSC)">Class 9 (SSC)</option>
                        <option value="Class 10 (SSC)">Class 10 (SSC)</option>
                        <option value="HSC 1st Year">HSC 1st Year</option>
                        <option value="HSC 2nd Year">HSC 2nd Year</option>
                        <option value="O Level">O Level (Standard)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Subject & Teaching Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'ডেমো ক্লাসের বিষয় *' : 'Subject for Demo *'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                  >
                    {tutor.preferredSubjects && tutor.preferredSubjects.length > 0 ? (
                      tutor.preferredSubjects.map(s => <option key={s} value={s}>{s}</option>)
                    ) : (
                      <>
                        <option value="Physics">Physics (পদার্থবিজ্ঞান)</option>
                        <option value="Higher Mathematics">Higher Mathematics (উচ্চতর গণিত)</option>
                        <option value="Mathematics">General Mathematics (গণিত)</option>
                        <option value="Chemistry">Chemistry (রসায়ন)</option>
                        <option value="English">English</option>
                        <option value="Biology">Biology (জীববিজ্ঞান)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'পাঠদানের মোড *' : 'Tuition Mode *'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMode('home')}
                      className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        mode === 'home' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>বাসায় এসে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('online')}
                      className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        mode === 'online' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>অনলাইনে</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'পছন্দের তারিখ *' : 'Preferred Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'পছন্দের সময় *' : 'Preferred Time Slot *'}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs font-semibold"
                  >
                    {timeSlots.map(tSlot => (
                      <option key={tSlot} value={tSlot}>{tSlot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location or Address if Home Mode */}
              {mode === 'home' && (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'বাসার পূর্ণাঙ্গ ঠিকানা (এলাকা ও রোড) *' : 'Home Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: বাড়ি #২৪, রোড #১০/এ, ধানমন্ডি, ঢাকা"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                  />
                </div>
              )}

              {/* Guardian Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'অভিভাবকের নাম' : 'Guardian Name'}
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {language === 'bn' ? 'যোগাযোগের মোবাইল নম্বর *' : 'Contact Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Special Topic Note */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'শিক্ষকের জন্য বিশেষ নির্দেশনা বা টপিক (ঐচ্ছিক)' : 'Topic / Special Focus (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: গতিবিদ্যার গাণিতিক সমস্যাগুলোর ওপর ডেমো ক্লাস দেখতে চাই..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-xs"
                />
              </div>

              {/* Guarantee Strip */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-[11px] text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  {language === 'bn'
                    ? '১ম ডেমো ক্লাসের জন্য কোনো অগ্রিম ফি দিতে হবে না। ক্লাস সন্তোষজনক মনে হলেই কেবল চূড়ান্ত টিউশন নিশ্চিত করবেন।'
                    : 'No advance payment for the 1st demo class. Confirm tuition only if completely satisfied with the teaching.'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ফ্রি ডেমো শিডিউল কনফার্ম করুন' : 'Confirm Free Demo Booking'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
