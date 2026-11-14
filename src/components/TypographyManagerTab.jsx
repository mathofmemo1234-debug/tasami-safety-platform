import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  RefreshCw,
  Edit3,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MapPin,
  Copy,
  Sliders,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import {
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  LETTER_SPACING_OPTIONS,
  ALIGN_OPTIONS,
  COLOR_PRESETS,
  BG_COLOR_PRESETS,
  MAX_WIDTH_OPTIONS,
  PARAGRAPH_PLACEMENTS,
  PARAGRAPH_DEFINITIONS,
  resolveStyleConfig,
  sanitizeRichHtml
} from '../utils/typography';

const DEFAULT_PARAGRAPH_TEXTS = {
  ar: {
    heroSubtitle: 'نحو بيئة آمنة خالية تماماً من المخاطر',
    homeAbout: 'نتميز بتوفير حلول هندسية متكاملة تشمل التوريد والتركيب والصيانة لكافة أنظمة مكافحة الحريق والإنذار المبكر، وفق اشتراطات الدفاع المدني وكود البناء السعودي SBC، لضمان بيئة عمل آمنة ومستدامة.',
    homeServicesHeader: 'استعراض سريع لأبرز مجالات عملنا، ويمكنك الانتقال لصفحة الخدمات للاطلاع على كافة التفريعات والمواصفات.',
    homeProductsHeader: 'منتجات معتمدة من كبرى المصانع العالمية مع شهادات الاختبار والامتثال لسابر وكود البناء.',
    aboutHeader: 'تعرف على هويتنا، رؤيتنا، رسالتنا، وهيكل العمل الاحترافي الذي يقودنا نحو تحقيق أعلى معايير الأمان وحماية الأرواح والممتلكات.',
    brandIdentity: 'دليل الهوية البصرية الرسمية لشركة تسامي الأعمال لأنظمة السلامة: الألوان المعتمدة، الخطوط، ونماذج المطبوعات الرسمية.',
    servicesHeader: 'نقدم منظومة متكاملة من حلول الوقاية ومكافحة الحرائق، مصممة وفق اشتراطات الدفاع المدني وكود البناء السعودي SBC، مع تفريعات متخصصة لكل قطاع.',
    servicesCta: 'فريقنا الهندسي في تسامي الأعمال على أتم الاستعداد لزيارة الموقع، فحص متطلبات كود البناء، وتقديم عرض فني ومالي متكامل ومعتمد.',
    productsHeader: 'توريد موثوق ومباشر لكبرى المشاريع والمنشآت في المملكة، مصحوب بشهادات الجودة والمطابقة ومقاطع توضيحية لطريقة التنفيذ.',
    contactHeader: 'يسعدنا الرد على استفساراتكم الهندسية، استقبال طلبات التسعير، وتحديد مواعيد المعاينات الميدانية لمشاريعكم.',
  },
  en: {
    heroSubtitle: 'Towards a Hazard-Free Environment',
    homeAbout: 'We deliver comprehensive turnkey fire protection and alarm engineering solutions, ensuring full statutory compliance with Civil Defense and Saudi Building Code (SBC).',
    homeServicesHeader: 'A quick overview of our primary domains. Explore the full services page for complete sub-branches.',
    homeProductsHeader: 'Approved products and systems with international certifications (UL, FM, Saber).',
    aboutHeader: 'Discover our corporate vision, leadership, and certified team driving excellence in fire safety.',
    brandIdentity: 'Official visual identity guidelines: primary colors, typography, corporate stationary, and certified brand elements.',
    servicesHeader: 'Turnkey fire protection and early detection solutions tailored to statutory codes and industry standards.',
    servicesCta: 'Our licensed engineers are ready to survey your facility, evaluate building codes, and prepare a statutory compliance proposal.',
    productsHeader: 'Direct certified procurement for kingdom-wide infrastructure with complete test certificates and installation guides.',
    contactHeader: 'We are delighted to assist with your engineering queries, quotation requests, and site inspections.',
  },
};

const MULTI_FIELD_BINDINGS = {
  heroDescription: [{ label: 'الفقرة التعريفية للهيرو', path: ['hero', 'description'] }],
  footerAbout: [{ label: 'نبذة الشركة في التذييل', path: ['footer', 'aboutText'] }],
  orgChart: [{ label: 'المقدمة أسفل عنوان الهيكل التنظيمي', path: ['orgChart', 'subtitle'] }],
  projectsHeader: [{ label: 'مقدمة قسم المشاريع', path: ['projects', 'subtitle'] }],
  aboutStory: [
    { label: 'الفقرة الافتتاحية (Lead)', path: ['about', 'lead'] },
    { label: 'الفقرة الثانية', path: ['about', 'paragraph2'] },
    { label: 'الفقرة الثالثة', path: ['about', 'paragraph3'] },
  ],
  ceoMessage: [
    { label: 'الفقرة الأولى من كلمة المدير التنفيذي', path: ['ceo', 'p1'] },
    { label: 'الفقرة الثانية', path: ['ceo', 'p2'] },
    { label: 'الفقرة الثالثة', path: ['ceo', 'p3'] },
  ],
  visionMission: [
    { label: 'نص الرسالة (Mission)', path: ['missionVision', 'mission', 'content'] },
    { label: 'نص الرؤية (Vision)', path: ['missionVision', 'vision', 'content'] },
  ],
  contactBanner: [
    { label: 'وصف بانر الدعوة للتواصل', path: ['ctaBanner', 'desc'] },
    { label: 'الوصف التعريفي لقنوات التواصل', path: ['contact', 'subtitle'] },
  ],
};

function getNestedValue(obj, path) {
  let cur = obj;
  for (const key of path) {
    if (cur == null) return '';
    cur = cur[key];
  }
  return typeof cur === 'string' ? cur : '';
}

function StyleControlsPanel({ styleCfg = {}, onChangeField }) {
  const currentFont = styleCfg.fontFamily || 'default';
  const currentSize = styleCfg.fontSize || 'default';
  const numericSize = currentSize !== 'default' ? parseInt(currentSize, 10) || 16 : 16;
  const currentWeight = styleCfg.fontWeight || 'default';
  const currentLineHeight = styleCfg.lineHeight || 'default';
  const currentLetterSpacing = styleCfg.letterSpacing || 'default';
  const currentAlign = styleCfg.textAlign || 'center';
  const currentColor = styleCfg.color || '';
  const currentBgColor = styleCfg.backgroundColor || '';
  const currentBorderColor = styleCfg.borderColor || '';
  const isItalic = styleCfg.fontStyle === 'italic';
  const isUnderline = styleCfg.textDecoration === 'underline';

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-3 text-xs">
      {/* Primary Grid: Font, Size (+slider), Align, Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Font Family */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            نوع الخط
          </label>
          <select
            value={currentFont}
            onChange={(e) => onChangeField('fontFamily', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#c59a45]"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} style={{ fontFamily: opt.css }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Preset + Custom Pixel Control */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              حجم الخط
            </label>
            <span className="text-[10px] font-mono font-bold text-[#9a752a] dark:text-[#dfb76c]">
              {currentSize === 'default' ? 'افتراضي' : currentSize}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <select
              value={FONT_SIZE_OPTIONS.some((o) => o.id === currentSize) ? currentSize : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') onChangeField('fontSize', e.target.value);
              }}
              className="flex-1 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#c59a45]"
            >
              {FONT_SIZE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
              {!FONT_SIZE_OPTIONS.some((o) => o.id === currentSize) && (
                <option value="custom">مخصص ({currentSize})</option>
              )}
            </select>
            <input
              type="number"
              min={10}
              max={64}
              value={numericSize}
              onChange={(e) => {
                const v = Math.max(10, Math.min(64, Number(e.target.value) || 14));
                onChangeField('fontSize', `${v}px`);
              }}
              title="تحديد الحجم بالبكسل"
              className="w-16 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#0f172a] dark:text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#c59a45]"
            />
          </div>
          <input
            type="range"
            min={10}
            max={48}
            value={numericSize}
            onChange={(e) => onChangeField('fontSize', `${e.target.value}px`)}
            className="w-full mt-1.5 accent-[#c59a45] h-1.5 cursor-pointer"
          />
        </div>

        {/* Alignment / Position */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            الموقع / المحاذاة
          </label>
          <div className="grid grid-cols-4 gap-1 bg-white dark:bg-[#131c31] p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {ALIGN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeField('textAlign', opt.id)}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                  currentAlign === opt.id
                    ? 'bg-[#c59a45] text-[#0b1120] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Color Presets + Picker + Hex Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
            لون النص
          </label>
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#131c31] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {COLOR_PRESETS.filter((c) => c.value).map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChangeField('color', preset.value)}
                title={preset.label}
                className={`w-5 h-5 rounded-full border transition ${
                  currentColor === preset.value
                    ? 'ring-2 ring-[#c59a45] ring-offset-1 scale-110 border-white'
                    : 'border-slate-300 dark:border-slate-600 hover:scale-110'
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
            <input
              type="color"
              value={currentColor || '#0f172a'}
              onChange={(e) => onChangeField('color', e.target.value)}
              title="اختيار لون نص مخصص"
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => onChangeField('color', e.target.value)}
              placeholder="#HEX"
              dir="ltr"
              className="w-20 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[10px] font-mono text-[#0f172a] dark:text-white"
            />
            {currentColor && (
              <button
                type="button"
                onClick={() => onChangeField('color', '')}
                className="text-[10px] font-bold text-slate-500 hover:text-red-600 mr-auto"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Controls Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#162d6c] dark:text-[#93c5fd] hover:text-[#c59a45] transition"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>خيارات متقدمة (السماكة، التباعد، لون الخلفية والإطار)</span>
        {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {showAdvanced && (
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Font Weight + Style toggles */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              سماكة ونمط الخط
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={currentWeight}
                onChange={(e) => onChangeField('fontWeight', e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold text-[11px]"
              >
                {FONT_WEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onChangeField('fontStyle', isItalic ? 'normal' : 'italic')}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-serif italic font-bold transition ${
                  isItalic
                    ? 'bg-[#c59a45] text-[#0b1120] border-[#c59a45]'
                    : 'bg-slate-50 dark:bg-[#0b1120] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="خط مائل"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => onChangeField('textDecoration', isUnderline ? 'none' : 'underline')}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] underline font-bold transition ${
                  isUnderline
                    ? 'bg-[#c59a45] text-[#0b1120] border-[#c59a45]'
                    : 'bg-slate-50 dark:bg-[#0b1120] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="تسطير"
              >
                U
              </button>
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                تباعد الأسطر
              </label>
              <select
                value={currentLineHeight}
                onChange={(e) => onChangeField('lineHeight', e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold text-[11px]"
              >
                {LINE_HEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                تباعد الأحرف
              </label>
              <select
                value={currentLetterSpacing}
                onChange={(e) => onChangeField('letterSpacing', e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold text-[11px]"
              >
                {LETTER_SPACING_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              لون خلفية الفقرة
            </label>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-[#0b1120] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {BG_COLOR_PRESETS.filter((b) => b.value).map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChangeField('backgroundColor', preset.value)}
                  title={preset.label}
                  className={`w-5 h-5 rounded-md border transition ${
                    currentBgColor === preset.value
                      ? 'ring-2 ring-[#c59a45] scale-110 border-white'
                      : 'border-slate-300 dark:border-slate-600 hover:scale-110'
                  }`}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
              <input
                type="color"
                value={currentBgColor || '#f8fafc'}
                onChange={(e) => onChangeField('backgroundColor', e.target.value)}
                title="لون خلفية مخصص"
                className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
              {currentBgColor && (
                <button
                  type="button"
                  onClick={() => onChangeField('backgroundColor', '')}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 mr-auto"
                >
                  شفاف
                </button>
              )}
            </div>
          </div>

          {/* Border Color */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              لون إطار الفقرة
            </label>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-[#0b1120] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {['#c59a45', '#162d6c', '#1d4ed8', '#059669', '#dc2626', '#cbd5e1'].map((bc) => (
                <button
                  key={bc}
                  type="button"
                  onClick={() => onChangeField('borderColor', bc)}
                  className={`w-5 h-5 rounded-md border-2 transition ${
                    currentBorderColor === bc ? 'ring-2 ring-[#c59a45] scale-110' : 'hover:scale-110'
                  }`}
                  style={{ borderColor: bc, backgroundColor: 'transparent' }}
                />
              ))}
              <input
                type="color"
                value={currentBorderColor || '#c59a45'}
                onChange={(e) => onChangeField('borderColor', e.target.value)}
                title="لون إطار مخصص"
                className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent"
              />
              {currentBorderColor && (
                <button
                  type="button"
                  onClick={() => onChangeField('borderColor', '')}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 mr-auto"
                >
                  بدون إطار
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TypographyManagerTab({
  localData,
  setLocalData,
  langTab,
  syncTypoBothLangs,
  setSyncTypoBothLangs,
  typoPageFilter,
  setTypoPageFilter,
  updateNested,
  updateParagraphStyle,
  resetParagraphStyle,
  resetAllParagraphStyles,
  applyParagraphStyleToAll,
}) {
  const [subMode, setSubMode] = useState('all'); // 'all' | 'custom' | 'builtin'
  const [openTextEditors, setOpenTextEditors] = useState({});
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState(null);

  // New custom paragraph draft state
  const [newPara, setNewPara] = useState({
    title: '',
    html: '',
    placement: 'home:afterHero',
    order: 1,
    maxWidth: 'max-w-7xl',
    visible: true,
    alsoOtherLang: true,
    style: {
      fontFamily: 'cairo',
      fontSize: '16px',
      fontWeight: 'default',
      fontStyle: 'normal',
      textDecoration: 'none',
      lineHeight: '1.85',
      letterSpacing: 'default',
      textAlign: 'center',
      color: '',
      backgroundColor: '',
      borderColor: '',
    },
  });

  const customParagraphs = Array.isArray(localData?.[langTab]?.customParagraphs)
    ? localData[langTab].customParagraphs
    : [];

  const filteredCustom = customParagraphs.filter((item) => {
    if (typoPageFilter === 'الكل') return true;
    const placeMeta = PARAGRAPH_PLACEMENTS.find((p) => p.id === item.placement);
    return placeMeta?.page === typoPageFilter;
  });

  const filteredBuiltin = PARAGRAPH_DEFINITIONS.filter(
    (def) => typoPageFilter === 'الكل' || def.page === typoPageFilter
  );

  const handleAddCustomParagraph = () => {
    const plain = (newPara.html || '').replace(/<[^>]*>/g, '').trim();
    if (!plain && !newPara.title.trim()) {
      alert('الرجاء إدخال عنوان أو نص الفقرة قبل الإضافة.');
      return;
    }

    const id = `cp_${Date.now()}`;
    const entry = {
      id,
      title: newPara.title.trim(),
      html: newPara.html,
      placement: newPara.placement,
      order: Number(newPara.order) || 1,
      maxWidth: newPara.maxWidth || 'max-w-7xl',
      visible: newPara.visible !== false,
      style: { ...newPara.style },
    };

    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const targets = newPara.alsoOtherLang ? ['ar', 'en'] : [langTab];
      targets.forEach((l) => {
        if (!next[l]) next[l] = {};
        if (!Array.isArray(next[l].customParagraphs)) next[l].customParagraphs = [];
        next[l].customParagraphs.push(JSON.parse(JSON.stringify(entry)));
      });
      return next;
    });

    setNewPara((prev) => ({
      ...prev,
      title: '',
      html: '',
      order: (Number(prev.order) || 1) + 1,
    }));
    setShowNewForm(false);
    setEditingCustomId(id);
  };

  const updateCustomItem = (id, updater) => {
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const list = next?.[langTab]?.customParagraphs || [];
      next[langTab].customParagraphs = list.map((item) =>
        item.id === id ? updater(item) : item
      );
      return next;
    });
  };

  const deleteCustomItem = (id) => {
    if (!window.confirm('هل تريد حذف هذه الفقرة نهائياً؟')) return;
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const targets = syncTypoBothLangs ? ['ar', 'en'] : [langTab];
      targets.forEach((l) => {
        if (Array.isArray(next?.[l]?.customParagraphs)) {
          next[l].customParagraphs = next[l].customParagraphs.filter((item) => item.id !== id);
        }
      });
      return next;
    });
  };

  const duplicateCustomToOtherLang = (item) => {
    const otherLang = langTab === 'ar' ? 'en' : 'ar';
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[otherLang]) next[otherLang] = {};
      if (!Array.isArray(next[otherLang].customParagraphs)) next[otherLang].customParagraphs = [];
      const exists = next[otherLang].customParagraphs.some((p) => p.id === item.id);
      if (exists) {
        next[otherLang].customParagraphs = next[otherLang].customParagraphs.map((p) =>
          p.id === item.id ? JSON.parse(JSON.stringify(item)) : p
        );
      } else {
        next[otherLang].customParagraphs.push(JSON.parse(JSON.stringify(item)));
      }
      return next;
    });
    alert(otherLang === 'en' ? 'تم نسخ الفقرة إلى النسخة الإنجليزية بنجاح!' : 'تم نسخ الفقرة إلى النسخة العربية بنجاح!');
  };

  const toggleTextEditor = (key) => {
    setOpenTextEditors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getOverrideValue = (key) => {
    const existing = localData?.[langTab]?.paragraphOverrides?.[key];
    if (typeof existing === 'string') return existing;
    return DEFAULT_PARAGRAPH_TEXTS[langTab]?.[key] || '';
  };

  const setOverrideValue = (key, val) => {
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[langTab]) next[langTab] = {};
      if (!next[langTab].paragraphOverrides) next[langTab].paragraphOverrides = {};
      next[langTab].paragraphOverrides[key] = val;
      return next;
    });
  };

  const clearOverrideValue = (key) => {
    setLocalData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next?.[langTab]?.paragraphOverrides) {
        delete next[langTab].paragraphOverrides[key];
      }
      return next;
    });
  };

  const groupedPlacements = Array.from(new Set(PARAGRAPH_PLACEMENTS.map((p) => p.page)));

  return (
    <div className="space-y-6 animate-fade-in font-cairo">
      {/* Header & Global Controls */}
      <div className="bg-gradient-to-r from-[#162d6c]/10 via-[#c59a45]/15 to-transparent p-5 rounded-2xl border border-[#c59a45]/30 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-black text-[#0f172a] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c59a45]" />
              <span>إدارة وتنسيق الفقرات والمحتوى النصي المتقدم</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              أضف فقرات جديدة وحدد موقعها الدقيق في أي صفحة، حرّر النصوص والمحتوى بأدوات متكاملة، وتحكم بالألوان والخطوط والأحجام لجميع فقرات الموقع.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewForm((v) => !v)}
              className="btn-flashy-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-[#0b1120] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewForm ? 'إغلاق نموذج الإضافة' : 'إضافة فقرة جديدة'}</span>
            </button>

            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncTypoBothLangs}
                onChange={(e) => setSyncTypoBothLangs(e.target.checked)}
                className="accent-[#c59a45] w-4 h-4"
              />
              <span>مزامنة التنسيق للغتين (AR + EN)</span>
            </label>

            <button
              type="button"
              onClick={resetAllParagraphStyles}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Sub-mode + Page Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
          <div className="flex flex-wrap items-center gap-1.5">
            {['الكل', ...Array.from(new Set(PARAGRAPH_DEFINITIONS.map((d) => d.page)))].map((pageName) => (
              <button
                key={pageName}
                type="button"
                onClick={() => setTypoPageFilter(pageName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  typoPageFilter === pageName
                    ? 'bg-[#162d6c] text-white shadow-sm'
                    : 'bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#c59a45]'
                }`}
              >
                {pageName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#131c31] p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
            {[
              { id: 'all', label: `الكل (${filteredCustom.length + filteredBuiltin.length})` },
              { id: 'custom', label: `الفقرات المضافة (${filteredCustom.length})` },
              { id: 'builtin', label: `فقرات الموقع (${filteredBuiltin.length})` },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSubMode(m.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  subMode === m.id
                    ? 'bg-[#c59a45] text-[#0b1120]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NEW CUSTOM PARAGRAPH CREATOR */}
      {showNewForm && (
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#c59a45]/60 bg-white dark:bg-[#131c31] shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#c59a45]/20 text-[#9a752a] dark:text-[#dfb76c] flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm sm:text-base font-black text-[#0f172a] dark:text-white">
                  إضافة فقرة جديدة مع تحديد الموقع والتنسيق الكامل
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  اختر مكان الظهور الدقيق في صفحات الموقع ثم صغ المحتوى واضبط الألوان والخطوط
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              إغلاق ✕
            </button>
          </div>

          {/* Exact Placement, Order, Width, Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#c59a45]" />
                <span>الموقع الدقيق في صفحات الموقع</span>
              </label>
              <select
                value={newPara.placement}
                onChange={(e) => setNewPara((p) => ({ ...p, placement: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-[#c59a45]"
              >
                {groupedPlacements.map((pageGroup) => (
                  <optgroup key={pageGroup} label={`📄 ${pageGroup}`}>
                    {PARAGRAPH_PLACEMENTS.filter((pl) => pl.page === pageGroup).map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                عرض حاوية الفقرة
              </label>
              <select
                value={newPara.maxWidth}
                onChange={(e) => setNewPara((p) => ({ ...p, maxWidth: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold"
              >
                {MAX_WIDTH_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                الترتيب
              </label>
              <input
                type="number"
                min={1}
                value={newPara.order}
                onChange={(e) => setNewPara((p) => ({ ...p, order: Number(e.target.value) || 1 }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-mono text-center"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 cursor-pointer font-bold text-[11px]">
                <input
                  type="checkbox"
                  checked={newPara.alsoOtherLang}
                  onChange={(e) => setNewPara((p) => ({ ...p, alsoOtherLang: e.target.checked }))}
                  className="accent-[#c59a45]"
                />
                <span>إضافة للغتين</span>
              </label>
            </div>

            <div className="md:col-span-12">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                عنوان الفقرة (اختياري)
              </label>
              <input
                type="text"
                value={newPara.title}
                onChange={(e) => setNewPara((p) => ({ ...p, title: e.target.value }))}
                placeholder="مثال: إعلان هام لعملائنا في مكة المكرمة / التزامنا بالجودة..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Full Rich Text Content Editor */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
              محتوى ونص الفقرة (محرر النصوص الكامل)
            </label>
            <RichTextEditor
              value={newPara.html}
              onChange={(html) => setNewPara((p) => ({ ...p, html }))}
              dir={langTab === 'ar' ? 'rtl' : 'ltr'}
              previewStyle={resolveStyleConfig(newPara.style) || {}}
              placeholder="اكتب نص الفقرة هنا واستخدم شريط الأدوات للتنسيق والألوان والقوائم والروابط..."
            />
          </div>

          {/* Advanced Typography & Color Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 space-y-3">
            <h6 className="text-xs font-black text-[#0f172a] dark:text-white">
              إعدادات الخط والحجم والألوان والمحاذاة للفقرة الجديدة
            </h6>
            <StyleControlsPanel
              styleCfg={newPara.style}
              onChangeField={(field, val) =>
                setNewPara((p) => ({ ...p, style: { ...p.style, [field]: val } }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleAddCustomParagraph}
              className="btn-flashy-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-[#0b1120] shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>إدراج الفقرة في الموقع المحدد</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: ADDED CUSTOM PARAGRAPHS */}
      {(subMode === 'all' || subMode === 'custom') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c59a45]" />
              <span>الفقرات المضافة ومواقعها الدقيقة ({filteredCustom.length})</span>
            </h5>
            {!showNewForm && (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="text-xs font-bold text-[#1d4ed8] dark:text-[#60a5fa] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة فقرة جديدة</span>
              </button>
            )}
          </div>

          {filteredCustom.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-[#131c31]/60 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لا توجد فقرات مخصصة مضافة حالياً ضمن هذا التصنيف. يمكنك إضافة فقرات جديدة وتحديد موقعها بدقة في أي صفحة.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustom.map((item) => {
                const placeMeta = PARAGRAPH_PLACEMENTS.find((p) => p.id === item.placement);
                const resolved = resolveStyleConfig(item.style) || {};
                const isExpanded = editingCustomId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                      item.visible !== false
                        ? 'bg-white dark:bg-[#131c31] border-[#c59a45]/40 shadow-sm'
                        : 'bg-slate-100/70 dark:bg-[#0b1120]/70 border-slate-200 dark:border-slate-800 opacity-75'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#162d6c] text-white">
                            {placeMeta?.page || 'مخصص'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{placeMeta?.label || item.placement}</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                            ترتيب: #{item.order || 1}
                          </span>
                        </div>
                        <h6 className="text-sm font-black text-[#0f172a] dark:text-white">
                          {item.title || 'فقرة نصية مخصصة (بدون عنوان)'}
                        </h6>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateCustomItem(item.id, (p) => ({ ...p, order: Math.max(1, (Number(p.order) || 1) - 1) }))}
                          title="تقديم الترتيب للأعلى"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#c59a45]/20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCustomItem(item.id, (p) => ({ ...p, order: (Number(p.order) || 1) + 1 }))}
                          title="تأخير الترتيب للأسفل"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#c59a45]/20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateCustomItem(item.id, (p) => ({ ...p, visible: p.visible === false }))}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${
                            item.visible !== false
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{item.visible !== false ? 'ظاهرة' : 'مخفية'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateCustomToOtherLang(item)}
                          title="نسخ إلى اللغة الأخرى"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#1d4ed8] dark:text-[#93c5fd] text-[10px] font-bold"
                        >
                          <Copy className="w-3 h-3" />
                          <span>نسخ للغة الأخرى</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCustomId(isExpanded ? null : item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#162d6c] text-white text-[10px] font-bold"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isExpanded ? 'طي المحرر' : 'تحرير النص والموقع'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomItem(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100"
                          title="حذف الفقرة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div
                      style={resolved}
                      className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0b1120]"
                    >
                      {item.title && (
                        <div className="font-black text-sm mb-1" style={{ textAlign: resolved.textAlign || 'center', color: resolved.color }}>
                          {item.title}
                        </div>
                      )}
                      <div
                        className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-[#1d4ed8] [&_a]:underline"
                        style={resolved}
                        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(item.html || item.content || '') }}
                      />
                    </div>

                    {/* Expanded Editor */}
                    {isExpanded && (
                      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                          <div className="md:col-span-5">
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              الموقع الدقيق في الصفحات
                            </label>
                            <select
                              value={item.placement}
                              onChange={(e) => updateCustomItem(item.id, (p) => ({ ...p, placement: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
                            >
                              {groupedPlacements.map((pageGroup) => (
                                <optgroup key={pageGroup} label={`📄 ${pageGroup}`}>
                                  {PARAGRAPH_PLACEMENTS.filter((pl) => pl.page === pageGroup).map((pl) => (
                                    <option key={pl.id} value={pl.id}>
                                      {pl.label}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              عرض الحاوية
                            </label>
                            <select
                              value={item.maxWidth || 'max-w-7xl'}
                              onChange={(e) => updateCustomItem(item.id, (p) => ({ ...p, maxWidth: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-semibold"
                            >
                              {MAX_WIDTH_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-4">
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              عنوان الفقرة (اختياري)
                            </label>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => updateCustomItem(item.id, (p) => ({ ...p, title: e.target.value }))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
                            />
                          </div>
                        </div>

                        <RichTextEditor
                          value={item.html || ''}
                          onChange={(html) => updateCustomItem(item.id, (p) => ({ ...p, html }))}
                          dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                          previewStyle={resolved}
                        />

                        <StyleControlsPanel
                          styleCfg={item.style || {}}
                          onChangeField={(field, val) =>
                            updateCustomItem(item.id, (p) => ({
                              ...p,
                              style: { ...(p.style || {}), [field]: val },
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: EXISTING SITE PARAGRAPHS (TEXT EDITING + ADVANCED STYLING) */}
      {(subMode === 'all' || subMode === 'builtin') && (
        <div className="space-y-3 pt-2">
          <h5 className="text-sm font-black text-[#0f172a] dark:text-white">
            تنسيق وتحرير فقرات الموقع الأساسية ({filteredBuiltin.length})
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBuiltin.map((def) => {
              const cfg = localData?.[langTab]?.typography?.[def.key] || {};
              const resolvedStyle = resolveStyleConfig(cfg) || {};
              const currentColor = cfg.color || '';
              const isTextOpen = Boolean(openTextEditors[def.key]);
              const multiFields = MULTI_FIELD_BINDINGS[def.key];
              const hasOverride = Boolean(localData?.[langTab]?.paragraphOverrides?.[def.key]);

              return (
                <div
                  key={def.key}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0b1120] space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-md bg-[#c59a45]/15 text-[#9a752a] dark:text-[#dfb76c] mb-1">
                        {def.page}
                      </span>
                      <h5 className="text-sm font-black text-[#0f172a] dark:text-white">
                        {def.label}
                      </h5>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1.5 flex-shrink-0">
                      {def.editableText && (
                        <button
                          type="button"
                          onClick={() => toggleTextEditor(def.key)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                            isTextOpen
                              ? 'bg-[#c59a45] text-[#0b1120]'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-[#9a752a] dark:text-[#dfb76c] hover:bg-[#c59a45] hover:text-[#0b1120]'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isTextOpen ? 'إخفاء محرر النص' : 'تحرير النص والمحتوى'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => applyParagraphStyleToAll(def.key)}
                        className="px-2.5 py-1 rounded-lg bg-[#162d6c]/10 dark:bg-[#162d6c]/40 text-[#162d6c] dark:text-[#93c5fd] hover:bg-[#162d6c] hover:text-white text-[10px] font-bold transition"
                        title="نسخ هذا التنسيق إلى جميع الفقرات"
                      >
                        تعميم على الكل
                      </button>
                      <button
                        type="button"
                        onClick={() => resetParagraphStyle(def.key)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-700 text-[10px] font-bold transition"
                      >
                        افتراضي
                      </button>
                    </div>
                  </div>

                  {/* Inline Rich Text Content Editor for Built-in Paragraphs */}
                  {def.editableText && isTextOpen && (
                    <div className="space-y-3 p-3.5 rounded-xl bg-white dark:bg-[#131c31] border border-[#c59a45]/40">
                      {multiFields ? (
                        multiFields.map((mf, mIdx) => (
                          <div key={mIdx} className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-[#162d6c] dark:text-[#93c5fd]">
                              {mf.label}
                            </label>
                            <RichTextEditor
                              value={getNestedValue(localData?.[langTab], mf.path)}
                              onChange={(html) => updateNested([langTab, ...mf.path], html)}
                              dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                              minHeight="95px"
                              previewStyle={resolvedStyle}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-[#162d6c] dark:text-[#93c5fd]">
                              محتوى الفقرة ({langTab === 'ar' ? 'العربية' : 'English'})
                            </label>
                            {hasOverride && (
                              <button
                                type="button"
                                onClick={() => clearOverrideValue(def.key)}
                                className="text-[10px] font-bold text-red-600 hover:underline"
                              >
                                استعادة النص الأصلي
                              </button>
                            )}
                          </div>
                          <RichTextEditor
                            value={getOverrideValue(def.key)}
                            onChange={(html) => setOverrideValue(def.key, html)}
                            dir={langTab === 'ar' ? 'rtl' : 'ltr'}
                            minHeight="100px"
                            previewStyle={resolvedStyle}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Advanced Style Controls */}
                  <StyleControlsPanel
                    styleCfg={cfg}
                    onChangeField={(field, val) => updateParagraphStyle(def.key, field, val)}
                  />

                  {/* Live Preview */}
                  <div
                    className={`p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 ${
                      currentColor && ['#ffffff', '#e2e8f0', '#dfb76c'].includes(currentColor.toLowerCase()) && !cfg.backgroundColor
                        ? 'bg-slate-900'
                        : 'bg-white dark:bg-[#131c31]'
                    }`}
                  >
                    <span className="block text-[9px] font-bold text-slate-400 mb-1">
                      معاينة مباشرة:
                    </span>
                    <div
                      className="w-full text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                      style={resolvedStyle}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeRichHtml(
                          multiFields
                            ? getNestedValue(localData?.[langTab], multiFields[0].path)
                            : getOverrideValue(def.key) ||
                                (langTab === 'ar'
                                  ? 'نتميز بتوفير خدمات متكاملة تشمل توريد وتركيب وصيانة أحدث أنظمة الإطفاء والإنذار وفق أعلى المعايير.'
                                  : 'Integrated engineering solutions for fire protection, alarm, and life safety systems.')
                        ),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
