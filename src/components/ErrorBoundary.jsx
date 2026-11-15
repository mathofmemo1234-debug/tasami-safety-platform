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

  handleReload = () => {
    try {
      localStorage.removeItem('tasami_live_content');
    } catch {}
    window.location.reload();
  };

  handleGoHome = () => {
    try {
      localStorage.removeItem('tasami_live_content');
      sessionStorage.clear();
    } catch {}
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center font-cairo" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c59a45]/20 text-[#c59a45] flex items-center justify-center border border-[#c59a45]/30 shadow-inner">
              <span className="text-2xl font-black">!</span>
            </div>
            
            <h2 className="text-xl font-black text-white">تسامي الأعمال لأنظمة السلامة</h2>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              تم رصد تحديث أو استثناء برمجي مؤقت. يمكنك إعادة تنشيط المنصة أو العودة للصفحة الرئيسية للمتابعة بسلاسة.
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full px-6 py-3 bg-[#c59a45] hover:bg-[#dfb76c] text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-[#c59a45]/20"
              >
                إعادة تحميل الصفحة الآن
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>

            {this.state.error && (
              <details className="mt-4 text-[10px] text-slate-400 font-mono text-left dir-ltr bg-slate-950/80 p-3 rounded-xl border border-slate-800 cursor-pointer">
                <summary className="text-[#dfb76c] font-sans text-xs select-none">تفاصيل الخطأ الفني (Technical Details)</summary>
                <p className="mt-2 text-rose-400 break-all select-all font-mono leading-relaxed">{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
