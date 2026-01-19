"use client"

import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import type {Table} from "@tanstack/react-table"
import {Settings2} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx"
import {Button} from "@/components/ui/button.tsx";
import type {SupabaseDataTableColumn} from "@/components/data-table/data-table-supabase.tsx";
import {useTranslation} from "react-i18next";

export function DataTableViewOptions<TData>({
                                              table,
                                              columns
                                            }: {
  table: Table<TData>
  columns: SupabaseDataTableColumn[]
}) {
  const {t} = useTranslation('data_table');

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2/>
            {t('view_options')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>{t('toggle_columns')}</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnTitle = columns.find(value => value.key === column.id);
                return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(value)}
                    >
                      {columnTitle?.title ?? ''}
                    </DropdownMenuCheckboxItem>
                )
              })}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}