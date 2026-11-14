import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone
} from 'lucide-react';
import {
  registerVisitor,
  loginVisitor,
  normalizeSaudiPhone
} from '../services/auth';

export default function VisitorAuthModal({
  isOpen,
  onClose,
  lang = 'ar',
  initialMode = 'login', // 'login' | 'register'
  onSuccess
}) {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [identifierType, setIdentifierType] = useState('phone'); // 'phone' | 'email'

  // Form Fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setCompany('');
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error(isAr ? 'يرجى إدخال الاسم الكريم.' : 'Please enter your full name.');
        }
        if (!identifier.trim()) {
          throw new Error(
            identifierType === 'phone'
              ? (isAr ? 'يرجى إدخال رقم الجوال.' : 'Please enter your mobile number.')
              : (isAr ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email.')
          );
        }
        if (password.length < 6) {
          throw new Error(isAr ? 'كلمة المرور يجب أن تكون 6 خانات على الأقل.' : 'Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error(isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
        }

        const user = await registerVisitor({
          name: name.trim(),
          identifier: identifier.trim(),
          identifierType,
          password,
          company: company.trim()
        });

        setSuccessMsg(
          isAr
            ? `أهلاً بك يا ${user.name}، تم إنشاء حسابك بنجاح!`
            : `Welcome, ${user.name}! Account created successfully.`
        );

        setTimeout(() => {
          if (onSuccess) onSuccess(user);
          onClose();
          resetForm();
        }, 1200);
      } else {
        // Login mode
        if (!identifier.trim()) {
          throw new Error(isAr ? 'يرجى إدخال رقم الجوال أو البريد الإلكتروني.' : 'Please enter email or phone.');
        }
        if (!password) {
          throw new Error(isAr ? 'يرجى إدخال كلمة المرور.' : 'Please enter your password.');
        }

        const user = await loginVisitor({
          identifier: identifier.trim(),
          password
        });

        setSuccessMsg(
          isAr
            ? `مرحباً بعودتك، ${user.name || 'عزيزي الزائر'}!`
            : `Welcome back, ${user.name || 'User'}!`
        );

        setTimeout(() => {
          if (onSuccess) onSuccess(user);
          onClose();
          resetForm();
        }, 900);
      }
    } catch (err) {
      setErrorMsg(err.message || (isAr ? 'حدث خطأ، يرجى المحاولة ثانية.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in font-cairo"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#131c31] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#162d6c] via-[#0f2152] to-[#162d6c] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-[#c59a45]/40 flex items-center justify-center text-[#dfb76c] shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{mode === 'login' ? (isAr ? 'تسجيل دخول الزوار والعملاء' : 'Visitor & Client Sign In') : (isAr ? 'إنشاء حساب زائر جديد' : 'Create Visitor Account')}</span>
                </h3>
                <p className="text-[11px] text-blue-200/90 font-medium">
                  {isAr ? 'تسامي الأعمال لأنظمة السلامة ومكافحة الحريق' : 'Tasami Business for Safety Systems'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mt-4 rounded-xl bg-black/25 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2 rounded-lg transition ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#c59a45] to-[#dfb76c] text-[#0b1120] font-black shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'حساب جديد' : 'New Account'}
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-140px)] space-y-4">
          {/* Success Notification */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Notification */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER ONLY: Name & Org */}
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                    {isAr ? 'الاسم الكريم / الشخص المفوض *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isAr ? 'مثال: م. أحمد الغامدي' : 'e.g. Eng. Ahmed'}
                      className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                    />
                  </div>
                </div>

                {/* Registration Method Selector: Phone vs Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                    {isAr ? 'طريقة التسجيل المفضلة *' : 'Registration Method *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('phone');
                        setIdentifier('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        identifierType === 'phone'
                          ? 'border-[#c59a45] bg-[#c59a45]/15 text-[#9c7224] dark:text-[#dfb76c]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-[#c59a45]" />
                      <span>{isAr ? 'رقم الجوال (السعودية)' : 'Mobile Phone'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('email');
                        setIdentifier('');
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        identifierType === 'email'
                          ? 'border-[#c59a45] bg-[#c59a45]/15 text-[#9c7224] dark:text-[#dfb76c]'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1120] text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-[#c59a45]" />
                      <span>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</span>
                    </button>
                  </div>
                </div>

                {/* Company / Entity (Optional) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                    {isAr ? 'اسم المنشأة أو الشركة (اختياري)' : 'Company / Entity (Optional)'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={isAr ? 'مثال: شركة التطوير العقاري' : 'e.g. Al-Inma Real Estate'}
                      className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* IDENTIFIER FIELD */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                {mode === 'login' ? (
                  isAr ? 'رقم الجوال أو البريد الإلكتروني *' : 'Mobile Phone or Email *'
                ) : identifierType === 'phone' ? (
                  isAr ? 'رقم الجوال *' : 'Mobile Number *'
                ) : (
                  isAr ? 'البريد الإلكتروني *' : 'Email Address *'
                )}
              </label>
              <div className="relative">
                {mode === 'login' ? (
                  <User className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                ) : identifierType === 'phone' ? (
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type={mode === 'register' && identifierType === 'email' ? 'email' : 'text'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  dir="ltr"
                  placeholder={
                    mode === 'login'
                      ? (isAr ? '05XXXXXXXX أو name@domain.com' : '05XXXXXXXX or user@domain.com')
                      : identifierType === 'phone'
                      ? (isAr ? '05XXXXXXXX أو +9665XXXXXXXX' : '05XXXXXXXX or +9665XXXXXXXX')
                      : 'name@example.com'
                  }
                  className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                />
              </div>
              {mode === 'register' && identifierType === 'phone' && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isAr ? '🇸🇦 يُقبل رقم الجوال السعودي بصيغة 05 أو +966' : 'Saudi mobile format: 05XXXXXXXX'}
                </p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                  {isAr ? 'كلمة المرور *' : 'Password *'}
                </label>
                {mode === 'register' && (
                  <span className="text-[10px] text-slate-400">
                    {isAr ? '6 خانات على الأقل' : 'Min 6 characters'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  placeholder="••••••••"
                  className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REGISTER ONLY: Confirm Password */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0f172a] dark:text-slate-200">
                  {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                    placeholder="••••••••"
                    className="w-full px-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c59a45]"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-flashy-gold w-full py-3 rounded-xl font-bold text-sm text-[#0b1120] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0b1120] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? (isAr ? 'تسجيل الدخول' : 'Sign In')
                      : (isAr ? 'إنشاء حساب الزائر والبدء' : 'Create Account')}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle Mode Links */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-[#1d4ed8] dark:text-[#dfb76c] hover:underline"
                >
                  {isAr ? 'إنشاء حساب جديد برقم الجوال أو الإيميل' : 'Create new account'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-[#1d4ed8] dark:text-[#dfb76c] hover:underline"
                >
                  {isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign In here'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
