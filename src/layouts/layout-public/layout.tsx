import { SelectLanguage } from '@local/components/select-language';

import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function LayoutPublic() {
  const { t } = useTranslation('translation');

  return (
    <Stack
      sx={{
        flexGrow: 1,
        flexDirection: 'column',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      {t('pages.public.title')}
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
          // isOnlyColorInSelectListOption
          genre='primary'
          size={'medium'}
          style={{
            width: '120px',
          }}
        />
      </Stack>
      <Stack
        sx={{
          width: 'min(1180px, 100%)',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          flexGrow: 1,
          maxWidth: '-webkit-fill-available',
          paddingBottom: '38px',
        }}
      >
        <Outlet />
      </Stack>
    </Stack>
  );
}
