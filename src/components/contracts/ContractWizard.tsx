import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contract, ContractType, MilestoneStage } from '../../types';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface ContractWizardProps {
  onClose: () => void;
  onSuccess: (newId: string) => void;
}

export const ContractWizard: React.FC<ContractWizardProps> = ({ onClose, onSuccess }) => {
  const { t, createContract, role } = useApp();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [type, setType] = useState<ContractType>('short_term');
  const [category, setCategory] = useState<'construction' | 'tailoring' | 'digital' | 'delivery' | 'maintenance'>('construction');
  const [title, setTitle] = useState('');
  const [titleRw, setTitleRw] = useState('');
  const [scope, setScope] = useState('');
  const [scopeRw, setScopeRw] = useState('');
  const [location, setLocation] = useState('Kigali (Gasabo District)');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [materialsProvidedBy, setMaterialsProvidedBy] = useState<'contractor' | 'client' | 'shared'>('contractor');
  const [totalAmountRwf, setTotalAmountRwf] = useState<number>(500000);

  // Client and Contractor Info
  const [contractorName, setContractorName] = useState(role === 'worker' ? 'Jean-Pierre Nsengimana' : 'Contractor Partner');
  const [contractorPhone, setContractorPhone] = useState('+250 788 345 678');
  const [clientName, setClientName] = useState(role === 'client' ? 'Diane Uwera' : 'Client Representative');
  const [clientPhone, setClientPhone] = useState('+250 788 654 321');

  // Stages
  const [stages, setStages] = useState<MilestoneStage[]>([
    {
      id: 'stg-new-1',
      name: 'Initial Setup & Materials Verification',
      nameRw: 'Gutangira n isuzumwa ry ibikoresho',
      description: 'Prepare tools, check material quality, safety brief.',
      order: 1,
      status: 'pending',
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      assignedTo: contractorName,
      amountRwf: 200000,
      evidenceRequired: true,
      evidenceList: []
    },
    {
      id: 'stg-new-2',
      name: 'Core Execution & Implementation',
      nameRw: 'Gukora imirimo nyamukuru',
      description: 'Perform all specialized assembly/repair works.',
      order: 2,
      status: 'pending',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      assignedTo: contractorName,
      amountRwf: 200000,
      evidenceRequired: true,
      evidenceList: []
    },
    {
      id: 'stg-new-3',
      name: 'Inspection, Testing & Handover',
      nameRw: 'Kugenzura no gushyikiriza nyirubwite',
      description: 'Client walk-through test and final acceptance sign-off.',
      order: 3,
      status: 'pending',
      targetDate: endDate,
      assignedTo: contractorName,
      amountRwf: 100000,
      evidenceRequired: true,
      evidenceList: []
    }
  ]);

  // Delay Clause
  const [gracePeriodDays, setGracePeriodDays] = useState(2);
  const [dailyPenaltyPercent, setDailyPenaltyPercent] = useState(1.0);
  const [maxPenaltyPercent, setMaxPenaltyPercent] = useState(5.0);

  // Template Quick Fills
  const applyTemplate = (cat: typeof category) => {
    setCategory(cat);
    if (cat === 'construction') {
      setTitle('Masonry & Wall Plastering - Nyamirambo House');
      setTitleRw('Gusiga no Gusana Inkuta - Nyamirambo');
      setScope('Surface chipping, 3 coats mortar plastering, smooth cement float finish, and waste clearing.');
      setScopeRw('Gusukura inkuta no gusigaho sima isukuye hamwe no gukubura ibisigazwa.');
      setTotalAmountRwf(450000);
    } else if (cat === 'tailoring') {
      setTitle('Bespoke Event Attire (4 Outfits)');
      setTitleRw('Gudoda Imyenda 4 yo mu Birori');
      setScope('Custom fabric cutting, lining, fittings, and steam pressing for wedding entourage.');
      setScopeRw('Gupima, gukata igitambaro no kudoda imyenda 4 ifite amabara y ibirori.');
      setTotalAmountRwf(300000);
    } else if (cat === 'digital') {
      setTitle('Cooperative Inventory Mobile App Frontend');
      setTitleRw('Gukora Porogaramu ya Telefoni yo Gucunga Ububiko');
      setScope('React mobile UI with offline catalog, receipt printer connection, and daily sales report.');
      setScopeRw('Gukora imigaragarire ya porogaramu ya telefoni icunga ibicuruzwa by koperative.');
      setTotalAmountRwf(850000);
    } else {
      setTitle('Kigali-Huye Agri-Goods Transport & Unloading');
      setTitleRw('Gutwara n Ubwikorezi bw Imboga - Kigali na Huye');
      setScope('Refrigerated 3-tonne truck transit, loading in Kigali, scheduled delivery to Huye distribution center.');
      setScopeRw('Gupakira no gutwara ibiribwa muri kamyo ifite firigo.');
      setTotalAmountRwf(350000);
    }
  };

  const handleAddStage = () => {
    const nextOrder = stages.length + 1;
    const newStage: MilestoneStage = {
      id: `stg-new-${Date.now()}`,
      name: `Milestone Stage ${nextOrder}`,
      nameRw: `Icyiciro cya ${nextOrder}`,
      description: 'Detailed work deliverables for this milestone.',
      order: nextOrder,
      status: 'pending',
      targetDate: endDate,
      assignedTo: contractorName,
      amountRwf: 100000,
      evidenceRequired: true,
      evidenceList: []
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) return;
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleStageChange = (index: number, field: keyof MilestoneStage, val: any) => {
    const updated = [...stages];
    (updated[index] as any)[field] = val;
    setStages(updated);
  };

  const handleSubmit = () => {
    const clauseText = `After a ${gracePeriodDays}-day grace period, a delay deduction of ${dailyPenaltyPercent}% of the affected milestone value per late day applies, capped at ${maxPenaltyPercent}% of that milestone. Indicative calculation subject to mutual human review.`;

    const newId = createContract({
      title: title || 'Work Agreement',
      titleRw: titleRw || 'Amasezerano y Umurimo',
      type,
      status: 'awaiting_confirmation',
      category,
      scope: scope || 'Defined scope of work and agreed technical specifications.',
      scopeRw: scopeRw || 'Ibisobanuro by umurimo n amategeko y akazi.',
      location,
      totalAmountRwf: Number(totalAmountRwf),
      materialsProvidedBy,
      startDate,
      endDate,
      parties: {
        contractor: {
          id: `usr-${Date.now()}-1`,
          name: contractorName,
          role: 'contractor',
          phone: contractorPhone,
          confirmed: role === 'worker',
          confirmedAt: role === 'worker' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        },
        client: {
          id: `usr-${Date.now()}-2`,
          name: clientName,
          role: 'client',
          phone: clientPhone,
          confirmed: role === 'client',
          confirmedAt: role === 'client' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        }
      },
      stages,
      delayClause: {
        hasDelayClause: true,
        gracePeriodDays,
        dailyPenaltyPercent,
        maxPenaltyPercent,
        clauseText,
        humanReviewRequired: true,
        disputePauseSupported: true
      }
    });

    onSuccess(newId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 text-white shadow-2xl animate-in slide-in-from-bottom-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {t('Guided Agreement Builder', 'Gukora Amasezerano Mashya')}
              </h2>
              <p className="text-[10px] text-slate-400">
                {t(`Step ${step} of 4: `, `Intambwe ya ${step} muri 4: `)}
                {step === 1 && t('Template & Work Type', 'Ubwoko bw Umurimo')}
                {step === 2 && t('Scope & Parties', 'Abagiranye Amasezerano')}
                {step === 3 && t('Milestones & Price', 'Intambwe n Igiciro')}
                {step === 4 && t('Fair Delay Terms & Review', 'Ibihano byo Gutinda')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex space-x-1.5 mb-5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Work Type & Template */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t('Agreement Structure (Proposal Sec 4.2 / 4.3):', 'Uburyo bw Amasezerano:')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('short_term')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === 'short_term'
                      ? 'bg-emerald-950/50 border-emerald-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">
                    {t('Short-Term Job', 'Akazi k Igihe Gito')}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight block">
                    {t('One defined project or repair with set deliverables.', 'Umurimo umwe ufite igihe cyo kurangira.')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('work_order')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === 'work_order'
                      ? 'bg-emerald-950/50 border-emerald-500 text-white'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">
                    {t('Work Order', 'Urwandiko rw Akazi')}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight block">
                    {t('Linked job under an active framework contract.', 'Akazi gashingiye ku masezerano rusange.')}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Pick Rwandan Industry Template:', 'Hitamo Urugero rw Akazi:')}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { cat: 'construction' as const, label: 'Construction / Masonry', rw: 'Ubwubatsi / Gusana' },
                  { cat: 'tailoring' as const, label: 'Uniform / Tailoring', rw: 'Kudoda Imyenda' },
                  { cat: 'digital' as const, label: 'Digital / Tech Work', rw: 'Ikoranabuhanga' },
                  { cat: 'delivery' as const, label: 'Transport / Delivery', rw: 'Ubwikorezi' }
                ].map((tpl) => (
                  <button
                    key={tpl.cat}
                    type="button"
                    onClick={() => applyTemplate(tpl.cat)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                      category === tpl.cat
                        ? 'bg-slate-800 border-emerald-500 text-white font-semibold'
                        : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="block truncate">{tpl.label}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{tpl.rw}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('Agreement Title (English & Kinyarwanda):', 'Umutwe w Amasezerano:')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Masonry & Wall Plastering - Nyamirambo"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white mb-2 focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="text"
                value={titleRw}
                onChange={(e) => setTitleRw(e.target.value)}
                placeholder="Mu Kinyarwanda: e.g. Gusiga no Gusana Inkuta"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Scope & Minimal Parties */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('Clear Scope of Work (Plain Language):', 'Ibisobanuro by Umurimo (Mu Kinyarwanda / Icyongereza):')}
              </label>
              <textarea
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Specify deliverables, standards, and responsibilities..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Location:', 'Aho Bikorerwa:')}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Materials Supplier:', 'Ibikoresho Bitangwa:')}
                </label>
                <select
                  value={materialsProvidedBy}
                  onChange={(e) => setMaterialsProvidedBy(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  <option value="contractor">{t('By Worker / Contractor', 'Umukozi / Umwubatsi')}</option>
                  <option value="client">{t('By Client / Payer', 'Nyirubwite / Umukiriya')}</option>
                  <option value="shared">{t('Shared Responsibilities', 'Bifatanije')}</option>
                </select>
              </div>
            </div>

            {/* Privacy Law Data Minimisation Notice (Proposal Sec 9.1 & 9.2) */}
            <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[10px] text-slate-400 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {t(
                  'Rwanda Law No. 058/2021 Data Minimisation: Collect only necessary contact details. National ID numbers are optional and safeguarded.',
                  'Itegeko No. 058/2021 rirengera amakuru bwite: Hakusanywa gusa amakuru akenewe kuri aya masezerano.'
                )}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                {t('Parties Information:', 'Amakuru y Abagiranye Amasezerano:')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                    {t('Contractor / Worker', 'Umukozi')}
                  </span>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={contractorPhone}
                    onChange={(e) => setContractorPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-blue-400 font-bold block mb-1">
                    {t('Client / Payer', 'Umukiriya')}
                  </span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client name"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Milestones & Price */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('Total Contract Price (RWF):', 'Amafaranga Yose (RWF):')}
                </label>
                <input
                  type="number"
                  value={totalAmountRwf}
                  onChange={(e) => setTotalAmountRwf(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t('End Deadline:', 'Itariki Ntarengwa:')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  {t('Work Stages & Milestone Breakdown (Sec 5.2):', 'Intambwe z Umurimo n Igiciro:')}
                </label>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('Add Stage', 'Ongeraho')}</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {stages.map((stg, idx) => (
                  <div key={stg.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-400">
                        {t('Stage', 'Icyiciro')} {idx + 1}
                      </span>
                      {stages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(idx)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={stg.name}
                      onChange={(e) => handleStageChange(idx, 'name', e.target.value)}
                      placeholder="Stage Title"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mb-1.5"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={stg.amountRwf}
                        onChange={(e) => handleStageChange(idx, 'amountRwf', Number(e.target.value))}
                        placeholder="RWF Amount"
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-emerald-400 font-semibold"
                      />
                      <input
                        type="date"
                        value={stg.targetDate}
                        onChange={(e) => handleStageChange(idx, 'targetDate', e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Fair Delay Terms & Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <h3 className="text-xs font-bold text-slate-200 uppercase mb-2 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('Fair Delay Deduction Clause (Proposal Sec 6.1)', 'Ingingo yo Gutinda kw Umurimo')}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                {t(
                  'Balanced parameters protecting both parties against unfair penalties or arbitrary deductions.',
                  'Amategeko aciriritse arinda impande zombi igihano kirenze urugero.'
                )}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{t('Grace Days:', 'Imbabazi:')}</label>
                  <input
                    type="number"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    min={0}
                    max={14}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-center text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{t('Daily Rate %:', 'Ku munsi %:')}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={dailyPenaltyPercent}
                    onChange={(e) => setDailyPenaltyPercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-center text-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{t('Max Cap %:', 'Ntarengwa %:')}</label>
                  <input
                    type="number"
                    value={maxPenaltyPercent}
                    onChange={(e) => setMaxPenaltyPercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-bold text-center text-rose-400"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                <strong>{t('Generated Clause Text:', 'Inyandiko y Ingingo:')}</strong>
                <p className="mt-1 italic text-slate-400">
                  "After a {gracePeriodDays}-day grace period, a delay deduction of {dailyPenaltyPercent}% of the affected milestone value per late day applies, capped at {maxPenaltyPercent}% of that milestone. Indicative calculation subject to mutual human review."
                </p>
              </div>
            </div>

            {/* Final Agreement Confirmation Box */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>{title || 'Agreement'}</span>
                <span>RWF {totalAmountRwf.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                {stages.length} {t('stages planned across', 'ibyiciro biteganyijwe hagati ya')} {contractorName} & {clientName}.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back', 'Subira Inyuma')}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              <span>{t('Next Step', 'Komeza')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-950 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t('Create & Request Signatures', 'Kora no Gusaba Imikono')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

