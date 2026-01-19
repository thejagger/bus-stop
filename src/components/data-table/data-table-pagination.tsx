"use client"

import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import type {Table} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";
import {z} from "zod";
import {useTranslation} from "react-i18next";

export function DataTablePagination({
                                      table,
                                      pageSizeArray
                                    }: {
  table: Table<z.ZodType>,
  pageSizeArray: number[]
}) {
  const {t} = useTranslation('data_table');

  return <div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex items-center space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">{t('rows_per_page')}</p>
        <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize}/>
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeArray.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
          className="flex w-[100px] items-center justify-center text-sm font-medium">
        {t('page_info', {
          page: table.getState().pagination.pageIndex + 1,
          pages: table.getPageCount()
        })}
      </div>
      <div className="flex items-center space-x-2">
        <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{t('go_to_first_page')}</span>
          <ChevronsLeft/>
        </Button>
        <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">{t('go_to_previous_page')}</span>
          <ChevronLeft/>
        </Button>
        <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{t('go_to_next_page')}</span>
          <ChevronRight/>
        </Button>
        <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">{t('go_to_last_page')}</span>
          <ChevronsRight/>
        </Button>
      </div>
    </div>
  </div>;
}