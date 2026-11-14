import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';

const CLIENT_STORAGE_KEY = 'tasami_client_user';

/**
 * Normalizes Saudi mobile numbers to standard local (05XXXXXXXX) and international formats.
 */
export function normalizeSaudiPhone(raw) {
  if (!raw) return { local: '', international: '', isValid: false };
  let cleaned = String(raw).trim().replace(/[\s\-\(\)]/g, '');

  // Strip international prefixes (+966, 00966, 966)
  if (cleaned.startsWith('+966')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('00966')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.startsWith('966')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (/^5\d{8}$/.test(cleaned)) {
    cleaned = '0' + cleaned;
  }

  // Standard Saudi mobile is 10 digits starting with 05
  const isSaudi = /^05\d{8}$/.test(cleaned);
  // General fallback for non-Saudi numbers (e.g. international format)
  const isGeneralPhone = /^\+?\d{8,15}$/.test(raw.trim().replace(/[\s\-]/g, ''));

  const international = isSaudi ? `+966${cleaned.slice(1)}` : raw.trim();

  return {
    local: cleaned,
    international,
    isValid: isSaudi || isGeneralPhone,
    isSaudi
  };
}

/**
 * Validates email format.
 */
export function isEmail(val) {
  if (!val) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
}

/**
 * Synthesizes an internal email for phone-based accounts in Firebase Auth.
 */
export function synthesizePhoneEmail(cleanPhone) {
  const digits = cleanPhone.replace(/\D/g, '');
  return `phone_${digits}@tasami-client.app`;
}

/**
 * Reads local cached user from localStorage.
 */
export function getLocalUser() {
  try {
    const raw = localStorage.getItem(CLIENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading local user:', err);
    return null;
  }
}

/**
 * Saves user profile to localStorage and notifies active listeners.
 */
export function saveLocalUser(userObj) {
  try {
    if (userObj) {
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(CLIENT_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('tasami-auth-changed', { detail: userObj }));
  } catch (err) {
    console.warn('Error saving local user:', err);
  }
}

/**
 * Fetches user profile from Firestore by UID.
 */
export async function fetchUserProfile(uid) {
  if (!db || !uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('Could not fetch user profile from Firestore:', err);
  }
  return null;
}

/**
 * Registers a new visitor using either Mobile Number or Email with Password.
 */
export async function registerVisitor({
  name,
  identifier,
  identifierType = 'phone', // 'phone' | 'email'
  password,
  company = ''
}) {
  const cleanName = String(name || '').trim();
  const cleanPassword = String(password || '');

  if (!cleanName || cleanName.length < 2) {
    throw new Error('يرجى إدخال الاسم الكريم بشكل صحيح (حرفين على الأقل).');
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    throw new Error('كلمة المرور يجب أن تتكون من 6 خانات أو رموز على الأقل.');
  }

  let authEmail = '';
  let storedEmail = '';
  let storedPhone = '';
  let storedPhoneIntl = '';

  if (identifierType === 'phone') {
    const phoneObj = normalizeSaudiPhone(identifier);
    if (!phoneObj.isValid) {
      throw new Error('يرجى إدخال رقم جوال صالح (مثال: 05XXXXXXXX أو +9665XXXXXXXX).');
    }
    storedPhone = phoneObj.local;
    storedPhoneIntl = phoneObj.international;
    authEmail = synthesizePhoneEmail(phoneObj.local);
  } else {
    const cleanMail = String(identifier || '').trim().toLowerCase();
    if (!isEmail(cleanMail)) {
      throw new Error('يرجى إدخال عنوان بريد إلكتروني صحيح (مثال: info@example.com).');
    }
    storedEmail = cleanMail;
    authEmail = cleanMail;
  }

  if (!auth) {
    // Offline / Local fallback simulation if Firebase not initialized
    const fallbackUser = {
      uid: `local_${Date.now()}`,
      name: cleanName,
      email: storedEmail,
      phone: storedPhone,
      phoneInternational: storedPhoneIntl,
      company: company.trim(),
      identifierType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveLocalUser(fallbackUser);
    return fallbackUser;
  }

  try {
    // 1. Create account with Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, authEmail, cleanPassword);
    const fbUser = cred.user;

    // 2. Set Firebase Auth display name
    try {
      await updateProfile(fbUser, { displayName: cleanName });
    } catch {}

    // 3. Build user document profile
    const profileData = {
      uid: fbUser.uid,
      name: cleanName,
      email: storedEmail,
      phone: storedPhone,
      phoneInternational: storedPhoneIntl,
      company: company.trim(),
      identifierType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 4. Save to Firestore `users/{uid}`
    if (db) {
      try {
        await setDoc(doc(db, 'users', fbUser.uid), profileData, { merge: true });
      } catch (firestoreErr) {
        console.warn('Firestore user save warning (fallback to local):', firestoreErr);
      }
    }

    // 5. Save local session
    saveLocalUser(profileData);
    return profileData;
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'auth/email-already-in-use') {
      throw new Error(
        identifierType === 'phone'
          ? 'رقم الجوال هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
          : 'البريد الإلكتروني هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
      );
    }
    if (err.code === 'auth/weak-password') {
      throw new Error('كلمة المرور ضعيفة، يرجى إدخال 6 أحرف أو أرقام على الأقل.');
    }
    if (err.code === 'auth/invalid-email') {
      throw new Error('صيغة الإيميل أو الجوال غير مقبولة.');
    }
    throw new Error(err.message || 'تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.');
  }
}

/**
 * Logs in a visitor using either their Email or Mobile Number with Password.
 */
export async function loginVisitor({ identifier, password }) {
  const rawId = String(identifier || '').trim();
  const cleanPassword = String(password || '');

  if (!rawId) {
    throw new Error('يرجى إدخال رقم الجوال أو البريد الإلكتروني.');
  }
  if (!cleanPassword) {
    throw new Error('يرجى إدخال كلمة المرور.');
  }

  let authEmail = '';
  const looksLikeEmail = rawId.includes('@');

  if (looksLikeEmail) {
    authEmail = rawId.toLowerCase();
  } else {
    // Treat as phone number
    const phoneObj = normalizeSaudiPhone(rawId);
    authEmail = synthesizePhoneEmail(phoneObj.local || rawId);
  }

  if (!auth) {
    const cached = getLocalUser();
    if (cached) return cached;
    throw new Error('خدمة المصادقة غير متاحة حالياً.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, authEmail, cleanPassword);
    const fbUser = cred.user;

    // Fetch user profile from Firestore
    let profile = await fetchUserProfile(fbUser.uid);

    if (!profile) {
      // Reconstruct basic profile if Firestore record was missing
      const isPhoneAccount = fbUser.email && fbUser.email.endsWith('@tasami-client.app');
      profile = {
        uid: fbUser.uid,
        name: fbUser.displayName || (looksLikeEmail ? rawId.split('@')[0] : rawId),
        email: isPhoneAccount ? '' : fbUser.email || '',
        phone: isPhoneAccount ? rawId : '',
        identifierType: isPhoneAccount ? 'phone' : 'email',
        createdAt: new Date().toISOString()
      };
      if (db) {
        setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true }).catch(() => {});
      }
    }

    saveLocalUser(profile);
    return profile;
  } catch (err) {
    console.error('Login error:', err);
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من رقم الجوال أو البريد وكلمة المرور.');
    }
    if (err.code === 'auth/too-many-requests') {
      throw new Error('تم قفل المحاولات مؤقتاً لتكرار المحاولات الخاطئة. الرجاء الانتظار دقيقة.');
    }
    throw new Error(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
  }
}

/**
 * Updates visitor profile information (name, company, phone, email).
 */
export async function updateVisitorProfile(uid, updates = {}) {
  if (!uid) throw new Error('معرف المستخدم مفقود');
  const current = getLocalUser() || {};
  const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };

  if (db) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not update Firestore profile:', err);
    }
  }

  if (auth && auth.currentUser && updates.name) {
    try {
      await updateProfile(auth.currentUser, { displayName: updates.name });
    } catch {}
  }

  saveLocalUser(merged);
  return merged;
}

/**
 * Signs out the current visitor.
 */
export async function logoutVisitor() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout warning:', err);
    }
  }
  saveLocalUser(null);
}

/**
 * Subscribes to real-time auth state changes.
 */
export function subscribeToVisitorAuth(callback) {
  // 1. Immediately notify with localStorage cached profile for zero-latency UI
  const initial = getLocalUser();
  callback(initial);

  // 2. Listen to custom in-window events
  const handleCustom = (e) => {
    callback(e.detail || null);
  };
  window.addEventListener('tasami-auth-changed', handleCustom);
  window.addEventListener('storage', handleCustom);

  // 3. Listen to Firebase Auth state
  let unsubFb = () => {};
  if (auth) {
    try {
      unsubFb = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const profile = await fetchUserProfile(fbUser.uid);
          if (profile) {
            saveLocalUser(profile);
            callback(profile);
          } else {
            const current = getLocalUser();
            if (current && current.uid === fbUser.uid) {
              callback(current);
            }
          }
        } else {
          // Firebase reports no user
          const current = getLocalUser();
          if (current && !current.uid.startsWith('local_')) {
            saveLocalUser(null);
            callback(null);
          }
        }
      });
    } catch (err) {
      console.warn('Auth state subscription warning:', err);
    }
  }

  return () => {
    window.removeEventListener('tasami-auth-changed', handleCustom);
    window.removeEventListener('storage', handleCustom);
    unsubFb();
  };
}
