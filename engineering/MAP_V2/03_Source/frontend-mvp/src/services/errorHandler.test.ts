import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  let mockHref = '';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    mockHref = '';
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      get href() { return mockHref; },
      set href(value: string) { mockHref = value; },
    });
  });

  describe('normalize', () => {
    it('normalizes an Axios-style error with response', () => {
      const error = {
        response: {
          status: 422,
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          field: 'email',
          details: { reason: 'bad format' },
        },
      };
      const result = errorHandler.normalize(error);
      expect(result).toEqual({
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        status: 422,
        field: 'email',
        details: { reason: 'bad format' },
      });
    });

    it('falls back to HTTP_<status> when code is missing', () => {
      const error = {
        response: {
          status: 500,
          detail: 'Server error',
        },
      };
      const result = errorHandler.normalize(error);
      expect(result.code).toBe('HTTP_500');
      expect(result.message).toBe('Server error');
    });

    it('falls back to "An error occurred" when message is missing', () => {
      const error = {
        response: {
          status: 400,
        },
      };
      const result = errorHandler.normalize(error);
      expect(result.message).toBe('An error occurred');
    });

    it('normalizes a standard Error object', () => {
      const error = new Error('Network timeout');
      const result = errorHandler.normalize(error);
      expect(result).toEqual({
        code: 'NETWORK_ERROR',
        message: 'Network timeout',
      });
    });

    it('normalizes an unknown error type', () => {
      const result = errorHandler.normalize('string error');
      expect(result).toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      });
    });
  });

  describe('handle401', () => {
    it('removes access_token from localStorage', () => {
      localStorage.setItem('access_token', 'test-token');
      errorHandler.handle401();
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('removes access_token from sessionStorage', () => {
      sessionStorage.setItem('access_token', 'session-token');
      errorHandler.handle401();
      expect(sessionStorage.getItem('access_token')).toBeNull();
    });

    it('does nothing when no token exists', () => {
      expect(() => errorHandler.handle401()).not.toThrow();
    });
  });

  describe('handle403', () => {
    it('redirects to /access-denied', () => {
      const setHref = vi.fn();
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        set href(value: string) {
          setHref(value);
        },
        get href() {
          return '/current';
        },
      });

      errorHandler.handle403();
      expect(setHref).toHaveBeenCalledWith('/access-denied');
    });
  });

  describe('handle404', () => {
    it('redirects to /not-found', () => {
      const setHref = vi.fn();
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        set href(value: string) {
          setHref(value);
        },
        get href() {
          return '/current';
        },
      });

      errorHandler.handle404();
      expect(setHref).toHaveBeenCalledWith('/not-found');
    });
  });

  describe('handle500', () => {
    it('logs the error with support ID', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      errorHandler.handle500('error-123');
      expect(consoleSpy).toHaveBeenCalledWith('Server error. Support ID: error-123');
      consoleSpy.mockRestore();
    });
  });

  describe('handle', () => {
    it('calls handle401 and returns normalized error for 401', () => {
      localStorage.setItem('access_token', 'token');
      const error = { response: { status: 401 } };
      const result = errorHandler.handle(error);
      expect(result.status).toBe(401);
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('calls handle403 and returns normalized error for 403', () => {
      const setHref = vi.fn();
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        set href(value: string) {
          setHref(value);
        },
        get href() {
          return '/current';
        },
      });

      const error = { response: { status: 403 } };
      const result = errorHandler.handle(error);
      expect(result.status).toBe(403);
      expect(setHref).toHaveBeenCalledWith('/access-denied');
    });

    it('calls handle404 and returns normalized error for 404', () => {
      const setHref = vi.fn();
      vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        set href(value: string) {
          setHref(value);
        },
        get href() {
          return '/current';
        },
      });

      const error = { response: { status: 404 } };
      const result = errorHandler.handle(error);
      expect(result.status).toBe(404);
      expect(setHref).toHaveBeenCalledWith('/not-found');
    });

    it('calls handle500 for 500', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = { response: { status: 500 } };
      const result = errorHandler.handle(error);
      expect(result.status).toBe(500);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does not call special handlers for other status codes', () => {
      const error = { response: { status: 200 } };
      const result = errorHandler.handle(error);
      expect(result.status).toBe(200);
    });
  });

  describe('getUserMessage', () => {
    it('returns session expired message for 401', () => {
      const message = errorHandler.getUserMessage({ code: '401', status: 401, message: '' });
      expect(message).toBe('Your session has expired. Please log in again.');
    });

    it('returns permission denied message for 403', () => {
      const message = errorHandler.getUserMessage({ code: '403', status: 403, message: '' });
      expect(message).toBe('You do not have permission to perform this action.');
    });

    it('returns not found message for 404', () => {
      const message = errorHandler.getUserMessage({ code: '404', status: 404, message: '' });
      expect(message).toBe('The requested resource was not found.');
    });

    it('returns retry message for 429', () => {
      const message = errorHandler.getUserMessage({ code: '429', status: 429, message: '' });
      expect(message).toBe('Too many requests. Please try again later.');
    });

    it('returns server error message for 500', () => {
      const message = errorHandler.getUserMessage({ code: '500', status: 500, message: '' });
      expect(message).toBe('A server error occurred. Please try again later.');
    });

    it('returns error message for unknown status', () => {
      const message = errorHandler.getUserMessage({ code: '999', status: 999, message: 'Custom error' });
      expect(message).toBe('Custom error');
    });

    it('returns fallback message when no message provided', () => {
      const message = errorHandler.getUserMessage({ code: '999', status: 999, message: '' });
      expect(message).toBe('An error occurred. Please try again.');
    });
  });
});
