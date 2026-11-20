import React, { useEffect, useMemo, useState } from 'react';
import {
  Headphones,
  Send,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { normalizeWhatsAppDigits } from '../utils/media';
import {
  getOrCreateSupportSessionId,
  subscribeSupportTickets,
  submitSupportTicket,
  appendSupportReply
} from '../services/firebase';

const DEFAULT_FAQS_AR = [
  {
    id: 'faq-1',
    category: 'التوريد والمشاريع',
    question: 'ما هي مدة التوريد وتنفيذ أنظمة السلامة ومكافحة الحريق؟',
    answer:
      'يتم توفير وتوريد منتجات السلامة القياسية خلال 24 إلى 72 ساعة داخل مكة المكرمة وجدة، وللمشاريع الهندسية يتم إعداد جدول زمني دقيق بعد المعاينة الفنية مباشرة.'
  },
  {
    id: 'faq-2',
    category: 'الاعتمادات والتراخيص',
    question: 'هل المنتجات والتركيبات معتمدة لدى الدفاع المدني وبوابة سلامة؟',
    answer:
      'نعم، شركة تسامي الأعمال مرخصة رسمياً ومصنفة في بوابة سلامة، وجميع المضخات والرشاشات واللوحات والأنابيب مطابقة لـ SBC 801 ومعتمدة UL / FM / SABER.'
  },
  {
    id: 'faq-3',
    category: 'عقود الصيانة',
    question: 'هل تقدمون عقود صيانة دورية ورفع تقارير سلامة للدفاع المدني؟',
    answer:
      'نعم، نوفر عقود صيانة وقائية سنوية وربع سنوية شاملة الفحص وإصدار شهادات وتقارير الإنجاز الفنية المعتمدة إلكترونياً.'
  },
  {
    id: 'faq-4',
    category: 'الدعم الفني',
    question: 'كيف يمكنني الحصول على عرض سعر فني أو معاينة موقع؟',
    answer:
      'يمكنك إرسال سؤالك أو مخطط المشروع هنا مباشرة، أو التواصل الفوري معنا عبر زر الواتساب (+966 59 168 4133) وسيرد عليك المهندس المختص.'
  }
];

const DEFAULT_FAQS_EN = [
  {
    id: 'faq-1',
    category: 'Supply & Delivery',
    question: 'How fast can you supply and install fire protection equipment?',
    answer:
      'Standard certified safety items are dispatched within 24–72 hours in Makkah and Jeddah, while turnkey engineered projects follow an approved schedule right after site survey.'
  },
  {
    id: 'faq-2',
    category: 'Compliance',
    question: 'Are your systems Civil Defense & Salamah portal certified?',
    answer:
      'Yes, Tasaami Al-Aamal is licensed on the Saudi Civil Defense Salamah portal and supplies UL, FM, SABER, and SBC 801 compliant systems.'
  },
  {
    id: 'faq-3',
    category: 'Maintenance',
    question: 'Do you provide periodic maintenance contracts?',
    answer:
      'Yes, we provide scheduled preventive maintenance and certified digital compliance reports for all commercial, residential, and industrial facilities.'
  }
];

function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.82 14.07c-.24.69-1.41 1.32-1.96 1.4-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5.01-4.37-5.16-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.05-2.52.27-.3.6-.38.8-.38h.58c.19 0 .44-.07.69.53.26.62.88 2.15.96 2.3.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.54-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.15 1.03 2.12 1.35 2.42 1.5.3.15.48.13.66-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.34.07.12.07.7-.17 1.39z" />
    </svg>
  );
}

export default function FloatingSupportDock({
  lang = 'ar',
  content,
  externalOpenSignal = 0
}) {
  const isAr = lang === 'ar';
  const contact = content?.[lang]?.contact || {};
  const supportCfg = content?.[lang]?.techSupport || {};

  const primaryWaDigits = normalizeWhatsAppDigits(
    contact.whatsapp || contact.phone1 || '+966 591684133'
  );
  const secondaryWaDigits = contact.phone2
    ? normalizeWhatsAppDigits(contact.phone2)
    : '966533480098';
  const displayPrimaryPhone = contact.phone1 || '+966 59 168 4133';

  const whatsappText = isAr
    ? 'السلام عليكم، أرغب بالتواصل مع شركة تسامي الأعمال للسلامة للاستفسار عن المنتجات والخدمات.'
    : 'Hello, I would like to connect with Tasaami Al-Aamal Safety regarding your products and services.';
  const whatsappUrl = `https://wa.me/${primaryWaDigits}?text=${encodeURIComponent(whatsappText)}`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('instant'); // 'instant' | 'live'
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [sessionId] = useState(() => getOrCreateSupportSessionId());

  // New question state
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [questionCategory, setQuestionCategory] = useState(
    isAr ? 'استفسار فني عن منتج' : 'Technical Product Inquiry'
  );
  const [questionText, setQuestionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState('');
  const [followUpDrafts, setFollowUpDrafts] = useState({});

  useEffect(() => {
    if (externalOpenSignal > 0) {
      setIsOpen(true);
    }
  }, [externalOpenSignal]);

  useEffect(() => {
    const unsub = subscribeSupportTickets({
      sessionId,
      onUpdate: (list) => setTickets(list)
    });
    return () => unsub();
  }, [sessionId]);

  const faqs = useMemo(() => {
    const list = Array.isArray(supportCfg.faqs) && supportCfg.faqs.length > 0
      ? supportCfg.faqs
      : isAr
      ? DEFAULT_FAQS_AR
      : DEFAULT_FAQS_EN;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (f) =>
        (f.question || '').toLowerCase().includes(q) ||
        (f.answer || '').toLowerCase().includes(q) ||
        (f.category || '').toLowerCase().includes(q)
    );
  }, [supportCfg.faqs, isAr, searchTerm]);

  const answeredCount = useMemo(
    () =>
      tickets.filter(
        (t) =>
          t.status === 'answered' ||
          (Array.isArray(t.replies) && t.replies.some((r) => r.sender === 'admin'))
      ).length,
    [tickets]
  );

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setSubmitting(true);
    setSubmitFeedback('');
    try {
      const res = await submitSupportTicket({
        sessionId,
        visitorName: visitorName.trim() || (isAr ? 'زائر الموقع' : 'Visitor'),
        phone: visitorPhone.trim(),
        category: questionCategory,
        question: questionText.trim(),
        lang
      });
      if (res.success) {
        setQuestionText('');
        setSubmitFeedback(
          isAr
            ? 'تم استلام سؤالك! سيصلك رد فريق الدعم الفني في هذه النافذة فوراً.'
            : 'Question received! Our technical support team will reply right here shortly.'
        );
        setActiveMode('live');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitorReply = async (ticketId) => {
    const txt = (followUpDrafts[ticketId] || '').trim();
    if (!txt) return;
    setFollowUpDrafts((prev) => ({ ...prev, [ticketId]: '' }));
    await appendSupportReply(ticketId, {
      sender: 'visitor',
      senderName: visitorName.trim() || (isAr ? 'أنت' : 'You'),
      text: txt,
      status: 'open'
    });
  };

  const popupEnabled = supportCfg.enabled !== false;
  const supportLabel = supportCfg.title || (isAr ? 'الدعم الفني' : 'Technical Support');
  const whatsappLabel = isAr ? 'واتساب الشركة' : 'WhatsApp';

  return (
    <>
      {/* Global Floating Dock: Icons-Only (Royal Blue Support + Gold WhatsApp) */}
      <div
        className={`fixed bottom-4 sm:bottom-6 ${
          isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        } z-40 flex flex-col gap-2.5 items-center`}
      >
        {/* Technical Support Icon-Only Button */}
        {popupEnabled && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={supportLabel}
            title={supportLabel}
            className="group relative w-12 h-12 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white border border-[#C5A059]/60 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          >
            <Headphones className="w-5 h-5" />
            {answeredCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                {answeredCount}
              </span>
            )}
            <span
              className={`hidden sm:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1/2 -translate-y-1/2 ${
                isAr ? 'left-14' : 'right-14'
              } whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#002366] text-white text-[11px] font-semibold shadow-md border border-[#C5A059]/40`}
            >
              {supportLabel}
            </span>
          </button>
        )}

        {/* WhatsApp Icon-Only Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
          title={isAr ? `واتساب (${displayPrimaryPhone})` : `WhatsApp (${displayPrimaryPhone})`}
          className="group relative w-12 h-12 rounded-full bg-[#C5A059] hover:bg-[#b58f47] text-white border border-[#C5A059] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#002366]"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <span
            className={`hidden sm:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1/2 -translate-y-1/2 ${
              isAr ? 'left-14' : 'right-14'
            } whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#002366] text-white text-[11px] font-semibold shadow-md border border-[#C5A059]/40`}
          >
            {whatsappLabel}
          </span>
        </a>
      </div>

      {/* Technical Support Instant Q&A Popup Window */}
      {popupEnabled && isOpen && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={`fixed bottom-20 sm:bottom-24 ${
            isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          } z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[80vh] flex flex-col rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200`}
        >
          {/* Popup Header */}
          <div className="bg-[#002366] px-4 py-3.5 text-white flex items-center justify-between gap-3 border-b border-[#C5A059]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#C5A059]/60 flex items-center justify-center text-[#D4AF37]">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">
                    {supportLabel}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#D4AF37] text-[10px] font-semibold">
                    {isAr ? 'متصل' : 'Online'}
                  </span>
                </div>
                <p className="text-[11px] text-white/75">
                  {supportCfg.subtitle ||
                    (isAr
                      ? 'إجابات فورية من فريق السلامة والهندسة'
                      : 'Instant answers from our engineering team')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              aria-label={isAr ? 'إغلاق الدعم الفني' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 bg-white dark:bg-[#131c31] p-1 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode('instant')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeMode === 'instant'
                  ? 'bg-[#002366] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#002366]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة الفورية' : 'Instant Answers'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('live')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeMode === 'live'
                  ? 'bg-[#002366] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#002366]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'اسأل الدعم الفني' : 'Ask Support'}</span>
              {tickets.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#C5A059] text-white">
                  {tickets.length}
                </span>
              )}
            </button>
          </div>

          {/* Popup Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#0b1120]">
            {activeMode === 'instant' ? (
              <>
                {/* Welcome Banner */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {supportCfg.welcomeMessage ||
                    (isAr
                      ? 'أهلاً بك في الدعم الفني لشركة تسامي الأعمال. ابحث عن إجابتك الفورية أدناه أو أرسل سؤالك مباشرة للفريق المختص.'
                      : 'Welcome to Tasaami Technical Support. Search instant answers below or send your question directly to our engineers.')}
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search
                    className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                      isAr ? 'right-3' : 'left-3'
                    }`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      isAr ? 'ابحث في الأسئلة الفورية...' : 'Search instant Q&A...'
                    }
                    className={`w-full ${
                      isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'
                    } py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#002366]`}
                  />
                </div>

                {/* Instant FAQs */}
                <div className="space-y-2">
                  {faqs.map((faq) => {
                    const expanded = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(expanded ? null : faq.id)}
                          className="w-full p-3 flex items-start justify-between gap-2 text-start hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                        >
                          <div>
                            {faq.category && (
                              <span className="inline-block text-[10px] font-semibold text-[#C5A059] dark:text-[#D4AF37] mb-0.5">
                                {faq.category}
                              </span>
                            )}
                            <p className="text-xs font-bold text-[#002366] dark:text-white leading-snug">
                              {faq.question}
                            </p>
                          </div>
                          {expanded ? (
                            <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                        {expanded && (
                          <div className="px-3 pb-3 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-white dark:bg-[#0b1120]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {faqs.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? 'لم يتم العثور على إجابة مطابقة — انتقل إلى تبويب «اسأل الدعم الفني» لإرسال سؤالك.'
                        : 'No matching FAQ found — switch to "Ask Support" to send your question.'}
                    </div>
                  )}
                </div>

                {/* Quick CTA to Live Ask */}
                <button
                  type="button"
                  onClick={() => setActiveMode('live')}
                  className="w-full py-2.5 px-4 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isAr
                      ? 'لديك سؤال خاص؟ أرسله الآن للرد الفوري'
                      : 'Have a specific question? Ask our team'}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Live Submit Form */}
                <form
                  onSubmit={handleSubmitQuestion}
                  className="bg-white dark:bg-[#131c31] rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={isAr ? 'الاسم (اختياري)' : 'Name (optional)'}
                      className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
                    />
                    <input
                      type="tel"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder={isAr ? 'رقم الجوال / واتساب' : 'Phone / WhatsApp'}
                      className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
                      dir="ltr"
                    />
                  </div>

                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs font-semibold text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
                  >
                    <option value={isAr ? 'استفسار فني عن منتج' : 'Technical Product Inquiry'}>
                      {isAr ? 'استفسار فني عن منتج' : 'Technical Product Inquiry'}
                    </option>
                    <option value={isAr ? 'طلب عرض سعر وتوريد' : 'Quotation & Supply'}>
                      {isAr ? 'طلب عرض سعر وتوريد' : 'Quotation & Supply'}
                    </option>
                    <option value={isAr ? 'صيانة واعتمادات الدفاع المدني' : 'Maintenance & Approvals'}>
                      {isAr ? 'صيانة واعتمادات الدفاع المدني' : 'Maintenance & Approvals'}
                    </option>
                    <option value={isAr ? 'دعم عام' : 'General Support'}>
                      {isAr ? 'دعم عام' : 'General Support'}
                    </option>
                  </select>

                  <textarea
                    rows={2}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder={
                      isAr
                        ? 'اكتب سؤالك الفوري هنا وسيتم الرد عليك مباشرة...'
                        : 'Write your question here for an instant support reply...'
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
                  />

                  <button
                    type="submit"
                    disabled={submitting || !questionText.trim()}
                    className="w-full py-2 px-4 rounded-full bg-[#002366] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {submitting
                        ? isAr
                          ? 'جاري الإرسال...'
                          : 'Sending...'
                        : isAr
                        ? 'إرسال السؤال للدعم الفني'
                        : 'Send to Technical Support'}
                    </span>
                  </button>

                  {submitFeedback && (
                    <p className="text-[11px] font-semibold text-[#002366] dark:text-[#D4AF37]">
                      {submitFeedback}
                    </p>
                  )}
                </form>

                {/* Conversation Thread History */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {isAr ? 'محادثاتك وردود الدعم الفني' : 'Your Support Conversations'}
                  </h4>

                  {tickets.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? 'لا توجد أسئلة مرسلة في هذه الجلسة بعد.'
                        : 'No support questions sent yet in this session.'}
                    </div>
                  ) : (
                    tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-xl bg-white dark:bg-[#131c31] border border-slate-200/80 dark:border-slate-800 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="font-bold text-[#C5A059] dark:text-[#D4AF37]">
                            {ticket.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${
                              ticket.status === 'answered'
                                ? 'border-[#C5A059]/60 text-[#002366] dark:text-[#D4AF37]'
                                : ticket.status === 'closed'
                                ? 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                                : 'border-[#002366]/25 text-[#002366] dark:text-slate-300'
                            }`}
                          >
                            {ticket.status === 'answered' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                                {isAr ? 'تم الرد' : 'Replied'}
                              </>
                            ) : ticket.status === 'closed' ? (
                              isAr ? 'مغلق' : 'Closed'
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-[#C5A059]" />
                                {isAr ? 'بانتظار الرد' : 'Pending'}
                              </>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-semibold text-[#002366] dark:text-white">
                          {ticket.question}
                        </div>

                        {Array.isArray(ticket.replies) &&
                          ticket.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                                rep.sender === 'admin'
                                  ? 'border-[#C5A059]/50 bg-white dark:bg-[#0b1120] text-[#002366] dark:text-slate-100'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <div className="text-[10px] font-bold mb-0.5 text-[#C5A059]">
                                {rep.sender === 'admin'
                                  ? isAr
                                    ? 'رد الدعم الفني:'
                                    : 'Support Reply:'
                                  : isAr
                                  ? 'متابعة منك:'
                                  : 'Your Follow-up:'}
                              </div>
                              {rep.text}
                            </div>
                          ))}

                        {ticket.status !== 'closed' && (
                          <div className="flex gap-1.5 pt-1">
                            <input
                              type="text"
                              value={followUpDrafts[ticket.id] || ''}
                              onChange={(e) =>
                                setFollowUpDrafts((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleVisitorReply(ticket.id);
                                }
                              }}
                              placeholder={
                                isAr ? 'أضف متابعة...' : 'Add follow-up...'
                              }
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-[11px] text-[#0f172a] dark:text-white outline-none focus:border-[#002366]"
                            />
                            <button
                              type="button"
                              onClick={() => handleVisitorReply(ticket.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#002366] hover:bg-[#1D4ED8] text-white text-[11px] font-bold transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick WhatsApp Footer inside Popup */}
          <div className="px-4 py-2.5 bg-white dark:bg-[#131c31] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span dir="ltr">{displayPrimaryPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${secondaryWaDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#002366] dark:hover:text-[#D4AF37] font-semibold"
                title={isAr ? 'الرقم الاحتياطي' : 'Secondary WhatsApp'}
              >
                {isAr ? 'رقم بديل' : 'Alt Line'}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059] hover:bg-[#b58f47] text-white font-semibold transition-colors"
              >
                <WhatsAppIcon className="w-3 h-3" />
                <span>{isAr ? 'واتساب مباشر' : 'Direct WhatsApp'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
