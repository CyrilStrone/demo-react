import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import '../table-demo/table-demo.css';

export function PagePublicHome() {
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
        <Link className='table-demo__nav-link' to='/pu/products-virtual'>
          {t('pages.table-demo.showVirtual')}
        </Link>
        <Link className='table-demo__nav-link' to='/pu/products-pagination'>
          {t('pages.table-demo.showPagination')}
        </Link>
      </nav>
    </Stack>
  );
}
