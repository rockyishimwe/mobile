import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  DollarSign
} from 'lucide-react';

export const DelayDeductionCalculator: React.FC = () => {
  const { contracts, activeContract, t } = useApp();
  const [selectedContractId, setSelectedContractId] = useState<string>(activeContract?.id || contracts[0].id);

  const contract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Interactive Calculator Inputs (Defaults loaded from selected contract)
  const [milestoneValueRwf, setMilestoneValueRwf] = useState<number>(200000);
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(contract.delayClause.gracePeriodDays);
  const [dailyRatePercent, setDailyRatePercent] = useState<number>(contract.delayClause.dailyPenaltyPercent);
  const [maxCapPercent, setMaxCapPercent] = useState<number>(contract.delayClause.maxPenaltyPercent);
  const [daysLate, setDaysLate] = useState<number>(5);

  // Dynamic calculations based on Proposal Section 6.2 formula
  const chargeableDays = Math.max(0, daysLate - gracePeriodDays);
  const rawDeductionAmount = chargeableDays * (dailyRatePercent / 100) * milestoneValueRwf;
  const maxCapAmount = (maxCapPercent / 100) * milestoneValueRwf;
  const appliedDeductionAmount = Math.min(rawDeductionAmount, maxCapAmount);
  const netPayableRwf = Math.max(0, milestoneValueRwf - appliedDeductionAmount);
  const isCapped = rawDeductionAmount > maxCapAmount;

  return (
    <div className="pb-24 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 mb-4 border border-slate-700/80 shadow-md">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              {t('Fair Delay Remedies & Calculator', 'Gucunga Ibiciro byo Gutinda kw Umurimo')}
            </h2>
            <p className="text-[11px] text-slate-300">
              {t('Proposal Section 6: Non-punitive, clause-grounded transparency', 'Ingingo ya 6: Ibipimo byumvikanywe mu masezerano')}
            </p>
          </div>
        </div>

        {/* Required Safeguard Banner */}
        <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-200 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            {t(
              'Required Safeguards: Human review before action. Never silently deduct money. Calculations are strictly indicative and paused during any active dispute.',
              'Ingamba z umutekano: Bisaba isuzuma ry abantu. Sisitemu ntikatira amafaranga mu buryo bwikora cyangwa ngo yihimbire amande.'
            )}
          </span>
        </div>
      </div>

      {/* Select Contract to load Clause */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          {t('Select Agreement for Terms & Clause:', 'Hitamo Amasezerano:')}
        </label>
        <select
          value={contract.id}
          onChange={(e) => {
            const nextId = e.target.value;
            setSelectedContractId(nextId);
            const found = contracts.find(c => c.id === nextId);
            if (found) {
              setGracePeriodDays(found.delayClause.gracePeriodDays);
              setDailyRatePercent(found.delayClause.dailyPenaltyPercent);
              setMaxCapPercent(found.delayClause.maxPenaltyPercent);
            }
          }}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white mb-3"
        >
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.title}
            </option>
          ))}
        </select>

        {/* Display Actual Agreed Clause Text */}
        <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-400">
              {t('Agreed Contract Clause:', 'Ingingo Yemeranyijwe:')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {contract.id} · v{contract.currentVersion}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{contract.delayClause.clauseText}"
          </p>
        </div>
      </div>

      {/* Interactive Simulation Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center space-x-1.5 mb-3">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t('Transparent Indicative Calculator (Sec 6.2)', 'Imibare y Icyitegererezo')}
          </h3>
        </div>

        <div className="space-y-3">
          {/* Milestone Value Input */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">
                {t('Milestone Value (RWF):', 'Agaciro k Icyiciro (RWF):')}
              </span>
              <span className="font-bold text-emerald-400">
                RWF {milestoneValueRwf.toLocaleString()}
              </span>
            </div>
            <input
              type="number"
              value={milestoneValueRwf}
              onChange={(e) => setMilestoneValueRwf(Number(e.target.value))}
              step={10000}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Days Late Slider / Number */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">
                {t('Total Calendar Days Late:', 'Iminsi yose yatinze:')}
              </span>
              <span className="font-bold text-rose-400">
                {daysLate} {t('Days Late', 'Iminsi')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={daysLate}
              onChange={(e) => setDaysLate(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block">{t('Grace Period', 'Imbabazi')}</span>
              <span className="font-bold text-white text-xs">{gracePeriodDays} {t('days', 'iminsi')}</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block">{t('Daily Rate', 'Ku munsi')}</span>
              <span className="font-bold text-amber-400 text-xs">{dailyRatePercent}%</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 block">{t('Max Cap', 'Ntarengwa')}</span>
              <span className="font-bold text-rose-400 text-xs">{maxCapPercent}%</span>
            </div>
          </div>

          {/* Detailed Calculation Breakdown Card (Proposal Sec 6.2) */}
          <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-700/80 space-y-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('Chargeable Days (Days - Grace):', 'Iminsi Irihishwa:')}</span>
              <span className="font-semibold text-white">
                {daysLate} - {gracePeriodDays} = <strong className="text-amber-400">{chargeableDays} days</strong>
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('Formula Calculation:', 'Imibare:')}</span>
              <span className="font-mono text-slate-300">
                {chargeableDays} × {dailyRatePercent}% × {milestoneValueRwf.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-xs pt-1 border-t border-slate-700">
              <span className="text-slate-300 font-medium">
                {t('Indicative Delay Deduction:', 'Ayakatwa:')}
              </span>
              <span className="font-bold text-rose-400">
                - RWF {appliedDeductionAmount.toLocaleString()}
                {isCapped && <span className="text-[10px] text-amber-300 block font-normal">(Capped at {maxCapPercent}%)</span>}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-slate-700 font-bold">
              <span className="text-white">{t('Net Recommended Payout:', 'Amafaranga Yishyurwa:')}</span>
              <span className="text-emerald-400 font-black">
                RWF {netPayableRwf.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Situations Reference Table (Proposal Sec 6.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
          {t('IZERE Fair Remedy Rules (Proposal Sec 6.1)', 'Amategeko yo Gukemura Ibibazo')}
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-white block mb-0.5">
              1. {t('Deadline Approaching:', 'Igihe Ntarengwa Kigiye Kugera:')}
            </span>
            <p className="text-[11px] text-slate-400">
              {t('Configurable reminders (7 days & 24 hours). Shows outstanding milestones to responsible parties.', 'Ubutumwa bwo kuburira iminsi 7 n amasaha 24 mbere.')}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-white block mb-0.5">
              2. {t('Work Overdue (Cause Unknown):', 'Umurimo Watinze:')}
            </span>
            <p className="text-[11px] text-slate-400">
              {t('Never assume fault. Mark stage overdue and request an explanation or extension.', 'Ntukiteze amakosa ku muntu runaka. Saba ibisobanuro cyangwa kongera igihe.')}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="font-bold text-white block mb-0.5">
              3. {t('Dispute Raised:', 'Impaka Zavutse:')}
            </span>
            <p className="text-[11px] text-slate-400">
              {t('Retain evidence, freeze automated deduction triggers, and pause payout changes until mutual resolution.', 'Bika ibimenyetso kandi uhagarike ibihano mu gihe hakiri impaka.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

