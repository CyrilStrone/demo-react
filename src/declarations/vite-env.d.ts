/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_DESCRIPTION: string;
  readonly VITE_DEFAULT_NAME_SHORT: string;
  readonly VITE_DEFAULT_THEME_COLOR: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_SOCKET_URL: string;
  readonly VITE_AVAILABILITY_COOKIE_NAME: string;
  readonly VITE_CORE_URL: string;
  readonly VITE_NODE_ENV: 'dev' | 'prod' | 'stage';
  readonly VITE_QUERY_STALE_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void | Promise<void>;
    onOfflineReady?: () => void | Promise<void>;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void | Promise<void>;
    onRegisterError?: (error: unknown) => void | Promise<void>;
  };

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}
