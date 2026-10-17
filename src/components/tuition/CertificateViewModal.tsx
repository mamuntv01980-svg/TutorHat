import React from 'react';
import { 
  X, 
  Printer, 
  Award, 
  ShieldCheck, 
  Check, 
  Copy, 
  Calendar, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { CertificateRecord } from '../../types';
import { useApp } from '../../context/AppContext';

interface CertificateViewModalProps {
  certificate: CertificateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateViewModal: React.FC<CertificateViewModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const { language } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !certificate) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-6 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
              <Award className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'অফিসিয়াল অভিজ্ঞতা সনদ ও প্রশংসাপত্র' : 'Official Certificate of Excellence'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Verification ID: {certificate.verificationCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট / সেভ PDF' : 'Print / Save PDF'}</span>
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

        {/* Ornate Certificate Canvas */}
        <div 
          id="tutor-experience-certificate"
          className="relative bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 p-6 sm:p-10 rounded-2xl border-8 border-double border-amber-600/40 shadow-inner text-center space-y-5 overflow-hidden"
        >
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

          {/* Crest & Header */}
          <div className="space-y-1">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 text-amber-950" />
            </div>
            <h4 className="font-mono text-[10px] tracking-widest text-amber-800 uppercase pt-2 font-bold">
              TUTORHAT ACADEMIC CREDENTIALS & MENTORSHIP BOARD
            </h4>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-blue-950 tracking-tight">
              CERTIFICATE OF EXCELLENCE
            </h2>
            <p className="text-[11px] text-slate-500 italic">
              {language === 'bn' ? 'শিক্ষাদানে নিষ্ঠা, নিয়মিত হাজিরা ও অভিভাবক সন্তুষ্টির স্বীকৃতিস্বরূপ' : 'In Recognition of Pedagogical Dedication, Verified Attendance & Excellence'}
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-1 py-1">
            <span className="text-[11px] text-slate-500 font-sans block">
              {language === 'bn' ? 'গর্বের সাথে প্রদান করা হলো' : 'This Certificate is Proudly Conferred Upon'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-blue-900 border-b-2 border-amber-600/30 inline-block px-6 pb-1">
              {certificate.tutorName}
            </h1>
            {certificate.gradeHonor && (
              <p className="text-xs font-bold text-amber-700 tracking-wide pt-1">
                ★ {certificate.gradeHonor} ★
              </p>
            )}
          </div>

          {/* Description */}
          <div className="max-w-lg mx-auto text-xs text-slate-700 leading-relaxed font-sans space-y-2">
            <h3 className="font-bold text-sm text-slate-900">
              "{certificate.title}"
            </h3>
            <p className="text-slate-600 text-[11px]">
              {certificate.description}
            </p>
            {certificate.subject && (
              <p className="text-[11px] text-blue-950 font-semibold bg-blue-50/80 p-2 rounded-lg border border-blue-200/60 inline-block">
                বিষয় ও পাঠদান ক্ষেত্র: {certificate.subject}
              </p>
            )}
          </div>

          {/* Verification Code Box */}
          <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300 px-3 py-1.5 rounded-xl font-mono text-[11px] text-amber-900">
            <span>ID: {certificate.verificationCode}</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1 hover:bg-amber-200/60 rounded cursor-pointer"
              title="Copy ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
            </button>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between px-2 sm:px-6">
            <div className="text-center w-32">
              <span className="font-mono text-xs font-bold text-slate-800 block">
                {certificate.issueDate}
              </span>
              <div className="border-t border-slate-400 mt-1 pt-0.5">
                <span className="text-[10px] text-slate-500">ইস্যুর তারিখ</span>
              </div>
            </div>

            {/* Gold Seal */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-600 border-dashed flex flex-col items-center justify-center bg-amber-100/60 text-amber-900 mx-auto p-1">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span className="text-[8px] font-black uppercase tracking-tighter">OFFICIAL</span>
                <span className="text-[7px] font-bold">SEAL</span>
              </div>
            </div>

            <div className="text-center w-36">
              <div className="font-cursive italic text-slate-700 text-sm h-6 flex items-center justify-center">
                Academic Board
              </div>
              <div className="border-t border-slate-400 mt-1 pt-0.5">
                <span className="text-[10px] text-slate-500">অনুমোদিত স্বাক্ষর</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-1 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট / সনদ ডাউনলোড' : 'Print / Download Certificate'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
