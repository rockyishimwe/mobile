import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';

interface ReworkModalProps {
  contractId: string;
  stageId: string;
  stageTitle: string;
  onClose: () => void;
}

export const ReworkModal: React.FC<ReworkModalProps> = ({
  contractId,
  stageId,
  stageTitle,
  onClose
}) => {
  const { t, requestRework } = useApp();
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    requestRework(contractId, stageId, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('Request Correction / Rework', 'Gusaba Gukosora Umurimo')}
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {stageTitle}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-300">
            {t(
              'Specify what adjustments are needed before this milestone can be accepted and paid for:',
              'Sobanura ibigomba gukosorwa mbere y uko iki cyiciro cyemezwa kandi kikishyurwa:'
            )}
          </p>

          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('e.g. Please reinforce the bitumen seam along the southern gutter before we close this stage.', 'Urugero: Nyamuneka ongera ushimangire umuti urinda amazi ku rukuta rw hepfo.')}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Send Correction Request', 'Ohereza Ubusabe bwo Gukosora')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              {t('Cancel', 'Hagarika')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

