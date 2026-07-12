export interface GovernanceCompliance {
  id: string;
  name: string;
  category: 'regulatory' | 'internal' | 'industry';
  status: 'compliant' | 'non-compliant' | 'pending' | 'exempt';
  score: number;
  lastAssessed: string;
  nextAssessment: string;
  owner: string;
  findings: number;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'draft' | 'archived' | 'under-review';
  version: string;
  lastUpdated: string;
  owner: string;
  complianceRate: number;
  approvalsRequired: number;
  approvalsReceived: number;
}

export interface GovernanceControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective';
  status: 'effective' | 'ineffective' | 'partial' | 'not-tested';
  effectiveness: number;
  lastTested: string;
  nextTest: string;
  owner: string;
  coverage: number;
}

export interface GovernanceException {
  id: string;
  name: string;
  type: 'policy' | 'control' | 'regulatory' | 'operational';
  status: 'open' | 'approved' | 'rejected' | 'expired' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  requestor: string;
  approver: string;
  requestDate: string;
  expiryDate: string;
  reason: string;
}

export interface GovernanceRisk {
  id: string;
  name: string;
  category: 'strategic' | 'operational' | 'financial' | 'compliance' | 'reputational';
  likelihood: 'low' | 'medium' | 'high' | 'very-high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  rating: number;
  owner: string;
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'closed';
  lastReviewed: string;
}

export interface GovernanceAudit {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'regulatory';
  status: 'planned' | 'in-progress' | 'completed' | 'findings';
  startDate: string;
  endDate: string;
  auditor: string;
  findings: number;
  score: number;
}

export interface GovernanceMetrics {
  overallComplianceScore: number;
  policyCompliance: number;
  activeExceptions: number;
  auditFindings: number;
  governanceHealth: number;
  controlEffectiveness: number;
  aiGovernanceSummary: string;
  complianceTrend: number[];
  riskTrend: number[];
  auditTrend: number[];
}
