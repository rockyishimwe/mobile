export type Role = 'worker' | 'client' | 'cooperative';

export type Language = 'en' | 'rw';

export type ContractType = 'short_term' | 'framework' | 'work_order';

export type ContractStatus = 
  | 'draft' 
  | 'in_review' 
  | 'awaiting_confirmation' 
  | 'active' 
  | 'awaiting_acceptance' 
  | 'completed' 
  | 'disputed' 
  | 'expired';

export type StageStatus = 'pending' | 'in_progress' | 'in_review' | 'completed' | 'overdue';

export interface Party {
  id: string;
  name: string;
  role: 'contractor' | 'client' | 'manager';
  phone: string;
  nationalIdOrTIN?: string;
  organization?: string;
  avatar?: string;
  confirmed: boolean;
  confirmedAt?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  fileType: 'image' | 'document' | 'receipt';
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  verifiedByClient?: boolean;
}

export interface MilestoneStage {
  id: string;
  name: string;
  nameRw: string;
  description: string;
  order: number;
  status: StageStatus;
  targetDate: string;
  completedDate?: string;
  assignedTo: string;
  amountRwf: number;
  evidenceRequired: boolean;
  evidenceList: EvidenceItem[];
  daysOverdue?: number;
}

export interface DelayClauseConfig {
  hasDelayClause: boolean;
  gracePeriodDays: number;
  dailyPenaltyPercent: number; // e.g. 1%
  maxPenaltyPercent: number; // e.g. 5%
  clauseText: string;
  humanReviewRequired: boolean;
  disputePauseSupported: boolean;
}

export interface VersionChange {
  version: string;
  changedBy: string;
  changedAt: string;
  summary: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  accepted: boolean;
}

export interface PaymentRecord {
  id: string;
  contractId: string;
  milestoneId?: string;
  milestoneTitle: string;
  amountRwf: number;
  provider: 'MTN Mobile Money' | 'Airtel Money' | 'Bank of Kigali' | 'I&M Bank';
  providerReference: string;
  status: 'user_reported' | 'provider_confirmed' | 'pending_verification';
  reportedBy: string;
  reportedAt: string;
  confirmedAt?: string;
  receiptNote?: string;
}

export interface Contract {
  id: string;
  title: string;
  titleRw: string;
  type: ContractType;
  frameworkAgreementId?: string;
  frameworkTitle?: string;
  status: ContractStatus;
  category: 'construction' | 'tailoring' | 'digital' | 'delivery' | 'maintenance';
  scope: string;
  scopeRw: string;
  location: string;
  totalAmountRwf: number;
  materialsProvidedBy: 'client' | 'contractor' | 'shared';
  startDate: string;
  endDate: string;
  parties: {
    contractor: Party;
    client: Party;
  };
  stages: MilestoneStage[];
  delayClause: DelayClauseConfig;
  currentVersion: string;
  versionHistory: VersionChange[];
  payments: PaymentRecord[];
  isDisputed: boolean;
  disputeReason?: string;
  disputeDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: 'awaiting_confirmation' | 'milestone_approaching' | 'milestone_overdue' | 'contract_expiry' | 'completion_submitted' | 'dispute_raised';
  title: string;
  titleRw: string;
  message: string;
  messageRw: string;
  contractId: string;
  contractTitle: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundedRecords?: {
    contractId: string;
    contractTitle: string;
    detail: string;
    status: ContractStatus;
    clauseReference?: string;
  }[];
  suggestedAction?: {
    label: string;
    contractId: string;
  };
}

