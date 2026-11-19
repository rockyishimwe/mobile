import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Typography } from '../../theme';
import { LayoutDashboard, FileText, CheckCircle2, Wallet, Sparkles } from 'lucide-react-native';

export type TabId = 'dashboard' | 'contracts' | 'tracker' | 'payments' | 'assistant';

interface NativeTabBarProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const NativeTabBar: React.FC<NativeTabBarProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useApp();

  const tabs: { id: TabId; label: string; icon: any; isSpecial?: boolean }[] = [
    {
      id: 'dashboard',
      label: t('Overview', 'Incamake'),
      icon: LayoutDashboard,
    },
    {
      id: 'contracts',
      label: t('Contracts', 'Amasezerano'),
      icon: FileText,
    },
    {
      id: 'tracker',
      label: t('Progress', 'Intambwe'),
      icon: CheckCircle2,
    },
    {
      id: 'payments',
      label: t('Payments', 'Kwishyura'),
      icon: Wallet,
    },
    {
      id: 'assistant',
      label: t('AI Help', 'Ubufasha AI'),
      icon: Sparkles,
      isSpecial: true,
    },
  ];

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarContent}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isActive && styles.activeTabItem,
              ]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  isActive && styles.activeIconWrap,
                ]}
              >
                <IconComponent
                  size={20}
                  color={isActive ? Colors.light.primary : Colors.light.textSecondary}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {tab.isSpecial && !isActive && (
                  <View style={styles.aiGlowDot} />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? Colors.light.primary : Colors.light.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.light.surface, // White #FFFFFF
    borderTopWidth: 1,
    borderTopColor: Colors.light.border, // Soft Gray #E5E9E5
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
    minWidth: 58,
  },
  activeTabItem: {
    // Subtle active container
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    position: 'relative',
  },
  activeIconWrap: {
    backgroundColor: Colors.light.primaryLight, // Sage Green #E9F2EC
  },
  aiGlowDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.accent, // Warm Gold
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: Typography.fontFamily.body,
  },
});

