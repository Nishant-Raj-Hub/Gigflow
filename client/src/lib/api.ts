// API Routes and Endpoints

// Base URL from environment variable
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000';

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
