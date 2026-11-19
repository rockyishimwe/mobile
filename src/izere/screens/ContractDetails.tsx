import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Image as ImageIcon,
  MapPin,
  Receipt,
  Scale,
  Users,
  Wallet,
  ShieldCheck,
} from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Button, Card, ContractIcon, Empty, ProgressBar, ScreenHeader, StatusPill } from '../ui';
import { useStore } from '../store';
import { fmtDate, kindLabel, progressOf, rwf, timeAgo } from '../data';

type TabKey = 'overview' | 'milestones' | 'activity' | 'files';

export const ContractDetailsScreen: React.FC<{ id: string }> = ({ id }) => {
  const { getContract, pop, push, acceptDeliverable, raiseDispute } = useStore();
  const insets = useSafeAreaInsets();
  const c = getContract(id);
  const [tab, setTab] = useState<TabKey>('overview');
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!c) return <Empty text="Contract not found." />;
  const p = progressOf(c);

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <ScreenHeader title="Contract Details" onBack={pop} showMore onMore={() => setMenuOpen(!menuOpen)} />
      {menuOpen && (
        <View style={[styles.menu, { top: insets.top + 50 }]}>
          <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); push({ name: 'fullContract', id }); }}>
            <Text style={styles.menuText}>View full contract</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); push({ name: 'workProgress', id }); }}>
            <Text style={styles.menuText}>Work progress</Text>
          </Pressable>
          {c.status !== 'disputed' && c.status !== 'completed' && (
            <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); setDisputeOpen(true); }}>
              <Text style={[styles.menuText, { color: C.danger }]}>Raise dispute</Text>
            </Pressable>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: S.lg, paddingBottom: insets.bottom + 110 }}>
        <View style={{ flexDirection: 'row', gap: S.md, alignItems: 'center' }}>
          <ContractIcon icon={c.icon} size={56} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.sub}>#{c.id} · {kindLabel[c.kind]}</Text>
            <StatusPill status={c.status} />
          </View>
        </View>

        <View style={styles.tabs}>
          {(['overview', 'milestones', 'activity', 'files'] as TabKey[]).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'overview' && (
          <View style={{ gap: S.lg }}>
            <View>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Overall Progress</Text>
                <Text style={styles.big}>{p}%</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: S.sm }}>
                <ProgressBar value={p} height={9} color={C.primary} />
              </View>
            </View>

            {c.status === 'disputed' && (
              <Card style={{ backgroundColor: '#FEF7F6', borderColor: '#F6CFCC' }}>
                <Text style={{ color: C.danger, fontWeight: '700' }}>Dispute open</Text>
                <Text style={styles.body}>
                  All delay deductions are paused until both parties record a resolution.
                </Text>
              </Card>
            )}

            <View>
              <Text style={styles.section}>Key Information</Text>
              <Info icon={<Calendar size={18} color={C.text} />} k="Start Date" v={fmtDate(c.startDate)} />
              <Info icon={<Clock size={18} color={C.text} />} k="Due Date" v={fmtDate(c.dueDate)} />
              <Info icon={<Users size={18} color={C.text} />} k="Parties" v={`${c.contractor} & ${c.client}`} />
              <Info icon={<MapPin size={18} color={C.text} />} k="Location" v={c.location} />
            </View>

            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.section}>Payment Status</Text>
                <Wallet size={18} color={C.primary} />
              </View>
              <Info k="Agreed total" v={rwf(c.totalRwf)} />
              <Info k="Paid to date" v={rwf(c.paidRwf)} />
              <Info k="Remaining" v={rwf(c.totalRwf - c.paidRwf)} bold />
              <View style={styles.notice}>
                <ShieldCheck size={16} color={C.emerald} />
                <Text style={styles.noticeText}>
                  IZERE records Mobile Money references only. It never holds your money (BNR Law 61/2021).
                </Text>
              </View>
            </Card>

            <Card>
              <View style={styles.rowBetween}>
                <Text style={styles.section}>Delay Clause</Text>
                <Scale size={18} color={C.primary} />
              </View>
              <Info k="Grace period" v={`${c.gracePeriodDays} days`} />
              <Info k="Daily deduction" v={`${c.dailyPenaltyPct}% of milestone`} />
              <Info k="Maximum cap" v={`${c.maxPenaltyPct}%`} />
            </Card>

            {c.status === 'awaiting_acceptance' && (
              <Button title="Accept Deliverable" onPress={() => acceptDeliverable(c.id)} />
            )}
            <Button title="View Full Contract" onPress={() => push({ name: 'fullContract', id: c.id })} />
            {c.status !== 'disputed' && c.status !== 'completed' && (
              <Button title="Raise Dispute" variant="danger" onPress={() => setDisputeOpen(true)} />
            )}
          </View>
        )}

        {tab === 'milestones' && (
          <View style={{ gap: S.sm }}>
            {c.stages.map((s) => (
              <Card key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md }}>
                {s.status === 'completed' ? (
                  <CheckCircle2 size={22} color={C.success} />
                ) : s.status === 'in_progress' ? (
                  <Clock size={22} color={C.info} />
                ) : (
                  <Circle size={22} color="#B9C2BC" />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{s.name}</Text>
                  <Text style={styles.sub}>{fmtDate(s.date)} · {rwf(s.amountRwf)}</Text>
                </View>
              </Card>
            ))}
            <Button title="Open Work Progress" style={{ marginTop: S.md }} onPress={() => push({ name: 'workProgress', id: c.id })} />
          </View>
        )}

        {tab === 'activity' && (
          <Card style={{ paddingVertical: S.xs }}>
            {c.activity.map((a, i) => (
              <View key={i} style={[styles.actRow, i < c.activity.length - 1 && styles.border]}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{a.text}</Text>
                  <Text style={styles.sub}>{fmtDate(a.date)} · {timeAgo(a.date)}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {tab === 'files' && (
          <View style={{ gap: S.sm }}>
            {c.files.length === 0 && <Empty text="No files uploaded yet." />}
            {c.files.map((f, i) => (
              <Card key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md }}>
                <View style={styles.fileIcon}>
                  {f.kind === 'photo' ? (
                    <ImageIcon size={20} color={C.primary} />
                  ) : f.kind === 'receipt' ? (
                    <Receipt size={20} color={C.primary} />
                  ) : (
                    <FileText size={20} color={C.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{f.name}</Text>
                  <Text style={styles.sub}>{fmtDate(f.date)}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={disputeOpen} transparent animationType="slide" onRequestClose={() => setDisputeOpen(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + S.lg }]}>
            <Text style={styles.title}>Raise a dispute</Text>
            <Text style={[styles.body, { marginVertical: S.sm }]}>
              Describe the problem. Delay deductions pause while the dispute is open. IZERE keeps the record but does not
              decide who is right.
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="e.g. Materials delivered were not as agreed"
              placeholderTextColor={C.textSecondary}
              multiline
              style={styles.textarea}
            />
            <View style={{ flexDirection: 'row', gap: S.md, marginTop: S.lg }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setDisputeOpen(false)} />
              <Button
                title="Submit"
                style={{ flex: 1, backgroundColor: C.danger, borderColor: C.danger }}
                disabled={reason.trim().length < 5}
                onPress={() => {
                  raiseDispute(c.id, reason.trim());
                  setReason('');
                  setDisputeOpen(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Info: React.FC<{ icon?: React.ReactNode; k: string; v: string; bold?: boolean }> = ({ icon, k, v, bold }) => (
  <View style={styles.info}>
    {icon}
    <Text style={[styles.infoK, !icon && { marginLeft: 0 }]}>{k}</Text>
    <Text style={[styles.infoV, bold && { fontWeight: '800', color: C.primary }]}>{v}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '800', color: C.text },
  sub: { fontSize: 12, color: C.textSecondary },
  body: { fontSize: 13, color: C.text, lineHeight: 19 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: S.lg },
  tab: { flex: 1, paddingVertical: S.md, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2.5, borderBottomColor: C.primary },
  tabText: { fontSize: 13, color: C.textSecondary, fontWeight: '600' },
  tabTextActive: { color: C.primary, fontWeight: '800' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: C.text },
  big: { fontSize: 18, fontWeight: '800', color: C.text },
  section: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: S.sm },
  info: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  infoK: { flex: 1, marginLeft: S.md, fontSize: 14, color: C.text },
  infoV: { fontSize: 14, color: C.text, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  notice: { flexDirection: 'row', gap: S.sm, backgroundColor: C.sage, padding: S.md, borderRadius: R.md, marginTop: S.sm },
  noticeText: { flex: 1, fontSize: 12, color: C.primary, lineHeight: 17 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: C.text },
  actRow: { flexDirection: 'row', gap: S.md, paddingVertical: S.md, alignItems: 'flex-start' },
  border: { borderBottomWidth: 1, borderBottomColor: C.border },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.emerald, marginTop: 5 },
  fileIcon: { width: 40, height: 40, borderRadius: R.sm, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  menu: {
    position: 'absolute',
    right: S.lg,
    zIndex: 20,
    elevation: 10,
    backgroundColor: C.surface,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: S.xs,
    minWidth: 190,
  },
  menuItem: { paddingHorizontal: S.lg, paddingVertical: S.md },
  menuText: { fontSize: 14, color: C.text },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: S.xl },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: R.md,
    padding: S.md,
    fontSize: 14,
    color: C.text,
    textAlignVertical: 'top',
  },
});
