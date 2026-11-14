/**
 * Media helpers for multi-angle product galleries and inline video players.
 * Supports YouTube URLs/IDs, Vimeo URLs, and direct/uploaded MP4/WebM videos.
 */

export function extractYouTubeId(input = '') {
  const raw = String(input || '').trim();
  if (!raw) return '';

  // Direct 11-character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return raw;
  }

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      const parts = url.pathname.split('/').filter(Boolean);
      const markerIdx = parts.findIndex((p) => ['embed', 'shorts', 'live', 'v'].includes(p));
      if (markerIdx !== -1 && parts[markerIdx + 1]) {
        const id = parts[markerIdx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
      }
    }
  } catch {
    // Fallback regex when malformed URL contains v= or embed/
    const match = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }

  return '';
}

export function extractVimeoId(input = '') {
  const raw = String(input || '').trim();
  if (!raw) return '';
  const match = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match ? match[1] : '';
}

export function parseVideoSource(videoUrlOrId = '', { autoplay = false } = {}) {
  const raw = String(videoUrlOrId || '').trim();
  if (!raw) {
    return { type: null, raw: '', embedUrl: '', directUrl: '', youtubeId: '' };
  }

  const ytId = extractYouTubeId(raw);
  if (ytId) {
    const originParam =
      typeof window !== 'undefined' && window.location?.origin
        ? `&origin=${encodeURIComponent(window.location.origin)}`
        : '';
    return {
      type: 'youtube',
      raw,
      youtubeId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1${autoplay ? '&autoplay=1' : ''}${originParam}`,
      watchUrl: `https://www.youtube.com/watch?v=${ytId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      directUrl: '',
    };
  }

  const vimeoId = extractVimeoId(raw);
  if (vimeoId) {
    return {
      type: 'vimeo',
      raw,
      youtubeId: '',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}${autoplay ? '?autoplay=1' : ''}`,
      watchUrl: raw,
      thumbnailUrl: '',
      directUrl: '',
    };
  }

  // Direct video URL (MP4, WebM, MOV, OGG, Blob, Data URL, Firebase Storage, local file)
  return {
    type: 'direct',
    raw,
    youtubeId: '',
    embedUrl: '',
    watchUrl: raw,
    thumbnailUrl: '',
    directUrl: raw,
  };
}

export function resolveProductVideoSource(item) {
  if (!item) return '';
  return String(item.videoUrl || item.videoId || '').trim();
}

export function getProductImages(item) {
  if (!item) return ['./images/product-1.jpg'];
  const list = [];
  if (item.image && String(item.image).trim()) {
    list.push(String(item.image).trim());
  }
  if (Array.isArray(item.images)) {
    for (const img of item.images) {
      const clean = String(img || '').trim();
      if (clean && !list.includes(clean)) {
        list.push(clean);
      }
    }
  }
  return list.length > 0 ? list : ['./images/product-1.jpg'];
}

export function normalizeWhatsAppDigits(rawPhone = '') {
  const digits = String(rawPhone || '').replace(/[^\d]/g, '');
  if (!digits) return '966591684133';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('05') && digits.length === 10) return `966${digits.slice(1)}`;
  if (digits.startsWith('5') && digits.length === 9) return `966${digits}`;
  return digits;
}
