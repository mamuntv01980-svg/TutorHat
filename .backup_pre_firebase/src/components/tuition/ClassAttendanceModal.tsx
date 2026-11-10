import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  User, 
  AlertCircle,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { TuitionConfirmation, AttendanceRecord } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';

interface ClassAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmations: TuitionConfirmation[];
  defaultTutorId: string;
  defaultTutorName: string;
  onSuccess?: () => void;
}

export const ClassAttendanceModal: React.FC<ClassAttendanceModalProps> = ({
  isOpen,
  onClose,
  confirmations,
  defaultTutorId,
  defaultTutorName,
  onSuccess
}) => {
  const { language } = useApp();
  
  // Available active tuitions for this tutor
  const activeConfirmations = confirmations.filter(c => c.status === 'confirmed');

  const [selectedConfId, setSelectedConfId] = useState<string>(activeConfirmations[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('05:30 PM');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [status, setStatus] = useState<AttendanceRecord['status']>('present');
  const [topicsCovered, setTopicsCovered] = useState<string>('');
  const [homeworkAssigned, setHomeworkAssigned] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedConf = confirmations.find(c => c.id === selectedConfId) || activeConfirmations[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConf) return;

    store.logClassAttendance({
      date,
      time,
      durationMinutes,
      status,
      tutorId: defaultTutorId,
      tutorName: defaultTutorName,
      guardianId: selectedConf.guardianId,
      studentName: selectedConf.studentName,
      jobId: selectedConf.jobId,
      topicsCovered,
      homeworkAssigned,
      notes: notes || `${date} তারিখের নিয়মিত পাঠদান সম্পন্ন।`,
      verifiedByGuardian: false
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
      // Reset form
      setTopicsCovered('');
      setHomeworkAssigned('');
      setNotes('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-4 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'ক্লাস হাজিরা ও দৈনিক পড়া লগ করুন' : 'Log Daily Class Attendance'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'ডিজিটাল ক্লাস হাজিরা ও স্টাডি ডায়েরি' : 'Daily Attendance & Study Log'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-emerald-950">
              {language === 'bn' ? 'ক্লাস হাজিরা সফলভাবে লগ করা হয়েছে!' : 'Attendance Logged Successfully!'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'অভিভাবকের ড্যাশবোর্ডে নোটিফিকেশন পৌঁছে গেছে।' : 'Guardian has been notified to verify attendance.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Tuition Selection */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'কোন টিউশনের ক্লাস? *' : 'Select Active Tuition *'}
              </label>
              {activeConfirmations.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  {language === 'bn' ? 'বর্তমানে কোনো সক্রিয় টিউশন চুক্তি পাওয়া যায়নি।' : 'No active tuition agreement found.'}
                </div>
              ) : (
                <select
                  value={selectedConfId}
                  onChange={(e) => setSelectedConfId(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
                >
                  {activeConfirmations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.studentName} — {c.jobTitle} ({c.guardianName})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Date, Time & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'ক্লাসের তারিখ *' : 'Class Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'ক্লাসের সময় *' : 'Class Time *'}
                </label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="যেমন: 05:30 PM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'ক্লাসের ব্যাপ্তি *' : 'Duration *'}
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-hidden"
                >
                  <option value={60}>৬০ মিনিট (১ ঘণ্টা)</option>
                  <option value={90}>৯০ মিনিট (১.৫ ঘণ্টা)</option>
                  <option value={120}>১২০ মিনিট (২ ঘণ্টা)</option>
                  <option value={150}>১৫০ মিনিট (২.৫ ঘণ্টা)</option>
                </select>
              </div>
            </div>

            {/* Attendance Status */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                {language === 'bn' ? 'উপস্থিতির স্ট্যাটাস *' : 'Attendance Status *'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'present', label: 'উপস্থিত (Present)', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                  { id: 'late', label: 'বিলম্ব (Late)', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                  { id: 'absent', label: 'অনুপস্থিত (Absent)', color: 'border-rose-500 bg-rose-50 text-rose-900' },
                  { id: 'cancelled', label: 'বাতিল (Off)', color: 'border-slate-400 bg-slate-100 text-slate-800' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatus(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      status === item.id 
                        ? `${item.color} ring-2 ring-blue-900 shadow-xs font-black` 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Covered */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'আজকের পাঠ / টপিক (Topics Covered) *' : 'Topics Covered *'}
              </label>
              <textarea
                required
                rows={2}
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: পদার্থবিজ্ঞান ৩য় অধ্যায় বলের সূত্র ও গাণিতিক উদাহরণ সমাধান।' : 'e.g. Physics Chapter 3 force & motion formulas.'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
              />
            </div>

            {/* Homework Assigned */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'বাড়ির কাজ / হোমওয়ার্ক (Homework Assigned)' : 'Homework Assigned'}
              </label>
              <input
                type="text"
                value={homeworkAssigned}
                onChange={(e) => setHomeworkAssigned(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: অনুশীলনী ৩.১ এর সব অঙ্ক এবং বোর্ড প্রশ্ন ২০২৪ রিভিশন।' : 'e.g. Exercise 3.1 all problems.'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
              />
            </div>

            {/* Tutor Remarks / Notes */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'শিক্ষকের নোট / শিক্ষার্থীর পারফরম্যান্স' : 'Tutor Remarks'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: মনোযোগ ভালো ছিল, সূত্রের ব্যবহারে উন্নতি হয়েছে।' : 'e.g. Good focus today.'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
              />
            </div>

            {/* Guardian notice */}
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-[11px] text-blue-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                {language === 'bn' 
                  ? 'হাজিরা সেভ করলে স্বয়ংক্রিয়ভাবে অভিভাবকের অ্যাকাউন্টে ক্লাস ডায়েরি যুক্ত হবে এবং মাস শেষে বেতনের নিখুঁত হিসাব পাওয়া যাবে।' 
                  : 'Logging attendance updates the guardian portal and maintains a transparent monthly class count.'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!selectedConf}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'হাজিরা ও পড়া সেভ করুন' : 'Save Attendance'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
