import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink, 
  X, 
  Building2, 
  Smartphone, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const PaymentStatusView: React.FC = () => {
  const { contracts, activeContract, t, role, addPaymentRecord } = useApp();
  const [selectedContractId, setSelectedContractId] = useState<string>(activeContract?.id || contracts[0].id);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const contract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // New Payment Form State
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(contract.stages[0]?.id || '');
  const [amountRwf, setAmountRwf] = useState<number>(contract.stages[0]?.amountRwf || 100000);
  const [provider, setProvider] = useState<PaymentRecord['provider']>('MTN Mobile Money');
  const [providerReference, setProviderReference] = useState('');
  const [receiptNote, setReceiptNote] = useState('');

  const totalPaid = contract.payments.reduce((acc, p) => acc + p.amountRwf, 0);
  const remainingBalance = Math.max(0, contract.totalAmountRwf - totalPaid);
  const paymentProgress = Math.round((totalPaid / contract.totalAmountRwf) * 100);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerReference.trim()) return;

    const matchedStage = contract.stages.find(s => s.id === selectedMilestoneId);

    addPaymentRecord(contract.id, {
      milestoneId: selectedMilestoneId,
      milestoneTitle: matchedStage ? matchedStage.name : 'General Payment',
      amountRwf: Number(amountRwf),
      provider,
      providerReference: providerReference.trim(),
      receiptNote: receiptNote.trim() || 'Payment verified via mobile money SMS confirmation'
    });

    setShowAddPaymentModal(false);
    setProviderReference('');
    setReceiptNote('');
  };

  return (
    <div className="pb-24 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 mb-4 border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {t('Payment-Status Layer', 'Gukurikirana Kwishyura')}
              </h2>
              <p className="text-[11px] text-slate-300">
                {t('Phase 1: Traceable references & provider confirmation', 'Icyiciro cya 1: Kwandika nimero z yishyuwe')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('Record Ref', 'Andika MoMo')}</span>
          </button>
        </div>

        {/* Regulatory & BNR Compliance Callout (Proposal Sec 6.3 & 9.2) */}
        <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-[10px] text-amber-200/90 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {t(
              'National Bank of Rwanda (BNR) Compliance: IZERE does not hold customer funds or operate unlicensed escrow (Law No. 61/2021). All payments occur directly between parties via authorized PSPs (MTN MoMo, Airtel, Banks).',
              'Icyitonderwa cy Amategeko ya BNR: IZERE ntibika amafaranga y abakiriya. Kwishyurana bibera mu mirongo yemewe (MTN MoMo, Airtel, Banki).'
            )}
          </span>
        </div>
      </div>

      {/* Contract Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          {t('Select Agreement:', 'Hitamo Amasezerano:')}
        </label>
        <select
          value={contract.id}
          onChange={(e) => setSelectedContractId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white mb-3"
        >
          {contracts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.title}
            </option>
          ))}
        </select>

        {/* Financial Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {t('Total Paid to Date:', 'Ayishyuwe:')}
            </span>
            <span className="text-emerald-400 font-bold">
              RWF {totalPaid.toLocaleString()} / {contract.totalAmountRwf.toLocaleString()} ({paymentProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, paymentProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>{t('Balance Pending:', 'Asigaye kwishyurwa:')}</span>
            <span className="font-semibold text-white">RWF {remainingBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Milestone Payment Obligations */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          {t('Milestone Payment Breakdown', 'Gahunda yo Kwishyura Ibyiciro')}
        </h3>

        <div className="space-y-2">
          {contract.stages.map((stage) => {
            const isStagePaid = contract.payments.some(p => p.milestoneId === stage.id);
            return (
              <div 
                key={stage.id}
                className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="truncate max-w-[65%]">
                  <span className="font-semibold text-white block truncate">
                    {stage.order}. {stage.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t('Target Date:', 'Itariki:')} {stage.targetDate}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-white block">
                    RWF {stage.amountRwf.toLocaleString()}
                  </span>
                  {isStagePaid ? (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t('Paid', 'Byishyuwe')}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-medium">
                      {stage.status === 'completed' ? t('Due Now', 'Bitegerejwe') : t('Pending Work', 'Kugera ku ntego')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified External Payment Records (Proposal Sec 6.3) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t('Provider References & Transactions', 'Inyandiko z Amafaranga')}
          </h3>
          <span className="text-[10px] text-slate-400">
            {contract.payments.length} {t('transactions', 'byishyuwe')}
          </span>
        </div>

        {contract.payments.length === 0 ? (
          <div className="p-6 text-center bg-slate-850 rounded-xl border border-slate-800">
            <Smartphone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              {t('No external payments recorded yet for this contract.', 'Nta nyandiko yo kwishyura irashyirwaho kuri aya masezerano.')}
            </p>
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="mt-3 text-xs text-emerald-400 font-semibold hover:underline"
            >
              + {t('Record MoMo or Bank Reference', 'Andika Nimero ya MoMo')}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {contract.payments.map((pay) => (
              <div 
                key={pay.id}
                className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">
                    RWF {pay.amountRwf.toLocaleString()}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    pay.status === 'provider_confirmed' 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  }`}>
                    {pay.status === 'provider_confirmed' 
                      ? t('Provider Confirmed', 'Byemejwe na Sisitemu') 
                      : t('User Reported', 'Byatangajwe')}
                  </span>
                </div>

                <div className="text-slate-300 font-medium truncate">
                  {pay.milestoneTitle}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center space-x-1">
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    <span>{pay.provider}</span>
                  </span>
                  <span className="font-mono text-slate-300 font-semibold">
                    {pay.providerReference}
                  </span>
                </div>

                {pay.receiptNote && (
                  <p className="text-[10px] text-slate-500 italic">
                    "{pay.receiptNote}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t('Record Mobile Money / Bank Reference', 'Andika Nimero yo Kwishyura')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {contract.id}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAddPaymentModal(false)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3.5">
              {/* Milestone select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('Payment Milestone:', 'Icyiciro Wishyuriye:')}
                </label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => {
                    const sId = e.target.value;
                    setSelectedMilestoneId(sId);
                    const matched = contract.stages.find(s => s.id === sId);
                    if (matched) setAmountRwf(matched.amountRwf);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {contract.stages.map(stg => (
                    <option key={stg.id} value={stg.id}>
                      {stg.order}. {stg.name} (RWF {stg.amountRwf.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Provider select */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('Payment Channel:', 'Uburyo bwo Kwishyura:')}
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="MTN Mobile Money">MTN Mobile Money (*182#)</option>
                    <option value="Airtel Money">Airtel Money (*182#)</option>
                    <option value="Bank of Kigali">Bank of Kigali (BK)</option>
                    <option value="I&M Bank">I&M Bank Rwanda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t('Amount Paid (RWF):', 'Amafaranga (RWF):')}
                  </label>
                  <input
                    type="number"
                    value={amountRwf}
                    onChange={(e) => setAmountRwf(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                    required
                  />
                </div>
              </div>

              {/* Transaction Code Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('Transaction ID / SMS Reference Code:', 'Nimero y Ubutumwa (Reference):')}
                </label>
                <input
                  type="text"
                  value={providerReference}
                  onChange={(e) => setProviderReference(e.target.value)}
                  placeholder="e.g. MP261114.1530.A90812"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-emerald-500 uppercase"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('Verification Note (Optional):', 'Ibisobanuro:')}
                </label>
                <input
                  type="text"
                  value={receiptNote}
                  onChange={(e) => setReceiptNote(e.target.value)}
                  placeholder="e.g. Verified by payer via MoMo SMS callback"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Save Traceable Payment Record', 'Bika Inyandiko y Kwishyura')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

