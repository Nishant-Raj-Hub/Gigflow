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

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
