import React, { useState } from 'react';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { store } from '../services/store';
import { BrandLogo } from '../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const { navigateTo, language, loginAs } = useApp();

  const [identifier, setIdentifier] = useState('rahim.tutor@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = store.findUserByPhoneOrEmail(identifier);
    if (!matched) {
      setError(language === 'bn' ? 'ব্যবহারকারী পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল বা মোবাইল দিন।' : 'User not found. Please check your email or mobile.');
      return;
    }

    loginAs(matched.role, matched.id);
    if (matched.role === 'admin') navigateTo('admin-dashboard');
    else if (matched.role === 'tutor') navigateTo('tutor-dashboard');
    else navigateTo('guardian-dashboard');
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
          {language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল বা মোবাইল এবং পাসওয়ার্ড দিন' : 'Enter your registered email or mobile and password'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-slate-900 block mb-1">
              {language === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="017XXXXXXXX or email@domain.com"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
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
                onClick={() => alert(language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক আপনার নম্বরে পাঠানো হবে।' : 'Password reset link will be sent to your phone.')}
                className="text-[11px] text-blue-700 hover:underline"
              >
                {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] min-h-[44px]"
            >
              {language === 'bn' ? 'সাইন ইন করুন' : 'Sign In'}
            </button>
          </div>

        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            {language === 'bn' ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => navigateTo('choose-role')}
              className="font-bold text-blue-900 hover:underline ml-1"
            >
              {language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Create Account'}
            </button>
          </p>
        </div>

        {/* Quick Demo Logins Bar */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <p className="font-semibold text-slate-700 text-[11px] text-center">
            {language === 'bn' ? 'টেস্টিংয়ের জন্য ওয়ান-ক্লিক লগইন:' : 'Instant Demo Persona Sign-In:'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                loginAs('tutor');
                navigateTo('tutor-dashboard');
              }}
              className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-blue-600 hover:text-blue-900 text-center text-[11px]"
            >
              Tutor (Rahim)
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('guardian');
                navigateTo('guardian-dashboard');
              }}
              className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-blue-600 hover:text-blue-900 text-center text-[11px]"
            >
              Guardian
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('admin-dashboard');
              }}
              className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-blue-600 hover:text-blue-900 text-center text-[11px] flex items-center justify-center gap-1"
            >
              <span>🔒 Admin Console</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
