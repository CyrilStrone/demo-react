import { Table } from '@local/components/table';
import { IProduct, IProductReview, useProductFetch } from '@local/hooks/api/products';

import { useDialog } from '@jenesei-software/jenesei-kit-react/context-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { IUseDialog } from '@jenesei-software/jenesei-kit-react/context-dialog';

import './table-demo.css';

export interface IProductTableLabels {
  availability: string;
  brand: string;
  category: string;
  collapse: string;
  comment: string;
  date: string;
  detailsAction: string;
  dialogClose: string;
  detailsLoading: string;
  dimensions: string;
  discount: string;
  email: string;
  expand: string;
  factsTitle: string;
  field: string;
  imageFullscreen: string;
  imageNext: string;
  imagePrevious: string;
  imageSelect: string;
  imagesTitle: string;
  metrics: string;
  minimumOrder: string;
  noDetails: string;
  noReviews: string;
  price: string;
  product: string;
  rating: string;
  returnPolicy: string;
  reviewer: string;
  reviewsTitle: string;
  shipping: string;
  sku: string;
  stock: string;
  tags: string;
  value: string;
  warranty: string;
  weight: string;
}

interface IProductDetailsState {
  data: Record<number, IProduct | undefined>;
  loading: Record<number, boolean | undefined>;
}

interface IProductDetailRow {
  field: string;
  id: string;
  value: string;
}

interface IProductReviewRow extends IProductReview {
  id: string;
}

interface IProductDetailsDialogProps {
  labels: IProductTableLabels;
  product?: IProduct;
}

interface IProductImagesDialogProps {
  images: string[];
  initialIndex: number;
  labels: IProductTableLabels;
  productTitle: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en', {
    currency: 'USD',
    style: 'currency',
  }).format(price);

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getProductImages = (product: IProduct) => Array.from(new Set([product.thumbnail, ...product.images]));

export const useProductTableLabels = () => {
  const { t } = useTranslation('translation');

  return useMemo<IProductTableLabels>(
    () => ({
      availability: t('pages.table-demo.availability'),
      brand: t('pages.table-demo.brand'),
      category: t('pages.table-demo.category'),
      collapse: t('pages.table-demo.collapse'),
      comment: t('pages.table-demo.comment'),
      date: t('pages.table-demo.date'),
      detailsAction: t('pages.table-demo.detailsAction'),
      dialogClose: t('pages.table-demo.dialogClose'),
      detailsLoading: t('pages.table-demo.detailsLoading'),
      dimensions: t('pages.table-demo.dimensions'),
      discount: t('pages.table-demo.discount'),
      email: t('pages.table-demo.email'),
      expand: t('pages.table-demo.expand'),
      factsTitle: t('pages.table-demo.factsTitle'),
      field: t('pages.table-demo.field'),
      imageFullscreen: t('pages.table-demo.imageFullscreen'),
      imageNext: t('pages.table-demo.imageNext'),
      imagePrevious: t('pages.table-demo.imagePrevious'),
      imageSelect: t('pages.table-demo.imageSelect'),
      imagesTitle: t('pages.table-demo.imagesTitle'),
      metrics: t('pages.table-demo.metrics'),
      minimumOrder: t('pages.table-demo.minimumOrder'),
      noDetails: t('pages.table-demo.noDetails'),
      noReviews: t('pages.table-demo.noReviews'),
      price: t('pages.table-demo.price'),
      product: t('pages.table-demo.product'),
      rating: t('pages.table-demo.rating'),
      returnPolicy: t('pages.table-demo.returnPolicy'),
      reviewer: t('pages.table-demo.reviewer'),
      reviewsTitle: t('pages.table-demo.reviewsTitle'),
      shipping: t('pages.table-demo.shipping'),
      sku: t('pages.table-demo.sku'),
      stock: t('pages.table-demo.stock'),
      tags: t('pages.table-demo.tags'),
      value: t('pages.table-demo.value'),
      warranty: t('pages.table-demo.warranty'),
      weight: t('pages.table-demo.weight'),
    }),
    [t],
  );
};

function ProductImagesDialogContent(props: {
  isAnimating?: boolean;
  propsCustom?: IProductImagesDialogProps;
  remove?: () => void;
}) {
  const { propsCustom, remove } = props;
  const labels = propsCustom?.labels;
  const images = propsCustom?.images ?? [];
  const productTitle = propsCustom?.productTitle ?? '';
  const [selectedImageIndex, setSelectedImageIndex] = useState(propsCustom?.initialIndex ?? 0);
  const selectedImage = images[selectedImageIndex] ?? images[0];

  if (!labels || !selectedImage) return null;

  const selectPreviousImage = () => {
    setSelectedImageIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1));
  };
  const selectNextImage = () => {
    setSelectedImageIndex((currentIndex) => (currentIndex >= images.length - 1 ? 0 : currentIndex + 1));
  };

  return (
    <article className='table-demo__images-dialog'>
      <button aria-label={labels.dialogClose} className='table-demo__dialog-close' onClick={remove} type='button'>
        x
      </button>

      <div className='table-demo__images-stage'>
        {images.length > 1 && (
          <button
            aria-label={labels.imagePrevious}
            className='table-demo__images-arrow table-demo__images-arrow--previous'
            onClick={selectPreviousImage}
            type='button'
          >
            {'<'}
          </button>
        )}
        <img className='table-demo__images-main' src={selectedImage} alt={productTitle} />
        {images.length > 1 && (
          <button
            aria-label={labels.imageNext}
            className='table-demo__images-arrow table-demo__images-arrow--next'
            onClick={selectNextImage}
            type='button'
          >
            {'>'}
          </button>
        )}
      </div>

      <div className='table-demo__images-preview-list'>
        {images.map((image, index) => (
          <button
            aria-label={`${labels.imageSelect}: ${index + 1}`}
            className={[
              'table-demo__images-preview-button',
              index === selectedImageIndex ? 'table-demo__images-preview-button--active' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            key={image}
            onClick={() => setSelectedImageIndex(index)}
            type='button'
          >
            <img src={image} alt={`${productTitle} ${index + 1}`} />
          </button>
        ))}
      </div>
    </article>
  );
}

function ProductDetailsDialogBody(props: { labels: IProductTableLabels; product: IProduct; remove?: () => void }) {
  const { labels, product, remove } = props;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dimensions = `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`;
  const productImages = useMemo(() => getProductImages(product), [product]);
  const selectedImage = productImages[selectedImageIndex] ?? product.thumbnail;
  const propsImagesDialog = useMemo<IUseDialog<IProductImagesDialogProps>>(
    () => ({
      content: (params) => <ProductImagesDialogContent {...params} />,
      propsCustom: {
        images: productImages,
        initialIndex: selectedImageIndex,
        labels,
        productTitle: product.title,
      },
      propsDialog: {
        borderRadius: '10px',
        isRemoveOnOutsideClick: true,
        maxHeight: 'calc(100dvh - 24px)',
        maxWidth: 'calc(100vw - 24px)',
        padding: '0',
      },
    }),
    [labels, product.title, productImages, selectedImageIndex],
  );
  const { add: openImagesDialog } = useDialog(propsImagesDialog);

  return (
    <article className='table-demo__dialog'>
      <button aria-label={labels.dialogClose} className='table-demo__dialog-close' onClick={remove} type='button'>
        x
      </button>

      <div className='table-demo__dialog-visual'>
        <img className='table-demo__dialog-image' src={selectedImage} alt={product.title} />
        {productImages.length > 0 && (
          <button className='table-demo__dialog-fullscreen' onClick={openImagesDialog} type='button'>
            {labels.imageFullscreen}
          </button>
        )}
      </div>

      <div className='table-demo__dialog-content'>
        <div className='table-demo__dialog-heading'>
          <span className='table-demo__badge'>{product.category}</span>
          <h2 className='table-demo__dialog-title'>{product.title}</h2>
          <p className='table-demo__dialog-description'>{product.description}</p>
        </div>

        <div className='table-demo__dialog-metrics'>
          <span>
            <strong>{formatPrice(product.price)}</strong>
            {labels.price}
          </span>
          <span>
            <strong>{product.rating.toFixed(2)}</strong>
            {labels.rating}
          </span>
          <span>
            <strong>{product.stock}</strong>
            {labels.stock}
          </span>
        </div>

        <dl className='table-demo__dialog-list'>
          <div>
            <dt>{labels.brand}</dt>
            <dd>{product.brand ?? '-'}</dd>
          </div>
          <div>
            <dt>{labels.sku}</dt>
            <dd>{product.sku}</dd>
          </div>
          <div>
            <dt>{labels.availability}</dt>
            <dd>{product.availabilityStatus}</dd>
          </div>
          <div>
            <dt>{labels.discount}</dt>
            <dd>{product.discountPercentage}%</dd>
          </div>
          <div>
            <dt>{labels.weight}</dt>
            <dd>{product.weight}</dd>
          </div>
          <div>
            <dt>{labels.dimensions}</dt>
            <dd>{dimensions}</dd>
          </div>
          <div>
            <dt>{labels.minimumOrder}</dt>
            <dd>{product.minimumOrderQuantity}</dd>
          </div>
          <div>
            <dt>{labels.warranty}</dt>
            <dd>{product.warrantyInformation}</dd>
          </div>
          <div>
            <dt>{labels.shipping}</dt>
            <dd>{product.shippingInformation}</dd>
          </div>
          <div>
            <dt>{labels.returnPolicy}</dt>
            <dd>{product.returnPolicy}</dd>
          </div>
          <div>
            <dt>{labels.tags}</dt>
            <dd>{product.tags.join(', ')}</dd>
          </div>
        </dl>

        {productImages.length > 1 && (
          <div className='table-demo__dialog-gallery'>
            {productImages.map((image, index) => (
              <button
                aria-label={`${labels.imageSelect}: ${index + 1}`}
                className={[
                  'table-demo__dialog-gallery-button',
                  index === selectedImageIndex ? 'table-demo__dialog-gallery-button--active' : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={image}
                onClick={() => setSelectedImageIndex(index)}
                type='button'
              >
                <img src={image} alt={`${product.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}

        <section className='table-demo__dialog-reviews'>
          <h3 className='table-demo__dialog-section-title'>{labels.reviewsTitle}</h3>
          {product.reviews.length > 0 ? (
            <div className='table-demo__dialog-review-list'>
              {product.reviews.map((review, index) => (
                <article className='table-demo__dialog-review' key={`${review.reviewerEmail}-${index}`}>
                  <div className='table-demo__dialog-review-heading'>
                    <strong>{review.reviewerName}</strong>
                    <span>{review.rating}</span>
                  </div>
                  <p>{review.comment}</p>
                  <time>{formatDate(review.date)}</time>
                </article>
              ))}
            </div>
          ) : (
            <p className='table-demo__dialog-empty'>{labels.noReviews}</p>
          )}
        </section>
      </div>
    </article>
  );
}

function ProductDetailsDialogContent(props: {
  isAnimating?: boolean;
  propsCustom?: IProductDetailsDialogProps;
  remove?: () => void;
}) {
  const { propsCustom, remove } = props;
  const labels = propsCustom?.labels;
  const product = propsCustom?.product;

  if (!labels || !product) return null;

  return <ProductDetailsDialogBody labels={labels} product={product} remove={remove} />;
}

function ProductReviewExpandedTable(props: {
  columns: ColumnDef<IProductDetailRow, unknown>[];
  labels: IProductTableLabels;
  review: IProductReviewRow;
}) {
  const { columns, labels, review } = props;
  const rows = useMemo<IProductDetailRow[]>(
    () => [
      {
        field: labels.reviewer,
        id: 'reviewerName',
        value: review.reviewerName,
      },
      {
        field: labels.email,
        id: 'reviewerEmail',
        value: review.reviewerEmail,
      },
      {
        field: labels.rating,
        id: 'rating',
        value: String(review.rating),
      },
      {
        field: labels.date,
        id: 'date',
        value: formatDate(review.date),
      },
      {
        field: labels.comment,
        id: 'comment',
        value: review.comment,
      },
    ],
    [labels, review],
  );

  return (
    <Table
      className='table-demo__nested-table table-demo__nested-table--review-detail'
      columns={columns}
      data={rows}
      emptyText={labels.noDetails}
      getRowId={(row) => row.id}
    />
  );
}

function ProductDetailsButton(props: { labels: IProductTableLabels; product: IProduct }) {
  const { labels, product } = props;
  const propsDialog = useMemo<IUseDialog<IProductDetailsDialogProps>>(
    () => ({
      content: (params) => <ProductDetailsDialogContent {...params} />,
      propsCustom: {
        labels,
        product,
      },
      propsDialog: {
        borderRadius: '10px',
        isRemoveOnOutsideClick: false,
        maxHeight: 'calc(100dvh - 48px)',
        maxWidth: '980px',
        padding: '0',
      },
    }),
    [labels, product],
  );
  const { add: openProductDetails } = useDialog(propsDialog);

  return (
    <button
      aria-label={`${labels.detailsAction}: ${product.title}`}
      className='table-demo__details-button'
      onClick={(event) => {
        event.stopPropagation();
        openProductDetails();
      }}
      type='button'
    >
      i
    </button>
  );
}

export const useProductDetailsCache = () => {
  const fetchProduct = useProductFetch();
  const [state, setState] = useState<IProductDetailsState>({
    data: {},
    loading: {},
  });

  const loadProduct = useCallback(
    async (id: number) => {
      if (state.data[id] || state.loading[id]) return;

      setState((currentState) => ({
        ...currentState,
        loading: {
          ...currentState.loading,
          [id]: true,
        },
      }));

      try {
        const product = await fetchProduct({
          path: {
            id,
          },
        });

        setState((currentState) => ({
          data: {
            ...currentState.data,
            [id]: product,
          },
          loading: {
            ...currentState.loading,
            [id]: false,
          },
        }));
      } catch (error) {
        setState((currentState) => ({
          ...currentState,
          loading: {
            ...currentState.loading,
            [id]: false,
          },
        }));
        throw error;
      }
    },
    [fetchProduct, state.data, state.loading],
  );

  return {
    detailsById: state.data,
    isDetailsLoadingById: state.loading,
    loadProduct,
  };
};

export const useProductColumns = (
  labels: IProductTableLabels,
  loadProduct: (id: number) => Promise<void>,
  isDetailsLoadingById: Record<number, boolean | undefined>,
) => {
  return useMemo<ColumnDef<IProduct, unknown>[]>(
    () => [
      {
        cell: ({ row }) => {
          const isLoading = Boolean(isDetailsLoadingById[row.original.id]);
          const isExpanded = row.getIsExpanded();

          return (
            <button
              aria-label={isExpanded ? labels.collapse : labels.expand}
              className='table-demo__expand-button'
              disabled={isLoading}
              onClick={(event) => {
                event.stopPropagation();
                if (isExpanded) {
                  row.toggleExpanded(false);
                  return;
                }

                void loadProduct(row.original.id)
                  .then(() => row.toggleExpanded(true))
                  .catch(() => undefined);
              }}
              type='button'
            >
              {isLoading ? '...' : isExpanded ? 'v' : '>'}
            </button>
          );
        },
        header: '',
        id: 'expander',
        meta: {
          width: '54px',
        },
      },
      {
        cell: ({ row }) => <ProductDetailsButton labels={labels} product={row.original} />,
        header: '',
        id: 'details',
        meta: {
          cellClassName: 'table-demo__action-cell',
          width: '46px',
        },
      },
      {
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className='table-demo__product'>
            <img className='table-demo__product-image' src={row.original.thumbnail} alt={row.original.title} />
            <span className='table-demo__product-text'>
              <span className='table-demo__product-title'>{row.original.title}</span>
              <span className='table-demo__muted table-demo__ellipsis'>{row.original.description}</span>
            </span>
          </div>
        ),
        header: labels.product,
        meta: {
          minWidth: '280px',
        },
      },
      {
        accessorKey: 'category',
        cell: ({ getValue }) => <span className='table-demo__badge'>{String(getValue())}</span>,
        header: labels.category,
        meta: {
          minWidth: '160px',
          width: '180px',
        },
      },
      {
        columns: [
          {
            accessorKey: 'price',
            cell: ({ getValue }) => formatPrice(Number(getValue())),
            header: labels.price,
            meta: {
              align: 'right',
              width: '110px',
            },
          },
          {
            accessorKey: 'rating',
            cell: ({ getValue }) => Number(getValue()).toFixed(2),
            header: labels.rating,
            meta: {
              align: 'right',
              width: '100px',
            },
          },
          {
            accessorKey: 'stock',
            header: labels.stock,
            meta: {
              align: 'right',
              width: '100px',
            },
          },
        ],
        header: labels.metrics,
        id: 'metrics',
        meta: {
          headerAlign: 'center',
          headerClassName: 'table-demo__metrics-header',
        },
      },
    ],
    [isDetailsLoadingById, labels, loadProduct],
  );
};

export function ProductExpandedContent(props: {
  isLoading?: boolean;
  labels: IProductTableLabels;
  product?: IProduct;
}) {
  const { isLoading, labels, product } = props;

  const factRows = useMemo<IProductDetailRow[]>(() => {
    if (!product) return [];

    return [
      {
        field: labels.brand,
        id: 'brand',
        value: product.brand ?? '-',
      },
      {
        field: labels.sku,
        id: 'sku',
        value: product.sku,
      },
      {
        field: labels.availability,
        id: 'availability',
        value: product.availabilityStatus,
      },
      {
        field: labels.category,
        id: 'category',
        value: product.category,
      },
    ];
  }, [labels, product]);

  const reviewRows = useMemo<IProductReviewRow[]>(
    () =>
      product?.reviews.map((review, index) => ({
        ...review,
        id: `${review.reviewerEmail}-${index}`,
      })) ?? [],
    [product],
  );

  const detailColumns = useMemo<ColumnDef<IProductDetailRow, unknown>[]>(
    () => [
      {
        accessorKey: 'field',
        header: labels.field,
        meta: {
          width: '150px',
        },
      },
      {
        accessorKey: 'value',
        header: labels.value,
      },
    ],
    [labels.field, labels.value],
  );

  const reviewColumns = useMemo<ColumnDef<IProductReviewRow, unknown>[]>(
    () => [
      {
        cell: ({ row }) => {
          const isExpanded = row.getIsExpanded();

          return (
            <button
              aria-label={isExpanded ? labels.collapse : labels.expand}
              className='table-demo__expand-button table-demo__expand-button--small'
              onClick={(event) => {
                event.stopPropagation();
                row.toggleExpanded();
              }}
              type='button'
            >
              {isExpanded ? 'v' : '>'}
            </button>
          );
        },
        header: '',
        id: 'expander',
        meta: {
          width: '48px',
        },
      },
      {
        accessorKey: 'reviewerName',
        header: labels.reviewer,
        meta: {
          minWidth: '180px',
        },
      },
      {
        accessorKey: 'rating',
        header: labels.rating,
        meta: {
          align: 'right',
          width: '90px',
        },
      },
      {
        accessorKey: 'comment',
        header: labels.comment,
        meta: {
          minWidth: '240px',
        },
      },
    ],
    [labels.collapse, labels.comment, labels.expand, labels.rating, labels.reviewer],
  );

  if (isLoading) {
    return <div className='table__state'>{labels.detailsLoading}</div>;
  }

  if (!product) {
    return <div className='table__state'>{labels.noDetails}</div>;
  }

  return (
    <div className='table-demo__expanded'>
      <div className='table-demo__nested-group'>
        <div className='table-demo__nested-caption'>{labels.factsTitle}</div>
        <Table
          className='table-demo__nested-table'
          columns={detailColumns}
          data={factRows}
          emptyText={labels.noDetails}
          getRowId={(row) => row.id}
        />
      </div>
      <div className='table-demo__nested-group'>
        <div className='table-demo__nested-caption'>{labels.reviewsTitle}</div>
        <Table
          className='table-demo__nested-table'
          columns={reviewColumns}
          data={reviewRows}
          emptyText={labels.noReviews}
          getRowCanExpand={() => true}
          getRowId={(row) => row.id}
          renderExpandedRow={({ row }) => (
            <ProductReviewExpandedTable columns={detailColumns} labels={labels} review={row.original} />
          )}
        />
      </div>
    </div>
  );
}
