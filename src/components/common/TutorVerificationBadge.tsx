import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle, Info, Sparkles, X } from 'lucide-react';
import { TutorProfile } from '../../types';

interface TutorVerificationBadgeProps {
  tutor: TutorProfile;
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
}

export const TutorVerificationBadge: React.FC<TutorVerificationBadgeProps> = ({
  tutor,
  size = 'md',
  showDetailsOnClick = true
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!tutor) {
    return null;
  }

  const isVerified = tutor.verificationStatus === 'verified';
  const isPending = tutor.verificationStatus === 'pending';
  const isGolden = tutor.badgeLevel === 'golden_star' || (tutor.trustScore && tutor.trustScore >= 95);

  if (!isVerified && !isPending) {
    return null;
  }

  const badgeColorClass = isVerified
    ? isGolden
      ? 'bg-gradient-to-r from-amber-50 to-amber-100/90 text-amber-900 border-amber-300 shadow-xs'
      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : 'bg-amber-50 text-amber-800 border-amber-200';

  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : size === 'lg' ? 'text-xs px-3 py-1.5' : 'text-[11px] px-2.5 py-1';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (showDetailsOnClick) {
            e.stopPropagation();
            setModalOpen(true);
          }
        }}
        className={`inline-flex items-center gap-1.5 font-bold rounded-full border transition-all cursor-pointer ${textSize} ${badgeColorClass} hover:opacity-90`}
        title="টিউটরহাটের ভেরিফিকেশন বিবরণ দেখতে ক্লিক করুন"
      >
        {isVerified ? (
          isGolden ? (
            <>
              <Sparkles className={`${iconSize} text-amber-600 fill-amber-500 shrink-0`} />
              <span>✓ গোল্ডেন ভেরিফাইড</span>
              {tutor.trustScore && (
                <span className="bg-amber-200/70 text-amber-950 px-1.5 py-0.2 rounded-full text-[9px] font-black">
                  {tutor.trustScore}%
                </span>
              )}
            </>
          ) : (
            <>
              <ShieldCheck className={`${iconSize} text-emerald-600 shrink-0`} />
              <span>✓ ভেরিফাইড টিউটর</span>
              {tutor.trustScore && (
                <span className="bg-emerald-200/70 text-emerald-950 px-1.5 py-0.2 rounded-full text-[9px] font-black">
                  {tutor.trustScore}%
                </span>
              )}
            </>
          )
        ) : (
          <>
            <Award className={`${iconSize} text-amber-600 shrink-0`} />
            <span>KYC পর্যালোচনায়</span>
          </>
        )}
      </button>

      {/* Trust & Verification Details Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isGolden ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-blue-950">
                    টিউটর ভেরিফিকেশন নিশ্চয়তা
                  </h3>
                  <p className="text-xs text-slate-500">
                    {tutor.fullName} · {tutor.university}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Score Banner */}
            <div className={`p-4 rounded-2xl border ${
              isGolden ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>সার্বক্ষণিক ট্রাস্ট স্কোর (Trust Score)</span>
                <span className="text-base px-2.5 py-0.5 rounded-full bg-white shadow-xs">
                  {tutor.trustScore || (isVerified ? 100 : 50)}%
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600">
                টিউটরহাটের অফিশিয়াল অডিট টিম এই শিক্ষকের সকল জাতীয় ও প্রাতিষ্ঠানিক তথ্য পুঙ্খানুপুঙ্খভাবে যাচাই করেছে।
              </p>
            </div>

            {/* Checklist of Verified Items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 ${tutor.isNidVerified !== false ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800">জাতীয় পরিচয়পত্র (NID / Birth Reg)</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {tutor.isNidVerified !== false ? 'যাচাইকৃত ✓' : 'প্রক্রিয়াধীন'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 ${tutor.isStudentIdVerified !== false ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800">বিশ্ববিদ্যালয় স্টুডেন্ট আইডি কার্ড</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {tutor.isStudentIdVerified !== false ? 'যাচাইকৃত ✓' : 'প্রক্রিয়াধীন'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className={`w-4 h-4 ${tutor.isAcademicVerified !== false ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800">এসএসসি / এইচএসসি / শিক্ষাগত সনদ</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  {tutor.isAcademicVerified !== false ? 'যাচাইকৃত ✓' : 'প্রক্রিয়াধীন'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">মোবাইল নম্বর ও বর্তমান ঠিকানা</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                  ভেরিফাইড ✓
                </span>
              </div>
            </div>

            {tutor.verifiedDate && (
              <div className="text-[11px] text-slate-400 text-center">
                ভেরিফিকেশন অনুমোদন তারিখ: {tutor.verifiedDate}
              </div>
            )}

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 bg-blue-950 text-white rounded-xl text-xs font-semibold hover:bg-blue-900 cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </>
  );
};
