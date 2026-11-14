import React, { useEffect, useMemo, useState } from 'react';
import { Megaphone, Star, Sparkles, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { subscribeCustomerReviews } from '../services/firebase';

export default function AnnouncementTicker({
  lang = 'ar',
  content,
  onNavigate
}) {
  const isAr = lang === 'ar';
  const [liveApprovedReviews, setLiveApprovedReviews] = useState([]);

  useEffect(() => {
    const unsub = subscribeCustomerReviews({
      approvedOnly: true,
      onUpdate: (list) => setLiveApprovedReviews(list)
    });
    return () => unsub();
  }, []);

  const tickerCfg = content?.[lang]?.announcementTicker || {};
  const enabled = tickerCfg.enabled !== false;

  const tickerItems = useMemo(() => {
    const manualItems = Array.isArray(tickerCfg.items) ? tickerCfg.items : [];
    const baseEntries = manualItems
      .filter((it) => it && String(it.text || '').trim())
      .map((it) => ({
        id: it.id || it.text,
        kind: 'announcement',
        badge: it.badge || (isAr ? 'تحديث' : 'Update'),
        text: it.text,
        linkPage: it.linkPage || ''
      }));

    if (tickerCfg.includeApprovedReviews !== false) {
      const seedReviews = Array.isArray(content?.[lang]?.customerReviews?.items)
        ? content[lang].customerReviews.items.filter((r) => (r.status || 'approved') === 'approved')
        : [];
      const mergedReviews = [...liveApprovedReviews, ...seedReviews];
      const reviewEntries = mergedReviews.slice(0, 6).map((rev) => ({
        id: `rev_tick_${rev.id}`,
        kind: 'review',
        badge: `${'★'.repeat(Math.min(5, Math.max(1, Number(rev.rating) || 5)))} ${isAr ? 'رأي عميل' : 'Client Review'}`,
        text: `${rev.name}${rev.company ? ` (${rev.company})` : ''}: "${rev.comment}"`,
        linkPage: 'home',
        scrollToId: 'customer-reviews'
      }));
      return [...baseEntries, ...reviewEntries];
    }

    return baseEntries;
  }, [tickerCfg, content, lang, liveApprovedReviews, isAr]);

  if (!enabled || tickerItems.length === 0) {
    return null;
  }

  const speedSeconds =
    tickerCfg.speed === 'fast' ? 24 : tickerCfg.speed === 'slow' ? 58 : 38;

  const handleItemClick = (item) => {
    if (item.scrollToId) {
      if (onNavigate) onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(item.scrollToId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    if (item.linkPage && onNavigate) {
      onNavigate(item.linkPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="relative w-full bg-gradient-to-r from-[#0b1120] via-[#113163] to-[#0b1120] border-b border-[#c59a45]/35 text-white overflow-hidden select-none z-20"
    >
      <style>{`
        @keyframes tasami-marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        @keyframes tasami-marquee-ltr {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .tasami-ticker-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="flex items-center h-9 sm:h-10">
        {/* Sticky Leading Badge */}
        <div className="shrink-0 z-10 h-full px-3 sm:px-4 bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md">
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">
            {isAr ? 'آخر التحديثات' : 'Latest Updates'}
          </span>
        </div>

        {/* Continuous Smooth Marquee Strip */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          <div
            className="tasami-ticker-track flex items-center gap-6 whitespace-nowrap w-max"
            style={{
              animation: `${
                isAr ? 'tasami-marquee-rtl' : 'tasami-marquee-ltr'
              } ${speedSeconds}s linear infinite`
            }}
          >
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <button
                key={`${item.id}_${idx}`}
                type="button"
                onClick={() => handleItemClick(item)}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-100 hover:text-[#dfb76c] transition px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                    item.kind === 'review'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-[#c59a45]/20 text-[#e8c682] border border-[#c59a45]/40'
                  }`}
                >
                  {item.kind === 'review' ? (
                    <Star className="w-2.5 h-2.5 fill-current" />
                  ) : (
                    <Sparkles className="w-2.5 h-2.5" />
                  )}
                  <span>{item.badge}</span>
                </span>
                <span className="max-w-[380px] truncate">{item.text}</span>
                {item.linkPage &&
                  (isAr ? (
                    <ArrowUpLeft className="w-3 h-3 text-[#dfb76c] opacity-80" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 text-[#dfb76c] opacity-80" />
                  ))}
                <span className="text-[#c59a45]/40 mx-1">◆</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
