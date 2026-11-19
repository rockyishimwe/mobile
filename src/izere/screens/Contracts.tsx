import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronDown, MoreVertical, Search, X } from 'lucide-react-native';
import { C, R, S, shadow } from '../theme';
import { Card, Chip, ContractIcon, Empty, ProgressBar, StatusPill } from '../ui';
import { useStore } from '../store';
import { Contract, ContractKind, fmtDate, kindLabel, progressOf, rwf, statusMeta } from '../data';
import { TextInput } from 'react-native';

type Filter = 'all' | 'active' | 'pending' | 'completed';

const matchesFilter = (c: Contract, f: Filter) => {
  if (f === 'all') return true;
  if (f === 'active') return ['active', 'awaiting_acceptance', 'disputed', 'overdue'].includes(c.status);
  if (f === 'pending') return c.status === 'pending' || c.status === 'draft';
  return c.status === 'completed';
};

export const ContractsScreen: React.FC = () => {
  const { contracts, push } = useStore();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [kind, setKind] = useState<ContractKind | 'all'>('all');
  const [kindOpen, setKindOpen] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return contracts.filter(
      (c) =>
        matchesFilter(c, filter) &&
        (kind === 'all' || c.kind === kind) &&
        (!t || [c.title, c.id, c.client, c.location].some((x) => x.toLowerCase().includes(t))),
    );
  }, [contracts, q, filter, kind]);

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <View style={{ paddingTop: insets.top + S.lg, paddingHorizontal: S.lg }}>
        <Text style={styles.h1}>Contracts</Text>
        <View style={styles.search}>
          <Search size={18} color={C.textSecondary} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search contracts..."
            placeholderTextColor={C.textSecondary}
            style={styles.searchInput}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <X size={16} color={C.textSecondary} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.sm, paddingVertical: S.md }}>
          <Pressable
            onPress={() => setKindOpen(!kindOpen)}
            style={[styles.kindBtn, kind !== 'all' && { backgroundColor: C.sage, borderColor: C.emerald }]}
          >
            <Text style={styles.kindText}>{kind === 'all' ? 'All' : kindLabel[kind].split(' ')[0]}</Text>
            <ChevronDown size={14} color={C.text} />
          </Pressable>
          {(['all', 'active', 'pending', 'completed'] as Filter[]).map((f) => (
            <Chip
              key={f}
              label={`${f === 'all' ? 'Any status' : f.charAt(0).toUpperCase() + f.slice(1)} · ${
                contracts.filter((c) => matchesFilter(c, f)).length
              }`}
              active={filter === f}
              onPress={() => setFilter(f)}
            />
          ))}
        </ScrollView>
        {kindOpen && (
          <View style={styles.menu}>
            {(['all', 'short_term', 'framework', 'work_order'] as const).map((k) => (
              <Pressable
                key={k}
                style={styles.menuItem}
                onPress={() => {
                  setKind(k);
                  setKindOpen(false);
                }}
              >
                <Text style={[styles.menuText, kind === k && { color: C.primary, fontWeight: '800' }]}>
                  {k === 'all' ? 'All agreement types' : kindLabel[k]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: S.lg, paddingTop: S.xs, gap: S.md, paddingBottom: 110 }}>
        {list.length === 0 && <Empty text="No contracts match your search." />}
        {list.map((c) => (
          <ContractCard key={c.id} c={c} onPress={() => push({ name: 'contractDetails', id: c.id })} />
        ))}
      </ScrollView>
    </View>
  );
};

export const ContractCard: React.FC<{ c: Contract; onPress: () => void }> = ({ c, onPress }) => {
  const p = progressOf(c);
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.accent, { backgroundColor: statusMeta[c.status].fg }]} />
      <View style={{ flexDirection: 'row', gap: S.md, padding: S.lg, paddingLeft: S.lg + 4 }}>
        <ContractIcon icon={c.icon} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{c.title}</Text>
            <MoreVertical size={18} color={C.textSecondary} />
          </View>
          <Text style={styles.sub} numberOfLines={1}>
            #{c.id} · {c.client}
          </Text>
          <View style={{ marginTop: 6 }}>
            <StatusPill status={c.status} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.md, marginTop: S.md }}>
            <ProgressBar value={p} color={c.status === 'disputed' ? C.danger : C.progress} />
            <Text style={styles.pct}>{p}%</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.meta}>
              <Calendar size={13} color={C.textSecondary} />
              <Text style={styles.sub}>{fmtDate(c.dueDate)}</Text>
            </View>
            <Text style={styles.amount}>{rwf(c.totalRwf)}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: 26, fontWeight: '800', color: C.text, marginBottom: S.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    height: 46,
    backgroundColor: '#EEF1EC',
    borderRadius: R.md,
    paddingHorizontal: S.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: C.text, height: '100%' },
  kindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: R.full,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  kindText: { fontSize: 13, fontWeight: '600', color: C.text },
  menu: {
    position: 'absolute',
    top: '100%',
    left: S.lg,
    zIndex: 10,
    backgroundColor: C.surface,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: S.xs,
    ...shadow,
    elevation: 8,
  },
  menuItem: { paddingHorizontal: S.lg, paddingVertical: S.md },
  menuText: { fontSize: 14, color: C.text },
  title: { fontSize: 15, fontWeight: '700', color: C.text, flex: 1 },
  sub: { fontSize: 12, color: C.textSecondary },
  pct: { fontSize: 12, fontWeight: '700', color: C.text, width: 36, textAlign: 'right' },
  card: { padding: 0, overflow: 'hidden' },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: S.md, paddingTop: S.sm, borderTopWidth: 1, borderTopColor: C.border },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  amount: { fontSize: 13, fontWeight: '800', color: C.primary },
});
