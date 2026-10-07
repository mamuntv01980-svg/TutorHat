import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  Clock, 
  Star, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  CheckCircle, 
  ArrowLeft, 
  Phone, 
  MessageSquare,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';
import { tutorProfileImg } from '../services/store';

export const TutorDetailPage: React.FC = () => {
  const { 
    selectedTutorId, 
    storeState, 
    navigateTo, 
    language, 
    isShortlisted, 
    toggleShortlist,
    currentUser,
    settings
  } = useApp();

  const t = TRANSLATIONS[language];

  const tutor = storeState.tutors.find(tut => tut.id === selectedTutorId) || storeState.tutors[0];
  const shortlisted = tutor ? isShortlisted(tutor.id) : false;

  // Reviews for this tutor
  const approvedReviews = storeState.reviews.filter(
    r => r.tutorId === tutor?.id && r.status === 'approved'
  );

  if (!tutor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Tutor Not Found</h2>
        <button
          type="button"
          onClick={() => navigateTo('find-tutor')}
          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Tutor Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigateTo('find-tutor')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'টিউটর তালিকায় ফিরে যান' : 'Back to Tutor List'}</span>
        </button>
      </div>

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-50 border-2 border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {tutor.photo ? (
                <img
                  src={tutor.photo}
                  alt={tutor.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <GraduationCap className="w-10 h-10 text-blue-700" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-950">
                  {tutor.fullName}
                </h1>
                <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  ID: {tutor.id}
                </span>
              </div>

              {tutor.verificationStatus === 'verified' && (
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.verifiedTutor}</span>
                </div>
              )}

              <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{tutor.area}, {tutor.district}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => toggleShortlist(tutor.id)}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                shortlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${shortlisted ? 'fill-rose-600' : ''}`} />
              <span>{shortlisted ? t.shortlisted : t.shortlist}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('request-tutor')}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              <span>{language === 'bn' ? 'টিউটর রিকোয়েস্ট করুন' : 'Request This Tutor'}</span>
            </button>
          </div>

        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          <div>
            <span className="text-[11px] text-slate-400 block">{t.experience}</span>
            <span className="font-semibold text-slate-900 text-sm">
              {tutor.teachingExperienceYears} {t.years}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t.salary}</span>
            <span className="font-bold text-blue-950 text-sm tabular-nums">
              {settings.defaultCurrency}{tutor.expectedSalary.toLocaleString()} {t.perMonth}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'রেটিং' : 'Rating'}</span>
            <div className="flex items-center gap-1 font-semibold text-amber-600 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{tutor.rating}</span>
              <span className="text-slate-400 font-normal">({tutor.totalReviews})</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{language === 'bn' ? 'পাঠদানের মোড' : 'Teaching Mode'}</span>
            <span className="font-semibold text-slate-900 text-sm">
              {tutor.homeTuition && tutor.onlineTeaching ? 'Home & Online' : tutor.homeTuition ? 'Home Only' : 'Online'}
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Education + Teaching Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Tutor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-base font-bold text-blue-950">
              {language === 'bn' ? 'শিক্ষক পরিচিতি' : 'About Me'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {tutor.aboutMe || 'Dedicated educator passionate about building solid fundamental concepts and helping students achieve high academic performance.'}
            </p>
          </div>

          {/* Education Records */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-700" />
              <span>{language === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Educational Background'}</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-700">
              {/* University */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-blue-950">{tutor.university}</h4>
                    <p className="text-slate-600 mt-0.5">{tutor.programDegree} in {tutor.department}</p>
                  </div>
                  <span className="text-blue-800 font-mono text-[11px] font-semibold bg-blue-100/80 px-2 py-0.5 rounded">
                    {tutor.currentYearSemester || 'Current'}
                  </span>
                </div>
              </div>

              {/* HSC */}
              {tutor.hsc && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Higher Secondary (HSC)</h4>
                      <p className="text-slate-600 mt-0.5">{tutor.hsc.schoolOrCollege}</p>
                      <p className="text-slate-500 text-[11px]">Group: {tutor.hsc.groupOrMajor || 'Science'} · Board: {tutor.hsc.board || 'Dhaka'}</p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      GPA {tutor.hsc.gpa} ({tutor.hsc.passingYear})
                    </span>
                  </div>
                </div>
              )}

              {/* SSC */}
              {tutor.ssc && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Secondary School (SSC)</h4>
                      <p className="text-slate-600 mt-0.5">{tutor.ssc.schoolOrCollege}</p>
                      <p className="text-slate-500 text-[11px]">Group: {tutor.ssc.groupOrMajor || 'Science'} · Board: {tutor.ssc.board || 'Dhaka'}</p>
                    </div>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      GPA {tutor.ssc.gpa} ({tutor.ssc.passingYear})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Teaching Methodology */}
          {tutor.teachingMethod && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-blue-950">
                {language === 'bn' ? 'পাঠদানের পদ্ধতি ও কৌশল' : 'Teaching Methodology'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {tutor.teachingMethod}
              </p>
            </div>
          )}

          {/* Reviews & Ratings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{language === 'bn' ? 'অভিভাবকদের রিভিউ' : 'Guardian Reviews'} ({approvedReviews.length})</span>
              </h3>
            </div>

            {approvedReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                {language === 'bn' ? 'এখনও কোনো অনুমোদিত রিভিউ নেই।' : 'No reviews posted yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {approvedReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{rev.guardianName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Teaching Preferences & Safety Policy */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider pb-2 border-b border-slate-100">
              {language === 'bn' ? 'পছন্দের ক্লাস ও বিষয়' : 'Teaching Preferences'}
            </h3>

            <div>
              <span className="text-slate-400 block mb-1.5 font-medium">{t.class}:</span>
              <div className="flex flex-wrap gap-1">
                {tutor.preferredClasses.map((cls) => (
                  <span key={cls} className="bg-blue-50 text-blue-900 font-medium px-2 py-0.5 rounded">
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1.5 font-medium">{t.subject}:</span>
              <div className="flex flex-wrap gap-1">
                {tutor.preferredSubjects.map((sub) => (
                  <span key={sub} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1.5 font-medium">{t.medium}:</span>
              <div className="flex flex-wrap gap-1">
                {tutor.preferredMediums.map((med) => (
                  <span key={med} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {med}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1.5 font-medium">
                {language === 'bn' ? 'পছন্দের এলাকা (Preferred Areas):' : 'Preferred Areas:'}
              </span>
              <div className="flex flex-wrap gap-1">
                {tutor.preferredAreas.map((area) => (
                  <span key={area} className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <span className="text-slate-400 block font-medium">{language === 'bn' ? 'উপলব্ধ সময়:' : 'Available Time:'}</span>
                <span className="font-semibold text-slate-800">{tutor.availableTime || 'Negotiable'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">{language === 'bn' ? 'উপলব্ধ বার:' : 'Available Days:'}</span>
                <span className="text-slate-700">{tutor.availableDays.join(', ') || 'Any 3-4 days'}</span>
              </div>
            </div>

          </div>

          {/* Privacy & Safety Guarantee */}
          <div className="bg-blue-50/70 rounded-2xl border border-blue-200 p-5 space-y-2 text-xs text-blue-950">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{language === 'bn' ? 'TutorHat নিরাপত্তা নীতিমালা' : 'Safe Contact Policy'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {language === 'bn'
                ? 'শিক্ষক ও অভিভাবক উভয়ের সুরক্ষার স্বার্থে সরাসরি যোগাযোগ নম্বর প্ল্যাটফর্মের মাধ্যমে ডেমো ক্লাস অনুমোদনের পর শেয়ার করা হয়।'
                : 'To protect both parties, personal phone numbers are secured until a demo class request is coordinated by TutorHat administration.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
