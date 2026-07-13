import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  type: string;
  assigned_to?: string;
  assigned_by?: string;
  project_id?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
}

interface UseTasksOptions {
  status?: string;
  priority?: string;
  assigned_to?: string;
  page?: number;
  page_size?: number;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.assigned_to) params.append('assigned_to', options.assigned_to);
      if (options.page) params.append('page', String(options.page));
      if (options.page_size) params.append('page_size', String(options.page_size));
      
      const query = params.toString();
      const data = await api.get<{ success: boolean; data: TaskListResponse }>(`/tasks/${query ? `?${query}` : ''}`);
      setTasks(data.data.tasks);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [options.status, options.priority, options.assigned_to, options.page, options.page_size]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, total, loading, error, refetch: fetchTasks };
}

export function useMyTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.page) params.append('page', String(options.page));
      if (options.page_size) params.append('page_size', String(options.page_size));
      
      const query = params.toString();
      const data = await api.get<{ success: boolean; data: TaskListResponse }>(`/tasks/my/list${query ? `?${query}` : ''}`);
      setTasks(data.data.tasks);
      setTotal(data.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [options.status, options.page, options.page_size]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, total, loading, error, refetch: fetchTasks };
}

export function useTask(taskId: string | null) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<{ success: boolean; data: Task }>(`/tasks/${taskId}`);
        setTask(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);

  return { task, loading, error };
}

export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<{ success: boolean; data: Task }>('/tasks/', payload);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (taskId: string, payload: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.put<{ success: boolean; data: Task }>(`/tasks/${taskId}`, payload);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (taskId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}
