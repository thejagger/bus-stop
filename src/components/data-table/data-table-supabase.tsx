"use client"

import * as React from "react"
import {
  type CellContext,
  type ColumnDef, type FilterFnOption,
  flexRender,
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
  type RowData,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import {z} from "zod";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import type {PostgrestFilterBuilder} from "@supabase/postgrest-js";
import {Error} from "@/components/error.tsx";
import {DataTableSkeleton} from "@/components/skeletons/data-table-skeleton.tsx";
import {
  DataTableColumnHeader
} from "@/components/data-table/data-table-column-header.tsx";
import {DataTablePagination} from "@/components/data-table/data-table-pagination.tsx";
import type {BaseModel} from "@/lib/base.model.ts";
import {
  DataTableActions,
  DefaultCopyAction,
  DefaultDeleteAction, DefaultEditAction
} from "@/components/data-table/data-table-actions.tsx";
import {type JSX, useMemo, useCallback} from "react";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar.tsx";
import {customFilterFns} from "@/components/data-table/custom-filter-fn.tsx";
import {
  usePersistentTableState
} from "@/components/data-table/data-table-use-persistent.tsx";
import {useTranslation} from "react-i18next";
import {
  formatDateValue,
  formatNumberValue,
  formatCurrencyValue,
} from "@/utils/data-table-formatters";

export const ColumnType = {
  "Text": "text",
  "Date": "date",
  "Number": "number",
  "Currency": "currency"
} as const;

export type ColumnType = typeof ColumnType[keyof typeof ColumnType];

export type DataTableQueryResult = PostgrestFilterBuilder<any, any, any, any[], string, unknown, "GET">;

type SupabaseDataTableColumnFilter = {
  type?: string
  filterFn?: FilterFnOption<RowData>
  options?: {
    label: string
    value: any
    icon?: React.ComponentType<{ className?: string }>
  }[]
} | {
  type?: string
  filterFn?: FilterFnOption<RowData>
  selectOptions?: {
    table: string
    labelColumn: string
    valueColumn: string
    select?: string
    orderBy?: { column: string; ascending?: boolean }
    filter?: { column: string; operator: string; value: any }
  }
}

export interface SupabaseDataTableColumn {
  key: string
  title?: string
  type?: ColumnType
  accessorFn?: (row: any, index: number) => any
  callback?: (props: CellContext<any, any>) => JSX.Element | string
  isAction?: boolean
  useDefaultActions?: boolean
  actionCallback?: (row: any) => JSX.Element[]
  isSortable?: boolean
  isColumnFilterable?: boolean
  isGlobalFilterable?: boolean
  isHideable?: boolean
  filter?: SupabaseDataTableColumnFilter
}

export interface SupabaseDataTableFilter {
  column: string
  title: string
  type?: string
  options?: {
    label: string
    value: any
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectOptions?: {
    table: string
    labelColumn: string
    valueColumn: string
    select?: string
    orderBy?: { column: string; ascending?: boolean }
    filter?: { column: string; operator: string; value: any }
  }
}

export interface SupabaseDataTableProps {
  columns: SupabaseDataTableColumn[]
  queryFn: () => DataTableQueryResult
  baseModel: BaseModel<z.ZodType>
}


export function DataTableSupabase({
                                    columns,
                                    queryFn,
                                    baseModel,
                                  }: SupabaseDataTableProps) {
  const fallbackData: never[] = []
  const pageSizeArray = [10, 20, 30, 40, 50];
  const {i18n} = useTranslation();

  const {
    state,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
  } = usePersistentTableState(baseModel.tableName)

  // Get current locale for formatting
  const currentLocale = i18n.resolvedLanguage || i18n.language || "en";

  // Wrapper functions that use the current locale
  const formatDate = useCallback(
    (value: any): string => formatDateValue(value, currentLocale),
    [currentLocale]
  );

  const formatNumber = useCallback(
    (value: any): string => formatNumberValue(value, currentLocale),
    [currentLocale]
  );

  const formatCurrency = useCallback(
    (value: any): string => formatCurrencyValue(value, currentLocale),
    [currentLocale]
  );

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: [baseModel.tableName],
    queryFn: () => fetchData(),
    placeholderData: keepPreviousData
  })

  const filterOptions: SupabaseDataTableFilter[] = useMemo(() => columns.filter(value => value.filter).map((columnEntry) => {
    if (columnEntry.filter) {
      const filter: SupabaseDataTableFilter = {
        column: columnEntry.key,
        title: columnEntry.title || '',
        type: columnEntry.filter.type,
      };

      // Handle union type: check which properties exist
      if ('options' in columnEntry.filter && columnEntry.filter.options) {
        filter.options = columnEntry.filter.options;
      }
      if ('selectOptions' in columnEntry.filter && columnEntry.filter.selectOptions) {
        filter.selectOptions = columnEntry.filter.selectOptions;
      }

      return filter;
    }
    return null;
  }).filter((f): f is SupabaseDataTableFilter => f !== null), []);

  const reactTableColumns: ColumnDef<any, any>[] = useMemo(() => columns.map((columnEntry) => {
    if (columnEntry.isAction) {
      return {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({row}) => {
          let actions: JSX.Element[] = [];
          if (columnEntry.useDefaultActions !== false && actions.length === 0) {
            actions = [
              <DefaultEditAction baseModel={baseModel} rowId={row.original.id}/>,
              <DefaultCopyAction baseModel={baseModel} rowId={row.original.id}/>,
              <DropdownMenuSeparator/>,
              <DefaultDeleteAction baseModel={baseModel} rowId={row.original.id}/>
            ]
          } else if (columnEntry.actionCallback) {
            actions = columnEntry.actionCallback(row);
          }

          return <DataTableActions actions={actions}></DataTableActions>
        },
      };
    } else {
      // Determine the cell renderer based on column type and callback
      const getCellRenderer = () => {
        // If custom callback is provided, use it
        if (columnEntry.callback) {
          return columnEntry.callback;
        }

        // If column type is date, format it
        if (columnEntry.type === ColumnType.Date) {
          return (props: CellContext<any, any>) => {
            const value = props.getValue();
            return formatDate(value);
          };
        }

        // If column type is number, format it with 2 decimal places
        if (columnEntry.type === ColumnType.Number) {
          return (props: CellContext<any, any>) => {
            const value = props.getValue();
            return formatNumber(value);
          };
        }

        // If column type is currency, format it as currency (default: €)
        if (columnEntry.type === ColumnType.Currency) {
          return (props: CellContext<any, any>) => {
            const value = props.getValue();
            return formatCurrency(value);
          };
        }

        // Default: return value as-is
        return (props: CellContext<any, any>) => props.getValue();
      };

      return {
        id: columnEntry.key,
        accessorKey: columnEntry.key,
        accessorFn: columnEntry.accessorFn,
        filterFn: columnEntry.filter?.filterFn,
        cell: getCellRenderer(),
        enableSorting: columnEntry.isSortable,
        enableHiding: columnEntry.isHideable,
        enableColumnFilter: columnEntry.isColumnFilterable,
        enableGlobalFilter: columnEntry.isGlobalFilterable,
        header: columnEntry.title ? ({column}) => (
            <DataTableColumnHeader column={column} title={columnEntry.title ?? ''}/>
        ) : undefined
      }
    }
  }), [columns, baseModel, formatDate, formatNumber, formatCurrency])

  const fetchData = async () => {
    const {data, count, error} = await queryFn()
    if (error) throw error

    return {data: data, count: count ?? 0}
  }

  const table = useReactTable({
    data: data?.data ?? fallbackData,
    columns: reactTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: state,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    filterFns: customFilterFns
  })

  if (isLoading)
    return <DataTableSkeleton />
  if (isError)
    return (
        <Error refetch={refetch}></Error>
    )

  return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <DataTableToolbar table={table} columns={columns} filters={filterOptions}
                          baseModel={baseModel}/>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      let style: React.CSSProperties | undefined;
                      if (header.id === 'actions') {
                        style = {width: '1px'}
                      }

                      return (
                          <TableHead key={header.id} style={style}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                          </TableHead>
                      )
                    })}
                  </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                          key={row.id}
                      >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                              )}
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table}
                             pageSizeArray={pageSizeArray}></DataTablePagination>
      </div>
  )
}
