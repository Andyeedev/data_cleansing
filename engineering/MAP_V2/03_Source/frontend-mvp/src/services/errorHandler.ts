interface AppError {
  code: string;
  message: string;
  status?: number;
  field?: string;
  details?: any;
}

function normalizeError(error: any): AppError {
  if (error?.response) {
    const data = error.response;
    return {
      code: data.code || `HTTP_${error.response.status}`,
      message: data.detail || data.message || 'An error occurred',
      status: error.response.status,
      field: data.field,
      details: data.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}

function handle401() {
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  if (token) {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
  }
}

function handle403() {
  window.location.href = '/access-denied';
}

function handle404() {
  window.location.href = '/not-found';
}

function handle500(errorId: string) {
  console.error(`Server error. Support ID: ${errorId}`);
}

export const errorHandler = {
  normalize: normalizeError,
  handle401,
  handle403,
  handle404,
  handle500,

  handle(error: any): AppError {
    const normalized = normalizeError(error);

    switch (normalized.status) {
      case 401:
        handle401();
        break;
      case 403:
        handle403();
        break;
      case 404:
        handle404();
        break;
      case 500:
        handle500(crypto.randomUUID());
        break;
    }

    return normalized;
  },

  getUserMessage(error: AppError): string {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'A server error occurred. Please try again later.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  },
};

export type { AppError };
