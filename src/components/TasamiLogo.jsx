import React from 'react';
import logoImg from '../assets/logo.jpg';

export default function TasamiLogo({ className = "h-12 sm:h-14 lg:h-16", isWhite = false, lang = "ar" }) {
  const getFallbackSrc = () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}logo.jpg`;
  };

  return (
    <div className="flex items-center select-none">
      <div className={`transition-all duration-200 ${
        isWhite
          ? 'bg-white p-2 sm:p-2.5 rounded-2xl shadow-sm border border-slate-200/80 inline-flex items-center'
          : 'flex items-center'
      }`}>
        <img
          src={logoImg || getFallbackSrc()}
          alt="تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
          className={`${className} w-auto max-w-[280px] sm:max-w-[340px] object-contain transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
          onError={(e) => {
            if (!e.target.dataset.triedBase) {
              e.target.dataset.triedBase = 'true';
              e.target.src = getFallbackSrc();
            } else if (!e.target.dataset.triedRelative) {
              e.target.dataset.triedRelative = 'true';
              e.target.src = './logo.jpg';
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
