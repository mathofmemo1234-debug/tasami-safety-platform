import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Unlink,
  RemoveFormatting,
  Undo2,
  Redo2,
  Code2,
  Highlighter,
  Palette
} from 'lucide-react';
import { sanitizeRichHtml } from '../utils/typography';

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'اكتب نص الفقرة هنا مع إمكانية التنسيق الكامل...',
  dir = 'rtl',
  minHeight = '140px',
  previewStyle = {}
}) {
  const editorRef = useRef(null);
  const isFocusedRef = useRef(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [editorDir, setEditorDir] = useState(dir);
  const [inlineColor, setInlineColor] = useState('#c59a45');
  const [highlightColor, setHighlightColor] = useState('#fef9c3');

  useEffect(() => {
    setEditorDir(dir);
  }, [dir]);

  // Sync external value changes only when editor is not focused
  useEffect(() => {
    if (!sourceMode && editorRef.current && !isFocusedRef.current) {
      const normalized = value || '';
      if (editorRef.current.innerHTML !== normalized) {
        editorRef.current.innerHTML = normalized;
      }
    }
  }, [value, sourceMode]);

  const emitChange = () => {
    if (!editorRef.current) return;
    const raw = editorRef.current.innerHTML;
    const cleaned = raw === '<br>' || raw === '<div><br></div>' ? '' : sanitizeRichHtml(raw);
    onChange?.(cleaned);
  };

  const exec = (command, arg = null) => {
    if (sourceMode) return;
    editorRef.current?.focus();
    try {
      document.execCommand('styleWithCSS', false, true);
    } catch {
      // ignore if unsupported
    }
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleInsertLink = () => {
    const url = window.prompt('أدخل الرابط (URL):', 'https://');
    if (url && url.trim()) {
      exec('createLink', url.trim());
    }
  };

  const handleInlineSize = (pxValue) => {
    if (!pxValue || sourceMode) return;
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = pxValue;
    try {
      range.surroundContents(span);
    } catch {
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    emitChange();
  };

  const plainText = (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800">
        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('undo')}
          title="تراجع"
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('redo')}
          title="إعادة"
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Block Format */}
        <select
          onChange={(e) => {
            if (e.target.value) exec('formatBlock', e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          title="نمط الكتلة"
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="" disabled>النمط</option>
          <option value="P">فقرة عادية</option>
          <option value="H3">عنوان رئيسي</option>
          <option value="H4">عنوان فرعي</option>
          <option value="BLOCKQUOTE">اقتباس بارز</option>
        </select>

        {/* Inline Selection Size */}
        <select
          onChange={(e) => {
            handleInlineSize(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          title="حجم النص المحدد"
          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="" disabled>حجم التحديد</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
        </select>

        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Basic Styles */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('bold')}
          title="خط عريض (Bold)"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#c59a45]/20 hover:text-[#9a752a] transition"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('italic')}
          title="خط مائل (Italic)"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#c59a45]/20 hover:text-[#9a752a] transition"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('underline')}
          title="تسطير (Underline)"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#c59a45]/20 hover:text-[#9a752a] transition"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('strikeThrough')}
          title="يتوسطه خط"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#c59a45]/20 hover:text-[#9a752a] transition"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Inline Color & Highlight */}
        <label className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer" title="لون النص المحدد">
          <Palette className="w-3.5 h-3.5 text-[#1d4ed8] dark:text-[#60a5fa]" />
          <input
            type="color"
            value={inlineColor}
            onChange={(e) => {
              setInlineColor(e.target.value);
              exec('foreColor', e.target.value);
            }}
            className="w-4 h-4 p-0 border-0 rounded cursor-pointer bg-transparent"
          />
        </label>

        <label className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer" title="تمييز خلفية النص المحدد">
          <Highlighter className="w-3.5 h-3.5 text-[#c59a45]" />
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => {
              setHighlightColor(e.target.value);
              exec('hiliteColor', e.target.value);
            }}
            className="w-4 h-4 p-0 border-0 rounded cursor-pointer bg-transparent"
          />
        </label>

        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Alignments */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyRight')}
          title="محاذاة لليمين"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyCenter')}
          title="توسيط"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyLeft')}
          title="محاذاة لليسار"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('justifyFull')}
          title="ضبط متساوٍ"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Lists & Links */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertUnorderedList')}
          title="قائمة نقطية"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertOrderedList')}
          title="قائمة مرقمة"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleInsertLink}
          title="إدراج رابط"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('unlink')}
          title="إزالة الرابط"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
        >
          <Unlink className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('removeFormat')}
          title="مسح التنسيق الداخلي"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-red-100 hover:text-red-700 transition"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {/* Direction + HTML Source Toggle */}
        <div className="flex items-center gap-1 mr-auto rtl:mr-auto ltr:ml-auto">
          <button
            type="button"
            onClick={() => setEditorDir((d) => (d === 'rtl' ? 'ltr' : 'rtl'))}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-[#c59a45]"
            title="تبديل اتجاه الكتابة"
          >
            {editorDir.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setSourceMode((m) => !m)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition ${
              sourceMode
                ? 'bg-[#162d6c] text-white border-[#162d6c]'
                : 'bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#c59a45]'
            }`}
            title="التبديل إلى محرر كود HTML"
          >
            <Code2 className="w-3 h-3" />
            <span>{sourceMode ? 'مرئي' : 'HTML'}</span>
          </button>
        </div>
      </div>

      {/* Editable Area */}
      {sourceMode ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange?.(sanitizeRichHtml(e.target.value))}
          dir="ltr"
          style={{ minHeight }}
          className="w-full p-3.5 bg-slate-950 text-emerald-300 font-mono text-xs focus:outline-none resize-y"
          placeholder="<p>أدخل نص أو كود HTML للفقرة...</p>"
        />
      ) : (
        <div className="relative">
          {!plainText && (
            <div className="pointer-events-none absolute top-3.5 right-3.5 left-3.5 text-xs text-slate-400">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir={editorDir}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
              emitChange();
            }}
            onInput={emitChange}
            style={{ minHeight, ...previewStyle }}
            className="w-full p-3.5 text-sm text-[#0f172a] dark:text-slate-100 leading-relaxed focus:outline-none [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-[#1d4ed8] [&_a]:underline [&_blockquote]:border-r-4 [&_blockquote]:border-[#c59a45] [&_blockquote]:pr-3 [&_blockquote]:italic [&_h3]:text-lg [&_h3]:font-black [&_h4]:text-base [&_h4]:font-bold"
          />
        </div>
      )}

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-slate-50/70 dark:bg-[#0b1120] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>يدعم التنسيق المباشر (عريض، مائل، ألوان داخلية، قوائم، روابط)</span>
        <span className="font-mono">{wordCount} كلمة • {plainText.length} حرف</span>
      </div>
    </div>
  );
}
