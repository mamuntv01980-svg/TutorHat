import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';
import { store } from './store';
import { User } from '../types';

export type PublicRegistrableRole = 'guardian' | 'tutor';

export interface SavedAccountRecord {
  identifier: string;
  displayLabel: string;
  role: PublicRegistrableRole;
  lastUsedAt: string;
}

const SAVED_ACCOUNTS_STORAGE_KEY = 'tutorhat_saved_accounts_v1';

// Reserved Admin identifiers that normal public registrations can never claim or collide with
const RESERVED_ADMIN_EMAILS = new Set([
  'admin@tutorhat.com',
  'mamuntv01980@gmail.com'
]);

const RESERVED_ADMIN_PHONES = new Set([
  '01752617360',
  '8801752617360'
]);

/**
 * Checks if a raw string is formatted like an email address
 */
export function isEmailIdentifier(raw: string): boolean {
  const trimmed = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Normalizes Bangladeshi mobile numbers into canonical 11-digit form (01XXXXXXXXX) when valid.
 */
export function normalizeBDPhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('8801') && digits.length === 13) {
    return digits.slice(2); // 01XXXXXXXXX
  }
  if (digits.startsWith('1') && digits.length === 10) {
    return `0${digits}`;
  }
  return digits;
}

export function isValidBDPhone(raw: string): boolean {
  const normalized = normalizeBDPhone(raw);
  return /^01[3-9]\d{8}$/.test(normalized);
}

/**
 * Validates and normalizes either a Gmail/Email or Bangladeshi Mobile Number.
 */
export function parseAuthIdentifier(raw: string): {
  valid: boolean;
  kind: 'email' | 'phone' | 'invalid';
  normalizedValue: string;
  firebaseAuthEmail: string;
  errorBn?: string;
  errorEn?: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      valid: false,
      kind: 'invalid',
      normalizedValue: '',
      firebaseAuthEmail: '',
      errorBn: 'অনুগ্রহ করে আপনার Gmail অথবা Mobile Number লিখুন।',
      errorEn: 'Please enter your Gmail or Mobile Number.'
    };
  }

  if (trimmed.includes('@')) {
    const email = trimmed.toLowerCase();
    if (!isEmailIdentifier(email)) {
      return {
        valid: false,
        kind: 'invalid',
        normalizedValue: email,
        firebaseAuthEmail: '',
        errorBn: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা (যেমন: name@gmail.com) দিন।',
        errorEn: 'Please enter a valid email address (e.g. name@gmail.com).'
      };
    }
    return {
      valid: true,
      kind: 'email',
      normalizedValue: email,
      firebaseAuthEmail: email
    };
  }

  const normalizedPhone = normalizeBDPhone(trimmed);
  if (!isValidBDPhone(normalizedPhone)) {
    return {
      valid: false,
      kind: 'invalid',
      normalizedValue: normalizedPhone,
      firebaseAuthEmail: '',
      errorBn: 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX) অথবা Gmail ব্যবহার করুন।',
      errorEn: 'Enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX) or valid Gmail.'
    };
  }

  // Deterministic Firebase Auth email alias for Mobile Number + Password authentication
  const firebaseAuthEmail = `88${normalizedPhone}@phone.tutorhat.app`;
  return {
    valid: true,
    kind: 'phone',
    normalizedValue: normalizedPhone,
    firebaseAuthEmail
  };
}

/**
 * Checks whether the identifier is reserved for platform administrators
 */
export function isReservedAdminIdentifier(identifier: string): boolean {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return false;
  if (clean === 'user_admin_01') return true;
  if (RESERVED_ADMIN_EMAILS.has(clean)) return true;

  const digits = normalizeBDPhone(clean);
  if (digits && (RESERVED_ADMIN_PHONES.has(digits) || RESERVED_ADMIN_PHONES.has(`88${digits}`))) {
    return true;
  }

  const existing = store.findUserByPhoneOrEmail(clean);
  if (existing && existing.role === 'admin') {
    return true;
  }
  return false;
}

/**
 * Generates a cryptographically random hex salt
 */
export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a password with PBKDF2-SHA256 (Web Crypto API) so plain text passwords are NEVER stored.
 */
export async function hashPasswordSecure(plainPassword: string, salt: string): Promise<string> {
  const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : undefined;
  if (subtle) {
    const encoder = new TextEncoder();
    const keyMaterial = await subtle.importKey(
      'raw',
      encoder.encode(plainPassword),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derivedBits = await subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(`th_user_auth_${salt}`),
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    const hex = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `pbkdf2$${hex}`;
  }

  // Deterministic salted hash fallback if SubtleCrypto is unavailable in an insecure context
  const combined = `th_fallback_${salt}_${plainPassword}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < combined.length; i++) {
    const ch = combined.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `fnv$${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

/**
 * Verifies a user password against stored salted cryptographic hash (supporting legacy accounts safely)
 */
export async function verifyPasswordSecure(
  plainPassword: string,
  storedHash?: string,
  storedSalt?: string
): Promise<boolean> {
  if (!storedHash) return false;
  if (storedSalt && (storedHash.startsWith('pbkdf2$') || storedHash.startsWith('fnv$'))) {
    const computed = await hashPasswordSecure(plainPassword, storedSalt);
    return computed === storedHash;
  }
  // Legacy user created prior to salted hashing
  return storedHash === plainPassword;
}

/**
 * Registers a Guardian or Tutor account using ONLY identifier (Gmail or Mobile Number), Password & Confirm Password.
 * Integrates with Firebase Authentication and creates the Firestore user/tutor profile.
 */
export async function registerUserAccount(params: {
  role: PublicRegistrableRole;
  identifier: string;
  password: string;
  confirmPassword: string;
}): Promise<{
  success: boolean;
  user?: User;
  firebaseAuthSynced: boolean;
  consoleSetupRequired?: boolean;
  error?: string;
}> {
  const { role, identifier, password, confirmPassword } = params;

  // Hard security barrier: Public signup can NEVER create an Admin account
  if (role !== 'guardian' && role !== 'tutor') {
    return {
      success: false,
      firebaseAuthSynced: false,
      error: 'অবৈধ অ্যাকাউন্ট রোল। শুধুমাত্র Guardian বা Tutor অ্যাকাউন্ট তৈরি করা যাবে।'
    };
  }

  const parsed = parseAuthIdentifier(identifier);
  if (!parsed.valid) {
    return {
      success: false,
      firebaseAuthSynced: false,
      error: parsed.errorBn || 'সঠিক Gmail বা Mobile Number দিন।'
    };
  }

  if (isReservedAdminIdentifier(parsed.normalizedValue)) {
    return {
      success: false,
      firebaseAuthSynced: false,
      error: 'এই ইমেইল বা মোবাইল নম্বরটি অ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত।'
    };
  }

  const trimmedPassword = password;
  if (!trimmedPassword || trimmedPassword.length < 6) {
    return {
      success: false,
      firebaseAuthSynced: false,
      error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
    };
  }

  if (trimmedPassword !== confirmPassword) {
    return {
      success: false,
      firebaseAuthSynced: false,
      error: 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।'
    };
  }

  // Check duplicates in store / Firestore
  const existing = store.findUserByPhoneOrEmail(parsed.normalizedValue);
  if (existing) {
    return {
      success: false,
      firebaseAuthSynced: false,
      error:
        parsed.kind === 'email'
          ? 'এই Gmail দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।'
          : 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।'
    };
  }

  const salt = generateSalt();
  const passwordHash = await hashPasswordSecure(trimmedPassword, salt);

  let firebaseUid: string | undefined;
  let firebaseAuthSynced = false;
  let consoleSetupRequired = false;
  let authProvider: User['authProvider'] = parsed.kind === 'email' ? 'firebase_email' : 'firebase_phone_mapped';

  try {
    const credential = await createUserWithEmailAndPassword(auth, parsed.firebaseAuthEmail, trimmedPassword);
    firebaseUid = credential.user.uid;
    firebaseAuthSynced = true;
  } catch (fbErr: any) {
    const code = fbErr?.code || '';
    if (code === 'auth/email-already-in-use') {
      return {
        success: false,
        firebaseAuthSynced: false,
        error: 'এই তথ্য দিয়ে Firebase Auth-এ ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে Login করুন।'
      };
    }
    if (code === 'auth/weak-password') {
      return {
        success: false,
        firebaseAuthSynced: false,
        error: 'পাসওয়ার্ডটি খুব দুর্বল। অনুগ্রহ করে কমপক্ষে ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন।'
      };
    }
    if (code === 'auth/operation-not-allowed') {
      // Email/Password sign-in method is not enabled in Firebase Console yet; preserve cryptographic salted PBKDF2 hash
      consoleSetupRequired = true;
      firebaseAuthSynced = false;
      authProvider = 'salted_hash_pending_console';
    } else {
      console.warn('[UserAuth] Firebase Auth signup notice:', code, fbErr?.message);
      firebaseAuthSynced = false;
      authProvider = 'salted_hash_pending_console';
    }
  }

  const newUser = store.createUser({
    name: '',
    email: parsed.kind === 'email' ? parsed.normalizedValue : '',
    phone: parsed.kind === 'phone' ? parsed.normalizedValue : '',
    role,
    gender: 'male',
    location: '',
    district: '',
    passwordHash,
    passwordSalt: salt,
    firebaseUid,
    authEmail: parsed.firebaseAuthEmail,
    authProvider,
    firebaseAuthSynced
  });

  return {
    success: true,
    user: newUser,
    firebaseAuthSynced,
    consoleSetupRequired
  };
}

/**
 * Authenticates a Guardian or Tutor account via Firebase Authentication + salted hash verification.
 * Strictly refuses silent admin elevation (admins must verify via AdminAuthBarrier).
 */
export async function loginUserAccount(params: {
  identifier: string;
  password: string;
}): Promise<{
  success: boolean;
  user?: User;
  requiresAdminBarrier?: boolean;
  error?: string;
}> {
  const { identifier, password } = params;
  const trimmedId = identifier.trim();

  if (!trimmedId || !password) {
    return {
      success: false,
      error: 'অনুগ্রহ করে আপনার Gmail বা মোবাইল নম্বর এবং পাসওয়ার্ড লিখুন।'
    };
  }

  // Admin accounts must always authenticate through the dedicated AdminAuthBarrier
  if (isReservedAdminIdentifier(trimmedId)) {
    return {
      success: false,
      requiresAdminBarrier: true,
      error: 'অ্যাডমিন অ্যাকাউন্টের জন্য নিরাপদ অ্যাডমিন পোর্টাল ব্যবহার করুন।'
    };
  }

  const parsed = parseAuthIdentifier(trimmedId);
  const lookupKey = parsed.valid ? parsed.normalizedValue : trimmedId;
  const matched = store.findUserByPhoneOrEmail(lookupKey);

  if (!matched) {
    // Also check if user exists directly in Firebase Auth but not synced yet locally
    if (parsed.valid) {
      try {
        await signInWithEmailAndPassword(auth, parsed.firebaseAuthEmail, password);
      } catch {
        // Ignore error and show standard not-found message
      }
    }
    return {
      success: false,
      error: 'এই মোবাইল নম্বর বা Gmail-এ কোনো অ্যাকাউন্ট পাওয়া যায়নি। সঠিক তথ্য দিন অথবা নতুন অ্যাকাউন্ট খুলুন।'
    };
  }

  if (matched.role === 'admin') {
    return {
      success: false,
      requiresAdminBarrier: true,
      error: 'অ্যাডমিন অ্যাকাউন্টে প্রবেশের জন্য অ্যাডমিন ভেরিফিকেশন প্রয়োজন।'
    };
  }

  if (matched.status === 'suspended') {
    return {
      success: false,
      error: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। সহায়তার জন্য TutorHat সাপোর্টে যোগাযোগ করুন।'
    };
  }

  const authEmail = matched.authEmail || (parsed.valid ? parsed.firebaseAuthEmail : '');
  let verifiedViaFirebase = false;

  if (authEmail) {
    try {
      const cred = await signInWithEmailAndPassword(auth, authEmail, password);
      verifiedViaFirebase = true;
      // Opportunistically upgrade legacy/unsynced user hash & UID
      if (!matched.firebaseAuthSynced || !matched.firebaseUid) {
        const nextSalt = matched.passwordSalt || generateSalt();
        const nextHash = await hashPasswordSecure(password, nextSalt);
        store.updateUser(matched.id, {
          firebaseUid: cred.user.uid,
          authEmail,
          firebaseAuthSynced: true,
          authProvider: parsed.kind === 'email' ? 'firebase_email' : 'firebase_phone_mapped',
          passwordSalt: nextSalt,
          passwordHash: nextHash
        });
      }
    } catch (fbErr: any) {
      const code = fbErr?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        // If synced to Firebase Auth, Firebase is authoritative unless user reset locally; verify salted hash too
        const localOk = await verifyPasswordSecure(password, matched.passwordHash, matched.passwordSalt);
        if (!localOk) {
          return {
            success: false,
            error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন অথবা "Forgot Password?" ব্যবহার করুন।'
          };
        }
      } else if (code === 'auth/user-not-found' && matched.passwordHash) {
        // User registered while Firebase Console Email/Password was disabled; try enrolling now if password matches local salted hash
        const localOk = await verifyPasswordSecure(password, matched.passwordHash, matched.passwordSalt);
        if (!localOk) {
          return {
            success: false,
            error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন অথবা "Forgot Password?" ব্যবহার করুন।'
          };
        }
        try {
          const enrollCred = await createUserWithEmailAndPassword(auth, authEmail, password);
          verifiedViaFirebase = true;
          store.updateUser(matched.id, {
            firebaseUid: enrollCred.user.uid,
            authEmail,
            firebaseAuthSynced: true,
            authProvider: parsed.kind === 'email' ? 'firebase_email' : 'firebase_phone_mapped'
          });
        } catch {
          // Still pending Firebase Console activation; fallback to verified local salted hash
        }
      }
    }
  }

  if (!verifiedViaFirebase) {
    const localVerified = await verifyPasswordSecure(password, matched.passwordHash, matched.passwordSalt);
    if (!localVerified) {
      return {
        success: false,
        error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন অথবা "Forgot Password?" ব্যবহার করুন।'
      };
    }

    // Upgrade legacy plaintext user record to salted PBKDF2 hash transparently on successful login
    if (matched.passwordHash && !matched.passwordSalt) {
      const newSalt = generateSalt();
      const newHash = await hashPasswordSecure(password, newSalt);
      store.updateUser(matched.id, {
        passwordSalt: newSalt,
        passwordHash: newHash,
        authEmail: authEmail || undefined
      });
    }
  }

  store.updateUser(matched.id, { lastActiveAt: new Date().toISOString() });
  return {
    success: true,
    user: store.getUserById(matched.id) || matched
  };
}

/**
 * Signs out Firebase Auth user on public user logout (never affects separate AdminAuthBarrier session rules unless desired).
 */
export async function signOutFirebaseUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch {}
}

/**
 * Real Firebase Password Reset Flow via registered Gmail address (no insecure on-screen OTP bypass).
 */
export async function sendForgotPasswordReset(identifier: string): Promise<{
  success: boolean;
  message: string;
}> {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return {
      success: false,
      message: 'অনুগ্রহ করে আপনার নিবন্ধিত Gmail অথবা মোবাইল নম্বর লিখুন।'
    };
  }

  if (isReservedAdminIdentifier(trimmed)) {
    return {
      success: false,
      message: 'অ্যাডমিন পাসওয়ার্ড রিসেট করার জন্য অ্যাডমিন প্যানেলের "Forgot Password" ব্যবহার করুন।'
    };
  }

  const parsed = parseAuthIdentifier(trimmed);
  const lookup = parsed.valid ? parsed.normalizedValue : trimmed;
  const user = store.findUserByPhoneOrEmail(lookup);

  if (!user) {
    return {
      success: false,
      message: 'এই তথ্য দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি। সঠিক Gmail বা মোবাইল নম্বর লিখুন।'
    };
  }

  const realEmail =
    user.email && isEmailIdentifier(user.email) && !user.email.endsWith('@tutorhat.user') && !user.email.endsWith('@phone.tutorhat.app')
      ? user.email
      : parsed.kind === 'email'
      ? parsed.normalizedValue
      : '';

  if (!realEmail) {
    return {
      success: false,
      message:
        'এই অ্যাকাউন্টটি শুধু মোবাইল নম্বর দিয়ে তৈরি এবং প্রোফাইলে কোনো Gmail যুক্ত নেই। সহায়তার জন্য TutorHat হেল্পলাইন WhatsApp (01752617360)-এ যোগাযোগ করুন।'
    };
  }

  try {
    await sendPasswordResetEmail(auth, realEmail);
    return {
      success: true,
      message: `${realEmail} ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। আপনার ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`
    };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/operation-not-allowed') {
      return {
        success: false,
        message:
          'Firebase Console-এ Email/Password Sign-in সক্রিয় না থাকায় স্বয়ংক্রিয় রিসেট ইমেইল পাঠানো যায়নি। দ্রুত সহায়তার জন্য WhatsApp (01752617360)-এ যোগাযোগ করুন।'
      };
    }
    if (code === 'auth/user-not-found') {
      return {
        success: false,
        message:
          'এই ইমেইলটি এখনো Firebase Auth-এ সিঙ্ক হয়নি। অনুগ্রহ করে WhatsApp (01752617360)-এ যোগাযোগ করে পাসওয়ার্ড রিসেট সহায়তা নিন।'
      };
    }
    return {
      success: false,
      message: 'পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন অথবা 01752617360 নম্বরে যোগাযোগ করুন।'
    };
  }
}

// ============================================================================
// Remember Me Saved Accounts (Stores identifier + role + label ONLY — NEVER passwords!)
// ============================================================================

export function getSavedAccounts(): SavedAccountRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedAccountRecord =>
        Boolean(item && typeof item.identifier === 'string' && (item.role === 'guardian' || item.role === 'tutor'))
    );
  } catch {
    return [];
  }
}

export function saveRememberedAccount(account: Omit<SavedAccountRecord, 'lastUsedAt'>): SavedAccountRecord[] {
  if (typeof window === 'undefined') return [];
  const existing = getSavedAccounts();
  const normalizedTarget = account.identifier.trim().toLowerCase();
  const filtered = existing.filter(a => a.identifier.trim().toLowerCase() !== normalizedTarget);

  // Explicit strict whitelist so password/hash fields can NEVER be persisted
  const cleanRecord: SavedAccountRecord = {
    identifier: account.identifier.trim(),
    displayLabel: account.displayLabel.trim() || account.identifier.trim(),
    role: account.role,
    lastUsedAt: new Date().toISOString()
  };

  const nextList = [cleanRecord, ...filtered].slice(0, 5);
  try {
    localStorage.setItem(SAVED_ACCOUNTS_STORAGE_KEY, JSON.stringify(nextList));
  } catch {}
  return nextList;
}

export function removeSavedAccount(identifier: string): SavedAccountRecord[] {
  if (typeof window === 'undefined') return [];
  const normalizedTarget = identifier.trim().toLowerCase();
  const nextList = getSavedAccounts().filter(a => a.identifier.trim().toLowerCase() !== normalizedTarget);
  try {
    localStorage.setItem(SAVED_ACCOUNTS_STORAGE_KEY, JSON.stringify(nextList));
  } catch {}
  return nextList;
}
