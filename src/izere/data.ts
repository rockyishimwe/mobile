export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'awaiting_acceptance'
  | 'completed'
  | 'disputed'
  | 'overdue';

export type StageStatus = 'completed' | 'in_progress' | 'pending';

export type ContractKind = 'short_term' | 'framework' | 'work_order';

export type IconKey = 'briefcase' | 'handshake' | 'gear' | 'home' | 'shirt' | 'truck';

export interface Stage {
  id: string;
  name: string;
  status: StageStatus;
  date: string; // ISO
  amountRwf: number;
}

export interface Clause {
  title: string;
  body: string;
}

export interface Contract {
  id: string;
  title: string;
  kind: ContractKind;
  icon: IconKey;
  status: ContractStatus;
  client: string;
  contractor: string;
  location: string;
  startDate: string;
  dueDate: string;
  totalRwf: number;
  paidRwf: number;
  scope: string;
  gracePeriodDays: number;
  dailyPenaltyPct: number;
  maxPenaltyPct: number;
  stages: Stage[];
  clauses: Clause[];
  files: { name: string; kind: 'photo' | 'receipt' | 'document'; date: string }[];
  activity: { text: string; date: string }[];
}

export type NotifKind = 'deadline' | 'milestone' | 'payment' | 'dispute';

export interface Notification {
  id: string;
  kind: NotifKind;
  category: 'alert' | 'update';
  title: string;
  body: string;
  time: string;
  read: boolean;
  contractId?: string;
}

export const TODAY = new Date('2026-11-17T09:41:00');

const stdClauses = (grace: number, rate: number, cap: number): Clause[] => [
  {
    title: '1. Scope of work',
    body: 'The contractor delivers the work described in this agreement, stage by stage, with evidence uploaded for each completed stage.',
  },
  {
    title: '2. Payment',
    body: 'Payments are made per milestone through Mobile Money or bank transfer. IZERE records the provider reference only and never holds funds (BNR Law No. 61/2021).',
  },
  {
    title: '3. Delays',
    body: `A grace period of ${grace} days applies to every milestone. After that, a deduction of ${rate}% of the milestone value per day may apply, capped at ${cap}%. Any deduction needs human review and is paused while a dispute is open.`,
  },
  {
    title: '4. Changes',
    body: 'Any change to scope, price or dates is recorded as a new version and must be confirmed by both parties.',
  },
  {
    title: '5. Disputes',
    body: 'Either party may raise a dispute. IZERE keeps the shared record; it is not a court and does not decide the outcome.',
  },
];

export const initialContracts: Contract[] = [
  {
    id: 'CTR-001',
    title: 'Website Development',
    kind: 'short_term',
    icon: 'briefcase',
    status: 'active',
    client: 'Acme Ltd',
    contractor: 'You',
    location: 'Kigali, Gasabo',
    startDate: '2026-11-01',
    dueDate: '2026-11-20',
    totalRwf: 2400000,
    paidRwf: 1200000,
    scope: 'Design and build a responsive company website with a CMS, contact forms and hosting setup.',
    gracePeriodDays: 2,
    dailyPenaltyPct: 1,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Kick-off Meeting', status: 'completed', date: '2026-11-01', amountRwf: 400000 },
      { id: 's2', name: 'Frontend Design', status: 'completed', date: '2026-11-05', amountRwf: 800000 },
      { id: 's3', name: 'Backend Development', status: 'in_progress', date: '2026-11-15', amountRwf: 700000 },
      { id: 's4', name: 'Testing & Review', status: 'pending', date: '2026-11-18', amountRwf: 300000 },
      { id: 's5', name: 'Final Delivery', status: 'pending', date: '2026-11-20', amountRwf: 200000 },
    ],
    clauses: stdClauses(2, 1, 5),
    files: [
      { name: 'Signed agreement v1.1.pdf', kind: 'document', date: '2026-11-01' },
      { name: 'Homepage mockups.png', kind: 'photo', date: '2026-11-05' },
      { name: 'MoMo receipt MP261105.pdf', kind: 'receipt', date: '2026-11-06' },
    ],
    activity: [
      { text: 'Milestone completed: Frontend Design', date: '2026-11-17T07:41:00' },
      { text: 'Payment of RWF 800,000 recorded (MTN MoMo)', date: '2026-11-06T10:12:00' },
      { text: 'Contract confirmed by both parties', date: '2026-11-01T09:00:00' },
    ],
  },
  {
    id: 'CTR-002',
    title: 'Marketing Campaign',
    kind: 'framework',
    icon: 'handshake',
    status: 'disputed',
    client: 'Inzozi Foods',
    contractor: 'You',
    location: 'Kigali, Nyarugenge',
    startDate: '2026-10-20',
    dueDate: '2026-11-25',
    totalRwf: 1800000,
    paidRwf: 600000,
    scope: 'Plan and run a 5-week social media and radio campaign for a new product line.',
    gracePeriodDays: 3,
    dailyPenaltyPct: 1,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Campaign Brief', status: 'completed', date: '2026-10-22', amountRwf: 300000 },
      { id: 's2', name: 'Creative Production', status: 'completed', date: '2026-11-02', amountRwf: 600000 },
      { id: 's3', name: 'Launch & Ads', status: 'in_progress', date: '2026-11-12', amountRwf: 600000 },
      { id: 's4', name: 'Reporting', status: 'pending', date: '2026-11-25', amountRwf: 300000 },
    ],
    clauses: stdClauses(3, 1, 5),
    files: [{ name: 'Campaign brief.pdf', kind: 'document', date: '2026-10-22' }],
    activity: [
      { text: 'Dispute raised: radio slots not aired as agreed', date: '2026-11-15T14:00:00' },
      { text: 'Milestone completed: Creative Production', date: '2026-11-02T16:30:00' },
    ],
  },
  {
    id: 'CTR-003',
    title: 'Mobile App Support',
    kind: 'work_order',
    icon: 'gear',
    status: 'awaiting_acceptance',
    client: 'Kigali Artisans Coop',
    contractor: 'You',
    location: 'Remote',
    startDate: '2026-10-01',
    dueDate: '2026-12-01',
    totalRwf: 3200000,
    paidRwf: 2400000,
    scope: 'Maintain the coop mobile app: bug fixes, Android updates and a monthly health report.',
    gracePeriodDays: 2,
    dailyPenaltyPct: 0.5,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Discovery', status: 'completed', date: '2026-10-05', amountRwf: 400000 },
      { id: 's2', name: 'Bug Fix Sprint', status: 'completed', date: '2026-10-20', amountRwf: 1000000 },
      { id: 's3', name: 'Android Update', status: 'completed', date: '2026-11-10', amountRwf: 1000000 },
      { id: 's4', name: 'Handover Report', status: 'in_progress', date: '2026-12-01', amountRwf: 800000 },
    ],
    clauses: stdClauses(2, 0.5, 5),
    files: [
      { name: 'Release notes 2.4.pdf', kind: 'document', date: '2026-11-10' },
      { name: 'Airtel receipt AM8812.pdf', kind: 'receipt', date: '2026-11-11' },
    ],
    activity: [
      { text: 'Deliverable submitted for acceptance', date: '2026-11-16T11:00:00' },
      { text: 'Payment of RWF 1,000,000 recorded (Airtel Money)', date: '2026-11-11T09:20:00' },
    ],
  },
  {
    id: 'CTR-004',
    title: 'Roof Repair – Kimihurura',
    kind: 'short_term',
    icon: 'home',
    status: 'completed',
    client: 'Diane Uwera',
    contractor: 'You',
    location: 'Kimihurura, Gasabo',
    startDate: '2026-09-01',
    dueDate: '2026-09-20',
    totalRwf: 950000,
    paidRwf: 950000,
    scope: 'Replace damaged iron sheets and fix gutters on a residential house.',
    gracePeriodDays: 2,
    dailyPenaltyPct: 1,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Procurement', status: 'completed', date: '2026-09-05', amountRwf: 400000 },
      { id: 's2', name: 'Execution', status: 'completed', date: '2026-09-15', amountRwf: 400000 },
      { id: 's3', name: 'Handover', status: 'completed', date: '2026-09-19', amountRwf: 150000 },
    ],
    clauses: stdClauses(2, 1, 5),
    files: [{ name: 'Roof after repair.jpg', kind: 'photo', date: '2026-09-19' }],
    activity: [{ text: 'Contract completed and paid in full', date: '2026-09-20T12:00:00' }],
  },
  {
    id: 'CTR-005',
    title: 'School Uniform Tailoring',
    kind: 'short_term',
    icon: 'shirt',
    status: 'completed',
    client: 'G.S. Remera',
    contractor: 'You',
    location: 'Remera, Gasabo',
    startDate: '2026-08-01',
    dueDate: '2026-08-30',
    totalRwf: 1500000,
    paidRwf: 1500000,
    scope: 'Tailor 120 school uniforms in agreed sizes and colours.',
    gracePeriodDays: 2,
    dailyPenaltyPct: 1,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Fabric Purchase', status: 'completed', date: '2026-08-05', amountRwf: 500000 },
      { id: 's2', name: 'Tailoring', status: 'completed', date: '2026-08-25', amountRwf: 800000 },
      { id: 's3', name: 'Delivery', status: 'completed', date: '2026-08-29', amountRwf: 200000 },
    ],
    clauses: stdClauses(2, 1, 5),
    files: [],
    activity: [{ text: 'Contract completed and paid in full', date: '2026-08-30T12:00:00' }],
  },
  {
    id: 'CTR-006',
    title: 'Goods Delivery – Musanze',
    kind: 'short_term',
    icon: 'truck',
    status: 'pending',
    client: 'Virunga Traders',
    contractor: 'You',
    location: 'Kigali → Musanze',
    startDate: '2026-11-22',
    dueDate: '2026-11-28',
    totalRwf: 450000,
    paidRwf: 0,
    scope: 'Transport 3 tonnes of packaged goods from Kigali to Musanze.',
    gracePeriodDays: 1,
    dailyPenaltyPct: 1,
    maxPenaltyPct: 5,
    stages: [
      { id: 's1', name: 'Scheduled', status: 'pending', date: '2026-11-22', amountRwf: 0 },
      { id: 's2', name: 'In Transit', status: 'pending', date: '2026-11-26', amountRwf: 300000 },
      { id: 's3', name: 'Accepted', status: 'pending', date: '2026-11-28', amountRwf: 150000 },
    ],
    clauses: stdClauses(1, 1, 5),
    files: [],
    activity: [{ text: 'Contract sent to client for confirmation', date: '2026-11-14T08:00:00' }],
  },
];

export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    kind: 'deadline',
    category: 'alert',
    title: 'Deadline approaching',
    body: 'Website Development is due in 3 days.',
    time: '2h ago',
    read: false,
    contractId: 'CTR-001',
  },
  {
    id: 'n2',
    kind: 'milestone',
    category: 'update',
    title: 'Milestone completed',
    body: 'Frontend Design',
    time: '3h ago',
    read: false,
    contractId: 'CTR-001',
  },
  {
    id: 'n3',
    kind: 'payment',
    category: 'update',
    title: 'Payment status updated',
    body: 'Payment for #CTR-001 is Processing.',
    time: '1d ago',
    read: true,
    contractId: 'CTR-001',
  },
  {
    id: 'n4',
    kind: 'dispute',
    category: 'alert',
    title: 'Contract dispute',
    body: 'Marketing Campaign has a dispute.',
    time: '2d ago',
    read: false,
    contractId: 'CTR-002',
  },
  {
    id: 'n5',
    kind: 'deadline',
    category: 'alert',
    title: 'Overdue stage',
    body: 'Backend Development passed its target date (Nov 15).',
    time: '2d ago',
    read: true,
    contractId: 'CTR-001',
  },
];

// ---------- helpers ----------
export const progressOf = (c: Contract) => {
  if (!c.stages.length) return 0;
  const done = c.stages.filter((s) => s.status === 'completed').length;
  const half = c.stages.filter((s) => s.status === 'in_progress').length * 0.5;
  return Math.round(((done + half) / c.stages.length) * 100);
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (iso: string) => {
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
};
export const fmtShort = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
};
export const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso + 'T00:00:00').getTime() - TODAY.getTime()) / 86400000);

export const timeAgo = (iso: string) => {
  const mins = Math.max(1, Math.round((TODAY.getTime() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

export const rwf = (n: number) => 'RWF ' + n.toLocaleString('en-US');

export const statusMeta: Record<ContractStatus, { label: string; bg: string; fg: string }> = {
  draft: { label: 'Draft', bg: '#F1F5F2', fg: '#737D77' },
  pending: { label: 'Pending', bg: '#FEF9EE', fg: '#B7791F' },
  active: { label: 'Active', bg: '#E9F2EC', fg: '#123D32' },
  awaiting_acceptance: { label: 'Awaiting Acceptance', bg: '#F3EEFF', fg: '#6D4BC2' },
  completed: { label: 'Completed', bg: '#ECFDF5', fg: '#23845B' },
  disputed: { label: 'Disputed', bg: '#FEF2F2', fg: '#C2413B' },
  overdue: { label: 'Overdue', bg: '#FFF1F2', fg: '#BE123C' },
};

export const kindLabel: Record<ContractKind, string> = {
  short_term: 'Short-term job',
  framework: 'Framework agreement',
  work_order: 'Work order',
};
