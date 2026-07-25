export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  steps: unknown[];
  triggers: unknown[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowListResponse {
  workflows: Workflow[];
  total: number;
  page: number;
  page_size: number;
}

export interface WorkflowCreateRequest {
  name: string;
  description?: string;
  type?: string;
  steps?: unknown[];
  triggers?: unknown[];
}

export interface WorkflowUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  steps?: unknown[];
}

export interface WorkflowExecuteRequest {
  context?: Record<string, unknown>;
  variables?: Record<string, unknown>;
  assigned_to?: string;
}

export interface WorkflowInstance {
  id: string;
  workflow_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  triggered_by: string | null;
}

export interface WorkflowInstanceListResponse {
  instances: WorkflowInstance[];
  total: number;
  page: number;
  page_size: number;
}
