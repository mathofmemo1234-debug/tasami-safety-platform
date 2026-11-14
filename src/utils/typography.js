export const FONT_OPTIONS = [
  { id: 'default', label: 'الافتراضي (Calibri / Cairo)', css: "'Calibri', 'Tajawal', 'Cairo', sans-serif" },
  { id: 'calibri', label: 'خط Calibri Bold', css: "'Calibri', 'Tajawal', 'Cairo', sans-serif" },
  { id: 'cairo', label: 'خط القاهرة (Cairo)', css: "'Cairo', sans-serif" },
  { id: 'tajawal', label: 'خط تجوال (Tajawal)', css: "'Tajawal', sans-serif" },
  { id: 'almarai', label: 'خط المراعي (Almarai)', css: "'Almarai', sans-serif" },
  { id: 'ibm_plex', label: 'خط IBM Plex العربي', css: "'IBM Plex Sans Arabic', sans-serif" },
  { id: 'amiri', label: 'خط أميري (نسخ كلاسيكي)', css: "'Amiri', serif" },
  { id: 'kufi', label: 'خط كوفي عربي (Noto Kufi)', css: "'Noto Kufi Arabic', sans-serif" },
  { id: 'ruqaa', label: 'خط الرقعة (Aref Ruqaa)', css: "'Aref Ruqaa', serif" },
  { id: 'montserrat', label: 'خط Montserrat (رسمي)', css: "'Montserrat', 'Cairo', sans-serif" },
  { id: 'tahoma', label: 'خط Tahoma', css: "'Tahoma', 'Cairo', sans-serif" },
];

export const FONT_SIZE_OPTIONS = [
  { id: 'default', label: 'الحجم الافتراضي' },
  { id: '11px', label: 'دقيق جداً (11px)' },
  { id: '12px', label: 'صغير جداً (12px)' },
  { id: '13px', label: 'صغير مدمج (13px)' },
  { id: '14px', label: 'صغير (14px)' },
  { id: '15px', label: 'متوسط مريح (15px)' },
  { id: '16px', label: 'متوسط قياسي (16px)' },
  { id: '18px', label: 'كبير (18px)' },
  { id: '20px', label: 'كبير جداً (20px)' },
  { id: '22px', label: 'عنوان فرعي (22px)' },
  { id: '24px', label: 'بارز (24px)' },
  { id: '28px', label: 'ضخم (28px)' },
  { id: '32px', label: 'عنوان رئيسي (32px)' },
  { id: '36px', label: 'بارز جداً (36px)' },
];

export const FONT_WEIGHT_OPTIONS = [
  { id: 'default', label: 'سماكة افتراضية' },
  { id: '300', label: 'خفيف (Light 300)' },
  { id: '400', label: 'عادي (Regular 400)' },
  { id: '500', label: 'متوسط (Medium 500)' },
  { id: '600', label: 'شبه عريض (SemiBold 600)' },
  { id: '700', label: 'عريض (Bold 700)' },
  { id: '800', label: 'ثقيل (ExtraBold 800)' },
  { id: '900', label: 'فائق الثقل (Black 900)' },
];

export const LINE_HEIGHT_OPTIONS = [
  { id: 'default', label: 'تباعد افتراضي' },
  { id: '1.35', label: 'مضغوط (1.35)' },
  { id: '1.6', label: 'قياسي (1.6)' },
  { id: '1.85', label: 'مريح (1.85)' },
  { id: '2.15', label: 'واسع (2.15)' },
];

export const LETTER_SPACING_OPTIONS = [
  { id: 'default', label: 'طبيعي' },
  { id: '0em', label: 'قياسي (0)' },
  { id: '0.02em', label: 'خفيف (+0.02em)' },
  { id: '0.05em', label: 'متوسط (+0.05em)' },
  { id: '0.1em', label: 'واسع (+0.1em)' },
];

export const ALIGN_OPTIONS = [
  { id: 'center', label: 'توسيط' },
  { id: 'right', label: 'يمين' },
  { id: 'left', label: 'يسار' },
  { id: 'justify', label: 'ضبط متساوٍ' },
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
  { value: '#475569', label: 'رمادي متوسط' },
  { value: '#e2e8f0', label: 'أبيض فضي' },
  { value: '#ffffff', label: 'أبيض ناصع' },
  { value: '#059669', label: 'أخضر زمردي' },
  { value: '#dc2626', label: 'أحمر تنبيهي' },
];

export const BG_COLOR_PRESETS = [
  { value: '', label: 'بدون خلفية (شفاف)' },
  { value: '#f8fafc', label: 'رمادي ثلجي فاتح' },
  { value: '#fef9c3', label: 'تمييز ذهبي ناعم' },
  { value: '#eff6ff', label: 'أزرق سماوي هادئ' },
  { value: '#ecfdf5', label: 'أخضر نعناعي هادئ' },
  { value: '#fff1f2', label: 'وردي تنبيهي هادئ' },
  { value: '#0f172a', label: 'ليلي داكن' },
  { value: '#162d6c', label: 'أزرق ملكي داكن' },
  { value: '#1e293b', label: 'رمادي أردوازي داكن' },
];

export const MAX_WIDTH_OPTIONS = [
  { id: 'max-w-2xl', label: 'ضيق مركّز' },
  { id: 'max-w-4xl', label: 'متوسط متوازن' },
  { id: 'max-w-6xl', label: 'عريض' },
  { id: 'max-w-7xl', label: 'عرض الحاوية الكامل' },
];

export const PARAGRAPH_PLACEMENTS = [
  // الصفحة الرئيسية
  { id: 'home:afterHero', page: 'الصفحة الرئيسية', label: 'بعد الواجهة الرئيسية (Hero) مباشرة' },
  { id: 'home:insideAbout', page: 'الصفحة الرئيسية', label: 'داخل بطاقة نبذة عن الشركة (أسفل النص)' },
  { id: 'home:afterAbout', page: 'الصفحة الرئيسية', label: 'بعد نبذة الشركة وقبل قسم الخدمات' },
  { id: 'home:afterServices', page: 'الصفحة الرئيسية', label: 'بعد قسم الخدمات وقبل المنتجات' },
  { id: 'home:afterProducts', page: 'الصفحة الرئيسية', label: 'بعد قسم المنتجات وقبل الاعتمادات' },
  { id: 'home:afterLicenses', page: 'الصفحة الرئيسية', label: 'أسفل الصفحة الرئيسية (بعد بانر الاعتمادات)' },

  // صفحة عن الشركة
  { id: 'about:top', page: 'عن الشركة', label: 'أعلى صفحة عن الشركة (بعد الترويسة)' },
  { id: 'about:afterStory', page: 'عن الشركة', label: 'بعد قصة الشركة وقبل كلمة الرئيس التنفيذي' },
  { id: 'about:afterCeo', page: 'عن الشركة', label: 'بعد كلمة الرئيس التنفيذي وقبل الرؤية' },
  { id: 'about:afterVision', page: 'عن الشركة', label: 'بعد الرؤية والرسالة والأهداف والقيم' },
  { id: 'about:afterOrgChart', page: 'عن الشركة', label: 'بعد الهيكل التنظيمي' },
  { id: 'about:afterBrand', page: 'عن الشركة', label: 'بعد الهوية البصرية' },
  { id: 'about:afterLicenses', page: 'عن الشركة', label: 'بعد التراخيص والاعتمادات' },
  { id: 'about:bottom', page: 'عن الشركة', label: 'أسفل صفحة عن الشركة (بعد المشاريع)' },

  // صفحة الخدمات
  { id: 'services:top', page: 'الخدمات', label: 'أعلى صفحة الخدمات (بعد الترويسة)' },
  { id: 'services:beforeGrid', page: 'الخدمات', label: 'قبل شبكة بطاقات الخدمات' },
  { id: 'services:afterGrid', page: 'الخدمات', label: 'بعد شبكة بطاقات الخدمات' },
  { id: 'services:afterTable', page: 'الخدمات', label: 'بعد جدول مراحل التنفيذ والمزايا' },
  { id: 'services:bottom', page: 'الخدمات', label: 'أسفل صفحة الخدمات (بعد بانر التواصل)' },

  // صفحة المنتجات
  { id: 'products:top', page: 'المنتجات', label: 'أعلى صفحة المنتجات (بعد الترويسة)' },
  { id: 'products:beforeGrid', page: 'المنتجات', label: 'قبل شبكة المنتجات' },
  { id: 'products:afterGrid', page: 'المنتجات', label: 'بعد شبكة المنتجات' },
  { id: 'products:bottom', page: 'المنتجات', label: 'أسفل صفحة المنتجات' },

  // صفحة تواصل معنا والتذييل
  { id: 'contact:top', page: 'تواصل معنا والتذييل', label: 'أعلى صفحة تواصل معنا (بعد الترويسة)' },
  { id: 'contact:afterBanner', page: 'تواصل معنا والتذييل', label: 'بعد بانر الدعوة للتواصل' },
  { id: 'contact:beforeMap', page: 'تواصل معنا والتذييل', label: 'قبل خريطة الموقع في قسم التواصل' },
  { id: 'contact:bottom', page: 'تواصل معنا والتذييل', label: 'أسفل صفحة تواصل معنا' },
  { id: 'footer:top', page: 'تواصل معنا والتذييل', label: 'أعلى التذييل العام (يظهر في كل الصفحات)' },
];

export const PARAGRAPH_DEFINITIONS = [
  // الصفحة الرئيسية
  { key: 'heroSubtitle', page: 'الصفحة الرئيسية', label: 'العنوان الفرعي للهيرو (نحو بيئة آمنة...)', editableText: true },
  { key: 'heroDescription', page: 'الصفحة الرئيسية', label: 'الفقرة التعريفية للهيرو', editableText: true },
  { key: 'heroPillars', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات الركائز الأربع في الهيرو', editableText: false },
  { key: 'homeAbout', page: 'الصفحة الرئيسية', label: 'فقرة نبذة عن الشركة (البطاقة الرئيسية)', editableText: true },
  { key: 'homeServicesHeader', page: 'الصفحة الرئيسية', label: 'فقرة مقدمة قسم الخدمات', editableText: true },
  { key: 'homeServicesCards', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات الخدمات المختصرة', editableText: false },
  { key: 'homeProductsHeader', page: 'الصفحة الرئيسية', label: 'فقرة مقدمة قسم المنتجات', editableText: true },
  { key: 'homeProductsCards', page: 'الصفحة الرئيسية', label: 'فقرات بطاقات المنتجات المختصرة', editableText: false },

  // صفحة عن الشركة
  { key: 'aboutHeader', page: 'عن الشركة', label: 'فقرة ترويسة صفحة عن الشركة', editableText: true },
  { key: 'aboutStory', page: 'عن الشركة', label: 'فقرات قصة الشركة ورؤية 2030', editableText: true },
  { key: 'ceoMessage', page: 'عن الشركة', label: 'فقرات كلمة الرئيس التنفيذي', editableText: true },
  { key: 'visionMission', page: 'عن الشركة', label: 'فقرات الرؤية والرسالة والأهداف والقيم', editableText: true },
  { key: 'orgChart', page: 'عن الشركة', label: 'فقرات الهيكل التنظيمي والأقسام', editableText: true },
  { key: 'projectsHeader', page: 'عن الشركة', label: 'فقرات سابقة الأعمال والمشاريع', editableText: true },
  { key: 'brandIdentity', page: 'عن الشركة', label: 'فقرة دليل الهوية البصرية', editableText: true },

  // صفحة الخدمات
  { key: 'servicesHeader', page: 'الخدمات', label: 'فقرة ترويسة صفحة الخدمات', editableText: true },
  { key: 'servicesCards', page: 'الخدمات', label: 'فقرات بطاقات الخدمات ومراحل التنفيذ', editableText: false },
  { key: 'servicesCta', page: 'الخدمات', label: 'فقرة طلب الدراسة الهندسية (أسفل الخدمات)', editableText: true },

  // صفحة المنتجات
  { key: 'productsHeader', page: 'المنتجات', label: 'فقرة ترويسة كتالوج المنتجات', editableText: true },
  { key: 'productsCards', page: 'المنتجات', label: 'فقرات وصف المنتجات في الكتالوج', editableText: false },

  // صفحة التواصل والتذييل
  { key: 'contactHeader', page: 'تواصل معنا والتذييل', label: 'فقرة ترويسة صفحة تواصل معنا', editableText: true },
  { key: 'contactBanner', page: 'تواصل معنا والتذييل', label: 'فقرات بانر التواصل والنموذج', editableText: true },
  { key: 'footerAbout', page: 'تواصل معنا والتذييل', label: 'فقرة نبذة الشركة في التذييل (Footer)', editableText: true },
];

export function resolveStyleConfig(cfg) {
  if (!cfg || typeof cfg !== 'object') return undefined;

  const style = {};

  if (cfg.fontFamily && cfg.fontFamily !== 'default') {
    const found = FONT_OPTIONS.find((f) => f.id === cfg.fontFamily);
    if (found) {
      style.fontFamily = found.css;
    } else if (cfg.fontFamily.trim() !== '') {
      style.fontFamily = cfg.fontFamily;
    }
  }

  if (cfg.fontSize && cfg.fontSize !== 'default') {
    style.fontSize = cfg.fontSize;
  }

  if (cfg.fontWeight && cfg.fontWeight !== 'default') {
    style.fontWeight = cfg.fontWeight;
  }

  if (cfg.fontStyle && cfg.fontStyle !== 'normal' && cfg.fontStyle !== 'default') {
    style.fontStyle = cfg.fontStyle;
  }

  if (cfg.textDecoration && cfg.textDecoration !== 'none' && cfg.textDecoration !== 'default') {
    style.textDecoration = cfg.textDecoration;
  }

  if (cfg.lineHeight && cfg.lineHeight !== 'default') {
    style.lineHeight = cfg.lineHeight;
  }

  if (cfg.letterSpacing && cfg.letterSpacing !== 'default') {
    style.letterSpacing = cfg.letterSpacing;
  }

  if (cfg.textAlign && cfg.textAlign !== 'default') {
    style.textAlign = cfg.textAlign;
  }

  if (cfg.color && cfg.color.trim() !== '') {
    style.color = cfg.color;
  }

  if (cfg.backgroundColor && cfg.backgroundColor.trim() !== '') {
    style.backgroundColor = cfg.backgroundColor;
    style.padding = cfg.padding || '12px 16px';
    style.borderRadius = cfg.borderRadius || '12px';
  }

  if (cfg.borderColor && cfg.borderColor.trim() !== '') {
    style.border = `1px solid ${cfg.borderColor}`;
    if (!style.padding) style.padding = cfg.padding || '12px 16px';
    if (!style.borderRadius) style.borderRadius = cfg.borderRadius || '12px';
  }

  return Object.keys(style).length > 0 ? style : undefined;
}

export function getParagraphStyle(content, lang, key) {
  const cfg = content?.[lang]?.typography?.[key];
  return resolveStyleConfig(cfg);
}

export function getParagraphOverride(content, lang, key) {
  const val = content?.[lang]?.paragraphOverrides?.[key];
  if (typeof val === 'string' && val.trim() !== '') {
    return val;
  }
  return null;
}

const ALLOWED_STYLE_PROPS = new Set([
  'color',
  'background-color',
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-align',
  'line-height',
  'letter-spacing',
]);

export function sanitizeRichHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  if (typeof DOMParser === 'undefined') {
    return rawHtml.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  const blockedTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'FORM']);

  const cleanNode = (node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === 1) {
        if (blockedTags.has(child.tagName)) {
          child.remove();
          continue;
        }
        // Strip event handlers & unsafe URLs
        for (const attr of Array.from(child.attributes)) {
          const name = attr.name.toLowerCase();
          const val = attr.value.trim();
          if (name.startsWith('on')) {
            child.removeAttribute(attr.name);
          } else if ((name === 'href' || name === 'src') && /^\s*(javascript|data|vbscript):/i.test(val)) {
            child.removeAttribute(attr.name);
          } else if (name === 'style') {
            const safeDecls = val
              .split(';')
              .map((d) => d.trim())
              .filter(Boolean)
              .filter((decl) => {
                const colonIdx = decl.indexOf(':');
                if (colonIdx === -1) return false;
                const prop = decl.slice(0, colonIdx).trim().toLowerCase();
                const propVal = decl.slice(colonIdx + 1).trim();
                return ALLOWED_STYLE_PROPS.has(prop) && !/expression|url\(/i.test(propVal);
              });
            if (safeDecls.length > 0) {
              child.setAttribute('style', safeDecls.join('; '));
            } else {
              child.removeAttribute('style');
            }
          }
        }
        if (child.tagName === 'A') {
          child.setAttribute('target', '_blank');
          child.setAttribute('rel', 'noopener noreferrer');
        }
        cleanNode(child);
      }
    }
  };

  cleanNode(doc.body);
  return doc.body.innerHTML;
}
