import React from 'react';

export default function TasamiLogo({ className = "h-12", showText = true, isWhite = false, lang = "ar" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Gold Shield Icon */}
      <div className="relative w-11 h-12 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 115" className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(197,154,69,0.4)]">
          <defs>
            <linearGradient id="shieldGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3dd98" />
              <stop offset="35%" stopColor="#c59a45" />
              <stop offset="70%" stopColor="#e5c172" />
              <stop offset="100%" stopColor="#8d6824" />
            </linearGradient>
            <linearGradient id="innerShield" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Shield Border */}
          <path
            d="M50 4 L88 18 L88 62 C88 88 50 110 50 110 C50 110 12 88 12 62 L12 18 Z"
            fill="url(#innerShield)"
            stroke="url(#shieldGoldGradient)"
            strokeWidth="5"
          />

          {/* Inner Accent Line */}
          <path
            d="M50 12 L80 23 L80 58 C80 80 50 98 50 98 C50 98 20 80 20 58 L20 23 Z"
            fill="none"
            stroke="url(#shieldGoldGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />

          {/* Stylized 'T' Symbol in Gold */}
          <path
            d="M26 30 H74 V40 H56 V84 H44 V40 H26 Z"
            fill="url(#shieldGoldGradient)"
          />
          {/* Subtle bevel detail on T */}
          <path
            d="M26 30 L31 35 H69 L74 30 Z"
            fill="#fff"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider text-xl font-sans ${isWhite ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              TASAMI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c59a45]"></span>
            <span className="text-[#c59a45] font-bold text-xs tracking-widest uppercase">
              SAFETY
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
            SAFETY SOLUTION
          </span>
          <span className="text-[11px] font-bold text-[#c59a45] font-cairo">
            — سلامتك أمانة —
          </span>
        </div>
      )}
    </div>
  );
}
