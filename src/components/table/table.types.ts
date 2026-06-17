import { ColumnDef, ExpandedState, OnChangeFn, Row, RowData } from '@tanstack/react-table';
import { CSSProperties, ReactNode } from 'react';

export type ITableMode = 'pagination' | 'virtual';

export interface ITableColumnMeta {
  align?: CSSProperties['textAlign'];
  cellClassName?: string;
  headerAlign?: CSSProperties['textAlign'];
  headerClassName?: string;
  maxWidth?: string;
  minWidth?: string;
  width?: string;
}

export interface ITablePaginationProps {
  isDisabled?: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalItems: number;
}

export interface ITablePaginationLabels {
  firstPage: string;
  lastPage: string;
  nextPage: string;
  pageStatus?: (pageIndex: number, pageCount: number) => string;
  previousPage: string;
  rowsPerPage: string;
}

export interface ITableVirtualProps<TData extends object> {
  endReachedThreshold?: number;
  estimateExpandedSize?: (row: Row<TData>) => number;
  estimateSize?: (index: number) => number;
  hasNextPage?: boolean;
  height?: number | string;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
  overscan?: number;
  scrollToTopKey?: unknown;
  shouldAdjustScrollPositionOnItemSizeChange?: boolean;
}

export interface ITableExpandedRowRenderProps<TData extends object> {
  depth: number;
  row: Row<TData>;
}

export interface ITableProps<TData extends object> {
  className?: string;
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  emptyText?: string;
  expanded?: ExpandedState;
  fetchingText?: string;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  isHeaderVisible?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  mode?: ITableMode;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onRowClick?: (row: Row<TData>) => void;
  pagination?: ITablePaginationProps;
  paginationLabels?: ITablePaginationLabels;
  renderExpandedRow?: (props: ITableExpandedRowRenderProps<TData>) => ReactNode;
  rowClassName?: (row: Row<TData>) => string | undefined;
  tableLabel?: string;
  virtual?: ITableVirtualProps<TData>;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> extends ITableColumnMeta {}
}
