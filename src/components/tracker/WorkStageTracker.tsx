import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  Camera, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  FileText, 
  ChevronDown, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { EvidenceUploadModal } from './EvidenceUploadModal';
import { ReworkModal } from './ReworkModal';

export const WorkStageTracker: React.FC = () => {
  const { 
    contracts, 
    activeContractId, 
    setActiveContractId, 
    activeContract, 
    t, 
    role, 
    updateMilestoneStatus, 
    acceptDeliverable,
    setActiveTab
  } = useApp();

  const [selectedStageForEvidence, setSelectedStageForEvidence] = useState<{ id: string; title: string } | null>(null);
  const [selectedStageForRework, setSelectedStageForRework] = useState<{ id: string; title: string } | null>(null);

  const contract = activeContract || contracts[0];
  const isWorker = role === 'worker' || role === 'cooperative';
  const isClient = role === 'client';

  // Configurable Industry Stages Pipeline (Proposal Sec 5.2)
  const getPipelineStages = () => {
    switch (contract.category) {
      case 'construction':
      case 'maintenance':
        return [
          { key: 'plan', label: t('Planning & Site Review', 'Igenamigambi') },
          { key: 'procure', label: t('Procurement', 'Kugura Ibikoresho') },
          { key: 'exec', label: t('Execution', 'Gukora Akazi') },
          { key: 'inspect', label: t('Inspection', 'Isuzuma') },
          { key: 'handover', label: t('Handover', 'Gushyikiriza') }
        ];
      case 'digital':
        return [
          { key: 'plan', label: t('Discovery', 'Igenzura') },
          { key: 'procure', label: t('Design', 'Igishushanyo') },
          { key: 'exec', label: t('Development', 'Kubaka') },
          { key: 'inspect', label: t('Testing', 'Gusuzuma') },
          { key: 'handover', label: t('Deployment', 'Gushyira Hanze') }
        ];
      default:
        return [
          { key: 'plan', label: t('Scheduled', 'Kugena') },
          { key: 'procure', label: t('Preparation', 'Gutegura') },
          { key: 'exec', label: t('In Transit / Service', 'Gutwara') },
          { key: 'inspect', label: t('Inspected', 'Isuzumwa') },
          { key: 'handover', label: t('Accepted', 'Kwemezwa') }
        ];
    }
  };

  const pipeline = getPipelineStages();

  return (
    <div className="pb-24 pt-2">
      {/* Top Contract Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          {t('Tracking Active Agreement (Proposal Sec 5.2):', 'Gukurikirana Amasezerano:')}
        </label>
        <div className="relative">
          <select
            value={contract.id}
            onChange={(e) => setActiveContractId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 appearance-none pr-8 truncate"
          >
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title} ({c.status.replace('_', ' ')})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>

        {/* Contract Status vs Work Status Callout */}
        <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">{t('Contract Legal State:', 'Imiterere y Amasezerano:')}</span>
            <StatusBadge status={contract.status} size="sm" />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {t(
              'Design Rule 5.2: "Contract status answers \'What is the agreement state?\'; Work-stage status answers \'Where is the actual job?\'"',
              'Itegeko: Imiterere y amasezerano itandukanye n aho umurimo ugeze mu bikorwa.'
            )}
          </p>
        </div>
      </div>

      {/* Configurable Work-Stage Visual Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {t('Configurable Stage Pipeline', 'Uruhererekane rw Intambwe')}
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
            {contract.category}
          </span>
        </div>

        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none space-x-2">
          {pipeline.map((step, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === pipeline.length - 1;
            return (
              <div key={step.key} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    idx < 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 max-w-[60px] text-center leading-tight">
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="w-5 h-0.5 bg-slate-800 mx-1 mb-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones & Work Stages List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('Contract Milestones & Evidence', 'Ibyiciro by Akazi n Ibimenyetso')}
          </h2>
          <span className="text-xs text-emerald-400 font-semibold">
            {contract.stages.filter(s => s.status === 'completed').length} / {contract.stages.length} {t('Completed', 'Byarangiye')}
          </span>
        </div>

        {contract.stages.map((stage, index) => {
          const isPending = stage.status === 'pending';
          const isInProgress = stage.status === 'in_progress';
          const isInReview = stage.status === 'in_review';
          const isCompleted = stage.status === 'completed';
          const isOverdue = stage.status === 'overdue' || (stage.daysOverdue && stage.daysOverdue > 0);

          return (
            <div
              key={stage.id}
              className={`bg-slate-900 border rounded-2xl p-4 transition-all shadow-sm ${
                isOverdue 
                  ? 'border-rose-500/60 bg-rose-950/10' 
                  : isInReview
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Header: Stage Number, Status */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isCompleted 
                      ? 'bg-emerald-500 text-slate-950' 
                      : isInReview 
                      ? 'bg-amber-500 text-slate-950' 
                      : isOverdue
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {stage.order}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {stage.name}
                  </span>
                </div>
                <StatusBadge status={stage.status} size="sm" />
              </div>

              {/* Stage Description & Translation */}
              <p className="text-xs text-slate-300 mb-1 leading-relaxed">
                {stage.description}
              </p>
              <p className="text-[11px] text-slate-400 italic mb-3">
                {stage.nameRw}
              </p>

              {/* Overdue Alert banner if overdue */}
              {isOverdue && (
                <div className="mb-3 p-2.5 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-center justify-between text-xs text-rose-300">
                  <div className="flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>{stage.daysOverdue || 6} {t('days overdue!', 'iminsi yatinze!')}</strong> (Due {stage.targetDate})
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('remedies')}
                    className="text-[11px] font-bold text-rose-300 hover:text-white underline flex items-center space-x-0.5"
                  >
                    <span>{t('Calculate', 'Bara')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Milestone Details: Assigned party, Target Date, Value */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t('Responsible:', 'Ushinzwe:')}</span>
                  <span className="font-semibold text-slate-200 truncate block">{stage.assignedTo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t('Target Date:', 'Itariki:')}</span>
                  <span className="font-semibold text-white">{stage.targetDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t('Value (RWF):', 'Agaciro:')}</span>
                  <span className="font-bold text-emerald-400">RWF {stage.amountRwf.toLocaleString()}</span>
                </div>
              </div>

              {/* Uploaded Evidence Gallery */}
              {stage.evidenceList.length > 0 && (
                <div className="mb-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center space-x-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('Uploaded Work Proof:', 'Ibyemezo by Umurimo Byatanzwe:')}</span>
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    {stage.evidenceList.map((ev) => (
                      <div key={ev.id} className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 flex items-start space-x-3">
                        <img 
                          src={ev.fileUrl} 
                          alt={ev.title} 
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-700"
                        />
                        <div className="truncate text-xs">
                          <span className="font-bold text-white block truncate">{ev.title}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-2">{ev.description}</span>
                          <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-500">
                            <span>{ev.uploadedBy}</span>
                            <span>•</span>
                            <span>{ev.uploadedAt}</span>
                            {ev.verifiedByClient && (
                              <span className="text-emerald-400 font-semibold flex items-center space-x-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{t('Verified', 'Iremejwe')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage Progression Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                {/* Worker actions */}
                {isWorker && (
                  <>
                    {isPending && (
                      <button
                        onClick={() => updateMilestoneStatus(contract.id, stage.id, 'in_progress')}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t('Start Working on Stage', 'Tangira Iki Cyiciro')}</span>
                      </button>
                    )}

                    {(isInProgress || isOverdue) && (
                      <button
                        onClick={() => setSelectedStageForEvidence({ id: stage.id, title: stage.name })}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{t('Upload Evidence & Submit', 'Shyiraho Ifoto & Ohereza')}</span>
                      </button>
                    )}
                  </>
                )}

                {/* Client Review & Acceptance Actions (Proposal Sec 5.1 & 5.2) */}
                {isClient && isInReview && (
                  <>
                    <button
                      onClick={() => acceptDeliverable(contract.id, stage.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t('Accept Deliverable & Close', 'Emeza ko Byakozwe Neza')}</span>
                    </button>

                    <button
                      onClick={() => setSelectedStageForRework({ id: stage.id, title: stage.name })}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-900/40 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('Request Rework', 'Gukosora')}</span>
                    </button>
                  </>
                )}

                {/* General Add Evidence button */}
                <button
                  onClick={() => setSelectedStageForEvidence({ id: stage.id, title: stage.name })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('Add Photo/Note', 'Ongeraho')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedStageForEvidence && (
        <EvidenceUploadModal
          contractId={contract.id}
          stageId={selectedStageForEvidence.id}
          stageTitle={selectedStageForEvidence.title}
          onClose={() => setSelectedStageForEvidence(null)}
        />
      )}

      {selectedStageForRework && (
        <ReworkModal
          contractId={contract.id}
          stageId={selectedStageForRework.id}
          stageTitle={selectedStageForRework.title}
          onClose={() => setSelectedStageForRework(null)}
        />
      )}
    </div>
  );
};

