import { AxiosInstance } from 'axios'
import { ReactNode } from 'react'


export interface IAxiosProvider {
  children: ReactNode
}

export interface IAxiosContext {
  axiosInstance: AxiosInstance
}
export type IUseAxiosDependencies = (keyof IAxiosContext)[];
