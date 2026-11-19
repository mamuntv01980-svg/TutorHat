import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { PublicRegistrableRole, registerUserAccount } from '../services/userAuth';

interface RegisterPageProps {
  initialRole?: PublicRegistrableRole;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ initialRole = 'tutor' }) => {
  const { navigateTo, language, loginAs } = useApp();

  const [role, setRole] = useState<PublicRegistrableRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setRole(initialRole);
    setError('');
  }, [initialRole]);

  const isGuardian = role === 'guardian';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await registerUserAccount({
        role,
        identifier,
        password,
        confirmPassword
      });

      if (!result.success || !result.user) {
        setError(result.error || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
        return;
      }

      // Immediately log into the newly created Guardian or Tutor account and route directly to Dashboard
      loginAs(role, result.user.id);
      navigateTo(role === 'tutor' ? 'tutor-dashboard' : 'guardian-dashboard');
    } catch (err: any) {
      setError(err?.message || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-14 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('choose-role')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-950 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'ভূমিকা পরিবর্তনে ফিরে যান' : 'Back to Role Selection'}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo(isGuardian ? 'register-tutor' : 'register-guardian')}
          className="text-xs font-bold text-blue-900 hover:underline cursor-pointer"
        >
          {isGuardian
            ? (language === 'bn' ? 'টিউটর হিসেবে খুলুন →' : 'Switch to Tutor →')
            : (language === 'bn' ? 'অভিভাবক হিসেবে খুলুন →' : 'Switch to Guardian →')}
        </button>
      </div>

      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isGuardian
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            {isGuardian ? <Users className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            <span>{isGuardian ? 'Guardian Registration' : 'Tutor Registration'}</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-blue-950">
          {isGuardian
            ? (language === 'bn' ? 'অভিভাবক অ্যাকাউন্ট তৈরি করুন' : 'Create Guardian Account')
            : (language === 'bn' ? 'টিউটর অ্যাকাউন্ট তৈরি করুন' : 'Create Tutor Account')}
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isGuardian
            ? (language === 'bn'
                ? 'শুধুমাত্র Gmail বা মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খুলুন। ছবি ও তথ্য পরে ড্যাশবোর্ড থেকে যোগ করতে পারবেন।'
                : 'Sign up with only Gmail or Mobile Number and Password. Complete your guardian profile inside your dashboard.')
            : (language === 'bn'
                ? 'শুধুমাত্র Gmail বা মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খুলুন। CV, ছবি ও শিক্ষাগত তথ্য পরে ড্যাশবোর্ড থেকে পূরণ করবেন।'
                : 'Sign up with only Gmail or Mobile Number and Password. Complete your CV, photo & qualifications inside your dashboard.')}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Field 1: Gmail or Mobile Number */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              {language === 'bn' ? 'Gmail অথবা Mobile Number *' : 'Gmail or Mobile Number *'}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@gmail.com অথবা 017XXXXXXXX"
              className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
            />
          </div>

          {/* Field 2: Password */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              {language === 'bn' ? 'Password (পাসওয়ার্ড) *' : 'Password *'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'bn' ? 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড' : 'Minimum 6 characters'}
                className="w-full py-3 px-3.5 pr-16 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'লুকান' : 'দেখুন'}</span>
              </button>
            </div>
          </div>

          {/* Field 3: Confirm Password */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              {language === 'bn' ? 'Confirm Password (পাসওয়ার্ড নিশ্চিত করুন) *' : 'Confirm Password *'}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={language === 'bn' ? 'পুনরায় পাসওয়ার্ডটি লিখুন' : 'Re-enter your password'}
                className="w-full py-3 px-3.5 pr-16 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showConfirmPassword ? 'লুকান' : 'দেখুন'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              {language === 'bn'
                ? 'অ্যাকাউন্ট তৈরি হলেই সরাসরি আপনার ড্যাশবোর্ডে প্রবেশ করবেন। ড্যাশবোর্ড থেকে ধাপে ধাপে প্রোফাইল ০–১০০% সম্পূর্ণ করা যাবে।'
                : 'You will enter your dashboard immediately after signup and complete your profile step-by-step from 0% to 100%.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-xs cursor-pointer disabled:opacity-60 ${
              isGuardian ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            {isSubmitting ? (
              <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'}</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isGuardian
                    ? (language === 'bn' ? 'Guardian অ্যাকাউন্ট তৈরি ও ড্যাশবোর্ডে প্রবেশ' : 'Create Guardian Account & Enter Dashboard')
                    : (language === 'bn' ? 'Tutor অ্যাকাউন্ট তৈরি ও ড্যাশবোর্ডে প্রবেশ' : 'Create Tutor Account & Enter Dashboard')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>{language === 'bn' ? 'এনক্রিপ্টেড পাসওয়ার্ড সুরক্ষা' : 'Encrypted password security'}</span>
          </span>
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="font-bold text-blue-900 hover:underline cursor-pointer"
          >
            {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? Login' : 'Already registered? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
