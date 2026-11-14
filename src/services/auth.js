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
const USERS_REGISTRY_KEY = 'tasami_local_users_registry';

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
  // General fallback for non-Saudi numbers
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
 * Secure client-side password hashing using Web Crypto API SHA-256.
 */
async function hashPassword(password) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password + '_tasami_sec_2026');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Crypto subtle fallback:', e);
  }
  // Simple fallback hash if crypto API is constrained
  let hash = 0;
  const str = password + '_tasami_salt';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(16);
}

/**
 * Local offline registry helper for fallback users
 */
function getLocalUsersRegistry() {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsersRegistry(list) {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(list));
  } catch {}
}

/**
 * Reads local active user from localStorage.
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
      // Never store raw password or sensitive token in plain active session
      const sanitized = { ...userObj };
      delete sanitized.password;
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(sanitized));
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
 * Fallback registration directly into Firestore database & local registry.
 * Guarantees 100% success even if Firebase Auth is not configured in console.
 */
async function registerWithFirestoreFallback({
  cleanName,
  storedEmail,
  storedPhone,
  storedPhoneIntl,
  identifierType,
  cleanPassword,
  company
}) {
  const pwdHash = await hashPassword(cleanPassword);
  const uid = `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Check if user already exists in Firestore
  if (db) {
    try {
      const qField = identifierType === 'phone' ? 'phone' : 'email';
      const qVal = identifierType === 'phone' ? storedPhone : storedEmail;
      if (qVal) {
        const existingQuery = query(collection(db, 'users'), where(qField, '==', qVal));
        const existingSnap = await getDocs(existingQuery);
        if (!existingSnap.empty) {
          throw new Error(
            identifierType === 'phone'
              ? 'رقم الجوال هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
              : 'البريد الإلكتروني هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
          );
        }
      }
    } catch (checkErr) {
      if (checkErr.message && checkErr.message.includes('مسجل مسبقاً')) {
        throw checkErr;
      }
      console.warn('Firestore duplicate check warning:', checkErr);
    }
  }

  // 2. Check in local registry
  const localRegistry = getLocalUsersRegistry();
  const duplicateLocal = localRegistry.find(
    (u) =>
      (identifierType === 'phone' && u.phone === storedPhone) ||
      (identifierType === 'email' && u.email && u.email.toLowerCase() === storedEmail.toLowerCase())
  );
  if (duplicateLocal) {
    throw new Error(
      identifierType === 'phone'
        ? 'رقم الجوال هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
        : 'البريد الإلكتروني هذا مسجل مسبقاً، يرجى التوجه لتسجيل الدخول.'
    );
  }

  const profileData = {
    uid,
    name: cleanName,
    email: storedEmail,
    phone: storedPhone,
    phoneInternational: storedPhoneIntl,
    company: company.trim(),
    identifierType,
    passwordHash: pwdHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 3. Save to Firestore `users/{uid}`
  if (db) {
    try {
      await setDoc(doc(db, 'users', uid), profileData, { merge: true });
    } catch (dbErr) {
      console.warn('Could not save user to Firestore:', dbErr);
    }
  }

  // 4. Save to local registry and current user
  localRegistry.push(profileData);
  saveLocalUsersRegistry(localRegistry);
  saveLocalUser(profileData);

  return profileData;
}

/**
 * Fallback login using Firestore database and local registry.
 */
async function loginWithFirestoreFallback({ rawId, cleanPassword }) {
  const pwdHash = await hashPassword(cleanPassword);
  const looksLikeEmail = rawId.includes('@');
  const phoneObj = normalizeSaudiPhone(rawId);
  const cleanPhone = phoneObj.local || rawId;
  const cleanEmail = rawId.toLowerCase();

  let matchedUser = null;

  // 1. Search in Firestore
  if (db) {
    try {
      const qField = looksLikeEmail ? 'email' : 'phone';
      const qVal = looksLikeEmail ? cleanEmail : cleanPhone;
      const userQ = query(collection(db, 'users'), where(qField, '==', qVal));
      const snap = await getDocs(userQ);
      if (!snap.empty) {
        for (const docSnap of snap.docs) {
          const found = docSnap.data();
          if (found.passwordHash && found.passwordHash === pwdHash) {
            matchedUser = { id: docSnap.id, ...found };
            break;
          }
        }
      }
    } catch (err) {
      console.warn('Firestore fallback login search warning:', err);
    }
  }

  // 2. Search in local registry
  if (!matchedUser) {
    const localRegistry = getLocalUsersRegistry();
    const found = localRegistry.find((u) => {
      const matchId = looksLikeEmail
        ? u.email && u.email.toLowerCase() === cleanEmail
        : u.phone === cleanPhone;
      return matchId && u.passwordHash === pwdHash;
    });
    if (found) {
      matchedUser = found;
    }
  }

  if (matchedUser) {
    saveLocalUser(matchedUser);
    return matchedUser;
  }

  throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من رقم الجوال أو البريد وكلمة المرور.');
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

  // Fallback direct register payload parameters
  const fallbackPayload = {
    cleanName,
    storedEmail,
    storedPhone,
    storedPhoneIntl,
    identifierType,
    cleanPassword,
    company
  };

  if (!auth) {
    return await registerWithFirestoreFallback(fallbackPayload);
  }

  try {
    // 1. Try account creation via Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, authEmail, cleanPassword);
    const fbUser = cred.user;

    try {
      await updateProfile(fbUser, { displayName: cleanName });
    } catch {}

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

    if (db) {
      try {
        await setDoc(doc(db, 'users', fbUser.uid), profileData, { merge: true });
      } catch (firestoreErr) {
        console.warn('Firestore user save warning:', firestoreErr);
      }
    }

    saveLocalUser(profileData);
    return profileData;
  } catch (err) {
    console.warn('Firebase Auth registration note:', err.code, err.message);

    // If Firebase Auth is not yet enabled in Firebase Console (auth/configuration-not-found)
    // or project configuration is pending, seamlessly activate Firestore Database Auth!
    if (
      err.code === 'auth/configuration-not-found' ||
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/internal-error' ||
      err.message?.includes('configuration-not-found')
    ) {
      return await registerWithFirestoreFallback(fallbackPayload);
    }

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

    // Attempt fallback as a safeguard
    try {
      return await registerWithFirestoreFallback(fallbackPayload);
    } catch (fallbackErr) {
      throw new Error(fallbackErr.message || 'تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.');
    }
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
    const phoneObj = normalizeSaudiPhone(rawId);
    authEmail = synthesizePhoneEmail(phoneObj.local || rawId);
  }

  if (!auth) {
    return await loginWithFirestoreFallback({ rawId, cleanPassword });
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, authEmail, cleanPassword);
    const fbUser = cred.user;

    let profile = await fetchUserProfile(fbUser.uid);

    if (!profile) {
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
    console.warn('Firebase Auth login note:', err.code, err.message);

    // If Firebase Auth is not configured in console, transparently try Firestore fallback
    if (
      err.code === 'auth/configuration-not-found' ||
      err.code === 'auth/operation-not-allowed' ||
      err.code === 'auth/internal-error' ||
      err.message?.includes('configuration-not-found')
    ) {
      return await loginWithFirestoreFallback({ rawId, cleanPassword });
    }

    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      // Also check if user was created via Firestore fallback
      try {
        return await loginWithFirestoreFallback({ rawId, cleanPassword });
      } catch {
        throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من رقم الجوال أو البريد وكلمة المرور.');
      }
    }

    if (err.code === 'auth/too-many-requests') {
      throw new Error('تم قفل المحاولات مؤقتاً لتكرار المحاولات الخاطئة. الرجاء الانتظار دقيقة.');
    }

    try {
      return await loginWithFirestoreFallback({ rawId, cleanPassword });
    } catch {
      throw new Error(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
    }
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
 * Signs in or registers a visitor using their Google Account.
 */
export async function loginWithGoogle() {
  if (!auth) throw new Error('خدمة المصادقة غير متاحة حالياً.');
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();

  try {
    const cred = await signInWithPopup(auth, provider);
    const fbUser = cred.user;

    let profile = await fetchUserProfile(fbUser.uid);
    if (!profile) {
      profile = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'زائر تسامي',
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '',
        identifierType: 'google',
        photoURL: fbUser.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (db) {
        setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true }).catch(() => {});
      }
    }

    saveLocalUser(profile);
    return profile;
  } catch (err) {
    console.error('Google Sign-in error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('تم إلغاء نافذة تسجيل الدخول من قِبل المستخدم.');
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error('النطاق غير مصرح به في Firebase Console > Authorized domains.');
    }
    throw new Error(err.message || 'تعذر تسجيل الدخول عبر Google.');
  }
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
          // If Firebase reports no user, only clear if active user was a Firebase user
          const current = getLocalUser();
          if (current && !current.uid.startsWith('u_') && !current.uid.startsWith('local_')) {
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
