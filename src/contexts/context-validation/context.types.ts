import { FormAsyncValidateOrFn } from '@tanstack/react-form';
import { PropsWithChildren } from 'react';
import * as yup from 'yup';

export type IValidationProvider = PropsWithChildren;

export type IValidationFunctions = {
  blur: (validation: yup.ObjectSchema<any>) => FormAsyncValidateOrFn<any>;
  change: (validation: yup.ObjectSchema<any>) => FormAsyncValidateOrFn<any>;
};

export type IValidationContext = {};

export type IUseValidationDependencies = (keyof IValidationContext)[];
