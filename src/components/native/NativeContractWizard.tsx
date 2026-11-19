import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../../theme';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, FileText, ShieldCheck, Plus, Trash2 } from 'lucide-react-native';
import { ContractType, MilestoneStage } from '../../types';

interface NativeContractWizardProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newId: string) => void;
}

export const NativeContractWizard: React.FC<NativeContractWizardProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { t, createContract, role } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [type, setType] = useState<ContractType>('short_term');
  const [category, setCategory] = useState<'construction' | 'tailoring' | 'digital' | 'delivery' | 'maintenance'>('construction');
  const [title, setTitle] = useState('');
  const [titleRw, setTitleRw] = useState('');
  const [scope, setScope] = useState('');
  const [scopeRw, setScopeRw] = useState('');
  const [location, setLocation] = useState('Kigali (Gasabo District)');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [materialsProvidedBy, setMaterialsProvidedBy] = useState<'contractor' | 'client' | 'shared'>('contractor');
  const [totalAmountRwf, setTotalAmountRwf] = useState<number>(500000);

  // Parties
  const [contractorName, setContractorName] = useState(role === 'worker' ? 'Jean-Pierre Nsengimana' : 'Contractor Partner');
  const [contractorPhone, setContractorPhone] = useState('+250 788 345 678');
  const [clientName, setClientName] = useState(role === 'client' ? 'Diane Uwera' : 'Client Representative');
  const [clientPhone, setClientPhone] = useState('+250 788 654 321');

  // Stages
  const [stages, setStages] = useState<MilestoneStage[]>([
    {
      id: 'stg-new-1',
      name: 'Initial Setup & Materials Verification',
      nameRw: 'Gutangira n isuzumwa ry ibikoresho',
      description: 'Prepare tools, check material quality, safety brief.',
      order: 1,
      status: 'pending',
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      assignedTo: contractorName,
      amountRwf: 200000,
      evidenceRequired: true,
      evidenceList: [],
    },
    {
      id: 'stg-new-2',
      name: 'Core Execution & Implementation',
      nameRw: 'Gukora imirimo nyamukuru',
      description: 'Perform all specialized assembly/repair works.',
      order: 2,
      status: 'pending',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      assignedTo: contractorName,
      amountRwf: 200000,
      evidenceRequired: true,
      evidenceList: [],
    },
    {
      id: 'stg-new-3',
      name: 'Inspection, Testing & Handover',
      nameRw: 'Kugenzura no gushyikiriza nyirubwite',
      description: 'Client walk-through test and final acceptance sign-off.',
      order: 3,
      status: 'pending',
      targetDate: endDate,
      assignedTo: contractorName,
      amountRwf: 100000,
      evidenceRequired: true,
      evidenceList: [],
    },
  ]);

  // Delay Clause parameters
  const [gracePeriodDays, setGracePeriodDays] = useState(2);
  const [dailyPenaltyPercent, setDailyPenaltyPercent] = useState(1.0);
  const [maxPenaltyPercent, setMaxPenaltyPercent] = useState(5.0);

  const applyTemplate = (cat: typeof category) => {
    setCategory(cat);
    if (cat === 'construction') {
      setTitle('Masonry & Wall Plastering - Nyamirambo House');
      setTitleRw('Gusiga no Gusana Inkuta - Nyamirambo');
      setScope('Surface chipping, 3 coats mortar plastering, smooth cement float finish, and waste clearing.');
      setScopeRw('Gusukura inkuta no gusigaho sima isukuye hamwe no gukubura ibisigazwa.');
      setTotalAmountRwf(450000);
    } else if (cat === 'tailoring') {
      setTitle('Bespoke Event Attire (4 Outfits)');
      setTitleRw('Gudoda Imyenda 4 yo mu Birori');
      setScope('Custom fabric cutting, lining, fittings, and steam pressing for wedding entourage.');
      setScopeRw('Gupima, gukata igitambaro no kudoda imyenda 4 ifite amabara y ibirori.');
      setTotalAmountRwf(300000);
    } else if (cat === 'digital') {
      setTitle('Cooperative Inventory Mobile App Frontend');
      setTitleRw('Gukora Porogaramu ya Telefoni yo Gucunga Ububiko');
      setScope('React mobile UI with offline catalog, receipt printer connection, and daily sales report.');
      setScopeRw('Gukora imigaragarire ya porogaramu ya telefoni icunga ibicuruzwa by koperative.');
      setTotalAmountRwf(850000);
    } else {
      setTitle('Kigali-Huye Agri-Goods Transport & Unloading');
      setTitleRw('Gutwara n Ubwikorezi bw Imboga - Kigali na Huye');
      setScope('Refrigerated 3-tonne truck transit, loading in Kigali, scheduled delivery to Huye distribution center.');
      setScopeRw('Gupakira no gutwara ibiribwa muri kamyo ifite firigo.');
      setTotalAmountRwf(350000);
    }
  };

  const handleCreateSubmit = () => {
    const clauseText = `After a ${gracePeriodDays}-day grace period, a delay deduction of ${dailyPenaltyPercent}% of the affected milestone value per late day applies, capped at ${maxPenaltyPercent}% of that milestone. Indicative calculation subject to mutual human review.`;

    const newId = createContract({
      title: title || 'Work Agreement',
      titleRw: titleRw || 'Amasezerano y Umurimo',
      type,
      status: 'awaiting_confirmation',
      category,
      scope: scope || 'Defined scope of work and agreed technical specifications.',
      scopeRw: scopeRw || 'Ibisobanuro by umurimo n amategeko y akazi.',
      location,
      totalAmountRwf: Number(totalAmountRwf),
      materialsProvidedBy,
      startDate,
      endDate,
      parties: {
        contractor: {
          id: `usr-${Date.now()}-1`,
          name: contractorName,
          role: 'contractor',
          phone: contractorPhone,
          confirmed: role === 'worker',
          confirmedAt: role === 'worker' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
        },
        client: {
          id: `usr-${Date.now()}-2`,
          name: clientName,
          role: 'client',
          phone: clientPhone,
          confirmed: role === 'client',
          confirmedAt: role === 'client' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
        },
      },
      stages,
      delayClause: {
        hasDelayClause: true,
        gracePeriodDays,
        dailyPenaltyPercent,
        maxPenaltyPercent,
        clauseText,
        humanReviewRequired: true,
        disputePauseSupported: true,
      },
    });

    onSuccess(newId);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.topBarTitleGroup}>
            <Text style={styles.topBarTitle}>{t('Guided Agreement Builder', 'Gukora Amasezerano Mashya')}</Text>
            <Text style={styles.topBarSubtitle}>
              {t(`Step ${step} of 4: `, `Intambwe ya ${step} kuri 4: `)}
              {step === 1 && t('Template & Work Type', 'Ubwoko bw Umurimo')}
              {step === 2 && t('Scope & Parties', 'Abagiranye Amasezerano')}
              {step === 3 && t('Milestones & Price', 'Intambwe n Igiciro')}
              {step === 4 && t('Fair Delay Terms', 'Ibihano byo Gutinda')}
            </Text>
          </View>
          <View style={{ width: 32 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.stepProgressBarBg}>
          <View style={[styles.stepProgressBarFill, { width: `${(step / 4) * 100}%` }]} />
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* STEP 1: Type & Template */}
          {step === 1 && (
            <View style={{ gap: 14 }}>
              <Text style={styles.sectionHeading}>{t('Agreement Structure (Proposal Sec 4.2 / 4.3):', 'Uburyo bw Amasezerano:')}</Text>
              <View style={styles.typeCardsRow}>
                <TouchableOpacity
                  style={[styles.typeChoiceCard, type === 'short_term' && styles.typeChoiceCardActive]}
                  onPress={() => setType('short_term')}
                >
                  <Text style={[styles.typeChoiceTitle, type === 'short_term' && { color: Colors.light.primary }]}>
                    {t('Short-Term Job', 'Akazi k Igihe Gito')}
                  </Text>
                  <Text style={styles.typeChoiceDesc}>
                    {t('One defined project or repair with set deliverables.', 'Umurimo umwe ufite igihe cyo kurangira.')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeChoiceCard, type === 'work_order' && styles.typeChoiceCardActive]}
                  onPress={() => setType('work_order')}
                >
                  <Text style={[styles.typeChoiceTitle, type === 'work_order' && { color: Colors.light.primary }]}>
                    {t('Work Order', 'Urwandiko rw Akazi')}
                  </Text>
                  <Text style={styles.typeChoiceDesc}>
                    {t('Linked job under an active framework contract.', 'Akazi gashingiye ku masezerano rusange.')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionHeading}>{t('Pick Industry Template:', 'Hitamo Urugero rw Akazi:')}</Text>
              <View style={styles.templateGrid}>
                {[
                  { cat: 'construction' as const, label: 'Construction / Masonry', rw: 'Ubwubatsi / Gusana' },
                  { cat: 'tailoring' as const, label: 'Uniform / Tailoring', rw: 'Kudoda Imyenda' },
                  { cat: 'digital' as const, label: 'Digital / Tech Work', rw: 'Ikoranabuhanga' },
                  { cat: 'delivery' as const, label: 'Transport / Delivery', rw: 'Ubwikorezi' },
                ].map((tpl) => (
                  <TouchableOpacity
                    key={tpl.cat}
                    style={[styles.tplBtn, category === tpl.cat && styles.tplBtnActive]}
                    onPress={() => applyTemplate(tpl.cat)}
                  >
                    <Text style={[styles.tplBtnTitle, category === tpl.cat && { color: Colors.light.primary, fontWeight: '700' }]}>
                      {tpl.label}
                    </Text>
                    <Text style={styles.tplBtnRw}>{tpl.rw}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>{t('Agreement Title:', 'Umutwe w Amasezerano:')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Masonry & Wall Plastering - Nyamirambo"
                placeholderTextColor={Colors.light.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Mu Kinyarwanda: e.g. Gusiga no Gusana Inkuta"
                placeholderTextColor={Colors.light.textSecondary}
                value={titleRw}
                onChangeText={setTitleRw}
              />
            </View>
          )}

          {/* STEP 2: Scope & Minimal Parties */}
          {step === 2 && (
            <View style={{ gap: 14 }}>
              <Text style={styles.inputLabel}>{t('Clear Scope of Work (Plain Language):', 'Ibisobanuro by Umurimo:')}</Text>
              <TextInput
                style={[styles.textInput, { height: 75 }]}
                multiline
                placeholder="Specify deliverables, work specifications, and responsibilities..."
                placeholderTextColor={Colors.light.textSecondary}
                value={scope}
                onChangeText={setScope}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('Location:', 'Aho Bikorerwa:')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('Materials Supplier:', 'Ibikoresho:')}</Text>
                  <View style={styles.pickerFake}>
                    <Text style={{ fontSize: 12, color: Colors.light.text }}>{t('Worker / Contractor', 'Umwubatsi')}</Text>
                  </View>
                </View>
              </View>

              {/* Data Minimisation Notice under Law No. 058/2021 */}
              <View style={styles.privacyNoticeBox}>
                <ShieldCheck size={16} color={Colors.light.primary} style={{ marginRight: 6, marginTop: 1 }} />
                <Text style={styles.privacyNoticeText}>
                  {t(
                    'Rwanda Law No. 058/2021 Data Minimisation: Collect only essential contact details for this agreement. National ID is optional.',
                    'Itegeko No. 058/2021 rirengera amakuru bwite: Hakusanywa gusa amakuru akenewe kuri aya masezerano.'
                  )}
                </Text>
              </View>

              <Text style={styles.sectionHeading}>{t('Parties Contact Information:', 'Abagiranye Amasezerano:')}</Text>
              <View style={{ gap: 8 }}>
                <View style={styles.partyInputCard}>
                  <Text style={styles.partyInputRole}>{t('Worker / Contractor', 'Umukozi')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Full name"
                    value={contractorName}
                    onChangeText={setContractorName}
                  />
                  <TextInput
                    style={[styles.textInput, { marginTop: 6 }]}
                    placeholder="Phone number"
                    value={contractorPhone}
                    onChangeText={setContractorPhone}
                  />
                </View>

                <View style={styles.partyInputCard}>
                  <Text style={[styles.partyInputRole, { color: Colors.light.info }]}>{t('Client / Payer', 'Umukiriya')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Client name"
                    value={clientName}
                    onChangeText={setClientName}
                  />
                  <TextInput
                    style={[styles.textInput, { marginTop: 6 }]}
                    placeholder="Phone number"
                    value={clientPhone}
                    onChangeText={setClientPhone}
                  />
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: Milestones & Price */}
          {step === 3 && (
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('Total Price (RWF):', 'Amafaranga (RWF):')}</Text>
                  <TextInput
                    style={[styles.textInput, { fontWeight: '800', color: Colors.light.primary }]}
                    keyboardType="numeric"
                    value={String(totalAmountRwf)}
                    onChangeText={(val) => setTotalAmountRwf(Number(val) || 0)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('Target Deadline:', 'Itariki Ntarengwa:')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>

              <Text style={styles.sectionHeading}>{t('Milestones Breakdown (Sec 5.2):', 'Intambwe z Umurimo:')}</Text>
              <View style={{ gap: 8 }}>
                {stages.map((stg, idx) => (
                  <View key={stg.id} style={styles.stageInputCard}>
                    <Text style={styles.stageInputOrder}>{t('Stage', 'Icyiciro')} {idx + 1}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={stg.name}
                      onChangeText={(val) => {
                        const copy = [...stages];
                        copy[idx].name = val;
                        setStages(copy);
                      }}
                      placeholder="Stage Title"
                    />
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <TextInput
                        style={[styles.textInput, { flex: 1, fontWeight: '700', color: Colors.light.primary }]}
                        keyboardType="numeric"
                        value={String(stg.amountRwf)}
                        onChangeText={(val) => {
                          const copy = [...stages];
                          copy[idx].amountRwf = Number(val) || 0;
                          setStages(copy);
                        }}
                        placeholder="RWF Amount"
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        value={stg.targetDate}
                        onChangeText={(val) => {
                          const copy = [...stages];
                          copy[idx].targetDate = val;
                          setStages(copy);
                        }}
                        placeholder="Target Date"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STEP 4: Fair Delay Terms */}
          {step === 4 && (
            <View style={{ gap: 14 }}>
              <View style={styles.remedyBox}>
                <Text style={styles.remedyBoxTitle}>{t('Fair Delay Remedies Clause (Sec 6.1)', 'Ingingo yo Gutinda')}</Text>
                <Text style={styles.remedyBoxDesc}>
                  {t(
                    'Balanced parameters protecting both parties against unfair penalties or arbitrary deductions.',
                    'Amategeko aciriritse arinda impande zombi igihano kirenze urugero.'
                  )}
                </Text>

                <View style={styles.remedyInputsRow}>
                  <View style={styles.remedyInputItem}>
                    <Text style={styles.remedyInputLabel}>{t('Grace Days', 'Imbabazi')}</Text>
                    <TextInput
                      style={styles.remedyNumberInput}
                      keyboardType="numeric"
                      value={String(gracePeriodDays)}
                      onChangeText={(v) => setGracePeriodDays(Number(v) || 0)}
                    />
                  </View>
                  <View style={styles.remedyInputItem}>
                    <Text style={styles.remedyInputLabel}>{t('Daily %', 'Ku Munsi %')}</Text>
                    <TextInput
                      style={[styles.remedyNumberInput, { color: Colors.light.warning }]}
                      keyboardType="numeric"
                      value={String(dailyPenaltyPercent)}
                      onChangeText={(v) => setDailyPenaltyPercent(Number(v) || 0)}
                    />
                  </View>
                  <View style={styles.remedyInputItem}>
                    <Text style={styles.remedyInputLabel}>{t('Max Cap %', 'Ntarengwa %')}</Text>
                    <TextInput
                      style={[styles.remedyNumberInput, { color: Colors.light.danger }]}
                      keyboardType="numeric"
                      value={String(maxPenaltyPercent)}
                      onChangeText={(v) => setMaxPenaltyPercent(Number(v) || 0)}
                    />
                  </View>
                </View>

                <View style={styles.generatedClauseBox}>
                  <Text style={styles.generatedClauseText}>
                    "After a {gracePeriodDays}-day grace period, a delay deduction of {dailyPenaltyPercent}% of the affected milestone value per late day applies, capped at {maxPenaltyPercent}% of that milestone. Indicative calculation subject to mutual human review."
                  </Text>
                </View>
              </View>

              <View style={styles.finalReviewCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: Colors.light.primary }}>{title || 'Agreement'}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: Colors.light.primary }}>RWF {totalAmountRwf.toLocaleString()}</Text>
                </View>
                <Text style={{ fontSize: 11, color: Colors.light.textSecondary }}>
                  {stages.length} {t('stages planned across', 'ibyiciro biteganyijwe hagati ya')} {contractorName} & {clientName}.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation Buttons */}
        <View style={styles.wizardFooter}>
          {step > 1 ? (
            <TouchableOpacity style={styles.prevBtn} onPress={() => setStep(step - 1)}>
              <ArrowLeft size={16} color={Colors.light.text} />
              <Text style={styles.prevBtnText}>{t('Back', 'Inyuma')}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {step < 4 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(step + 1)}>
              <Text style={styles.nextBtnText}>{t('Next Step', 'Komeza')}</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.createBtn} onPress={handleCreateSubmit}>
              <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.createBtnText}>{t('Create & Request Signatures', 'Kora no Gusaba Imikono')}</Text>
            </TouchableOpacity>
          )}
        </View>
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
  stepProgressBarBg: {
    height: 4,
    backgroundColor: Colors.light.border,
  },
  stepProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  typeCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeChoiceCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  typeChoiceCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryLight,
  },
  typeChoiceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  typeChoiceDesc: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    lineHeight: 14,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tplBtn: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  tplBtnActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryLight,
  },
  tplBtnTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
  },
  tplBtnRw: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 12,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pickerFake: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
  },
  privacyNoticeBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primaryLight,
    padding: 10,
    borderRadius: Radius.md,
  },
  privacyNoticeText: {
    fontSize: 10,
    color: Colors.light.primary,
    lineHeight: 14,
    flex: 1,
  },
  partyInputCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  partyInputRole: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 6,
  },
  stageInputCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  stageInputOrder: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  remedyBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  remedyBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
    marginBottom: 2,
  },
  remedyBoxDesc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  remedyInputsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  remedyInputItem: {
    flex: 1,
    alignItems: 'center',
  },
  remedyInputLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  remedyNumberInput: {
    width: '100%',
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.sm,
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  generatedClauseBox: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    padding: 10,
  },
  generatedClauseText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.light.text,
    lineHeight: 15,
  },
  finalReviewCard: {
    backgroundColor: Colors.light.primaryLight,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#C8DFD0',
  },
  wizardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  prevBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  nextBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  createBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

