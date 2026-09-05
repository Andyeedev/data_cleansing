export interface Approval {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  type: string;
  approval_type?: string;
  status: string;
  assigned_to: string | null;
  requested_by?: string;
  created_by: string | null;
  due_date: string | null;
  decision_notes: string | null;
  comment?: string;
  decided_at: string | null;
  created_at: string;
}

export interface ApprovalListResponse {
  approvals: Approval[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApprovalCreateRequest {
  title: string;
  description?: string;
  priority?: string;
  type?: string;
  approval_type?: string;
  assigned_to?: string;
  due_date?: string;
}

export interface ApprovalDecisionRequest {
  notes?: string;
  decision?: string;
  comment?: string;
}
