import React from 'react';
import { useApp } from '../../context/AppContext';
import { Contract } from '../../types';
import { X, GitCommit, User, Calendar, CheckCircle2 } from 'lucide-react';

interface VersionHistoryModalProps {
  contract: Contract;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ contract, onClose }) => {
  const { t } = useApp();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('Contract Version History', 'Amateka y Impinduka mu Masezerano')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {contract.id} · {t('Current Version:', 'Verisiyo iriho:')} {contract.currentVersion}
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

        {contract.versionHistory.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            {t('Initial version v1.0. No subsequent revisions recorded.', 'Verisiyo ya mbere v1.0. Nta zindi mpinduka zirakorwa.')}
          </p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {contract.versionHistory.map((ver, idx) => (
              <div key={idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                
                <div className="bg-slate-850 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-400 text-xs px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-800/40">
                      {ver.version}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 mr-0.5" />
                      {ver.changedAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium mb-2">
                    {ver.summary}
                  </p>

                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-2">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{t('Authored by:', 'Byakozwe na:')} <strong>{ver.changedBy}</strong></span>
                  </div>

                  {ver.changes.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        {t('Field Differences:', 'Ibyahindutse:')}
                      </span>
                      {ver.changes.map((ch, cIdx) => (
                        <div key={cIdx} className="text-[11px] bg-slate-900/80 p-2 rounded-lg font-mono">
                          <span className="text-slate-400 block font-sans font-semibold text-[10px] mb-0.5">{ch.field}</span>
                          <span className="text-rose-400 block line-through">- {ch.oldValue}</span>
                          <span className="text-emerald-400 block">+ {ch.newValue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center space-x-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('Mutually Accepted & Stored in Audit Trail', 'Byemejwe n Impande Zombi')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            {t('Close History', 'Funga')}
          </button>
        </div>
      </div>
    </div>
  );
};

