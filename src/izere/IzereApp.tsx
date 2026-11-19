import React, { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, FileText, Home, Plus, User } from 'lucide-react-native';
import { C, S } from './theme';
import { FadeIn, ScalePress, Toast } from './ui';
import { StoreProvider, Tab, useStore } from './store';
import { OnboardingScreen } from './screens/Onboarding';
import { AuthScreen } from './screens/Auth';
import { HomeScreen } from './screens/Home';
import { ContractsScreen } from './screens/Contracts';
import { NotificationsScreen } from './screens/Notifications';
import { ProfileScreen } from './screens/Profile';
import { ContractDetailsScreen } from './screens/ContractDetails';
import { FullContractScreen } from './screens/FullContract';
import { WorkProgressScreen } from './screens/WorkProgress';
import { AssistantScreen } from './screens/Assistant';
import { CreateContractScreen } from './screens/CreateContract';

const TabBar: React.FC = () => {
  const { tab, setTab, push, notifications } = useStore();
  const insets = useSafeAreaInsets();
  const unread = notifications.filter((n) => !n.read).length;

  const item = (key: Tab, label: string, Icon: typeof Home, badge?: number) => {
    const on = tab === key;
    return (
      <Pressable key={key} style={styles.item} onPress={() => setTab(key)}>
        <View style={[styles.iconWrap, on && styles.iconWrapOn]}>
          <Icon size={22} color={on ? C.primary : C.textSecondary} strokeWidth={on ? 2.4 : 1.8} />
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.label, on && { color: C.primary, fontWeight: '700' }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, S.sm) }]}>
      {item('home', 'Home', Home)}
      {item('contracts', 'Contracts', FileText)}
      <View style={styles.item}>
        <ScalePress style={styles.fab} scaleTo={0.9} onPress={() => push({ name: 'createContract' })}>
          <Plus size={26} color="#fff" strokeWidth={2.6} />
        </ScalePress>
      </View>
      {item('notifications', 'Notifications', Bell, unread)}
      {item('profile', 'Profile', User)}
    </View>
  );
};

const Root: React.FC = () => {
  const store = useStore();
  const { authStage, stack, tab, setTab, pop, setAuthStage } = store;

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (authStage === 'signIn' || authStage === 'signUp') {
        setAuthStage('onboarding');
        return true;
      }
      if (authStage !== 'app') return false;
      if (pop()) return true;
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [authStage, stack, tab, pop, setTab, setAuthStage]);

  if (authStage === 'onboarding') return <FadeIn from="none"><OnboardingScreen /></FadeIn>;
  if (authStage === 'signIn' || authStage === 'signUp')
    return (
      <FadeIn key={authStage} from="bottom">
        <AuthScreen mode={authStage} />
      </FadeIn>
    );

  const top = stack[stack.length - 1];
  if (top.name !== 'tabs') {
    const key = `${stack.length}-${top.name}-${'id' in top ? top.id : ''}`;
    let screen: React.ReactNode = null;
    switch (top.name) {
      case 'contractDetails':
        screen = <ContractDetailsScreen id={top.id} />;
        break;
      case 'fullContract':
        screen = <FullContractScreen id={top.id} />;
        break;
      case 'workProgress':
        screen = <WorkProgressScreen id={top.id} />;
        break;
      case 'assistant':
        screen = <AssistantScreen />;
        break;
      case 'createContract':
        screen = <CreateContractScreen />;
        break;
    }
    return (
      <FadeIn key={key} from={top.name === 'createContract' ? 'bottom' : 'right'} style={{ backgroundColor: C.ivory }}>
        {screen}
      </FadeIn>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.ivory }}>
      <FadeIn key={tab} from="none">
        {tab === 'home' && <HomeScreen />}
        {tab === 'contracts' && <ContractsScreen />}
        {tab === 'notifications' && <NotificationsScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </FadeIn>
      <TabBar />
    </View>
  );
};

const StatusBarFor: React.FC = () => {
  const { authStage, stack, tab } = useStore();
  const darkHeader = authStage === 'app' && stack.length === 1 && (tab === 'home' || tab === 'profile');
  return <StatusBar style={darkHeader ? 'light' : 'dark'} />;
};

const ToastHost: React.FC = () => {
  const { toast } = useStore();
  return <Toast message={toast?.message ?? null} tone={toast?.tone} />;
};

export default function IzereApp() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <View style={{ flex: 1, backgroundColor: C.ivory }}>
          <StatusBarFor />
          <Root />
          <ToastHost />
        </View>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: S.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 2 },
  iconWrap: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 14 },
  iconWrapOn: { backgroundColor: C.sage },
  label: { fontSize: 11, color: C.textSecondary },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderWidth: 4,
    borderColor: C.surface,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -9,
    backgroundColor: C.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
