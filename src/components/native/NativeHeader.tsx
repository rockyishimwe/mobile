import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { Bell, ChevronDown, Check, Globe, Smartphone, Monitor, ShieldCheck, User } from 'lucide-react-native';
import { Role } from '../../types';

export const NativeHeader: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    t,
    unreadNotificationCount,
    setIsNotificationOpen,
    viewMode,
    toggleViewMode,
  } = useApp();

  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const roleLabels: Record<Role, { title: string; subtitle: string; tag: string }> = {
    worker: {
      title: 'Jean-Pierre Nsengimana',
      subtitle: t('Master Mason & Builder', 'Umutekinisiye / Umwubatsi'),
      tag: t('Worker', 'Umukozi'),
    },
    client: {
      title: 'Diane Uwera',
      subtitle: t('Property Owner & Client', 'Nyirubwite / Umukiriya'),
      tag: t('Client', 'Umukiriya'),
    },
    cooperative: {
      title: 'Kigali Artisans Coop',
      subtitle: t('SME / Cooperative Lead', 'Umuyobozi wa Koperative'),
      tag: t('Cooperative', 'Koperative'),
    },
  };

  const currentRole = roleLabels[role];

  return (
    <View style={styles.headerContainer}>
      {/* Top Row: Brand & Quick Action Controls */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoLetter}>I</Text>
          </View>
          <View style={styles.brandTextGroup}>
            <View style={styles.titleWithFlag}>
              <Text style={styles.brandTitle}>IZERE</Text>
              <View style={styles.countryTag}>
                <Text style={styles.countryText}>RW</Text>
              </View>
            </View>
            <Text style={styles.tagline}>
              {t('Clear contracts. Visible progress.', 'Amasezerano asobanutse. Umurimo.')}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Language Toggle Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setLanguage(language === 'en' ? 'rw' : 'en')}
            activeOpacity={0.7}
          >
            <Globe size={14} color={Colors.light.accent} />
            <Text style={styles.actionBtnText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Viewport Frame Toggle */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={toggleViewMode}
            activeOpacity={0.7}
          >
            {viewMode === 'mobile-frame' ? (
              <Monitor size={14} color="#FFFFFF" />
            ) : (
              <Smartphone size={14} color={Colors.light.accent} />
            )}
          </TouchableOpacity>

          {/* Notifications Bell */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.bellBtn]}
            onPress={() => setIsNotificationOpen(true)}
            activeOpacity={0.7}
          >
            <Bell size={15} color="#FFFFFF" />
            {unreadNotificationCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Switcher Pill */}
      <TouchableOpacity
        style={styles.roleCard}
        onPress={() => setRoleModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.roleAvatar}>
          <User size={15} color={Colors.light.accent} />
        </View>
        <View style={styles.roleInfo}>
          <View style={styles.roleTitleRow}>
            <Text style={styles.roleName} numberOfLines={1}>
              {currentRole.title}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{currentRole.tag}</Text>
            </View>
          </View>
          <Text style={styles.roleSubtitle} numberOfLines={1}>
            {currentRole.subtitle}
          </Text>
        </View>
        <ChevronDown size={16} color={Colors.light.primaryLight} style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      {/* Role Selection Modal */}
      <Modal
        visible={roleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRoleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRoleModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('Switch Demo Persona (Sec 4.1)', 'Guhindura Uruhare rwawe')}
              </Text>
              <Text style={styles.modalSubtitle}>
                {t('Simulate different workflows & permissions', 'Reba uko bikora ku nshingano zitandukanye')}
              </Text>
            </View>

            {(['worker', 'client', 'cooperative'] as Role[]).map((r) => {
              const info = roleLabels[r];
              const isSelected = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleOption,
                    isSelected && { backgroundColor: Colors.light.primaryLight, borderColor: Colors.light.primary },
                  ]}
                  onPress={() => {
                    setRole(r);
                    setRoleModalVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={[styles.optionTitle, isSelected && { color: Colors.light.primary, fontWeight: '700' }]}>
                        {info.title}
                      </Text>
                      <View style={[styles.roleBadge, { marginLeft: 6, backgroundColor: '#FFFFFF' }]}>
                        <Text style={[styles.roleBadgeText, { color: Colors.light.primary }]}>{info.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.optionSubtitle}>{info.subtitle}</Text>
                  </View>
                  {isSelected && <Check size={18} color={Colors.light.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.light.primary, // Deep Forest Green #123D32
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoLetter: {
    color: Colors.light.background,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.heading,
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  titleWithFlag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.heading,
    marginRight: 6,
  },
  countryTag: {
    backgroundColor: 'rgba(213, 168, 90, 0.25)', // Gold tinted
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  countryText: {
    color: Colors.light.accent,
    fontSize: 9,
    fontWeight: '700',
  },
  tagline: {
    color: '#B0C4B8',
    fontSize: 10,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 4,
  },
  bellBtn: {
    paddingHorizontal: 8,
    position: 'relative',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.md,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  roleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 6,
  },
  roleBadge: {
    backgroundColor: 'rgba(233, 242, 236, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  roleBadgeText: {
    color: Colors.light.primaryLight,
    fontSize: 9,
    fontWeight: '600',
  },
  roleSubtitle: {
    color: '#B0C4B8',
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 61, 50, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 18,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalHeader: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  modalSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  roleOption: {
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optionSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
});

