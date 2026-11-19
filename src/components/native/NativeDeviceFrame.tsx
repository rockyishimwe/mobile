import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Typography, Shadows } from '../../theme';
import { Wifi, BatteryMedium, Signal, Monitor, Smartphone } from 'lucide-react-native';

interface NativeDeviceFrameProps {
  children: React.ReactNode;
}

export const NativeDeviceFrame: React.FC<NativeDeviceFrameProps> = ({ children }) => {
  const { viewMode, toggleViewMode, t } = useApp();

  if (viewMode === 'responsive') {
    return (
      <View style={styles.responsiveContainer}>
        <View style={styles.responsiveWrapper}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      {/* Top Demo Bar */}
      <View style={styles.demoBar}>
        <View style={styles.demoBadgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.demoBrandText}>IZERE React Native Mobile</Text>
          <View style={styles.fintechTag}>
            <Text style={styles.fintechTagText}>Deep Forest & Warm Ivory</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.toggleViewBtn}
          onPress={toggleViewMode}
          activeOpacity={0.7}
        >
          <Monitor size={12} color={Colors.light.textSecondary} />
          <Text style={styles.toggleViewText}>{t('Full Width', 'Ubugari bwose')}</Text>
        </TouchableOpacity>
      </View>

      {/* Realistic Smartphone Mockup Frame */}
      <View style={styles.phoneFrame}>
        {/* iOS-style Status Bar & Dynamic Island */}
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>09:41</Text>
          
          <View style={styles.dynamicIsland}>
            <View style={styles.cameraLens} />
            <View style={styles.indicatorLight} />
          </View>

          <View style={styles.statusIcons}>
            <Signal size={12} color="#FFFFFF" />
            <Wifi size={12} color="#FFFFFF" />
            <BatteryMedium size={14} color={Colors.light.accent} />
          </View>
        </View>

        {/* Inner App Screen View */}
        <View style={styles.screenInner}>
          {children}
        </View>

        {/* Bottom Home Indicator Bar */}
        <View style={styles.homeBarArea}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    minHeight: '100vh' as any,
    backgroundColor: '#0D211B', // Dark forest background ambiance
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  demoBar: {
    width: '100%',
    maxWidth: 410,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  demoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.light.accent,
  },
  demoBrandText: {
    color: '#E9F2EC',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.heading,
  },
  fintechTag: {
    backgroundColor: 'rgba(213, 168, 90, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(213, 168, 90, 0.4)',
  },
  fintechTagText: {
    color: Colors.light.accent,
    fontSize: 9,
    fontWeight: '700',
  },
  toggleViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    gap: 4,
  },
  toggleViewText: {
    color: '#E9F2EC',
    fontSize: 10,
    fontWeight: '600',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 410,
    height: '92vh' as any,
    maxHeight: 840,
    backgroundColor: Colors.light.background, // Warm Ivory #F8F7F2
    borderRadius: 44,
    borderWidth: 9,
    borderColor: '#18332A',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85)' as any,
  },
  statusBar: {
    backgroundColor: Colors.light.primary, // Deep Forest Green #123D32
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.heading,
  },
  dynamicIsland: {
    width: 90,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0B231D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E3B32',
  },
  indicatorLight: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.light.accent,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  screenInner: {
    flex: 1,
    backgroundColor: Colors.light.background,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  homeBarArea: {
    backgroundColor: Colors.light.surface,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  homeIndicator: {
    width: 120,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.4,
  },
  responsiveContainer: {
    minHeight: '100vh' as any,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
  },
  responsiveWrapper: {
    width: '100%',
    maxWidth: 480,
    minHeight: '100vh' as any,
    backgroundColor: Colors.light.background,
    display: 'flex',
    flexDirection: 'column',
  },
});

