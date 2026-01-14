// API Routes and Endpoints

// Base URL from environment variable
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000';

// Helper to store JWT token in localStorage
export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('gigflow_token', token);
};

// Helper to get JWT token from localStorage
export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('gigflow_token');
};

// Helper to clear JWT token from localStorage
export const clearTokenFromStorage = (): void => {
  localStorage.removeItem('gigflow_token');
};

// Helper function to build full URLs
export const buildUrl = (path: string, params?: Record<string, string>) => {
  let url = `${API_BASE_URL}${path}`;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  return url;
};

// Helper to get auth headers with JWT token from storage
export const getAuthHeaders = (): Record<string, string> => {
  const token = getTokenFromStorage();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// API Paths
export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
    },
  },
  gigs: {
    list: {
      method: 'GET' as const,
      path: '/api/gigs',
    },
    get: {
      method: 'GET' as const,
      path: '/api/gigs/:id',
    },
    create: {
      method: 'POST' as const,
      path: '/api/gigs',
    },
  },
  bids: {
    create: {
      method: 'POST' as const,
      path: '/api/bids',
    },
    byGig: {
      method: 'GET' as const,
      path: '/api/bids/:gigId',
    },
    hire: {
      method: 'PATCH' as const,
      path: '/api/bids/:bidId/hire',
    },
  },
};


// testing
// Helper function to build URLs with parameters
// export function buildUrl(path: string, params?: Record<string, string | number>): string {
//   let url = path;
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (url.includes(`:${key}`)) {
//         url = url.replace(`:${key}`, String(value));
//       }
//     });
//   }
//   return url;
// }
