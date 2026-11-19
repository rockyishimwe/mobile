import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Radius, Spacing, Typography, Shadows } from '../theme';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Bot, 
  User, 
  Layers,
  ChevronRight
} from 'lucide-react-native';
import { Contract } from '../types';

interface AIAssistantScreenProps {
  onOpenContract: (contract: Contract) => void;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ onOpenContract }) => {
  const { aiMessages, sendAIMessage, contracts, t } = useApp();
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    {
      label: t('Expired with unfinished work', 'Ibyarangiye bitarangiye'),
      query: 'Show contracts that expired with unfinished work.',
    },
    {
      label: t('Jobs overdue this week', 'Imirimo yatinze muri iki cyumweru'),
      query: 'Which jobs are overdue this week?',
    },
    {
      label: t('Frameworks expiring soon', 'Amasezerano rusange ari hafi kurangira'),
      query: 'Which framework agreements expire next month?',
    },
    {
      label: t('Summarise contract changes', 'Incamake y impinduka z amasezerano'),
      query: 'Summarise the changes to this contract.',
    },
    {
      label: t('How to request extension?', 'Ndasaba nte kongera igihe cy akazi?'),
      query: 'How do I request an extension?',
    },
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendAIMessage(inputText.trim());
    setInputText('');
  };

  const handleCitationClick = (contractId: string) => {
    const found = contracts.find((c) => c.id === contractId);
    if (found) {
      onOpenContract(found);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top AI Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiIconBadge}>
            <Sparkles size={16} color={Colors.light.accent} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('IZERE AI Contract Assistant', 'Ubufasha bwa AI mu Masezerano')}</Text>
            <Text style={styles.headerSubtitle}>{t('Proposal Sec 7: Bounded retrieval over authorized records', 'Isubiza gusa bishingiye ku nyandiko ziri muri sisitemu')}</Text>
          </View>
        </View>

        {/* AI Acceptance Principle Note */}
        <View style={styles.principleNote}>
          <ShieldCheck size={13} color={Colors.light.primary} style={{ marginRight: 6, marginTop: 1 }} />
          <Text style={styles.principleText}>
            {t(
              'Acceptance Principle: Strictly reproducible from verified records. AI cannot alter contracts, determine liability, or execute payments.',
              'Itegeko: Ibisubizo bishingiye ku masezerano yawe. AI ntiyemerewe guhindura amasezerano cyangwa kwishyura.'
            )}
          </Text>
        </View>
      </View>

      {/* Suggested Query Chips (Proposal Sec 7.1) */}
      <View style={styles.chipsSection}>
        <Text style={styles.chipsSectionLabel}>
          {t('Frequently Asked Queries (Proposal Sec 7.1):', 'Ibibazo Byerekeranye n Ingingo ya 7.1:')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {quickPrompts.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.chipBtn}
              onPress={() => sendAIMessage(item.query)}
              activeOpacity={0.7}
            >
              <Sparkles size={11} color={Colors.light.primary} style={{ marginRight: 4 }} />
              <Text style={styles.chipBtnText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages Stream */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {aiMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser && { justifyContent: 'flex-end' },
              ]}
            >
              {!isUser && (
                <View style={styles.assistantAvatar}>
                  <Bot size={14} color={Colors.light.primary} />
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser && { color: '#FFFFFF' },
                  ]}
                >
                  {msg.text}
                </Text>

                {/* Grounded Records & Citations (Proposal Sec 7.2 Traceability) */}
                {msg.groundedRecords && msg.groundedRecords.length > 0 && (
                  <View style={styles.citationsBox}>
                    <Text style={styles.citationsLabel}>{t('CITED AGREEMENT RECORDS:', 'INYANDIKO ZASHINGIWEHO:')}</Text>
                    {msg.groundedRecords.map((rec, rIdx) => (
                      <TouchableOpacity
                        key={rIdx}
                        style={styles.citationCard}
                        onPress={() => handleCitationClick(rec.contractId)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.citationHeader}>
                          <Text style={styles.citationId}>{rec.contractId}</Text>
                          <Text style={styles.citationStatus}>{rec.status}</Text>
                        </View>
                        <Text style={styles.citationTitle} numberOfLines={1}>{rec.contractTitle}</Text>
                        <Text style={styles.citationDetail}>{rec.detail}</Text>
                        {rec.clauseReference && (
                          <Text style={styles.clauseRefText}>• {rec.clauseReference}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Suggested One-Tap Action */}
                {msg.suggestedAction && (
                  <TouchableOpacity
                    style={styles.actionPill}
                    onPress={() => handleCitationClick(msg.suggestedAction!.contractId)}
                  >
                    <Text style={styles.actionPillText}>{msg.suggestedAction.label}</Text>
                    <ArrowRight size={12} color={Colors.light.primary} />
                  </TouchableOpacity>
                )}

                <Text
                  style={[
                    styles.timeText,
                    isUser && { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>

              {isUser && (
                <View style={styles.userAvatar}>
                  <User size={14} color="#FFFFFF" />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.chatInput}
          placeholder={t('Ask about contracts, late jobs, clauses...', 'Baza ikibazo ku masezerano yawe...')}
          placeholderTextColor={Colors.light.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
          disabled={!inputText.trim()}
          onPress={handleSend}
        >
          <Send size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerBox: {
    backgroundColor: Colors.light.surface,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  aiIconBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.primary,
    fontFamily: Typography.fontFamily.heading,
  },
  headerSubtitle: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  principleNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primaryLight,
    padding: 8,
    borderRadius: Radius.sm,
  },
  principleText: {
    fontSize: 9,
    color: Colors.light.primary,
    lineHeight: 13,
    flex: 1,
  },
  chipsSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  chipsSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardMuted,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chipBtnText: {
    fontSize: 10,
    color: Colors.light.text,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  assistantAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.primaryLight,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  userAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    padding: 12,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderTopRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.card,
  },
  messageText: {
    fontSize: 12,
    color: Colors.light.text,
    lineHeight: 17,
  },
  citationsBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 6,
  },
  citationsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  citationCard: {
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  citationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  citationId: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    fontFamily: 'monospace',
  },
  citationStatus: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  citationTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
  },
  citationDetail: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  clauseRefText: {
    fontSize: 9,
    color: Colors.light.secondary,
    fontStyle: 'italic',
    marginTop: 3,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    marginTop: 8,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  timeText: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.light.cardMuted,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sendBtn: {
    backgroundColor: Colors.light.primary,
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

