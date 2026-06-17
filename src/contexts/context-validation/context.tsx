import { FC } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

import { IUseValidationDependencies, IValidationContext, IValidationProvider } from './context.types';

const ValidationContext = createContext<IValidationContext | null>(null);

export const useValidation = (props: IUseValidationDependencies): IValidationContext => {
  const context = useContextSelector(ValidationContext, (v) => {
    return v
      ? props.reduce((acc, prop) => {
          acc[prop] = v[prop];
          return acc;
        }, {} as any)
      : null;
  });
  if (!context) {
    throw new Error('useValidation must be used within an ProviderValidation');
  }
  return context;
};

export const ProviderValidation: FC<IValidationProvider> = (props) => {
  return <ValidationContext.Provider value={{}}>{props.children}</ValidationContext.Provider>;
};
