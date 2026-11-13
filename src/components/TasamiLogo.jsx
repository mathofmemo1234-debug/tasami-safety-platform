import React from 'react';
import logoImg from '../assets/logo.jpg';

export default function TasamiLogo({ className = "h-20 sm:h-24 lg:h-28", isWhite = false, compact = false, lang = "ar" }) {
  const getFallbackSrc = () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}logo.jpg`;
  };

  return (
    <div className="flex items-center select-none">
      <div className={`transition-all duration-200 ${
        isWhite
          ? compact
            ? 'bg-white px-2.5 py-1 rounded-2xl shadow-md border border-[#c59a45]/35 inline-flex items-center'
            : 'bg-white p-3 sm:p-4 rounded-3xl shadow-md border border-slate-200/80 dark:border-[#c59a45]/30 inline-flex items-center'
          : 'flex items-center dark:bg-white dark:p-2 dark:rounded-2xl'
      }`}>
        <img
          src={logoImg || getFallbackSrc()}
          alt="تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
          className={`${className} w-auto max-w-[450px] sm:max-w-[600px] object-contain transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
          onError={(e) => {
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
