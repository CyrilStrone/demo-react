import { QueryClient } from '@tanstack/react-query';

import { env } from '@local/core/envs';
import { logger } from '@local/core/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: +env.queryStaleTime,
    },
    mutations: {
      onError: (error) => {
        if (error) {
          logger.error('queryClient, error:', error.response?.data);
        }
      },
    },
  },
});

export const QUERY_KEYS = {
  dummy: {

  }
} as const;
