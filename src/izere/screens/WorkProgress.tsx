import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Check, CheckCircle2, Info, Receipt, AlertTriangle } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Button, Card, Empty, ScreenHeader } from '../ui';
import { useStore } from '../store';
import { daysUntil, fmtShort, progressOf, rwf } from '../data';

export const WorkProgressScreen: React.FC<{ id: string }> = ({ id }) => {
  const { getContract, pop, completeStage } = useStore();
  const insets = useSafeAreaInsets();
  const c = getContract(id);
  const [photo, setPhoto] = useState(false);
  const [receipt, setReceipt] = useState(false);
  if (!c) return <Empty text="Contract not found." />;

  const current = c.stages.find((s) => s.status === 'in_progress');
  const late = current ? daysUntil(current.date) < 0 : false;
  const lateDays = current ? -daysUntil(current.date) : 0;
  const frozen = c.status === 'disputed';

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <ScreenHeader title="Work Progress" onBack={pop} />
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: insets.bottom + S.xxl }}>
        <Text style={styles.contract}>{c.title} · {progressOf(c)}% done</Text>

        <View style={{ marginTop: S.lg }}>
          {c.stages.map((s, i) => {
            const isLast = i === c.stages.length - 1;
            const isCurrent = s.status === 'in_progress';
            return (
              <View key={s.id} style={{ flexDirection: 'row' }}>
                <View style={styles.rail}>
                  {s.status === 'completed' ? (
                    <View style={[styles.node, { backgroundColor: C.emerald, borderColor: C.emerald }]}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </View>
                  ) : isCurrent ? (
                    <View style={[styles.node, { borderColor: C.emerald, backgroundColor: '#fff' }]}>
                      <View style={styles.innerDot} />
                    </View>
                  ) : (
                    <View style={styles.node} />
                  )}
                  {!isLast && (
                    <View style={[styles.line, s.status === 'completed' && { backgroundColor: C.emerald }]} />
                  )}
                </View>
                <View style={[styles.stage, isCurrent && styles.stageCurrent]}>
                  <Text style={styles.stageName}>{s.name}</Text>
                  {s.status === 'completed' ? (
                    <View style={styles.metaRow}>
                      <CheckCircle2 size={13} color={C.success} />
                      <Text style={styles.meta}>Completed • {fmtShort(s.date)}</Text>
                    </View>
                  ) : isCurrent ? (
                    <Text style={[styles.meta, { color: late ? C.danger : C.info }]}>
                      In Progress • Due {fmtShort(s.date)}{late ? ` (${lateDays}d late)` : ''}
                    </Text>
                  ) : (
                    <Text style={styles.meta}>Pending • {fmtShort(s.date)}</Text>
                  )}
                  <Text style={[styles.meta, { marginTop: 2 }]}>{rwf(s.amountRwf)}</Text>

                  {isCurrent && c.status !== 'completed' && (
                    <View style={{ marginTop: S.md, gap: S.sm }}>
                      <Text style={styles.evLabel}>Evidence</Text>
                      <View style={{ flexDirection: 'row', gap: S.sm }}>
                        <Pressable style={[styles.ev, photo && styles.evOn]} onPress={() => setPhoto(!photo)}>
                          <Camera size={16} color={photo ? '#fff' : C.primary} />
                          <Text style={[styles.evText, photo && { color: '#fff' }]}>{photo ? 'Photo added' : 'Add photo'}</Text>
                        </Pressable>
                        <Pressable style={[styles.ev, receipt && styles.evOn]} onPress={() => setReceipt(!receipt)}>
                          <Receipt size={16} color={receipt ? '#fff' : C.primary} />
                          <Text style={[styles.evText, receipt && { color: '#fff' }]}>{receipt ? 'Receipt added' : 'EBM receipt'}</Text>
                        </Pressable>
                      </View>
                      <Button
                        title="Mark as Complete"
                        disabled={!photo}
                        onPress={() => {
                          completeStage(c.id, s.id);
                          setPhoto(false);
                          setReceipt(false);
                        }}
                      />
                      {!photo && <Text style={styles.meta}>Add at least one photo to submit this stage.</Text>}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {frozen ? (
          <Card style={[styles.banner, { backgroundColor: '#FEF7F6', borderColor: '#F6CFCC' }]}>
            <AlertTriangle size={20} color={C.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: C.danger }]}>Dispute open</Text>
              <Text style={styles.bannerBody}>Delay deductions are paused until it is resolved.</Text>
            </View>
          </Card>
        ) : late ? (
          <Card style={[styles.banner, { backgroundColor: C.goldLight, borderColor: '#F0DDB3' }]}>
            <AlertTriangle size={20} color={C.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: C.warning }]}>Behind schedule</Text>
              <Text style={styles.bannerBody}>
                {lateDays <= c.gracePeriodDays
                  ? `Within the ${c.gracePeriodDays}-day grace period — no deduction yet.`
                  : `${lateDays - c.gracePeriodDays} chargeable day(s) after grace. Any deduction needs human review.`}
              </Text>
            </View>
          </Card>
        ) : c.status === 'completed' ? (
          <Card style={styles.banner}>
            <CheckCircle2 size={20} color={C.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>All done!</Text>
              <Text style={styles.bannerBody}>Every milestone was completed and accepted.</Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.banner}>
            <Info size={20} color={C.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>You're on track!</Text>
              <Text style={styles.bannerBody}>Keep going to meet the deadline.</Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contract: { fontSize: 14, color: C.textSecondary, fontWeight: '600' },
  rail: { width: 34, alignItems: 'center' },
  node: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#C9D3CD',
    backgroundColor: C.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  innerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: C.emerald },
  line: { flex: 1, width: 2, backgroundColor: '#D7DED9', marginVertical: 2 },
  stage: { flex: 1, padding: S.md, marginBottom: S.md, marginLeft: S.sm, borderRadius: R.md },
  stageCurrent: { backgroundColor: C.sage, borderWidth: 1, borderColor: '#CFE3D8' },
  stageName: { fontSize: 15, fontWeight: '700', color: C.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  meta: { fontSize: 12, color: C.textSecondary, marginTop: 3 },
  evLabel: { fontSize: 12, fontWeight: '700', color: C.primary },
  ev: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: R.sm,
    borderWidth: 1,
    borderColor: C.emerald,
    backgroundColor: '#fff',
  },
  evOn: { backgroundColor: C.emerald },
  evText: { fontSize: 12, fontWeight: '700', color: C.primary },
  banner: { flexDirection: 'row', gap: S.md, alignItems: 'center', backgroundColor: '#EAF6EF', borderColor: '#CFE8DA', marginTop: S.md },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: C.primary },
  bannerBody: { fontSize: 13, color: C.text, marginTop: 2 },
});
