import { useLanguage } from '@local/contexts/context-language';

import { Button } from '@jenesei-software/jenesei-kit-react/component-button';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { useTranslation } from 'react-i18next';

export function PagePrivateHome() {
  const { changeLng, lng } = useLanguage(['changeLng', 'lng']);
  const { t } = useTranslation('translation');

  return (
    <Stack>
      Private Home. Current lng: {lng} {t('meta.description')}
      <Button onClick={() => changeLng('ru')} genre='green' size='medium'>
        Ru
      </Button>
      <Button onClick={() => changeLng('en')} genre='green' size='medium'>
        En
      </Button>
    </Stack>
  );
}
