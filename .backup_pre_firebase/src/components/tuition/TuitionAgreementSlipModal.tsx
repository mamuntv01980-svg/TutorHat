import React from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Check, 
  Award, 
  Phone,
  User,
  GraduationCap
} from 'lucide-react';
import { TuitionConfirmation } from '../../types';
import { useApp } from '../../context/AppContext';

interface TuitionAgreementSlipModalProps {
  confirmation: TuitionConfirmation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TuitionAgreementSlipModal: React.FC<TuitionAgreementSlipModalProps> = ({
  confirmation,
  isOpen,
  onClose
}) => {
  const { language, settings } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !confirmation) return null;

  const agreementCode = confirmation.agreementCode || `TH-AGR-${confirmation.id.replace('conf_', '')}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(agreementCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 text-xs text-slate-800 space-y-6 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-blue-950">
                {language === 'bn' ? 'অফিসিয়াল টিউশন চুক্তি ও কনফার্মেশন স্লিপ' : 'Official Tuition Agreement Slip'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Code: {agreementCode}
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

        {/* The Printable Official Slip Body */}
        <div id="tuition-agreement-slip" className="bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 p-6 sm:p-8 rounded-2xl border-2 border-blue-900/20 space-y-6 relative overflow-hidden">
          
          {/* Subtle Platform Watermark */}
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-5">
            <Award className="w-64 h-64 text-blue-950" />
          </div>

          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-blue-900/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-950 text-white font-black flex items-center justify-center text-sm">
                  TH
                </div>
                <span className="font-black text-lg tracking-tight text-blue-950">TutorHat</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  VERIFIED TUITION
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                জাতীয় গৃহশিক্ষক ও শিক্ষার্থী সংযোগ প্ল্যাটফর্ম · বাংলাদেশ
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                হটলাইন: {settings.publicPhone} · সাপোর্ট: {settings.supportEmail}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'bn' ? 'চুক্তিপত্র নম্বর' : 'Agreement Ref'}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="font-mono font-bold text-xs text-blue-900 bg-blue-100/70 hover:bg-blue-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 cursor-pointer mt-0.5"
                title="Copy Reference Code"
              >
                <span>{agreementCode}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-blue-700" />}
              </button>
              <p className="text-[10px] text-slate-400 mt-1">
                ইস্যুর তারিখ: {confirmation.startDate || 'মার্চ ২০২৬'}
              </p>
            </div>
          </div>

          {/* Subject & Tuition Title Banner */}
          <div className="bg-blue-950 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                {language === 'bn' ? 'টিউশন চুক্তি বিষয়' : 'Tuition Assignment'}
              </span>
              <h4 className="text-sm sm:text-base font-bold">
                {confirmation.jobTitle}
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                শিক্ষার্থী: <strong className="text-white">{confirmation.studentName}</strong>
                {confirmation.studentClass && ` (${confirmation.studentClass})`}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-slate-300 block">মাসিক সম্মানী (BDT)</span>
              <span className="text-lg font-black text-amber-400 tabular-nums">
                ৳{confirmation.monthlyFee.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-200 block">
                {confirmation.daysPerWeek} দিন / সপ্তাহ
              </span>
            </div>
          </div>

          {/* Party Details: Tutor & Guardian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tutor Details */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <GraduationCap className="w-4 h-4 text-blue-800" />
                <span className="font-bold text-slate-900">
                  {language === 'bn' ? 'নিযুক্ত শিক্ষক (Tutor)' : 'Assigned Tutor'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-xs">{confirmation.tutorName}</p>
                {confirmation.tutorUniversity && (
                  <p className="text-[11px] text-slate-600">{confirmation.tutorUniversity}</p>
                )}
                {confirmation.tutorPhone && (
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{confirmation.tutorPhone}</span>
                  </p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  KYC ভেরিফাইড শিক্ষক ✓
                </span>
              </div>
            </div>

            {/* Guardian Details */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-amber-800" />
                <span className="font-bold text-slate-900">
                  {language === 'bn' ? 'অভিভাবক (Guardian)' : 'Guardian'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-xs">{confirmation.guardianName}</p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{confirmation.location || 'মিরপুর, ঢাকা'}</span>
                </p>
                {confirmation.guardianPhone && (
                  <p className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{confirmation.guardianPhone}</span>
                  </p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                  রেজিস্টার্ড অভিভাবক ✓
                </span>
              </div>
            </div>
          </div>

          {/* Schedule & Logistics */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">ক্লাস শুরু ও সময়</span>
              <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                <span>{confirmation.scheduleTime}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">পাঠদানের মাধ্যম</span>
              <p className="font-bold text-slate-900 mt-0.5 capitalize">
                {confirmation.teachingMode === 'home' ? 'বাসায় পাঠদান (Home Tuition)' : 'অনলাইন সেশন (Online Meet)'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block">চুক্তি কার্যকর তারিখ</span>
              <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{confirmation.startDate}</span>
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          {confirmation.specialInstructions && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-950 space-y-1">
              <span className="font-bold block">📌 বিশেষ শর্ত / অভিভাবকের নির্দেশনা:</span>
              <p className="leading-relaxed text-amber-900">
                {confirmation.specialInstructions}
              </p>
            </div>
          )}

          {/* Terms & Official Platform Guarantee */}
          <div className="space-y-2 text-[10px] text-slate-500 border-t border-slate-200 pt-3 leading-relaxed">
            <span className="font-bold text-slate-700 block">টিউটরহ্যাট নীতি ও শর্তাবলী:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>শিক্ষক প্রতি ক্লাসে উপস্থিতি ও পাঠদানের অগ্রগতি ডিজিটাল ড্যাশবোর্ডে লগ করবেন।</li>
              <li>অভিভাবক প্রতি মাসের সমাপ্তিতে প্ল্যাটফর্মের নির্ধারিত বিকাশ/নগদ বা সরাসরি সম্মানী পরিশোধ করে ডিজিটাল মানি রিসিট সংগ্রহ করবেন।</li>
              <li>উভয় পক্ষ পারস্পরিক সম্মান ও শিক্ষার্থীবান্ধব পরিবেশ বজায় রাখবেন। কোনো ব্যত্যয় হলে প্ল্যাটফর্মের সাপোর্ট নম্বরে যোগাযোগ করুন।</li>
            </ul>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
            <div className="text-center w-36">
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center font-cursive text-slate-600 italic">
                {confirmation.tutorName}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 font-semibold">শিক্ষকের স্বাক্ষর</span>
            </div>

            {/* Official Platform Seal */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-600 border-dashed flex flex-col items-center justify-center text-emerald-800 mx-auto p-1 bg-emerald-50/50">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span className="text-[8px] font-black uppercase tracking-tighter">TUTORHAT</span>
                <span className="text-[7px] font-bold">SEALED</span>
              </div>
              <span className="text-[9px] text-emerald-800 font-bold block mt-1">ভেরিফাইড ডিজিটাল চুক্তি</span>
            </div>

            <div className="text-center w-36">
              <div className="h-10 border-b border-dashed border-slate-400 flex items-center justify-center font-cursive text-slate-600 italic">
                {confirmation.guardianName}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 font-semibold">অভিভাবকের স্বাক্ষর</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট অথবা PDF ডাউনলোড' : 'Print / Download PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
