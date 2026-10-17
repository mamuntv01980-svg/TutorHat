import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Clock, 
  UserCheck, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { TutorProfile, ReviewCriteria } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';

interface TutorReviewModalProps {
  tutor: TutorProfile;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const TutorReviewModal: React.FC<TutorReviewModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { currentUser, language } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Criteria ratings
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    teachingSkill: 5,
    punctuality: 5,
    behavior: 5,
    studentImprovement: 5
  });

  const [guardianName, setGuardianName] = useState(currentUser?.name || '');
  const [studentGrade, setStudentGrade] = useState('');
  const [comment, setComment] = useState('');
  const [isVerifiedTuition, setIsVerifiedTuition] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !tutor) return null;

  const ratingDescriptions: Record<number, { bn: string; en: string }> = {
    1: { bn: 'সন্তোষজনক নয় (১/৫)', en: 'Very Poor (1/5)' },
    2: { bn: 'আরও উন্নতির সুযোগ আছে (২/৫)', en: 'Below Average (2/5)' },
    3: { bn: 'মোটামুটি ভালো (৩/৫)', en: 'Average / Fair (3/5)' },
    4: { bn: 'বেশ ভালো ও যত্নশীল (৪/৫)', en: 'Very Good (4/5)' },
    5: { bn: 'অসাধারণ ও অত্যন্ত নির্ভরযোগ্য (৫/৫)', en: 'Exceptional & Highly Recommended (5/5)' }
  };

  const handleCriteriaChange = (key: keyof ReviewCriteria, val: number) => {
    setCriteria(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার অভিজ্ঞতা লিখে জানান।' : 'Please write your detailed feedback.');
      return;
    }
    if (!guardianName.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম প্রদান করুন।' : 'Please enter your name.');
      return;
    }

    setErrorMsg('');

    store.submitReview({
      tutorId: tutor.id,
      guardianId: currentUser?.id || `guardian_anon_${Date.now()}`,
      guardianName: guardianName.trim(),
      studentGradeOrSubject: studentGrade.trim() || undefined,
      rating,
      criteria,
      comment: comment.trim(),
      isVerifiedTuition
    });

    setIsSubmitted(true);
    if (onReviewSubmitted) onReviewSubmitted();
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setComment('');
    setStudentGrade('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
              ★
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-amber-300 uppercase block">
                {language === 'bn' ? 'অভিভাবক ও শিক্ষার্থী ফিডব্যাক' : 'Guardian & Student Review'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {language === 'bn' ? `${tutor.fullName}-এর জন্য রিভিউ প্রদান` : `Write Review for ${tutor.fullName}`}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                {tutor.institution} • {tutor.department}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'bn' ? 'রিভিউ সফলভাবে জমা হয়েছে!' : 'Review Submitted Successfully!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === 'bn'
                ? 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ! শিক্ষার্থীদের স্বার্থে সত্যতা নিশ্চিত করতে অ্যাডমিন মডারেশনের পর আপনার রিভিউটি টিউটরের প্রোফাইলে প্রকাশিত হবে।'
                : 'Thank you for your valuable feedback! To maintain authenticity, your review will appear on the tutor profile right after administration verification.'}
            </p>
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2.5 max-w-md mx-auto">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {language === 'bn'
                  ? 'অন্যান্য অভিভাবক ও শিক্ষার্থীরা আপনার সত্যনিষ্ঠ রিভিউ দেখে উপযুক্ত শিক্ষক নির্বাচনে সহায়তা পাবেন।'
                  : 'Your authentic feedback helps hundreds of students and guardians make informed tutoring choices.'}
              </span>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-950 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ঠিক আছে' : 'Got it, Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
            
            {/* Overall Star Rating */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-2">
              <label className="font-bold text-slate-800 text-sm block">
                {language === 'bn' ? 'সার্বিক রেটিং নির্বাচন করুন' : 'Select Overall Star Rating'} *
              </label>
              
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          active
                            ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                            : 'text-slate-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold text-amber-800 bg-amber-100/70 inline-block px-3 py-1 rounded-full">
                {ratingDescriptions[hoverRating || rating][language === 'bn' ? 'bn' : 'en']}
              </p>
            </div>

            {/* Multi-Criteria Ratings */}
            <div className="space-y-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center justify-between pb-1">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  {language === 'bn' ? 'সুনির্দিষ্ট দক্ষতার মানদণ্ডে রেটিং' : 'Detailed Criteria Assessment'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">১ থেকে ৫ স্টার</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Teaching Skill */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      {language === 'bn' ? 'শিক্ষাদান কৌশল' : 'Teaching Skill'}
                    </span>
                    <span className="font-bold text-amber-600">{criteria.teachingSkill}★</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleCriteriaChange('teachingSkill', val)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          criteria.teachingSkill === val
                            ? 'bg-amber-400 text-blue-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Punctuality */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {language === 'bn' ? 'সময়ানুবর্তিতা' : 'Punctuality'}
                    </span>
                    <span className="font-bold text-amber-600">{criteria.punctuality}★</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleCriteriaChange('punctuality', val)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          criteria.punctuality === val
                            ? 'bg-amber-400 text-blue-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Behavior */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      {language === 'bn' ? 'আচরণ ও সততা' : 'Behavior'}
                    </span>
                    <span className="font-bold text-amber-600">{criteria.behavior}★</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleCriteriaChange('behavior', val)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          criteria.behavior === val
                            ? 'bg-amber-400 text-blue-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Student Improvement */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                      {language === 'bn' ? 'ফলাফলের উন্নতি' : 'Improvement'}
                    </span>
                    <span className="font-bold text-amber-600">{criteria.studentImprovement}★</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleCriteriaChange('studentImprovement', val)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          criteria.studentImprovement === val
                            ? 'bg-amber-400 text-blue-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {val}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'আপনার নাম / পরিচয়' : 'Your Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder={language === 'bn' ? 'উদাঃ মিসেস সুলতানা রহমান' : 'e.g. Mrs. Sultana Rahman'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {language === 'bn' ? 'শ্রেণি ও বিষয় (ঐচ্ছিক)' : 'Student Grade & Subject'}
                </label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  placeholder={language === 'bn' ? 'উদাঃ নবম শ্রেণি - গণিত ও পদার্থ' : 'e.g. Class 9 — Math & Physics'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {language === 'bn' ? 'বিস্তারিত অভিজ্ঞতা ও মতামত' : 'Your Detailed Review / Experience'} *
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === 'bn' 
                  ? 'শিক্ষকের পড়ানোর ধরণ, ব্যবহার, সময়নিষ্ঠতা এবং আপনার সন্তানের পড়াশোনার অগ্রগতি সম্পর্কে লিখুন...' 
                  : 'Describe teaching methods, punctuality, behavior, and academic progress of your child...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed resize-none"
              />
            </div>

            {/* Verified Student Badge Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors">
              <input
                type="checkbox"
                checked={isVerifiedTuition}
                onChange={(e) => setIsVerifiedTuition(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {language === 'bn' ? 'যাচাইকৃত শিক্ষার্থী / টিউশন সম্পন্ন ব্যাজ দাবি করুন' : 'Request "Verified Tuition" Badge'}
                </span>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  {language === 'bn'
                    ? 'আমি TutorHat-এর মাধ্যমে এই টিউটর নিয়োগ করেছি বা ডেমো ক্লাস সম্পন্ন করেছি।'
                    : 'I hired this tutor or completed demo sessions through TutorHat platform.'}
                </p>
              </div>
            </label>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-950 transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
