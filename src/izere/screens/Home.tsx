import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  FilePlus2,
  FileText,
  Sparkles,
  Wallet,
} from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Avatar, Card, ContractIcon, ProgressBar, ScalePress, SectionTitle, StatusPill } from '../ui';
import { useStore } from '../store';
import { daysUntil, fmtDate, progressOf, rwf, timeAgo, TODAY } from '../data';

const greeting = () => {
  const h = TODAY.getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const compactRwf = (n: number) =>
  n >= 1_000_000 ? `RWF ${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `RWF ${Math.round(n / 1000)}K` : rwf(n);

/** Soft decorative rings echoing the logo, drawn behind the hero. */
const HeroRings = () => (
  <View pointerEvents="none" style={{ position: 'absolute', right: -60, top: -30 }}>
    <Svg width={220} height={220}>
      <Circle cx={110} cy={110} r={100} stroke="rgba(255,255,255,0.06)" strokeWidth={24} fill="none" />
      <Circle cx={110} cy={110} r={55} stroke="rgba(213,168,90,0.18)" strokeWidth={10} fill="none" />
      <Path d="M80 112 L102 132 L146 86" stroke="rgba(213,168,90,0.25)" strokeWidth={10} strokeLinecap="round" fill="none" />
    </Svg>
  </View>
);

export const HomeScreen: React.FC = () => {
  const { user, contracts, notifications, setTab, push, showToast } = useStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Everything is up to date', 'info');
    }, 900);
  };

  const active = contracts.filter((c) => ['active', 'awaiting_acceptance', 'disputed'].includes(c.status));
  const completed = contracts.filter((c) => c.status === 'completed');
  const pending = contracts.filter((c) => c.status === 'pending' || c.status === 'draft');
  const unread = notifications.filter((n) => !n.read).length;

  const upcoming = contracts
    .filter((c) => c.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const activity = contracts
    .flatMap((c) => c.activity.map((a) => ({ ...a, contractId: c.id, title: c.title })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const disputed = contracts.find((c) => c.status === 'disputed');
  const portfolio = contracts.reduce((sum, c) => sum + c.totalRwf, 0);
  const collected = contracts.reduce((sum, c) => sum + c.paidRwf, 0);
  const collectedPct = portfolio ? Math.round((collected / portfolio) * 100) : 0;
  const trackTarget = contracts.find((c) => c.status === 'active') ?? active[0];

  const actions = [
    { label: 'New\ncontract', Icon: FilePlus2, onPress: () => push({ name: 'createContract' }) },
    {
      label: 'Track\nwork',
      Icon: Activity,
      onPress: () => (trackTarget ? push({ name: 'workProgress', id: trackTarget.id }) : setTab('contracts')),
    },
    { label: 'Ask\nAI', Icon: Sparkles, onPress: () => push({ name: 'assistant' }) },
    { label: 'Payment\nstatus', Icon: Wallet, onPress: () => setTab('profile') },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.ivory }}
      contentContainerStyle={{ paddingBottom: 110 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />
      }
    >
      <View style={[styles.hero, { paddingTop: insets.top + S.lg }]}>
        <HeroRings />
        <View style={styles.heroTop}>
          <Pressable onPress={() => setTab('profile')}>
            <Avatar name={user.name} size={48} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: S.md }}>
            <Text style={styles.welcome}>{greeting()},</Text>
            <Text style={styles.hello}>{user.name} 👋</Text>
          </View>
          <Pressable onPress={() => setTab('notifications')} hitSlop={10} style={styles.bellBtn}>
            <Bell size={22} color="#fff" />
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <ScalePress style={styles.activeCard} onPress={() => setTab('contracts')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeLabel}>Active Contracts</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm, marginTop: 4 }}>
                <Text style={styles.activeCount}>{active.length}</Text>
                <View style={styles.trend}>
                  <ArrowUp size={12} color="#BDE5CF" />
                  <Text style={styles.trendText}>+1 this month</Text>
                </View>
              </View>
            </View>
            <View style={styles.docIcon}>
              <FileText size={28} color={C.primary} />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.moneyLabel}>Portfolio</Text>
              <Text style={styles.money}>{compactRwf(portfolio)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.moneyLabel}>Collected</Text>
              <Text style={[styles.money, { color: C.gold }]}>{compactRwf(collected)}</Text>
            </View>
          </View>
          <View style={styles.moneyTrack}>
            <View style={[styles.moneyFill, { width: `${collectedPct}%` }]} />
          </View>
          <Text style={styles.moneyFoot}>{collectedPct}% of agreed value collected</Text>
        </ScalePress>
      </View>

      <View style={styles.actions}>
        {actions.map(({ label, Icon, onPress }) => (
          <ScalePress key={label} style={styles.action} onPress={onPress} scaleTo={0.92}>
            <View style={styles.actionIcon}>
              <Icon size={22} color={C.primary} />
            </View>
            <Text style={styles.actionText}>{label}</Text>
          </ScalePress>
        ))}
      </View>

      <View style={{ paddingHorizontal: S.lg }}>
        <View style={styles.statsRow}>
          <Card style={styles.stat} onPress={() => setTab('contracts')}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F4EA' }]}>
              <CheckCircle2 size={20} color={C.success} />
            </View>
            <View>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{completed.length}</Text>
            </View>
          </Card>
          <Card style={styles.stat} onPress={() => setTab('contracts')}>
            <View style={[styles.statIcon, { backgroundColor: C.goldLight }]}>
              <Clock size={20} color={C.gold} />
            </View>
            <View>
              <Text style={styles.statLabel}>Pending</Text>
              <Text style={styles.statValue}>{pending.length}</Text>
            </View>
          </Card>
        </View>

        {disputed && (
          <Card style={styles.alert} onPress={() => push({ name: 'contractDetails', id: disputed.id })}>
            <View style={styles.alertIcon}>
              <AlertTriangle size={18} color={C.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: C.danger }}>Action needed</Text>
              <Text style={{ color: C.text, fontSize: 13, marginTop: 2 }}>
                {disputed.title} is disputed. Delay penalties are paused.
              </Text>
            </View>
            <ChevronRight size={18} color={C.danger} />
          </Card>
        )}

        <SectionTitle title="Upcoming Deadlines" action="View all" onAction={() => setTab('contracts')} />
        <View style={{ gap: S.md }}>
          {upcoming.map((c) => {
            const d = daysUntil(c.dueDate);
            const p = progressOf(c);
            const urgent = d <= 3;
            return (
              <Card key={c.id} onPress={() => push({ name: 'contractDetails', id: c.id })}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.md }}>
                  <ContractIcon icon={c.icon} size={42} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cTitle}>{c.title}</Text>
                    <Text style={styles.cSub}>{fmtDate(c.dueDate)}</Text>
                  </View>
                  <View
                    style={[
                      styles.daysPill,
                      urgent && { backgroundColor: '#FFF1F2' },
                    ]}
                  >
                    <Text style={[styles.daysText, urgent && { color: '#BE123C' }]}>
                      {d < 0 ? `${-d}d late` : d === 0 ? 'Today' : `In ${d} days`}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.md, marginTop: S.md }}>
                  <ProgressBar value={p} color={c.status === 'disputed' ? C.danger : C.progress} />
                  <Text style={styles.pct}>{p}%</Text>
                </View>
              </Card>
            );
          })}
        </View>

        <ScalePress style={styles.aiCard} onPress={() => push({ name: 'assistant' })}>
          <View style={styles.aiIcon}>
            <Bot size={22} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Ask the AI Assistant</Text>
            <Text style={{ color: '#CFE3D8', fontSize: 12, marginTop: 2 }}>“Which jobs are overdue this week?”</Text>
          </View>
          <View style={styles.aiArrow}>
            <ChevronRight size={18} color={C.primary} />
          </View>
        </ScalePress>

        <SectionTitle title="Recent Activity" action="View all" onAction={() => setTab('notifications')} />
        <Card style={{ paddingVertical: S.xs }}>
          {activity.map((a, i) => (
            <Pressable
              key={i}
              onPress={() => push({ name: 'contractDetails', id: a.contractId })}
              style={[styles.actRow, i < activity.length - 1 && styles.actBorder]}
            >
              <View style={styles.actDot}>
                <CheckCircle2 size={18} color={C.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cTitle} numberOfLines={2}>
                  {a.text}
                </Text>
                <Text style={styles.cSub}>{a.title}</Text>
              </View>
              <Text style={styles.cSub}>{timeAgo(a.date)}</Text>
            </Pressable>
          ))}
        </Card>

        <SectionTitle title="Your Contracts" />
        <View style={{ gap: S.md }}>
          {active.map((c) => (
            <Card key={c.id} onPress={() => push({ name: 'contractDetails', id: c.id })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.md }}>
                <ContractIcon icon={c.icon} size={38} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cTitle}>{c.title}</Text>
                  <Text style={styles.cSub}>
                    #{c.id} · {c.client}
                  </Text>
                </View>
                <StatusPill status={c.status} />
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: C.primary,
    paddingHorizontal: S.lg,
    paddingBottom: 44,
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  hello: { color: '#fff', fontSize: 22, fontWeight: '800' },
  welcome: { color: '#A9C9B9', fontSize: 13 },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: C.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: C.primary,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  activeCard: {
    marginTop: S.xl,
    backgroundColor: '#1D5545',
    borderRadius: R.xl,
    padding: S.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeLabel: { color: '#E6F1EB', fontSize: 14, fontWeight: '600' },
  activeCount: { color: '#fff', fontSize: 34, fontWeight: '800' },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: R.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  trendText: { color: '#BDE5CF', fontWeight: '700', fontSize: 11 },
  docIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#BFE3CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: S.md },
  moneyLabel: { color: '#A9C9B9', fontSize: 12 },
  money: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 2 },
  moneyTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: S.md,
    overflow: 'hidden',
  },
  moneyFill: { height: 6, borderRadius: 3, backgroundColor: C.gold },
  moneyFoot: { color: '#A9C9B9', fontSize: 11, marginTop: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.xl, marginTop: -26 },
  action: { width: 72, alignItems: 'center', gap: 6 },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#123D32',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionText: { fontSize: 11, fontWeight: '600', color: C.text, textAlign: 'center', lineHeight: 14 },
  statsRow: { flexDirection: 'row', gap: S.md, marginTop: S.lg },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 12, color: C.textSecondary },
  statValue: { fontSize: 20, fontWeight: '800', color: C.text },
  alert: {
    marginTop: S.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    backgroundColor: '#FEF7F6',
    borderColor: '#F6CFCC',
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE4E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  cSub: { fontSize: 12, color: C.textSecondary, marginTop: 2 },
  daysPill: { backgroundColor: C.goldLight, borderRadius: R.full, paddingHorizontal: 10, paddingVertical: 4 },
  daysText: { color: C.warning, fontSize: 11, fontWeight: '700' },
  pct: { fontSize: 12, fontWeight: '700', color: C.text, width: 36, textAlign: 'right' },
  aiCard: {
    marginTop: S.xl,
    backgroundColor: C.primary,
    borderRadius: R.xl,
    padding: S.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  actBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  actDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E3F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
