import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../theme';
import { NativeStatusBadge } from '../components/native/NativeStatusBadge';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Wallet,
  Scale
} from 'lucide-react-native';
import { Contract } from '../types';

interface DashboardScreenProps {
  onNavigateToTab: (tab: 'dashboard' | 'contracts' | 'tracker' | 'payments' | 'assistant') => void;
  onOpenContract: (contract: Contract) => void;
  onOpenCreateWizard: () => void;
  onOpenRemediesCalculator: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToTab,
  onOpenContract,
  onOpenCreateWizard,
  onOpenRemediesCalculator,
}) => {
  const { contracts, role, t } = useApp();

  const activeContracts = contracts.filter((c) => c.status === 'active');
  const pendingActions = contracts.filter(
    (c) => c.status === 'awaiting_confirmation' || c.stages.some((s) => s.status === 'in_review')
  );
  const overdueOrDisputed = contracts.filter(
    (c) => c.isDisputed || c.stages.some((s) => s.status === 'overdue')
  );

  const totalPortfolioValue = contracts.reduce((acc, c) => acc + c.totalAmountRwf, 0);
  const totalPaidValue = contracts.reduce(
    (acc, c) => acc + c.payments.reduce((pAcc, p) => pAcc + p.amountRwf, 0),
    0
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.greetingText}>
            {t('Muraho,', 'Muraho neza,')}
          </Text>
          <Text style={styles.welcomeName}>
            {role === 'worker' ? 'Jean-Pierre Nsengimana' : role === 'client' ? 'Diane Uwera' : 'Kigali Artisans Coop'}
          </Text>
          <Text style={styles.welcomeDescription}>
            {t(
              'Here is your live agreement portfolio and active milestones.',
              'Dore incamake y amasezerano yawe n intambwe z imirimo irimo gukorwa.'
            )}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newAgreementBtn}
          onPress={onOpenCreateWizard}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.newAgreementBtnText}>{t('New Agreement', 'Amasezerano Mashya')}</Text>
        </TouchableOpacity>
      </View>

      {/* Financial & Agreement Portfolio Overview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Portfolio Overview', 'Incamake y Amasezerano')}
        </Text>
        <Text style={styles.sectionTag}>
          {contracts.length} {t('Agreements', 'Amasezerano')}
        </Text>
      </View>

      <View style={styles.metricGrid}>
        {/* Metric 1: Total Value */}
        <View style={[styles.metricCard, { borderLeftColor: Colors.light.primary, borderLeftWidth: 4 }]}>
          <Text style={styles.metricLabel}>{t('Total Portfolio Value', 'Agaciro Kose')}</Text>
          <Text style={styles.metricValue}>
            RWF {(totalPortfolioValue / 1000000).toFixed(2)}M
          </Text>
          <Text style={styles.metricSubtext}>
            RWF {totalPaidValue.toLocaleString()} {t('collected', 'byishyuwe')}
          </Text>
        </View>

        {/* Metric 2: Active Contracts */}
        <View style={[styles.metricCard, { borderLeftColor: Colors.light.secondary, borderLeftWidth: 4 }]}>
          <Text style={styles.metricLabel}>{t('Active In Progress', 'Akora Ubu')}</Text>
          <Text style={[styles.metricValue, { color: Colors.light.secondary }]}>
            {activeContracts.length}
          </Text>
          <Text style={styles.metricSubtext}>
            {contracts.filter((c) => c.type === 'work_order').length} {t('work orders', 'inyandiko z akazi')}
          </Text>
        </View>

        {/* Metric 3: Needs Review */}
        <View style={[styles.metricCard, { borderLeftColor: Colors.light.accent, borderLeftWidth: 4 }]}>
          <Text style={styles.metricLabel}>{t('Pending Signatures', 'Ibitegereje Kwemezwa')}</Text>
          <Text style={[styles.metricValue, { color: Colors.light.warning }]}>
            {pendingActions.length}
          </Text>
          <Text style={styles.metricSubtext}>{t('Action required', 'Bisaba gusuzumwa')}</Text>
        </View>

        {/* Metric 4: Disputes / Overdue */}
        <View style={[styles.metricCard, { borderLeftColor: Colors.light.danger, borderLeftWidth: 4 }]}>
          <Text style={styles.metricLabel}>{t('Disputed / Late', 'Ibifite Ikibazo')}</Text>
          <Text style={[styles.metricValue, { color: Colors.light.danger }]}>
            {overdueOrDisputed.length}
          </Text>
          <Text style={styles.metricSubtext}>{t('Remedies active', 'Ibiciro bihagaritswe')}</Text>
        </View>
      </View>

      {/* Quick Action Shortcuts */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={onOpenCreateWizard}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: Colors.light.primaryLight }]}>
            <FileText size={18} color={Colors.light.primary} />
          </View>
          <Text style={styles.quickActionLabel}>{t('Create Contract', 'Kora Amasezerano')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => onNavigateToTab('tracker')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
            <CheckCircle2 size={18} color={Colors.light.success} />
          </View>
          <Text style={styles.quickActionLabel}>{t('Track Stages', 'Intambwe z Akazi')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => onNavigateToTab('payments')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FEF9EE' }]}>
            <Wallet size={18} color={Colors.light.accent} />
          </View>
          <Text style={styles.quickActionLabel}>{t('MoMo Payment', 'Kwishyura MoMo')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={onOpenRemediesCalculator}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Scale size={18} color={Colors.light.info} />
          </View>
          <Text style={styles.quickActionLabel}>{t('Delay Calculator', 'Kubara Ibihano')}</Text>
        </TouchableOpacity>
      </View>

      {/* Urgent Attention / Action Required Banner */}
      {overdueOrDisputed.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <AlertTriangle size={18} color={Colors.light.danger} style={{ marginRight: 8 }} />
            <Text style={styles.alertTitle}>
              {t('Overdue Work & Active Disputes (Sec 6.1)', 'Imirimo Yatinze & Impaka')}
            </Text>
          </View>
          <Text style={styles.alertText}>
            {t(
              'Contract #IZ-2026-004 has an overdue stage (6 days late). Deductions are paused under Rwanda fair remedy rules.',
              'Amasezerano #IZ-2026-004 afite icyiciro cyatinze iminsi 6. Ibiciro byo gutinda byahagaritswe by amaguru mashya.'
            )}
          </Text>
          <TouchableOpacity
            style={styles.alertActionBtn}
            onPress={onOpenRemediesCalculator}
            activeOpacity={0.7}
          >
            <Text style={styles.alertActionText}>{t('Open Fair Remedies Calculator', 'Fungura Imibare yo Gutinda')}</Text>
            <ArrowRight size={14} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Active Contracts List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('Active Agreements', 'Amasezerano Ariho Ubu')}
        </Text>
        <TouchableOpacity
          onPress={() => onNavigateToTab('contracts')}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>{t('View All', 'Reba Yose')}</Text>
          <ChevronRight size={14} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={{ gap: 12 }}>
        {contracts.slice(0, 3).map((contract) => {
          const completedCount = contract.stages.filter((s) => s.status === 'completed').length;
          const totalCount = contract.stages.length;
          const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <TouchableOpacity
              key={contract.id}
              style={styles.contractCard}
              onPress={() => onOpenContract(contract)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.contractIdPill}>
                  <Text style={styles.contractIdText}>{contract.id}</Text>
                </View>
                <NativeStatusBadge status={contract.status} size="sm" />
              </View>

              <Text style={styles.contractTitle} numberOfLines={2}>
                {contract.title}
              </Text>
              <Text style={styles.contractTitleRw} numberOfLines={1}>
                {contract.titleRw}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
                </View>
                <Text style={styles.progressText}>{progressPct}%</Text>
              </View>

              {/* Bottom Details */}
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.amountLabel}>{t('Agreed Total', 'Amafaranga Yose')}</Text>
                  <Text style={styles.amountValue}>
                    RWF {contract.totalAmountRwf.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.arrowCircle}>
                  <ArrowRight size={14} color={Colors.light.primary} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* AI Contract Assistant Teaser */}
      <TouchableOpacity
        style={styles.aiTeaserCard}
        onPress={() => onNavigateToTab('assistant')}
        activeOpacity={0.85}
      >
        <View style={styles.aiIconBadge}>
          <Sparkles size={20} color={Colors.light.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiTeaserTitle}>
            {t('Ask IZERE AI Assistant', 'Baza Ubufasha bwa AI')}
          </Text>
          <Text style={styles.aiTeaserText}>
            {t(
              'Grounded search over your contracts: check expired work, overdue jobs, or summarize version differences.',
              'Shakisha amakuru y amasezerano yawe, akazi katinze cyangwa impinduka z amasezerano.'
            )}
          </Text>
        </View>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Warm Ivory #F8F7F2
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeCard: {
    backgroundColor: Colors.light.surface, // White #FFFFFF
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  welcomeTextGroup: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
    marginVertical: 2,
  },
  welcomeDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  newAgreementBtn: {
    backgroundColor: Colors.light.primary, // Deep Forest Green #123D32
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  newAgreementBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
  },
  sectionTag: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  metricSubtext: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 10,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.danger,
    fontFamily: Typography.fontFamily.heading,
  },
  alertText: {
    fontSize: 11,
    color: Colors.light.text,
    lineHeight: 16,
    marginBottom: 8,
  },
  alertActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.danger,
  },
  contractCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contractIdPill: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  contractIdText: {
    fontSize: 10,
    color: Colors.light.primary,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 18,
    fontFamily: Typography.fontFamily.heading,
  },
  contractTitleRw: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.light.primaryLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: Radius.full,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  amountLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTeaserCard: {
    backgroundColor: Colors.light.primary, // Deep Forest Green
    borderRadius: Radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    ...Shadows.elevated,
  },
  aiIconBadge: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTeaserTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.heading,
  },
  aiTeaserText: {
    color: '#D1E0D7',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
});

