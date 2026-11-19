import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Image } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../theme';
import { NativeStatusBadge } from '../components/native/NativeStatusBadge';
import { 
  CheckCircle2, 
  Camera, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  ChevronDown, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText
} from 'lucide-react-native';
import { MilestoneStage } from '../types';

interface WorkProgressScreenProps {
  onOpenRemediesCalculator: () => void;
}

export const WorkProgressScreen: React.FC<WorkProgressScreenProps> = ({ onOpenRemediesCalculator }) => {
  const { 
    contracts, 
    activeContractId, 
    setActiveContractId, 
    activeContract, 
    t, 
    role, 
    updateMilestoneStatus, 
    acceptDeliverable,
    addEvidenceToMilestone,
    requestRework
  } = useApp();

  const [contractSelectModalVisible, setContractSelectModalVisible] = useState(false);
  const [evidenceModalStage, setEvidenceModalStage] = useState<MilestoneStage | null>(null);
  const [reworkModalStage, setReworkModalStage] = useState<MilestoneStage | null>(null);

  // Evidence Form State
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceType, setEvidenceType] = useState<'image' | 'receipt' | 'document'>('image');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Rework Form State
  const [reworkNote, setReworkNote] = useState('');

  const contract = activeContract || contracts[0];
  const isWorker = role === 'worker' || role === 'cooperative';
  const isClient = role === 'client';

  // Sample real-world Rwandan field photos for rich simulation
  const sampleEvidencePhotos = [
    {
      title: 'Waterproof Torch-on Sealing Seam Inspection',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
      tag: 'Roof Inspection'
    },
    {
      title: 'Terracotta Tiles Delivery Batch Inspection',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
      tag: 'Materials'
    },
    {
      title: 'Certified Clay Tiles Delivery Receipt & EBM',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      tag: 'EBM Receipt'
    },
    {
      title: 'Basement ATS Switch & Power Calibration Test',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      tag: 'Electrical'
    }
  ];

  const handleUploadEvidence = () => {
    if (!evidenceModalStage || !evidenceTitle.trim()) return;

    addEvidenceToMilestone(contract.id, evidenceModalStage.id, {
      title: evidenceTitle.trim(),
      description: evidenceDesc.trim() || 'Work completion verified and submitted for review.',
      fileType: evidenceType,
      fileUrl: sampleEvidencePhotos[selectedPhotoIndex].url,
    });

    setEvidenceModalStage(null);
    setEvidenceTitle('');
    setEvidenceDesc('');
  };

  const handleSendRework = () => {
    if (!reworkModalStage || !reworkNote.trim()) return;
    requestRework(contract.id, reworkModalStage.id, reworkNote.trim());
    setReworkModalStage(null);
    setReworkNote('');
  };

  // Configurable pipeline steps based on contract industry (Proposal §5.2)
  const getPipelineSteps = () => {
    if (contract.category === 'construction' || contract.category === 'maintenance') {
      return ['Planning', 'Procurement', 'Execution', 'Inspection', 'Handover'];
    } else if (contract.category === 'digital') {
      return ['Discovery', 'Design', 'Development', 'Testing', 'Deployment'];
    } else {
      return ['Scheduled', 'Preparation', 'In Transit', 'Inspected', 'Accepted'];
    }
  };

  const pipeline = getPipelineSteps();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Contract Selector Header */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorLabel}>
          {t('Tracking Work Progress (Proposal Sec 5.2):', 'Gukurikirana Umurimo:')}
        </Text>
        <TouchableOpacity
          style={styles.contractPickerBtn}
          onPress={() => setContractSelectModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.pickerIdText}>{contract.id}</Text>
            <Text style={styles.pickerTitleText} numberOfLines={1}>
              {contract.title}
            </Text>
          </View>
          <ChevronDown size={18} color={Colors.light.primary} />
        </TouchableOpacity>

        {/* Status Distinction Callout (Proposal §5.2 Rule) */}
        <View style={styles.statusDistinctionNote}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Text style={styles.statusNoteLabel}>{t('Contract Agreement Status:', 'Imiterere y Amasezerano:')}</Text>
            <NativeStatusBadge status={contract.status} size="sm" />
          </View>
          <Text style={styles.statusNoteText}>
            {t(
              'Rule 5.2: Contract status tracks legal standing; Work-stage status tracks physical deliverables.',
              'Itegeko: Imiterere y amasezerano itandukanye n aho imirimo igeze mu bikorwa.'
            )}
          </Text>
        </View>
      </View>

      {/* Configurable Visual Pipeline */}
      <View style={styles.pipelineCard}>
        <View style={styles.pipelineHeader}>
          <Text style={styles.pipelineTitle}>
            {t('Configurable Stage Pipeline', 'Uruhererekane rw Intambwe')}
          </Text>
          <View style={styles.industryTag}>
            <Text style={styles.industryTagText}>{contract.category.toUpperCase()}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pipelineScroll}>
          {pipeline.map((step, idx) => (
            <View key={idx} style={styles.pipelineStepItem}>
              <View
                style={[
                  styles.pipelineStepCircle,
                  idx < 3 && styles.pipelineStepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.pipelineStepNumber,
                    idx < 3 && { color: '#FFFFFF' },
                  ]}
                >
                  {idx + 1}
                </Text>
              </View>
              <Text style={styles.pipelineStepText}>{step}</Text>
              {idx < pipeline.length - 1 && <View style={styles.pipelineDivider} />}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Milestones & Evidence List */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{t('Contract Milestones & Deliverables', 'Ibyiciro by Umurimo')}</Text>
        <Text style={styles.sectionCountText}>
          {contract.stages.filter((s) => s.status === 'completed').length}/{contract.stages.length} {t('Completed', 'Byarangiye')}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        {contract.stages.map((stage) => {
          const isPending = stage.status === 'pending';
          const isInProgress = stage.status === 'in_progress';
          const isInReview = stage.status === 'in_review';
          const isCompleted = stage.status === 'completed';
          const isOverdue = stage.status === 'overdue' || (stage.daysOverdue && stage.daysOverdue > 0);

          return (
            <View
              key={stage.id}
              style={[
                styles.stageCard,
                isOverdue && styles.overdueStageCard,
                isInReview && styles.inReviewStageCard,
              ]}
            >
              {/* Header */}
              <View style={styles.stageHeaderRow}>
                <View style={styles.stageNumberBadge}>
                  <Text style={styles.stageNumberText}>{stage.order}</Text>
                </View>
                <Text style={styles.stageTitle} numberOfLines={1}>
                  {stage.name}
                </Text>
                <NativeStatusBadge status={stage.status} size="sm" />
              </View>

              <Text style={styles.stageDesc}>{stage.description}</Text>
              <Text style={styles.stageDescRw}>{stage.nameRw}</Text>

              {/* Overdue Warning Callout */}
              {isOverdue && (
                <View style={styles.overdueBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <AlertTriangle size={15} color={Colors.light.danger} style={{ marginRight: 6 }} />
                    <Text style={styles.overdueText}>
                      <strong>{stage.daysOverdue || 6} {t('days overdue', 'iminsi yatinze')}</strong> ({t('Due', 'Itariki')} {stage.targetDate})
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.overdueCalcBtn}
                    onPress={onOpenRemediesCalculator}
                  >
                    <Text style={styles.overdueCalcBtnText}>{t('Calculate', 'Bara')}</Text>
                    <ArrowRight size={12} color={Colors.light.danger} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Stage Details Grid */}
              <View style={styles.stageMetaGrid}>
                <View style={styles.stageMetaItem}>
                  <Text style={styles.metaLabel}>{t('Assigned To', 'Ushinzwe')}</Text>
                  <Text style={styles.metaVal} numberOfLines={1}>{stage.assignedTo}</Text>
                </View>
                <View style={styles.stageMetaItem}>
                  <Text style={styles.metaLabel}>{t('Target Date', 'Itariki')}</Text>
                  <Text style={styles.metaVal}>{stage.targetDate}</Text>
                </View>
                <View style={styles.stageMetaItem}>
                  <Text style={styles.metaLabel}>{t('Milestone Value', 'Agaciro')}</Text>
                  <Text style={[styles.metaVal, { color: Colors.light.primary, fontWeight: '800' }]}>
                    RWF {stage.amountRwf.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Evidence Gallery */}
              {stage.evidenceList.length > 0 && (
                <View style={styles.evidenceSection}>
                  <Text style={styles.evidenceSectionLabel}>
                    {t('Uploaded Work Proof & Attachments:', 'Ibimenyetso Byatanzwe:')}
                  </Text>

                  {stage.evidenceList.map((ev) => (
                    <View key={ev.id} style={styles.evidenceItemRow}>
                      <Image source={{ uri: ev.fileUrl }} style={styles.evidenceThumb} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.evidenceItemTitle} numberOfLines={1}>{ev.title}</Text>
                        <Text style={styles.evidenceItemDesc} numberOfLines={2}>{ev.description}</Text>
                        <View style={styles.evidenceFooterRow}>
                          <Text style={styles.evidenceMetaText}>{ev.uploadedBy} · {ev.uploadedAt}</Text>
                          {ev.verifiedByClient && (
                            <View style={styles.verifiedTag}>
                              <CheckCircle2 size={10} color={Colors.light.success} style={{ marginRight: 2 }} />
                              <Text style={styles.verifiedTagText}>{t('Verified', 'Iremejwe')}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.stageActionRow}>
                {isWorker && (
                  <>
                    {isPending && (
                      <TouchableOpacity
                        style={styles.startStageBtn}
                        onPress={() => updateMilestoneStatus(contract.id, stage.id, 'in_progress')}
                      >
                        <Clock size={14} color={Colors.light.primary} />
                        <Text style={styles.startStageBtnText}>{t('Start Working on Stage', 'Tangira Iki Cyiciro')}</Text>
                      </TouchableOpacity>
                    )}

                    {(isInProgress || isOverdue) && (
                      <TouchableOpacity
                        style={styles.submitEvidenceBtn}
                        onPress={() => {
                          setEvidenceModalStage(stage);
                          setEvidenceTitle(stage.name + ' - Completion Proof');
                        }}
                      >
                        <Camera size={14} color="#FFFFFF" />
                        <Text style={styles.submitEvidenceBtnText}>{t('Upload Evidence & Submit', 'Shyiraho Ifoto & Ohereza')}</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {isClient && isInReview && (
                  <>
                    <TouchableOpacity
                      style={styles.acceptStageBtn}
                      onPress={() => acceptDeliverable(contract.id, stage.id)}
                    >
                      <Check size={14} color="#FFFFFF" />
                      <Text style={styles.acceptStageBtnText}>{t('Accept Deliverable & Close', 'Emeza ko Byakozwe Neza')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reworkBtn}
                      onPress={() => setReworkModalStage(stage)}
                    >
                      <RotateCcw size={14} color={Colors.light.warning} />
                      <Text style={styles.reworkBtnText}>{t('Request Rework', 'Gukosora')}</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={styles.addNoteBtn}
                  onPress={() => {
                    setEvidenceModalStage(stage);
                    setEvidenceTitle(stage.name + ' - Photo Proof');
                  }}
                >
                  <Plus size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.addNoteBtnText}>{t('Add Proof', 'Ongeraho')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Contract Select Modal */}
      <Modal visible={contractSelectModalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContractSelectModalVisible(false)}
        >
          <View style={styles.selectModalContent}>
            <Text style={styles.selectModalTitle}>{t('Select Agreement to Track', 'Hitamo Amasezerano')}</Text>
            {contracts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.contractSelectOption,
                  c.id === contract.id && { backgroundColor: Colors.light.primaryLight, borderColor: Colors.light.primary },
                ]}
                onPress={() => {
                  setActiveContractId(c.id);
                  setContractSelectModalVisible(false);
                }}
              >
                <View>
                  <Text style={styles.selectOptionId}>{c.id}</Text>
                  <Text style={styles.selectOptionTitle} numberOfLines={1}>{c.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Upload Evidence Modal */}
      <Modal visible={evidenceModalStage !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.evidenceModalBox}>
            <View style={styles.evidenceModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Camera size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
                <Text style={styles.evidenceModalHeaderTitle}>{t('Upload Work Evidence', 'Gushyiraho Ikimenyetso')}</Text>
              </View>
              <TouchableOpacity onPress={() => setEvidenceModalStage(null)}>
                <X size={18} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.evidenceModalSubtext}>{evidenceModalStage?.name}</Text>

            {/* Select simulated photo */}
            <Text style={styles.inputLabel}>{t('Select On-Site Field Proof Photo:', 'Hitamo Ifoto y Akazi:')}</Text>
            <View style={styles.photoPickerGrid}>
              {sampleEvidencePhotos.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.photoChoice,
                    selectedPhotoIndex === idx && styles.photoChoiceActive,
                  ]}
                  onPress={() => {
                    setSelectedPhotoIndex(idx);
                    if (!evidenceTitle) setEvidenceTitle(p.title);
                  }}
                >
                  <Image source={{ uri: p.url }} style={styles.photoChoiceImg} />
                  <Text style={styles.photoChoiceTag} numberOfLines={1}>{p.tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>{t('Deliverable Title / Invoice Ref:', 'Umutwe w Ikimenyetso:')}</Text>
            <TextInput
              style={styles.modalInput}
              value={evidenceTitle}
              onChangeText={setEvidenceTitle}
              placeholder="e.g. Waterproof Torch-on Sealing Inspection"
              placeholderTextColor={Colors.light.textSecondary}
            />

            <Text style={styles.inputLabel}>{t('Notes & Verification Details:', 'Ibisobanuro:')}</Text>
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              multiline
              value={evidenceDesc}
              onChangeText={setEvidenceDesc}
              placeholder={t('Notes on standards, safety checks, or materials...', 'Andika ibisobanuro by ibyakozwe...')}
              placeholderTextColor={Colors.light.textSecondary}
            />

            <View style={styles.gpsBadge}>
              <MapPin size={12} color={Colors.light.primary} style={{ marginRight: 4 }} />
              <Text style={styles.gpsBadgeText}>Kigali (Verified GPS Timestamp Tag)</Text>
            </View>

            <TouchableOpacity
              style={styles.submitEvidenceActionBtn}
              onPress={handleUploadEvidence}
            >
              <Text style={styles.submitEvidenceActionBtnText}>
                {t('Submit Evidence for Acceptance', 'Ohereza Ikimenyetso ngo Cyemezwe')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Rework Request Modal */}
      <Modal visible={reworkModalStage !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.evidenceModalBox}>
            <View style={styles.evidenceModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RotateCcw size={18} color={Colors.light.warning} style={{ marginRight: 6 }} />
                <Text style={styles.evidenceModalHeaderTitle}>{t('Request Correction / Rework', 'Gusaba Gukosora')}</Text>
              </View>
              <TouchableOpacity onPress={() => setReworkModalStage(null)}>
                <X size={18} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.evidenceModalSubtext}>{reworkModalStage?.name}</Text>
            <Text style={styles.inputLabel}>{t('Specify What Needs Adjustment:', 'Ibisobanuro by ibigomba gukosorwa:')}</Text>
            <TextInput
              style={[styles.modalInput, { height: 70 }]}
              multiline
              value={reworkNote}
              onChangeText={setReworkNote}
              placeholder={t('e.g. Please reinforce the bitumen seam along the southern gutter...', 'Urugero: Nyamuneka ongera ushimangire umuti urinda amazi...')}
              placeholderTextColor={Colors.light.textSecondary}
            />

            <TouchableOpacity
              style={[styles.submitEvidenceActionBtn, { backgroundColor: Colors.light.warning }]}
              onPress={handleSendRework}
            >
              <Text style={styles.submitEvidenceActionBtnText}>
                {t('Send Correction Request', 'Ohereza Ubusabe bwo Gukosora')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  selectorCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contractPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
  pickerIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  pickerTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 1,
  },
  statusDistinctionNote: {
    backgroundColor: Colors.light.primaryLight,
    padding: 10,
    borderRadius: Radius.md,
  },
  statusNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  statusNoteText: {
    fontSize: 10,
    color: Colors.light.primary,
    lineHeight: 14,
  },
  pipelineCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pipelineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  industryTag: {
    backgroundColor: Colors.light.cardMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  industryTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  pipelineScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  pipelineStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipelineStepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pipelineStepCircleActive: {
    backgroundColor: Colors.light.primary,
  },
  pipelineStepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  pipelineStepText: {
    fontSize: 11,
    color: Colors.light.text,
    fontWeight: '600',
  },
  pipelineDivider: {
    width: 20,
    height: 2,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  stageCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  overdueStageCard: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFFBFB',
  },
  inReviewStageCard: {
    borderColor: '#F6E0B5',
    backgroundColor: '#FEFDFB',
  },
  stageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stageNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stageNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
    fontFamily: Typography.fontFamily.heading,
  },
  stageDesc: {
    fontSize: 12,
    color: Colors.light.text,
    lineHeight: 16,
    marginBottom: 2,
  },
  stageDescRw: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  overdueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    padding: 8,
    borderRadius: Radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  overdueText: {
    fontSize: 11,
    color: Colors.light.danger,
  },
  overdueCalcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  overdueCalcBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  stageMetaGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    gap: 10,
    marginBottom: 12,
  },
  stageMetaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    marginBottom: 1,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
  },
  evidenceSection: {
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  evidenceSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  evidenceItemRow: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 8,
    gap: 10,
    marginBottom: 6,
  },
  evidenceThumb: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: '#E5E5E5',
  },
  evidenceItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  evidenceItemDesc: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    lineHeight: 13,
    marginTop: 1,
  },
  evidenceFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  evidenceMetaText: {
    fontSize: 9,
    color: Colors.light.textSecondary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.success,
  },
  stageActionRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  startStageBtn: {
    flex: 1,
    backgroundColor: Colors.light.primaryLight,
    paddingVertical: 8,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  startStageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  submitEvidenceBtn: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  submitEvidenceBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  acceptStageBtn: {
    flex: 1,
    backgroundColor: Colors.light.success,
    paddingVertical: 8,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  acceptStageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reworkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: '#FEF9EE',
    borderWidth: 1,
    borderColor: '#F6E0B5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reworkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.warning,
  },
  addNoteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.cardMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addNoteBtnText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 61, 50, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectModalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 360,
  },
  selectModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 12,
  },
  contractSelectOption: {
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  selectOptionId: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  selectOptionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 2,
  },
  evidenceModalBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 380,
  },
  evidenceModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  evidenceModalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  evidenceModalSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  photoPickerGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  photoChoice: {
    flex: 1,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  photoChoiceActive: {
    borderColor: Colors.light.primary,
  },
  photoChoiceImg: {
    width: '100%',
    height: 50,
  },
  photoChoiceTag: {
    fontSize: 8,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 2,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 12,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryLight,
    padding: 8,
    borderRadius: Radius.sm,
    marginBottom: 14,
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  submitEvidenceActionBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  submitEvidenceActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

