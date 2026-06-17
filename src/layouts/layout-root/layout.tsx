import { usePWA } from '@local/contexts/context-pwa';
import { ProviderValidation } from '@local/contexts/context-validation';
import { env } from '@local/core/envs';
import { tableString } from '@local/core/functions';
import { logger } from '@local/core/logger';
import { LayoutRoutePrivate, LayoutRoutePublic } from '@local/core/router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, useMatches, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect, useMemo } from 'react';

export function LayoutRoot() {
  const pwa = usePWA([
    'status',
    'isEnabled',
    'isSupported',
    'isInitialized',
    'isRegistered',
    'isOfflineReady',
    'isUpdateAvailable',
    'isNeedRefresh',
    'newVersion',
    'currentVersion',
    'registrationScope',
    'error',
  ]);

  useEffect(() => {
    logger.info(tableString(env));
  }, []);
  useEffect(() => {
    logger.info(tableString(pwa));
  }, [pwa]);

  return (
    <>
      <ProviderValidation>
        <LayoutRootComponent />
      </ProviderValidation>
      {env.mode === 'stage' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  );
}

const LayoutRootComponent = () => {
  const isAuthenticated = useMemo(() => false, []);

  const navigate = useNavigate();

  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePrivate.fullPath);
    },
  });
  const isMatchPublic = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePublic.fullPath);
    },
  });

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isMatchPrivate) {
        if (!isAuthenticated) navigate({ to: '/pu' });
      } else if (isMatchPublic) {
        if (isAuthenticated) navigate({ to: '/pr' });
      }
    }
  }, [isAuthenticated, isMatchPrivate, isMatchPublic, navigate]);

  const pwa = usePWA(['updateApp', 'resetAppCache', 'isUpdateAvailable']);

  return (
    <div>
      <Outlet />
      <button disabled={!pwa.isUpdateAvailable} type='button' onClick={pwa.updateApp}>
        Update App
      </button>
      <button type='button' onClick={pwa.resetAppCache}>
        Reset App Cache
      </button>
    </div>
  );
};
