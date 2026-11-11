import React from 'react';

export default function TasamiLogo({ className = "h-12 sm:h-14", isWhite = false, lang = "ar" }) {
  return (
    <div className="flex items-center select-none">
      {/* Official Company Logo - Single clean horizontal banner with emblem + name built-in, no redundant duplicate text */}
      <div className={`transition-all duration-200 ${isWhite ? 'bg-white/95 px-3 py-1.5 rounded-xl shadow-sm border border-white/20' : ''}`}>
        <img
          src="/logo.jpg"
          alt="تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
          className={`${className} w-auto max-w-[240px] sm:max-w-[280px] object-contain transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    </div>
  );
}
