import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Fingerprint,
  KeyRound,
  Delete,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Info,
  X,
  UserPlus,
  LogIn,
  User,
  Mail,
  Phone,
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services/store';
import {
  hashPin,
  verifyAdminPin,
  getLockoutState,
  recordFailedAttempt,
  resetFailedAttempts,
  createAdminSession,
  registerWebAuthnPasskey,
  verifyWebAuthnBiometric,
  MAX_PIN_ATTEMPTS
} from '../../services/adminAuth';

interface AdminAuthBarrierProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AdminAuthBarrier: React.FC<AdminAuthBarrierProps> = ({
  onSuccess,
  onCancel,
  isModal = false
}) => {
  const { loginAs, settings, storeState } = useApp();

  // Determine if admin has already configured an account
  const isAccountAlreadyConfigured = Boolean(
    settings.adminSecurity?.adminAccountConfigured ||
    (settings.adminSecurity?.adminPinHash && settings.adminSecurity.adminPinHash !== 'de2d3061d2ebb9c5031fd1082ada07b42652451de2e9b2ae9a33175b894d5482')
  );

  // Main Mode: 'login' | 'create'
  const [mainMode, setMainMode] = useState<'login' | 'create'>(
    isAccountAlreadyConfigured ? 'login' : 'create'
  );

  // --- LOGIN MODE STATES ---
  const [loginSubTab, setLoginSubTab] = useState<'pin' | 'biometric'>('pin');
  const [loginPin, setLoginPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Lockout & Rate Limit State
  const [lockout, setLockout] = useState(getLockoutState());

  // --- CREATE ACCOUNT MODE STATES ---
  const [createName, setCreateName] = useState<string>(
    settings.adminSecurity?.primaryAdminName || 'মোঃ মামুন (এডমিন)'
  );
  const [createEmail, setCreateEmail] = useState<string>(
    settings.adminSecurity?.primaryAdminEmail || 'mamuntv01980@gmail.com'
  );
  const [createPhone, setCreatePhone] = useState<string>(
    settings.adminSecurity?.primaryAdminPhone || '01752617360'
  );
  const [createPin, setCreatePin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showCreatePin, setShowCreatePin] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');
  const [isRegisteringBiometric, setIsRegisteringBiometric] = useState<boolean>(false);
  const [registeredPasskeyId, setRegisteredPasskeyId] = useState<string | null>(
    settings.adminSecurity?.biometricCredentialId || null
  );
  const [biometricStatusMsg, setBiometricStatusMsg] = useState<string>(
    settings.adminSecurity?.biometricPasskeyRegistered
      ? 'বায়োমেট্রিক ফিঙ্গারপ্রিন্ট ইতিমধ্যে সংযুক্ত আছে।'
      : ''
  );
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  // Countdown timer for lockout
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (lockout.isLocked) {
      interval = setInterval(() => {
        const state = getLockoutState();
        setLockout(state);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockout.isLocked]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- LOGIN: PIN Verification ---
  const handlePinVerification = useCallback(
    async (pinToVerify: string) => {
      if (isVerifying || lockout.isLocked) return;

      setIsVerifying(true);
      setLoginError('');

      try {
        const storedHash = settings.adminSecurity?.adminPinHash;
        const salt = settings.adminSecurity?.adminPinSalt || 'tutorhat_sec_salt_';

        const isValid = await verifyAdminPin(pinToVerify, storedHash, salt);

        if (isValid) {
          // Success
          resetFailedAttempts();
          setLockout(getLockoutState());
          setAuthSuccess(true);
          setSuccessMessage('পিন কোড সঠিক! অ্যাডমিন প্যানেলে প্রবেশ করানো হচ্ছে...');

          // Find active admin user or fallback
          const adminUser = storeState.users.find(u => u.role === 'admin');
          const adminId = adminUser ? adminUser.id : 'user_admin_01';
          createAdminSession(adminId, 'pin');

          setTimeout(() => {
            loginAs('admin', adminId);
            if (onSuccess) onSuccess();
          }, 600);
        } else {
          // Failure: record attempt & update lockout
          const updatedLockout = recordFailedAttempt();
          setLockout(updatedLockout);
          setLoginPin('');

          if (updatedLockout.isLocked) {
            setLoginError(
              'অতিরিক্ত ৫ বার ভুল পিন দেওয়ায় সিকিউরিটি লকআউট সক্রিয় হয়েছে! আগামী ১৫ মিনিট অপেক্ষা করুন।'
            );
          } else {
            setLoginError(
              `ভুল ৪-ডিজিটের পিন! বাকি চেষ্টা: ${updatedLockout.attemptsRemaining} বার।`
            );
          }
        }
      } catch {
        setLoginError('যাচাই করার সময় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
        setLoginPin('');
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, lockout.isLocked, settings.adminSecurity, storeState.users, loginAs, onSuccess]
  );

  // Auto-submit login PIN when 4 digits entered
  useEffect(() => {
    if (mainMode === 'login' && loginSubTab === 'pin' && loginPin.length === 4 && !lockout.isLocked && !isVerifying) {
      handlePinVerification(loginPin);
    }
  }, [mainMode, loginSubTab, loginPin, lockout.isLocked, isVerifying, handlePinVerification]);

  // Keyboard listener for Login PIN
  useEffect(() => {
    if (mainMode !== 'login' || loginSubTab !== 'pin' || lockout.isLocked || authSuccess) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if focused on an input element
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key >= '0' && e.key <= '9') {
        if (loginPin.length < 4) {
          setLoginPin(prev => prev + e.key);
          setLoginError('');
        }
      } else if (e.key === 'Backspace') {
        setLoginPin(prev => prev.slice(0, -1));
        setLoginError('');
      } else if (e.key === 'Escape') {
        setLoginPin('');
        if (onCancel) onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainMode, loginSubTab, lockout.isLocked, loginPin, authSuccess, onCancel]);

  const handleDigitPress = (digit: string) => {
    if (lockout.isLocked || isVerifying || authSuccess) return;
    if (loginPin.length < 4) {
      setLoginPin(prev => prev + digit);
      setLoginError('');
    }
  };

  const handleDeletePress = () => {
    if (lockout.isLocked || isVerifying || authSuccess) return;
    setLoginPin(prev => prev.slice(0, -1));
    setLoginError('');
  };

  const handleClearPress = () => {
    if (lockout.isLocked || isVerifying || authSuccess) return;
    setLoginPin('');
    setLoginError('');
  };

  // --- LOGIN: Biometric Authentication ---
  const handleBiometricAuth = async () => {
    if (lockout.isLocked || isVerifying || authSuccess) return;
    setIsVerifying(true);
    setLoginError('');

    try {
      const isRegistered = settings.adminSecurity?.biometricPasskeyRegistered;
      const credentialId = settings.adminSecurity?.biometricCredentialId;

      const result = await verifyWebAuthnBiometric(credentialId);

      if (result.success) {
        resetFailedAttempts();
        setLockout(getLockoutState());
        setAuthSuccess(true);
        setSuccessMessage('ফিঙ্গারপ্রিন্ট যাচাই সফল! অ্যাডমিন প্যানেলে প্রবেশ করানো হচ্ছে...');

        const adminUser = storeState.users.find(u => u.role === 'admin');
        const adminId = adminUser ? adminUser.id : 'user_admin_01';
        createAdminSession(adminId, 'biometric');

        setTimeout(() => {
          loginAs('admin', adminId);
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        if (!isRegistered) {
          setLoginError(
            'এই ডিভাইসে এখনো বায়োমেট্রিক ফিঙ্গারপ্রিন্ট রেজিস্টার করা হয়নি। আপনি "নতুন অ্যাকাউন্ট ক্রিয়েট" ট্যাব থেকে ফিঙ্গারপ্রিন্ট যুক্ত করুন অথবা ৪-ডিজিটের পিন দিয়ে প্রবেশ করুন।'
          );
        } else {
          setLoginError(result.error || 'বায়োমেট্রিক স্ক্যান ব্যর্থ হয়েছে।');
        }
      }
    } catch {
      setLoginError('বায়োমেট্রিক অথেন্টিকেশন সম্পন্ন করা যায়নি। পিন কোড ব্যবহার করুন।');
    } finally {
      setIsVerifying(false);
    }
  };

  // --- CREATE ACCOUNT: Register Biometric / Passkey on device ---
  const handleRegisterBiometricInSetup = async () => {
    setIsRegisteringBiometric(true);
    setBiometricStatusMsg('');
    setCreateError('');

    try {
      const emailToUse = createEmail.trim() || 'admin@tutorhat.com';
      const result = await registerWebAuthnPasskey(emailToUse);

      if (result.success && result.credentialId) {
        setRegisteredPasskeyId(result.credentialId);
        setBiometricStatusMsg('✓ বায়োমেট্রিক ফিঙ্গারপ্রিন্ট সফলভাবে সংযুক্ত হয়েছে!');
      } else {
        setBiometricStatusMsg(
          result.error ||
            'ডিভাইস সেন্সর সাড়া দেয়নি বা বায়োমেট্রিক অনুমতি বাতিল করা হয়েছে। এটি ঐচ্ছিক, আপনি শুধু পিন দিয়েও একাউন্ট তৈরি করতে পারেন।'
        );
      }
    } catch {
      setBiometricStatusMsg('বায়োমেট্রিক রেজিস্ট্রেশন করা যায়নি। এটি ঐচ্ছিক, পিন দিয়ে এগিয়ে যান।');
    } finally {
      setIsRegisteringBiometric(false);
    }
  };

  // --- CREATE ACCOUNT: Submit Form ---
  const handleCreateAdminAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    const name = createName.trim();
    const email = createEmail.trim();
    const phone = createPhone.trim();
    const pin = createPin.trim();

    if (!name) {
      setCreateError('অনুগ্রহ করে অ্যাডমিনের নাম লিখুন।');
      return;
    }
    if (!email && !phone) {
      setCreateError('অনুগ্রহ করে অ্যাডমিনের ইমেইল অথবা মোবাইল নম্বর লিখুন।');
      return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setCreateError('পাসওয়ার্ড বা পিন অবশ্যই ৪ সংখ্যার (যেমন: 2026, 1234) হতে হবে।');
      return;
    }
    if (pin !== confirmPin.trim()) {
      setCreateError('পিন কোড এবং কনফার্ম পিন মেলেনি! উভয় স্থানে একই ৪-সংখ্যার পিন দিন।');
      return;
    }

    setIsSubmittingCreate(true);

    try {
      const salt = 'tutorhat_sec_salt_';
      const pinHash = await hashPin(pin, salt);

      // Check if an admin user already exists, update them or create new
      const existingAdmin = storeState.users.find(u => u.role === 'admin');
      let adminId = 'user_admin_01';

      if (existingAdmin) {
        adminId = existingAdmin.id;
        // Update user properties in store
        store.updateUser(adminId, {
          name,
          email: email || existingAdmin.email,
          phone: phone || existingAdmin.phone
        });
      } else {
        const newAdmin = store.createUser({
          name,
          email: email || 'admin@tutorhat.com',
          phone: phone || '01752617360',
          role: 'admin',
          gender: 'other',
          location: 'Dhaka',
          district: 'Dhaka'
        });
        adminId = newAdmin.id;
      }

      // Update system settings with new admin security credentials
      store.updateSettings({
        adminSecurity: {
          requireStrongPassword: false,
          adminPinHash: pinHash,
          adminPinSalt: salt,
          biometricPasskeyRegistered: Boolean(registeredPasskeyId),
          biometricCredentialId: registeredPasskeyId || undefined,
          biometricCredentialName: registeredPasskeyId ? `${name}'s Device Fingerprint` : undefined,
          twoFactorEnabled: false,
          maxFailedAttempts: 5,
          lockoutDurationMinutes: 15,
          adminAccountConfigured: true,
          primaryAdminName: name,
          primaryAdminEmail: email,
          primaryAdminPhone: phone
        }
      });

      // Clear any lockout and create admin session
      resetFailedAttempts();
      createAdminSession(adminId, registeredPasskeyId ? 'biometric' : 'pin');

      setAuthSuccess(true);
      setSuccessMessage('🎉 অ্যাডমিন একাউন্ট সফলভাবে তৈরি ও সংরক্ষিত হয়েছে! ড্যাশবোর্ডে প্রবেশ করানো হচ্ছে...');

      setTimeout(() => {
        loginAs('admin', adminId);
        if (onSuccess) onSuccess();
      }, 700);
    } catch {
      setCreateError('অ্যাকাউন্ট তৈরি করার সময় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto ${
        isModal ? 'p-0' : 'px-4 py-8 sm:py-16'
      }`}
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 text-white relative">
          {isModal && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-blue-950 flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-amber-400/20">
              <ShieldAlert className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-wide">
                  TutorHat Admin Access
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Protected
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {mainMode === 'create'
                  ? 'নতুন অ্যাডমিন অ্যাকাউন্ট ও সিকিউরিটি সেটআপ'
                  : 'অ্যাডমিন পরিচয় যাচাই ও নিরাপত্তা স্ক্রিন'}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Mode Selector: [এডমিন লগইন] vs [নতুন অ্যাকাউন্ট ক্রিয়েট] */}
        <div className="px-6 pt-5 pb-1">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setMainMode('login');
                setLoginError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mainMode === 'login'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>এডমিন লগইন</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMainMode('create');
                setCreateError('');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                mainMode === 'create'
                  ? 'bg-blue-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>নতুন অ্যাকাউন্ট ক্রিয়েট</span>
              {!isAccountAlreadyConfigured && (
                <span className="absolute -top-1.5 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Success Indicator */}
        {authSuccess && (
          <div className="p-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">সফল হয়েছে!</p>
                <p className="text-xs text-emerald-700 mt-0.5">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- VIEW 1: CREATE ADMIN ACCOUNT -------------------- */}
        {!authSuccess && mainMode === 'create' && (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900">
                  অ্যাডমিন অ্যাকাউন্ট ক্রিয়েট করুন:
                </span>
                <span className="text-[11px] text-emerald-800 leading-relaxed block mt-0.5">
                  আপনার নাম, মোবাইল/ইমেইল, ৪-ডিজিটের সিকিউরিটি পিন এবং ডিভাইস ফিঙ্গারপ্রিন্ট দিয়ে অ্যাডমিন প্রোফাইল সক্রিয় করুন। পরবর্তীতে এই পিন দিয়ে সরাসরি প্রবেশ করতে পারবেন।
                </span>
              </div>
            </div>

            {createError && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdminAccount} className="space-y-3.5 text-xs">
              {/* Admin Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  অ্যাডমিনের পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={e => setCreateName(e.target.value)}
                    placeholder="যেমন: মোঃ মামুন (Super Admin)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-900 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ইমেইল <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={createEmail}
                      onChange={e => setCreateEmail(e.target.value)}
                      placeholder="admin@tutorhat.com"
                      className="w-full pl-8.5 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-900 focus:outline-none transition text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={createPhone}
                      onChange={e => setCreatePhone(e.target.value)}
                      placeholder="01752617360"
                      className="w-full pl-8.5 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-900 focus:outline-none transition text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* PIN Code Setup */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    ৪-সংখ্যার পিন কোড <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showCreatePin ? 'text' : 'password'}
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={createPin}
                      onChange={e => setCreatePin(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="যেমন: 2026"
                      className="w-full pl-8.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none transition text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePin(!showCreatePin)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showCreatePin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    পিন নিশ্চিত করুন <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showCreatePin ? 'text' : 'password'}
                      maxLength={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={confirmPin}
                      onChange={e => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="পুনরায় ৪ সংখ্যা"
                      className="w-full pl-8.5 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:border-blue-900 focus:outline-none transition text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Fingerprint Passkey Registration Card */}
              <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/90 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800 text-xs">
                      ডিভাইস ফিঙ্গারপ্রিন্ট সংযোজন (Passkey)
                    </span>
                  </div>
                  {registeredPasskeyId && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> সংযুক্ত
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  সমর্থিত মোবাইল বা কম্পিউটারে ফিঙ্গারপ্রিন্ট স্ক্যানার (WebAuthn/Touch ID/Windows Hello) লিঙ্ক করে এক স্পর্শে দ্রুত লগইন করুন।
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleRegisterBiometricInSetup}
                    disabled={isRegisteringBiometric}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      registeredPasskeyId
                        ? 'bg-emerald-100/90 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                        : 'bg-white hover:bg-slate-100 text-blue-950 border border-slate-300 shadow-2xs'
                    }`}
                  >
                    <Fingerprint className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isRegisteringBiometric
                        ? 'ফিঙ্গারপ্রিন্ট সেন্সরে স্পর্শ করুন...'
                        : registeredPasskeyId
                        ? '✓ ফিঙ্গারপ্রিন্ট সংযুক্ত হয়েছে (পুনরায় স্ক্যান করতে ক্লিক করুন)'
                        : '👆 ফিঙ্গারপ্রিন্ট স্ক্যান করে যুক্ত করুন'}
                    </span>
                  </button>
                </div>

                {biometricStatusMsg && (
                  <p className="text-[11px] text-slate-600 italic">
                    {biometricStatusMsg}
                  </p>
                )}
              </div>

              {/* Create Account Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="w-full py-3 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 hover:from-blue-900 hover:to-indigo-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>
                    {isSubmittingCreate
                      ? 'অ্যাকাউন্ট তৈরি হচ্ছে...'
                      : 'অ্যাডমিন অ্যাকাউন্ট তৈরি করুন ও প্রবেশ করুন'}
                  </span>
                </button>
              </div>

              {/* Switch to Login Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMainMode('login');
                    setLoginError('');
                  }}
                  className="text-slate-600 hover:text-blue-900 text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-700" />
                  <span>ইতিমধ্যে অ্যাকাউন্ট তৈরি আছে? এখানে লগইন করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------- VIEW 2: ADMIN LOGIN -------------------- */}
        {!authSuccess && mainMode === 'login' && (
          <div className="p-6 space-y-4">
            {/* Lockout Warning Banner */}
            {lockout.isLocked && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2 animate-pulse">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>সাময়িক নিরাপত্তা লকআউট সক্রিয়!</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  পরপর ৫ বার ভুল পিন দেওয়ার কারণে অ্যাডমিন অ্যাক্সেস ব্লক করা হয়েছে। পুনরায় চেষ্টা করার আগে অপেক্ষা করুন:
                </p>
                <div className="text-center py-2 bg-rose-100/80 rounded-xl">
                  <span className="font-mono text-xl font-black text-rose-700">
                    {formatCountdown(lockout.remainingSeconds)}
                  </span>
                  <span className="text-[10px] text-rose-600 block mt-0.5">বাকি সময়</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {loginError && !authSuccess && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Active Admin Hint */}
            {settings.adminSecurity?.primaryAdminName && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[11px]">
                    {settings.adminSecurity.primaryAdminName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      {settings.adminSecurity.primaryAdminName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {settings.adminSecurity.primaryAdminEmail || settings.adminSecurity.primaryAdminPhone || 'প্রধান অ্যাডমিন'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  অ্যাডমিন প্রোফাইল
                </span>
              </div>
            )}

            {/* Sub-Tab Selector: PIN vs Fingerprint */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                disabled={lockout.isLocked}
                onClick={() => {
                  setLoginSubTab('pin');
                  setLoginError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  loginSubTab === 'pin'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>৪-ডিজিটের PIN</span>
              </button>
              <button
                type="button"
                disabled={lockout.isLocked}
                onClick={() => {
                  setLoginSubTab('biometric');
                  setLoginError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  loginSubTab === 'biometric'
                    ? 'bg-blue-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                <span>ফিঙ্গারপ্রিন্ট</span>
              </button>
            </div>

            {/* Mode 1: 4-Digit PIN Keypad */}
            {loginSubTab === 'pin' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-700">
                    ৪ সংখ্যার অ্যাডমিন পিন কোড দিন
                  </span>
                  {!lockout.isLocked && (
                    <p className="text-[10px] text-slate-500">
                      চেষ্টা অবশিষ্ট: <strong className="text-slate-800">{lockout.attemptsRemaining}</strong> / {MAX_PIN_ATTEMPTS}
                    </p>
                  )}
                </div>

                {/* 4 Pin Indicators */}
                <div className="flex justify-center items-center gap-3 py-1">
                  {[0, 1, 2, 3].map(index => {
                    const isFilled = loginPin.length > index;
                    return (
                      <div
                        key={index}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                          authSuccess
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : isFilled
                            ? 'border-blue-900 bg-blue-50 text-blue-950 scale-105 shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-300'
                        }`}
                      >
                        {isFilled ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-950" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <button
                      key={num}
                      type="button"
                      disabled={lockout.isLocked || isVerifying || authSuccess}
                      onClick={() => handleDigitPress(num)}
                      className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 font-bold text-lg border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {num}
                    </button>
                  ))}

                  {/* Clear 'C' */}
                  <button
                    type="button"
                    disabled={lockout.isLocked || isVerifying || loginPin.length === 0 || authSuccess}
                    onClick={handleClearPress}
                    className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-500 font-semibold text-xs border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Clear"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                  </button>

                  {/* 0 */}
                  <button
                    type="button"
                    disabled={lockout.isLocked || isVerifying || authSuccess}
                    onClick={() => handleDigitPress('0')}
                    className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 font-bold text-lg border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    0
                  </button>

                  {/* Backspace */}
                  <button
                    type="button"
                    disabled={lockout.isLocked || isVerifying || loginPin.length === 0 || authSuccess}
                    onClick={handleDeletePress}
                    className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-600 font-semibold border border-slate-200 shadow-2xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Backspace"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>

                {/* Default PIN fallback hint if not yet changed */}
                {!isAccountAlreadyConfigured && (
                  <div className="pt-1">
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span>প্রাথমিক ডিফল্ট পিন: </span>
                        <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">
                          2026
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          (আপনার নিজস্ব পিন ও ফিঙ্গারপ্রিন্ট সেট করতে উপরের &quot;নতুন অ্যাকাউন্ট ক্রিয়েট&quot; ট্যাবে যান)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Biometric Fingerprint */}
            {loginSubTab === 'biometric' && (
              <div className="text-center space-y-4 py-2">
                <div
                  onClick={handleBiometricAuth}
                  className={`w-28 h-28 mx-auto rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 select-none ${
                    authSuccess
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600 scale-105 shadow-emerald-500/20 shadow-lg'
                      : isVerifying
                      ? 'bg-blue-50 border-blue-500 text-blue-600 animate-pulse ring-8 ring-blue-500/10'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 hover:border-blue-900 hover:scale-105 shadow-sm active:scale-95'
                  }`}
                >
                  <Fingerprint
                    className={`w-14 h-14 ${
                      isVerifying
                        ? 'animate-bounce text-blue-600'
                        : authSuccess
                        ? 'text-emerald-600'
                        : 'text-slate-800'
                    }`}
                  />
                  <span className="text-[10px] font-bold mt-1 text-slate-600">
                    {authSuccess
                      ? 'যাচাই সম্পন্ন!'
                      : isVerifying
                      ? 'স্ক্যান হচ্ছে...'
                      : 'টাচ করুন'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-blue-950">
                    {authSuccess
                      ? '✓ বায়োমেট্রিক অথেন্টিকেশন সফল'
                      : 'ডিভাইস ফিঙ্গারপ্রিন্ট সেন্সরে স্পর্শ করুন'}
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    সমর্থিত ব্রাউজার ও ডিভাইসে WebAuthn বায়োমেট্রিক সেন্সর / Passkeys ব্যবহার করে প্রবেশ করুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  disabled={lockout.isLocked || isVerifying || authSuccess}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>ফিঙ্গারপ্রিন্ট দিয়ে আনলক করুন</span>
                </button>
              </div>
            )}

            {/* Switch to Create Account Link */}
            <div className="text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMainMode('create');
                  setCreateError('');
                }}
                className="text-slate-600 hover:text-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>নতুন অ্যাডমিন অ্যাকাউন্ট বা ফিঙ্গারপ্রিন্ট সেটআপ করতে চান? ক্লিক করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Safety Note */}
        <div className="text-center py-2.5 bg-slate-50/70 border-t border-slate-100">
          <span className="text-[10px] text-slate-400">
            নিরাপত্তা সুরক্ষিত সেশন · প্রতিটি লগইন রেকর্ড ও মনিটর করা হয়
          </span>
        </div>
      </div>
    </div>
  );
};
