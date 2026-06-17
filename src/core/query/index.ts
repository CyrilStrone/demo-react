import { QueryClient } from '@tanstack/react-query';

import { env } from '../envs';
import { logger } from '../logger';

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
