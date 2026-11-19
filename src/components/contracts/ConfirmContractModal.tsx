import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contract } from '../../types';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Phone, Lock } from 'lucide-react';

interface ConfirmContractModalProps {
  contract: Contract;
  onClose: () => void;
}

export const ConfirmContractModal: React.FC<ConfirmContractModalProps> = ({ contract, onClose }) => {
  const { t, role, confirmContract } = useApp();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [smsOtpCode, setSmsOtpCode] = useState('8921');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partyRole = role === 'worker' || role === 'cooperative' ? 'contractor' : 'client';
  const partyData = partyRole === 'contractor' ? contract.parties.contractor : contract.parties.client;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    setIsSubmitting(true);
    setTimeout(() => {
      confirmContract(contract.id, partyRole);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('Digital Contract Confirmation', 'Kwemeza Amasezerano mu buryo bw Ikoranabuhanga')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('Version Bound:', 'Verisiyo igenderwaho:')} {contract.currentVersion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ethical Summary of Terms (Proposal Sec 9.3) */}
        <div className="bg-slate-800/60 rounded-xl p-3 mb-4 border border-slate-700/60 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">{t('Agreement:', 'Amasezerano:')}</span>
            <span className="font-semibold text-white truncate max-w-[200px]">{contract.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('Total Amount:', 'Amafaranga yose:')}</span>
            <span className="font-bold text-emerald-400">RWF {contract.totalAmountRwf.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('Completion Date:', 'Itariki Ntarengwa:')}</span>
            <span className="font-semibold text-white">{contract.endDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('Delay Grace Period:', 'Imbabazi zo Gutinda:')}</span>
            <span className="font-semibold text-amber-300">{contract.delayClause.gracePeriodDays} {t('Days', 'Iminsi')}</span>
          </div>
        </div>

        {/* Signing Party Information */}
        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 mb-4 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
            {partyRole === 'contractor' ? 'W' : 'C'}
          </div>
          <div className="truncate text-xs">
            <span className="font-bold text-white block truncate">{partyData.name}</span>
            <span className="text-slate-400 text-[11px]">{partyData.phone}</span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Simulated SMS OTP Verification */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('SMS Verification PIN (Simulated for Demo):', 'Umubare w Isuzuma wa SMS:')}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">PIN: 8921</span>
            </label>
            <input
              type="text"
              value={smsOtpCode}
              onChange={(e) => setSmsOtpCode(e.target.value)}
              maxLength={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Explicit Ethical Terms Checkbox */}
          <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 bg-slate-800"
              required
            />
            <span className="text-[11px] text-slate-300 leading-tight">
              {t(
                'I have reviewed and agree to the scope, milestones, delay remedies, and payment schedule specified in version ',
                'Nasomye kandi nemeye ibisobanuro by umurimo, ibiciro, intambwe z akazi, n amatariki biri muri verisiyo '
              )}
              <strong className="text-emerald-400">{contract.currentVersion}</strong>.
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!agreedToTerms || isSubmitting}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
                agreedToTerms && !isSubmitting
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? t('Recording Digital Signature...', 'Biri Kwemezwa...') 
                  : t(`Sign & Confirm as ${partyRole === 'contractor' ? 'Contractor' : 'Client'}`, `Sinya nka ${partyRole === 'contractor' ? 'Umukozi' : 'Umukiriya'}`)}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

