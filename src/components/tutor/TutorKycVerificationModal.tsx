import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Trash2, 
  Info,
  Sparkles,
  Lock
} from 'lucide-react';
import { TutorProfile } from '../../types';
import { store } from '../../services/store';

interface TutorKycVerificationModalProps {
  tutor: TutorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TutorKycVerificationModal: React.FC<TutorKycVerificationModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [nidNumber, setNidNumber] = useState(tutor.nidNumber || '');
  const [nidFrontPhoto, setNidFrontPhoto] = useState(tutor.nidFrontPhoto || '');
  const [nidBackPhoto, setNidBackPhoto] = useState(tutor.nidBackPhoto || '');
  const [studentIdCardPhoto, setStudentIdCardPhoto] = useState(tutor.studentIdCardPhoto || '');
  const [certificatePhoto, setCertificatePhoto] = useState(tutor.certificatePhoto || '');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Handle file conversion to base64 data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইলের সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidNumber.trim()) {
      setStatusMessage({ type: 'error', text: 'দয়া করে আপনার জাতীয় পরিচয়পত্র (NID) নম্বর লিখুন।' });
      return;
    }

    if (!nidFrontPhoto && !studentIdCardPhoto) {
      setStatusMessage({ type: 'error', text: 'কমপক্ষে NID অথবা স্টুডেন্ট আইডি কার্ডের ছবি আপলোড করুন।' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      store.submitTutorKycDocuments(tutor.id, {
        nidNumber: nidNumber.trim(),
        nidFrontPhoto,
        nidBackPhoto,
        studentIdCardPhoto,
        certificatePhoto
      });

      setStatusMessage({ 
        type: 'success', 
        text: 'আপনার KYC ভেরিফিকেশন আবেদন সফলভাবে জমা হয়েছে! অ্যাডমিন পর্যালোচনা শেষে ব্যাজ যুক্ত করা হবে।' 
      });

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'সাবমিট করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = tutor.verificationStatus === 'verified';
  const isPending = tutor.verificationStatus === 'pending';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-left my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-blue-950">
                  টিউটর ভেরিফিকেশন ও ট্রাস্ট ব্যাজ (KYC)
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isVerified ? 'bg-emerald-100 text-emerald-800' :
                  isPending ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {isVerified ? '✓ Verified' : isPending ? '⏳ Under Review' : 'Not Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NID ও স্টুডেন্ট আইডি কার্ড যাচাই করে অভিভাবক ও শিক্ষার্থীদের সর্বোচ্চ আস্থা অর্জন করুন।
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

        {/* Security & Privacy Notice */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900">গোপনীয়তা ও ডেটা সুরক্ষার নিশ্চয়তা:</h4>
            <p className="text-slate-600 mt-0.5">
              আপনার আপলোডকৃত পরিচয়পত্র ও শিক্ষাগত সনদ শুধুমাত্র অ্যাডমিন অডিট টিমের অভ্যন্তরীণ যাচাইয়ের জন্য ব্যবহৃত হয়। এগুলো কখনো জনসাধারণের জন্য উন্মুক্ত করা হবে না।
            </p>
          </div>
        </div>

        {/* Verification Status Cards */}
        {isVerified && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-sm">অভিনন্দন! আপনার প্রোফাইল সম্পূর্ণ ভেরিফাইড</span>
              </div>
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
                ট্রাস্ট স্কোর: {tutor.trustScore || 100}%
              </span>
            </div>
            <p className="text-xs text-emerald-50">
              আপনার প্রোফাইল অভিভাবক তালিকায় ভেরিফাইড গোল্ডেন ব্যাজ সহ সবার শীর্ষে প্রদর্শিত হচ্ছে। আপনি যেকোনো সময় নিচের ডকুমেন্টস হালনাগাদ করতে পারেন।
            </p>
          </div>
        )}

        {tutor.verificationStatus === 'rejected' && tutor.rejectionReason && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">পূর্বে আবেদন রিজেক্টের কারণ:</span>
              <p className="mt-0.5">{tutor.rejectionReason}</p>
              <p className="text-rose-700 font-semibold mt-1">দয়া করে সঠিক ও স্পষ্ট ছবি আপলোড করে পুনরায় সাবমিট করুন।</p>
            </div>
          </div>
        )}

        {statusMessage && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NID Number Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              জাতীয় পরিচয়পত্র (NID) নম্বর বা জন্ম নিবন্ধন নম্বর <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              placeholder="যেমন: 19992691234567890 অথবা 10/17 ডিজিটের NID"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Grid of Document Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. NID Front */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  ১. NID কার্ডের সামনের পাশ (Front)
                </span>
                {nidFrontPhoto && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    যুক্ত আছে ✓
                  </span>
                )}
              </div>

              {nidFrontPhoto ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={nidFrontPhoto} 
                    alt="NID Front" 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewImage({ url: nidFrontPhoto, title: 'NID কার্ড (সামনের পাশ)' })}
                  />
                  <button
                    type="button"
                    onClick={() => setNidFrontPhoto('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                    title="ছবিটি মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG (সর্বোচ্চ 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setNidFrontPhoto)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 2. NID Back */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  ২. NID কার্ডের পেছনের পাশ (Back)
                </span>
                {nidBackPhoto && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    যুক্ত আছে ✓
                  </span>
                )}
              </div>

              {nidBackPhoto ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={nidBackPhoto} 
                    alt="NID Back" 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewImage({ url: nidBackPhoto, title: 'NID কার্ড (পেছনের পাশ)' })}
                  />
                  <button
                    type="button"
                    onClick={() => setNidBackPhoto('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                    title="ছবিটি মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-slate-400">ঐচ্ছিক কিন্তু বাঞ্ছনীয়</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setNidBackPhoto)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 3. University Student ID */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  ৩. বিশ্ববিদ্যালয় / কলেজ স্টুডেন্ট আইডি
                </span>
                {studentIdCardPhoto && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    যুক্ত আছে ✓
                  </span>
                )}
              </div>

              {studentIdCardPhoto ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={studentIdCardPhoto} 
                    alt="Student ID" 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewImage({ url: studentIdCardPhoto, title: 'বিশ্ববিদ্যালয় স্টুডেন্ট আইডি কার্ড' })}
                  />
                  <button
                    type="button"
                    onClick={() => setStudentIdCardPhoto('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                    title="ছবিটি মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">আইডি কার্ডের ছবি দিন</span>
                  <span className="text-[10px] text-slate-400">লাইব্রেরি বা সেমিস্টার কার্ড</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setStudentIdCardPhoto)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 4. Certificate / Sanad */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  ৪. শিক্ষাগত সনদ / ফলাফল / সনদপত্র
                </span>
                {certificatePhoto && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    যুক্ত আছে ✓
                  </span>
                )}
              </div>

              {certificatePhoto ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video flex items-center justify-center">
                  <img 
                    src={certificatePhoto} 
                    alt="Certificate" 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewImage({ url: certificatePhoto, title: 'শিক্ষাগত সনদপত্র / মার্কশিট' })}
                  />
                  <button
                    type="button"
                    onClick={() => setCertificatePhoto('')}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 cursor-pointer shadow-md"
                    title="ছবিটি মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">সনদপত্র আপলোড করুন</span>
                  <span className="text-[10px] text-slate-400">HSC / ডিগ্রি / দাওরায়ে হাদিস সনদ</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setCertificatePhoto)}
                    className="hidden"
                  />
                </label>
              )}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'জমা হচ্ছে...' : 'ভেরিফিকেশনের জন্য জমা দিন'}</span>
            </button>
          </div>
        </form>

        {/* Image Preview Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setPreviewImage(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-xl w-full p-4 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{previewImage.title}</span>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200">
                <img 
                  src={previewImage.url} 
                  alt={previewImage.title} 
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
