export type ILanguageKeys = 'en' | 'ru';
export type ILanguage = Record<
  ILanguageKeys,
  { value: ILanguageKeys; label: string; placeholder: string; search: string }
>;
export interface AxiosResponseDto {
  statusCode?: number;
  message?: string;
  error?: string[];
}
