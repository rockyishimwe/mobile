import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Bot, ChevronLeft, Send, Sparkles } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { ContractIcon } from '../ui';
import { useStore } from '../store';
import { Contract, daysUntil, fmtDate, progressOf, rwf, statusMeta } from '../data';

interface Msg {
  from: 'user' | 'ai';
  text: string;
  refs?: string[];
}

const SUGGESTIONS = [
  'Which jobs are overdue this week?',
  'Show contracts that expired with unfinished work.',
  'Which framework agreements expire next month?',
  'Summarise the changes to this contract.',
  'How do I request an extension?',
  'How much am I still owed?',
];

/** Grounded, read-only answers built only from the user's own contract records. */
const answer = (q: string, contracts: Contract[]): Msg => {
  const t = q.toLowerCase();
  const open = contracts.filter((c) => c.status !== 'completed');

  if (t.includes('overdue') || t.includes('late')) {
    const late = open.filter((c) => c.stages.some((s) => s.status !== 'completed' && daysUntil(s.date) < 0));
    if (!late.length) return { from: 'ai', text: 'None of your open contracts have overdue stages right now.' };
    return {
      from: 'ai',
      text: `${late.length} contract(s) have a stage past its target date:`,
      refs: late.map((c) => c.id),
    };
  }
  if (t.includes('expired')) {
    const exp = open.filter((c) => daysUntil(c.dueDate) < 0);
    return exp.length
      ? { from: 'ai', text: 'These contracts passed their end date with unfinished work:', refs: exp.map((c) => c.id) }
      : { from: 'ai', text: 'No contract has expired with unfinished work. Your nearest end date is shown below.', refs: [open.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]?.id].filter(Boolean) as string[] };
  }
  if (t.includes('framework')) {
    const fw = contracts.filter((c) => c.kind === 'framework');
    return fw.length
      ? { from: 'ai', text: `You have ${fw.length} framework agreement(s). End dates:`, refs: fw.map((c) => c.id) }
      : { from: 'ai', text: 'You have no framework agreements.' };
  }
  if (t.includes('change') || t.includes('summar')) {
    return {
      from: 'ai',
      text: 'CTR-001 moved from v1.0 to v1.1: the due date changed from Nov 18 to Nov 20, 2026, and the "Testing & Review" stage was added. Both parties confirmed v1.1 on Nov 01.',
      refs: ['CTR-001'],
    };
  }
  if (t.includes('extension')) {
    return {
      from: 'ai',
      text: 'Open the contract → ⋮ menu → "View full contract", then agree a new date with the other party. Any date change is saved as a new version and needs both of you to confirm. I cannot change dates for you.',
    };
  }
  if (t.includes('owed') || t.includes('balance') || t.includes('paid') || t.includes('payment')) {
    const owed = open.reduce((sum, c) => sum + (c.totalRwf - c.paidRwf), 0);
    return {
      from: 'ai',
      text: `Across your open contracts, ${rwf(owed)} is still unpaid. IZERE only tracks references — payments go through MoMo, Airtel or your bank.`,
      refs: open.filter((c) => c.totalRwf > c.paidRwf).map((c) => c.id),
    };
  }
  const words = t.split(/\W+/).filter((w) => w.length > 3);
  const hits = contracts.filter((c) =>
    words.some((w) => [c.title, c.client, c.scope, c.location].join(' ').toLowerCase().includes(w)),
  );
  if (hits.length) return { from: 'ai', text: 'Here are the related contracts:', refs: hits.map((c) => c.id) };
  return {
    from: 'ai',
    text: "I can only answer from your own contract records, and I couldn't find a match. Try one of the suggestions below.",
  };
};

export const AssistantScreen: React.FC = () => {
  const { pop, contracts, getContract, push } = useStore();
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'ai', text: 'Muraho! I answer questions about your contracts. I read your records only — I never change them.' },
  ]);
  const [input, setInput] = useState('');
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: 'user', text: q }, answer(q, contracts)]);
    setInput('');
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.ivory }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.header, { paddingTop: insets.top + S.sm }]}>
        <Pressable onPress={pop} hitSlop={10}>
          <ChevronLeft size={24} color={C.text} />
        </Pressable>
        <Sparkles size={20} color="#6D4BC2" />
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>

      <ScrollView ref={scroll} contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {msgs.map((m, i) =>
          m.from === 'user' ? (
            <View key={i} style={styles.userBubble}>
              <Text style={styles.userText}>{m.text}</Text>
            </View>
          ) : (
            <View key={i} style={{ flexDirection: 'row', gap: S.sm, alignItems: 'flex-start' }}>
              <View style={styles.bot}>
                <Bot size={20} color="#fff" />
              </View>
              <View style={styles.aiBubble}>
                <Text style={styles.aiText}>{m.text}</Text>
                {m.refs?.map((id) => {
                  const c = getContract(id);
                  if (!c) return null;
                  return (
                    <View key={id} style={styles.ref}>
                      <View style={{ flexDirection: 'row', gap: S.md, alignItems: 'center' }}>
                        <ContractIcon icon={c.icon} size={38} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.refTitle}>{c.title}</Text>
                          <Text style={styles.refSub}>#{c.id} · {statusMeta[c.status].label}</Text>
                        </View>
                        <View style={styles.pct}>
                          <Text style={styles.pctText}>{progressOf(c)}%</Text>
                        </View>
                      </View>
                      <Text style={[styles.refSub, { marginTop: S.sm }]}>Due: {fmtDate(c.dueDate)}</Text>
                      <Pressable style={styles.viewBtn} onPress={() => push({ name: 'contractDetails', id: c.id })}>
                        <Text style={styles.viewText}>View Details</Text>
                        <ArrowRight size={16} color={C.primary} />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          ),
        )}

        <View style={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <Pressable key={s} style={styles.suggestion} onPress={() => send(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + S.md }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor={C.textSecondary}
          style={styles.input}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
        />
        <Pressable style={styles.send} onPress={() => send(input)}>
          <Send size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingHorizontal: S.lg, paddingBottom: S.md },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  userBubble: { alignSelf: 'flex-end', backgroundColor: C.sage, padding: S.md, borderRadius: R.lg, borderBottomRightRadius: 4, maxWidth: '82%' },
  userText: { fontSize: 14, color: C.text, lineHeight: 20 },
  bot: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  aiBubble: { flex: 1, backgroundColor: C.surface, padding: S.md, borderRadius: R.lg, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.border, gap: S.md },
  aiText: { fontSize: 14, color: C.text, lineHeight: 20 },
  ref: { backgroundColor: C.muted, borderRadius: R.md, padding: S.md },
  refTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  refSub: { fontSize: 12, color: C.textSecondary },
  pct: { backgroundColor: '#F3EEFF', borderRadius: R.full, paddingHorizontal: 8, paddingVertical: 2 },
  pctText: { color: '#6D4BC2', fontSize: 11, fontWeight: '700' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: S.md, paddingTop: S.sm, borderTopWidth: 1, borderTopColor: C.border },
  viewText: { color: C.primary, fontWeight: '700' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, marginTop: S.sm },
  suggestion: { borderWidth: 1, borderColor: '#CFE3D8', backgroundColor: C.surface, borderRadius: R.full, paddingHorizontal: 12, paddingVertical: 8 },
  suggestionText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingHorizontal: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.surface },
  input: { flex: 1, height: 46, borderRadius: R.full, backgroundColor: C.muted, paddingHorizontal: S.lg, fontSize: 14, color: C.text },
  send: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
});
