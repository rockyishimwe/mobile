import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusPalette, Radius } from '../../theme';
import { ContractStatus, StageStatus } from '../../types';

interface NativeStatusBadgeProps {
  status: ContractStatus | StageStatus;
  size?: 'sm' | 'md';
}

export const NativeStatusBadge: React.FC<NativeStatusBadgeProps> = ({ status, size = 'md' }) => {
  const palette = StatusPalette[status as keyof typeof StatusPalette] || StatusPalette.draft;

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 10,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: palette.text }]} />
      <Text
        style={[
          styles.text,
          {
            color: palette.text,
            fontSize: isSmall ? 10 : 11,
          },
        ]}
      >
        {palette.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

