"use client"

import type {Column, Table} from "@tanstack/react-table"
import {SearchIcon, X} from "lucide-react"

import {Button} from "@/components/ui/button.tsx"
import {DataTableViewOptions} from "./data-table-view-options.tsx"
import {DataTableFacetedFilter} from "./data-table-faceted-filter.tsx"
import type {
  SupabaseDataTableColumn,
  SupabaseDataTableFilter
} from "@/components/data-table/data-table-supabase.tsx";
import {DefaultAddAction} from "@/components/data-table/data-table-actions.tsx";
import type {BaseModel} from "@/lib/base.model.ts";
import {z} from "zod";
import {useTranslation} from "react-i18next";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group.tsx";
import {Kbd} from "@/components/ui/kbd.tsx";
import {useEffect, useRef, useState} from "react";
import {isAppleDevice} from "@/lib/utils.ts";
import {useSelectOptions} from "@/utils/use-select-options.ts";

function DataTableFacetedFilterLoader({
  column,
  title,
  filter,
}: { column?: Column<any, any>; title?: string; filter: SupabaseDataTableFilter }) {
  if (filter.selectOptions) {
    const {table: tbl, labelColumn, valueColumn, select, orderBy, filter: flt} = filter.selectOptions
    const {data: dynOptions = []} = useSelectOptions<any>({
      table: tbl,
      labelColumn: labelColumn as any,
      valueColumn: valueColumn as any,
      select,
      orderBy: orderBy as any,
      filter: flt as any,
    })

    return (
        <DataTableFacetedFilter
            column={column}
            title={title}
            options={dynOptions as any}
        />
    )
  }

  return (
      <DataTableFacetedFilter
          column={column}
          title={title}
          options={filter.options ?? []}
      />
  )
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columns: SupabaseDataTableColumn[];
  filters?: SupabaseDataTableFilter[];
  baseModel: BaseModel<z.ZodType>
}

export function DataTableToolbar<TData>({
                                          table,
                                          columns,
                                          filters,
                                          baseModel,
                                        }: DataTableToolbarProps<TData>) {
  const {t} = useTranslation('data_table');
  const isFiltered = table.getState().columnFilters.length > 0
  const inputRef = useRef<HTMLInputElement>(null)
  const [deviceType, setDeviceType] = useState("unknown")

  useEffect(() => {
    if (isAppleDevice()) {
      setDeviceType("apple");
    } else {
      setDeviceType("other");
    }
  }, []);

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (inputRef.current === null) {
        return false;
      }

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleCk);

    return () => window.removeEventListener("keydown", handleCk);
  }, []);

  return (
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="h-8 w-[150px] lg:w-[250px]">
            <InputGroupInput
                ref={inputRef}
                placeholder="Search..."
                value={(table.getState().globalFilter)}
                onChange={e => table.setGlobalFilter(String(e.target.value))}/>
            <InputGroupAddon>
              <SearchIcon/>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>{deviceType === "apple" ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          {filters?.map((filter) => (
              <DataTableFacetedFilterLoader
                  key={filter.column}
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  filter={filter}
              />
          ))}
          {isFiltered && (
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
              >
                {t('reset_filter')}
                <X/>
              </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} columns={columns}/>
          <DefaultAddAction baseModel={baseModel}/>
        </div>
      </div>
  )
}