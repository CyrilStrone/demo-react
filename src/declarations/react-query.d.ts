import '@tanstack/react-query';
import { AxiosResponseDto } from '@local/core/types';

import { AxiosError } from 'axios';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError<AxiosResponseDto>;
  }
}
