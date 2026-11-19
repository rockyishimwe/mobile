import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../theme';
import { 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Smartphone, 
  X, 
  Building2, 
  ChevronDown,
  ArrowRight
} from 'lucide-react-native';
import { PaymentRecord } from '../types';

export const PaymentsScreen: React.FC = () => {
  const { contracts, activeContract, t, addPaymentRecord } = useApp();
  const [selectedContractId, setSelectedContractId] = useState(activeContract?.id || contracts[0].id);
  const [contractPickerOpen, setContractPickerOpen] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const contract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  // New Payment Form
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(contract.stages[0]?.id || '');
  const [amountRwf, setAmountRwf] = useState(contract.stages[0]?.amountRwf || 100000);
  const [provider, setProvider] = useState<PaymentRecord['provider']>('MTN Mobile Money');
  const [referenceCode, setReferenceCode] = useState('');
  const [noteText, setNoteText] = useState('');

  const totalPaid = contract.payments.reduce((acc, p) => acc + p.amountRwf, 0);
  const remaining = Math.max(0, contract.totalAmountRwf - totalPaid);
  const percentPaid = Math.round((totalPaid / contract.totalAmountRwf) * 100);

  const handleSavePayment = () => {
    if (!referenceCode.trim()) return;

    const matchedStage = contract.stages.find((s) => s.id === selectedMilestoneId);

    addPaymentRecord(contract.id, {
      milestoneId: selectedMilestoneId,
      milestoneTitle: matchedStage ? matchedStage.name : 'General Payment',
      amountRwf: Number(amountRwf),
      provider,
      providerReference: referenceCode.trim(),
      receiptNote: noteText.trim() || 'Payment verified via mobile money SMS confirmation',
    });

    setShowAddPaymentModal(false);
    setReferenceCode('');
    setNoteText('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* National Bank of Rwanda (BNR) Compliance Callout */}
      <View style={styles.complianceCard}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <ShieldAlert size={18} color={Colors.light.warning} style={{ marginRight: 8, marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.complianceTitle}>
              {t('National Bank of Rwanda (BNR) Regulatory Notice', 'Itegeko rya Banki Nkuru y u Rwanda (BNR)')}
            </Text>
            <Text style={styles.complianceText}>
              {t(
                'Law No. 61/2021: IZERE does not hold, pool, or custody user funds. Payments occur directly through licensed Mobile Money (MTN MoMo, Airtel) or commercial banks. IZERE tracks verifiable milestone completion and provider references.',
                'Itegeko No. 61/2021 rigenga uburyo bwo kwishyura: IZERE ntibika amafaranga y abaturage. Kwishyura bikorwa mu mirongo yemewe (MTN MoMo, Airtel, Banki).'
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Contract Selector */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorLabel}>{t('Payment Tracking for Agreement:', 'Amasezerano yo Kwishyura:')}</Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => setContractPickerOpen(true)}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.pickerId}>{contract.id}</Text>
            <Text style={styles.pickerTitle} numberOfLines={1}>{contract.title}</Text>
          </View>
          <ChevronDown size={18} color={Colors.light.primary} />
        </TouchableOpacity>

        {/* Progress Bar & Financial Figures */}
        <View style={styles.financialStatsBox}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>{t('Agreed Total Price', 'Amafaranga Yose')}</Text>
            <Text style={styles.financialTotal}>RWF {contract.totalAmountRwf.toLocaleString()}</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(100, percentPaid)}%` }]} />
          </View>

          <View style={styles.splitRow}>
            <View>
              <Text style={styles.splitLabel}>{t('Paid to Date', 'Ayishyuwe')}</Text>
              <Text style={styles.paidValue}>RWF {totalPaid.toLocaleString()} ({percentPaid}%)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.splitLabel}>{t('Remaining Balance', 'Asigaye')}</Text>
              <Text style={styles.remainingValue}>RWF {remaining.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Milestone Obligations Schedule */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('Milestone Payment Schedule', 'Gahunda yo Kwishyura Ibyiciro')}</Text>
          <TouchableOpacity
            style={styles.addPaymentHeaderBtn}
            onPress={() => setShowAddPaymentModal(true)}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.addPaymentHeaderBtnText}>{t('Record Payment', 'Andika MoMo')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 8 }}>
          {contract.stages.map((stage) => {
            const isStagePaid = contract.payments.some((p) => p.milestoneId === stage.id);
            return (
              <View key={stage.id} style={styles.milestonePaymentRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.milestoneStageName} numberOfLines={1}>
                    {stage.order}. {stage.name}
                  </Text>
                  <Text style={styles.milestoneStageDate}>{t('Target:', 'Itariki:')} {stage.targetDate}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.milestoneStageAmount}>
                    RWF {stage.amountRwf.toLocaleString()}
                  </Text>
                  {isStagePaid ? (
                    <View style={styles.paidBadge}>
                      <CheckCircle2 size={10} color={Colors.light.success} style={{ marginRight: 2 }} />
                      <Text style={styles.paidBadgeText}>{t('Paid', 'Byishyuwe')}</Text>
                    </View>
                  ) : (
                    <Text style={styles.unpaidText}>
                      {stage.status === 'completed' ? t('Due Now', 'Bitegerejwe') : t('Pending Work', 'Kugera ku ntego')}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Verified Provider Transactions List */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t('Verified Provider Transactions (Phase 1)', 'Inyandiko z Amafaranga')}</Text>

        {contract.payments.length === 0 ? (
          <View style={styles.emptyTransactions}>
            <Smartphone size={28} color={Colors.light.textSecondary} style={{ marginBottom: 6 }} />
            <Text style={styles.emptyTransText}>{t('No payment references recorded yet.', 'Nta nyandiko yo kwishyura irashyirwaho.')}</Text>
            <TouchableOpacity
              style={styles.emptyRecordBtn}
              onPress={() => setShowAddPaymentModal(true)}
            >
              <Text style={styles.emptyRecordBtnText}>+ {t('Record MoMo or Bank Reference', 'Andika Nimero ya MoMo')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10, marginTop: 10 }}>
            {contract.payments.map((p) => (
              <View key={p.id} style={styles.transactionCard}>
                <View style={styles.transTopRow}>
                  <Text style={styles.transAmount}>RWF {p.amountRwf.toLocaleString()}</Text>
                  <View style={styles.providerConfirmedTag}>
                    <Text style={styles.providerConfirmedText}>{t('Provider Confirmed', 'Byemejwe')}</Text>
                  </View>
                </View>
                <Text style={styles.transMilestone} numberOfLines={1}>{p.milestoneTitle}</Text>
                <View style={styles.transMetaRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Smartphone size={12} color={Colors.light.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.transProvider}>{p.provider}</Text>
                  </View>
                  <Text style={styles.transRefCode}>{p.providerReference}</Text>
                </View>
                {p.receiptNote && (
                  <Text style={styles.transNote}>"{p.receiptNote}"</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Select Contract Modal */}
      <Modal visible={contractPickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContractPickerOpen(false)}
        >
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle}>{t('Select Agreement', 'Hitamo Amasezerano')}</Text>
            {contracts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.pickerOption,
                  c.id === contract.id && { backgroundColor: Colors.light.primaryLight, borderColor: Colors.light.primary },
                ]}
                onPress={() => {
                  setSelectedContractId(c.id);
                  setContractPickerOpen(false);
                }}
              >
                <Text style={styles.pickerOptionId}>{c.id}</Text>
                <Text style={styles.pickerOptionTitle} numberOfLines={1}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Payment Reference Modal */}
      <Modal visible={showAddPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalBox}>
            <View style={styles.paymentModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Wallet size={18} color={Colors.light.primary} style={{ marginRight: 6 }} />
                <Text style={styles.paymentModalHeaderTitle}>{t('Record Mobile Money Ref', 'Andika Nimero ya MoMo')}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAddPaymentModal(false)}>
                <X size={18} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{t('Payment Channel / Provider:', 'Uburyo bwo Kwishyura:')}</Text>
            <View style={styles.providerPickerGrid}>
              {[
                { name: 'MTN Mobile Money' as const, label: 'MTN MoMo (*182#)' },
                { name: 'Airtel Money' as const, label: 'Airtel Money (*182#)' },
                { name: 'Bank of Kigali' as const, label: 'Bank of Kigali (BK)' },
              ].map((prov) => (
                <TouchableOpacity
                  key={prov.name}
                  style={[
                    styles.providerChoiceBtn,
                    provider === prov.name && styles.providerChoiceBtnActive,
                  ]}
                  onPress={() => setProvider(prov.name)}
                >
                  <Text
                    style={[
                      styles.providerChoiceText,
                      provider === prov.name && { color: Colors.light.primary, fontWeight: '700' },
                    ]}
                  >
                    {prov.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>{t('Amount Paid (RWF):', 'Amafaranga (RWF):')}</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={String(amountRwf)}
              onChangeText={(val) => setAmountRwf(Number(val) || 0)}
            />

            <Text style={styles.inputLabel}>{t('Transaction ID / SMS Reference Code:', 'Nimero y Ubutumwa (Reference):')}</Text>
            <TextInput
              style={[styles.modalInput, { fontFamily: 'monospace', fontWeight: '700' }]}
              placeholder="e.g. MP261114.1530.A90812"
              placeholderTextColor={Colors.light.textSecondary}
              value={referenceCode}
              onChangeText={setReferenceCode}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>{t('Receipt Notes (Optional):', 'Ibisobanuro:')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Confirmed by client via MoMo SMS callback"
              placeholderTextColor={Colors.light.textSecondary}
              value={noteText}
              onChangeText={setNoteText}
            />

            <TouchableOpacity style={styles.savePaymentBtn} onPress={handleSavePayment}>
              <Text style={styles.savePaymentBtnText}>{t('Save Traceable Payment Record', 'Bika Inyandiko y Kwishyura')}</Text>
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
    gap: 16,
  },
  complianceCard: {
    backgroundColor: '#FEF9EE',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F6E0B5',
  },
  complianceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.warning,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 4,
  },
  complianceText: {
    fontSize: 10,
    color: Colors.light.text,
    lineHeight: 14,
  },
  selectorCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },
  pickerId: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  pickerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  financialStatsBox: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 12,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  financialLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  financialTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.light.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: Radius.full,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitLabel: {
    fontSize: 9,
    color: Colors.light.textSecondary,
  },
  paidValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  remainingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  addPaymentHeaderBtn: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 4,
  },
  addPaymentHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  milestonePaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.cardMuted,
    padding: 10,
    borderRadius: Radius.md,
  },
  milestoneStageName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  milestoneStageDate: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  milestoneStageAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.text,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
  paidBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.success,
  },
  unpaidText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  emptyTransactions: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTransText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  emptyRecordBtn: {
    marginTop: 10,
  },
  emptyRecordBtnText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  transactionCard: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  transTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  providerConfirmedTag: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  providerConfirmedText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  transMilestone: {
    fontSize: 11,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  transMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 6,
  },
  transProvider: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  transRefCode: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.light.text,
  },
  transNote: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 61, 50, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pickerModalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 360,
  },
  pickerModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 12,
  },
  pickerOption: {
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  pickerOptionId: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  pickerOptionTitle: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '600',
  },
  paymentModalBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 380,
  },
  paymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  paymentModalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  providerPickerGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  providerChoiceBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardMuted,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  providerChoiceBtnActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  providerChoiceText: {
    fontSize: 9,
    color: Colors.light.textSecondary,
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
  savePaymentBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  savePaymentBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

