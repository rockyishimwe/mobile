import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Trash2 } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Button, Chip, Input, ScreenHeader } from '../ui';
import { useStore } from '../store';
import { ContractKind, IconKey, kindLabel, rwf, TODAY } from '../data';

const TEMPLATES: { label: string; icon: IconKey; stages: string[] }[] = [
  { label: 'Construction / Repair', icon: 'home', stages: ['Planning', 'Procurement', 'Execution', 'Inspection', 'Handover'] },
  { label: 'Digital / Tech', icon: 'briefcase', stages: ['Discovery', 'Design', 'Development', 'Testing', 'Deployment'] },
  { label: 'Transport / Delivery', icon: 'truck', stages: ['Scheduled', 'Preparation', 'In Transit', 'Inspected', 'Accepted'] },
  { label: 'Tailoring', icon: 'shirt', stages: ['Measurements', 'Fabric', 'Tailoring', 'Delivery'] },
];

const isoPlus = (days: number) => {
  const d = new Date(TODAY.getTime() + days * 86400000);
  return d.toISOString().slice(0, 10);
};

export const CreateContractScreen: React.FC = () => {
  const { pop, addContract, push, user } = useStore();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [tpl, setTpl] = useState(0);
  const [kind, setKind] = useState<ContractKind>('short_term');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [location, setLocation] = useState('');
  const [scope, setScope] = useState('');
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('14');
  const [grace, setGrace] = useState('2');
  const [stages, setStages] = useState<string[]>(TEMPLATES[0].stages);
  const [error, setError] = useState('');

  const total = Number(amount.replace(/\D/g, '')) || 0;
  const duration = Math.max(1, Number(days) || 14);

  const steps = ['Template', 'Details', 'Milestones', 'Review'];

  const validate = () => {
    if (step === 1) {
      if (title.trim().length < 3) return 'Add a short title.';
      if (client.trim().length < 2) return 'Add the client name.';
      if (clientPhone.replace(/\D/g, '').length < 9) return 'Add the client phone number.';
      if (!location.trim()) return 'Add where the work happens.';
      if (!total) return 'Add the agreed amount in RWF.';
    }
    if (step === 2 && stages.filter((s) => s.trim()).length < 1) return 'Add at least one milestone.';
    return '';
  };

  const next = () => {
    const e = validate();
    setError(e);
    if (e) return;
    if (step < 3) return setStep(step + 1);
    const clean = stages.filter((s) => s.trim());
    const per = Math.floor(total / clean.length);
    const id = addContract({
      title: title.trim(),
      kind,
      icon: TEMPLATES[tpl].icon,
      status: 'pending',
      client: client.trim(),
      contractor: 'You',
      location: location.trim(),
      startDate: isoPlus(0),
      dueDate: isoPlus(duration),
      totalRwf: total,
      paidRwf: 0,
      scope: scope.trim() || `${TEMPLATES[tpl].label} work as agreed between ${user.name} and ${client.trim()}.`,
      gracePeriodDays: Number(grace) || 0,
      dailyPenaltyPct: 1,
      maxPenaltyPct: 5,
      stages: clean.map((name, i) => ({
        id: 's' + (i + 1),
        name: name.trim(),
        status: 'pending',
        date: isoPlus(Math.round(((i + 1) / clean.length) * duration)),
        amountRwf: i === clean.length - 1 ? total - per * (clean.length - 1) : per,
      })),
      clauses: [
        { title: '1. Scope of work', body: scope.trim() || 'As described in the details above.' },
        { title: '2. Payment', body: 'Paid per milestone via Mobile Money or bank. IZERE records references only and never holds funds.' },
        { title: '3. Delays', body: `Grace period of ${grace} days, then 1% of the milestone value per day, capped at 5%. Human review required.` },
      ],
      files: [],
      activity: [{ text: 'Contract created and sent for confirmation', date: TODAY.toISOString() }],
    });
    pop();
    push({ name: 'contractDetails', id });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.ivory }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="New Contract" onBack={() => (step ? setStep(step - 1) : pop())} />
      <View style={styles.stepper}>
        {steps.map((s, i) => (
          <View key={s} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={[styles.bar, i <= step && { backgroundColor: C.primary }]} />
            <Text style={[styles.stepText, i === step && { color: C.primary, fontWeight: '800' }]}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: S.xxl }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ gap: S.md }}>
            <Text style={styles.h2}>What kind of work?</Text>
            {TEMPLATES.map((t, i) => (
              <Pressable
                key={t.label}
                onPress={() => {
                  setTpl(i);
                  setStages(t.stages);
                }}
                style={[styles.option, tpl === i && styles.optionOn]}
              >
                <Text style={styles.optionTitle}>{t.label}</Text>
                <Text style={styles.small}>{t.stages.join(' → ')}</Text>
              </Pressable>
            ))}
            <Text style={[styles.h2, { marginTop: S.md }]}>Agreement type</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: S.sm }}>
              {(['short_term', 'framework', 'work_order'] as ContractKind[]).map((k) => (
                <Chip key={k} label={kindLabel[k]} active={kind === k} onPress={() => setKind(k)} />
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Input label="Contract title" placeholder="e.g. Kitchen tiling – Kacyiru" value={title} onChangeText={setTitle} />
            <Input label="Client name" placeholder="e.g. Diane Uwera" value={client} onChangeText={setClient} />
            <Input label="Client phone" placeholder="+250 7XX XXX XXX" keyboardType="phone-pad" value={clientPhone} onChangeText={setClientPhone} />
            <Input label="Work location" placeholder="e.g. Kacyiru, Gasabo" value={location} onChangeText={setLocation} />
            <Input label="Agreed total (RWF)" placeholder="e.g. 850000" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <View style={{ flexDirection: 'row', gap: S.md }}>
              <View style={{ flex: 1 }}>
                <Input label="Duration (days)" keyboardType="numeric" value={days} onChangeText={setDays} />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="Grace period (days)" keyboardType="numeric" value={grace} onChangeText={setGrace} />
              </View>
            </View>
            <Input label="Scope (optional)" placeholder="What exactly will be delivered?" value={scope} onChangeText={setScope} multiline style={{ height: 80, textAlignVertical: 'top', paddingTop: 12 }} />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: S.sm }}>
            <Text style={styles.h2}>Milestones</Text>
            <Text style={styles.small}>The total is split evenly; you can adjust later with a new version.</Text>
            {stages.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm }}>
                <View style={{ flex: 1 }}>
                  <Input
                    value={s}
                    placeholder={`Milestone ${i + 1}`}
                    onChangeText={(v) => setStages(stages.map((x, j) => (j === i ? v : x)))}
                  />
                </View>
                <Pressable onPress={() => setStages(stages.filter((_, j) => j !== i))} style={{ marginBottom: S.md }} hitSlop={8}>
                  <Trash2 size={20} color={C.danger} />
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.add} onPress={() => setStages([...stages, ''])}>
              <Plus size={18} color={C.primary} />
              <Text style={{ color: C.primary, fontWeight: '700' }}>Add milestone</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View style={styles.review}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.small}>{kindLabel[kind]} · {TEMPLATES[tpl].label}</Text>
            {[
              ['Client', `${client} (${clientPhone})`],
              ['Location', location],
              ['Total', rwf(total)],
              ['Duration', `${duration} days`],
              ['Delay rule', `${grace}-day grace, 1%/day, max 5%`],
              ['Milestones', stages.filter((s) => s.trim()).join(', ')],
            ].map(([k, v]) => (
              <View key={k} style={styles.reviewRow}>
                <Text style={styles.small}>{k}</Text>
                <Text style={styles.reviewV}>{v}</Text>
              </View>
            ))}
            <Text style={[styles.small, { marginTop: S.md }]}>
              The client gets an SMS to confirm. The contract becomes active once both of you confirm.
            </Text>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + S.md }]}>
        <Button title={step < 3 ? 'Continue' : 'Send for Confirmation'} onPress={next} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', gap: S.sm, paddingHorizontal: S.lg },
  bar: { height: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: C.border },
  stepText: { fontSize: 11, color: C.textSecondary },
  h2: { fontSize: 16, fontWeight: '700', color: C.text },
  small: { fontSize: 12, color: C.textSecondary, lineHeight: 17 },
  option: { padding: S.lg, borderRadius: R.lg, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface, gap: 4 },
  optionOn: { borderColor: C.primary, backgroundColor: C.sage },
  optionTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  add: { flexDirection: 'row', gap: S.sm, alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: R.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.emerald },
  review: { backgroundColor: C.surface, borderRadius: R.lg, padding: S.lg, borderWidth: 1, borderColor: C.border, gap: 4 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', gap: S.lg, paddingVertical: S.sm, borderBottomWidth: 1, borderBottomColor: C.border },
  reviewV: { flex: 1, textAlign: 'right', fontSize: 13, fontWeight: '600', color: C.text },
  error: { color: C.danger, marginTop: S.md },
  footer: { paddingHorizontal: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.surface },
});
