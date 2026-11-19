import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, CheckCheck, CheckCircle2, Info, Settings } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Empty } from '../ui';
import { useStore } from '../store';
import { NotifKind } from '../data';

const iconFor = (k: NotifKind) => {
  switch (k) {
    case 'deadline':
      return <AlertTriangle size={22} color="#E0A100" fill="#FDE68A" />;
    case 'milestone':
      return <CheckCircle2 size={22} color="#fff" fill={C.success} />;
    case 'payment':
      return <Info size={22} color="#fff" fill={C.info} />;
    case 'dispute':
      return <AlertTriangle size={22} color="#fff" fill={C.danger} />;
  }
};

export const NotificationsScreen: React.FC = () => {
  const { notifications, markRead, markAllRead, push } = useStore();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'alert' | 'update'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState({ sms: true, d7: true, h24: true });

  const counts = {
    all: notifications.length,
    alert: notifications.filter((n) => n.category === 'alert').length,
    update: notifications.filter((n) => n.category === 'update').length,
  };
  const list = notifications.filter((n) => filter === 'all' || n.category === filter);

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <View style={[styles.header, { paddingTop: insets.top + S.lg }]}>
        <Text style={styles.h1}>Notifications</Text>
        <View style={{ flexDirection: 'row', gap: S.lg }}>
          <Pressable onPress={markAllRead} hitSlop={10}>
            <CheckCheck size={22} color={C.text} />
          </Pressable>
          <Pressable onPress={() => setSettingsOpen(!settingsOpen)} hitSlop={10}>
            <Settings size={22} color={C.text} />
          </Pressable>
        </View>
      </View>

      {settingsOpen && (
        <View style={styles.settings}>
          {(
            [
              ['d7', '7-day deadline reminder'],
              ['h24', '24-hour deadline reminder'],
              ['sms', 'SMS fallback alerts'],
            ] as const
          ).map(([k, label]) => (
            <Pressable key={k} style={styles.settingRow} onPress={() => setPrefs({ ...prefs, [k]: !prefs[k] })}>
              <Text style={styles.settingText}>{label}</Text>
              <View style={[styles.toggle, prefs[k] && styles.toggleOn]}>
                <View style={[styles.knob, prefs[k] && { alignSelf: 'flex-end' }]} />
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.tabs}>
        {(['all', 'alert', 'update'] as const).map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.tab, filter === f && styles.tabOn]}>
            <Text style={[styles.tabText, filter === f && { color: '#fff' }]}>
              {f === 'all' ? 'All' : f === 'alert' ? 'Alerts' : 'Updates'} ({counts[f]})
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: S.lg, paddingBottom: 110 }}>
        {list.length === 0 && <Empty text="You're all caught up." />}
        {list.map((n, i) => (
          <Pressable
            key={n.id}
            onPress={() => {
              markRead(n.id);
              if (n.contractId) push({ name: 'contractDetails', id: n.contractId });
            }}
            style={[styles.row, i < list.length - 1 && styles.border]}
          >
            <View style={{ paddingTop: 2 }}>{iconFor(n.kind)}</View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, !n.read && { fontWeight: '800' }]}>{n.title}</Text>
              <Text style={styles.body}>{n.body}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Text style={styles.time}>{n.time}</Text>
              {!n.read && <View style={styles.unread} />}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.lg, paddingBottom: S.lg },
  h1: { fontSize: 26, fontWeight: '800', color: C.text },
  tabs: { flexDirection: 'row', gap: S.sm, paddingHorizontal: S.lg, marginBottom: S.md },
  tab: { paddingHorizontal: 16, height: 36, borderRadius: R.full, borderWidth: 1, borderColor: C.border, justifyContent: 'center', backgroundColor: C.surface },
  tabOn: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: C.text },
  row: { flexDirection: 'row', gap: S.md, paddingVertical: S.lg },
  border: { borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontSize: 15, fontWeight: '600', color: C.text },
  body: { fontSize: 13, color: C.textSecondary, marginTop: 2, lineHeight: 18 },
  time: { fontSize: 11, color: C.textSecondary },
  unread: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.danger },
  settings: { marginHorizontal: S.lg, marginBottom: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, paddingHorizontal: S.lg },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: S.md },
  settingText: { fontSize: 14, color: C.text },
  toggle: { width: 42, height: 24, borderRadius: 12, backgroundColor: '#D5DDD8', padding: 3 },
  toggleOn: { backgroundColor: C.emerald },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },
});
