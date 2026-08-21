const API_BASE = '/api/v1';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

function getAuthToken(): string | null {
  return (
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('map_nexus_token') ||
    localStorage.getItem('map_nexus_auth_token')
  );
}

function buildHeaders(additional?: Record<string, string>): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...additional,
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('map_nexus_user');
      window.location.href = '/session-expired';
      throw new Error('Session expired — please re-login');
    }

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY;
      if (retries > 0) {
        await sleep(waitMs);
        return request<T>(url, options, retries - 1);
      }
    }

    if (res.status >= 500 && retries > 0) {
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1));
      return request<T>(url, options, retries - 1);
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const err: Error & { response?: any } = new Error(
        body?.detail || body?.error || body?.message || `HTTP ${res.status}: ${res.statusText}`
      );
      err.response = { status: res.status, ...body };
      throw err;
    }

    const json: ApiResponse<T> = await res.json();
    if (!json.success) {
      const err: Error & { response?: any } = new Error(json.error || json.message || 'Request failed');
      err.response = { status: res.status, data: json };
      throw err;
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw error;
  }
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return request<T>(url.toString(), {
    method: 'GET',
    headers: buildHeaders(),
  });
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(`${API_BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(path: string): Promise<T> {
  return request<T>(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });
}

export type { ApiResponse, PaginatedData };
