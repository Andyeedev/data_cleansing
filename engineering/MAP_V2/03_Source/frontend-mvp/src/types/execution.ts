export interface ExecutionRunResponse {
  message: string;
  batch_id: string;
  project_id: string;
  status_url: string;
}

export interface ExecutionBatchStatus {
  batch_id: string;
  status: string;
  total_controls: number;
  completed_controls: number;
  failed_controls: number;
  progress: string;
}
