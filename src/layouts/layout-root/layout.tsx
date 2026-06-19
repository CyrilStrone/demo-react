import { SelectLanguage } from '@local/components/select-language';
import { usePWA } from '@local/contexts/context-pwa';
import { ProviderValidation } from '@local/contexts/context-validation';
import { env } from '@local/core/envs';
import { tableString } from '@local/core/functions';
import { logger } from '@local/core/logger';

import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';
import { Button } from '@jenesei-software/jenesei-kit-react';

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
  const pwa = usePWA(['updateApp', 'resetAppCache', 'isUpdateAvailable']);

  return (
    <Stack
      sx={{
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'auto',
        padding: '20px',
      }}
    >
      <Stack
        sx={{
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <SelectLanguage
          isShowDropdownOptionIcon
          isOnClickOptionClose
          isStayValueAfterSelect
          isToggleWhenClickSelectListOption
          genre='primary'
          size='medium'
          style={{
            width: '120px',
          }}
        />
      </Stack>

      <Stack
        sx={{
          alignItems: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '24px',
          justifyContent: 'flex-start',
          maxWidth: '-webkit-fill-available',
          paddingBottom: '38px',
          width: 'min(1180px, 100%)',
        }}
      >
        <Outlet />
      </Stack>
      <Stack
        sx={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <Button
          isDisabled={!pwa.isUpdateAvailable}
          isHidden={!pwa.isUpdateAvailable}
          genre='primary'
          size='medium'
          onClick={pwa.updateApp}
          type='button'
        >
          Update App
        </Button>

        <Button genre='primary' size='medium' onClick={pwa.resetAppCache} type='button'>
          Reset App Cache
        </Button>
      </Stack>
    </Stack>
  );
};
