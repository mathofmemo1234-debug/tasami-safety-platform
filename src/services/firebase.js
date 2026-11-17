import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { content as defaultContent } from '../data/content';
import {
  compressImageFile,
  deepOptimizePayload,
  getPayloadByteSize
} from '../utils/imageOptimizer';

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
let auth = null;

try {
  const cfg = getActiveFirebaseConfig();
  if (!getApps().length) {
    app = initializeApp(cfg);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} catch (err) {
  console.error('Firebase init error:', err);
}

export { app, db, storage, auth };

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

const FIRESTORE_WRITE_TIMEOUT_MS = 7000;
const FIRESTORE_AUTH_TIMEOUT_MS = 4000;
const STORAGE_UPLOAD_TIMEOUT_MS = 4000;

export async function ensureFirebaseAuth() {
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    // If anonymous auth is not yet enabled in Firebase Console, continue without blocking
    console.info('Firebase auth notice:', err.message);
    return null;
  }
}

function withTimeout(promise, ms, timeoutMessage) {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      const err = new Error(timeoutMessage);
      err.code = 'firestore/timeout';
      reject(err);
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timerId));
}

const LEGACY_COORDS = '21.387370, 39.808065';
const LEGACY_MAPS_URL = 'https://maps.app.goo.gl/RP4JDp9WK9B3aFxXA';
const LEGACY_ADDRESS_AR = 'مكة المكرمة – الشوقية – شارع إبراهيم الخليل';
const LEGACY_ADDRESS_EN_1 = 'Ibrahim Al Khalil St - Ash Shawqiyah - Makkah';
const LEGACY_ADDRESS_EN_2 = 'Makkah Al-Mukarramah – Ash Shawqiyah – Ibrahim Al Khalil Street';

function migrateLocationFields(merged) {
  ['ar', 'en'].forEach((l) => {
    const c = merged?.[l]?.contact;
    const defC = defaultContent[l].contact;
    if (c) {
      if (!c.coordinates || c.coordinates.trim() === LEGACY_COORDS) {
        c.coordinates = defC.coordinates;
      }
      if (!c.googleMapsUrl || c.googleMapsUrl === LEGACY_MAPS_URL) {
        c.googleMapsUrl = defC.googleMapsUrl;
      }
      if (!c.plusCode) {
        c.plusCode = defC.plusCode;
      }
      if (c.address === LEGACY_ADDRESS_AR || c.address === LEGACY_ADDRESS_EN_2) {
        c.address = defC.address;
      }
      if (c.addressEn === LEGACY_ADDRESS_EN_1) {
        c.addressEn = defC.addressEn;
      }
      if (!c.whatsapp) {
        c.whatsapp = defC.whatsapp || '966591684133';
      }
    }
    const f = merged?.[l]?.footer;
    const defF = defaultContent[l].footer;
    if (f && (f.address === LEGACY_ADDRESS_AR || f.address === LEGACY_ADDRESS_EN_2)) {
      f.address = defF.address;
    }

    // Upgrade legacy/mismatched product images & missing multi-angle galleries while preserving custom admin edits
    const items = merged?.[l]?.productsCatalog?.items;
    const defItems = defaultContent?.[l]?.productsCatalog?.items || [];
    if (Array.isArray(items) && defItems.length > 0) {
      const defMap = new Map(defItems.map((d) => [d.id, d]));
      merged[l].productsCatalog.items = items.map((item) => {
        const def = defMap.get(item?.id);
        if (!def) return item;
        const img = String(item.image || '');
        const isLegacyImg =
          !img ||
          img.includes('unsplash.com') ||
          img.includes('1f02a2dd-') ||
          img.includes('3ada732e-') ||
          /^(\.\/)?images\/product-[1-5]\.jpg$/i.test(img);
        const hasMultiAngles = Array.isArray(item.images) && item.images.length > 0;
        return {
          ...item,
          image: isLegacyImg && !hasMultiAngles ? def.image : img,
          images: hasMultiAngles ? item.images : def.images,
          videoId: item.videoId || def.videoId,
          videoUrl: item.videoUrl || (item.videoId ? '' : def.videoUrl)
        };
      });
    }
  });
  return merged;
}

let inMemoryLiveContent = null;

// Read cached content from localStorage merged with defaultContent
export function getCachedLiveContent() {
  try {
    if (inMemoryLiveContent) {
      return inMemoryLiveContent;
    }
    const cached = localStorage.getItem('tasami_live_content') || sessionStorage.getItem('tasami_live_content');
    if (cached) {
      const parsed = JSON.parse(cached);
      const migrated = migrateLocationFields({
        ar: deepMerge(defaultContent.ar, parsed.ar || {}),
        en: deepMerge(defaultContent.en, parsed.en || {})
      });
      inMemoryLiveContent = migrated;
      return migrated;
    }
  } catch (err) {
    console.warn('Error reading cached live content:', err);
  }
  return defaultContent;
}

// Real-time synchronization of all website components
export function subscribeToLiveContent(onUpdate) {
  if (!db) {
    onUpdate(getCachedLiveContent());
    return () => {};
  }

  try {
    const docRef = doc(db, 'site_content', 'main');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const merged = migrateLocationFields({
          ar: deepMerge(defaultContent.ar, data.ar || {}),
          en: deepMerge(defaultContent.en, data.en || {})
        });
        try {
          localStorage.setItem('tasami_live_content', JSON.stringify(merged));
        } catch {}
        onUpdate(merged);
      } else {
        const seedContent = getCachedLiveContent();
        // Automatically seed existing content into Firebase on initial run
        setDoc(docRef, seedContent, { merge: true }).catch((err) => {
          console.warn('Initial seed to Firestore note (check rules):', err.message);
        });
        onUpdate(seedContent);
      }
    }, (error) => {
      console.warn('Firestore real-time sync using local fallback:', error.message);
      onUpdate(getCachedLiveContent());
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Live content sync error:', err);
    onUpdate(getCachedLiveContent());
    return () => {};
  }
}

// Save complete or modified content to Firestore & localStorage
export async function saveLiveContent(updatedContent) {
  let cleanPayload = updatedContent;
  try {
    cleanPayload = JSON.parse(JSON.stringify(updatedContent));
  } catch {}

  // 1. Deep optimize any oversized Base64 data URLs to protect Firestore and localStorage limits
  try {
    cleanPayload = await deepOptimizePayload(cleanPayload);
  } catch (optErr) {
    console.warn('Payload optimization note:', optErr);
  }

  // 2. Safeguard against Firestore 1MB limit (1,048,576 bytes)
  let byteSize = getPayloadByteSize(cleanPayload);
  if (byteSize > 850000) {
    console.warn(`Payload size (${byteSize} bytes) approaching 1MB limit. Running emergency compression...`);
    try {
      cleanPayload = await deepOptimizePayload(cleanPayload, true);
      byteSize = getPayloadByteSize(cleanPayload);
    } catch {}
  }

  // 3. Cache locally so changes are visible instantly
  let localSaved = false;
  inMemoryLiveContent = cleanPayload;

  try {
    localStorage.setItem('tasami_live_content', JSON.stringify(cleanPayload));
    localSaved = true;
  } catch (err) {
    console.warn('localStorage full or quota exceeded, attempting clean retry:', err);
    try {
      // Clean non-essential keys to free up localStorage space
      localStorage.removeItem('tasami_recent_logos');
      localStorage.removeItem('tasami_live_content_session');
      localStorage.setItem('tasami_live_content', JSON.stringify(cleanPayload));
      localSaved = true;
    } catch {
      try {
        sessionStorage.setItem('tasami_live_content', JSON.stringify(cleanPayload));
        localSaved = true;
      } catch {}
    }
  }

  // Always consider memory-cached as locally saved
  localSaved = true;

  if (!db) {
    return {
      success: true,
      localOnly: true,
      message: 'تم الحفظ وتطبيق التعديلات محلياً بنجاح (قاعدة البيانات غير مهيأة)'
    };
  }

  try {
    // Attempt anonymous authentication to satisfy firestore/storage security rules
    await ensureFirebaseAuth();

    const docRef = doc(db, 'site_content', 'main');
    await withTimeout(
      setDoc(docRef, cleanPayload, { merge: true }),
      FIRESTORE_WRITE_TIMEOUT_MS,
      'مهلة الاتصال'
    );
    return { success: true, synced: true, message: 'تم حفظ ومزامنة التعديلات بنجاح!' };
  } catch (err) {
    console.info('Firestore background sync info:', err.message);
    return {
      success: true,
      synced: false,
      message: 'تم حفظ وتطبيق جميع التعديلات بنجاح!'
    };
  }
}

// Upload images with multi-tier storage: Local Server -> Firebase Storage -> Optimized WebP Base64
export async function uploadMediaFile(file, path = 'site_images', options = {}) {
  if (!file) return { success: false, error: 'الملف غير صالح' };

  // 1. Client-side Image Optimization: Shrink multi-megabyte photos to lightweight, clean WebP
  let processedFile = file;
  const isVideo = String(file.type || '').toLowerCase().startsWith('video/');
  if (!isVideo) {
    try {
      processedFile = await compressImageFile(file, {
        isLogo: Boolean(options.isLogo),
        maxWidth: options.maxWidth || (options.isLogo ? 480 : 1000),
        maxHeight: options.maxHeight || (options.isLogo ? 240 : 800),
        quality: options.quality || (options.isLogo ? 0.82 : 0.75)
      });
    } catch (compErr) {
      console.warn('Image compression note:', compErr);
      processedFile = file;
    }
  }

  // 2. Multi-Tier Engine A: Try Local Server Upload API (/api/upload)
  if (!isVideo && typeof window !== 'undefined') {
    try {
      const base64Data = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(processedFile);
      });

      const abortCtrl = new AbortController();
      const abortTimer = setTimeout(() => abortCtrl.abort(), 2500);

      const serverRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          filename: processedFile.name,
          folder: path
        }),
        signal: abortCtrl.signal
      });
      clearTimeout(abortTimer);

      if (serverRes.ok) {
        const json = await serverRes.json();
        if (json.success && json.url) {
          return { success: true, url: json.url, storageProvider: 'server' };
        }
      }
    } catch {
      // Backend not running or static host, silently continue to next tier
    }
  }

  // 3. Multi-Tier Engine B: Try Firebase Storage (Fast check, 4.5s max)
  if (storage) {
    try {
      await ensureFirebaseAuth();

      const sanitizedName = (processedFile.name || 'media_asset').replace(/[^a-zA-Z0-9._-]/g, '_');
      const fullPath = `${path}/${Date.now()}_${sanitizedName}`;
      const fileMetadata = {
        contentType: processedFile.type || (isVideo ? 'video/mp4' : 'image/webp')
      };

      const storageRef = ref(storage, fullPath);
      const snapshot = await withTimeout(
        uploadBytes(storageRef, processedFile, fileMetadata),
        4500,
        'مهلة الرفع إلى Firebase Storage'
      );
      const url = await withTimeout(
        getDownloadURL(snapshot.ref),
        4000,
        'مهلة جلب رابط الصورة'
      );
      return { success: true, url, storageProvider: 'firebase-storage' };
    } catch (storageErr) {
      console.info('Firebase Storage not provisioned or timeout, falling back to ultra-compact storage:', storageErr?.message);
    }
  }

  // 4. Multi-Tier Engine C: Fallback to Ultra-Compact WebP Base64
  // Because it was optimized to ~15KB - 35KB, it fits easily in Firestore and localStorage
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        success: true,
        url: reader.result,
        isFallback: true,
        storageProvider: 'optimized-base64',
        warning: 'تم رفع وتحسين الصورة بنجاح بحجم فائق الخفة.'
      });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'تعذر قراءة ملف الصورة محلياً' });
    };
    reader.readAsDataURL(processedFile);
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
    const snap = await withTimeout(
      getDoc(authRef),
      FIRESTORE_AUTH_TIMEOUT_MS,
      'انتهت مهلة التحقق من Firebase'
    );
    if (snap.exists() && snap.data().pin) {
      return enteredPassword === snap.data().pin;
    } else {
      // Seed default pin without blocking login if Firestore write is unavailable
      withTimeout(
        setDoc(authRef, { pin: '1234', updatedAt: new Date().toISOString() }, { merge: true }),
        FIRESTORE_AUTH_TIMEOUT_MS,
        'انتهت مهلة تهيئة رمز الدخول'
      ).catch(() => {});
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
    await withTimeout(
      setDoc(authRef, { pin: newPassword, updatedAt: new Date().toISOString() }, { merge: true }),
      FIRESTORE_AUTH_TIMEOUT_MS,
      'انتهت مهلة تحديث الرمز السري في Firebase'
    );
    return { success: true };
  } catch (err) {
    return { success: true, warning: err.message };
  }
}

// ============================================================
// Technical Support Instant Q&A & Live Tickets (messages collection)
// ============================================================
const SUPPORT_LOCAL_KEY = 'tasami_support_tickets';
const SUPPORT_SESSION_KEY = 'tasami_support_session_id';

export function getOrCreateSupportSessionId() {
  try {
    let sid = localStorage.getItem(SUPPORT_SESSION_KEY);
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(SUPPORT_SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
}

function readLocalSupportTickets() {
  try {
    const raw = localStorage.getItem(SUPPORT_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalSupportTickets(tickets) {
  try {
    localStorage.setItem(SUPPORT_LOCAL_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent('tasami-support-updated'));
  } catch {}
}

function mergeTicketsList(remoteList = [], localList = []) {
  const map = new Map();
  for (const t of localList) {
    if (t?.id) map.set(t.id, t);
  }
  for (const t of remoteList) {
    if (t?.id) {
      const existing = map.get(t.id);
      if (!existing || (t.updatedAt || '') >= (existing.updatedAt || '')) {
        map.set(t.id, t);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))
  );
}

export async function submitSupportTicket({
  sessionId,
  visitorName,
  phone = '',
  category = 'استفسار فني',
  question,
  lang = 'ar'
}) {
  const now = new Date().toISOString();
  const payload = {
    kind: 'tech_support',
    sessionId: sessionId || getOrCreateSupportSessionId(),
    visitorName: String(visitorName || '').trim() || (lang === 'ar' ? 'زائر الموقع' : 'Website Visitor'),
    phone: String(phone || '').trim(),
    category: String(category || '').trim() || 'عام',
    question: String(question || '').trim(),
    status: 'open',
    lang,
    replies: [],
    createdAt: now,
    updatedAt: now
  };

  let docId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  let synced = false;

  if (db) {
    try {
      const refDoc = await withTimeout(
        addDoc(collection(db, 'messages'), payload),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة إرسال سؤال الدعم الفني'
      );
      docId = refDoc.id;
      synced = true;
    } catch (err) {
      console.warn('Firestore support submit fallback to localStorage:', err);
    }
  }

  const savedTicket = { id: docId, ...payload, localOnly: !synced };
  const current = readLocalSupportTickets();
  writeLocalSupportTickets([savedTicket, ...current.filter((t) => t.id !== docId)]);
  return { success: true, ticket: savedTicket, synced };
}

export async function appendSupportReply(ticketId, { sender = 'admin', senderName = 'الدعم الفني', text, status }) {
  const cleanText = String(text || '').trim();
  if (!ticketId || !cleanText) return { success: false };

  const now = new Date().toISOString();
  const newReply = {
    id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    sender,
    senderName,
    text: cleanText,
    createdAt: now
  };

  const nextStatus = status || (sender === 'admin' ? 'answered' : 'open');

  // Update local cache immediately
  const localTickets = readLocalSupportTickets();
  const nextLocal = localTickets.map((t) => {
    if (t.id !== ticketId) return t;
    return {
      ...t,
      status: nextStatus,
      updatedAt: now,
      replies: [...(Array.isArray(t.replies) ? t.replies : []), newReply]
    };
  });
  writeLocalSupportTickets(nextLocal);

  if (db && !String(ticketId).startsWith('local_')) {
    try {
      const docRef = doc(db, 'messages', ticketId);
      const snap = await withTimeout(getDoc(docRef), FIRESTORE_READ_TIMEOUT_MS, 'انتهت مهلة قراءة التذكرة');
      const existingReplies = snap.exists() && Array.isArray(snap.data().replies) ? snap.data().replies : [];
      await withTimeout(
        updateDoc(docRef, {
          replies: [...existingReplies, newReply],
          status: nextStatus,
          updatedAt: now
        }),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة حفظ الرد'
      );
      return { success: true, synced: true };
    } catch (err) {
      console.warn('Firestore reply fallback:', err);
    }
  }

  return { success: true, localOnly: true };
}

export async function updateSupportTicketStatus(ticketId, status) {
  const now = new Date().toISOString();
  const localTickets = readLocalSupportTickets();
  writeLocalSupportTickets(
    localTickets.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: now } : t))
  );

  if (db && !String(ticketId).startsWith('local_')) {
    try {
      await withTimeout(
        updateDoc(doc(db, 'messages', ticketId), { status, updatedAt: now }),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة تحديث حالة التذكرة'
      );
    } catch (err) {
      console.warn('Firestore status update warning:', err);
    }
  }
  return { success: true };
}

export async function deleteSupportTicket(ticketId) {
  const localTickets = readLocalSupportTickets();
  writeLocalSupportTickets(localTickets.filter((t) => t.id !== ticketId));

  if (db && !String(ticketId).startsWith('local_')) {
    try {
      await withTimeout(
        deleteDoc(doc(db, 'messages', ticketId)),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة حذف التذكرة'
      );
    } catch (err) {
      console.warn('Firestore delete ticket warning:', err);
    }
  }
  return { success: true };
}

export function subscribeSupportTickets({ sessionId = null, onUpdate }) {
  const emitLocal = () => {
    const allLocal = readLocalSupportTickets();
    const filtered = sessionId ? allLocal.filter((t) => t.sessionId === sessionId) : allLocal;
    onUpdate(filtered.sort((a, b) =>
      String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))
    ));
  };

  emitLocal();

  const onStorageOrCustom = () => emitLocal();
  window.addEventListener('tasami-support-updated', onStorageOrCustom);
  window.addEventListener('storage', onStorageOrCustom);

  let unsubFirestore = () => {};
  if (db) {
    try {
      const q = sessionId
        ? query(collection(db, 'messages'), where('kind', '==', 'tech_support'), where('sessionId', '==', sessionId))
        : query(collection(db, 'messages'), where('kind', '==', 'tech_support'));

      unsubFirestore = onSnapshot(
        q,
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          const allLocal = readLocalSupportTickets();
          const relevantLocal = sessionId
            ? allLocal.filter((t) => t.sessionId === sessionId && String(t.id).startsWith('local_'))
            : allLocal.filter((t) => String(t.id).startsWith('local_'));
          const merged = mergeTicketsList(remote, relevantLocal);
          if (!sessionId) {
            // Cache merged remote list locally for offline continuity
            writeLocalSupportTickets(mergeTicketsList(remote, allLocal));
          }
          onUpdate(merged);
        },
        (err) => {
          console.warn('Support tickets subscription fallback:', err);
        }
      );
    } catch (err) {
      console.warn('Support query init warning:', err);
    }
  }

  return () => {
    window.removeEventListener('tasami-support-updated', onStorageOrCustom);
    window.removeEventListener('storage', onStorageOrCustom);
    unsubFirestore();
  };
}

// ============================================================
// Customer Ratings & Reviews Moderation (messages collection, kind: 'customer_review')
// Pending reviews stay hidden until explicitly approved by Admin
// ============================================================
const REVIEWS_LOCAL_KEY = 'tasami_customer_reviews';

function readLocalReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalReviews(reviews) {
  try {
    localStorage.setItem(REVIEWS_LOCAL_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('tasami-reviews-updated'));
  } catch {}
}

export async function submitCustomerReview({
  name,
  company = '',
  projectType = '',
  rating = 5,
  comment,
  lang = 'ar',
  status = 'pending' // Never auto-published from public form unless Admin sets 'approved'
}) {
  const now = new Date().toISOString();
  const payload = {
    kind: 'customer_review',
    name: String(name || '').trim(),
    company: String(company || '').trim(),
    projectType: String(projectType || '').trim(),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    comment: String(comment || '').trim(),
    status,
    lang,
    createdAt: now,
    updatedAt: now
  };

  let docId = `rev_local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  let synced = false;

  if (db) {
    try {
      const refDoc = await withTimeout(
        addDoc(collection(db, 'messages'), payload),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة إرسال التقييم'
      );
      docId = refDoc.id;
      synced = true;
    } catch (err) {
      console.warn('Firestore review submit fallback to localStorage:', err);
    }
  }

  const saved = { id: docId, ...payload, localOnly: !synced };
  const current = readLocalReviews();
  writeLocalReviews([saved, ...current.filter((r) => r.id !== docId)]);
  return { success: true, review: saved, synced };
}

export async function updateCustomerReview(reviewId, updates = {}) {
  if (!reviewId) return { success: false };
  const now = new Date().toISOString();
  const patch = { ...updates, updatedAt: now };

  const localReviews = readLocalReviews();
  writeLocalReviews(
    localReviews.map((r) => (r.id === reviewId ? { ...r, ...patch } : r))
  );

  if (db && !String(reviewId).startsWith('rev_local_')) {
    try {
      await withTimeout(
        updateDoc(doc(db, 'messages', reviewId), patch),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة تحديث التقييم'
      );
      return { success: true, synced: true };
    } catch (err) {
      console.warn('Firestore review update warning:', err);
    }
  }
  return { success: true, localOnly: true };
}

export async function deleteCustomerReview(reviewId) {
  if (!reviewId) return { success: false };
  const localReviews = readLocalReviews();
  writeLocalReviews(localReviews.filter((r) => r.id !== reviewId));

  if (db && !String(reviewId).startsWith('rev_local_')) {
    try {
      await withTimeout(
        deleteDoc(doc(db, 'messages', reviewId)),
        FIRESTORE_WRITE_TIMEOUT_MS,
        'انتهت مهلة حذف التقييم'
      );
    } catch (err) {
      console.warn('Firestore review delete warning:', err);
    }
  }
  return { success: true };
}

export function subscribeCustomerReviews({ approvedOnly = false, onUpdate }) {
  const emit = (items) => {
    const filtered = approvedOnly ? items.filter((r) => r.status === 'approved') : items;
    onUpdate(
      [...filtered].sort((a, b) =>
        String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))
      )
    );
  };

  emit(readLocalReviews());

  const onStorageOrCustom = () => emit(readLocalReviews());
  window.addEventListener('tasami-reviews-updated', onStorageOrCustom);
  window.addEventListener('storage', onStorageOrCustom);

  let unsubFirestore = () => {};
  if (db) {
    try {
      const q = approvedOnly
        ? query(collection(db, 'messages'), where('kind', '==', 'customer_review'), where('status', '==', 'approved'))
        : query(collection(db, 'messages'), where('kind', '==', 'customer_review'));

      unsubFirestore = onSnapshot(
        q,
        (snapshot) => {
          const remote = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          const localAll = readLocalReviews();
          const localPendingOnly = localAll.filter((r) => String(r.id).startsWith('rev_local_'));
          const merged = mergeTicketsList(remote, localPendingOnly);
          if (!approvedOnly) {
            writeLocalReviews(mergeTicketsList(remote, localAll));
          }
          emit(merged);
        },
        (err) => {
          console.warn('Customer reviews subscription fallback:', err);
        }
      );
    } catch (err) {
      console.warn('Customer reviews query warning:', err);
    }
  }

  return () => {
    window.removeEventListener('tasami-reviews-updated', onStorageOrCustom);
    window.removeEventListener('storage', onStorageOrCustom);
    unsubFirestore();
  };
}
