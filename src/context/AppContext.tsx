import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  Role, 
  Language, 
  Contract, 
  ContractStatus, 
  StageStatus, 
  AppNotification, 
  AIMessage,
  EvidenceItem,
  PaymentRecord
} from '../types';
import { INITIAL_CONTRACTS, INITIAL_NOTIFICATIONS, INITIAL_AI_MESSAGES } from '../data/mockData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, rw: string) => string;
  contracts: Contract[];
  activeContractId: string | null;
  setActiveContractId: (id: string | null) => void;
  activeContract: Contract | undefined;
  activeTab: 'contracts' | 'tracker' | 'payments' | 'remedies' | 'assistant';
  setActiveTab: (tab: 'contracts' | 'tracker' | 'payments' | 'remedies' | 'assistant') => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  confirmContract: (contractId: string, partyRole: 'contractor' | 'client') => void;
  updateContractStatus: (contractId: string, status: ContractStatus) => void;
  updateMilestoneStatus: (contractId: string, stageId: string, status: StageStatus) => void;
  addEvidenceToMilestone: (contractId: string, stageId: string, evidenceData: { title: string; description: string; fileType: 'image' | 'receipt' | 'document'; fileUrl: string }) => void;
  acceptDeliverable: (contractId: string, stageId: string) => void;
  requestRework: (contractId: string, stageId: string, reason: string) => void;
  raiseDispute: (contractId: string, reason: string) => void;
  resolveDispute: (contractId: string) => void;
  addPaymentRecord: (contractId: string, payment: { milestoneId?: string; milestoneTitle: string; amountRwf: number; provider: PaymentRecord['provider']; providerReference: string; receiptNote?: string }) => void;
  createContract: (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'versionHistory' | 'payments' | 'isDisputed'>) => string;
  aiMessages: AIMessage[];
  sendAIMessage: (prompt: string) => void;
  viewMode: 'mobile-frame' | 'responsive';
  toggleViewMode: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('worker');
  const [language, setLanguage] = useState<Language>('en');
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [activeContractId, setActiveContractId] = useState<string | null>('IZ-2026-001');
  const [activeTab, setActiveTab] = useState<'contracts' | 'tracker' | 'payments' | 'remedies' | 'assistant'>('contracts');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'responsive'>('mobile-frame');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const t = (en: string, rw: string) => (language === 'rw' ? rw : en);

  const activeContract = useMemo(() => {
    return contracts.find(c => c.id === activeContractId) || contracts[0];
  }, [contracts, activeContractId]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const confirmContract = (contractId: string, partyRole: 'contractor' | 'client') => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedParties = { ...c.parties };
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      if (partyRole === 'contractor') {
        updatedParties.contractor = { ...updatedParties.contractor, confirmed: true, confirmedAt: nowStr };
      } else {
        updatedParties.client = { ...updatedParties.client, confirmed: true, confirmedAt: nowStr };
      }

      // If both confirmed, transition to active
      const bothConfirmed = updatedParties.contractor.confirmed && updatedParties.client.confirmed;
      const newStatus: ContractStatus = bothConfirmed ? 'active' : 'awaiting_confirmation';

      return {
        ...c,
        parties: updatedParties,
        status: newStatus,
        updatedAt: new Date().toISOString().substring(0, 10)
      };
    }));
  };

  const updateContractStatus = (contractId: string, status: ContractStatus) => {
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status, updatedAt: new Date().toISOString().substring(0, 10) } : c));
  };

  const updateMilestoneStatus = (contractId: string, stageId: string, status: StageStatus) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const now = new Date().toISOString().substring(0, 10);
      const updatedStages = c.stages.map(stg => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          status,
          completedDate: status === 'completed' ? now : undefined
        };
      });
      return {
        ...c,
        stages: updatedStages,
        updatedAt: now
      };
    }));
  };

  const addEvidenceToMilestone = (
    contractId: string, 
    stageId: string, 
    evidenceData: { title: string; description: string; fileType: 'image' | 'receipt' | 'document'; fileUrl: string }
  ) => {
    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: evidenceData.title,
      description: evidenceData.description,
      fileType: evidenceData.fileType,
      fileUrl: evidenceData.fileUrl,
      uploadedBy: role === 'worker' ? 'Jean-Pierre Nsengimana' : 'Diane Uwera',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verifiedByClient: role === 'client'
    };

    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedStages = c.stages.map(stg => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          status: 'in_review' as StageStatus,
          evidenceList: [...stg.evidenceList, newEvidence]
        };
      });
      return {
        ...c,
        stages: updatedStages,
        updatedAt: new Date().toISOString().substring(0, 10)
      };
    }));
  };

  const acceptDeliverable = (contractId: string, stageId: string) => {
    updateMilestoneStatus(contractId, stageId, 'completed');
  };

  const requestRework = (contractId: string, stageId: string, reason: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedStages = c.stages.map(stg => {
        if (stg.id !== stageId) return stg;
        return {
          ...stg,
          status: 'in_progress' as StageStatus,
          description: `${stg.description} [Rework note: ${reason}]`
        };
      });
      return { ...c, stages: updatedStages };
    }));
  };

  const raiseDispute = (contractId: string, reason: string) => {
    const now = new Date().toISOString().substring(0, 10);
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        isDisputed: true,
        disputeReason: reason,
        disputeDate: now,
        status: 'disputed' as ContractStatus,
        updatedAt: now
      };
    }));

    // Add alert notification
    const newNotif: AppNotification = {
      id: `notif-disp-${Date.now()}`,
      type: 'dispute_raised',
      title: 'Dispute Raised - Deductions Paused',
      titleRw: 'Kutemeranya Byatangiye - Ibiciro Bihagaritswe',
      message: `Dispute logged on ${contractId}: "${reason}". Automated penalties are temporarily paused.`,
      messageRw: `Kutemeranya ku masezerano ${contractId}: "${reason}". Ibiciro byo gutinda byahagaritswe.`,
      contractId,
      contractTitle: activeContract?.title || 'Contract',
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resolveDispute = (contractId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        isDisputed: false,
        status: 'active' as ContractStatus,
        updatedAt: new Date().toISOString().substring(0, 10)
      };
    }));
  };

  const addPaymentRecord = (
    contractId: string, 
    payment: { milestoneId?: string; milestoneTitle: string; amountRwf: number; provider: PaymentRecord['provider']; providerReference: string; receiptNote?: string }
  ) => {
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      contractId,
      milestoneId: payment.milestoneId,
      milestoneTitle: payment.milestoneTitle,
      amountRwf: payment.amountRwf,
      provider: payment.provider,
      providerReference: payment.providerReference,
      status: 'provider_confirmed',
      reportedBy: role === 'worker' ? 'Contractor' : 'Client / Payer',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      confirmedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receiptNote: payment.receiptNote || 'Confirmed via digital reference matching'
    };

    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      return {
        ...c,
        payments: [...c.payments, newPayment],
        updatedAt: new Date().toISOString().substring(0, 10)
      };
    }));
  };

  const createContract = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'currentVersion' | 'versionHistory' | 'payments' | 'isDisputed'>): string => {
    const newId = `IZ-2026-00${contracts.length + 1}`;
    const now = new Date().toISOString().substring(0, 10);
    const newContract: Contract = {
      ...contractData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      currentVersion: 'v1.0',
      versionHistory: [
        {
          version: 'v1.0',
          changedBy: role === 'worker' ? contractData.parties.contractor.name : contractData.parties.client.name,
          changedAt: `${now} 10:00`,
          summary: 'Initial contract created from guided template.',
          changes: [],
          accepted: false
        }
      ],
      payments: [],
      isDisputed: false
    };

    setContracts(prev => [newContract, ...prev]);
    setActiveContractId(newId);
    return newId;
  };

  const sendAIMessage = (prompt: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: 'Just now'
    };

    // Grounded response generator adhering strictly to proposal records (Section 7)
    let replyText = '';
    let records: AIMessage['groundedRecords'] = [];
    let suggestedAction: AIMessage['suggestedAction'] = undefined;

    const lower = prompt.toLowerCase();

    if (lower.includes('expired') || lower.includes('unfinished')) {
      const matched = contracts.filter(c => c.status === 'expired' || c.stages.some(s => s.status === 'pending' && new Date(c.endDate) < new Date()));
      replyText = `Found ${matched.length} contract that expired with unfinished work. As required by audit rules, these records show the uncompleted stages and last active milestone:`;
      records = matched.map(m => ({
        contractId: m.id,
        contractTitle: m.title,
        detail: `Expired on ${m.endDate}. Pending: Stage 2 "Timber Framework & Corrugated Iron Roofing". RWF 550,000 remaining.`,
        status: m.status,
        clauseReference: 'Clause 8.1 - Natural Expiry vs Work State'
      }));
      suggestedAction = {
        label: 'Open Expired Contract #IZ-2026-005',
        contractId: 'IZ-2026-005'
      };
    } else if (lower.includes('overdue') || lower.includes('this week') || lower.includes('late')) {
      const overdueList = contracts.flatMap(c => 
        c.stages
          .filter(s => s.status === 'overdue' || (s.daysOverdue && s.daysOverdue > 0))
          .map(s => ({ contract: c, stage: s }))
      );
      replyText = `Currently tracking ${overdueList.length} overdue work stage across your portfolio. Overdue remedies and fair delay calculations are displayed below:`;
      records = overdueList.map(item => ({
        contractId: item.contract.id,
        contractTitle: item.contract.title,
        detail: `Stage "${item.stage.name}" is ${item.stage.daysOverdue || 6} days overdue (Due ${item.stage.targetDate}). Responsible: ${item.stage.assignedTo}.`,
        status: item.contract.status,
        clauseReference: 'Delay clause: 2-day grace period, 1%/day capped at 5%'
      }));
      suggestedAction = {
        label: 'View Overdue Contract #IZ-2026-004',
        contractId: 'IZ-2026-004'
      };
    } else if (lower.includes('framework') || lower.includes('expire next month')) {
      const frameworks = contracts.filter(c => c.type === 'framework');
      replyText = `Found ${frameworks.length} Framework Agreement active in your account. Separate work orders linked to it remain distinct legal records:`;
      records = frameworks.map(f => ({
        contractId: f.id,
        contractTitle: f.title,
        detail: `Valid until ${f.endDate}. 4 Quarterly milestones scheduled. 1 active child Work Order (#IZ-2026-WO-01).`,
        status: f.status,
        clauseReference: 'Inheritance Rule: Child work orders inherit rate cards'
      }));
      suggestedAction = {
        label: 'View Framework Agreement',
        contractId: 'IZ-2026-002'
      };
    } else if (lower.includes('summarise') || lower.includes('changes') || lower.includes('version')) {
      const target = activeContract || contracts[0];
      replyText = `Version Summary for ${target.id} ("${target.title}"): \n\n• v1.0 created initial single lump-sum draft.\n• v1.1 client requested 3 milestone payments (RWF 400k, 500k, 300k) & 2-day weather grace period.\n• v1.2 contractor attached certified terracotta materials guarantee and confirmed.\n\nAll changes preserve audit author and timestamps.`;
      records = [
        {
          contractId: target.id,
          contractTitle: target.title,
          detail: `Current Version: ${target.currentVersion} (Mutually Confirmed). Total amount: RWF ${target.totalAmountRwf.toLocaleString()}.`,
          status: target.status,
          clauseReference: 'Version History Audit Trail'
        }
      ];
      suggestedAction = {
        label: 'Inspect Version Diff History',
        contractId: target.id
      };
    } else if (lower.includes('extension') || lower.includes('request')) {
      replyText = `To request an extension:\n1. Open the Work-Stage Tracker for your contract.\n2. Tap the specific milestone.\n3. Choose "Propose Date Extension" with reason and new target date.\n4. Both parties must digitally confirm before dates are updated. AI will never silently modify agreement terms.`;
      records = [
        {
          contractId: activeContract?.id || 'IZ-2026-001',
          contractTitle: activeContract?.title || 'Contract',
          detail: 'Safe Extension Workflow: Requires reason logging, party approval, and audit recording.',
          status: activeContract?.status || 'active',
          clauseReference: 'Proposal Section 6.1 & 7.2 Human Authorization Rule'
        }
      ];
    } else {
      replyText = `I searched your authorized contract database for "${prompt}".\n\nYour portfolio holds ${contracts.length} contracts: 3 Short-Term, 1 Framework Master, and 1 linked Work Order across Kigali. Total portfolio value is RWF ${contracts.reduce((acc, c) => acc + c.totalAmountRwf, 0).toLocaleString()}.`;
      records = contracts.slice(0, 3).map(c => ({
        contractId: c.id,
        contractTitle: c.title,
        detail: `Status: ${c.status} | Value: RWF ${c.totalAmountRwf.toLocaleString()} | Due: ${c.endDate}`,
        status: c.status
      }));
    }

    const assistantMsg: AIMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: 'Just now',
      groundedRecords: records,
      suggestedAction
    };

    setAiMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'mobile-frame' ? 'responsive' : 'mobile-frame');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        contracts,
        activeContractId,
        setActiveContractId,
        activeContract,
        activeTab,
        setActiveTab,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        confirmContract,
        updateContractStatus,
        updateMilestoneStatus,
        addEvidenceToMilestone,
        acceptDeliverable,
        requestRework,
        raiseDispute,
        resolveDispute,
        addPaymentRecord,
        createContract,
        aiMessages,
        sendAIMessage,
        viewMode,
        toggleViewMode,
        isNotificationOpen,
        setIsNotificationOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

