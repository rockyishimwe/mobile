import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../../theme';
import { Scale, ShieldCheck, X, Calculator, AlertTriangle, ArrowRight } from 'lucide-react-native';

interface RemediesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RemediesModal: React.FC<RemediesModalProps> = ({ visible, onClose }) => {
  const { contracts, activeContract, t } = useApp();
  const [selectedContractId, setSelectedContractId] = useState(activeContract?.id || contracts[0].id);

  const contract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  // Interactive Calculator State matching Proposal Sec 6.2
  const [milestoneValueRwf, setMilestoneValueRwf] = useState(200000);
  const [gracePeriodDays, setGracePeriodDays] = useState(contract.delayClause.gracePeriodDays);
  const [dailyRatePercent, setDailyRatePercent] = useState(contract.delayClause.dailyPenaltyPercent);
  const [maxCapPercent, setMaxCapPercent] = useState(contract.delayClause.maxPenaltyPercent);
  const [daysLate, setDaysLate] = useState(5);

  const chargeableDays = Math.max(0, daysLate - gracePeriodDays);
  const rawDeduction = chargeableDays * (dailyRatePercent / 100) * milestoneValueRwf;
  const maxCapAmount = (maxCapPercent / 100) * milestoneValueRwf;
  const appliedDeduction = Math.min(rawDeduction, maxCapAmount);
  const netPayable = Math.max(0, milestoneValueRwf - appliedDeduction);
  const isCapped = rawDeduction > maxCapAmount;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.topBarTitleGroup}>
            <Text style={styles.topBarTitle}>{t('Fair Delay Remedies & Calculator', 'Gucunga Ibiciro byo Gutinda')}</Text>
            <Text style={styles.topBarSubtitle}>{t('Proposal Sec 6: Non-punitive delay governance', 'Ingingo ya 6: Ibipimo byumvikanywe')}</Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Safeguard Notice */}
          <View style={styles.safeguardCard}>
            <ShieldCheck size={18} color={Colors.light.primary} style={{ marginRight: 8, marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.safeguardTitle}>
                {t('Mandatory Human Review Safeguard (Sec 6.1)', 'Ingamba z Umutekano (Sec 6.1)')}
              </Text>
              <Text style={styles.safeguardText}>
                {t(
                  'Never silently deduct money. Calculations are indicative based on unambiguous contract terms and are immediately frozen if a dispute is registered.',
                  'Sisitemu ntikatira amafaranga mu buryo bwikora cyangwa ngo yihimbire amande. Ibiciro bihagaze mu gihe hari impaka.'
                )}
              </Text>
            </View>
          </View>

          {/* Agreed Contract Clause */}
          <View style={styles.clauseCard}>
            <Text style={styles.clauseCardLabel}>{t('Agreed Contract Delay Clause:', 'Ingingo Yemeranyijwe:')}</Text>
            <Text style={styles.clauseQuote}>"{contract.delayClause.clauseText}"</Text>
            <View style={styles.clauseParamPills}>
              <View style={styles.clauseParamPill}>
                <Text style={styles.clauseParamPillText}>{contract.delayClause.gracePeriodDays} {t('days grace', 'iminsi y imbabazi')}</Text>
              </View>
              <View style={styles.clauseParamPill}>
                <Text style={styles.clauseParamPillText}>{contract.delayClause.dailyPenaltyPercent}% / {t('day', 'munsi')}</Text>
              </View>
              <View style={styles.clauseParamPill}>
                <Text style={styles.clauseParamPillText}>{t('Capped at', 'Ntarengwa')} {contract.delayClause.maxPenaltyPercent}%</Text>
              </View>
            </View>
          </View>

          {/* Interactive Calculator Box */}
          <View style={styles.calcCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Calculator size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
              <Text style={styles.calcTitle}>{t('Transparent Calculation Breakdown', 'Imibare y Icyitegererezo')}</Text>
            </View>

            {/* Milestone Value Input */}
            <Text style={styles.inputLabel}>{t('Milestone Value (RWF):', 'Agaciro k Icyiciro (RWF):')}</Text>
            <TextInput
              style={styles.numberInput}
              keyboardType="numeric"
              value={String(milestoneValueRwf)}
              onChangeText={(val) => setMilestoneValueRwf(Number(val) || 0)}
            />

            {/* Days Late Input */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 }}>
              <Text style={styles.inputLabel}>{t('Total Calendar Days Late:', 'Iminsi yose yatinze:')}</Text>
              <Text style={styles.daysLateNumber}>{daysLate} {t('Days Late', 'Iminsi')}</Text>
            </View>
            <View style={styles.daysLateButtonsRow}>
              {[1, 2, 3, 5, 7, 10].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dayChoiceBtn,
                    daysLate === d && styles.dayChoiceBtnActive,
                  ]}
                  onPress={() => setDaysLate(d)}
                >
                  <Text style={[styles.dayChoiceText, daysLate === d && { color: '#FFFFFF', fontWeight: '700' }]}>
                    {d}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Breakdown Result Box (Proposal Sec 6.2 Formula) */}
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{t('Chargeable Days (Days - Grace):', 'Iminsi Irihishwa:')}</Text>
                <Text style={styles.breakdownVal}>
                  {daysLate} - {gracePeriodDays} = <strong style={{ color: Colors.light.primary }}>{chargeableDays} days</strong>
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{t('Formula Calculation:', 'Imibare:')}</Text>
                <Text style={styles.formulaText}>
                  {chargeableDays} × {dailyRatePercent}% × {milestoneValueRwf.toLocaleString()}
                </Text>
              </View>

              <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 6 }]}>
                <Text style={styles.breakdownLabel}>{t('Indicative Delay Deduction:', 'Ayakatwa:')}</Text>
                <Text style={styles.deductionAmount}>
                  - RWF {appliedDeduction.toLocaleString()}
                  {isCapped && <Text style={{ fontSize: 10, color: Colors.light.warning }}> (Capped at {maxCapPercent}%)</Text>}
                </Text>
              </View>

              <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: 8 }]}>
                <Text style={styles.netPayoutLabel}>{t('Net Recommended Payout:', 'Amafaranga Yishyurwa:')}</Text>
                <Text style={styles.netPayoutVal}>RWF {netPayable.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Three Proposal Situations (Proposal Sec 6.1) */}
          <View style={styles.situationsCard}>
            <Text style={styles.situationsTitle}>{t('IZERE Delay Response Matrix (Sec 6.1)', 'Amategeko yo Gukemura Ibibazo')}</Text>

            <View style={styles.situationItem}>
              <Text style={styles.situationHeader}>1. {t('Deadline Approaching', 'Igihe Kigiye Kugera')}</Text>
              <Text style={styles.situationDesc}>{t('Configurable reminders (7 days & 24 hours). Shows outstanding milestones to responsible parties.', 'Ubutumwa bwo kuburira iminsi 7 n amasaha 24 mbere.')}</Text>
            </View>

            <View style={styles.situationItem}>
              <Text style={styles.situationHeader}>2. {t('Work Overdue (Cause Unknown)', 'Umurimo Watinze')}</Text>
              <Text style={styles.situationDesc}>{t('Never assume fault. Mark stage overdue and request an explanation or extension.', 'Ntukiteze amakosa ku muntu runaka. Saba ibisobanuro cyangwa kongera igihe.')}</Text>
            </View>

            <View style={styles.situationItem}>
              <Text style={styles.situationHeader}>3. {t('Dispute Raised', 'Impaka Zavutse')}</Text>
              <Text style={styles.situationDesc}>{t('Retain evidence, freeze automated deduction triggers, and pause payout changes until mutual resolution.', 'Bika ibimenyetso kandi uhagarike ibihano mu gihe hakiri impaka.')}</Text>
            </View>
          </View>
        </ScrollView>
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
  topBarTitleGroup: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  topBarSubtitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  safeguardCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primaryLight,
    padding: 12,
    borderRadius: Radius.md,
  },
  safeguardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  safeguardText: {
    fontSize: 11,
    color: Colors.light.primary,
    lineHeight: 15,
  },
  clauseCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  clauseCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  clauseQuote: {
    fontSize: 12,
    color: Colors.light.text,
    fontStyle: 'italic',
    lineHeight: 16,
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 10,
  },
  clauseParamPills: {
    flexDirection: 'row',
    gap: 6,
  },
  clauseParamPill: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  clauseParamPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  calcCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  calcTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
  daysLateNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.danger,
  },
  daysLateButtonsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  dayChoiceBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardMuted,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  dayChoiceBtnActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  dayChoiceText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
  },
  breakdownBox: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 12,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  breakdownVal: {
    fontSize: 11,
    color: Colors.light.text,
  },
  formulaText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.light.text,
  },
  deductionAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.danger,
  },
  netPayoutLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.text,
  },
  netPayoutVal: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  situationsCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  situationsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 10,
  },
  situationItem: {
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  situationHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  situationDesc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 15,
  },
});

