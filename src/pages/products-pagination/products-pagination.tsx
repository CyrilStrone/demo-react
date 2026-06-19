import { Table } from '@local/components/table';
import { useProductsList } from '@local/hooks/api/products';
import {
  ProductExpandedContent,
  useProductColumns,
  useProductDetailsCache,
  useProductTableLabels,
} from '@local/pages/table-demo/products-table.shared';

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PageProductsPagination() {
  const { t } = useTranslation('translation');
  const labels = useProductTableLabels();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { detailsById, isDetailsLoadingById, loadProduct } = useProductDetailsCache();
  const columns = useProductColumns(labels, loadProduct, isDetailsLoadingById);

  const queryProps = useMemo(
    () => ({
      query: {
        limit: pageSize,
        skip: pageIndex * pageSize,
      },
    }),
    [pageIndex, pageSize],
  );
  const productsQuery = useQuery(useProductsList(queryProps));
  const products = productsQuery.data?.products ?? [];
  const totalProducts = productsQuery.data?.total ?? 0;

  return (
    <section className='table-demo'>
      <header className='table-demo__header'>
        <h1 className='table-demo__title'>{t('pages.table-demo.paginationTitle')}</h1>
        <p className='table-demo__subtitle'>{t('pages.table-demo.paginationSubtitle')}</p>
      </header>

      <div className='table-demo__toolbar'>
        <nav className='table-demo__nav'>
          <Link className='table-demo__nav-link' to='/products-virtual'>
            {t('pages.table-demo.showVirtual')}
          </Link>
          <Link className='table-demo__nav-link' to='/products-pagination'>
            {t('pages.table-demo.showPagination')}
          </Link>
        </nav>
      </div>

      <Table
        columns={columns}
        data={products}
        emptyText={t('pages.table-demo.empty')}
        getRowCanExpand={() => true}
        getRowId={(row) => String(row.id)}
        isLoading={productsQuery.isLoading}
        loadingText={t('pages.table-demo.detailsLoading')}
        pagination={{
          isDisabled: productsQuery.isFetching,
          onPageChange: setPageIndex,
          onPageSizeChange: (nextPageSize) => {
            setPageIndex(0);
            setPageSize(nextPageSize);
          },
          pageIndex,
          pageSize,
          totalItems: totalProducts,
        }}
        paginationLabels={{
          firstPage: t('pages.table-demo.firstPage'),
          lastPage: t('pages.table-demo.lastPage'),
          nextPage: t('pages.table-demo.nextPage'),
          pageStatus: (currentPageIndex, pageCount) =>
            t('pages.table-demo.pageStatus', {
              page: currentPageIndex + 1,
              pageCount,
            }),
          previousPage: t('pages.table-demo.previousPage'),
          rowsPerPage: t('pages.table-demo.rowsPerPage'),
        }}
        renderExpandedRow={({ row }) => (
          <ProductExpandedContent
            isLoading={isDetailsLoadingById[row.original.id]}
            labels={labels}
            product={detailsById[row.original.id]}
          />
        )}
        tableLabel={t('pages.table-demo.paginationTitle')}
      />
    </section>
  );
}
