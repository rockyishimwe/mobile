import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../../theme';
import { NativeStatusBadge } from './NativeStatusBadge';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Layers, 
  History, 
  Scale, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  ChevronRight,
  Lock,
  DollarSign,
  Share2
} from 'lucide-react-native';
import { Contract } from '../../types';

interface ContractDetailModalProps {
  contract: Contract | null;
  visible: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'contracts' | 'tracker' | 'payments' | 'assistant') => void;
  onOpenRemediesCalculator: () => void;
}

export const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  contract,
  visible,
  onClose,
  onNavigateToTab,
  onOpenRemediesCalculator,
}) => {
  const { t, role, confirmContract, raiseDispute, resolveDispute } = useApp();
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [otpCode, setOtpCode] = useState('8921');
  const [agreedTerms, setAgreedTerms] = useState(false);

  if (!contract) return null;

  const isContractor = role === 'worker' || role === 'cooperative';
  const partyRole = isContractor ? 'contractor' : 'client';
  const myParty = isContractor ? contract.parties.contractor : contract.parties.client;
  const isAwaitingSignatures = contract.status === 'awaiting_confirmation';

  const handleConfirmSignature = () => {
    if (!agreedTerms) return;
    confirmContract(contract.id, partyRole);
    setShowSignModal(false);
  };

  const handleRaiseDispute = () => {
    if (!disputeReason.trim()) return;
    raiseDispute(contract.id, disputeReason.trim());
    setShowDisputeInput(false);
    setDisputeReason('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <Text style={styles.topBarId}>{contract.id}</Text>
            <Text style={styles.topBarSubtitle}>{t('Contract Details', 'Amakuru y Amasezerano')}</Text>
          </View>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => setShowVersionModal(true)}
            activeOpacity={0.7}
          >
            <History size={14} color={Colors.light.primary} />
            <Text style={styles.historyBtnText}>{contract.currentVersion}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Contract Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {contract.type === 'short_term'
                    ? t('Short-Term Contract', 'Igihe Gito')
                    : contract.type === 'framework'
                    ? t('Framework Agreement', 'Amasezerano Rusange')
                    : t('Work Order (WO)', 'Urwandiko rw Akazi')}
                </Text>
              </View>
              <NativeStatusBadge status={contract.status} />
            </View>

            <Text style={styles.heroTitle}>{contract.title}</Text>
            <Text style={styles.heroTitleRw}>{contract.titleRw}</Text>

            {/* Framework Link Notice if Work Order */}
            {contract.type === 'work_order' && contract.frameworkAgreementId && (
              <View style={styles.frameworkAlert}>
                <Layers size={14} color={Colors.light.info} style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.frameworkAlertTitle}>
                    {t('Linked to Framework Agreement (Sec 4.3):', 'Yometse ku Masezerano Rusange:')}
                  </Text>
                  <Text style={styles.frameworkAlertText}>
                    {contract.frameworkTitle || contract.frameworkAgreementId}
                  </Text>
                </View>
              </View>
            )}

            {/* Quick Metrics Grid */}
            <View style={styles.heroMetricsGrid}>
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricLabel}>{t('Agreed Total Price', 'Igiciro Cyumvikanywe')}</Text>
                <Text style={styles.heroMetricValue}>
                  RWF {contract.totalAmountRwf.toLocaleString()}
                </Text>
              </View>
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricLabel}>{t('Target Deadline', 'Itariki Ntarengwa')}</Text>
                <Text style={styles.heroMetricValueDate}>{contract.endDate}</Text>
              </View>
              <View style={[styles.heroMetricItem, { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 8 }]}>
                <Text style={styles.heroMetricLabel}>{t('Materials Supplied By', 'Ibikoresho Bitangwa')}</Text>
                <Text style={styles.heroMetricSubvalue}>
                  {contract.materialsProvidedBy === 'contractor'
                    ? t('Worker / Contractor', 'Umwubatsi')
                    : contract.materialsProvidedBy === 'client'
                    ? t('Client / Payer', 'Umukiriya')
                    : t('Shared', 'Bifatanije')}
                </Text>
              </View>
              <View style={[styles.heroMetricItem, { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 8 }]}>
                <Text style={styles.heroMetricLabel}>{t('Location', 'Aho Bikorerwa')}</Text>
                <Text style={styles.heroMetricSubvalue} numberOfLines={1}>
                  {contract.location}
                </Text>
              </View>
            </View>

            {/* Sign & Confirm Banner if Awaiting Confirmation */}
            {isAwaitingSignatures && (
              <View style={styles.signBanner}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <ShieldCheck size={16} color={Colors.light.warning} style={{ marginRight: 6 }} />
                  <Text style={styles.signBannerTitle}>
                    {t('Action Required: Digital Signature', 'Hakenewe Kwemezwa')}
                  </Text>
                </View>
                <Text style={styles.signBannerText}>
                  {t(
                    'Both parties must confirm version ' + contract.currentVersion + ' before work stages commence.',
                    'Impande zombi zigomba kwemeza iyi verisiyo mbere y uko umurimo utangira.'
                  )}
                </Text>
                <TouchableOpacity
                  style={styles.signActionBtn}
                  onPress={() => setShowSignModal(true)}
                  activeOpacity={0.8}
                >
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.signActionBtnText}>
                    {t('Sign & Confirm as ' + (isContractor ? 'Contractor' : 'Client'), 'Sinya no Kwemeza')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Action Navigation Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                onClose();
                onNavigateToTab('tracker');
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.quickNavTitle}>{t('Track Stages', 'Intambwe')}</Text>
                <Text style={styles.quickNavSubtext}>{contract.stages.length} {t('milestones', 'ibyiciro')}</Text>
              </View>
              <ChevronRight size={16} color={Colors.light.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                onClose();
                onNavigateToTab('payments');
              }}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.quickNavTitle}>{t('MoMo Records', 'Kwishyura')}</Text>
                <Text style={styles.quickNavSubtext}>{contract.payments.length} {t('logged', 'byishyuwe')}</Text>
              </View>
              <ChevronRight size={16} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          {/* Parties & Digital Signatures */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              {t('Contract Parties & Sign-Off (Sec 4.1)', 'Abagiranye Amasezerano')}
            </Text>

            {/* Contractor */}
            <View style={styles.partyBox}>
              <View style={styles.partyAvatarCircle}>
                <Text style={styles.partyAvatarText}>W</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.partyBoxName}>{contract.parties.contractor.name}</Text>
                <Text style={styles.partyBoxSubtitle}>
                  {contract.parties.contractor.organization || contract.parties.contractor.phone}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {contract.parties.contractor.confirmed ? (
                  <View style={styles.confirmedPill}>
                    <CheckCircle2 size={12} color={Colors.light.success} style={{ marginRight: 3 }} />
                    <Text style={styles.confirmedText}>{t('Confirmed', 'Yabyemeje')}</Text>
                  </View>
                ) : (
                  <Text style={styles.pendingText}>{t('Pending', 'Ategerejwe')}</Text>
                )}
                {contract.parties.contractor.confirmedAt && (
                  <Text style={styles.confirmedAtDate}>{contract.parties.contractor.confirmedAt}</Text>
                )}
              </View>
            </View>

            {/* Client */}
            <View style={[styles.partyBox, { marginTop: 8 }]}>
              <View style={[styles.partyAvatarCircle, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Text style={[styles.partyAvatarText, { color: Colors.light.info }]}>C</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.partyBoxName}>{contract.parties.client.name}</Text>
                <Text style={styles.partyBoxSubtitle}>
                  {contract.parties.client.organization || contract.parties.client.phone}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {contract.parties.client.confirmed ? (
                  <View style={styles.confirmedPill}>
                    <CheckCircle2 size={12} color={Colors.light.success} style={{ marginRight: 3 }} />
                    <Text style={styles.confirmedText}>{t('Confirmed', 'Yabyemeje')}</Text>
                  </View>
                ) : (
                  <Text style={styles.pendingText}>{t('Pending', 'Ategerejwe')}</Text>
                )}
                {contract.parties.client.confirmedAt && (
                  <Text style={styles.confirmedAtDate}>{contract.parties.client.confirmedAt}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Scope of Work */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              {t('Scope of Work & Deliverables', 'Ibisobanuro by Umurimo')}
            </Text>
            <Text style={styles.scopeBodyText}>{contract.scope}</Text>
            <Text style={styles.scopeBodyTextRw}>
              <strong>Kinyarwanda:</strong> {contract.scopeRw}
            </Text>
          </View>

          {/* Delay Remedies Clause (Proposal Sec 6.1 & 6.2) */}
          <View style={styles.sectionCard}>
            <View style={styles.remedyHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Scale size={16} color={Colors.light.primary} style={{ marginRight: 6 }} />
                <Text style={styles.cardHeaderTitle}>{t('Fair Delay Clause (Sec 6.1)', 'Ingingo yo Gutinda')}</Text>
              </View>
              <TouchableOpacity onPress={onOpenRemediesCalculator}>
                <Text style={styles.openCalculatorLink}>{t('Open Calculator', 'Fungura Imibare')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.clauseQuoteText}>"{contract.delayClause.clauseText}"</Text>

            <View style={styles.remedyParamsRow}>
              <View style={styles.remedyParamBox}>
                <Text style={styles.paramLabel}>{t('Grace Period', 'Imbabazi')}</Text>
                <Text style={styles.paramValue}>{contract.delayClause.gracePeriodDays} {t('Days', 'Iminsi')}</Text>
              </View>
              <View style={styles.remedyParamBox}>
                <Text style={styles.paramLabel}>{t('Daily Deduction', 'Ku Munsi')}</Text>
                <Text style={[styles.paramValue, { color: Colors.light.warning }]}>
                  {contract.delayClause.dailyPenaltyPercent}%
                </Text>
              </View>
              <View style={styles.remedyParamBox}>
                <Text style={styles.paramLabel}>{t('Maximum Cap', 'Ntarengwa')}</Text>
                <Text style={[styles.paramValue, { color: Colors.light.danger }]}>
                  {contract.delayClause.maxPenaltyPercent}%
                </Text>
              </View>
            </View>

            <View style={styles.safeguardNote}>
              <ShieldCheck size={14} color={Colors.light.primary} style={{ marginRight: 5, marginTop: 1 }} />
              <Text style={styles.safeguardNoteText}>
                {t(
                  'Human review required before action. Automated deductions are strictly indicative and frozen during disputes.',
                  'Gukata amafaranga bisaba isuzuma ry abantu. Sisitemu ntikatira amafaranga mu buryo bwikora.'
                )}
              </Text>
            </View>
          </View>

          {/* Dispute Handling */}
          <View style={styles.sectionCard}>
            <Text style={styles.cardHeaderTitle}>
              {t('Dispute Management (Sec 6.1)', 'Gukemura Impaka')}
            </Text>

            {contract.isDisputed ? (
              <View style={styles.activeDisputeBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <AlertTriangle size={16} color={Colors.light.danger} style={{ marginRight: 6 }} />
                  <Text style={styles.activeDisputeTitle}>{t('Active Dispute Logged', 'Ikirego Kirakomeje')}</Text>
                </View>
                <Text style={styles.activeDisputeReason}>{contract.disputeReason}</Text>
                <Text style={styles.activeDisputeMeta}>
                  {t('Logged on:', 'Cyatanzwe ku ya:')} {contract.disputeDate} · {t('Automated penalties paused.', 'Ibihano byahagaritswe.')}
                </Text>
                <TouchableOpacity
                  style={styles.resolveDisputeBtn}
                  onPress={() => resolveDispute(contract.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resolveDisputeBtnText}>
                    {t('Mark Dispute Resolved Amicably', 'Emeza ko Ikibazo Cyakemutse')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.disputeHelpText}>
                  {t(
                    'If unforeseen issues or material defects arise, either party can raise a dispute to pause delay penalties pending joint inspection.',
                    'Niba habayeho ikibazo cy ibikoresho cyangwa imiterere y akazi, ushobora kumenyekanisha ikirego ngo ibihano bihagarikwe.'
                  )}
                </Text>
                {showDisputeInput ? (
                  <View style={{ marginTop: 8 }}>
                    <TextInput
                      style={styles.disputeInput}
                      placeholder={t('Explain the disagreement or defect...', 'Sobanura ikibazo witegereje...')}
                      placeholderTextColor={Colors.light.textSecondary}
                      multiline
                      numberOfLines={3}
                      value={disputeReason}
                      onChangeText={setDisputeReason}
                    />
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <TouchableOpacity
                        style={[styles.disputeSubmitBtn, { backgroundColor: Colors.light.danger }]}
                        onPress={handleRaiseDispute}
                      >
                        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                          {t('Pause Penalties & Log Dispute', 'Hagarika Ibihano & Tanga Ikirego')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.disputeSubmitBtn, { backgroundColor: Colors.light.cardMuted }]}
                        onPress={() => setShowDisputeInput(false)}
                      >
                        <Text style={{ color: Colors.light.text, fontWeight: '600', fontSize: 12 }}>
                          {t('Cancel', 'Hagarika')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.raiseDisputeBtn}
                    onPress={() => setShowDisputeInput(true)}
                    activeOpacity={0.8}
                  >
                    <AlertTriangle size={14} color={Colors.light.danger} style={{ marginRight: 6 }} />
                    <Text style={styles.raiseDisputeBtnText}>
                      {t('Raise Formal Work Dispute', 'Tanga Ikirego cy Umurimo')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Digital Signature Modal */}
        <Modal visible={showSignModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.signModalContent}>
              <View style={styles.signModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ShieldCheck size={20} color={Colors.light.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.signModalTitle}>
                    {t('Digital Sign-Off (Sec 5.1)', 'Gusinya no Kwemeza')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowSignModal(false)}>
                  <X size={18} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.signModalDescription}>
                {t(
                  'You are digitally confirming version ' + contract.currentVersion + ' for RWF ' + contract.totalAmountRwf.toLocaleString() + '.',
                  'Ugiye kwemeza amasezerano ya verisiyo ' + contract.currentVersion + ' y agaciro ka RWF ' + contract.totalAmountRwf.toLocaleString() + '.'
                )}
              </Text>

              {/* OTP Simulation Input */}
              <View style={styles.otpBox}>
                <Text style={styles.otpLabel}>{t('SMS Verification Code (Demo: 8921)', 'Umubare w Isuzuma wa SMS:')}</Text>
                <TextInput
                  style={styles.otpInput}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedTerms(!agreedTerms)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreedTerms && styles.checkboxActive]}>
                  {agreedTerms && <CheckCircle2 size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  {t('I agree to the scope, milestones, and delay terms in version ' + contract.currentVersion, 'Nemeye ibisobanuro, intambwe z imirimo, n ibihe ntarengwa.')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmSignBtn,
                  !agreedTerms && { opacity: 0.5 },
                ]}
                disabled={!agreedTerms}
                onPress={handleConfirmSignature}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmSignBtnText}>
                  {t('Confirm Signature', 'Emeza Umukono wawe')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Version History Modal */}
        <Modal visible={showVersionModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.versionModalContent}>
              <View style={styles.versionModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <History size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.versionModalTitle}>{t('Version Audit History', 'Amateka y Impinduka')}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowVersionModal(false)}>
                  <X size={18} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }}>
                {contract.versionHistory.map((ver, idx) => (
                  <View key={idx} style={styles.versionHistoryCard}>
                    <View style={styles.verHeader}>
                      <View style={styles.verBadge}>
                        <Text style={styles.verBadgeText}>{ver.version}</Text>
                      </View>
                      <Text style={styles.verDate}>{ver.changedAt}</Text>
                    </View>
                    <Text style={styles.verSummary}>{ver.summary}</Text>
                    <Text style={styles.verAuthor}>{t('Changed by:', 'Byahinduwe na:')} {ver.changedBy}</Text>
                    {ver.changes.map((ch, cIdx) => (
                      <View key={cIdx} style={styles.verDiffBox}>
                        <Text style={styles.diffField}>{ch.field}</Text>
                        <Text style={styles.diffOld}>- {ch.oldValue}</Text>
                        <Text style={styles.diffNew}>+ {ch.newValue}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeBtn: {
    padding: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardMuted,
  },
  topBarCenter: {
    alignItems: 'center',
  },
  topBarId: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  topBarSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.md,
    gap: 4,
  },
  historyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
    lineHeight: 22,
  },
  heroTitleRw: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 12,
  },
  frameworkAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  frameworkAlertTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.info,
  },
  frameworkAlertText: {
    fontSize: 11,
    color: Colors.light.text,
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 12,
    gap: 10,
  },
  heroMetricItem: {
    width: '47%',
  },
  heroMetricLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  heroMetricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  heroMetricValueDate: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  heroMetricSubvalue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  signBanner: {
    backgroundColor: '#FEF9EE',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F6E0B5',
    marginTop: 14,
  },
  signBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.warning,
    fontFamily: Typography.fontFamily.heading,
  },
  signBannerText: {
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 15,
    marginBottom: 10,
  },
  signActionBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickNavBtn: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  quickNavTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  quickNavSubtext: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 10,
  },
  partyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    gap: 10,
  },
  partyAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  partyBoxName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  partyBoxSubtitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  confirmedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  confirmedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.success,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.warning,
  },
  confirmedAtDate: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  scopeBodyText: {
    fontSize: 12,
    color: Colors.light.text,
    lineHeight: 18,
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 6,
  },
  scopeBodyTextRw: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  remedyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  openCalculatorLink: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  clauseQuoteText: {
    fontSize: 12,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 17,
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 10,
  },
  remedyParamsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  remedyParamBox: {
    flex: 1,
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.sm,
    padding: 8,
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  paramValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  safeguardNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primaryLight,
    padding: 8,
    borderRadius: Radius.sm,
  },
  safeguardNoteText: {
    fontSize: 10,
    color: Colors.light.primary,
    lineHeight: 14,
    flex: 1,
  },
  activeDisputeBox: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  activeDisputeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.danger,
    fontFamily: Typography.fontFamily.heading,
  },
  activeDisputeReason: {
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 15,
    marginBottom: 6,
  },
  activeDisputeMeta: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  resolveDisputeBtn: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  resolveDisputeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
  },
  disputeHelpText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  raiseDisputeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  raiseDisputeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  disputeInput: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 12,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  disputeSubmitBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 61, 50, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signModalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  signModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  signModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  signModalDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  otpBox: {
    marginBottom: 12,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  otpInput: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
    color: Colors.light.primary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkboxText: {
    fontSize: 11,
    color: Colors.light.text,
    flex: 1,
    lineHeight: 15,
  },
  confirmSignBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  confirmSignBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  versionModalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 380,
  },
  versionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  versionModalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  versionHistoryCard: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  verHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verBadge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  verBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  verDate: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  verSummary: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  verAuthor: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 6,
  },
  verDiffBox: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  diffField: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.text,
  },
  diffOld: {
    fontSize: 10,
    color: Colors.light.danger,
    textDecorationLine: 'line-through',
  },
  diffNew: {
    fontSize: 10,
    color: Colors.light.success,
  },
});

