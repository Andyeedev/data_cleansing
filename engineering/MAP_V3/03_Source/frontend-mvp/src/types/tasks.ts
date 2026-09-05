export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type: string;
  assigned_to: string | null;
  assigned_by: string | null;
  parent_task_id: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  completion_percentage: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: string;
  type?: string;
  assigned_to?: string;
  project_id?: string;
  parent_task_id?: string;
  due_date?: string;
  estimated_hours?: number;
  tags?: string[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  due_date?: string;
  completion_percentage?: number;
}

export interface TaskComment {
  id: string;
  content: string;
  created_at: string;
}

export interface TaskCommentRequest {
  content: string;
}
