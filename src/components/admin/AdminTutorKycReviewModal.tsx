import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  X, 
  Sparkles, 
  ExternalLink,
  Award,
  FileText
} from 'lucide-react';
import { TutorProfile } from '../../types';
import { store } from '../../services/store';

interface AdminTutorKycReviewModalProps {
  tutor: TutorProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  performedBy?: string;
}

export const AdminTutorKycReviewModal: React.FC<AdminTutorKycReviewModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onSuccess,
  performedBy = 'Admin'
}) => {
  if (!isOpen || !tutor) return null;

  const [isNidVerified, setIsNidVerified] = useState(tutor.isNidVerified ?? true);
  const [isStudentIdVerified, setIsStudentIdVerified] = useState(tutor.isStudentIdVerified ?? true);
  const [isAcademicVerified, setIsAcademicVerified] = useState(tutor.isAcademicVerified ?? true);
  const [badgeLevel, setBadgeLevel] = useState<'standard' | 'verified_pro' | 'golden_star'>(
    (tutor.badgeLevel && ['standard', 'verified_pro', 'golden_star'].includes(tutor.badgeLevel))
      ? (tutor.badgeLevel as 'standard' | 'verified_pro' | 'golden_star')
      : 'golden_star'
  );
  const [adminNotes, setAdminNotes] = useState(tutor.verificationNotes || '');
  const [rejectionReason, setRejectionReason] = useState(tutor.rejectionReason || '');
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  const handleApprove = () => {
    store.reviewTutorKycVerification(tutor.id, {
      status: 'verified',
      isNidVerified,
      isStudentIdVerified,
      isAcademicVerified,
      badgeLevel,
      verificationNotes: adminNotes,
      performedBy
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('দয়া করে রিজেকশনের কারণ লিখুন যাতে টিউটর তা সংশোধন করতে পারেন।');
      return;
    }

    store.reviewTutorKycVerification(tutor.id, {
      status: 'rejected',
      isNidVerified: false,
      isStudentIdVerified: false,
      isAcademicVerified: false,
      badgeLevel: 'none',
      rejectionReason: rejectionReason.trim(),
      verificationNotes: adminNotes,
      performedBy
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSuspend = () => {
    if (confirm('আপনি কি এই টিউটরের ভেরিফাইড স্ট্যাটাস সাময়িকভাবে স্থগিত করতে চান?')) {
      store.setTutorVerificationStatus(tutor.id, 'suspended', 'অ্যাডমিন পর্যালোচনায় সাময়িক স্থগিত');
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-left my-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-blue-950">
                  টিউটর KYC ও ডকুমেন্ট ভেরিফিকেশন অডিট
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  tutor.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                  tutor.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                  tutor.verificationStatus === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tutor.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                টিউটর: <strong>{tutor.fullName}</strong> (ID: {tutor.id}) · {tutor.university} ({tutor.department})
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

        {/* Basic Tutor Info summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">মোবাইল নম্বর</span>
            <span className="font-bold text-slate-800 font-mono">{tutor.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">ইমেইল</span>
            <span className="font-semibold text-slate-800 truncate block">{tutor.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">বর্তমান এলাকা</span>
            <span className="font-semibold text-slate-800">{tutor.area}, {tutor.district}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">NID নম্বর</span>
            <span className="font-bold text-blue-950 font-mono">{tutor.nidNumber || 'তথ্য দেওয়া হয়নি'}</span>
          </div>
        </div>

        {/* Uploaded Documents Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>আপলোডকৃত পরিচয়পত্র ও শিক্ষাগত ডকুমেন্টস</span>
            </h3>
            <span className="text-[11px] text-slate-400">বড় করে দেখতে ছবিতে ক্লিক করুন</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. NID Front */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>১. NID (সামনে)</span>
                {tutor.nidFrontPhoto ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">আপলোড করা</span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">নেই</span>
                )}
              </div>
              <div 
                className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center cursor-pointer hover:opacity-90 relative group"
                onClick={() => tutor.nidFrontPhoto && setZoomImage({ url: tutor.nidFrontPhoto, title: 'NID সামনের পাশ' })}
              >
                {tutor.nidFrontPhoto ? (
                  <>
                    <img src={tutor.nidFrontPhoto} alt="NID Front" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity">
                      <Eye className="w-4 h-4" /> জুম করুন
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">ছবি নেই</span>
                )}
              </div>
            </div>

            {/* 2. NID Back */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>২. NID (পেছনে)</span>
                {tutor.nidBackPhoto ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">আপলোড করা</span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">নেই</span>
                )}
              </div>
              <div 
                className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center cursor-pointer hover:opacity-90 relative group"
                onClick={() => tutor.nidBackPhoto && setZoomImage({ url: tutor.nidBackPhoto, title: 'NID পেছনের পাশ' })}
              >
                {tutor.nidBackPhoto ? (
                  <>
                    <img src={tutor.nidBackPhoto} alt="NID Back" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity">
                      <Eye className="w-4 h-4" /> জুম করুন
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">ছবি নেই</span>
                )}
              </div>
            </div>

            {/* 3. Student ID */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>৩. স্টুডেন্ট আইডি কার্ড</span>
                {tutor.studentIdCardPhoto ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">আপলোড করা</span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">নেই</span>
                )}
              </div>
              <div 
                className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center cursor-pointer hover:opacity-90 relative group"
                onClick={() => tutor.studentIdCardPhoto && setZoomImage({ url: tutor.studentIdCardPhoto, title: 'বিশ্ববিদ্যালয় স্টুডেন্ট আইডি' })}
              >
                {tutor.studentIdCardPhoto ? (
                  <>
                    <img src={tutor.studentIdCardPhoto} alt="Student ID" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity">
                      <Eye className="w-4 h-4" /> জুম করুন
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">ছবি নেই</span>
                )}
              </div>
            </div>

            {/* 4. Certificate */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>৪. সনদ / মার্কশিট</span>
                {tutor.certificatePhoto ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">আপলোড করা</span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">নেই</span>
                )}
              </div>
              <div 
                className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center cursor-pointer hover:opacity-90 relative group"
                onClick={() => tutor.certificatePhoto && setZoomImage({ url: tutor.certificatePhoto, title: 'শিক্ষাগত সনদপত্র' })}
              >
                {tutor.certificatePhoto ? (
                  <>
                    <img src={tutor.certificatePhoto} alt="Certificate" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity">
                      <Eye className="w-4 h-4" /> জুম করুন
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">ছবি নেই</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Verification Checkboxes & Badge Tier Selection */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 text-xs">
          <h4 className="font-bold text-sm text-blue-950 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-800" />
            <span>অ্যাডমিন ভেরিফিকেশন চেকলিস্ট ও ব্যাজ নির্ধারণ</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isNidVerified}
                onChange={(e) => setIsNidVerified(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">জাতীয় পরিচয়পত্র (NID) যাচাইকৃত</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isStudentIdVerified}
                onChange={(e) => setIsStudentIdVerified(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">স্টুডেন্ট আইডি কার্ড যাচাইকৃত</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isAcademicVerified}
                onChange={(e) => setIsAcademicVerified(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">শিক্ষাগত সনদপত্র যাচাইকৃত</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <span className="font-bold text-slate-800 block">ব্যাজ টিয়ার ও ট্রাস্ট স্কোর নির্বাচন:</span>
              <span className="text-[11px] text-slate-500">গোল্ডেন স্টারের জন্য ১০০% স্কোর এবং প্রো এর জন্য ৮৫% স্কোর কার্যকর হবে</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBadgeLevel('golden_star')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  badgeLevel === 'golden_star'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>🏆 গোল্ডেন স্টার (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => setBadgeLevel('verified_pro')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  badgeLevel === 'verified_pro'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>✓ ভেরিফাইড প্রো (85%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Notes & Rejection Reason Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              অভ্যন্তরীণ অ্যাডমিন নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় আইডি কার্ড ফোনে যাচাই করা হয়েছে"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              রিজেক্ট করতে চাইলে কারণ লিখুন
            </label>
            <input
              type="text"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="যেমন: NID এর ছবি অস্পষ্ট, অনুগ্রহ করে পরিষ্কার ছবি দিন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div>
            {tutor.verificationStatus === 'verified' && (
              <button
                type="button"
                onClick={handleSuspend}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
              >
                ভেরিফিকেশন সাময়িক স্থগিত করুন
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>রিজেক্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>✓ অনুমোদন ও ট্রাস্ট ব্যাজ দিন</span>
            </button>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {zoomImage && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
            onClick={() => setZoomImage(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{zoomImage.title}</span>
                <button
                  type="button"
                  onClick={() => setZoomImage(null)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto rounded-xl border border-slate-200">
                <img 
                  src={zoomImage.url} 
                  alt={zoomImage.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
