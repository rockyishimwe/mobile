import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BadgeCheck } from 'lucide-react-native';
import { C, S } from '../theme';
import { Card, Empty, ScreenHeader, StatusPill } from '../ui';
import { useStore } from '../store';
import { fmtDate, kindLabel, rwf } from '../data';

export const FullContractScreen: React.FC<{ id: string }> = ({ id }) => {
  const { getContract, pop, user } = useStore();
  const insets = useSafeAreaInsets();
  const c = getContract(id);
  if (!c) return <Empty text="Contract not found." />;

  const parties = [
    { role: 'Contractor', name: user.name, phone: user.phone },
    { role: 'Client', name: c.client, phone: '+250 78x xxx xxx' },
  ];
  const confirmed = c.status !== 'pending' && c.status !== 'draft';

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <ScreenHeader title="Full Contract" onBack={pop} />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.lg, paddingBottom: insets.bottom + S.xxl }}>
        <Card>
          <Text style={styles.small}>#{c.id} · {kindLabel[c.kind]} · v1.1</Text>
          <Text style={styles.title}>{c.title}</Text>
          <View style={{ marginTop: S.sm }}>
            <StatusPill status={c.status} />
          </View>
          <Text style={[styles.body, { marginTop: S.md }]}>{c.scope}</Text>
          <View style={styles.grid}>
            <Field k="Start" v={fmtDate(c.startDate)} />
            <Field k="Due" v={fmtDate(c.dueDate)} />
            <Field k="Total" v={rwf(c.totalRwf)} />
            <Field k="Location" v={c.location} />
          </View>
        </Card>

        <Text style={styles.h2}>Parties</Text>
        {parties.map((p) => (
          <Card key={p.role} style={{ flexDirection: 'row', alignItems: 'center', gap: S.md }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.small}>{p.role}</Text>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.small}>{p.phone}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <BadgeCheck size={22} color={confirmed ? C.success : '#B9C2BC'} />
              <Text style={[styles.small, { color: confirmed ? C.success : C.textSecondary }]}>
                {confirmed ? 'Confirmed' : 'Waiting'}
              </Text>
            </View>
          </Card>
        ))}

        <Text style={styles.h2}>Milestones</Text>
        <Card style={{ paddingVertical: S.sm }}>
          {c.stages.map((s, i) => (
            <View key={s.id} style={[styles.row, i < c.stages.length - 1 && styles.border]}>
              <Text style={styles.body}>{i + 1}. {s.name}</Text>
              <Text style={styles.bodyBold}>{rwf(s.amountRwf)}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.h2}>Clauses</Text>
        {c.clauses.map((cl) => (
          <Card key={cl.title}>
            <Text style={styles.name}>{cl.title}</Text>
            <Text style={[styles.body, { marginTop: 6 }]}>{cl.body}</Text>
          </Card>
        ))}

        <Text style={[styles.small, { textAlign: 'center' }]}>
          This record is shared by both parties. IZERE is not a court, bank or escrow service.
        </Text>
      </ScrollView>
    </View>
  );
};

const Field: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <View style={{ width: '50%', paddingVertical: S.sm }}>
    <Text style={styles.small}>{k}</Text>
    <Text style={styles.bodyBold}>{v}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 4 },
  h2: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: -S.sm },
  name: { fontSize: 15, fontWeight: '700', color: C.text },
  small: { fontSize: 12, color: C.textSecondary },
  body: { fontSize: 14, color: C.text, lineHeight: 20 },
  bodyBold: { fontSize: 14, color: C.text, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: S.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: S.md },
  border: { borderBottomWidth: 1, borderBottomColor: C.border },
});
