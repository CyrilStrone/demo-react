import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { ButtonLink } from '@local/components/link';
import { useTranslation } from 'react-i18next';

import '../table-demo/table-demo.css';

export function PageHome() {
  const { t } = useTranslation('translation');

  return (
    <Stack
      sx={{
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {t('meta.description')}
      <nav className='table-demo__nav'>
        <ButtonLink className='table-demo__nav-link' to='/products-virtual' genre={'primary'} size={'small'}>
          {t('pages.table-demo.showVirtual')}
        </ButtonLink>
        <ButtonLink className='table-demo__nav-link' to='/products-pagination' genre={'primary'} size={'small'}>
          {t('pages.table-demo.showPagination')}
        </ButtonLink>
      </nav>
    </Stack>
  );
}
