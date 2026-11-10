import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { compressImage } from '../../services/firebase';

interface TutorPhotoUploadProps {
  currentPhoto?: string;
  tutorName: string;
  onPhotoChanged: (photoUrl: string) => void;
  disabled?: boolean;
}

export const TutorPhotoUpload: React.FC<TutorPhotoUploadProps> = ({
  currentPhoto = '',
  tutorName,
  onPhotoChanged,
  disabled = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhoto);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset inputs so same file can be re-selected if desired
    e.target.value = '';

    // Validate size (max 15MB raw input before client compression)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('ছবির সাইজ ১৫ মেগাবাইটের কম হতে হবে।');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      setSuccessMsg('');

      // 1. Compress image in browser (WebP/JPEG, ~50-80KB)
      const compressedDataUrl = await compressImage(file, 600, 0.85);

      // 2. Set live local preview immediately
      setPreviewUrl(compressedDataUrl);

      // 3. Callback to parent / store
      onPhotoChanged(compressedDataUrl);

      setSuccessMsg('প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setErrorMsg(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePhoto = () => {
    setPreviewUrl('');
    onPhotoChanged('');
    setSuccessMsg('ছবি মুছে ফেলা হয়েছে। ডিফল্ট অ্যাভাটার সেট করা হয়েছে।');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Get user initial for avatar fallback
  const initial = tutorName ? tutorName.trim().charAt(0).toUpperCase() : 'T';

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-5 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        {/* Circular Avatar Preview Container */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center ring-2 ring-blue-900/10">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={tutorName}
                className="w-full h-full object-cover object-center"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-indigo-700 text-amber-300 font-extrabold text-3xl sm:text-4xl flex items-center justify-center">
                {initial}
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mb-1" />
                <span className="text-[10px] font-semibold">কম্প্রেস হচ্ছে...</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {previewUrl && (
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs" title="ছবি সংরক্ষিত">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Action Controls & Instructions */}
        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
              <span>প্রোফাইল ছবি (Tutor Profile Photo)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold">ভেরিফিকেশনের জন্য আবশ্যক</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              অভিভাবকদের আস্থা অর্জনের জন্য আপনার একটি স্পষ্ট ও প্রফেশনাল পাসপোর্ট সাইজের ছবি আপলোড করুন। ফোনের গ্যালারি বা ক্যামেরা উভয়টি ব্যবহার করতে পারেন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            
            {/* Gallery Upload Button */}
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => galleryInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>{previewUrl ? 'ছবি পরিবর্তন (Replace)' : 'গ্যালারি থেকে নির্বাচন'}</span>
            </button>

            {/* Direct Camera Capture (Mobile & Web) */}
            <button
              type="button"
              disabled={disabled || isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5 text-blue-700" />
              <span>ক্যামেরা দিয়ে তুলুন</span>
            </button>

            {/* Delete Photo Button */}
            {previewUrl && (
              <button
                type="button"
                disabled={disabled || isProcessing}
                onClick={handleDeletePhoto}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title="ছবি মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ছবি মুছুন</span>
              </button>
            )}
          </div>

          {/* Hidden File Inputs */}
          {/* 1. Gallery input */}
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />

          {/* 2. Direct Camera capture input */}
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="user"
            className="hidden"
          />

          {/* Success / Error Banners */}
          {successMsg && (
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="inline-flex items-center gap-1.5 text-[11px] text-rose-700 font-medium bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
