import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  Sparkles, 
  MessageSquare, 
  CornerDownRight, 
  Filter,
  CheckCircle,
  BookOpen,
  Clock,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { TutorProfile, ReviewRecord } from '../../types';
import { store } from '../../services/store';
import { useApp } from '../../context/AppContext';
import { TutorReviewModal } from './TutorReviewModal';

interface TutorReviewsSectionProps {
  tutor: TutorProfile;
  reviews: ReviewRecord[];
}

export const TutorReviewsSection: React.FC<TutorReviewsSectionProps> = ({
  tutor,
  reviews = []
}) => {
  const { language } = useApp();
  const [filterRating, setFilterRating] = useState<number | 'all' | 'verified'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulVotedIds, setHelpfulVotedIds] = useState<string[]>([]);

  if (!tutor) return null;

  // Only display approved reviews to public
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const approvedReviews = safeReviews.filter(r => r && r.status === 'approved');

  // Rating distribution calculations
  const totalCount = approvedReviews.length;
  const ratingCounts = {
    5: approvedReviews.filter(r => r.rating === 5).length,
    4: approvedReviews.filter(r => r.rating === 4).length,
    3: approvedReviews.filter(r => r.rating === 3).length,
    2: approvedReviews.filter(r => r.rating === 2).length,
    1: approvedReviews.filter(r => r.rating === 1).length,
  };

  const averageRating = totalCount > 0
    ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalCount).toFixed(1)
    : tutor?.rating ? tutor.rating.toFixed(1) : '5.0';

  // Average Criteria calculations
  const criteriaReviews = approvedReviews.filter(r => r && r.criteria);
  const avgTeaching = criteriaReviews.length > 0
    ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.teachingSkill || 5), 0) / criteriaReviews.length).toFixed(1)
    : '4.9';
  const avgPunctuality = criteriaReviews.length > 0
    ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.punctuality || 5), 0) / criteriaReviews.length).toFixed(1)
    : '5.0';
  const avgBehavior = criteriaReviews.length > 0
    ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.behavior || 5), 0) / criteriaReviews.length).toFixed(1)
    : '4.9';
  const avgImprovement = criteriaReviews.length > 0
    ? (criteriaReviews.reduce((sum, r) => sum + (r.criteria?.studentImprovement || 5), 0) / criteriaReviews.length).toFixed(1)
    : '4.8';

  // Filtered reviews
  const filteredReviews = approvedReviews.filter(r => {
    if (filterRating === 'all') return true;
    if (filterRating === 'verified') return r.isVerifiedTuition === true;
    return r.rating === filterRating;
  });

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulVotedIds.includes(reviewId)) return;
    store.markReviewHelpful(reviewId);
    setHelpfulVotedIds(prev => [...prev, reviewId]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {language === 'bn' ? 'যাচাইকৃত মূল্যায়ন' : 'Verified Reviews'}
            </span>
            <span className="text-xs text-slate-400 font-medium">অভিভাবক রেটিং</span>
          </div>
          <h3 className="text-xl font-black text-blue-950 mt-1 flex items-center gap-2">
            <span>{language === 'bn' ? 'অভিভাবক ও শিক্ষার্থীদের মতামত' : 'Ratings & Reviews'}</span>
            <span className="text-sm font-normal text-slate-500">({totalCount})</span>
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 text-white font-bold text-xs hover:from-blue-950 hover:to-indigo-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-amber-300" />
          <span>{language === 'bn' ? 'রিভিউ ও রেটিং দিন' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview & Criteria Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80">
        
        {/* Left: Overall Score & Bar Distribution (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-5 lg:pb-0">
          <div className="flex items-baseline gap-3">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {language === 'bn' 
                  ? `${totalCount} জন অভিভাবকের নির্ভরযোগ্য মূল্যায়ন` 
                  : `Based on ${totalCount} verified reviews`}
              </p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = ratingCounts[score as keyof typeof ratingCounts] || 0;
              const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={score} className="flex items-center gap-2 text-slate-600">
                  <span className="w-6 text-[11px] font-bold text-slate-700 flex items-center gap-0.5">
                    {score} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-7 text-[10px] text-right text-slate-500 font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 4 Core Criteria Averages (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            {language === 'bn' ? '৪টি মানদণ্ডে শিক্ষকের পারফরম্যান্স স্কোর' : '4-Pillar Performance Averages'}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold text-[11px] flex items-center gap-1 text-slate-900">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  {language === 'bn' ? 'শিক্ষাদান কৌশল' : 'Teaching Skill'}
                </span>
                <span className="font-black text-amber-600 text-xs">{avgTeaching}★</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(Number(avgTeaching)/5)*100}%` }} />
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold text-[11px] flex items-center gap-1 text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'bn' ? 'সময়ানুবর্তিতা' : 'Punctuality'}
                </span>
                <span className="font-black text-amber-600 text-xs">{avgPunctuality}★</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Number(avgPunctuality)/5)*100}%` }} />
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold text-[11px] flex items-center gap-1 text-slate-900">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  {language === 'bn' ? 'আচরণ ও সততা' : 'Behavior'}
                </span>
                <span className="font-black text-amber-600 text-xs">{avgBehavior}★</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(Number(avgBehavior)/5)*100}%` }} />
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold text-[11px] flex items-center gap-1 text-slate-900">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'ফলাফলের উন্নতি' : 'Improvement'}
                </span>
                <span className="font-black text-amber-600 text-xs">{avgImprovement}★</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(Number(avgImprovement)/5)*100}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          {language === 'bn' ? 'ফিল্টার:' : 'Filter:'}
        </span>

        <button
          type="button"
          onClick={() => setFilterRating('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            filterRating === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {language === 'bn' ? `সব রিভিউ (${totalCount})` : `All (${totalCount})`}
        </button>

        <button
          type="button"
          onClick={() => setFilterRating('verified')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
            filterRating === 'verified'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {language === 'bn' ? 'যাচাইকৃত শিক্ষার্থী' : 'Verified Students'}
        </button>

        {[5, 4, 3].map((star) => {
          const count = ratingCounts[star as keyof typeof ratingCounts] || 0;
          if (count === 0 && star !== 5) return null;
          return (
            <button
              key={star}
              type="button"
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                filterRating === star
                  ? 'bg-amber-500 text-blue-950 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{star} ★</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-1">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn'
                ? 'এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি।'
                : 'No reviews found matching the selected filter.'}
            </p>
            <button
              type="button"
              onClick={() => setFilterRating('all')}
              className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
            >
              {language === 'bn' ? 'সব রিভিউ দেখুন' : 'Show all reviews'}
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasVotedHelpful = helpfulVotedIds.includes(rev.id);
            return (
              <div 
                key={rev.id} 
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-200 transition-colors shadow-2xs space-y-3.5"
              >
                {/* Reviewer Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {(rev.guardianName || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{rev.guardianName}</span>
                        {rev.isVerifiedTuition && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {language === 'bn' ? 'যাচাইকৃত শিক্ষার্থী' : 'Verified Tuition'}
                          </span>
                        )}
                      </div>
                      {rev.studentGradeOrSubject && (
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {rev.studentGradeOrSubject}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 pl-1 border-l border-slate-200">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Criteria Pills if present */}
                {rev.criteria && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      পদ্ধতি: {rev.criteria.teachingSkill}★
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      সময়নিষ্ঠতা: {rev.criteria.punctuality}★
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      আচরণ: {rev.criteria.behavior}★
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                      উন্নতি: {rev.criteria.studentImprovement}★
                    </span>
                  </div>
                )}

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                {/* Tutor Reply (if present) */}
                {rev.tutorReply && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-blue-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-blue-700" />
                        <span>{language === 'bn' ? 'টিউটরের উত্তর:' : "Tutor's Response:"}</span>
                        <span className="font-semibold text-blue-800">({rev.tutorReply.tutorName || tutor.fullName})</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-normal">{rev.tutorReply.repliedAt}</span>
                    </div>
                    <p className="text-slate-700 pl-5 leading-relaxed italic">
                      "{rev.tutorReply.replyText}"
                    </p>
                  </div>
                )}

                {/* Action Footer: Helpful Vote */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400">
                    {language === 'bn' ? 'মতামতটি পড়েছেন?' : 'Was this review helpful?'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      hasVotedHelpful
                        ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVotedHelpful ? 'fill-blue-700 text-blue-700' : ''}`} />
                    <span>{language === 'bn' ? 'ধন্যবাদ / সহমত' : 'Helpful'}</span>
                    <span className="font-bold text-slate-800">
                      ({rev.helpfulCount || 0})
                    </span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Review Submission Modal */}
      <TutorReviewModal
        tutor={tutor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
