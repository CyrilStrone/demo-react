import axios from 'axios'
import { FC, useMemo } from 'react'

import { env } from '@local/core/envs'
import { createContext, useContextSelector } from 'use-context-selector'
import { IAxiosContext, IAxiosProvider, IUseAxiosDependencies } from './context.types'


const AxiosContext = createContext<IAxiosContext | null>(null)

export const useAxios = (props: IUseAxiosDependencies): IAxiosContext => {
  const context = useContextSelector(AxiosContext, (v) => {
    return v
      ? props.reduce((acc, prop) => {
        acc[prop] = v[prop];
        return acc;
      }, {} as any)
      : null;
  });
  if (!context) {
    throw new Error('useAxios must be used within an ProviderAxios');
  }
  return context;
};

export const ProviderAxios: FC<IAxiosProvider> = props => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: env.apiURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    instance.interceptors.response.use(
      response => response,
      async error => {
        return Promise.reject(error)
      }
    )

    return instance
  }, [])


  return (
    <AxiosContext.Provider
      value={{
        axiosInstance
      }}
    >
      {props.children}
    </AxiosContext.Provider>
  )
}
