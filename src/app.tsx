import { ProviderAxios } from '@local/contexts/context-axios';
import { ProviderLanguage } from '@local/contexts/context-language';
import { ProviderPWA } from '@local/contexts/context-pwa';
import { queryClient } from '@local/core/query';
import { LayoutErrorBoundary } from '@local/layouts/layout-error';
import { LayoutRouter } from '@local/layouts/layout-router';

import { ProviderDialog } from '@jenesei-software/jenesei-kit-react/context-dialog';
import { ProviderGeolocation } from '@jenesei-software/jenesei-kit-react/context-geolocation';
import { ProviderPermission } from '@jenesei-software/jenesei-kit-react/context-permission';
import { ProviderScreenWidth } from '@jenesei-software/jenesei-kit-react/context-screen-width';
import { QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <ProviderScreenWidth>
      <ProviderLanguage>
        <LayoutErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ProviderAxios>
              <ProviderPermission>
                <ProviderGeolocation>
                  <ProviderDialog zIndex={1000}>
                    <ProviderPWA>
                      <LayoutRouter />
                    </ProviderPWA>
                  </ProviderDialog>
                </ProviderGeolocation>
              </ProviderPermission>
            </ProviderAxios>
          </QueryClientProvider>
        </LayoutErrorBoundary>
      </ProviderLanguage>
    </ProviderScreenWidth>
  );
}

export default App;
