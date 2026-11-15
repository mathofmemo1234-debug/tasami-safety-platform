import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const LOCAL_FAVS_PREFIX = 'tasami_favs_';

/**
 * Returns local storage key for a user or guest.
 */
function getStorageKey(userId) {
  return `${LOCAL_FAVS_PREFIX}${userId || 'guest'}`;
}

/**
 * Reads favorites list for given user.
 */
export function getFavorites(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

/**
 * Saves favorites list to localStorage and emits an update event.
 */
export function saveFavorites(userId, list) {
  try {
    const safeList = Array.isArray(list) ? list.filter(Boolean) : [];
    localStorage.setItem(getStorageKey(userId), JSON.stringify(safeList));
    window.dispatchEvent(new CustomEvent('tasami-favorites-updated', { detail: { userId: userId || 'guest', list: safeList } }));

    // Sync to Firestore if authenticated real user (not guest or offline fallback)
    if (db && userId && typeof userId === 'string' && userId !== 'guest' && !userId.startsWith('local_')) {
      updateDoc(doc(db, 'users', userId), {
        favorites: safeList,
        updatedAt: new Date().toISOString()
      }).catch((err) => {
        console.warn('Could not sync favorites to Firestore:', err);
      });
    }
  } catch (err) {
    console.warn('Error saving favorites:', err);
  }
}

/**
 * Checks if a product is favorited.
 */
export function isProductFavorited(userId, productId) {
  if (!productId) return false;
  const list = getFavorites(userId);
  return list.some((item) => String(item?.id || item) === String(productId));
}

/**
 * Toggles a product in favorites. Returns updated list and boolean isAdded.
 */
export function toggleProductFavorite(userId, product) {
  if (!product || !product.id) return { list: [], isAdded: false };
  const current = getFavorites(userId);
  const exists = current.some((it) => String(it?.id || it) === String(product.id));

  let updated = [];
  let isAdded = false;

  if (exists) {
    updated = current.filter((it) => String(it?.id || it) !== String(product.id));
    isAdded = false;
  } else {
    const minifiedProduct = {
      id: product.id,
      ar: product.ar || product.title || '',
      en: product.en || product.titleEn || '',
      category: product.category || '',
      image: product.image || './images/product-1.jpg',
      specs: product.specs || '',
      addedAt: new Date().toISOString()
    };
    updated = [minifiedProduct, ...current];
    isAdded = true;
  }

  saveFavorites(userId, updated);
  return { list: updated, isAdded };
}

/**
 * Subscribes to favorites updates across tabs and window events.
 */
export function subscribeToFavorites(userId, callback) {
  const safeUserId = userId || 'guest';

  const handleUpdate = (e) => {
    const eventUserId = e.detail?.userId || 'guest';
    if (eventUserId === safeUserId || !e.detail) {
      callback(e.detail?.list || getFavorites(safeUserId));
    }
  };

  window.addEventListener('tasami-favorites-updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('tasami-favorites-updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
