export const FONT_OPTIONS = [
  { id: 'default', label: 'الافتراضي (Calibri Bold)', css: "'Calibri', 'Tajawal', 'Cairo', sans-serif" },
  { id: 'calibri', label: 'خط Calibri Bold', css: "'Calibri', 'Tajawal', 'Cairo', sans-serif" },
  { id: 'cairo', label: 'خط القاهرة (Cairo)', css: "'Cairo', sans-serif" },
  { id: 'tajawal', label: 'خط تجوال (Tajawal)', css: "'Tajawal', sans-serif" },
  { id: 'amiri', label: 'خط أميري (نسخ كلاسيكي)', css: "'Amiri', serif" },
  { id: 'kufi', label: 'خط كوفي عربي (Noto Kufi)', css: "'Noto Kufi Arabic', sans-serif" },
  { id: 'ruqaa', label: 'خط الرقعة (Aref Ruqaa)', css: "'Aref Ruqaa', serif" },
  { id: 'tahoma', label: 'خط Tahoma', css: "'Tahoma', 'Cairo', sans-serif" },
];

export const FONT_SIZE_OPTIONS = [
  { id: 'default', label: 'الحجم الافتراضي' },
  { id: '12px', label: 'صغير جداً (12px)' },
  { id: '14px', label: 'صغير (14px)' },
  { id: '16px', label: 'متوسط قياسي (16px)' },
  { id: '18px', label: 'كبير (18px)' },
  { id: '20px', label: 'كبير جداً (20px)' },
  { id: '24px', label: 'بارز (24px)' },
  { id: '28px', label: 'ضخم (28px)' },
];

export const ALIGN_OPTIONS = [
  { id: 'center', label: 'توسيط (الافتراضي)' },
  { id: 'right', label: 'يمين' },
  { id: 'left', label: 'يسار' },
  { id: 'justify', label: 'ضبط متساوٍ (Justify)' },
];

export const COLOR_PRESETS = [
  { value: '', label: 'تلقائي (حسب الثيم)' },
  { value: '#0f172a', label: 'كحلي داكن' },
  { value: '#162d6c', label: 'أزرق ملكي' },
  { value: '#1d4ed8', label: 'أزرق ساطع' },
  { value: '#9a752a', label: 'ذهبي داكن' },
  { value: '#c59a45', label: 'ذهبي رسمي' },
  { value: '#dfb76c', label: 'ذهبي فاتح' },
  { value: '#334155', label: 'رمادي داكن' },
  { value: '#e2e8f0', label: 'أبيض فضي' },
  { value: '#ffffff', label: 'أبيض ناصع' },
  { value: '#059669', label: 'أخضر زمردي' },
];

export const PARAGRAPH_DEFINITIONS = [
  // الصفحة الرئيسية
  { key: 'heroSubtitle', page: 'الصفحة الرئيسية', label: 'العنوان الفرعي للهيرو (نحو بيئة آمنة...)' },
  { key: 'heroDescription', page: 'الصفحة الرئيسية', label: 'الفقرة التعريفية للهيرو' },
  { key: 'heroPillars', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات الركائز الأربع في الهيرو' },
  { key: 'homeAbout', page: 'الصفحة الرئيسية', label: 'فقرة نبذة عن الشركة (البطاقة الرئيسية)' },
  { key: 'homeServicesHeader', page: 'الصفحة الرئيسية', label: 'فقرة مقدمة قسم الخدمات' },
  { key: 'homeServicesCards', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات الخدمات المختصرة' },
  { key: 'homeProductsHeader', page: 'الصفحة الرئيسية', label: 'فقرة مقدمة قسم المنتجات' },
  { key: 'homeProductsCards', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات المنتجات المختصرة' },

  // صفحة عن الشركة
  { key: 'aboutHeader', page: 'عن الشركة', label: 'فقرة ترويسة صفحة عن الشركة' },
  { key: 'aboutStory', page: 'عن الشركة', label: 'فقرات قصة الشركة ورؤية 2030' },
  { key: 'ceoMessage', page: 'عن الشركة', label: 'فقرات كلمة الرئيس التنفيذي' },
  { key: 'visionMission', page: 'عن الشركة', label: 'فقرات الرؤية والرسالة والأهداف والقيم' },
  { key: 'orgChart', page: 'عن الشركة', label: 'فقرات الهيكل التنظيمي والأقسام' },
  { key: 'projectsHeader', page: 'عن الشركة', label: 'فقرات سابقة الأعمال والمشاريع' },
  { key: 'brandIdentity', page: 'عن الشركة', label: 'فقرة دليل الهوية البصرية' },

  // صفحة الخدمات
  { key: 'servicesHeader', page: 'الخدمات', label: 'فقرة ترويسة صفحة الخدمات' },
  { key: 'servicesCards', page: 'الخدمات', label: 'فقرات بطاقات الخدمات ومراحل التنفيذ' },
  { key: 'servicesCta', page: 'الخدمات', label: 'فقرة طلب الدراسة الهندسية (أسفل الخدمات)' },

  // صفحة المنتجات
  { key: 'productsHeader', page: 'المنتجات', label: 'فقرة ترويسة كتالوج المنتجات' },
  { key: 'productsCards', page: 'المنتجات', label: 'فقرات وصف المنتجات في الكتالوج' },

  // صفحة التواصل والتذييل
  { key: 'contactHeader', page: 'تواصل معنا والتذييل', label: 'فقرة ترويسة صفحة تواصل معنا' },
  { key: 'contactBanner', page: 'تواصل معنا والتذييل', label: 'فقرات بانر التواصل والنموذج' },
  { key: 'footerAbout', page: 'تواصل معنا والتذييل', label: 'فقرة نبذة الشركة في التذييل (Footer)' },
];

export function getParagraphStyle(content, lang, key) {
  const cfg = content?.[lang]?.typography?.[key];
  if (!cfg || typeof cfg !== 'object') return undefined;

  const style = {};

  if (cfg.fontFamily && cfg.fontFamily !== 'default') {
    const found = FONT_OPTIONS.find((f) => f.id === cfg.fontFamily);
    if (found) {
      style.fontFamily = found.css;
    }
  }

  if (cfg.fontSize && cfg.fontSize !== 'default') {
    style.fontSize = cfg.fontSize;
  }

  if (cfg.textAlign && cfg.textAlign !== 'default') {
    style.textAlign = cfg.textAlign;
  }

  if (cfg.color && cfg.color.trim() !== '') {
    style.color = cfg.color;
  }

  return Object.keys(style).length > 0 ? style : undefined;
}
