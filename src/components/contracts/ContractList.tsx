import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contract, ContractType, ContractStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  FileCheck2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ContractListProps {
  onSelectContract: (contract: Contract) => void;
  onOpenCreateWizard: () => void;
}

export const ContractList: React.FC<ContractListProps> = ({ onSelectContract, onOpenCreateWizard }) => {
  const { contracts, t, role } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContractType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.titleRw.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case 'short_term':
        return t('Short-Term Job', 'Akazi k igihe gito');
      case 'framework':
        return t('Framework Master', 'Amasezerano Rusange');
      case 'work_order':
        return t('Work Order', 'Urwandiko rw Akazi');
    }
  };

  return (
    <div className="pb-24 pt-2">
      {/* Top Banner & Stats Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 mb-4 border border-slate-700/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-white">
              {t('Contract Workspace', 'Ibiro by Amasezerano')}
            </h2>
            <p className="text-xs text-slate-300">
              {t('Proposal Sec 3.1: Reusable templates & work progress', 'Guhuza amasezerano n intambwe z imirimo')}
            </p>
          </div>
          <button
            onClick={onOpenCreateWizard}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('New Agreement', 'Amasezerano Mashya')}</span>
          </button>
        </div>

        {/* Quick Metrics from Proposal Context */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
          <div className="bg-slate-800/60 rounded-lg p-2">
            <span className="text-[10px] text-slate-400 block">{t('Total Active', 'Akora Ubu')}</span>
            <span className="text-sm font-bold text-emerald-400">
              {contracts.filter(c => c.status === 'active').length}
            </span>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-2">
            <span className="text-[10px] text-slate-400 block">{t('Needs Review', 'Gusuzuma')}</span>
            <span className="text-sm font-bold text-amber-400">
              {contracts.filter(c => c.status === 'awaiting_confirmation' || c.stages.some(s => s.status === 'in_review')).length}
            </span>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-2">
            <span className="text-[10px] text-slate-400 block">{t('Disputed/Overdue', 'Ibifite Ikibazo')}</span>
            <span className="text-sm font-bold text-rose-400">
              {contracts.filter(c => c.isDisputed || c.stages.some(s => s.status === 'overdue')).length}
            </span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={t('Search contracts, locations, IDs...', 'Shakisha amasezerano, aho aherereye...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Contract Type Tabs (Proposal Section 4.2 & 4.3) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
        {[
          { id: 'all', label: t('All Agreements', 'Byose') },
          { id: 'short_term', label: t('Short-Term (4.2)', 'Igihe Gito') },
          { id: 'framework', label: t('Framework (4.3)', 'Amasezerano Rusange') },
          { id: 'work_order', label: t('Work Orders', 'Inyandiko z Akazi') }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
              typeFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Filter Chips */}
      <div className="flex space-x-1 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {(['all', 'active', 'awaiting_confirmation', 'disputed', 'expired'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-slate-700 text-white font-medium border border-slate-500'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-300'
            }`}
          >
            {st === 'all' ? t('All Statuses', 'Imiterere Yose') : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Contract Cards List */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              {t('No contracts match your filter', 'Nta masezerano ahuye n ibyo mushakishije')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t('Try adjusting filters or create a new agreement.', 'Hindura amashakiro cyangwa ukore andi mashya.')}
            </p>
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const completedStages = contract.stages.filter(s => s.status === 'completed').length;
            const totalStages = contract.stages.length;
            const progressPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

            return (
              <div
                key={contract.id}
                onClick={() => onSelectContract(contract)}
                className={`bg-slate-900/90 hover:bg-slate-850 border rounded-2xl p-4 transition-all cursor-pointer shadow-sm relative ${
                  contract.isDisputed 
                    ? 'border-rose-500/50 bg-rose-950/10' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header: ID, Type & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {contract.id}
                    </span>
                    <span className="text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                      {getContractTypeLabel(contract.type)}
                    </span>
                    {contract.type === 'work_order' && contract.frameworkAgreementId && (
                      <span className="text-[9px] bg-blue-950/60 text-blue-300 border border-blue-800/40 px-1.5 py-0.5 rounded flex items-center space-x-1">
                        <Layers className="w-2.5 h-2.5 mr-0.5" />
                        <span>{t('Linked to FW', 'Yometse kuri FW')}</span>
                      </span>
                    )}
                  </div>
                  <StatusBadge status={contract.status} size="sm" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
                  {contract.title}
                </h3>
                <p className="text-xs text-slate-400 mb-2 italic line-clamp-1">
                  {contract.titleRw}
                </p>

                {/* Scope Preview */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                  {contract.scope}
                </p>

                {/* Location and Date */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <div className="flex items-center space-x-1 truncate max-w-[50%]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{contract.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contract.endDate}</span>
                  </div>
                </div>

                {/* Work Stages Progress Bar (Proposal Sec 5.2) */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">
                      {t('Work Stages Progress', 'Intambwe z Umurimo')}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {completedStages}/{totalStages} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer: Parties, Amount in RWF & Tap to open */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {t('Total Contract Value', 'Agaciro k Amasezerano')}
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      RWF {contract.totalAmountRwf.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold hover:underline">
                    <span>{t('View Details', 'Reba')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Dispute Alert Banner if Disputed */}
                {contract.isDisputed && (
                  <div className="mt-2.5 p-2 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start space-x-2 text-[11px] text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>{t('Dispute Paused:', 'Kutemeranya:')}</strong> {contract.disputeReason}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

