import { useAxios } from '@local/contexts/context-axios/context';
import { QUERY_KEYS, queryClient } from '@local/core/query';
import { ICustomMutationFn } from '@local/core/types';

import { infiniteQueryOptions, keepPreviousData, queryOptions, useMutation } from '@tanstack/react-query';

import { productsApi } from './api';
import {
  IAddProductRequest,
  IDeleteProductRequest,
  IDeletedProduct,
  IGetProductRequest,
  IGetProductsByCategoryRequest,
  IGetProductsRequest,
  IProduct,
  IProductCategory,
  IProductCategorySlug,
  IProductsListResponse,
  ISearchProductsRequest,
  IUpdateProductRequest,
} from './api.types';

const DEFAULT_PRODUCTS_LIMIT = 30;

const invalidateProductsCollections = () => {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.list],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.infiniteList],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.search],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.byCategory],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.categories],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.categoryList],
  });
};

const invalidateProductDetail = (id?: number) => {
  if (!id) return;

  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.dummy.products.detail, id],
  });
};

export const useProductsList = <TProduct extends Partial<IProduct> = IProduct>(props: IGetProductsRequest = {}) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () =>
      productsApi(axiosInstance)
        .getProducts<TProduct>(props)
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.list, props.query],
  });
};

export const useProductsInfiniteList = <TProduct extends Partial<IProduct> = IProduct>(
  props: IGetProductsRequest = {},
) => {
  const { axiosInstance } = useAxios(['axiosInstance']);
  const limit = props.query?.limit ?? DEFAULT_PRODUCTS_LIMIT;
  const skip = props.query?.skip ?? 0;

  return infiniteQueryOptions({
    getNextPageParam: (lastPage: IProductsListResponse<TProduct>) => {
      if (lastPage.limit === 0) return undefined;

      const nextSkip = lastPage.skip + lastPage.limit;

      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: skip,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) =>
      productsApi(axiosInstance)
        .getProducts<TProduct>({
          query: {
            ...props.query,
            limit,
            skip: pageParam,
          },
        })
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.infiniteList, props.query],
  });
};

export const useProduct = (props: IGetProductRequest) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    queryFn: () =>
      productsApi(axiosInstance)
        .getProduct(props)
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.detail, props.path.id],
  });
};

export const useProductFetch = () => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return async (props: IGetProductRequest) => {
    return queryClient.fetchQuery({
      queryFn: () =>
        productsApi(axiosInstance)
          .getProduct(props)
          .then((res) => res.data),
      queryKey: [QUERY_KEYS.dummy.products.detail, props.path.id],
    });
  };
};

export const useProductsSearch = <TProduct extends Partial<IProduct> = IProduct>(props: ISearchProductsRequest) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () =>
      productsApi(axiosInstance)
        .searchProducts<TProduct>(props)
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.search, props.query],
  });
};

export const useProductsCategories = () => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    queryFn: () =>
      productsApi(axiosInstance)
        .getProductsCategories()
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.categories],
  });
};

export const useProductsCategoryList = () => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    queryFn: () =>
      productsApi(axiosInstance)
        .getProductsCategoryList()
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.categoryList],
  });
};

export const useProductsByCategory = <TProduct extends Partial<IProduct> = IProduct>(
  props: IGetProductsByCategoryRequest,
) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: () =>
      productsApi(axiosInstance)
        .getProductsByCategory<TProduct>(props)
        .then((res) => res.data),
    queryKey: [QUERY_KEYS.dummy.products.byCategory, props.path.category, props.query],
  });
};

export const useProductAdd: ICustomMutationFn<IProduct, IAddProductRequest> = (options) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return useMutation({
    ...options,
    mutationFn: (payload) =>
      productsApi(axiosInstance)
        .addProduct(payload)
        .then((res) => res.data),
    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);
      invalidateProductsCollections();
      invalidateProductDetail(data?.id);
    },
  });
};

export const useProductUpdate: ICustomMutationFn<IProduct, IUpdateProductRequest> = (options) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return useMutation({
    ...options,
    mutationFn: (payload) =>
      productsApi(axiosInstance)
        .updateProduct(payload)
        .then((res) => res.data),
    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);
      invalidateProductsCollections();
      invalidateProductDetail(data?.id ?? variables.path.id);
    },
  });
};

export const useProductPatch: ICustomMutationFn<IProduct, IUpdateProductRequest> = (options) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return useMutation({
    ...options,
    mutationFn: (payload) =>
      productsApi(axiosInstance)
        .patchProduct(payload)
        .then((res) => res.data),
    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);
      invalidateProductsCollections();
      invalidateProductDetail(data?.id ?? variables.path.id);
    },
  });
};

export const useProductDelete: ICustomMutationFn<IDeletedProduct, IDeleteProductRequest> = (options) => {
  const { axiosInstance } = useAxios(['axiosInstance']);

  return useMutation({
    ...options,
    mutationFn: (payload) =>
      productsApi(axiosInstance)
        .deleteProduct(payload)
        .then((res) => res.data),
    onSettled: (data, error, variables, onMutateResult, context) => {
      options?.onSettled?.(data, error, variables, onMutateResult, context);
      invalidateProductsCollections();
      invalidateProductDetail(data?.id ?? variables.path.id);
    },
  });
};

export type IProductsCategoriesQueryData = IProductCategory[];

export type IProductsCategoryListQueryData = IProductCategorySlug[];
