import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Briefcase,
  Handshake,
  Settings,
  Home,
  Shirt,
  Truck,
  ChevronLeft,
  MoreVertical,
  LucideIcon,
  AlertTriangle,
  CheckCircle2,
  Inbox,
} from 'lucide-react-native';
import { C, R, S, shadow } from './theme';
import { ContractStatus, IconKey, statusMeta } from './data';

// ---------- Brand ----------
export const Logo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      d="M70 22 A34 34 0 1 0 78 66"
      stroke={C.primary}
      strokeWidth={17}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M40 50 L54 63 L88 24"
      stroke={C.gold}
      strokeWidth={12}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.primary }) => (
  <Text style={{ fontSize: size, fontWeight: '800', color, letterSpacing: 1.5 }}>IZERE</Text>
);

/** Rwandan Imigongo-style zig-zag band. */
export const Imigongo: React.FC<{ height?: number; color?: string; bg?: string }> = ({
  height = 34,
  color = C.primary,
  bg = C.ivory,
}) => {
  const unit = height;
  const count = 20;
  return (
    <View style={{ height, overflow: 'hidden', backgroundColor: bg }}>
      <Svg width={unit * count} height={height} viewBox={`0 0 ${count * 40} 40`}>
        <Rect x={0} y={0} width={count * 40} height={40} fill={bg} />
        {Array.from({ length: count }).map((_, i) => (
          <G key={i} transform={`translate(${i * 40},0)`}>
            <Path d="M0 0 L20 20 L0 40 Z" fill={color} />
            <Path d="M40 0 L20 20 L40 40 Z" fill={color} />
            <Path d="M20 8 L32 20 L20 32 L8 20 Z" fill="none" stroke={color} strokeWidth={3} />
            <Path d="M20 15 L25 20 L20 25 L15 20 Z" fill={color} />
          </G>
        ))}
      </Svg>
    </View>
  );
};

// ---------- Motion ----------
/** Pressable that gently shrinks while pressed. */
export const ScalePress: React.FC<{
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  scaleTo?: number;
}> = ({ onPress, disabled, style, children, scaleTo = 0.97 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: Platform.OS !== 'web', speed: 40, bounciness: 6 }).start();
  // Outer layout props (flex, width, margins) belong on the Pressable so the
  // wrapper sizes like the original element; everything else stays inside.
  const flat = StyleSheet.flatten(style) ?? {};
  const { flex, width, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical, ...inner } = flat;
  const outer = { flex, width, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      style={outer}
    >
      <Animated.View style={[inner, flex !== undefined && { flex: 1 }, width !== undefined && { width: '100%' }, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/** Fades and slides its children in on mount. */
export const FadeIn: React.FC<{ children: React.ReactNode; from?: 'right' | 'bottom' | 'none'; style?: StyleProp<ViewStyle> }> = ({
  children,
  from = 'bottom',
  style,
}) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [v]);
  const shift = v.interpolate({ inputRange: [0, 1], outputRange: [from === 'none' ? 0 : 24, 0] });
  const transform = from === 'right' ? [{ translateX: shift }] : [{ translateY: shift }];
  return <Animated.View style={[{ flex: 1, opacity: v, transform }, style]}>{children}</Animated.View>;
};

/** Toast banner shown at the top of the screen. */
export const Toast: React.FC<{ message: string | null; tone?: 'success' | 'danger' | 'info' }> = ({ message, tone = 'success' }) => {
  const insets = useSafeAreaInsets();
  const v = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState<string | null>(null);
  useEffect(() => {
    if (message) setShown(message);
    Animated.timing(v, { toValue: message ? 1 : 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start(
      () => !message && setShown(null),
    );
  }, [message, v]);
  if (!shown) return null;
  const bg = tone === 'danger' ? C.danger : tone === 'info' ? C.info : C.primary;
  const Icon = tone === 'danger' ? AlertTriangle : CheckCircle2;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          top: insets.top + S.sm,
          backgroundColor: bg,
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        },
      ]}
    >
      <Icon size={18} color="#fff" />
      <Text style={styles.toastText}>{shown}</Text>
    </Animated.View>
  );
};

// ---------- Basics ----------
export const Card: React.FC<{ style?: StyleProp<ViewStyle>; children: React.ReactNode; onPress?: () => void }> = ({
  style,
  children,
  onPress,
}) =>
  onPress ? (
    <ScalePress onPress={onPress} style={[styles.card, style]}>
      {children}
    </ScalePress>
  ) : (
    <View style={[styles.card, style]}>{children}</View>
  );

export const Button: React.FC<{
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}> = ({ title, onPress, variant = 'primary', icon, style, disabled }) => {
  const v = {
    primary: { bg: C.primary, fg: '#fff', border: C.primary },
    outline: { bg: 'transparent', fg: C.primary, border: C.primary },
    ghost: { bg: C.sage, fg: C.primary, border: C.sage },
    danger: { bg: '#FEF2F2', fg: C.danger, border: '#F6CFCC' },
  }[variant];
  return (
    <ScalePress
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Text style={[styles.btnText, { color: v.fg }]}>{title}</Text>
      {icon}
    </ScalePress>
  );
};

export const Input: React.FC<TextInputProps & { icon?: React.ReactNode; right?: React.ReactNode; label?: string }> = ({
  icon,
  right,
  label,
  style,
  ...props
}) => (
  <View style={{ marginBottom: S.md }}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={styles.input}>
      {icon}
      <TextInput placeholderTextColor={C.textSecondary} style={[styles.inputText, style]} {...props} />
      {right}
    </View>
  </View>
);

export const ProgressBar: React.FC<{ value: number; color?: string; height?: number }> = ({
  value,
  color = C.progress,
  height = 6,
}) => (
  <View style={{ height, backgroundColor: '#E8EEEA', borderRadius: height, overflow: 'hidden', flex: 1 }}>
    <View style={{ width: `${Math.min(100, Math.max(0, value))}%`, height, backgroundColor: color, borderRadius: height }} />
  </View>
);

export const StatusPill: React.FC<{ status: ContractStatus }> = ({ status }) => {
  const m = statusMeta[status];
  return (
    <View style={[styles.pill, { backgroundColor: m.bg }]}>
      <Text style={[styles.pillText, { color: m.fg }]}>{m.label}</Text>
    </View>
  );
};

export const Chip: React.FC<{ label: string; active?: boolean; onPress?: () => void }> = ({ label, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.chip, active && { backgroundColor: C.primary, borderColor: C.primary }]}>
    <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
  </Pressable>
);

export const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 44 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: C.gold,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.6)',
    }}
  >
    <Text style={{ color: C.primary, fontWeight: '800', fontSize: size * 0.4 }}>
      {name.trim().charAt(0).toUpperCase() || '?'}
    </Text>
  </View>
);

const iconMap: Record<IconKey, LucideIcon> = {
  briefcase: Briefcase,
  handshake: Handshake,
  gear: Settings,
  home: Home,
  shirt: Shirt,
  truck: Truck,
};

export const ContractIcon: React.FC<{ icon: IconKey; size?: number }> = ({ icon, size = 44 }) => {
  const I = iconMap[icon];
  return (
    <View style={{ width: size, height: size, borderRadius: R.md, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' }}>
      <I size={size * 0.5} color={C.primary} />
    </View>
  );
};

export const SectionTitle: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({
  title,
  action,
  onAction,
}) => (
  <View style={styles.sectionRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={styles.sectionAction}>{action} →</Text>
      </Pressable>
    ) : null}
  </View>
);

export const ScreenHeader: React.FC<{
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showMore?: boolean;
  onMore?: () => void;
}> = ({ title, onBack, right, showMore, onMore }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + S.sm }]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={styles.headerBtn}>
          <ChevronLeft size={24} color={C.text} />
        </Pressable>
      ) : (
        <View style={styles.headerBtn} />
      )}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.headerBtn, { alignItems: 'flex-end' }]}>
        {right ??
          (showMore ? (
            <Pressable onPress={onMore} hitSlop={10}>
              <MoreVertical size={20} color={C.text} />
            </Pressable>
          ) : null)}
      </View>
    </View>
  );
};

export const Empty: React.FC<{ text: string }> = ({ text }) => (
  <View style={{ paddingVertical: 48, alignItems: 'center', gap: S.md }}>
    <View style={styles.emptyIcon}>
      <Inbox size={28} color={C.emerald} />
    </View>
    <Text style={{ color: C.textSecondary, fontSize: 14, textAlign: 'center' }}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' },
  toast: {
    position: 'absolute',
    left: S.lg,
    right: S.lg,
    zIndex: 100,
    elevation: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderRadius: R.md,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  card: {
    backgroundColor: C.surface,
    borderRadius: R.lg,
    padding: S.lg,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  btn: {
    height: 50,
    borderRadius: R.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S.sm,
    paddingHorizontal: S.lg,
  },
  btnText: { fontSize: 15, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 6 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    height: 50,
    borderRadius: R.md,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    paddingHorizontal: S.lg,
  },
  inputText: { flex: 1, fontSize: 15, color: C.text, height: '100%' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: R.full },
  pillText: { fontSize: 11, fontWeight: '700' },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: R.full,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: C.text },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: S.xl,
    marginBottom: S.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.text },
  sectionAction: { fontSize: 13, fontWeight: '600', color: C.emerald },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.lg,
    paddingBottom: S.md,
    backgroundColor: C.ivory,
  },
  headerBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: C.text },
});

export const ui = styles;
