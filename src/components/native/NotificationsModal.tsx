import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../../theme';
import { X, Bell, AlertTriangle, CheckCircle2, Clock, Check } from 'lucide-react-native';
import { Contract } from '../../types';

interface NotificationsModalProps {
  onOpenContract: (contract: Contract) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onOpenContract }) => {
  const { 
    notifications, 
    isNotificationOpen, 
    setIsNotificationOpen, 
    markNotificationRead, 
    markAllNotificationsRead,
    contracts,
    t,
    language 
  } = useApp();

  if (!isNotificationOpen) return null;

  const handleItemPress = (contractId: string, notifId: string) => {
    markNotificationRead(notifId);
    const found = contracts.find((c) => c.id === contractId);
    if (found) {
      onOpenContract(found);
    }
    setIsNotificationOpen(false);
  };

  return (
    <Modal visible={isNotificationOpen} animationType="slide" transparent={false} onRequestClose={() => setIsNotificationOpen(false)}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setIsNotificationOpen(false)} style={styles.closeBtn}>
            <X size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.topBarTitleGroup}>
            <Text style={styles.topBarTitle}>{t('Notification Center', 'Ibyatanzweho Ubutumwa')}</Text>
            <Text style={styles.topBarSubtitle}>{t('Proposal Sec 5.3: Alerts & Reminders', 'Ubutumwa n iminsi ntarengwa')}</Text>
          </View>
          <TouchableOpacity onPress={markAllNotificationsRead} style={styles.markAllBtn}>
            <Text style={styles.markAllBtnText}>{t('Mark all', 'Byose')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => {
            const isRead = notif.isRead;
            const isAlert = notif.type === 'milestone_overdue' || notif.type === 'dispute_raised';
            const isSuccess = notif.type === 'completion_submitted';

            return (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifCard,
                  !isRead && styles.notifCardUnread,
                ]}
                onPress={() => handleItemPress(notif.contractId, notif.id)}
                activeOpacity={0.7}
              >
                {!isRead && <View style={styles.unreadDot} />}

                <View style={styles.notifCardContent}>
                  <View
                    style={[
                      styles.iconCircle,
                      isAlert ? styles.alertIconCircle : isSuccess ? styles.successIconCircle : styles.infoIconCircle,
                    ]}
                  >
                    {isAlert ? (
                      <AlertTriangle size={15} color={Colors.light.danger} />
                    ) : isSuccess ? (
                      <CheckCircle2 size={15} color={Colors.light.success} />
                    ) : (
                      <Clock size={15} color={Colors.light.primary} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifTitle}>
                      {language === 'rw' ? notif.titleRw : notif.title}
                    </Text>
                    <Text style={styles.notifMessage}>
                      {language === 'rw' ? notif.messageRw : notif.message}
                    </Text>
                    <View style={styles.notifFooter}>
                      <Text style={styles.notifContractTitle} numberOfLines={1}>
                        {notif.contractTitle}
                      </Text>
                      <Text style={styles.notifTimestamp}>{notif.timestamp}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeBtn: {
    padding: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardMuted,
  },
  topBarTitleGroup: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  topBarSubtitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  notifCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    position: 'relative',
    ...Shadows.card,
  },
  notifCardUnread: {
    backgroundColor: '#FAFDFB',
    borderColor: Colors.light.primaryLight,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
  },
  notifCardContent: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIconCircle: {
    backgroundColor: '#FEE2E2',
  },
  successIconCircle: {
    backgroundColor: '#ECFDF5',
  },
  infoIconCircle: {
    backgroundColor: Colors.light.primaryLight,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 15,
    marginBottom: 6,
  },
  notifFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifContractTitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    maxWidth: '70%',
  },
  notifTimestamp: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
});

