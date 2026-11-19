import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, ChevronRight, Globe, LogOut, Mail, Phone, ShieldCheck, Wallet } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Avatar, Card, Imigongo } from '../ui';
import { useStore } from '../store';
import { rwf } from '../data';

export const ProfileScreen: React.FC = () => {
  const { user, contracts, signOut, push } = useStore();
  const insets = useSafeAreaInsets();
  const [lang, setLang] = useState<'en' | 'rw'>('en');

  const total = contracts.reduce((s, c) => s + c.totalRwf, 0);
  const paid = contracts.reduce((s, c) => s + c.paidRwf, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.ivory }} contentContainerStyle={{ paddingBottom: 110 }}>
      <View style={[styles.hero, { paddingTop: insets.top + S.xl }]}>
        <Avatar name={user.name} size={76} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Imigongo height={22} color={C.primary} bg={C.ivory} />

      <View style={{ padding: S.lg, gap: S.lg }}>
        <View style={{ flexDirection: 'row', gap: S.md }}>
          <Card style={styles.stat}>
            <Text style={styles.statLabel}>Portfolio</Text>
            <Text style={styles.statValue}>{rwf(total)}</Text>
          </Card>
          <Card style={styles.stat}>
            <Text style={styles.statLabel}>Collected</Text>
            <Text style={[styles.statValue, { color: C.success }]}>{rwf(paid)}</Text>
          </Card>
        </View>

        <Card style={{ paddingVertical: S.xs }}>
          <Row icon={<Phone size={18} color={C.primary} />} label="Phone" value={user.phone} />
          <Row icon={<Mail size={18} color={C.primary} />} label="Email" value={user.email} />
          <View style={styles.row}>
            <Globe size={18} color={C.primary} />
            <Text style={styles.rowLabel}>Language</Text>
            <View style={styles.seg}>
              {(['en', 'rw'] as const).map((l) => (
                <Pressable key={l} onPress={() => setLang(l)} style={[styles.segBtn, lang === l && styles.segOn]}>
                  <Text style={[styles.segText, lang === l && { color: '#fff' }]}>{l === 'en' ? 'English' : 'Kinyarwanda'}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Card>

        <Card style={{ paddingVertical: S.xs }}>
          <Row icon={<Bot size={18} color={C.primary} />} label="AI Assistant" chevron onPress={() => push({ name: 'assistant' })} last={false} />
          <Row icon={<Wallet size={18} color={C.primary} />} label="Payments: MoMo, Airtel, BK" chevron last={false} />
          <Row icon={<ShieldCheck size={18} color={C.primary} />} label="Privacy (Law No. 058/2021)" chevron last />
        </Card>

        <Pressable style={styles.logout} onPress={signOut}>
          <LogOut size={18} color={C.danger} />
          <Text style={{ color: C.danger, fontWeight: '700' }}>Sign Out</Text>
        </Pressable>
        <Text style={styles.footer}>Built for Rwanda. Designed for your success.{'\n'}IZERE v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  chevron?: boolean;
  onPress?: () => void;
  last?: boolean;
}> = ({ icon, label, value, chevron, onPress, last = false }) => (
  <Pressable onPress={onPress} style={[styles.row, !last && styles.border]}>
    {icon}
    <Text style={styles.rowLabel}>{label}</Text>
    {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    {chevron ? <ChevronRight size={18} color={C.textSecondary} /> : null}
  </Pressable>
);

const styles = StyleSheet.create({
  hero: { backgroundColor: C.primary, alignItems: 'center', paddingBottom: S.xl, gap: 4 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: S.md },
  email: { color: '#CFE3D8', fontSize: 13 },
  stat: { flex: 1, padding: S.md },
  statLabel: { fontSize: 12, color: C.textSecondary },
  statValue: { fontSize: 15, fontWeight: '800', color: C.text, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  border: { borderBottomWidth: 1, borderBottomColor: C.border },
  rowLabel: { flex: 1, fontSize: 14, color: C.text },
  rowValue: { fontSize: 13, color: C.textSecondary },
  seg: { flexDirection: 'row', backgroundColor: C.muted, borderRadius: R.full, padding: 3 },
  segBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: R.full },
  segOn: { backgroundColor: C.primary },
  segText: { fontSize: 12, fontWeight: '600', color: C.text },
  logout: { flexDirection: 'row', gap: S.sm, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: R.md, borderWidth: 1, borderColor: '#F6CFCC', backgroundColor: '#FEF7F6' },
  footer: { textAlign: 'center', color: C.textSecondary, fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
});
