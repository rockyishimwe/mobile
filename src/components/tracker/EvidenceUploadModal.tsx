import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, Upload, CheckCircle2, FileText, Image as ImageIcon, MapPin } from 'lucide-react';

interface EvidenceUploadModalProps {
  contractId: string;
  stageId: string;
  stageTitle: string;
  onClose: () => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  contractId,
  stageId,
  stageTitle,
  onClose
}) => {
  const { t, addEvidenceToMilestone } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'image' | 'receipt' | 'document'>('image');
  const [simulatedLocation, setSimulatedLocation] = useState('Kigali (Verified GPS Tag)');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Sample preloaded Rwandan field photos for rich simulation
  const samplePhotos = [
    {
      title: 'Waterproof Torch-on Sealing Inspection',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
      tag: 'Roof Inspection'
    },
    {
      title: 'Terracotta Tiles On-Site Batch',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
      tag: 'Materials Delivery'
    },
    {
      title: 'Official Certified Materials Invoice & EBM Receipt',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      tag: 'EBM Receipt'
    },
    {
      title: 'Circuit Breaker & Electrical Panel Test',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      tag: 'Electrical Work'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvidenceToMilestone(contractId, stageId, {
      title: title.trim(),
      description: description.trim() || 'Work completion evidence uploaded for client verification.',
      fileType,
      fileUrl: samplePhotos[selectedPhotoIndex].url
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-white shadow-2xl animate-in slide-in-from-bottom-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('Upload Work Evidence', 'Gushyiraho Ikimenyetso cy Imirimo')}
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {stageTitle}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('Evidence Type:', 'Ubwoko bw Ikimenyetso:')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'image' as const, label: 'Work Photo', icon: ImageIcon },
                { type: 'receipt' as const, label: 'EBM Receipt', icon: FileText },
                { type: 'document' as const, label: 'Signoff Doc', icon: CheckCircle2 }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = fileType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFileType(item.type)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-semibold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[10px] block">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Camera Capture / Attachment Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t('Select or Snap Photo:', 'Hitamo cyangwa Fata Ifoto:')}
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {samplePhotos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    if (!title) setTitle(p.title);
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video ${
                    selectedPhotoIndex === idx
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Title & Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('Evidence Title / Deliverable Description:', 'Umutwe w Ikimenyetso:')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Waterproof Torch-on Sealing Inspection"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-emerald-500 mb-2"
              required
            />
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('Add notes, tests performed, or supplier reference...', 'Andika ibisobanuro by ibyakozwe...')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* GPS Verification Tag */}
          <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{simulatedLocation}</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{t('Submit Evidence for Acceptance', 'Ohereza Ikimenyetso ngo Cyemezwe')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

