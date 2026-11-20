import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutGrid,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Wrench,
  Package,
  Zap,
  PhoneCall,
  Flame,
  BellRing,
  Droplets,
  ShieldCheck,
  Compass,
  HardHat,
  Calculator,
  Quote,
  Eye,
  Network,
  Award,
  FolderKanban,
  Palette,
  BookOpen,
  Star,
  QrCode,
  Shield,
  MessageCircle,
  MapPin,
  Phone,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Layers
} from 'lucide-react';
import { normalizeWhatsAppDigits } from '../utils/media';

const PANEL_WIDTH = 260;
const PANEL_GAP = 6;
const VIEWPORT_PADDING = 12;

function CascadingPanel({
  level,
  items,
  anchorRect,
  parentPanelRect,
  isAr,
  activeItemId,
  onHoverItem,
  onSelectItem,
  onEnterBridgeOrPanel,
  renderNextLevel
}) {
  const panelRef = useRef(null);
  const rowRefs = useRef(new Map());
  const [coords, setCoords] = useState(null);
  const [childAnchor, setChildAnchor] = useState(null);

  const ChildChevron = isAr ? ChevronLeft : ChevronRight;

  useLayoutEffect(() => {
    if (!panelRef.current || !anchorRect) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const actualRect = panelRef.current.getBoundingClientRect();
    const panelH = actualRect.height || 320;

    let left = 0;
    let openSide = 'left';

    if (level === 0) {
      // Root dropdown aligned under trigger button
      const preferredLeft = isAr ? anchorRect.right - PANEL_WIDTH : anchorRect.left;
      left = Math.max(VIEWPORT_PADDING, Math.min(preferredLeft, vw - PANEL_WIDTH - VIEWPORT_PADDING));
      const top = Math.max(VIEWPORT_PADDING, Math.min(anchorRect.bottom + 8, vh - panelH - VIEWPORT_PADDING));
      setCoords({ left, top, openSide: isAr ? 'left' : 'right' });
      return;
    }

    // Level 1+: Cascading submenu with automatic edge collision flip
    const refLeft = parentPanelRect ? parentPanelRect.left : anchorRect.left;
    const refRight = parentPanelRect ? parentPanelRect.right : anchorRect.right;

    const spaceLeft = refLeft - VIEWPORT_PADDING;
    const spaceRight = vw - refRight - VIEWPORT_PADDING;
    const preferLeft = isAr;

    if (preferLeft) {
      if (spaceLeft >= PANEL_WIDTH + PANEL_GAP || spaceLeft >= spaceRight) {
        openSide = 'left';
        left = Math.max(VIEWPORT_PADDING, refLeft - PANEL_GAP - PANEL_WIDTH);
      } else {
        openSide = 'right';
        left = Math.min(vw - PANEL_WIDTH - VIEWPORT_PADDING, refRight + PANEL_GAP);
      }
    } else {
      if (spaceRight >= PANEL_WIDTH + PANEL_GAP || spaceRight >= spaceLeft) {
        openSide = 'right';
        left = Math.min(vw - PANEL_WIDTH - VIEWPORT_PADDING, refRight + PANEL_GAP);
      } else {
        openSide = 'left';
        left = Math.max(VIEWPORT_PADDING, refLeft - PANEL_GAP - PANEL_WIDTH);
      }
    }

    const idealTop = anchorRect.top - 6;
    const maxTop = Math.max(VIEWPORT_PADDING, vh - panelH - VIEWPORT_PADDING);
    const top = Math.max(VIEWPORT_PADDING, Math.min(idealTop, maxTop));

    setCoords({ left, top, openSide });
  }, [level, anchorRect, parentPanelRect, isAr, items.length]);

  useLayoutEffect(() => {
    if (!activeItemId) {
      setChildAnchor(null);
      return;
    }
    const rowEl = rowRefs.current.get(activeItemId);
    const pRect = panelRef.current?.getBoundingClientRect();
    if (rowEl && pRect) {
      setChildAnchor({
        rowRect: rowEl.getBoundingClientRect(),
        panelRect: pRect
      });
    }
  }, [activeItemId, coords]);

  const activeItem = useMemo(
    () => items.find((it) => it.id === activeItemId && Array.isArray(it.children) && it.children.length > 0) || null,
    [items, activeItemId]
  );

  // Invisible hover bridge connecting trigger/parent panel to this panel
  const bridgeStyle = useMemo(() => {
    if (!coords || !anchorRect) return null;
    if (level === 0) {
      const bridgeTop = Math.max(0, anchorRect.bottom - 2);
      const bridgeHeight = Math.max(12, coords.top - bridgeTop + 4);
      return {
        position: 'fixed',
        top: bridgeTop,
        left: Math.min(anchorRect.left, coords.left),
        width: Math.max(anchorRect.width, PANEL_WIDTH),
        height: bridgeHeight,
        zIndex: 59
      };
    }

    const refLeft = parentPanelRect ? parentPanelRect.left : anchorRect.left;
    const refRight = parentPanelRect ? parentPanelRect.right : anchorRect.right;

    if (coords.openSide === 'left') {
      const bridgeLeft = coords.left + PANEL_WIDTH - 4;
      const bridgeWidth = Math.max(12, refLeft - bridgeLeft + 6);
      const bridgeTop = Math.max(VIEWPORT_PADDING, Math.min(anchorRect.top - 16, coords.top));
      const bridgeBottom = Math.min(window.innerHeight - VIEWPORT_PADDING, anchorRect.bottom + 24);
      return {
        position: 'fixed',
        top: bridgeTop,
        left: bridgeLeft,
        width: bridgeWidth,
        height: Math.max(48, bridgeBottom - bridgeTop),
        zIndex: 59 + level
      };
    }

    const bridgeLeft = refRight - 4;
    const bridgeWidth = Math.max(12, coords.left - bridgeLeft + 6);
    const bridgeTop = Math.max(VIEWPORT_PADDING, Math.min(anchorRect.top - 16, coords.top));
    const bridgeBottom = Math.min(window.innerHeight - VIEWPORT_PADDING, anchorRect.bottom + 24);
    return {
      position: 'fixed',
      top: bridgeTop,
      left: bridgeLeft,
      width: bridgeWidth,
      height: Math.max(48, bridgeBottom - bridgeTop),
      zIndex: 59 + level
    };
  }, [coords, anchorRect, parentPanelRect, level]);

  const animClass =
    level === 0
      ? 'animate-dropdown-flash'
      : coords?.openSide === 'left'
      ? 'animate-dropdown-flash-left'
      : 'animate-dropdown-flash-right';

  return (
    <>
      {bridgeStyle && (
        <div
          aria-hidden="true"
          style={bridgeStyle}
          onMouseEnter={onEnterBridgeOrPanel}
        />
      )}

      <div
        ref={panelRef}
        role="menu"
        onMouseEnter={onEnterBridgeOrPanel}
        style={{
          position: 'fixed',
          top: coords ? `${coords.top}px` : '-9999px',
          left: coords ? `${coords.left}px` : '-9999px',
          width: `${PANEL_WIDTH}px`,
          zIndex: 60 + level,
          visibility: coords ? 'visible' : 'hidden'
        }}
        className={`${coords ? animClass : ''} bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_14px_40px_-10px_rgba(0,35,102,0.14)] dark:shadow-2xl p-1.5`}
      >
        <div className="max-h-[70vh] overflow-y-auto space-y-0.5 pe-0.5">
          {items.map((item) => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isActive = activeItemId === item.id;
            const Icon = item.icon;

            const rowClasses = `dropdown-flash-item w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-start transition-colors duration-100 ${
              isActive
                ? 'bg-[#002366]/5 dark:bg-[#0b1120] text-[#002366] dark:text-[#D4AF37]'
                : 'text-[#0f172a] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#0b1120]/70 hover:text-[#002366] dark:hover:text-[#D4AF37]'
            }`;

            const innerContent = (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      item.isWhatsApp
                        ? 'border-[#25D366]/40 bg-white dark:bg-[#0b1120] text-[#25D366]'
                        : isActive
                        ? 'border-[#C5A059] bg-white dark:bg-[#131c31] text-[#C5A059]'
                        : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[#002366] dark:text-[#D4AF37]'
                    }`}
                  >
                    {Icon ? <Icon className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{item.label}</div>
                    {item.subtitle && (
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>
                {hasChildren ? (
                  <ChildChevron
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive ? 'text-[#C5A059]' : 'text-slate-400'
                    }`}
                  />
                ) : item.external ? (
                  <ExternalLink className="w-3 h-3 shrink-0 text-[#C5A059]" />
                ) : null}
              </>
            );

            if (item.href) {
              return (
                <a
                  key={item.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(item.id, el);
                    else rowRefs.current.delete(item.id);
                  }}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  role="menuitem"
                  onMouseEnter={() => onHoverItem(level, item)}
                  onClick={() => onSelectItem(item)}
                  className={rowClasses}
                >
                  {innerContent}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(item.id, el);
                  else rowRefs.current.delete(item.id);
                }}
                type="button"
                role="menuitem"
                onMouseEnter={() => onHoverItem(level, item)}
                onClick={() => onSelectItem(item)}
                className={rowClasses}
              >
                {innerContent}
              </button>
            );
          })}
        </div>
      </div>

      {activeItem && childAnchor && renderNextLevel(activeItem, childAnchor.rowRect, childAnchor.panelRect)}
    </>
  );
}

export default function SiteExplorerMenu({
  lang = 'ar',
  content,
  currentPage = 'home',
  onNavigate,
  onOpenConsultation,
  onOpenAdmin,
  onOpenPwa
}) {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [hoveredPath, setHoveredPath] = useState([]); // [level0ItemId, level1ItemId]
  const [mobileStack, setMobileStack] = useState([]); // breadcrumb nodes for mobile drill-down
  const [triggerRect, setTriggerRect] = useState(null);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const switchTimerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const syncViewport = () => setIsDesktop(mq.matches);
    syncViewport();
    mq.addEventListener('change', syncViewport);
    return () => mq.removeEventListener('change', syncViewport);
  }, []);

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (switchTimerRef.current) {
      clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
  }, []);

  const closeAll = useCallback(() => {
    clearTimers();
    setIsOpen(false);
    setHoveredPath([]);
    setMobileStack([]);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Close on Escape key or outside click/tap
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeAll();
      }
    };
    const handleScrollResize = () => {
      if (isDesktop && triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', handleScrollResize);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [isOpen, isDesktop, closeAll]);

  // Dynamic comprehensive site tree built from live content
  const siteTree = useMemo(() => {
    const langData = content?.[lang] || content?.ar || {};
    const contactCfg = langData.contact || {};
    const primaryPhone = contactCfg.phone1 || '+966 59 168 4133';
    const waDigits = normalizeWhatsAppDigits(contactCfg.whatsapp || primaryPhone);
    const waUrl = `https://wa.me/${waDigits}`;
    const mapsUrl =
      contactCfg.googleMapsUrl ||
      'https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%AA%D8%B3%D8%A7%D9%85%D9%8A+%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84%E2%80%AD/@21.3872248,39.8077324,17z';

    const orgNodes = Array.isArray(langData.orgChart?.nodes) ? langData.orgChart.nodes : [];
    const catalogCategories = Array.isArray(langData.productsCatalog?.categories)
      ? langData.productsCatalog.categories
      : [
          { id: 'networks', name: isAr ? 'شبكات الأنابيب والرشاشات' : 'Piping & Sprinklers' },
          { id: 'alarms', name: isAr ? 'أنظمة الإنذار والكواشف' : 'Alarms & Detectors' },
          { id: 'valves', name: isAr ? 'المحابس وصناديق الحريق' : 'Valves & Cabinets' },
          { id: 'suppression', name: isAr ? 'أنظمة الإخماد التلقائي' : 'Clean Suppression' },
          { id: 'pumps', name: isAr ? 'مضخات الحريق والمراوح' : 'Pumps & Fans' }
        ];
    const catalogItems = Array.isArray(langData.productsCatalog?.items)
      ? langData.productsCatalog.items
      : [];

    const navGo = (page, sectionId = null, filter = null, openCalc = false, knowledgeTab = null) => () => {
      onNavigate?.(page, sectionId, filter, openCalc, knowledgeTab);
    };

    const productCategoryNodes = [
      {
        id: 'prod-cat-all',
        label: isAr ? 'عرض جميع المنتجات' : 'All Products Catalog',
        subtitle: `${catalogItems.length} ${isAr ? 'منتج معتمد' : 'Certified Products'}`,
        icon: Package,
        action: navGo('products', 'products-grid', 'all')
      },
      ...catalogCategories
        .filter((cat) => cat.id !== 'all')
        .map((cat) => {
          const matchingItems = catalogItems.filter((it) => it.category === cat.id);
          return {
            id: `prod-cat-${cat.id}`,
            label: cat.name,
            subtitle: `${matchingItems.length} ${isAr ? 'صنف' : 'items'}`,
            icon: Package,
            action: navGo('products', 'products-grid', cat.id),
            children: matchingItems.map((prod) => ({
              id: `prod-item-${prod.id}`,
              label: isAr ? prod.ar : prod.en,
              subtitle: prod.specs ? prod.specs.split('/')[0].trim() : '',
              icon: ShieldCheck,
              action: navGo('products', `product-${prod.id}`, cat.id)
            }))
          };
        })
    ];

    return [
      {
        id: 'tree-home',
        label: isAr ? 'الصفحة الرئيسية' : 'Home',
        subtitle: isAr ? 'أقسام الواجهة الرئيسية' : 'Main Page Sections',
        icon: Home,
        action: navGo('home', 'home'),
        children: [
          {
            id: 'home-hero-node',
            label: isAr ? 'الواجهة الرئيسية والركائز' : 'Hero & Core Pillars',
            icon: Home,
            action: navGo('home', 'home')
          },
          {
            id: 'home-about-node',
            label: isAr ? 'نبذة عن تسامي' : 'Company Highlight',
            icon: Building2,
            action: navGo('home', 'home-about')
          },
          {
            id: 'home-services-node',
            label: isAr ? 'أبرز الخدمات الهندسية' : 'Featured Services',
            icon: Wrench,
            action: navGo('home', 'home-services')
          },
          {
            id: 'home-products-node',
            label: isAr ? 'مختارات المنتجات' : 'Featured Products',
            icon: Package,
            action: navGo('home', 'home-products')
          },
          {
            id: 'home-accred-node',
            label: isAr ? 'الاعتمادات الرسمية' : 'Official Accreditations',
            icon: Award,
            action: navGo('home', 'home-accreditations')
          },
          {
            id: 'home-hub-node',
            label: isAr ? 'المرجع الفني للدفاع المدني' : 'Civil Defense Knowledge Hub',
            icon: BookOpen,
            action: navGo('home', 'civil-defense-knowledge-hub'),
            children: [
              {
                id: 'hub-contracts',
                label: isAr ? 'عقود صيانة سلامة والبلدية' : 'Salama & Balady Contracts',
                icon: ShieldCheck,
                action: navGo('home', 'civil-defense-knowledge-hub', null, false, 'contracts')
              },
              {
                id: 'hub-comparison',
                label: isAr ? 'مقارنة أنظمة الإطفاء التلقائي' : 'Suppression Systems Matrix',
                icon: Flame,
                action: navGo('home', 'civil-defense-knowledge-hub', null, false, 'comparison')
              },
              {
                id: 'hub-sbc',
                label: isAr ? 'كود البناء SBC 801 وسابر' : 'SBC 801 & SABER',
                icon: Building2,
                action: navGo('home', 'civil-defense-knowledge-hub', null, false, 'sbc')
              },
              {
                id: 'hub-faq',
                label: isAr ? 'الأسئلة الشائعة للدفاع المدني' : 'Authoritative FAQ Hub',
                icon: BookOpen,
                action: navGo('home', 'civil-defense-knowledge-hub', null, false, 'faq')
              }
            ]
          },
          {
            id: 'home-reviews-node',
            label: isAr ? 'آراء وتقييمات العملاء' : 'Client Reviews & Ratings',
            icon: Star,
            action: navGo('home', 'customer-reviews')
          }
        ]
      },
      {
        id: 'tree-about',
        label: isAr ? 'عن الشركة' : 'About Us',
        subtitle: isAr ? 'الهوية والقيادة والمشاريع' : 'Leadership, Vision & Projects',
        icon: Building2,
        action: navGo('about', null),
        children: [
          {
            id: 'about-story',
            label: isAr ? 'قصة الشركة والنشأة' : 'Company Story',
            icon: Building2,
            action: navGo('about', 'about')
          },
          {
            id: 'about-ceo',
            label: isAr ? 'كلمة الرئيس التنفيذي' : 'CEO Message',
            subtitle: isAr ? 'أ. طه هندي' : 'Mr. Taha Hendy',
            icon: Quote,
            action: navGo('about', 'ceo')
          },
          {
            id: 'about-vision',
            label: isAr ? 'الرؤية والرسالة والقيم' : 'Vision, Mission & Values',
            icon: Eye,
            action: navGo('about', 'vision-values'),
            children: [
              {
                id: 'about-vision-only',
                label: isAr ? 'رؤيتنا' : 'Our Vision',
                icon: Eye,
                action: navGo('about', 'vision')
              },
              {
                id: 'about-mission-only',
                label: isAr ? 'رسالتنا' : 'Our Mission',
                icon: Compass,
                action: navGo('about', 'mission')
              },
              {
                id: 'about-goals-values',
                label: isAr ? 'الأهداف والقيم' : 'Goals & Values',
                icon: Award,
                action: navGo('about', 'vision-values')
              }
            ]
          },
          {
            id: 'about-org',
            label: isAr ? 'الهيكل التنظيمي' : 'Organizational Chart',
            icon: Network,
            action: navGo('about', 'org-chart'),
            children: orgNodes.map((node) => ({
              id: `org-node-${node.id}`,
              label: node.role,
              subtitle: node.name || node.desc,
              icon: Network,
              action: navGo('about', 'org-chart')
            }))
          },
          {
            id: 'about-brand',
            label: isAr ? 'دليل الهوية البصرية' : 'Brand Identity',
            icon: Palette,
            action: navGo('about', 'brand-identity')
          },
          {
            id: 'about-licenses',
            label: isAr ? 'التراخيص والشهادات' : 'Licenses & Certificates',
            icon: ShieldCheck,
            action: navGo('about', 'licenses')
          },
          {
            id: 'about-projects',
            label: isAr ? 'أبرز المشاريع' : 'Featured Projects',
            icon: FolderKanban,
            action: navGo('about', 'projects')
          }
        ]
      },
      {
        id: 'tree-services',
        label: isAr ? 'خدماتنا الهندسية' : 'Engineering Services',
        subtitle: isAr ? 'كافة الأنظمة والتفريعات' : 'All Fire & Safety Branches',
        icon: Wrench,
        action: navGo('services', null, 'all', false),
        children: [
          {
            id: 'srv-suppression',
            label: isAr ? 'أنظمة الإطفاء التلقائي' : 'Automatic Suppression',
            icon: Flame,
            action: navGo('services', 'services-grid', 'suppression'),
            children: [
              {
                id: 'srv-fm200',
                label: isAr ? 'نظام غاز FM-200 النظيف' : 'FM-200 Clean Agent',
                icon: Flame,
                action: navGo('services', 'service-fm200', 'suppression')
              },
              {
                id: 'srv-novec',
                label: isAr ? 'نظام سائل NOVEC 1230' : 'NOVEC 1230 Fluid',
                icon: Flame,
                action: navGo('services', 'service-novec', 'suppression')
              },
              {
                id: 'srv-aerosol',
                label: isAr ? 'أنظمة الأيروسول (Aerosol)' : 'Aerosol Suppression',
                icon: Flame,
                action: navGo('services', 'service-aerosol', 'suppression')
              },
              {
                id: 'srv-kitchen',
                label: isAr ? 'إطفاء المطابخ التجارية' : 'Commercial Kitchen Systems',
                icon: Flame,
                action: navGo('services', 'service-kitchen', 'suppression')
              },
              {
                id: 'srv-co2',
                label: isAr ? 'نظام غاز CO₂' : 'CO₂ Flooding Systems',
                icon: Flame,
                action: navGo('services', 'service-co2', 'suppression')
              }
            ]
          },
          {
            id: 'srv-alarm-smoke',
            label: isAr ? 'الإنذار والتحكم بالدخان' : 'Alarm & Smoke Control',
            icon: BellRing,
            action: navGo('services', 'services-grid', 'alarm-smoke'),
            children: [
              {
                id: 'srv-fire-alarm',
                label: isAr ? 'أنظمة الإنذار والكواشف الذكية' : 'Addressable Fire Alarms',
                icon: BellRing,
                action: navGo('services', 'service-fire-alarm', 'alarm-smoke')
              },
              {
                id: 'srv-smoke-control',
                label: isAr ? 'سحب الدخان وضغط السلالم' : 'Smoke Extraction & Pressurization',
                icon: BellRing,
                action: navGo('services', 'service-smoke-control', 'alarm-smoke')
              }
            ]
          },
          {
            id: 'srv-sprinklers-pumps',
            label: isAr ? 'الرشاشات والمضخات' : 'Sprinklers & Pumps',
            icon: Droplets,
            action: navGo('services', 'services-grid', 'sprinklers-pumps'),
            children: [
              {
                id: 'srv-sprinklers',
                label: isAr ? 'شبكات الرشاشات المائية' : 'Automatic Sprinkler Networks',
                icon: Droplets,
                action: navGo('services', 'service-sprinklers', 'sprinklers-pumps')
              },
              {
                id: 'srv-pumps',
                label: isAr ? 'محطات مضخات الحريق UL/FM' : 'UL/FM Fire Pump Sets',
                icon: Droplets,
                action: navGo('services', 'service-pumps-hydrants', 'sprinklers-pumps')
              }
            ]
          },
          {
            id: 'srv-maintenance',
            label: isAr ? 'الصيانة وتراخيص سلامة' : 'Maintenance & Salama Licenses',
            icon: ShieldCheck,
            action: navGo('services', 'services-grid', 'maintenance'),
            children: [
              {
                id: 'srv-maint-contracts',
                label: isAr ? 'عقود الصيانة الدورية' : 'Preventative Contracts',
                icon: ShieldCheck,
                action: navGo('services', 'service-maintenance-contracts', 'maintenance')
              },
              {
                id: 'srv-salamah',
                label: isAr ? 'تراخيص منصة سلامة' : 'Salamah Portal Licensing',
                icon: ShieldCheck,
                action: navGo('services', 'service-salamah-licensing', 'maintenance')
              }
            ]
          },
          {
            id: 'srv-engineering',
            label: isAr ? 'المخططات الهندسية (SBC)' : 'SBC Engineering Blueprints',
            icon: Compass,
            action: navGo('services', 'service-engineering-blueprints', 'engineering')
          },
          {
            id: 'srv-safety-gear',
            label: isAr ? 'طفايات الحريق ومعدات الوقاية' : 'Extinguishers & PPE',
            icon: HardHat,
            action: navGo('services', 'services-grid', 'safety-gear'),
            children: [
              {
                id: 'srv-extinguishers',
                label: isAr ? 'طفايات الحريق اليدوية' : 'Portable Extinguishers',
                icon: HardHat,
                action: navGo('services', 'service-fire-extinguishers', 'safety-gear')
              },
              {
                id: 'srv-ppe',
                label: isAr ? 'معدات الوقاية الشخصية (PPE)' : 'Personal Protective Equipment',
                icon: HardHat,
                action: navGo('services', 'service-ppe-equipment', 'safety-gear')
              }
            ]
          },
          {
            id: 'srv-calculator',
            label: isAr ? 'حاسبة السلامة الفورية' : 'Safety Cost Estimator',
            icon: Calculator,
            action: navGo('services', 'calculator-section', null, true)
          }
        ]
      },
      {
        id: 'tree-products',
        label: isAr ? 'كتالوج المنتجات' : 'Products Catalog',
        subtitle: isAr ? 'التصنيفات والمعدات المعتمدة' : 'Categories & Certified Gear',
        icon: Package,
        action: navGo('products', 'products-grid', 'all'),
        children: productCategoryNodes
      },
      {
        id: 'tree-actions',
        label: isAr ? 'أدوات وإجراءات سريعة' : 'Quick Actions',
        subtitle: isAr ? 'المعاينة، الحاسبة، والإدارة' : 'Survey, Estimator & Portal',
        icon: Zap,
        action: () => onOpenConsultation?.(),
        children: [
          {
            id: 'act-consult',
            label: isAr ? 'طلب معاينة هندسية وعرض سعر' : 'Request Survey & Quote',
            icon: Zap,
            action: () => onOpenConsultation?.()
          },
          {
            id: 'act-calc',
            label: isAr ? 'حاسبة السلامة التقديرية' : 'Safety Requirements Calculator',
            icon: Calculator,
            action: navGo('services', 'calculator-section', null, true)
          },
          {
            id: 'act-pwa',
            label: isAr ? 'تثبيت التطبيق والباركود (PWA)' : 'Install App & QR Code',
            icon: QrCode,
            action: () => onOpenPwa?.()
          },
          {
            id: 'act-admin',
            label: isAr ? 'لوحة تحكم مدير الموقع' : 'Admin Dashboard',
            icon: Shield,
            action: () => onOpenAdmin?.()
          }
        ]
      },
      {
        id: 'tree-contact',
        label: isAr ? 'تواصل معنا' : 'Contact Us',
        subtitle: isAr ? 'مكة المكرمة • القنوات المباشرة' : 'Makkah HQ • Direct Channels',
        icon: PhoneCall,
        action: navGo('contact', 'contact'),
        children: [
          {
            id: 'cnt-page',
            label: isAr ? 'صفحة التواصل ونموذج الطلب' : 'Contact Form & Details',
            icon: PhoneCall,
            action: navGo('contact', 'contact')
          },
          {
            id: 'cnt-whatsapp',
            label: isAr ? 'واتساب مباشر' : 'Direct WhatsApp',
            subtitle: primaryPhone,
            icon: MessageCircle,
            href: waUrl,
            external: true,
            isWhatsApp: true
          },
          {
            id: 'cnt-phone',
            label: isAr ? 'اتصال هاتفي مباشر' : 'Call Directly',
            subtitle: primaryPhone,
            icon: Phone,
            href: `tel:${primaryPhone.replace(/\s+/g, '')}`,
            external: false
          },
          {
            id: 'cnt-map',
            label: isAr ? 'موقع المقر على خرائط Google' : 'Headquarters on Google Maps',
            icon: MapPin,
            href: mapsUrl,
            external: true
          }
        ]
      }
    ];
  }, [content, lang, isAr, onNavigate, onOpenConsultation, onOpenPwa, onOpenAdmin]);

  // Desktop hover handlers with instant first open & 75ms intent debounce between open siblings
  const handleContainerEnter = () => {
    if (!isDesktop) return;
    clearTimers();
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setIsOpen(true);
  };

  const handleContainerLeave = () => {
    if (!isDesktop) return;
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredPath([]);
    }, 220);
  };

  const handleHoverItem = (level, item) => {
    if (!isDesktop) return;
    if (switchTimerRef.current) {
      clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }

    const currentAtLevel = hoveredPath[level];
    if (currentAtLevel === item.id) return;

    const applyHover = () => {
      setHoveredPath((prev) => {
        const next = prev.slice(0, level);
        next[level] = item.id;
        return next;
      });
    };

    if (!currentAtLevel) {
      applyHover();
    } else {
      switchTimerRef.current = setTimeout(applyHover, 45);
    }
  };

  const handleSelectItem = (item) => {
    if (item.action) {
      item.action();
    }
    closeAll();
  };

  const handleTriggerClick = () => {
    if (!isDesktop) {
      if (isOpen) {
        closeAll();
      } else {
        setMobileStack([]);
        setIsOpen(true);
      }
      return;
    }

    if (isOpen) {
      closeAll();
    } else {
      if (triggerRef.current) {
        setTriggerRect(triggerRef.current.getBoundingClientRect());
      }
      setIsOpen(true);
    }
  };

  const renderLevel = (parentItem, anchorRect, parentPanelRect, level) => {
    if (!parentItem || !Array.isArray(parentItem.children) || parentItem.children.length === 0) {
      return null;
    }
    return (
      <CascadingPanel
        key={`${parentItem.id}-lvl-${level}`}
        level={level}
        items={parentItem.children}
        anchorRect={anchorRect}
        parentPanelRect={parentPanelRect}
        isAr={isAr}
        activeItemId={hoveredPath[level]}
        onHoverItem={handleHoverItem}
        onSelectItem={handleSelectItem}
        onEnterBridgeOrPanel={handleContainerEnter}
        renderNextLevel={(nextItem, nextRowRect, nextPanelRect) =>
          renderLevel(nextItem, nextRowRect, nextPanelRect, level + 1)
        }
      />
    );
  };

  // Current mobile drill-down level
  const currentMobileNode = mobileStack.length > 0 ? mobileStack[mobileStack.length - 1] : null;
  const currentMobileItems = currentMobileNode ? currentMobileNode.children || [] : siteTree;
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const NextIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isAr ? 'دليل الموقع — تصفح جميع الأقسام' : 'Site Guide — Explore all sections'}
        title={isAr ? 'تصفح جميع أقسام ومنتجات الموقع' : 'Explore all sections & products'}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
          isOpen
            ? 'border-[#C5A059] bg-[#002366] text-white'
            : 'border-[#002366]/20 dark:border-slate-700 bg-white dark:bg-[#131c31] text-[#002366] dark:text-[#D4AF37] hover:border-[#C5A059]'
        }`}
      >
        <LayoutGrid className={`w-3.5 h-3.5 ${isOpen ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`} />
        <span>{isAr ? 'دليل الموقع' : 'Site Guide'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop Cascading Mega-Tree Menu */}
      {isOpen && isDesktop && triggerRect && (
        <CascadingPanel
          level={0}
          items={siteTree}
          anchorRect={triggerRect}
          parentPanelRect={null}
          isAr={isAr}
          activeItemId={hoveredPath[0]}
          onHoverItem={handleHoverItem}
          onSelectItem={handleSelectItem}
          onEnterBridgeOrPanel={handleContainerEnter}
          renderNextLevel={(nextItem, nextRowRect, nextPanelRect) =>
            renderLevel(nextItem, nextRowRect, nextPanelRect, 1)
          }
        />
      )}

      {/* Mobile / Tablet Hierarchical Drill-Down Panel */}
      {isOpen && !isDesktop && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="animate-dropdown-flash fixed inset-x-3 top-[66px] sm:top-[74px] max-h-[76vh] flex flex-col bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-[65] overflow-hidden"
        >
          {/* Breadcrumb / Header Bar */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-[#0b1120]">
            {currentMobileNode ? (
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileStack((prev) => prev.slice(0, -1))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#002366] dark:text-[#D4AF37] hover:border-[#C5A059] shrink-0"
                >
                  <BackIcon className="w-3.5 h-3.5" />
                  <span>{isAr ? 'رجوع' : 'Back'}</span>
                </button>
                <span className="text-xs font-bold text-[#002366] dark:text-white truncate">
                  {currentMobileNode.label}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-[#002366] dark:text-white">
                <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
                <span>{isAr ? 'دليل الموقع الشامل' : 'Complete Site Guide'}</span>
              </div>
            )}

            {currentMobileNode && (currentMobileNode.action || currentMobileNode.href) ? (
              <button
                type="button"
                onClick={() => handleSelectItem(currentMobileNode)}
                className="px-3 py-1 rounded-full bg-[#002366] text-white text-[11px] font-semibold shrink-0"
              >
                {isAr ? 'فتح القسم' : 'Open'}
              </button>
            ) : (
              <button
                type="button"
                onClick={closeAll}
                className="text-xs font-semibold text-slate-400 hover:text-[#002366] dark:hover:text-[#D4AF37]"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            )}
          </div>

          {/* Drill-Down List */}
          <div
            key={currentMobileNode?.id || 'root'}
            className={`flex-1 overflow-y-auto p-2 space-y-1 ${
              currentMobileNode
                ? isAr
                  ? 'animate-dropdown-flash-left'
                  : 'animate-dropdown-flash-right'
                : ''
            }`}
          >
            {currentMobileItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  className="dropdown-flash-item flex items-center gap-1 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-[#0b1120]/60 transition-colors"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={() => handleSelectItem(item)}
                      className="flex-1 flex items-center gap-2.5 p-2.5 text-start min-w-0"
                    >
                      <span
                        className={`w-8 h-8 rounded-lg border bg-white dark:bg-[#0b1120] flex items-center justify-center shrink-0 ${
                          item.isWhatsApp
                            ? 'border-[#25D366]/40 text-[#25D366]'
                            : 'border-slate-200/80 dark:border-slate-700 text-[#002366] dark:text-[#D4AF37]'
                        }`}
                      >
                        {Icon ? <Icon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#0f172a] dark:text-white truncate">
                          {item.label}
                        </div>
                        {item.subtitle && (
                          <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                        )}
                      </div>
                      {item.external && <ExternalLink className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (hasChildren && !item.action) {
                          setMobileStack((prev) => [...prev, item]);
                        } else if (hasChildren) {
                          setMobileStack((prev) => [...prev, item]);
                        } else {
                          handleSelectItem(item);
                        }
                      }}
                      className="flex-1 flex items-center gap-2.5 p-2.5 text-start min-w-0"
                    >
                      <span className="w-8 h-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#0b1120] flex items-center justify-center shrink-0 text-[#002366] dark:text-[#D4AF37]">
                        {Icon ? <Icon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#0f172a] dark:text-white truncate">
                          {item.label}
                        </div>
                        {item.subtitle && (
                          <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                        )}
                      </div>
                    </button>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setMobileStack((prev) => [...prev, item])}
                      aria-label={isAr ? `عرض فروع ${item.label}` : `Explore ${item.label}`}
                      className="px-2.5 py-2 me-1 rounded-lg border border-slate-200/80 dark:border-slate-700 text-[#C5A059] hover:border-[#C5A059] flex items-center gap-1 shrink-0"
                    >
                      <span className="text-[10px] font-bold">{item.children.length}</span>
                      <NextIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
