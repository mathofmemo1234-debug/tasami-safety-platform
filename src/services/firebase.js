import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { content as defaultContent } from '../data/content';

// Production Firebase Configuration for Tasami Safety
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCi7lQcEeQoFYblDzJoJxCY2MEoBw_-ORo",
  authDomain: "tasami-safety.firebaseapp.com",
  projectId: "tasami-safety",
  storageBucket: "tasami-safety.firebasestorage.app",
  messagingSenderId: "366296145350",
  appId: "1:366296145350:web:c1139eb2cf501259e926c7",
  measurementId: "G-W4DBYJL2QC"
};

// Check if custom config exists in localStorage
export function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem('tasami_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading saved firebase config:', err);
  }
  return FIREBASE_CONFIG;
}

export function saveActiveFirebaseConfig(cfg) {
  try {
    localStorage.setItem('tasami_firebase_config', JSON.stringify(cfg));
  } catch (err) {
    console.error('Error saving firebase config:', err);
  }
}

// Singleton instances
let app = null;
let db = null;
let storage = null;

try {
  const cfg = getActiveFirebaseConfig();
  if (!getApps().length) {
    app = initializeApp(cfg);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.error('Firebase init error:', err);
}

export { app, db, storage };

// Safe deep merge helper ensuring default structure and array safety
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;

  const output = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (srcVal === null || srcVal === undefined) {
      continue;
    }

    if (Array.isArray(srcVal)) {
      output[key] = srcVal;
    } else if (typeof srcVal === 'object' && typeof tgtVal === 'object' && !Array.isArray(tgtVal)) {
      output[key] = deepMerge(tgtVal, srcVal);
    } else {
      output[key] = srcVal;
    }
  }

  return output;
}

// Real-time synchronization of all website components
export function subscribeToLiveContent(onUpdate) {
  if (!db) {
    onUpdate(defaultContent);
    return () => {};
  }

  try {
    const docRef = doc(db, 'site_content', 'main');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const merged = {
          ar: deepMerge(defaultContent.ar, data.ar || {}),
          en: deepMerge(defaultContent.en, data.en || {})
        };
        onUpdate(merged);
      } else {
        // Automatically seed existing content into Firebase on initial run
        setDoc(docRef, defaultContent, { merge: true }).catch((err) => {
          console.warn('Initial seed to Firestore note (check rules):', err.message);
        });
        onUpdate(defaultContent);
      }
    }, (error) => {
      console.warn('Firestore real-time sync using local fallback:', error.message);
      // Try local storage cache
      try {
        const cached = localStorage.getItem('tasami_live_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          const merged = {
            ar: deepMerge(defaultContent.ar, parsed.ar || {}),
            en: deepMerge(defaultContent.en, parsed.en || {})
          };
          onUpdate(merged);
          return;
        }
      } catch {}
      onUpdate(defaultContent);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Live content sync error:', err);
    onUpdate(defaultContent);
    return () => {};
  }
}

// Save complete or modified content to Firestore & localStorage
export async function saveLiveContent(updatedContent) {
  // Always cache locally so changes are visible instantly
  try {
    localStorage.setItem('tasami_live_content', JSON.stringify(updatedContent));
  } catch {}

  if (!db) {
    return { success: true, localOnly: true, message: 'تم الحفظ محلياً بنجاح (قاعدة البيانات غير مهيأة)' };
  }

  try {
    const docRef = doc(db, 'site_content', 'main');
    await setDoc(docRef, updatedContent, { merge: true });
    return { success: true, message: 'تم حفظ ومزامنة التعديلات مع Firebase بنجاح!' };
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    return { success: false, error: err.message };
  }
}

// Upload images to Firebase Storage with Base64 fallback
export async function uploadMediaFile(file, path = 'site_images') {
  if (!file) return { success: false, error: 'الملف غير صالح' };

  if (storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fullPath = `${path}/${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, fullPath);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return { success: true, url };
    } catch (err) {
      console.warn('Firebase Storage upload failed, using Data URL fallback:', err);
    }
  }

  // Base64 fallback allows adding images even if Storage rules are pending
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ success: true, url: reader.result });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'تعذر قراءة ملف الصورة' });
    };
    reader.readAsDataURL(file);
  });
}

// Admin Authentication (Default password '1234' with concealed check)
export async function checkAdminPassword(enteredPassword) {
  const localPass = localStorage.getItem('tasami_admin_pin') || '1234';

  if (!db) {
    return enteredPassword === localPass;
  }

  try {
    const authRef = doc(db, 'admin_settings', 'credentials');
    const snap = await getDoc(authRef);
    if (snap.exists() && snap.data().pin) {
      return enteredPassword === snap.data().pin;
    } else {
      // Seed default pin
      await setDoc(authRef, { pin: '1234', updatedAt: new Date().toISOString() }, { merge: true });
      return enteredPassword === '1234';
    }
  } catch (e) {
    return enteredPassword === localPass;
  }
}

export async function updateAdminPassword(newPassword) {
  try {
    localStorage.setItem('tasami_admin_pin', newPassword);
  } catch {}

  if (!db) return { success: true };

  try {
    const authRef = doc(db, 'admin_settings', 'credentials');
    await setDoc(authRef, { pin: newPassword, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: true, warning: err.message };
  }
}
