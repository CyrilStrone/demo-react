import React from 'react';
import ReactDOM from 'react-dom/client';
import '@local/core/i18n/index.ts';
import App from '@local/app';
import '@jenesei-software/jenesei-kit-react/styles.css';
import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';

import { ClassSw } from '@local/classes/class-sw';
import { env } from '@local/core/envs';

import { logger } from './core/logger';

export const swService = new ClassSw();

try {
  swService.init({
    enabled: env.mode === 'prod',
  });
  swService.setCurrentVersion(env.version ?? null);
} catch (e) {
  logger.warn('SW init failed', e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
