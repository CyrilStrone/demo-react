import { AxiosInstance } from 'axios';

import {
  IAddProductRequest,
  IDeletedProduct,
  IDeleteProductRequest,
  IGetProductRequest,
  IGetProductsByCategoryRequest,
  IGetProductsRequest,
  IProduct,
  IProductCategory,
  IProductCategorySlug,
  IProductListQuery,
  IProductsListResponse,
  IProductSearchQuery,
  ISearchProductsRequest,
  IUpdateProductRequest,
} from './api.types';

const getProductQueryParams = (query?: IProductListQuery | IProductSearchQuery) => {
  if (!query) return undefined;

  const { select, ...params } = query;

  return {
    ...params,
    select: Array.isArray(select) ? select.join(',') : select,
  };
};

export const productsApi = (axiosInstance: AxiosInstance) => ({
  addProduct: (props: IAddProductRequest) => axiosInstance.post<IProduct>('/products/add', props.body),
  deleteProduct: (props: IDeleteProductRequest) => axiosInstance.delete<IDeletedProduct>(`/products/${props.path.id}`),
  getProduct: (props: IGetProductRequest) => axiosInstance.get<IProduct>(`/products/${props.path.id}`),
  getProducts: <TProduct extends Partial<IProduct> = IProduct>(props: IGetProductsRequest = {}) =>
    axiosInstance.get<IProductsListResponse<TProduct>>('/products', {
      params: getProductQueryParams(props.query),
    }),
  getProductsByCategory: <TProduct extends Partial<IProduct> = IProduct>(props: IGetProductsByCategoryRequest) =>
    axiosInstance.get<IProductsListResponse<TProduct>>(`/products/category/${props.path.category}`, {
      params: getProductQueryParams(props.query),
    }),
  getProductsCategories: () => axiosInstance.get<IProductCategory[]>('/products/categories'),
  getProductsCategoryList: () => axiosInstance.get<IProductCategorySlug[]>('/products/category-list'),
  patchProduct: (props: IUpdateProductRequest) =>
    axiosInstance.patch<IProduct>(`/products/${props.path.id}`, props.body),
  searchProducts: <TProduct extends Partial<IProduct> = IProduct>(props: ISearchProductsRequest) =>
    axiosInstance.get<IProductsListResponse<TProduct>>('/products/search', {
      params: getProductQueryParams(props.query),
    }),
  updateProduct: (props: IUpdateProductRequest) =>
    axiosInstance.put<IProduct>(`/products/${props.path.id}`, props.body),
});
