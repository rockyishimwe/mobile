import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../theme';
import { NativeStatusBadge } from '../components/native/NativeStatusBadge';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Layers, 
  ArrowRight, 
  AlertTriangle,
  FileText,
  User
} from 'lucide-react-native';
import { Contract, ContractType, ContractStatus } from '../types';

interface ContractsScreenProps {
  onOpenContract: (contract: Contract) => void;
  onOpenCreateWizard: () => void;
}

export const ContractsScreen: React.FC<ContractsScreenProps> = ({
  onOpenContract,
  onOpenCreateWizard,
}) => {
  const { contracts, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContractType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.titleRw.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case 'short_term':
        return t('Short-Term', 'Igihe Gito');
      case 'framework':
        return t('Framework Master', 'Amasezerano Rusange');
      case 'work_order':
        return t('Work Order', 'Urwandiko rw Akazi');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <View style={styles.topFilterSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('Search contracts, locations, IDs...', 'Shakisha amasezerano, aho aherereye...')}
            placeholderTextColor={Colors.light.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Contract Type Tabs (Proposal §4.2 & §4.3) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeTabsScroll}
        >
          {[
            { id: 'all', label: t('All Agreements', 'Byose') },
            { id: 'short_term', label: t('Short-Term (4.2)', 'Igihe Gito') },
            { id: 'framework', label: t('Framework (4.3)', 'Amasezerano Rusange') },
            { id: 'work_order', label: t('Work Orders', 'Inyandiko z Akazi') },
          ].map((tab) => {
            const isSelected = typeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.typeTab,
                  isSelected && styles.typeTabActive,
                ]}
                onPress={() => setTypeFilter(tab.id as any)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeTabText,
                    isSelected && styles.typeTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Status Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusChipsScroll}
        >
          {(['all', 'active', 'awaiting_confirmation', 'disputed', 'expired'] as const).map((st) => {
            const isSelected = statusFilter === st;
            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.statusChip,
                  isSelected && styles.statusChipActive,
                ]}
                onPress={() => setStatusFilter(st)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    isSelected && styles.statusChipTextActive,
                  ]}
                >
                  {st === 'all' ? t('All Statuses', 'Imiterere Yose') : st.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Contracts List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listHeaderRow}>
          <Text style={styles.resultCountText}>
            {filteredContracts.length} {t('agreements found', 'yabonetse')}
          </Text>
          <TouchableOpacity
            style={styles.addContractHeaderBtn}
            onPress={onOpenCreateWizard}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.addContractHeaderBtnText}>{t('New Contract', 'Gukora Amashya')}</Text>
          </TouchableOpacity>
        </View>

        {filteredContracts.length === 0 ? (
          <View style={styles.emptyCard}>
            <FileText size={32} color={Colors.light.textSecondary} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>
              {t('No agreements match this search', 'Nta masezerano ahuye n ibyo mushakishije')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('Try clearing your search query or create a new contract.', 'Hindura amashakiro cyangwa ukore amasezerano mashya.')}
            </Text>
          </View>
        ) : (
          filteredContracts.map((contract) => {
            const completedCount = contract.stages.filter((s) => s.status === 'completed').length;
            const totalCount = contract.stages.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <TouchableOpacity
                key={contract.id}
                style={[
                  styles.contractCard,
                  contract.isDisputed && styles.disputedCard,
                ]}
                onPress={() => onOpenContract(contract)}
                activeOpacity={0.8}
              >
                {/* Header row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.idAndTypeGroup}>
                    <View style={styles.idPill}>
                      <Text style={styles.idText}>{contract.id}</Text>
                    </View>
                    <View style={styles.typePill}>
                      <Text style={styles.typeText}>{getContractTypeLabel(contract.type)}</Text>
                    </View>
                    {contract.type === 'work_order' && contract.frameworkAgreementId && (
                      <View style={styles.frameworkBadge}>
                        <Layers size={10} color={Colors.light.info} style={{ marginRight: 3 }} />
                        <Text style={styles.frameworkBadgeText}>{t('FW Linked', 'Yometse')}</Text>
                      </View>
                    )}
                  </View>
                  <NativeStatusBadge status={contract.status} size="sm" />
                </View>

                {/* Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {contract.title}
                </Text>
                <Text style={styles.cardTitleRw} numberOfLines={1}>
                  {contract.titleRw}
                </Text>

                {/* Scope Preview */}
                <Text style={styles.scopePreview} numberOfLines={2}>
                  {contract.scope}
                </Text>

                {/* Parties row */}
                <View style={styles.partiesRow}>
                  <View style={styles.partyItem}>
                    <User size={12} color={Colors.light.secondary} style={{ marginRight: 4 }} />
                    <Text style={styles.partyName} numberOfLines={1}>
                      {contract.parties.contractor.name}
                    </Text>
                  </View>
                  <Text style={styles.partySeparator}>↔</Text>
                  <View style={styles.partyItem}>
                    <User size={12} color={Colors.light.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.partyName} numberOfLines={1}>
                      {contract.parties.client.name}
                    </Text>
                  </View>
                </View>

                {/* Location & Dates */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color={Colors.light.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.metaText} numberOfLines={1}>{contract.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Calendar size={12} color={Colors.light.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.metaText}>{contract.endDate}</Text>
                  </View>
                </View>

                {/* Work Stages Progress */}
                <View style={styles.stagesProgressBox}>
                  <View style={styles.stagesProgressHeader}>
                    <Text style={styles.stagesLabel}>{t('Work Progress', 'Intambwe z Umurimo')}</Text>
                    <Text style={styles.stagesPercent}>
                      {completedCount}/{totalCount} ({progressPct}%)
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
                  </View>
                </View>

                {/* Card Footer: Total Price & Tap CTA */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.footerPriceLabel}>{t('Agreed Contract Value', 'Agaciro k Amasezerano')}</Text>
                    <Text style={styles.footerPriceValue}>
                      RWF {contract.totalAmountRwf.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.viewDetailBtn}>
                    <Text style={styles.viewDetailBtnText}>{t('View Details', 'Reba')}</Text>
                    <ArrowRight size={14} color={Colors.light.primary} />
                  </View>
                </View>

                {/* Active Dispute Note */}
                {contract.isDisputed && (
                  <View style={styles.disputeBanner}>
                    <AlertTriangle size={13} color={Colors.light.danger} style={{ marginRight: 6 }} />
                    <Text style={styles.disputeBannerText} numberOfLines={2}>
                      <strong>{t('Dispute Active:', 'Kutemeranya:')}</strong> {contract.disputeReason}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topFilterSection: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: Colors.light.text,
    padding: 0,
  },
  typeTabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 6,
  },
  typeTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.light.cardMuted,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  typeTabActive: {
    backgroundColor: Colors.light.primary, // Deep Forest Green #123D32
    borderColor: Colors.light.primary,
  },
  typeTabText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  typeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusChipsScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statusChipActive: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  statusChipText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  statusChipTextActive: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 50,
    gap: 14,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  resultCountText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  addContractHeaderBtn: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    gap: 4,
  },
  addContractHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: Typography.fontFamily.heading,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  contractCard: {
    backgroundColor: Colors.light.surface, // White #FFFFFF
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  disputedCard: {
    borderColor: Colors.light.danger,
    backgroundColor: '#FFFBFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idAndTypeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  idPill: {
    backgroundColor: Colors.light.cardMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'monospace',
  },
  typePill: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  frameworkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  frameworkBadgeText: {
    fontSize: 9,
    color: Colors.light.info,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 20,
    fontFamily: Typography.fontFamily.heading,
  },
  cardTitleRw: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
    marginBottom: 8,
  },
  scopePreview: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
    backgroundColor: Colors.light.cardMuted,
    padding: 8,
    borderRadius: Radius.sm,
    marginBottom: 10,
  },
  partiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FAFBF9',
    padding: 6,
    borderRadius: Radius.sm,
  },
  partyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partyName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
  },
  partySeparator: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginHorizontal: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '50%',
  },
  metaText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  stagesProgressBox: {
    marginBottom: 12,
  },
  stagesProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stagesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  stagesPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: Radius.full,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  footerPriceLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  footerPriceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  disputeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: Radius.sm,
    marginTop: 10,
  },
  disputeBannerText: {
    fontSize: 10,
    color: Colors.light.danger,
    lineHeight: 14,
    flex: 1,
  },
});

