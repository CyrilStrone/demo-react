import { UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type ILanguageKeys = 'en' | 'ru';
export type ILanguage = Record<
  ILanguageKeys,
  { value: ILanguageKeys; label: string; placeholder: string; search: string }
>;
export interface IAxiosResponseDto {
  statusCode?: number;
  status?: string | number;
  message?: string | string[];
  error?: string | string[];
}

export type ICustomMutationFn<

  TData = unknown,

  TVariables = void,

  TError = AxiosError<IAxiosResponseDto>,

  TContext = unknown

> = (
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) => UseMutationResult<TData, TError, TVariables, TContext>



export type ICustomQueryFn<TData = unknown, TProps = undefined> = TProps extends undefined
  ? (
    options?: Omit<UseQueryOptions<TData, AxiosError<IAxiosResponseDto>>, 'queryFn' | 'queryKey'>
  ) => UseQueryResult<TData, AxiosError<IAxiosResponseDto>>
  : (
    options: Omit<UseQueryOptions<TData, AxiosError<IAxiosResponseDto>>, 'queryFn' | 'queryKey'>,
    props: TProps
  ) => UseQueryResult<TData, AxiosError<IAxiosResponseDto>>



export interface IPaginationQueryRequest {
  limit?: number;
  skip?: number;
  q?: string;
}
