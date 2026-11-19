import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Apple, Check, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from 'lucide-react-native';
import { C, R, S } from '../theme';
import { Button, Imigongo, Input, Logo } from '../ui';
import { useStore } from '../store';

const emailOk = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

export const AuthScreen: React.FC<{ mode: 'signIn' | 'signUp' }> = ({ mode }) => {
  const { signIn, signUp, setAuthStage } = useStore();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const isUp = mode === 'signUp';

  const submit = () => {
    setInfo('');
    if (isUp && name.trim().length < 2) return setError('Please enter your full name.');
    if (isUp && phone.replace(/\D/g, '').length < 9) return setError('Please enter a valid phone number.');
    if (!emailOk(email)) return setError('Please enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    if (isUp) signUp({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    else signIn(email.trim());
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.ivory }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + S.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: S.xl }}>
          <Logo size={68} />
        </View>
        <Text style={styles.title}>{isUp ? 'Create Account' : 'Welcome Back 👋'}</Text>
        <Text style={styles.subtitle}>
          {isUp ? 'Only your name and phone are required.' : 'Sign in to your IZERE account'}
        </Text>

        {isUp && (
          <>
            <Input
              icon={<UserIcon size={18} color={C.textSecondary} />}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <Input
              icon={<Phone size={18} color={C.textSecondary} />}
              placeholder="+250 7XX XXX XXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        )}
        <Input
          icon={<Mail size={18} color={C.textSecondary} />}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          icon={<Lock size={18} color={C.textSecondary} />}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!show}
          autoCapitalize="none"
          onSubmitEditing={submit}
          right={
            <Pressable onPress={() => setShow(!show)} hitSlop={10}>
              {show ? <Eye size={18} color={C.textSecondary} /> : <EyeOff size={18} color={C.textSecondary} />}
            </Pressable>
          }
        />

        {!isUp && (
          <View style={styles.row}>
            <Pressable style={styles.row} onPress={() => setRemember(!remember)}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember && <Check size={12} color="#fff" strokeWidth={3} />}
              </View>
              <Text style={styles.small}>Remember me</Text>
            </Pressable>
            <Pressable onPress={() => setInfo('A reset link would be sent to your email (demo).')}>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={styles.info}>{info}</Text> : null}

        <Button title={isUp ? 'Create Account' : 'Sign In'} onPress={submit} style={{ marginTop: S.lg }} />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.small}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <View style={{ flexDirection: 'row', gap: S.md }}>
          <Pressable style={styles.social} onPress={() => signIn('rocky@gmail.com')}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
          <Pressable style={styles.social} onPress={() => signIn('rocky@icloud.com')}>
            <Apple size={18} color={C.text} />
            <Text style={styles.socialText}>Apple</Text>
          </Pressable>
        </View>

        <View style={[styles.row, { justifyContent: 'center', marginTop: S.xl }]}>
          <Text style={styles.small}>{isUp ? 'Already have an account? ' : "Don't have an account? "}</Text>
          <Pressable
            onPress={() => {
              setError('');
              setAuthStage(isUp ? 'signIn' : 'signUp');
            }}
          >
            <Text style={styles.link}>{isUp ? 'Sign In' : 'Sign Up'}</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ paddingBottom: insets.bottom, backgroundColor: C.ivory }}>
        <Imigongo height={26} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: S.xl, paddingBottom: S.xl },
  title: { fontSize: 26, fontWeight: '800', color: C.text },
  subtitle: { fontSize: 14, color: C.textSecondary, marginTop: 4, marginBottom: S.xl },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: S.sm },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: C.primary },
  small: { fontSize: 13, color: C.textSecondary },
  link: { fontSize: 13, fontWeight: '700', color: C.primary },
  error: { color: C.danger, marginTop: S.md, fontSize: 13 },
  info: { color: C.emerald, marginTop: S.md, fontSize: 13 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, marginVertical: S.xl },
  divider: { flex: 1, height: 1, backgroundColor: C.border },
  social: {
    flex: 1,
    height: 48,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
  },
  googleG: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  socialText: { fontSize: 14, fontWeight: '600', color: C.text },
});
