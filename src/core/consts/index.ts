import { transformObjectToArray } from '../functions';
import { ILanguage } from '../types';

export const OBJECT_LANGUAGE: ILanguage = {
  en: {
    value: 'en',
    label: 'English',
    placeholder: 'English',
    search: 'English, en',
  },
  ru: {
    value: 'ru',
    label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
    placeholder: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
    search: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439, ru',
  },
};

export const LIST_LANGUAGE = transformObjectToArray(OBJECT_LANGUAGE);
