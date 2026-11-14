import React from 'react';
import { ExternalLink, Film } from 'lucide-react';
import { parseVideoSource } from '../utils/media';

/**
 * Reusable inline video player supporting YouTube URLs/IDs, Vimeo, and direct/uploaded MP4/WebM files.
 */
export default function InlineVideoPlayer({
  source,
  title = '',
  poster = '',
  autoplay = false,
  className = 'w-full h-full',
  showExternalFallback = true,
  isAr = true,
}) {
  const parsed = parseVideoSource(source, { autoplay });

  if (!parsed.type) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4 text-center">
        <Film className="w-8 h-8 mb-2 opacity-60" />
        <p className="text-xs font-bold">
          {isAr ? 'لا يوجد فيديو مرفق حالياً' : 'No video available yet'}
        </p>
      </div>
    );
  }

  if (parsed.type === 'direct') {
    return (
      <div className={`relative bg-black flex items-center justify-center ${className}`}>
        <video
          src={parsed.directUrl}
          poster={poster || undefined}
          controls
          autoPlay={autoplay}
          playsInline
          preload="metadata"
          className="w-full h-full object-contain bg-black"
        />
      </div>
    );
  }

  return (
    <div className={`relative bg-black ${className}`}>
      <iframe
        src={parsed.embedUrl}
        title={title || 'Product Video'}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      {showExternalFallback && parsed.watchUrl && (
        <a
          href={parsed.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold backdrop-blur-sm transition"
          title={isAr ? 'فتح في نافذة خارجية' : 'Open externally'}
        >
          <ExternalLink className="w-3 h-3" />
          <span>{isAr ? 'يوتيوب' : 'YouTube'}</span>
        </a>
      )}
    </div>
  );
}
