import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import type { Task, TaskListResponse, TaskCreateRequest, TaskUpdateRequest, TaskComment, TaskCommentRequest } from '../types/tasks';

export function useTaskList(params?: { page?: number; page_size?: number; status?: string; priority?: string; assigned_to?: string }) {
  const [data, setData] = useState<TaskListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<TaskListResponse>('/tasks', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size, params?.status, params?.priority, params?.assigned_to]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { data, loading, error, refetch: fetchTasks };
}

export function useMyTaskList(params?: { page?: number; page_size?: number }) {
  const [data, setData] = useState<TaskListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<TaskListResponse>('/tasks/my/list', params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.page_size]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { data, loading, error, refetch: fetchTasks };
}

export function useTaskDetail(taskId: string | null) {
  const [data, setData] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    setLoading(true);
    setError(null);
    apiGet<Task>(`/tasks/${taskId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch task'))
      .finally(() => setLoading(false));
  }, [taskId]);

  return { data, loading, error };
}

export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: TaskCreateRequest): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<Task>('/tasks', payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (taskId: string, payload: TaskUpdateRequest): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPut<Task>(`/tasks/${taskId}`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (taskId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/tasks/${taskId}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}

export function useTaskComments(taskId: string | null) {
  const [data, setData] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await apiGet<TaskComment[]>(`/tasks/${taskId}/comments`);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { data, loading, error, refetch: fetchComments };
}

export function useAddComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (taskId: string, payload: TaskCommentRequest): Promise<TaskComment | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiPost<TaskComment>(`/tasks/${taskId}/comments`, payload);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addComment, loading, error };
}
