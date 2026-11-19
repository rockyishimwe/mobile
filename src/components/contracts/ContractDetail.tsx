import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contract } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  History, 
  Layers, 
  AlertCircle, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Scale,
  DollarSign
} from 'lucide-react';
import { VersionHistoryModal } from './VersionHistoryModal';
import { ConfirmContractModal } from './ConfirmContractModal';

interface ContractDetailProps {
  contract: Contract;
  onBack: () => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onBack }) => {
  const { t, role, setActiveTab, raiseDispute, resolveDispute } = useApp();
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeText, setDisputeText] = useState('');

  const isContractor = role === 'worker' || role === 'cooperative';
  const myParty = isContractor ? contract.parties.contractor : contract.parties.client;
  const isAwaitingMyConfirmation = !myParty.confirmed && contract.status === 'awaiting_confirmation';

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeText.trim()) return;
    raiseDispute(contract.id, disputeText.trim());
    setShowDisputeInput(false);
    setDisputeText('');
  };

  return (
    <div className="pb-24 pt-2">
      {/* Back button & Version pill */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('Back to Contracts', 'Subira Inyuma')}</span>
        </button>

        <button
          onClick={() => setShowVersionModal(true)}
          className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg hover:bg-emerald-900/40 transition-colors"
        >
          <History className="w-3.5 h-3.5" />
          <span>{contract.currentVersion} {t('History', 'Amateka')}</span>
        </button>
      </div>

      {/* Main Contract Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-medium">
            {contract.id}
          </span>
          <StatusBadge status={contract.status} />
        </div>

        <h1 className="text-base font-bold text-white mb-1 leading-snug">
          {contract.title}
        </h1>
        <p className="text-xs text-slate-400 italic mb-3">
          {contract.titleRw}
        </p>

        {/* Framework Link Notice if Work Order */}
        {contract.type === 'work_order' && contract.frameworkAgreementId && (
          <div className="mb-3 p-2.5 bg-blue-950/40 border border-blue-800/50 rounded-xl flex items-center space-x-2 text-xs text-blue-200">
            <Layers className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block">{t('Linked to Framework Agreement (Sec 4.3):', 'Yometse ku Masezerano Rusange:')}</span>
              <span className="text-[11px] text-blue-300 truncate block">{contract.frameworkTitle || contract.frameworkAgreementId}</span>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 mb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              {t('Total Agreed Price', 'Igiciro Cyumvikanywe')}
            </span>
            <span className="text-sm font-black text-emerald-400">
              RWF {contract.totalAmountRwf.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              {t('Completion Deadline', 'Itariki Ntarengwa')}
            </span>
            <span className="text-xs font-bold text-white">
              {contract.endDate}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              {t('Materials Supply', 'Ibikoresho Bitangwa')}
            </span>
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {contract.materialsProvidedBy} {t('Supplied', 'Niwe ubitanga')}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              {t('Work Location', 'Aho Bikorerwa')}
            </span>
            <span className="text-xs font-medium text-slate-200 truncate block">
              {contract.location}
            </span>
          </div>
        </div>

        {/* Action: Sign & Confirm if Awaiting Confirmation */}
        {contract.status === 'awaiting_confirmation' && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl mb-3">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('Action Required: Digital Confirmation', 'Hakenewe Kwemezwa n Impande Zombi')}</span>
            </div>
            <p className="text-[11px] text-amber-200/80 mb-3">
              {t(
                'Proposal Rule 5.1: Agreement terms are in final review and must be confirmed with reference to this specific version before work begins.',
                'Amasezerano ari mu isuzumwa rya nyuma kandi agomba kwemezwa n impande zombi mbere y uko umurimo utangira.'
              )}
            </p>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('Sign & Confirm Contract Digitally', 'Sinya no Kwemeza Aya Masezerano')}</span>
            </button>
          </div>
        )}

        {/* Quick Navigation to other Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setActiveTab('tracker')}
            className="flex items-center justify-between p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                {t('Track Work Stages', 'Intambwe z Umurimo')}
              </span>
              <span className="text-[10px] text-slate-400">
                {contract.stages.length} {t('stages defined', 'ziteganyijwe')}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="flex items-center justify-between p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                {t('Payment Status', 'Kwishyura & MoMo')}
              </span>
              <span className="text-[10px] text-slate-400">
                {contract.payments.length} {t('records logged', 'byishyuwe')}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Parties & Dual Sign-off (Proposal Sec 4.1 & 5.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          {t('Contract Parties & Confirmation (Sec 4.1)', 'Abagiranye Amasezerano')}
        </h2>

        <div className="space-y-2.5">
          {/* Contractor */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                W
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white truncate block">
                  {contract.parties.contractor.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {contract.parties.contractor.organization || contract.parties.contractor.phone}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              {contract.parties.contractor.confirmed ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('Confirmed', 'Yabyemeje')}</span>
                </div>
              ) : (
                <span className="text-xs text-amber-400 font-medium">
                  {t('Pending', 'Ategerejwe')}
                </span>
              )}
              {contract.parties.contractor.confirmedAt && (
                <span className="text-[9px] text-slate-500 block">{contract.parties.contractor.confirmedAt}</span>
              )}
            </div>
          </div>

          {/* Client */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-700 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                C
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white truncate block">
                  {contract.parties.client.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {contract.parties.client.organization || contract.parties.client.phone}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              {contract.parties.client.confirmed ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('Confirmed', 'Yabyemeje')}</span>
                </div>
              ) : (
                <span className="text-xs text-amber-400 font-medium">
                  {t('Pending', 'Ategerejwe')}
                </span>
              )}
              {contract.parties.client.confirmedAt && (
                <span className="text-[9px] text-slate-500 block">{contract.parties.client.confirmedAt}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scope and Deliverables */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
          {t('Agreed Scope of Work', 'Ibisobanuro by Umurimo')}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 mb-2">
          {contract.scope}
        </p>
        <p className="text-[11px] text-slate-400 italic">
          <strong>Kinyarwanda:</strong> {contract.scopeRw}
        </p>
      </div>

      {/* Delay Clause & Fair Remedies (Proposal Section 6.1 & 6.2) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t('Delay Remedies Clause (Sec 6.1)', 'Ingingo yo Gutinda kw Umurimo')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('remedies')}
            className="text-[11px] text-emerald-400 font-semibold hover:underline"
          >
            {t('Open Calculator', 'Fungura Imibare')}
          </button>
        </div>

        <p className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 mb-2">
          {contract.delayClause.clauseText}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800/60 p-2 rounded-lg">
            <span className="text-[10px] text-slate-400 block">{t('Grace Period', 'Imbabazi')}</span>
            <span className="font-bold text-white">{contract.delayClause.gracePeriodDays} {t('Days', 'Iminsi')}</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg">
            <span className="text-[10px] text-slate-400 block">{t('Daily Rate', 'Ku Munsi')}</span>
            <span className="font-bold text-amber-400">{contract.delayClause.dailyPenaltyPercent}%</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg">
            <span className="text-[10px] text-slate-400 block">{t('Max Deduction', 'Gufungirwa Kugeza')}</span>
            <span className="font-bold text-rose-400">{contract.delayClause.maxPenaltyPercent}%</span>
          </div>
        </div>

        {/* Required Safeguard Note from Proposal Page 7 */}
        <div className="mt-3 p-2 bg-slate-800/40 border border-slate-700 rounded-xl text-[10px] text-slate-400 leading-relaxed flex items-start space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            {t(
              'Required Safeguard: Human review before action. Never silently deduct money or reduce payment based only on AI or unreviewed automation.',
              'Icyitonderwa: Gukata amafaranga bisaba isuzuma n ubwumvikane bw abantu. Sisitemu ntiyigera ikata amafaranga mu buryo bwikora.'
            )}
          </span>
        </div>
      </div>

      {/* Dispute Management Banner (Proposal Sec 6.1) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
          {t('Dispute & Fair Redress (Sec 6.1)', 'Gukemura Impaka n Ibirego')}
        </h2>

        {contract.isDisputed ? (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl mb-3">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t('Active Dispute Logged', 'Ikirego Kirakomeje')}</span>
            </div>
            <p className="text-xs text-rose-200/90 mb-2">{contract.disputeReason}</p>
            <span className="text-[10px] text-slate-400 block mb-3">
              {t('Logged on:', 'Cyatanzwe kuya:')} {contract.disputeDate} · {t('Automated delay penalties are paused.', 'Ibiciro byo gutinda byahagaritswe by amaguru mashya.')}
            </span>
            <button
              onClick={() => resolveDispute(contract.id)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-600 transition-colors"
            >
              {t('Mark Dispute Resolved by Mutual Agreement', 'Kugaragaza ko Impaka Zakemutse')}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-slate-400 mb-3">
              {t(
                'If there is a disagreement over materials, quality, or unexpected conditions, either party can raise a dispute to pause automated penalties.',
                'Niba hari ikibazo ku bikoresho cyangwa imiterere y akazi, ushobora gutanga ikirego ngo ibihano bihagarikwe.'
              )}
            </p>

            {showDisputeInput ? (
              <form onSubmit={handleDisputeSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder={t('Describe the issue or disagreement in detail...', 'Sobanura ikibazo witegereje mu magambo arambuye...')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    {t('Confirm & Pause Penalties', 'Emeza & Hagarika')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDisputeInput(false)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium"
                  >
                    {t('Cancel', 'Hagarika')}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowDisputeInput(true)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-rose-400 hover:text-rose-300 border border-rose-900/50 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('Raise Formal Work Dispute', 'Tanga Ikirego cy Umurimo')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showVersionModal && (
        <VersionHistoryModal 
          contract={contract} 
          onClose={() => setShowVersionModal(false)} 
        />
      )}

      {showConfirmModal && (
        <ConfirmContractModal
          contract={contract}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

