import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Calendar,
  BookOpen
} from 'lucide-react';
import { TutorProfile } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';

interface IssueCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutors: TutorProfile[];
  onSuccess?: () => void;
}

export const IssueCertificateModal: React.FC<IssueCertificateModalProps> = ({
  isOpen,
  onClose,
  tutors,
  onSuccess
}) => {
  const { language } = useApp();

  const [tutorId, setTutorId] = useState<string>(tutors[0]?.id || '');
  const [title, setTitle] = useState<string>('Excellence in Science & Mathematics Mentorship');
  const [gradeHonor, setGradeHonor] = useState<any>('Outstanding Mentor');
  const [subject, setSubject] = useState<string>('Secondary & Higher Secondary Science');
  const [totalHoursCompleted, setTotalHoursCompleted] = useState<number>(120);
  const [description, setDescription] = useState<string>(
    'Recognized for exceptional commitment to student academic progress, 100% attendance punctuality, and outstanding guardian feedback on the TutorHat platform.'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedTutor = tutors.find(t => t.id === tutorId) || tutors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;

    setSubmitting(true);

    store.issueCertificate({
      tutorId: selectedTutor.id,
      tutorName: selectedTutor.fullName,
      title,
      gradeHonor,
      subject,
      totalHoursCompleted,
      issueDate: new Date().toISOString().split('T')[0],
      description,
      status: 'active',
      issuedBy: 'TutorHat Academic Verification Board'
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-4 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
              <Award className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'টিউটরকে প্রশংসাপত্র / অভিজ্ঞতা সনদ প্রদান' : 'Issue Official Experience Certificate'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'ভেরিফাইড সনদ আইডি ও ডিজিটাল সীলসহ সার্টিফিকেট তৈরি' : 'Generate verified certificate with official seal & code'}
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

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-emerald-950">
              {language === 'bn' ? 'সার্টিফিকেট সফলভাবে প্রদান করা হয়েছে!' : 'Certificate Issued Successfully!'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'bn' ? 'টিউটরের ড্যাশবোর্ডে নোটিফিকেশন ও প্রশংসাপত্র যুক্ত হয়েছে।' : 'Tutor has been awarded and notified.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Tutor Selection */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'প্রাপক শিক্ষক নির্বাচন *' : 'Select Recipient Tutor *'}
              </label>
              <select
                value={tutorId}
                onChange={(e) => setTutorId(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
              >
                {tutors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} — {t.university} ({t.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'সার্টিফিকেটের শিরোনাম *' : 'Certificate Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excellence in Science Mentorship"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-hidden"
              />
            </div>

            {/* Grade Honor & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'সম্মানসূচক পদবী / গ্রেড *' : 'Honor Grade *'}
                </label>
                <select
                  value={gradeHonor}
                  onChange={(e) => setGradeHonor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-hidden"
                >
                  <option value="Outstanding Mentor">Outstanding Mentor (অসাধারণ)</option>
                  <option value="Distinguished Educator">Distinguished Educator (বিশিষ্ট শিক্ষক)</option>
                  <option value="Verified Star Tutor">Verified Star Tutor (স্টার টিউটর)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'পাঠদানের মোট ঘণ্টা' : 'Total Hours Mentored'}
                </label>
                <input
                  type="number"
                  min={10}
                  value={totalHoursCompleted}
                  onChange={(e) => setTotalHoursCompleted(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
                />
              </div>
            </div>

            {/* Subject Area */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'পাঠদান ক্ষেত্র / বিষয়াবলী' : 'Subject Field'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="যেমন: SSC Physics & Higher Mathematics"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white outline-hidden"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'প্রশংসাপত্র বিবরণ / সুপারিশ বার্তা *' : 'Citation / Recommendation *'}
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-800 outline-hidden"
              />
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
                disabled={submitting || !selectedTutor}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>{language === 'bn' ? 'সনদ ইস্যু করুন' : 'Issue Certificate'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
