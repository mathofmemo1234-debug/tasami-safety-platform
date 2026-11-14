import React, { useEffect, useMemo, useState } from 'react';
import {
  Headphones,
  MessageCircle,
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
      'يمكنك إرسال سؤالك أو مخطط المشروع هنا مباشرة، أو التواصل الفوري معنا عبر زر الواتس آب الموحد (+966 59 168 4133) وسيرد عليك المهندس المختص.'
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

  return (
    <>
      {/* Global Floating Dock: WhatsApp + Technical Support */}
      <div
        className={`fixed bottom-5 ${
          isAr ? 'left-5' : 'right-5'
        } z-40 flex flex-col gap-3 items-start`}
      >
        {/* Technical Support Popup Trigger Button */}
        {popupEnabled && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isAr ? 'الدعم الفني' : 'Technical Support'}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#113163] hover:bg-[#0d274e] text-white shadow-xl shadow-[#113163]/30 border border-[#c59a45]/60 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#c59a45] text-[#0b1120]">
              <Headphones className="w-4 h-4" />
              {answeredCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                  {answeredCount}
                </span>
              )}
            </div>
            <div className="text-start leading-tight">
              <span className="block text-xs font-black tracking-wide">
                {supportCfg.title || (isAr ? 'الدعم الفني' : 'Technical Support')}
              </span>
              <span className="block text-[10px] text-[#e8c682] font-semibold">
                {isAr ? 'رد فوري على استفساراتك' : 'Instant Q&A Help'}
              </span>
            </div>
          </button>
        )}

        {/* Global Floating WhatsApp Button (Company Number) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isAr ? 'تواصل عبر واتس آب تسامي الأعمال' : 'Chat on WhatsApp'}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-xl shadow-emerald-600/35 border border-white/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-white/40 opacity-50" />
          </span>
          <div className="text-start leading-tight">
            <span className="block text-xs font-black">
              {isAr ? 'واتس آب الشركة' : 'WhatsApp Us'}
            </span>
            <span className="block text-[10px] font-mono font-bold text-white/95" dir="ltr">
              {displayPrimaryPhone}
            </span>
          </div>
        </a>
      </div>

      {/* Technical Support Instant Q&A Popup Window */}
      {popupEnabled && isOpen && (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={`fixed bottom-24 ${
            isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          } z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[82vh] flex flex-col rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200`}
        >
          {/* Popup Header */}
          <div className="bg-gradient-to-r from-[#0b1120] via-[#113163] to-[#1a4380] px-4 py-3.5 text-white flex items-center justify-between gap-3 border-b border-[#c59a45]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c59a45]/20 border border-[#c59a45]/60 flex items-center justify-center text-[#dfb76c]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base">
                    {supportCfg.title || (isAr ? 'الدعم الفني' : 'Technical Support')}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAr ? 'متصل الآن' : 'Online'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {supportCfg.subtitle ||
                    (isAr
                      ? 'إجابات فورية ومباشرة من فريق السلامة والهندسة'
                      : 'Instant answers directly from our engineering team')}
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
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-[#131c31] p-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('instant')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeMode === 'instant'
                  ? 'bg-white dark:bg-[#0f172a] text-[#113163] dark:text-[#dfb76c] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#113163]'
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
                  ? 'bg-white dark:bg-[#0f172a] text-[#113163] dark:text-[#dfb76c] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#113163]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'اسأل الدعم الفني' : 'Ask Support'}</span>
              {tickets.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#113163] text-white">
                  {tickets.length}
                </span>
              )}
            </button>
          </div>

          {/* Popup Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 dark:bg-[#0b1120]">
            {activeMode === 'instant' ? (
              <>
                {/* Welcome Banner */}
                <div className="p-3 rounded-xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
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
                    } py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131c31] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]`}
                  />
                </div>

                {/* Instant FAQs */}
                <div className="space-y-2">
                  {faqs.map((faq) => {
                    const expanded = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c31] overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(expanded ? null : faq.id)}
                          className="w-full p-3 flex items-start justify-between gap-2 text-start hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                        >
                          <div>
                            {faq.category && (
                              <span className="inline-block text-[10px] font-bold text-[#9c7224] dark:text-[#dfb76c] mb-0.5">
                                {faq.category}
                              </span>
                            )}
                            <p className="text-xs font-bold text-[#0f172a] dark:text-white leading-snug">
                              {faq.question}
                            </p>
                          </div>
                          {expanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                        {expanded && (
                          <div className="px-3 pb-3 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-slate-50/70 dark:bg-[#0b1120]/60">
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
                  className="w-full py-2.5 px-4 rounded-xl bg-[#113163] hover:bg-[#0d274e] text-white text-xs font-black flex items-center justify-center gap-2 shadow transition"
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
                  className="bg-white dark:bg-[#131c31] rounded-xl p-3 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder={isAr ? 'الاسم (اختياري)' : 'Name (optional)'}
                      className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
                    />
                    <input
                      type="tel"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder={isAr ? 'رقم الجوال / واتس آب' : 'Phone / WhatsApp'}
                      className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
                      dir="ltr"
                    />
                  </div>

                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs font-semibold text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
                  />

                  <button
                    type="submit"
                    disabled={submitting || !questionText.trim()}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[#113163] to-[#1a4380] hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 transition disabled:opacity-50"
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
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {submitFeedback}
                    </p>
                  )}
                </form>

                {/* Conversation Thread History */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">
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
                        className="rounded-xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-800 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px]">
                          <span className="font-bold text-[#9c7224] dark:text-[#dfb76c]">
                            {ticket.category}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
                              ticket.status === 'answered'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : ticket.status === 'closed'
                                ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}
                          >
                            {ticket.status === 'answered' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                {isAr ? 'تم الرد' : 'Replied'}
                              </>
                            ) : ticket.status === 'closed' ? (
                              isAr ? 'مغلق' : 'Closed'
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                {isAr ? 'بانتظار الرد' : 'Pending'}
                              </>
                            )}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#113163]/5 dark:bg-[#113163]/25 text-xs font-semibold text-[#0f172a] dark:text-white">
                          {ticket.question}
                        </div>

                        {Array.isArray(ticket.replies) &&
                          ticket.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                rep.sender === 'admin'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
                                  : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="text-[10px] font-black mb-0.5 opacity-80">
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
                              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[11px] text-[#0f172a] dark:text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleVisitorReply(ticket.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#113163] text-white text-[11px] font-bold"
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
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#131c31] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <Phone className="w-3.5 h-3.5 text-[#c59a45]" />
              <span dir="ltr">{displayPrimaryPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${secondaryWaDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-emerald-600 font-bold"
                title={isAr ? 'الرقم الاحتياطي' : 'Secondary WhatsApp'}
              >
                {isAr ? 'رقم بديل' : 'Alt Line'}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black transition"
              >
                <MessageCircle className="w-3 h-3" />
                <span>{isAr ? 'واتس آب مباشر' : 'Direct WhatsApp'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
