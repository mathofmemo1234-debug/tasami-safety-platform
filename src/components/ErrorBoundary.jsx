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
              تم رصد تحديث في الصفحة، يرجى الضغط أدناه لإعادة تحميل المنصة بكامل خدماتها.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#c59a45] hover:bg-[#dfb76c] text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-[#c59a45]/20"
            >
              تحديث الصفحة الآن
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
