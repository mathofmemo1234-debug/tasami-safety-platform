import React, { useEffect, useMemo, useState } from 'react';
import {
  Headphones,
  MessageSquare,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Archive,
  Phone,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import {
  subscribeSupportTickets,
  appendSupportReply,
  updateSupportTicketStatus,
  deleteSupportTicket
} from '../services/firebase';
import { normalizeWhatsAppDigits } from '../utils/media';

const QUICK_REPLIES_AR = [
  'أهلاً بك، تم استلام استفسارك وجارٍ مراجعته من مهندس السلامة المختص.',
  'المنتج متوفر لدينا ومعتمد UL / FM / SABER، ويمكنكم طلب عرض السعر عبر الواتس آب: 966591684133.',
  'نعم نوفر التركيب والمعاينة الميدانية واعتماد بوابة سلامة في مكة المكرمة وجميع مناطق المملكة.'
];

export default function TechSupportAdminTab({
  localData,
  langTab,
  updateNested
}) {
  const [subView, setSubView] = useState('tickets'); // 'tickets' | 'faqs'
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const unsub = subscribeSupportTickets({
      sessionId: null,
      onUpdate: (list) => setTickets(list)
    });
    return () => unsub();
  }, []);

  const supportCfg = localData?.[langTab]?.techSupport || {
    enabled: true,
    title: langTab === 'ar' ? 'الدعم الفني' : 'Technical Support',
    subtitle:
      langTab === 'ar'
        ? 'إجابات فورية ومباشرة من فريق السلامة والهندسة'
        : 'Instant answers from our safety engineers',
    welcomeMessage:
      langTab === 'ar'
        ? 'أهلاً بك في الدعم الفني لشركة تسامي الأعمال. ابحث عن إجابتك الفورية أدناه أو أرسل سؤالك مباشرة.'
        : 'Welcome to Tasaami Technical Support.',
    faqs: []
  };

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'all') return tickets;
    return tickets.filter((t) => (t.status || 'open') === statusFilter);
  }, [tickets, statusFilter]);

  const openCount = useMemo(
    () => tickets.filter((t) => (t.status || 'open') === 'open').length,
    [tickets]
  );

  const handleSendReply = async (ticketId) => {
    const text = (replyDrafts[ticketId] || '').trim();
    if (!text) return;
    setBusyId(ticketId);
    try {
      await appendSupportReply(ticketId, {
        sender: 'admin',
        senderName: 'إدارة الدعم الفني - تسامي',
        text,
        status: 'answered'
      });
      setReplyDrafts((prev) => ({ ...prev, [ticketId]: '' }));
    } finally {
      setBusyId(null);
    }
  };

  const updateSupportField = (key, value) => {
    updateNested([langTab, 'techSupport', key], value);
  };

  const addFaqItem = () => {
    const currentFaqs = Array.isArray(supportCfg.faqs) ? supportCfg.faqs : [];
    const newItem = {
      id: `faq_${Date.now()}`,
      category: langTab === 'ar' ? 'الدعم الفني' : 'Support',
      question: langTab === 'ar' ? 'سؤال فوري جديد...' : 'New instant question...',
      answer: langTab === 'ar' ? 'الإجابة الفورية المعتمدة...' : 'Approved instant answer...'
    };
    updateSupportField('faqs', [newItem, ...currentFaqs]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-black text-[#0f172a] dark:text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#c59a45]" />
            <span>إدارة الدعم الفني والأسئلة الفورية</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            استقبل أسئلة زوار الموقع ورد عليها فوراً لتظهر مباشرة في نافذة «الدعم الفني» المنبثقة، أو حرر قاعدة الأسئلة الفورية.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-[#0b1120] p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubView('tickets')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              subView === 'tickets'
                ? 'bg-[#113163] text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>أسئلة الزوار المباشرة ({tickets.length})</span>
            {openCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#0b1120] text-[10px] font-black">
                {openCount} جديد
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSubView('faqs')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition ${
              subView === 'faqs'
                ? 'bg-[#113163] text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الأسئلة الفورية وإعدادات النافذة ({(supportCfg.faqs || []).length})</span>
          </button>
        </div>
      </div>

      {subView === 'tickets' ? (
        <div className="space-y-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `الكل (${tickets.length})` },
              { id: 'open', label: `بانتظار الرد (${openCount})` },
              {
                id: 'answered',
                label: `تم الرد (${tickets.filter((t) => t.status === 'answered').length})`
              },
              {
                id: 'closed',
                label: `مغلق (${tickets.filter((t) => t.status === 'closed').length})`
              }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  statusFilter === f.id
                    ? 'bg-[#113163] text-white border-[#113163]'
                    : 'bg-white dark:bg-[#131c31] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white dark:bg-[#131c31] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              لا توجد أسئلة أو تذاكر دعم فني ضمن هذا التصنيف حالياً.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-black text-[#0f172a] dark:text-white">
                        {ticket.visitorName || 'زائر الموقع'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[#9c7224] dark:text-[#dfb76c] font-bold">
                        {ticket.category || 'عام'}
                      </span>
                      {ticket.phone && (
                        <a
                          href={`https://wa.me/${normalizeWhatsAppDigits(ticket.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold hover:underline"
                          dir="ltr"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {ticket.phone}
                        </a>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleString('ar-SA')
                          : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          ticket.status === 'answered'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : ticket.status === 'closed'
                            ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        }`}
                      >
                        {ticket.status === 'answered' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : ticket.status === 'closed' ? (
                          <Archive className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {ticket.status === 'answered'
                          ? 'تم الرد'
                          : ticket.status === 'closed'
                          ? 'مغلق'
                          : 'بانتظار الرد'}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateSupportTicketStatus(
                            ticket.id,
                            ticket.status === 'closed' ? 'open' : 'closed'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {ticket.status === 'closed' ? 'إعادة فتح' : 'إغلاق'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSupportTicket(ticket.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Original Visitor Question */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b1120] border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-[#0f172a] dark:text-white">
                    {ticket.question}
                  </div>

                  {/* Conversation Replies */}
                  {Array.isArray(ticket.replies) && ticket.replies.length > 0 && (
                    <div className="space-y-2 pr-3 border-r-2 border-[#c59a45]/50">
                      {ticket.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-2.5 rounded-xl text-xs ${
                            rep.sender === 'admin'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-black mb-1 opacity-75">
                            <span>
                              {rep.sender === 'admin' ? rep.senderName || 'الإدارة' : 'الزائر'}
                            </span>
                            <span>
                              {rep.createdAt
                                ? new Date(rep.createdAt).toLocaleTimeString('ar-SA')
                                : ''}
                            </span>
                          </div>
                          {rep.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Replies + Reply Input */}
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_REPLIES_AR.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() =>
                            setReplyDrafts((prev) => ({ ...prev, [ticket.id]: qr }))
                          }
                          className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#c59a45]/20 text-slate-600 dark:text-slate-300 font-semibold transition"
                        >
                          + رد جاهز {qIdx + 1}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyDrafts[ticket.id] || ''}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({
                            ...prev,
                            [ticket.id]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendReply(ticket.id);
                          }
                        }}
                        placeholder="اكتب رد الدعم الفني ليظهر مباشرة للعميل في نافذة الدعم..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs text-[#0f172a] dark:text-white outline-none focus:border-[#c59a45]"
                      />
                      <button
                        type="button"
                        disabled={busyId === ticket.id || !(replyDrafts[ticket.id] || '').trim()}
                        onClick={() => handleSendReply(ticket.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{busyId === ticket.id ? 'جاري الإرسال...' : 'إرسال الرد'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Popup Configuration */}
          <div className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-sm text-[#0f172a] dark:text-white">
                إعدادات نافذة «الدعم الفني» المنبثقة ({langTab === 'ar' ? 'العربية' : 'English'})
              </h5>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={supportCfg.enabled !== false}
                  onChange={(e) => updateSupportField('enabled', e.target.checked)}
                  className="w-4 h-4 accent-[#c59a45]"
                />
                <span>تفعيل نافذة الدعم الفني</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  عنوان النافذة:
                </label>
                <input
                  type="text"
                  value={supportCfg.title || ''}
                  onChange={(e) => updateSupportField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  العنوان الفرعي:
                </label>
                <input
                  type="text"
                  value={supportCfg.subtitle || ''}
                  onChange={(e) => updateSupportField('subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  رسالة الترحيب في النافذة:
                </label>
                <input
                  type="text"
                  value={supportCfg.welcomeMessage || ''}
                  onChange={(e) => updateSupportField('welcomeMessage', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Instant FAQs List */}
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-[#0f172a] dark:text-white">
              بنك الأسئلة والإجابات الفورية ({(supportCfg.faqs || []).length})
            </h5>
            <button
              type="button"
              onClick={addFaqItem}
              className="btn-flashy-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0b1120] shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة سؤال فوري</span>
            </button>
          </div>

          <div className="space-y-3">
            {(supportCfg.faqs || []).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-white dark:bg-[#131c31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={faq.category || ''}
                    onChange={(e) => {
                      const updated = [...(supportCfg.faqs || [])];
                      updated[idx] = { ...updated[idx], category: e.target.value };
                      updateSupportField('faqs', updated);
                    }}
                    placeholder="التصنيف (مثال: الاعتمادات)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#9c7224] dark:text-[#dfb76c] font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(supportCfg.faqs || [])];
                      updated.splice(idx, 1);
                      updateSupportField('faqs', updated);
                    }}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="حذف السؤال"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    السؤال:
                  </label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => {
                      const updated = [...(supportCfg.faqs || [])];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      updateSupportField('faqs', updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    الإجابة الفورية:
                  </label>
                  <textarea
                    rows={2}
                    value={faq.answer || ''}
                    onChange={(e) => {
                      const updated = [...(supportCfg.faqs || [])];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      updateSupportField('faqs', updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-[#0f172a] dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            ملاحظة: بعد تعديل الأسئلة الفورية أو إعدادات النافذة، اضغط زر «حفظ التغييرات ومزامنة مع السحابة» بالأسفل.
          </p>
        </div>
      )}
    </div>
  );
}
