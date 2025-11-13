export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://123.176.35.22:8082/api').replace(/\/$/, '');

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
