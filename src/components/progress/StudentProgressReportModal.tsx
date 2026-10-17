import React from 'react';
import { 
  X, 
  Printer, 
  Award, 
  CheckCircle, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  User, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { StudentProgressReport } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentProgressReportModalProps {
  report: StudentProgressReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProgressReportModal: React.FC<StudentProgressReportModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const { language } = useApp();
  const [copiedCode, setCopiedCode] = React.useState(false);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(report.reportCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-blue-950">
                {language === 'bn' ? 'অফিসিয়াল শিক্ষার্থী প্রগ্রেস ও মূল্যায়ন কার্ড' : 'Official Student Academic Progress Card'}
              </h3>
              <p className="text-[11px] text-slate-500">
                মাসিক অগ্রগতি, হোমওয়ার্ক মূল্যায়ন ও ফলাফল বিবরণী
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট / সেভ' : 'Print Card'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT CARD CONTAINER */}
        <div className="p-6 sm:p-8 space-y-6 bg-white">
          
          {/* Header Card with Watermark-like Border */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pb-4 border-b border-white/15">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                    🎓 TutorHat <span className="text-amber-400 text-xs uppercase px-2 py-0.5 rounded-full bg-white/10 border border-white/20">Academic Report</span>
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  বাংলাদেশ সরকার অনুমোদিত বিশ্বস্ত টিউশন ও শিক্ষা ব্যবস্থাপনা নেটওয়ার্ক
                </p>
              </div>

              {/* Overall Grade Pill */}
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-xs">
                <div className="text-right">
                  <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">সামগ্রিক গ্রেড</span>
                  <span className="text-xs text-white">Overall Grade</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-blue-950 font-black text-2xl flex items-center justify-center shadow-md">
                  {report.overallGrade}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs relative z-10">
              <div>
                <span className="text-[10px] text-blue-300 block">শিক্ষার্থীর নাম</span>
                <span className="font-bold text-white text-sm">{report.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-300 block">শ্রেণি ও বিষয়</span>
                <span className="font-bold text-white">{report.classLevel}</span>
                <span className="text-[10px] text-amber-300 block truncate">{report.subject}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-300 block">মূল্যায়নের মাস</span>
                <span className="font-bold text-white">{report.month}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-300 block">রিপোর্ট কোড</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="font-mono font-bold text-amber-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{report.reportCode}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/60" />}
                </button>
              </div>
            </div>
          </div>

          {/* Teacher & Guardian Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-800" />
                পাঠদানকারী শিক্ষক (Tutor):
              </span>
              <p className="font-bold text-slate-900 text-sm">{report.tutorName}</p>
              {report.tutorUniversity && (
                <p className="text-[11px] text-slate-600">{report.tutorUniversity}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-950 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-800" />
                সম্মানিত অভিভাবক (Guardian):
              </span>
              <p className="font-bold text-slate-900 text-sm">{report.guardianName}</p>
              <p className="text-[11px] text-slate-600">রেগুলার শিক্ষার্থী মনিটরিং</p>
            </div>
          </div>

          {/* PERFORMANCE SCORE METRICS (Progress Bars) */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>পারফরম্যান্স ও মূল্যায়ন স্কোরকার্ড (Performance Breakdown)</span>
            </h4>

            <div className="space-y-3.5">
              {/* Attendance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">১. ক্লাসে উপস্থিতি ও সময়ানুবর্তিতা (Attendance & Punctuality)</span>
                  <span className="font-bold font-mono text-blue-900">{report.attendanceScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-blue-900 rounded-full transition-all"
                    style={{ width: `${report.attendanceScore}%` }}
                  />
                </div>
              </div>

              {/* Homework Completion */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">২. বাড়ির কাজ ও এসাইনমেন্ট সমাপ্তি (Homework & Tasks)</span>
                  <span className="font-bold font-mono text-emerald-700">{report.homeworkCompletionScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${report.homeworkCompletionScore}%` }}
                  />
                </div>
              </div>

              {/* Class Attention */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">৩. পড়ার আগ্রহ ও ক্লাসে মনোযোগ (Attention & Discipline)</span>
                  <span className="font-bold font-mono text-amber-700">{report.classAttentionScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${report.classAttentionScore}%` }}
                  />
                </div>
              </div>

              {/* Exam & Quiz Score */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">৪. সাপ্তাহিক টেস্ট ও কুইজ ফলাফল (Weekly Test & Quiz)</span>
                  <span className="font-bold font-mono text-indigo-900">{report.examOrQuizScore}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${report.examOrQuizScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Feedback Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                প্রশংসনীয় দিক ও শক্তি (Key Strengths):
              </span>
              <p className="text-emerald-900 leading-relaxed text-[11px] pt-1">
                {report.strengths}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                উন্নতির ক্ষেত্র ও পরামর্শ (Areas for Improvement):
              </span>
              <p className="text-amber-900 leading-relaxed text-[11px] pt-1">
                {report.improvementsNeeded}
              </p>
            </div>
          </div>

          {/* Tutor's Concluding Remarks */}
          <div className="p-4.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-900" />
              টিউটরের চূড়ান্ত মন্তব্য ও দিকনির্দেশনা (Tutor Remarks):
            </span>
            <p className="text-slate-800 leading-relaxed text-xs">
              "{report.tutorRemarks}"
            </p>
          </div>

          {/* Seal and Signatures Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Academic Progress Log</span>
              </div>
              <p className="text-[10px] text-slate-400">
                ইস্যুর তারিখ: {new Date(report.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center space-y-1">
                <div className="w-28 border-b border-slate-400 pb-1 font-serif text-[11px] text-slate-800 italic">
                  {report.tutorName}
                </div>
                <span className="text-[10px] text-slate-400 block">শিক্ষকের স্বাক্ষর</span>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 bg-amber-50/60 flex flex-col items-center justify-center text-[9px] font-bold text-amber-900 shadow-2xs rotate-6">
                <span>TutorHat</span>
                <span className="text-[8px] text-blue-900">SEAL</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
