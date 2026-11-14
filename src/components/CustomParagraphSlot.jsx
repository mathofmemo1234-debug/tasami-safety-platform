import React from 'react';
import {
  getParagraphOverride,
  getParagraphStyle,
  resolveStyleConfig,
  sanitizeRichHtml
} from '../utils/typography';

export function FormattedParagraph({
  content,
  lang,
  paraKey,
  defaultText = null,
  className = '',
  children
}) {
  const style = getParagraphStyle(content, lang, paraKey);
  const overrideHtml = getParagraphOverride(content, lang, paraKey);
  const rawValue = overrideHtml !== null ? overrideHtml : defaultText;
  const isHtml = typeof rawValue === 'string' && /<[a-z][\s\S]*>/i.test(rawValue);

  if (isHtml) {
    return (
      <div
        style={style}
        className={`${className} [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-[#1d4ed8] [&_a]:underline [&_blockquote]:border-r-4 [&_blockquote]:border-[#c59a45] [&_blockquote]:pr-3 [&_blockquote]:italic`}
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(rawValue) }}
      />
    );
  }

  return (
    <p style={style} className={className}>
      {rawValue !== null ? rawValue : children}
    </p>
  );
}

export default function CustomParagraphSlot({
  placement,
  lang,
  content,
  className = ''
}) {
  const list = content?.[lang]?.customParagraphs;
  if (!Array.isArray(list) || list.length === 0) return null;

  const items = list
    .filter((item) => item && item.visible !== false && item.placement === placement)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (items.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => {
        const resolvedStyle = resolveStyleConfig(item.style);
        const containerWidth = item.maxWidth || 'max-w-7xl';
        const isEmbedded = placement.includes('inside') || placement === 'contact:beforeMap';
        const wrapperClass = isEmbedded
          ? 'w-full'
          : `${containerWidth} mx-auto px-4 sm:px-6 lg:px-8`;

        const hasCardBg = Boolean(item.style?.backgroundColor || item.style?.borderColor);

        return (
          <div key={item.id} className={wrapperClass}>
            <div
              style={resolvedStyle}
              className={`w-full transition-colors ${
                hasCardBg
                  ? 'shadow-sm'
                  : 'rounded-2xl bg-white/80 dark:bg-[#131c31]/80 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm'
              }`}
            >
              {item.title && item.title.trim() !== '' && (
                <h3
                  className="text-lg sm:text-xl font-black mb-2"
                  style={
                    item.style?.color
                      ? { color: item.style.color, textAlign: item.style.textAlign || 'center' }
                      : { textAlign: item.style?.textAlign || 'center' }
                  }
                >
                  {item.title}
                </h3>
              )}
              <div
                className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-[#1d4ed8] [&_a]:underline [&_blockquote]:border-r-4 [&_blockquote]:border-[#c59a45] [&_blockquote]:pr-3 [&_blockquote]:italic [&_h3]:text-lg [&_h3]:font-black [&_h4]:text-base [&_h4]:font-bold"
                style={{
                  color: item.style?.color || undefined,
                  fontFamily: resolvedStyle?.fontFamily,
                  fontSize: resolvedStyle?.fontSize,
                  fontWeight: resolvedStyle?.fontWeight,
                  fontStyle: resolvedStyle?.fontStyle,
                  textDecoration: resolvedStyle?.textDecoration,
                  lineHeight: resolvedStyle?.lineHeight,
                  letterSpacing: resolvedStyle?.letterSpacing,
                  textAlign: resolvedStyle?.textAlign || 'center',
                }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeRichHtml(item.html || item.content || ''),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
