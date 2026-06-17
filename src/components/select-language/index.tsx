import { useLanguage } from '@local/contexts/context-language/context';
import { LIST_LANGUAGE } from '@local/core/consts';
import { ILanguageKeys } from '@local/core/types';

import { ISelect, ISelectItem, Select } from '@jenesei-software/jenesei-kit-react';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ISelectLanguageOption extends ISelectItem {
  placeholder: string;

  search?: string;
}

export type ISelectLanguage = Omit<ISelect<ISelectItem>, 'option' | 'value' | 'onChange'>;

export const SelectLanguage: FC<ISelectLanguage> = (props) => {
  const { changeLng, lng } = useLanguage(['changeLng', 'lng']);
  const { t } = useTranslation('translation');

  const [viewOption] = useState<ISelectLanguageOption[]>(LIST_LANGUAGE);

  const handleSelectChange = (value: ISelectLanguageOption[]) => {
    if (value.length === 0) {
      changeLng('en');
    } else {
      changeLng(value[0].value.toString() as ILanguageKeys);
    }
  };
  const valueLocal = useMemo(() => {
    const findOption = viewOption.find((e) => e.value === lng);
    if (!findOption) return [];
    return [findOption];
  }, [lng, viewOption]);

  return (
    <Select<ISelectLanguageOption>
      {...props}
      labelPlaceholder={t('form.language.placeholder')}
      option={viewOption}
      value={valueLocal}
      onChange={handleSelectChange}
    />
  );
};
