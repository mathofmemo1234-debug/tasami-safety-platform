import React from 'react';

export default function TasamiLogo({ className = "h-12", showText = true, isWhite = false, lang = "ar" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Company Logo */}
      <img
        src="./logo.jpg"
        alt="تسامي الأعمال لأنظمة السلامة | TASAMI BUSINESS FOR SAFETY SYSTEMS"
        className="h-11 sm:h-12 w-auto object-contain rounded-xl shadow-sm border border-slate-200/60 bg-white p-0.5"
      />

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider text-base sm:text-lg font-sans ${isWhite ? 'text-white' : 'text-slate-900'}`}>
              TASAMI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59a45]"></span>
            <span className="text-[#c59a45] font-bold text-[9px] tracking-widest uppercase">
              SAFETY
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#c59a45] font-cairo">
            تسامي الأعمال لأنظمة السلامة
          </span>
          <span className="text-[8.5px] uppercase tracking-wider font-semibold text-slate-500">
            TASAMI FOR SAFETY SYSTEMS
          </span>
        </div>
      )}
    </div>
  );
}
