import React, { useState, useEffect } from 'react';
import defaultLogoImg from '../assets/logo.jpg';

/**
 * Helper to retrieve the current active logo URL from content or localStorage.
 */
export function getActiveLogoUrl(contentObj) {
  // 1. Check passed content object (Arabic or English brand)
  if (contentObj) {
    const candidate =
      contentObj?.ar?.brand?.logoUrl ||
      contentObj?.en?.brand?.logoUrl ||
      contentObj?.brand?.logoUrl ||
      contentObj?.logoUrl;
    if (candidate && typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  // 2. Check localStorage for direct custom logo or cached content
  try {
    const directLogo = localStorage.getItem('tasami_custom_logo');
    if (directLogo && typeof directLogo === 'string' && directLogo.trim()) {
      return directLogo.trim();
    }

    const cachedLive = localStorage.getItem('tasami_live_content');
    if (cachedLive) {
      const parsed = JSON.parse(cachedLive);
      const cand =
        parsed?.ar?.brand?.logoUrl ||
        parsed?.en?.brand?.logoUrl ||
        parsed?.brand?.logoUrl ||
        parsed?.logoUrl;
      if (cand && typeof cand === 'string' && cand.trim()) {
        return cand.trim();
      }
    }
  } catch (err) {
    // ignore local storage errors
  }

  return null;
}

/**
 * Dispatches a global event so all logo components update across the app in real time.
 */
export function broadcastLogoChange(newUrl) {
  try {
    if (newUrl) {
      localStorage.setItem('tasami_custom_logo', newUrl);
    } else {
      localStorage.removeItem('tasami_custom_logo');
    }
    window.dispatchEvent(new CustomEvent('tasami_logo_changed', { detail: newUrl || null }));

    // Dynamically update site favicon to match new logo
    const iconLink = document.querySelector("link[rel*='icon']");
    if (iconLink) {
      iconLink.href = newUrl || './logo.jpg';
    }
  } catch (err) {
    console.warn('Failed to broadcast logo change:', err);
  }
}

/**
 * Dispatches a global event so all logo components update their container style in real time.
 */
export function broadcastLogoStyleChange(newStyle) {
  try {
    if (newStyle) {
      localStorage.setItem('tasami_logo_container_style', newStyle);
    } else {
      localStorage.removeItem('tasami_logo_container_style');
    }
    window.dispatchEvent(new CustomEvent('tasami_logo_style_changed', { detail: newStyle || 'badge' }));
  } catch (err) {
    console.warn('Failed to broadcast logo style change:', err);
  }
}

export default function TasamiLogo({
  src,
  customLogo,
  content,
  className = "h-20 sm:h-24 lg:h-28",
  isWhite = false,
  compact = false,
  lang = "ar",
  alt
}) {
  const getFallbackSrc = () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}logo.jpg`;
  };

  const [activeLogo, setActiveLogo] = useState(() => {
    return src || customLogo || getActiveLogoUrl(content);
  });

  const [containerStyle, setContainerStyle] = useState(() => {
    return (
      content?.ar?.brand?.logoContainerStyle ||
      content?.brand?.logoContainerStyle ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('tasami_logo_container_style') : null) ||
      'badge'
    );
  });

  const [hasError, setHasError] = useState(false);

  // Sync when content or props change, or when global logo change event is fired
  useEffect(() => {
    const sync = () => {
      const resolved = src || customLogo || getActiveLogoUrl(content);
      setActiveLogo(resolved);
      const style =
        content?.ar?.brand?.logoContainerStyle ||
        content?.brand?.logoContainerStyle ||
        localStorage.getItem('tasami_logo_container_style') ||
        'badge';
      setContainerStyle(style);
      setHasError(false);
    };

    sync();

    const handleCustomEvent = (e) => {
      if (e && e.detail !== undefined) {
        setActiveLogo(e.detail || null);
        setHasError(false);
      } else {
        sync();
      }
    };

    const handleStyleEvent = (e) => {
      if (e && e.detail) {
        setContainerStyle(e.detail);
      } else {
        sync();
      }
    };

    window.addEventListener('tasami_logo_changed', handleCustomEvent);
    window.addEventListener('tasami_logo_style_changed', handleStyleEvent);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('tasami_logo_changed', handleCustomEvent);
      window.removeEventListener('tasami_logo_style_changed', handleStyleEvent);
      window.removeEventListener('storage', sync);
    };
  }, [src, customLogo, content]);

  const defaultAlt =
    lang === 'ar'
      ? "تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
      : "TASAMI BUSINESS FOR SAFETY SYSTEMS";

  const resolvedAlt = alt || content?.ar?.brand?.logoAlt || defaultAlt;

  // Decide image source
  const imageSrc = (!hasError && activeLogo) ? activeLogo : (defaultLogoImg || getFallbackSrc());

  return (
    <div className="flex items-center select-none">
      <div
        className={`transition-all duration-200 ${
          containerStyle === 'transparent'
            ? 'flex items-center'
            : isWhite
            ? compact
              ? 'bg-white px-2.5 py-1 rounded-2xl shadow-md border border-[#c59a45]/35 inline-flex items-center'
              : 'bg-white p-3 sm:p-4 rounded-3xl shadow-md border border-slate-200/80 dark:border-[#c59a45]/30 inline-flex items-center'
            : 'flex items-center dark:bg-white dark:p-2 dark:rounded-2xl'
        }`}
      >
        <img
          src={imageSrc}
          alt={resolvedAlt}
          className={`${className} w-auto max-w-[450px] sm:max-w-[600px] object-contain transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
          onError={(e) => {
            // If custom logo failed, fall back to default logo
            if (activeLogo && !hasError) {
              setHasError(true);
              return;
            }

            // Standard fallback chain
            if (!e.target.dataset.triedBase) {
              e.target.dataset.triedBase = 'true';
              e.target.src = getFallbackSrc();
            } else if (!e.target.dataset.triedRelative) {
              e.target.dataset.triedRelative = 'true';
              e.target.src = './logo.jpg';
            } else if (!e.target.dataset.triedUpper) {
              e.target.dataset.triedUpper = 'true';
              e.target.src = './LOGO.jpg';
            } else if (!e.target.dataset.triedJfif) {
              e.target.dataset.triedJfif = 'true';
              e.target.src = './logo.jfif';
            }
          }}
        />
      </div>
    </div>
  );
}
