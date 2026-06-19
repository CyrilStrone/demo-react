import {
  Column,
  ExpandedState,
  Row,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { KeyboardEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

import { ITableProps } from './table.types';

import './table.css';
import { Button } from '@jenesei-software/jenesei-kit-react';

interface ITableMeasureContext {
  requestMeasure: () => void;
}

const TableMeasureContext = createContext<ITableMeasureContext | null>(null);

const DEFAULT_ROW_HEIGHT = 64;
const DEFAULT_EXPANDED_ROW_HEIGHT = 180;
const DEFAULT_OVERSCAN = 8;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];
const DEFAULT_END_REACHED_THRESHOLD = 480;
const DEFAULT_PAGINATION_LABELS = {
  firstPage: 'First',
  lastPage: 'Last',
  nextPage: 'Next',
  previousPage: 'Prev',
  rowsPerPage: 'Rows',
};

const getGridTemplateColumns = <TData extends object>(columns: Column<TData, unknown>[]) => {
  if (columns.length === 0) return undefined;

  return columns
    .map((column) => {
      const meta = column.columnDef.meta;

      if (meta?.width) return meta.width;

      if (meta?.minWidth || meta?.maxWidth) {
        return `minmax(${meta.minWidth ?? '120px'}, ${meta.maxWidth ?? '1fr'})`;
      }

      return 'minmax(120px, 1fr)';
    })
    .join(' ');
};

export function Table<TData extends object>(props: ITableProps<TData>) {
  const {
    className,
    columns,
    data,
    emptyText = 'No data',
    expanded,
    fetchingText = 'Loading more...',
    getRowCanExpand,
    getRowId,
    isHeaderVisible = true,
    isLoading,
    loadingText = 'Loading...',
    mode = 'pagination',
    onExpandedChange,
    onRowClick,
    pagination,
    paginationLabels,
    renderExpandedRow,
    rowClassName,
    tableLabel,
    virtual,
  } = props;

  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const itemElementsRef = useRef(new Map<string, HTMLDivElement>());
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const parentRequestMeasure = useContextSelector(TableMeasureContext, (context) => context?.requestMeasure);
  const expandedState = expanded ?? internalExpanded;

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => getRowCanExpand?.(row) ?? Boolean(renderExpandedRow),
    getRowId,
    onExpandedChange: onExpandedChange ?? setInternalExpanded,
    state: {
      expanded: expandedState,
    },
  });

  const rows = table.getRowModel().rows;
  const expandedRowsCount = useMemo(() => {
    if (expandedState === true) return rows.length;

    return Object.values(expandedState).filter(Boolean).length;
  }, [expandedState, rows.length]);
  const gridTemplateColumns = getGridTemplateColumns(table.getVisibleLeafColumns());

  const isVirtualMode = mode === 'virtual';
  const virtualizer = useVirtualizer({
    count: rows.length,
    enabled: isVirtualMode,
    estimateSize: (index) => {
      const row = rows[index];
      const estimatedRowHeight = virtual?.estimateSize?.(index) ?? DEFAULT_ROW_HEIGHT;

      if (row?.getIsExpanded()) {
        return estimatedRowHeight + (virtual?.estimateExpandedSize?.(row) ?? DEFAULT_EXPANDED_ROW_HEIGHT);
      }

      return estimatedRowHeight;
    },
    getScrollElement: () => scrollElementRef.current,
    getItemKey: (index) => {
      const row = rows[index];

      return row?.id ?? index;
    },
    overscan: virtual?.overscan ?? DEFAULT_OVERSCAN,
    useAnimationFrameWithResizeObserver: true,
  });
  virtualizer.shouldAdjustScrollPositionOnItemSizeChange = () =>
    virtual?.shouldAdjustScrollPositionOnItemSizeChange ?? false;

  const measureVisibleItems = useCallback(() => {
    itemElementsRef.current.forEach((element, rowId) => {
      if (!element.isConnected) {
        itemElementsRef.current.delete(rowId);
        return;
      }

      virtualizer.measureElement(element);
    });
  }, [virtualizer]);

  const requestMeasure = useCallback(() => {
    const scrollElement = scrollElementRef.current;
    const scrollTop = scrollElement?.scrollTop;

    parentRequestMeasure?.();

    if (!isVirtualMode) return;

    measureVisibleItems();

    if (scrollElement && scrollTop !== undefined && !virtual?.shouldAdjustScrollPositionOnItemSizeChange) {
      scrollElement.scrollTop = scrollTop;
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollTop;
      });
    }
  }, [isVirtualMode, measureVisibleItems, parentRequestMeasure, virtual?.shouldAdjustScrollPositionOnItemSizeChange]);
  const measureContextValue = useMemo<ITableMeasureContext>(
    () => ({
      requestMeasure,
    }),
    [requestMeasure],
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalVirtualHeight = virtualizer.getTotalSize();
  const firstVirtualItem = virtualItems[0];
  const lastVirtualItem = virtualItems.at(-1);
  const virtualPaddingTop = firstVirtualItem?.start ?? 0;
  const virtualPaddingBottom = Math.max(0, totalVirtualHeight - (lastVirtualItem?.end ?? 0));
  const visibleRows = isVirtualMode
    ? virtualItems.map((virtualItem) => ({
        row: rows[virtualItem.index],
        virtualItem,
      }))
    : rows.map((row) => ({
        row,
        virtualItem: null,
      }));

  useEffect(() => {
    if (!isVirtualMode) return;
    if (virtual?.scrollToTopKey === undefined) return;

    scrollElementRef.current?.scrollTo({
      top: 0,
    });
  }, [isVirtualMode, virtual?.scrollToTopKey]);

  useLayoutEffect(() => {
    if (expandedRowsCount === 0 && !isVirtualMode && !parentRequestMeasure) return;

    requestMeasure();
  }, [expandedRowsCount, isVirtualMode, parentRequestMeasure, requestMeasure]);

  useEffect(() => {
    if (!isVirtualMode || !virtual?.onEndReached || !virtual.hasNextPage || virtual.isFetchingNextPage) return;

    const lastItem = virtualItems.at(-1);

    if (!lastItem) return;

    const distanceToEnd = totalVirtualHeight - lastItem.end;

    if (distanceToEnd <= (virtual.endReachedThreshold ?? DEFAULT_END_REACHED_THRESHOLD)) {
      virtual.onEndReached();
    }
  }, [
    isVirtualMode,
    totalVirtualHeight,
    virtual?.endReachedThreshold,
    virtual?.hasNextPage,
    virtual?.isFetchingNextPage,
    virtual?.onEndReached,
    virtualItems,
  ]);

  const isEmpty = !isLoading && rows.length === 0;
  const pageSizeOptions = pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const pageCount = pagination ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize)) : 1;
  const paginationText = {
    ...DEFAULT_PAGINATION_LABELS,
    ...paginationLabels,
  };
  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: Row<TData>) => {
    if (!onRowClick) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };
  const setVirtualItemElement = useCallback(
    (rowId: string) => (element: HTMLDivElement | null) => {
      if (!isVirtualMode) return;

      if (!element) {
        itemElementsRef.current.delete(rowId);
        virtualizer.measureElement(null);
        return;
      }

      itemElementsRef.current.set(rowId, element);
      virtualizer.measureElement(element);
    },
    [isVirtualMode, virtualizer],
  );

  return (
    <TableMeasureContext.Provider value={measureContextValue}>
      <section className={['table', className].filter(Boolean).join(' ')} aria-label={tableLabel}>
        <div className='table__frame'>
          {isHeaderVisible && (
            <div className='table__header'>
              {table.getHeaderGroups().map((headerGroup) => (
                <div className='table__row table__row--header' key={headerGroup.id} style={{ gridTemplateColumns }}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta;

                    return (
                      <div
                        className={['table__cell table__cell--header', meta?.headerClassName].filter(Boolean).join(' ')}
                        key={header.id}
                        style={{
                          gridColumn: `span ${header.colSpan}`,
                          textAlign: meta?.headerAlign ?? meta?.align,
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          <div
            className={['table__body', isVirtualMode ? 'table__body--virtual' : undefined].filter(Boolean).join(' ')}
            ref={scrollElementRef}
            style={{
              height: isVirtualMode ? virtual?.height : undefined,
            }}
          >
            {isLoading && <div className='table__state'>{loadingText}</div>}
            {isEmpty && <div className='table__state'>{emptyText}</div>}

            {!isLoading && !isEmpty && (
              <div
                className='table__items'
                style={{
                  paddingBottom: isVirtualMode ? `${virtualPaddingBottom}px` : undefined,
                  paddingTop: isVirtualMode ? `${virtualPaddingTop}px` : undefined,
                }}
              >
                {visibleRows.map(({ row, virtualItem }) => {
                  if (!row) return null;

                  const isExpanded = row.getIsExpanded();
                  const itemKey = row.id;

                  return (
                    <div
                      className={['table__virtual-item', isExpanded ? 'table__virtual-item--expanded' : undefined]
                        .filter(Boolean)
                        .join(' ')}
                      data-index={virtualItem?.index}
                      key={itemKey}
                      ref={virtualItem ? setVirtualItemElement(row.id) : undefined}
                    >
                      <div
                        className={['table__row', rowClassName?.(row)].filter(Boolean).join(' ')}
                        onKeyDown={(event) => handleRowKeyDown(event, row)}
                        onClick={() => onRowClick?.(row)}
                        style={{ gridTemplateColumns }}
                        tabIndex={onRowClick ? 0 : undefined}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta;

                          return (
                            <span
                              className={['table__cell', meta?.cellClassName].filter(Boolean).join(' ')}
                              key={cell.id}
                              style={{
                                textAlign: meta?.align,
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          );
                        })}
                      </div>

                      {isExpanded && (
                        <div className='table__expanded-row'>
                          {renderExpandedRow?.({
                            depth: row.depth + 1,
                            row,
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {isVirtualMode && virtual?.isFetchingNextPage && <div className='table__state'>{fetchingText}</div>}
          </div>
        </div>

        {pagination && (
          <div className='table__pagination'>
            <span className='table__pagination-status'>
              {paginationLabels?.pageStatus?.(pagination.pageIndex, pageCount) ??
                `${pagination.pageIndex + 1} / ${pageCount}`}
            </span>
            <label className='table__pagination-size'>
              <span>{paginationText.rowsPerPage}</span>
              <select
                disabled={pagination.isDisabled}
                onChange={(event) => pagination.onPageSizeChange(Number(event.target.value))}
                value={pagination.pageSize}
              >
                {pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </label>
            <div className='table__pagination-actions'>
              <Button
                isDisabled={pagination.isDisabled || pagination.pageIndex === 0}
                isHidden={pagination.isDisabled || pagination.pageIndex === 0}
                genre='primary'
                size='medium'
                onClick={() => pagination.onPageChange(0)}
              >
                {paginationText.firstPage}
              </Button>

              <Button
                isDisabled={pagination.isDisabled || pagination.pageIndex === 0}
                isHidden={pagination.isDisabled || pagination.pageIndex === 0}
                genre='primary'
                size='medium'
                onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                type='button'
              >
                {paginationText.previousPage}
              </Button>
              <Button
                isDisabled={pagination.isDisabled || pagination.pageIndex >= pageCount - 1}
                isHidden={pagination.isDisabled || pagination.pageIndex >= pageCount - 1}
                genre='primary'
                size='medium'
                onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                type='button'
              >
                {paginationText.nextPage}
              </Button>
              <Button
                isDisabled={pagination.isDisabled || pagination.pageIndex >= pageCount - 1}
                isHidden={pagination.isDisabled || pagination.pageIndex >= pageCount - 1}
                genre='primary'
                size='medium'
                onClick={() => pagination.onPageChange(pageCount - 1)}
              >
                {paginationText.lastPage}
              </Button>
            </div>
          </div>
        )}
      </section>
    </TableMeasureContext.Provider>
  );
}
