const REMOTE_BACKEND_BASE_URL = 'http://123.176.35.22:8082/api';

const resolveDefaultBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (import.meta.env.DEV) {
    return REMOTE_BACKEND_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return REMOTE_BACKEND_BASE_URL;
    }
  }

  return '/api';
};

export const API_BASE_URL = resolveDefaultBaseUrl().replace(/\/$/, '');

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
