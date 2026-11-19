import { Contract, AppNotification, AIMessage } from '../types';

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'IZ-2026-001',
    title: 'Roof Waterproofing & Tile Replacement - Kimironko Residence',
    titleRw: 'Gusana no Gusakara Inzu - Kimironko',
    type: 'short_term',
    status: 'active',
    category: 'construction',
    scope: 'Complete removal of cracked tiles, sub-layer bitumen waterproofing application, laying new terracotta roof tiles, and gutter repair.',
    scopeRw: 'Gukuraho amategura ashaje, gushyiramo umuti urinda amazi kwinjira (bitumen), gushyiramo amategura mashya no gusana imiyoboro y amazi.',
    location: 'Kimironko, Gasabo, Kigali',
    totalAmountRwf: 1200000,
    materialsProvidedBy: 'contractor',
    startDate: '2026-11-01',
    endDate: '2026-11-28',
    parties: {
      contractor: {
        id: 'usr-worker-01',
        name: 'Jean-Pierre Nsengimana',
        role: 'contractor',
        phone: '+250 788 345 678',
        nationalIdOrTIN: '1198580045231089',
        organization: 'Jean-Pierre Masonry Works',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        confirmed: true,
        confirmedAt: '2026-11-01 09:30'
      },
      client: {
        id: 'usr-client-01',
        name: 'Diane Uwera',
        role: 'client',
        phone: '+250 788 654 321',
        organization: 'Private Property Owner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        confirmed: true,
        confirmedAt: '2026-11-01 10:15'
      }
    },
    stages: [
      {
        id: 'stg-1',
        name: 'Site Inspection & Materials Delivery',
        nameRw: 'Isuzumwa ry aho ibikorwa bibera no kugeza ibikoresho',
        description: 'Delivery of 600 terracotta tiles, bitumen rolls, safety scaffolding and client signoff.',
        order: 1,
        status: 'completed',
        targetDate: '2026-11-05',
        completedDate: '2026-11-04',
        assignedTo: 'Jean-Pierre Nsengimana',
        amountRwf: 400000,
        evidenceRequired: true,
        evidenceList: [
          {
            id: 'ev-1',
            title: 'Terracotta Tiles Delivery Receipt',
            description: 'Proof of purchase and delivery of certified clay tiles from Rulindo brickworks.',
            fileType: 'receipt',
            fileUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
            uploadedBy: 'Jean-Pierre Nsengimana',
            uploadedAt: '2026-11-04 14:10',
            verifiedByClient: true
          },
          {
            id: 'ev-2',
            title: 'Roof Scaffolding Installation',
            description: 'Photo showing safety harness anchors and perimeter scaffolding assembled.',
            fileType: 'image',
            fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=400&auto=format&fit=crop&q=80',
            uploadedBy: 'Jean-Pierre Nsengimana',
            uploadedAt: '2026-11-04 16:45',
            verifiedByClient: true
          }
        ]
      },
      {
        id: 'stg-2',
        name: 'Tile Stripping & Waterproofing Layer',
        nameRw: 'Gukuraho amategura no gusiga umuti w amazi',
        description: 'Remove old broken tiles, clean rafters, apply heat-torched waterproof membrane.',
        order: 2,
        status: 'in_review',
        targetDate: '2026-11-15',
        assignedTo: 'Jean-Pierre Nsengimana',
        amountRwf: 500000,
        evidenceRequired: true,
        evidenceList: [
          {
            id: 'ev-3',
            title: 'Membrane Waterproofing Seal Test',
            description: 'Inspection photo showing the seamless torch-on membrane application before tile laying.',
            fileType: 'image',
            fileUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&auto=format&fit=crop&q=80',
            uploadedBy: 'Jean-Pierre Nsengimana',
            uploadedAt: '2026-11-14 11:20',
            verifiedByClient: false
          }
        ]
      },
      {
        id: 'stg-3',
        name: 'Tile Installation, Guttering & Handover',
        nameRw: 'Gushyiraho amategura mashya, imiyoboro no gushyikiriza nyirubwite',
        description: 'Complete new tile fixation, install zinc drainage gutters, final site cleaning and water spray test.',
        order: 3,
        status: 'pending',
        targetDate: '2026-11-28',
        assignedTo: 'Jean-Pierre Nsengimana',
        amountRwf: 300000,
        evidenceRequired: true,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 2,
      dailyPenaltyPercent: 1.0,
      maxPenaltyPercent: 5.0,
      clauseText: 'After a 2-day grace period, a delay deduction of 1% of the affected milestone value per late day applies, capped at 5% of that milestone. Calculation is indicative and requires mutual review.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v1.2',
    versionHistory: [
      {
        version: 'v1.0',
        changedBy: 'Jean-Pierre Nsengimana',
        changedAt: '2026-10-29 14:00',
        summary: 'Initial draft proposal with single lump-sum completion.',
        changes: [
          { field: 'Payment Structure', oldValue: 'None', newValue: 'Lump sum RWF 1,200,000' }
        ],
        accepted: true
      },
      {
        version: 'v1.1',
        changedBy: 'Diane Uwera',
        changedAt: '2026-10-30 11:15',
        summary: 'Customer requested 3 staged milestone payments and 2-day grace period for weather delays.',
        changes: [
          { field: 'Payment Stages', oldValue: '1 single stage', newValue: '3 milestones (RWF 400k, 500k, 300k)' },
          { field: 'Grace Period', oldValue: '0 days', newValue: '2 days' }
        ],
        accepted: true
      },
      {
        version: 'v1.2',
        changedBy: 'Jean-Pierre Nsengimana',
        changedAt: '2026-11-01 09:10',
        summary: 'Accepted staged structure and attached certified materials guarantee.',
        changes: [
          { field: 'Materials Specification', oldValue: 'Standard tiles', newValue: 'Rulindo clay terracotta tiles' }
        ],
        accepted: true
      }
    ],
    payments: [
      {
        id: 'pay-001',
        contractId: 'IZ-2026-001',
        milestoneId: 'stg-1',
        milestoneTitle: 'Site Inspection & Materials Delivery',
        amountRwf: 400000,
        provider: 'MTN Mobile Money',
        providerReference: 'MP261104.1432.A89211',
        status: 'provider_confirmed',
        reportedBy: 'Diane Uwera',
        reportedAt: '2026-11-04 15:02',
        confirmedAt: '2026-11-04 15:04',
        receiptNote: 'MTN MoMo API confirmation received (TID: 89211024)'
      }
    ],
    isDisputed: false,
    createdAt: '2026-10-29',
    updatedAt: '2026-11-14'
  },
  {
    id: 'IZ-2026-002',
    title: 'Commercial Facility Maintenance Framework Agreement 2026-2027',
    titleRw: 'Amasezerano Rusange yo Gufata Neza Inyubako y Ubucuruzi 2026-2027',
    type: 'framework',
    status: 'active',
    category: 'maintenance',
    scope: 'Umbrella agreement for plumbing, electrical, and structural preventive and emergency maintenance for Inziza Commercial Complex. Individual jobs executed via discrete work orders.',
    scopeRw: 'Amasezerano rusange yo gusana no kubungabunga ibikoresho by amashanyarazi, amazi n inyubako ya Inziza Commercial Complex binyuze mu nyandiko zihariye z imirimo (Work Orders).',
    location: 'Kigali City Center (Nyarugenge CBD)',
    totalAmountRwf: 8500000,
    materialsProvidedBy: 'client',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    parties: {
      contractor: {
        id: 'usr-coop-01',
        name: 'Kigali Artisans & Contractors Cooperative',
        role: 'manager',
        phone: '+250 788 112 233',
        nationalIdOrTIN: 'TIN-100492819',
        organization: 'Kigali Artisans Coop (KAC)',
        avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80',
        confirmed: true,
        confirmedAt: '2026-01-02 08:00'
      },
      client: {
        id: 'usr-client-02',
        name: 'Inziza Commercial Properties Ltd',
        role: 'client',
        phone: '+250 788 998 877',
        organization: 'Inziza Real Estate Group',
        avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        confirmed: true,
        confirmedAt: '2026-01-02 09:30'
      }
    },
    stages: [
      {
        id: 'fw-q1',
        name: 'Q1 Comprehensive Facility Audit',
        nameRw: 'Isuzumwa ry imyubako mu gihembwe cya 1',
        description: 'Audit electrical distribution panels, fire suppression pumps, and water pressure valves.',
        order: 1,
        status: 'completed',
        targetDate: '2026-03-31',
        completedDate: '2026-03-29',
        assignedTo: 'KAC Technicians Unit',
        amountRwf: 2000000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'fw-q2',
        name: 'Q2 Preventive Servicing & Drainage',
        nameRw: 'Isuzumwa n isanwa ryo mu gihembwe cya 2',
        description: 'Clear rainwater conduits, repair roof waterproofing seams before heavy rainy season.',
        order: 2,
        status: 'completed',
        targetDate: '2026-06-30',
        completedDate: '2026-06-25',
        assignedTo: 'KAC Civil Team',
        amountRwf: 2000000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'fw-q3',
        name: 'Q3 HVAC & Elevator Power Backup Maintenance',
        nameRw: 'Isuzumwa rya moteri z amashanyarazi n imashini zizamuka mu gihembwe cya 3',
        description: 'Generator oil replacement, air filtration cleaning, elevator standby UPS test.',
        order: 3,
        status: 'completed',
        targetDate: '2026-09-30',
        completedDate: '2026-09-28',
        assignedTo: 'KAC Mechanical Unit',
        amountRwf: 2000000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'fw-q4',
        name: 'Q4 Year-End Overhaul & Renewal Review',
        nameRw: 'Isuzumwa ry umwaka rirangira no kongera amasezerano mu gihembwe cya 4',
        description: 'Final audit of entire complex infrastructure and contract performance evaluation.',
        order: 4,
        status: 'in_progress',
        targetDate: '2026-12-15',
        assignedTo: 'KAC Management',
        amountRwf: 2500000,
        evidenceRequired: true,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 3,
      dailyPenaltyPercent: 0.5,
      maxPenaltyPercent: 5.0,
      clauseText: 'Standard framework terms: 3 days grace period for quarterly milestones. Separate work orders retain independent SLA penalties.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v2.0',
    versionHistory: [
      {
        version: 'v1.0',
        changedBy: 'Inziza Commercial Properties Ltd',
        changedAt: '2025-12-20',
        summary: 'Original framework master draft.',
        changes: [],
        accepted: true
      },
      {
        version: 'v2.0',
        changedBy: 'Kigali Artisans Coop',
        changedAt: '2026-01-02',
        summary: 'Added explicit rate card for emergency overtime call-outs.',
        changes: [
          { field: 'Overtime Rate Card', oldValue: 'Unspecified', newValue: 'RWF 15,000 / technician / hour' }
        ],
        accepted: true
      }
    ],
    payments: [
      {
        id: 'pay-002',
        contractId: 'IZ-2026-002',
        milestoneId: 'fw-q1',
        milestoneTitle: 'Q1 Facility Audit',
        amountRwf: 2000000,
        provider: 'Bank of Kigali',
        providerReference: 'BK-TRX-20260401-994',
        status: 'provider_confirmed',
        reportedBy: 'Inziza Commercial Properties Ltd',
        reportedAt: '2026-04-01',
        confirmedAt: '2026-04-01'
      },
      {
        id: 'pay-003',
        contractId: 'IZ-2026-002',
        milestoneId: 'fw-q2',
        milestoneTitle: 'Q2 Servicing',
        amountRwf: 2000000,
        provider: 'Bank of Kigali',
        providerReference: 'BK-TRX-20260702-118',
        status: 'provider_confirmed',
        reportedBy: 'Inziza Commercial Properties Ltd',
        reportedAt: '2026-07-02',
        confirmedAt: '2026-07-02'
      }
    ],
    isDisputed: false,
    createdAt: '2025-12-20',
    updatedAt: '2026-10-15'
  },
  {
    id: 'IZ-2026-WO-01',
    title: 'Work Order #01: Emergency Generator Rewiring & Fuel Line Flush',
    titleRw: 'Urwandiko rw Akazi #01: Gusana Moteri y Amashanyarazi y Inziza Complex',
    type: 'work_order',
    frameworkAgreementId: 'IZ-2026-002',
    frameworkTitle: 'Commercial Facility Maintenance Framework Agreement 2026-2027',
    status: 'active',
    category: 'maintenance',
    scope: 'Urgent response to Cummins 250kVA standby generator fuel contamination and circuit breaker trip under Framework Agreement Clause 4.2.',
    scopeRw: 'Gusana byihuse moteri y amashanyarazi yagize ikibazo cya lisansi n imiyoboro y amashanyarazi bishingiye ku ngingo ya 4.2 y amasezerano rusange.',
    location: 'Inziza Commercial Complex - Basement Substation 2',
    totalAmountRwf: 450000,
    materialsProvidedBy: 'contractor',
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    parties: {
      contractor: {
        id: 'usr-coop-01',
        name: 'Kigali Artisans Cooperative (Lead: Emmanuel Habimana)',
        role: 'contractor',
        phone: '+250 788 112 233',
        confirmed: true,
        confirmedAt: '2026-11-12 11:00'
      },
      client: {
        id: 'usr-client-02',
        name: 'Inziza Commercial Properties (Eng. Patrick)',
        role: 'client',
        phone: '+250 788 998 877',
        confirmed: true,
        confirmedAt: '2026-11-12 11:30'
      }
    },
    stages: [
      {
        id: 'wo1-s1',
        name: 'Fuel Tank Drain & System Flushing',
        nameRw: 'Kuvana lisansi yangiritse mu gitangi no kuyisukura',
        description: 'Pump out sedimented diesel, flush injector nozzles, replace high-pressure fuel filters.',
        order: 1,
        status: 'completed',
        targetDate: '2026-11-13',
        completedDate: '2026-11-13',
        assignedTo: 'Emmanuel Habimana',
        amountRwf: 200000,
        evidenceRequired: true,
        evidenceList: [
          {
            id: 'ev-wo1',
            title: 'Filter Replacement Evidence',
            description: 'Photo showing new OEM Cummins diesel filters installed and clean fuel test tube.',
            fileType: 'image',
            fileUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
            uploadedBy: 'Emmanuel Habimana',
            uploadedAt: '2026-11-13 17:00',
            verifiedByClient: true
          }
        ]
      },
      {
        id: 'wo1-s2',
        name: '4-Hour Load Bank Stress Testing & Certification',
        nameRw: 'Gupima imikorere y amashanyarazi mu masaha 4 no gutanga icyemezo',
        description: 'Simulate full building load switch to generator, test ATS (Automatic Transfer Switch) response under 10 seconds.',
        order: 2,
        status: 'in_progress',
        targetDate: '2026-11-18',
        assignedTo: 'Emmanuel Habimana',
        amountRwf: 250000,
        evidenceRequired: true,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 1,
      dailyPenaltyPercent: 2.0,
      maxPenaltyPercent: 10.0,
      clauseText: 'Emergency priority work order: 1-day grace period, 2% deduction per late day due to critical facility downtime risks.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v1.0',
    versionHistory: [
      {
        version: 'v1.0',
        changedBy: 'Inziza Commercial Properties',
        changedAt: '2026-11-12 10:45',
        summary: 'Emergency work order initiated under Framework Contract #IZ-2026-002.',
        changes: [],
        accepted: true
      }
    ],
    payments: [],
    isDisputed: false,
    createdAt: '2026-11-12',
    updatedAt: '2026-11-13'
  },
  {
    id: 'IZ-2026-003',
    title: 'Staff Uniform Tailoring (60 Sets for Bright Academy)',
    titleRw: 'Gudoda Imyenda y Akazi 60 y Ikigo cy Amashuri Bright Academy',
    type: 'short_term',
    status: 'awaiting_confirmation',
    category: 'tailoring',
    scope: 'Tailoring 60 pairs of customized staff uniforms (blazer, trousers/skirt, branded embroidery with school emblem).',
    scopeRw: 'Gudoda amakote n amapantalo cyangwa amajipo 60 biriho ikirango cy ikigo.',
    location: 'Nyamirambo, Nyarugenge, Kigali',
    totalAmountRwf: 1800000,
    materialsProvidedBy: 'contractor',
    startDate: '2026-11-20',
    endDate: '2026-12-10',
    parties: {
      contractor: {
        id: 'usr-worker-02',
        name: 'Marie-Claire Mukamana',
        role: 'contractor',
        phone: '+250 788 445 566',
        organization: 'Kigali Fashion & Uniform Tailoring Ltd',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        confirmed: true,
        confirmedAt: '2026-11-15 14:00'
      },
      client: {
        id: 'usr-client-03',
        name: 'Bright Academy Kigali (Director Gasana)',
        role: 'client',
        phone: '+250 788 776 655',
        organization: 'Bright Academy Kigali',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        confirmed: false
      }
    },
    stages: [
      {
        id: 'unif-1',
        name: 'Fabric Sourcing & Size Measurement of 60 Staff',
        nameRw: 'Kugura ibitambaro no gupima abakozi 60',
        description: 'On-site sizing session at Bright Academy, procurement of durable navy-blue poly-wool fabric.',
        order: 1,
        status: 'pending',
        targetDate: '2026-11-24',
        assignedTo: 'Marie-Claire Mukamana',
        amountRwf: 600000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'unif-2',
        name: 'Sample Prototype Batch (3 Sets) for Inspection',
        nameRw: 'Gukora icyitegererezo cy imyenda 3 yo gusuzumwa',
        description: 'Provide 3 finalized sample uniforms for school board fit, stitching and embroidery review.',
        order: 2,
        status: 'pending',
        targetDate: '2026-11-30',
        assignedTo: 'Marie-Claire Mukamana',
        amountRwf: 400000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'unif-3',
        name: 'Bulk Production & Final Fitting Handover',
        nameRw: 'Kurangiza kudoda yose uko ari 60 no kuyishyikiriza',
        description: 'Delivery of remaining 57 suits, individual name tagging, packaging and final sign-off.',
        order: 3,
        status: 'pending',
        targetDate: '2026-12-10',
        assignedTo: 'Marie-Claire Mukamana',
        amountRwf: 800000,
        evidenceRequired: true,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 2,
      dailyPenaltyPercent: 1.0,
      maxPenaltyPercent: 5.0,
      clauseText: 'Awaiting confirmation: Standard delay formula applies after 2 days grace period.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v1.0',
    versionHistory: [
      {
        version: 'v1.0',
        changedBy: 'Marie-Claire Mukamana',
        changedAt: '2026-11-15 13:50',
        summary: 'Agreement draft prepared and sent for client digital confirmation.',
        changes: [],
        accepted: false
      }
    ],
    payments: [],
    isDisputed: false,
    createdAt: '2026-11-15',
    updatedAt: '2026-11-15'
  },
  {
    id: 'IZ-2026-004',
    title: 'School Sanitation Block Plumbing Rehabilitation',
    titleRw: 'Gusana Imiyoboro y Amazi y Ubwiherero bw Ishuri',
    type: 'short_term',
    status: 'disputed',
    category: 'construction',
    scope: 'Replacement of damaged drainage pipes and installation of 8 ceramic flush toilets.',
    scopeRw: 'Gusimbura imiyoboro y amazi yangiritse no gushyiramo imisarani mishya 8 ya sima.',
    location: 'Kicukiro, Kigali',
    totalAmountRwf: 850000,
    materialsProvidedBy: 'client',
    startDate: '2026-10-10',
    endDate: '2026-11-10',
    parties: {
      contractor: {
        id: 'usr-worker-03',
        name: 'Fabrice Nkurunziza',
        role: 'contractor',
        phone: '+250 788 223 344',
        confirmed: true,
        confirmedAt: '2026-10-10 09:00'
      },
      client: {
        id: 'usr-client-04',
        name: 'Kicukiro Community Learning Center',
        role: 'client',
        phone: '+250 788 556 677',
        confirmed: true,
        confirmedAt: '2026-10-10 09:30'
      }
    },
    stages: [
      {
        id: 'pl-1',
        name: 'Demolition & Pipe Trenching',
        nameRw: 'Gusenya no gucukura imiyoboro',
        description: 'Excavate 45 meters trench for PVC sewer outflow pipes.',
        order: 1,
        status: 'completed',
        targetDate: '2026-10-20',
        completedDate: '2026-10-19',
        assignedTo: 'Fabrice Nkurunziza',
        amountRwf: 350000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'pl-2',
        name: 'Ceramic Fixture Installation & Pressure Leak Test',
        nameRw: 'Gushyiramo ibikoresho by isuku no gupima amazi',
        description: 'Fit 8 flush toilets with individual angle valves and run 24-hr pressure seal test.',
        order: 2,
        status: 'overdue',
        targetDate: '2026-11-08',
        assignedTo: 'Fabrice Nkurunziza',
        amountRwf: 500000,
        evidenceRequired: true,
        daysOverdue: 6,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 2,
      dailyPenaltyPercent: 1.0,
      maxPenaltyPercent: 5.0,
      clauseText: 'After 2-day grace period, 1% per day late deduction applies up to 5% maximum. Currently paused due to active dispute on client-supplied pipes quality.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v1.0',
    versionHistory: [],
    payments: [
      {
        id: 'pay-004',
        contractId: 'IZ-2026-004',
        milestoneId: 'pl-1',
        milestoneTitle: 'Demolition & Trenching',
        amountRwf: 350000,
        provider: 'Airtel Money',
        providerReference: 'AIR-9921402',
        status: 'user_reported',
        reportedBy: 'Kicukiro Learning Center',
        reportedAt: '2026-10-21'
      }
    ],
    isDisputed: true,
    disputeReason: 'Contractor reports that client-provided PVC connectors cracked under standard 3-bar municipal water pressure; client claims faulty soldering technique. Deductions paused pending independent joint inspection.',
    disputeDate: '2026-11-10',
    createdAt: '2026-10-10',
    updatedAt: '2026-11-14'
  },
  {
    id: 'IZ-2026-005',
    title: 'Timber Shed & Fence Construction - Kanombe Farm',
    titleRw: 'Kubaka Ikiraro n Uruzitiro rw Imbaho - Kanombe',
    type: 'short_term',
    status: 'expired',
    category: 'construction',
    scope: 'Construct 12x6m eucalyptus timber dairy shelter and 200m cedar fencing.',
    scopeRw: 'Kubaka ikiraro cy inka n uruzitiro rwo ku murima.',
    location: 'Kanombe, Kicukiro, Kigali',
    totalAmountRwf: 950000,
    materialsProvidedBy: 'contractor',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    parties: {
      contractor: {
        id: 'usr-worker-04',
        name: 'Aloys Hakizimana',
        role: 'contractor',
        phone: '+250 788 901 234',
        confirmed: true,
        confirmedAt: '2026-09-01 10:00'
      },
      client: {
        id: 'usr-client-05',
        name: 'Gisa Agriculture Enterprise',
        role: 'client',
        phone: '+250 788 334 455',
        confirmed: true,
        confirmedAt: '2026-09-01 11:00'
      }
    },
    stages: [
      {
        id: 'sh-1',
        name: 'Post Hole Digging & Concrete Foundation Footings',
        nameRw: 'Gucukura ibyobo no gushyiramo sima',
        description: '24 treated poles anchored in concrete base.',
        order: 1,
        status: 'completed',
        targetDate: '2026-09-15',
        completedDate: '2026-09-14',
        assignedTo: 'Aloys Hakizimana',
        amountRwf: 400000,
        evidenceRequired: true,
        evidenceList: []
      },
      {
        id: 'sh-2',
        name: 'Timber Framework & Corrugated Iron Roofing',
        nameRw: 'Kubaka igisenge no gusasaho amabati',
        description: 'Timber trusses and BG28 gauge galvanized iron roof sheets.',
        order: 2,
        status: 'pending',
        targetDate: '2026-10-15',
        assignedTo: 'Aloys Hakizimana',
        amountRwf: 550000,
        evidenceRequired: true,
        evidenceList: []
      }
    ],
    delayClause: {
      hasDelayClause: true,
      gracePeriodDays: 2,
      dailyPenaltyPercent: 1.0,
      maxPenaltyPercent: 5.0,
      clauseText: 'Contract term expired on 2026-10-15 with unfinished Stage 2.',
      humanReviewRequired: true,
      disputePauseSupported: true
    },
    currentVersion: 'v1.0',
    versionHistory: [],
    payments: [
      {
        id: 'pay-005',
        contractId: 'IZ-2026-005',
        milestoneId: 'sh-1',
        milestoneTitle: 'Post Hole Digging & Foundation',
        amountRwf: 400000,
        provider: 'MTN Mobile Money',
        providerReference: 'MP260914.0841.B10291',
        status: 'provider_confirmed',
        reportedBy: 'Gisa Agriculture Enterprise',
        reportedAt: '2026-09-14',
        confirmedAt: '2026-09-14'
      }
    ],
    isDisputed: false,
    notes: 'Agreement expired while Stage 2 remains pending due to seasonal timber shortage in Musanze district.',
    createdAt: '2026-09-01',
    updatedAt: '2026-10-16'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'milestone_overdue',
    title: 'Milestone Overdue Alert',
    titleRw: 'Incamake y Imirimo Yatinze',
    message: 'Stage 2 "Ceramic Fixture Installation" in Contract #IZ-2026-004 is 6 days overdue. Delay remedies may apply.',
    messageRw: 'Icyiciro cya 2 "Gushyiramo ibikoresho by isuku" cy amasezerano #IZ-2026-004 kimaze gutinda iminsi 6.',
    contractId: 'IZ-2026-004',
    contractTitle: 'School Sanitation Block Plumbing Rehabilitation',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'completion_submitted',
    title: 'Work Submitted for Acceptance',
    titleRw: 'Imirimo yoherejwe ngo yemezwe',
    message: 'Jean-Pierre submitted evidence for Stage 2 "Tile Stripping & Waterproofing Layer" for your review and approval.',
    messageRw: 'Jean-Pierre yatanze ibimenyetso by icyiciro cya 2 kugira ngo ubyemeze.',
    contractId: 'IZ-2026-001',
    contractTitle: 'Roof Waterproofing & Tile Replacement - Kimironko',
    timestamp: 'Yesterday at 14:20',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'awaiting_confirmation',
    title: 'Agreement Awaiting Confirmation',
    titleRw: 'Amasezerano ategereje kwemezwa',
    message: 'Contract #IZ-2026-003 "Uniform Tailoring" needs client digital signature to become active.',
    messageRw: 'Amasezerano #IZ-2026-003 akeneye umukono wawe kugira ngo atangire.',
    contractId: 'IZ-2026-003',
    contractTitle: 'Staff Uniform Tailoring (60 Sets)',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: 'notif-4',
    type: 'milestone_approaching',
    title: 'Milestone Deadline in 48 Hours',
    titleRw: 'Igihe Ntarengwa kigiye kugera mu masaha 48',
    message: 'Work Order #01 milestone "4-Hour Load Bank Stress Testing" is due on 2026-11-18.',
    messageRw: 'Urwandiko rw akazi #01 icyiciro cyo gupima imikorere kigomba kurangira ku ya 18 Ugushyingo.',
    contractId: 'IZ-2026-WO-01',
    contractTitle: 'Work Order #01: Emergency Generator Rewiring',
    timestamp: '2 days ago',
    isRead: true
  }
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'ai-welcome',
    sender: 'assistant',
    text: 'Muraho! I am your IZERE AI Contract Assistant. I answer questions grounded strictly in your verified contracts, milestones, and payment records.\n\nAsk me about overdue work, upcoming expiries, change history, or contract clauses.',
    timestamp: 'Just now',
    groundedRecords: []
  }
];

