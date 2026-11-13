import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Users, FileText, Phone, Mail, CheckCircle2, Clock, Shield } from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [consultations, setConsultations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('consultations');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCons, resMsgs] = await Promise.all([
        fetch('/api/consultations'),
        fetch('/api/messages')
      ]);
      if (resCons.ok) setConsultations(await resCons.json());
      if (resMsgs.ok) setMessages(await resMsgs.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1120]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#131c31] rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/25 text-[#1d4ed8] dark:text-[#60a5fa] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0f172a] dark:text-white">
                لوحة إدارة طلبات الموقع وقاعدة البيانات (Database Admin)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بيانات حية مخزنة في SQLite Database (توضح استقبال ومعالجة الطلبات)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 rounded-lg text-slate-500 hover:text-[#c59a45] hover:bg-slate-100 transition"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'consultations'
                ? 'bg-[#c59a45] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طلبات الاستشارة ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#c59a45] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>رسائل التواصل ({messages.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              جارِ تحميل البيانات من قاعدة البيانات...
            </div>
          ) : activeTab === 'consultations' ? (
            consultations.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                لا توجد طلبات استشارة مسجلة بعد. يمكنك إرسال طلب تجريبي من زر "طلب استشارة" ليظهر هنا فوراً.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">الاسم والشركة</th>
                      <th className="p-3">الاتصال</th>
                      <th className="p-3">القطاع والخدمة</th>
                      <th className="p-3">الملاحظات</th>
                      <th className="p-3">الوقت</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {consultations.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-slate-400">{item.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.company || 'فرد / منشأة خاصة'}</div>
                        </td>
                        <td className="p-3 space-y-0.5">
                          <div className="font-mono text-slate-700" dir="ltr">{item.phone}</div>
                          <div className="text-slate-500 text-[10px]">{item.email}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-800 block">{item.sector}</span>
                          <span className="text-[10px] text-[#9a752a] font-semibold">{item.service_type}</span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate" title={item.notes}>
                          {item.notes || '—'}
                        </td>
                        <td className="p-3 text-[10px] text-slate-400 font-mono">
                          {item.created_at}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-[#9a752a] border border-amber-200">
                            <Clock className="w-3 h-3" />
                            {item.status || 'جديد'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            messages.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                لا توجد رسائل تواصل بعد.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">المرسل</th>
                      <th className="p-3">الموضوع</th>
                      <th className="p-3">نص الرسالة</th>
                      <th className="p-3">الوقت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {messages.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-slate-400">{item.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.email} | {item.phone}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{item.subject}</td>
                        <td className="p-3 text-slate-600 max-w-sm whitespace-pre-wrap">{item.message}</td>
                        <td className="p-3 text-[10px] text-slate-400 font-mono">{item.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
