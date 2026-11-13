import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary captured error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center" dir="rtl">
          <div className="max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#c59a45]/20 text-[#c59a45] flex items-center justify-center">
              <span className="text-2xl font-black">!</span>
            </div>
            <h2 className="text-xl font-black mb-2 text-white">تسامي الأعمال لأنظمة السلامة</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              تم تحديث إعدادات المنصة بنجاح. اضغط أدناه لإعادة تشغيل المنصة بأحدث التحديثات.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('tasami_live_content');
                  } catch {}
                  window.location.reload();
                }}
                className="w-full px-6 py-3 bg-[#c59a45] hover:bg-[#dfb76c] text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-[#c59a45]/20"
              >
                إعادة تحميل الصفحة الآن
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-[10px] text-slate-400 font-mono text-left dir-ltr bg-slate-950/80 p-3 rounded-lg border border-slate-800 cursor-pointer">
                <summary className="text-[#dfb76c] font-sans text-xs">تفاصيل الخطأ الفني (Technical Details)</summary>
                <p className="mt-2 text-red-400 break-all">{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
