import { Table } from '@local/components/table';
import { IProduct, useProductsInfiniteList } from '@local/hooks/api/products';
import {
  ProductExpandedContent,
  useProductColumns,
  useProductDetailsCache,
  useProductTableLabels,
} from '@local/pages/public/table-demo/products-table.shared';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 20;
const EXPANDED_PRODUCT_ESTIMATE_HEIGHT = 540;

export function PageProductsVirtual() {
  const { t } = useTranslation('translation');
  const labels = useProductTableLabels();
  const queryProps = useMemo(
    () => ({
      query: {
        limit: PAGE_SIZE,
      },
    }),
    [],
  );
  const productsQuery = useInfiniteQuery(useProductsInfiniteList(queryProps));
  const { detailsById, isDetailsLoadingById, loadProduct } = useProductDetailsCache();
  const columns = useProductColumns(labels, loadProduct, isDetailsLoadingById);

  const products = useMemo<IProduct[]>(
    () => productsQuery.data?.pages.flatMap((page) => page.products) ?? [],
    [productsQuery.data?.pages],
  );
  const totalProducts = productsQuery.data?.pages[0]?.total ?? 0;

  const fetchNextPage = useCallback(() => {
    if (!productsQuery.hasNextPage || productsQuery.isFetchingNextPage) return;

    void productsQuery.fetchNextPage();
  }, [productsQuery]);

  return (
    <section className='table-demo'>
      <header className='table-demo__header'>
        <h1 className='table-demo__title'>{t('pages.table-demo.virtualTitle')}</h1>
        <p className='table-demo__subtitle'>{t('pages.table-demo.virtualSubtitle')}</p>
      </header>

      <div className='table-demo__toolbar'>
        <nav className='table-demo__nav'>
          <Link className='table-demo__nav-link' to='/pu/products-virtual'>
            {t('pages.table-demo.showVirtual')}
          </Link>
          <Link className='table-demo__nav-link' to='/pu/products-pagination'>
            {t('pages.table-demo.showPagination')}
          </Link>
        </nav>
        <span className='table-demo__counter'>
          {t('pages.table-demo.virtualCounter', {
            loaded: products.length,
            total: totalProducts,
          })}
        </span>
      </div>

      <Table
        columns={columns}
        data={products}
        emptyText={t('pages.table-demo.empty')}
        fetchingText={t('pages.table-demo.fetching')}
        getRowCanExpand={() => true}
        getRowId={(row) => String(row.id)}
        isLoading={productsQuery.isLoading}
        loadingText={t('pages.table-demo.detailsLoading')}
        mode='virtual'
        renderExpandedRow={({ row }) => (
          <ProductExpandedContent
            isLoading={isDetailsLoadingById[row.original.id]}
            labels={labels}
            product={detailsById[row.original.id]}
          />
        )}
        tableLabel={t('pages.table-demo.virtualTitle')}
        virtual={{
          estimateExpandedSize: () => EXPANDED_PRODUCT_ESTIMATE_HEIGHT,
          hasNextPage: productsQuery.hasNextPage,
          height: 640,
          isFetchingNextPage: productsQuery.isFetchingNextPage,
          onEndReached: fetchNextPage,
        }}
      />
    </section>
  );
}
