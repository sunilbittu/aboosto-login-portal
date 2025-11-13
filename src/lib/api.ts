export const CONFIG_API_BASE_URL = (import.meta.env.VITE_CONFIG_API_BASE_URL ?? 'http://123.176.35.22:8081').replace(/\/$/, '');
export const ADMIN_API_BASE_URL = (import.meta.env.VITE_ADMIN_API_BASE_URL ?? 'http://123.176.35.22:8082').replace(/\/$/, '');

export const buildConfigApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CONFIG_API_BASE_URL}${normalizedPath}`;
};

export const buildAdminApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${ADMIN_API_BASE_URL}${normalizedPath}`;
};

// Legacy function for backward compatibility
export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${CONFIG_API_BASE_URL}${normalizedPath}`;
};
