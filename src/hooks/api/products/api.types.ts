import { IPaginationQueryRequest } from '@local/core/types';

export type IProductSortOrder = 'asc' | 'desc';

export interface IProductDimensions {
  depth: number;
  height: number;
  width: number;
}

export interface IProductReview {
  comment: string;
  date: string;
  rating: number;
  reviewerEmail: string;
  reviewerName: string;
}

export interface IProductMeta {
  barcode: string;
  createdAt: string;
  qrCode: string;
  updatedAt: string;
}

export interface IProduct {
  availabilityStatus: string;
  brand?: string;
  category: string;
  description: string;
  dimensions: IProductDimensions;
  discountPercentage: number;
  id: number;
  images: string[];
  meta: IProductMeta;
  minimumOrderQuantity: number;
  price: number;
  rating: number;
  returnPolicy: string;
  reviews: IProductReview[];
  shippingInformation: string;
  sku: string;
  stock: number;
  tags: string[];
  thumbnail: string;
  title: string;
  warrantyInformation: string;
  weight: number;
}

export type IProductSelectField = keyof IProduct;

export interface IProductListQuery extends Omit<IPaginationQueryRequest, 'q'> {
  delay?: number;
  order?: IProductSortOrder;
  select?: IProductSelectField | IProductSelectField[] | string;
  sortBy?: IProductSelectField | string;
}

export interface IProductSearchQuery extends IProductListQuery {
  q: string;
}

export interface IProductsListResponse<TProduct extends Partial<IProduct> = IProduct> {
  limit: number;
  products: TProduct[];
  skip: number;
  total: number;
}

export interface IProductCategory {
  name: string;
  slug: string;
  url: string;
}

export type IProductCategorySlug = string;

export type IProductWritableFields = Omit<IProduct, 'id' | 'meta' | 'reviews'>;

export type IProductCreateBody = Partial<IProductWritableFields> & Pick<IProduct, 'title'>;

export type IProductUpdateBody = Partial<IProductWritableFields>;

export type IDeletedProduct = IProduct & {
  deletedOn: string;
  isDeleted: boolean;
};

export interface IGetProductsRequest {
  query?: IProductListQuery;
}

export interface ISearchProductsRequest {
  query: IProductSearchQuery;
}

export interface IGetProductRequest {
  path: {
    id: number;
  };
}

export interface IGetProductsByCategoryRequest {
  path: {
    category: IProductCategorySlug;
  };
  query?: IProductListQuery;
}

export interface IAddProductRequest {
  body: IProductCreateBody;
}

export interface IUpdateProductRequest {
  body: IProductUpdateBody;
  path: {
    id: number;
  };
}

export interface IDeleteProductRequest {
  path: {
    id: number;
  };
}
