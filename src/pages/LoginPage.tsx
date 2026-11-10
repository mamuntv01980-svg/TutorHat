import React, { useState } from 'react';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, Check, KeyRound, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const { navigateTo, language, loginAs } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = identifier.trim();
    const trimmedPass = password.trim();

    if (!trimmedId) {
      setError(language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল লিখুন।' : 'Please enter your phone or email.');
      return;
    }

    const matched = store.findUserByPhoneOrEmail(trimmedId);
    if (!matched) {
      setError(
        language === 'bn' 
          ? 'এই মোবাইল বা ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন অথবা রেজিস্ট্রেশন করুন।' 
          : 'No account found with this phone or email. Please check or create an account.'
      );
      return;
    }

    // Verify password if one was set
    if (matched.passwordHash && matched.passwordHash !== trimmedPass) {
      setError(
        language === 'bn' 
          ? 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন অথবা "পাসওয়ার্ড ভুলে গেছেন?" অপশন ব্যবহার করুন।' 
          : 'Incorrect password! Please re-check or use "Forgot Password?".'
      );
      return;
    }

    loginAs(matched.role, matched.id);
    if (matched.role === 'admin') navigateTo('admin-dashboard');
    else if (matched.role === 'tutor') navigateTo('tutor-dashboard');
    else navigateTo('guardian-dashboard');
  };

  const handleSendResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    const targetUser = store.findUserByPhoneOrEmail(forgotInput.trim());
    if (!targetUser) {
      setForgotError(language === 'bn' ? 'এই নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' : 'No account registered with this phone.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setForgotStep(2);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (forgotOtp.trim() !== generatedOtp) {
      setForgotError(language === 'bn' ? 'ভুল ভেরিফিকেশন কোড!' : 'Incorrect verification code.');
      return;
    }
    if (newPassword.trim().length < 6) {
      setForgotError(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    const targetUser = store.findUserByPhoneOrEmail(forgotInput.trim());
    if (targetUser) {
      store.updateUser(targetUser.id, { passwordHash: newPassword.trim() });
      setForgotSuccess(language === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! এখন লগইন করুন।' : 'Password reset successful! Please log in.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotSuccess('');
        setPassword(newPassword.trim());
        setIdentifier(forgotInput.trim());
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-blue-950">
          {language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to TutorHat'}
        </h1>
        <p className="text-xs text-slate-600">
          {language === 'bn' ? 'আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিন' : 'Enter your registered phone or email and password'}
        </p>
      </div>

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
              {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="017XXXXXXXX অথবা email@example.com"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
              />
            </div>
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
                  setForgotStep(1);
                  setForgotError('');
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-blue-700 hover:underline cursor-pointer"
              >
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
              >
                {showPassword ? 'লুকান' : 'দেখুন'}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] min-h-[44px] cursor-pointer"
            >
              {language === 'bn' ? 'সাইন ইন করুন' : 'Sign In'}
            </button>
          </div>

        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            {language === 'bn' ? 'নতুন ব্যবহারকারী? কোনো অ্যাকাউন্ট নেই?' : "New to TutorHat? Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => navigateTo('choose-role')}
              className="font-bold text-blue-900 hover:underline ml-1 cursor-pointer"
            >
              {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create New Account'}
            </button>
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-900" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password'}
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
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                {forgotSuccess}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendResetOtp} className="space-y-3 text-xs">
                <p className="text-slate-600 text-xs">
                  আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল লিখুন। আমরা একটি ভেরিফিকেশন কোড জেনারেট করব।
                </p>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">মোবাইল বা ইমেইল</label>
                  <input
                    type="text"
                    required
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-800 cursor-pointer"
                >
                  কোড পাঠান
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-3 text-xs">
                {generatedOtp && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-center">
                    <span className="block text-[10px] text-amber-700">আপনার ভেরিফিকেশন কোড:</span>
                    <strong className="font-mono text-base tracking-widest">{generatedOtp}</strong>
                  </div>
                )}
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">৬-সংখ্যার কোড লিখুন</label>
                  <input
                    type="text"
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-mono text-center tracking-widest"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
