import React, { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import { C, S } from '../theme';
import { Button, Imigongo, Logo, Wordmark } from '../ui';
import { useStore } from '../store';

const slides = [
  { title: 'IZERE', body: 'Manage contracts, track work,\nand get paid with confidence.' },
  { title: 'Visible progress', body: 'Every milestone backed by photos,\nreceipts and dates both sides can see.' },
  { title: 'Accountable work', body: 'Deadline alerts, fair delay rules and\nMobile Money payment references.' },
];

/** Illustrated Kigali hills skyline. */
const Hero: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#BFDDEA" />
        <Stop offset="1" stopColor="#EAF3EE" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="400" height="300" fill="url(#sky)" />
    <Circle cx="320" cy="60" r="22" fill="#F6E3B4" />
    <Path d="M0 170 Q60 120 120 150 T240 135 T400 150 V300 H0 Z" fill="#8FB8A0" />
    {/* tower */}
    <Path d="M196 40 L200 20 L204 40 Z" fill="#355A4C" />
    <Rect x="196" y="40" width="8" height="110" fill="#355A4C" />
    <Rect x="188" y="70" width="24" height="10" rx="3" fill="#355A4C" />
    <Rect x="190" y="95" width="20" height="8" rx="3" fill="#355A4C" />
    {/* buildings */}
    {[40, 70, 100, 250, 280, 310, 340].map((x, i) => (
      <Rect key={x} x={x} y={150 - (i % 3) * 14 - 10} width="22" height={40 + (i % 3) * 14} fill="#E9EEE9" stroke="#C9D6CE" />
    ))}
    <Path d="M0 200 Q80 160 170 190 T320 180 T400 190 V300 H0 Z" fill="#5E9B7B" />
    <Path d="M0 240 Q100 205 200 232 T400 225 V300 H0 Z" fill="#397A61" />
    <Path d="M0 300 Q200 230 400 300 Z" fill="#F8F7F2" />
  </Svg>
);

export const OnboardingScreen: React.FC = () => {
  const { setAuthStage } = useStore();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const ref = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const heroH = Math.min(height * 0.42, 360);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));

  const next = () => {
    if (page < slides.length - 1) {
      ref.current?.scrollTo({ x: width * (page + 1), animated: true });
      setPage(page + 1);
    } else setAuthStage('signUp');
  };

  return (
    <View style={styles.root}>
      <Hero width={width} height={heroH + insets.top} />
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={{ flexGrow: 0 }}
      >
        {slides.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Logo size={64} />
            {i === 0 ? <Wordmark size={36} /> : <Text style={styles.title}>{s.title}</Text>}
            <Text style={styles.body}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title={page < slides.length - 1 ? 'Next' : 'Get Started'}
          onPress={next}
          icon={<ArrowRight size={18} color="#fff" />}
        />
        <Button title="Sign In" variant="outline" onPress={() => setAuthStage('signIn')} />
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: insets.bottom }}>
        <Imigongo height={30} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.ivory },
  slide: { alignItems: 'center', paddingHorizontal: S.xl, paddingTop: S.sm, gap: S.sm },
  title: { fontSize: 28, fontWeight: '800', color: C.primary },
  body: { fontSize: 15, color: C.text, textAlign: 'center', lineHeight: 22, marginTop: S.xs },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: S.lg },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#C9D3CD' },
  dotActive: { backgroundColor: C.primary, width: 18 },
  actions: { paddingHorizontal: S.xl, gap: S.md },
});
