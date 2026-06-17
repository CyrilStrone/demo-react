import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { useTranslation } from 'react-i18next';

export function PagePublicHome() {
  const { t } = useTranslation('translation');

  return <Stack>{t('meta.description')}</Stack>;
}
