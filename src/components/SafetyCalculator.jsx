import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Flame, BellRing, Sparkles } from 'lucide-react';

export default function SafetyCalculator({ lang, content, onSaveQuote }) {
  const t = content?.[lang]?.calculator || {};

  const [facilityType, setFacilityType] = useState('commercial');
  const [area, setArea] = useState(2500);
  const [floors, setFloors] = useState(3);
  const [hazard, setHazard] = useState('medium');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cost and requirement calculation based on Saudi Safety and Civil Defense benchmarks
  const calculateEstimate = () => {
    let ratePerSqm = 35; // base rate per sqm
    if (facilityType === 'industrial') ratePerSqm = 75;
    else if (facilityType === 'towers') ratePerSqm = 55;
    else if (facilityType === 'healthcare') ratePerSqm = 65;
    else if (facilityType === 'commercial') ratePerSqm = 45;

    let hazardMultiplier = 1.0;
    if (hazard === 'high') hazardMultiplier = 1.45;
    else if (hazard === 'medium') hazardMultiplier = 1.15;

    let floorMultiplier = 1 + (floors > 1 ? (floors - 1) * 0.08 : 0);

    const baseCost = area * ratePerSqm * hazardMultiplier * floorMultiplier;
    return Math.round(baseCost);
  };

  const getRecommendedSystems = () => {
    const systems = [
      'شبكة إنذار حريق مبكر معنونة بالكامل (Addressable Fire Alarm System)',
      'شبكة رشاشات مائية أوتوماتيكية متكاملة (Automatic Sprinklers SBC 801)',
      'صناديق حريق جدارية مع طفايات يدوية (Fire Hose Reels & Extinguishers)',
      'لوحات مخارج الطوارئ المضيئة وإنارة الطوارئ المستقلة (Emergency Exit Lights)',
    ];

    if (floors >= 5 || area >= 3000) {
      systems.push('مضخة حريق رئيسية واحتياطية معتمدة UL/FM (Fire Pump Set)');
      systems.push('نظام ضغط سلالم ومسالك الهروب لسحب الدخان (Stairwell Pressurization)');
    }

    if (facilityType === 'industrial' || hazard === 'high') {
      systems.push('نظام إطفاء غازي تلقائي لغرف الكهرباء والخوادم (FM-200 / Clean Agent)');
      systems.push('نظام إطفاء رغوي عالي الكثافة للخزانات والمناطق البتروكيماوية');
    }

    return systems;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setIsCalculated(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!clientPhone) {
      alert(lang === 'ar' ? 'يرجى إدخال رقم الجوال لحفظ التقدير.' : 'Please enter your phone number.');
      return;
    }
    setIsSaving(true);
    const estimatedCost = calculateEstimate();

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: facilityType,
          area_sqm: area,
          floors: floors,
          hazard_level: hazard,
          estimated_cost: estimatedCost,
          contact_phone: clientPhone,
          contact_name: clientName,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error('Failed to save quote:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const estimatedCost = calculateEstimate();
  const recommendedSystems = getRecommendedSystems();

  return (
    <section id="calculator" className="py-20 bg-gradient-to-b from-slate-50 via-amber-50/20 to-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c59a45]/15 text-[#9a752a] text-xs font-black uppercase border border-[#c59a45]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#c59a45]" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.subtitle}
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Controls Form Column */}
          <div className="p-6 sm:p-10 lg:col-span-7 space-y-6">
            <form onSubmit={handleCalculate} className="space-y-5">
              
              {/* Facility Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  {t.facilityType}
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => { setFacilityType(e.target.value); setIsCalculated(false); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c59a45] focus:ring-2 focus:ring-[#c59a45]/20 bg-slate-50 text-slate-800 text-sm font-semibold transition"
                >
                  <option value="commercial">{lang === 'ar' ? 'مجمع أو مركز تجاري / معارض' : 'Commercial Mall / Retail'}</option>
                  <option value="towers">{lang === 'ar' ? 'برج مكاتب أو مجمع سكني مرتفع' : 'Office Tower / High-Rise Residential'}</option>
                  <option value="industrial">{lang === 'ar' ? 'مصنع / منشأة صناعية / مستودعات كبرى' : 'Industrial Plant / Large Warehouse'}</option>
                  <option value="healthcare">{lang === 'ar' ? 'مستشفى / مجمع طبي' : 'Hospital / Healthcare Center'}</option>
                  <option value="education">{lang === 'ar' ? 'مدرسة / جامعة / مبنى تعليمي' : 'School / University Campus'}</option>
                </select>
              </div>

              {/* Area Slider & Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    {t.area}
                  </label>
                  <span className="text-sm font-extrabold text-[#9a752a] font-mono bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-200">
                    {Number(area).toLocaleString()} م²
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="50000"
                  step="100"
                  value={area}
                  onChange={(e) => { setArea(Number(e.target.value)); setIsCalculated(false); }}
                  className="w-full accent-[#c59a45] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Floors and Hazard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Floors */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    {t.floors}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={floors}
                    onChange={(e) => { setFloors(Number(e.target.value)); setIsCalculated(false); }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c59a45] focus:ring-2 focus:ring-[#c59a45]/20 bg-slate-50 text-slate-800 text-sm font-semibold"
                  />
                </div>

                {/* Hazard Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    {t.hazard}
                  </label>
                  <select
                    value={hazard}
                    onChange={(e) => { setHazard(e.target.value); setIsCalculated(false); }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#c59a45] focus:ring-2 focus:ring-[#c59a45]/20 bg-slate-50 text-slate-800 text-sm font-semibold"
                  >
                    <option value="low">{t.hazardLow}</option>
                    <option value="medium">{t.hazardMed}</option>
                    <option value="high">{t.hazardHigh}</option>
                  </select>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-base font-bold text-white bg-[#c59a45] hover:bg-[#b58a38] shadow-md hover:shadow-gold-glow transition flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                <span>{t.calculateBtn}</span>
              </button>
            </form>
          </div>

          {/* Results Display Column */}
          <div className="bg-slate-900 p-6 sm:p-10 lg:col-span-5 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#dfb76c] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.resultTitle}</span>
              </div>

              {/* Price Estimate Highlight */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 my-4">
                <span className="text-xs text-slate-400 block mb-1">
                  {t.estimatedCostLabel}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
                    {estimatedCost.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-[#dfb76c]">
                    {t.sar}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  (شامل التوريد والتركيب والاعتماد المبدئي)
                </div>
              </div>

              {/* Recommended Systems Checklist */}
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t.recommendedSystems}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {recommendedSystems.map((sys, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{sys}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save quote and request official RFP form */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              {saveSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>تم حفظ التقدير بنجاح وسيتواصل معك مهندس السلامة لمراجعة المخططات!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-300 block">
                    احفظ التقدير واطلب عرض سعر رسمي:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'الاسم أو الشركة' : 'Name / Company'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#c59a45]"
                    />
                    <input
                      type="tel"
                      placeholder={lang === 'ar' ? 'رقم الجوال *' : 'Phone *'}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#c59a45]"
                      required
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-[#dfb76c] hover:bg-[#c59a45] transition"
                  >
                    {isSaving ? 'جارِ الحفظ...' : t.saveEstimate}
                  </button>
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-3 text-center">
                {t.notice}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
