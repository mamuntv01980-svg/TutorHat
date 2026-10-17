import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  User, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  GraduationCap,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TuitionConfirmation } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';

interface CreateProgressReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmations: TuitionConfirmation[];
  tutorId: string;
  tutorName: string;
  tutorUniversity?: string;
  onSubmitted?: () => void;
}

export const CreateProgressReportModal: React.FC<CreateProgressReportModalProps> = ({
  isOpen,
  onClose,
  confirmations,
  tutorId,
  tutorName,
  tutorUniversity,
  onSubmitted
}) => {
  const { language } = useApp();
  const [selectedConfId, setSelectedConfId] = useState<string>(confirmations[0]?.id || '');
  const [month, setMonth] = useState<string>('মার্চ ২০২৬');
  const [attendanceScore, setAttendanceScore] = useState<number>(95);
  const [homeworkScore, setHomeworkScore] = useState<number>(90);
  const [attentionScore, setAttentionScore] = useState<number>(88);
  const [quizScore, setQuizScore] = useState<number>(86);
  const [overallGrade, setOverallGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A+');
  const [strengths, setStrengths] = useState<string>('মূল বিষয় ও সূত্রাবলি দ্রুত আয়ত্ত করতে পারে। ক্লাসে স্বতঃস্ফূর্ত অংশগ্রহণ ও প্রশ্ন করার আগ্রহ চমৎকার।');
  const [improvementsNeeded, setImprovementsNeeded] = useState<string>('লিখিত পরীক্ষার সময় নির্ধারিত সময়ের মধ্যে উত্তর শেষ করার অভ্যাস বাড়াতে হবে।');
  const [tutorRemarks, setTutorRemarks] = useState<string>('শিক্ষার্থী অত্যন্ত পরিশ্রমী। বর্তমান ধারা বজায় রাখলে আগামী টার্ম পরীক্ষায় গোল্ডেন এ-প্লাস পাওয়ার সম্ভাবনা প্রবল।');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedConf = confirmations.find(c => c.id === selectedConfId) || confirmations[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConf) return;

    store.submitProgressReport({
      tutorId,
      tutorName,
      tutorUniversity: tutorUniversity || selectedConf.tutorUniversity,
      guardianId: selectedConf.guardianId,
      guardianName: selectedConf.guardianName,
      studentName: selectedConf.studentName,
      subject: selectedConf.subject || selectedConf.jobTitle,
      classLevel: selectedConf.studentClass || 'Class 9',
      month,
      attendanceScore,
      homeworkCompletionScore: homeworkScore,
      classAttentionScore: attentionScore,
      examOrQuizScore: quizScore,
      overallGrade,
      strengths,
      improvementsNeeded,
      tutorRemarks
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      if (onSubmitted) onSubmitted();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-xs animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-blue-950">
                  {language === 'bn' ? 'শিক্ষার্থী মাসিক অগ্রগতি রিপোর্ট প্রকাশ' : 'Create Student Progress Report'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-blue-950">
                  {language === 'bn' ? 'প্রগ্রেস রিপোর্ট' : 'Progress Report'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                অভিভাবকের নিকট শিক্ষার্থীর মাসিক পারফরম্যান্স, হোমওয়ার্ক ও মূল্যায়ন কার্ড প্রদান
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

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-black text-lg text-emerald-950">
              {language === 'bn' ? 'রিপোর্ট সফলভাবে প্রকাশিত হয়েছে!' : 'Report Published Successfully!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              অভিভাবকের ড্যাশবোর্ডে মূল্যায়ন কার্ড যুক্ত হয়েছে এবং নোটিফিকেশন পাঠানো হয়েছে।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Target Tuition / Student Selector */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                নিশ্চিত টিউশন ও শিক্ষার্থী নির্বাচন করুন *
              </label>
              <select
                value={selectedConfId}
                onChange={(e) => setSelectedConfId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white"
              >
                {confirmations.map((conf) => (
                  <option key={conf.id} value={conf.id}>
                    {conf.studentName} — {conf.jobTitle} (অভিভাবক: {conf.guardianName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  মূল্যায়নের মাস / সেশন *
                </label>
                <input
                  type="text"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="যেমন: মার্চ ২০২৬"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  সার্বিক গ্রেড (Overall Grade) *
                </label>
                <select
                  value={overallGrade}
                  onChange={(e) => setOverallGrade(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-blue-950 focus:bg-white"
                >
                  <option value="A+">A+ (অসাধারণ / Excellent)</option>
                  <option value="A">A (খুব ভালো / Very Good)</option>
                  <option value="B">B (সন্তোষজনক / Satisfactory)</option>
                  <option value="C">C (উন্নতি প্রয়োজন / Needs Improvement)</option>
                </select>
              </div>
            </div>

            {/* Performance Sliders */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                মূল্যায়ন স্কোর নির্ধারণ (০ - ১০০%)
              </span>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                    <span>১. ক্লাসে উপস্থিতি ও সময়ানুবর্তিতা</span>
                    <span className="font-mono font-bold text-blue-900">{attendanceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={attendanceScore}
                    onChange={(e) => setAttendanceScore(Number(e.target.value))}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                    <span>২. বাড়ির কাজ (Homework) প্রস্তুতি</span>
                    <span className="font-mono font-bold text-emerald-700">{homeworkScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={homeworkScore}
                    onChange={(e) => setHomeworkScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                    <span>৩. পড়ার আগ্রহ ও ক্লাসে মনোযোগ</span>
                    <span className="font-mono font-bold text-amber-700">{attentionScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={attentionScore}
                    onChange={(e) => setAttentionScore(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-700">
                    <span>৪. সাপ্তাহিক টেস্ট ও কুইজ স্কোর</span>
                    <span className="font-mono font-bold text-indigo-900">{quizScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={quizScore}
                    onChange={(e) => setQuizScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Qualitative Feedback */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                শিক্ষার্থীর শক্তি ও ইতিবাচক দিক (Strengths) *
              </label>
              <textarea
                rows={2}
                required
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="যেমন: গণিতের সূত্র সহজে বোঝে, ক্লাসে মনযোগ দিয়ে প্রশ্ন শোনে।"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                উন্নতির ক্ষেত্র ও অভিভাবকের করণীয় (Areas of Improvement) *
              </label>
              <textarea
                rows={2}
                required
                value={improvementsNeeded}
                onChange={(e) => setImprovementsNeeded(e.target.value)}
                placeholder="যেমন: পরীক্ষার সময় ঘড়ি দেখে লেখার প্র্যাকটিস করতে হবে।"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                শিক্ষকের সার্বিক মন্তব্য ও পরামর্শ (Tutor Remarks) *
              </label>
              <textarea
                rows={2}
                required
                value={tutorRemarks}
                onChange={(e) => setTutorRemarks(e.target.value)}
                placeholder="অভিভাবকের উদ্দেশ্যে আপনার পরামর্শ ও সামগ্রিক মূল্যায়ন..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>রিপোর্ট কার্ড প্রকাশ করুন</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
