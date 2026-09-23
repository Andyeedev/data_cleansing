import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const wrappedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || 'GET';

      // Skip interceptor for login and /me endpoints
      const isLoginRequest = url.includes('/api/v1/auth/login') && method === 'POST';
      const isMeRequest = url.includes('/api/v1/auth/me') && method === 'GET';

      const response = await window.fetch(input, init);

      // Skip interceptor for login and /me requests
      if (isLoginRequest || isMeRequest) {
        return response;
      }

      if (response.status === 401 || response.status === 403) {
        try {
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          const detail = data?.detail || data?.message || '';

          if (detail.toLowerCase().includes('suspended')) {
            navigate('/suspended', { replace: true });
            return response;
          }
          if (detail.toLowerCase().includes('blocked')) {
            navigate('/blocked', { replace: true });
            return response;
          }
          if (detail.toLowerCase().includes('expired') || detail.toLowerCase().includes('token')) {
            navigate('/session-expired', { replace: true });
            return response;
          }
        } catch {
          // If we can't parse the response, just continue
        }
      }
      return response;
    };

    window.fetch = wrappedFetch;

    return () => {
      window.fetch = window.fetch.bind(window);
    };
  }, [navigate]);
}