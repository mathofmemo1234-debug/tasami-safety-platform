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
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves favorites list to localStorage and emits an update event.
 */
export function saveFavorites(userId, list) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('tasami-favorites-updated', { detail: { userId, list } }));

    // Sync to Firestore if authenticated user
    if (db && userId && !userId.startsWith('local_')) {
      updateDoc(doc(db, 'users', userId), {
        favorites: list,
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
  return list.some((item) => String(item.id || item) === String(productId));
}

/**
 * Toggles a product in favorites. Returns updated list and boolean isAdded.
 */
export function toggleProductFavorite(userId, product) {
  if (!product || !product.id) return { list: [], isAdded: false };
  const current = getFavorites(userId);
  const exists = current.some((it) => String(it.id) === String(product.id));

  let updated = [];
  let isAdded = false;

  if (exists) {
    updated = current.filter((it) => String(it.id) !== String(product.id));
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
 * Subscribes to favorites updates.
 */
export function subscribeToFavorites(userId, callback) {
  callback(getFavorites(userId));

  const handleUpdate = (e) => {
    if (!userId || e.detail?.userId === userId) {
      callback(e.detail?.list || getFavorites(userId));
    }
  };

  window.addEventListener('tasami-favorites-updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('tasami-favorites-updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
