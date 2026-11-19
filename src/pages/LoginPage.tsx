import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  BookmarkCheck,
  X,
  UserCheck,
  GraduationCap,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  loginUserAccount,
  sendForgotPasswordReset,
  getSavedAccounts,
  saveRememberedAccount,
  removeSavedAccount,
  SavedAccountRecord
} from '../services/userAuth';

export const LoginPage: React.FC = () => {
  const { navigateTo, language, loginAs } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccountRecord[]>([]);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    setSavedAccounts(getSavedAccounts());
  }, []);

  const handleSelectSavedAccount = (acc: SavedAccountRecord) => {
    setIdentifier(acc.identifier);
    setRememberMe(true);
    setError('');
  };

  const handleRemoveSavedAccount = (accIdentifier: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeSavedAccount(accIdentifier);
    setSavedAccounts(updated);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const result = await loginUserAccount({ identifier, password });

      if (result.requiresAdminBarrier) {
        // Redirect admin login attempts strictly through AdminAuthBarrier
        navigateTo('admin-dashboard');
        return;
      }

      if (!result.success || !result.user) {
        setError(
          result.error ||
            (language === 'bn'
              ? 'লগইন সম্পন্ন হয়নি। আপনার তথ্য যাচাই করুন।'
              : 'Login failed. Please check your credentials.')
        );
        return;
      }

      const loggedUser = result.user;

      // Only save identifier (NEVER password) if the user explicitly enabled Remember Me
      if (rememberMe && (loggedUser.role === 'guardian' || loggedUser.role === 'tutor')) {
        const displayLabel = loggedUser.name?.trim()
          ? `${loggedUser.name.trim()} (${identifier.trim()})`
          : identifier.trim();
        const updated = saveRememberedAccount({
          identifier: identifier.trim(),
          displayLabel,
          role: loggedUser.role
        });
        setSavedAccounts(updated);
      }

      loginAs(loggedUser.role, loggedUser.id);
      if (loggedUser.role === 'tutor') navigateTo('tutor-dashboard');
      else navigateTo('guardian-dashboard');
    } catch (err: any) {
      setError(err?.message || 'লগইনের সময় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setIsSendingReset(true);

    try {
      const res = await sendForgotPasswordReset(forgotInput);
      if (res.success) {
        setForgotSuccess(res.message);
      } else {
        setForgotError(res.message);
      }
    } catch {
      setForgotError('পাসওয়ার্ড রিসেট অনুরোধ পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-blue-950">
          {language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to TutorHat'}
        </h1>
        <p className="text-xs text-slate-600">
          {language === 'bn'
            ? 'আপনার নিবন্ধিত Gmail অথবা মোবাইল নম্বর এবং পাসওয়ার্ড দিন'
            : 'Enter your registered Gmail or mobile number and password'}
        </p>
      </div>

      {/* Saved Accounts on this Device (Remember Me - identifiers ONLY, zero passwords stored) */}
      {savedAccounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-950">
            <span className="flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>{language === 'bn' ? 'এই ডিভাইসে সংরক্ষিত অ্যাকাউন্ট (Saved Account)' : 'Saved Accounts on This Device'}</span>
            </span>
            <span className="text-[10px] font-normal text-slate-400">
              {language === 'bn' ? 'নিরাপত্তার জন্য পাসওয়ার্ড সংরক্ষিত নয়' : 'Passwords never saved'}
            </span>
          </div>

          <div className="space-y-1.5">
            {savedAccounts.map((acc) => (
              <div
                key={acc.identifier}
                onClick={() => handleSelectSavedAccount(acc)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectSavedAccount(acc);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all text-xs ${
                  identifier.trim().toLowerCase() === acc.identifier.toLowerCase()
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      acc.role === 'tutor' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {acc.role === 'tutor' ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{acc.displayLabel}</p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {acc.role === 'tutor' ? 'Tutor Account' : 'Guardian Account'} · ক্লিক করে নির্বাচন করুন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemoveSavedAccount(acc.identifier, e)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Remove saved account"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-900 block mb-1">
              {language === 'bn' ? 'Gmail অথবা মোবাইল নম্বর' : 'Gmail or Mobile Number'}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="017XXXXXXXX অথবা name@gmail.com"
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-900">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotInput(identifier);
                  setForgotError('');
                  setForgotSuccess('');
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
              >
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন? (Forgot Password)' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন"
                className="w-full py-2.5 px-3 pr-16 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-500 hover:text-slate-700 cursor-pointer flex items-center gap-1 text-[11px] p-0.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'লুকান' : 'দেখুন'}</span>
              </button>
            </div>
          </div>

          {/* Remember Me Opt-In */}
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-900 rounded cursor-pointer"
            />
            <div className="text-[11px]">
              <span className="font-bold text-slate-800 block">
                {language === 'bn' ? 'Remember Me — এই ডিভাইসে অ্যাকাউন্ট মনে রাখুন' : 'Remember Me on this device'}
              </span>
              <span className="text-slate-500">
                {language === 'bn'
                  ? 'শুধু আপনার Gmail বা মোবাইল নম্বর Saved Account হিসেবে সেভ থাকবে (পাসওয়ার্ড কখনো সেভ হবে না)।'
                  : 'Saves only your Gmail or mobile number as a Saved Account (passwords are never stored).'}
              </span>
            </div>
          </label>

          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] min-h-[44px] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {isLoggingIn
                  ? (language === 'bn' ? 'লগইন যাচাই হচ্ছে...' : 'Signing In...')
                  : (language === 'bn' ? 'সাইন ইন করুন' : 'Sign In')}
              </span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600">
            {language === 'bn' ? 'নতুন ব্যবহারকারী? কোনো অ্যাকাউন্ট নেই?' : "New to TutorHat? Don't have an account?"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigateTo('register-guardian')}
              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] cursor-pointer"
            >
              Become a Guardian
            </button>
            <button
              type="button"
              onClick={() => navigateTo('register-tutor')}
              className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-[11px] cursor-pointer"
            >
              Become a Tutor
            </button>
          </div>
        </div>
      </div>

      {/* Real Firebase Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার (Forgot Password)' : 'Reset Password'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}
            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-3 text-xs">
              <p className="text-slate-600 text-xs leading-relaxed">
                {language === 'bn'
                  ? 'আপনার নিবন্ধিত Gmail বা মোবাইল নম্বর দিন। অ্যাকাউন্টে Gmail যুক্ত থাকলে Firebase থেকে সরাসরি পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।'
                  : 'Enter your registered Gmail or mobile number. If a Gmail is linked, Firebase will send a secure password reset email.'}
              </p>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  {language === 'bn' ? 'Gmail অথবা মোবাইল নম্বর' : 'Gmail or Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="name@gmail.com অথবা 017XXXXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full py-2.5 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-800 cursor-pointer disabled:opacity-60"
              >
                {isSendingReset
                  ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...')
                  : (language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
