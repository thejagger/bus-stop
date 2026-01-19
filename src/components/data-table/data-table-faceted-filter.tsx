import * as React from "react"
import type {Column} from "@tanstack/react-table"
import {Check, PlusCircle} from "lucide-react"

import {cn} from "@/lib/utils.ts"
import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx"
import {Separator} from "@/components/ui/separator.tsx"
import {useTranslation} from "react-i18next";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: any
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
                                                        column,
                                                        title,
                                                        options,
                                                      }: DataTableFacetedFilterProps<TData, TValue>) {
  const {t} = useTranslation('data_table')
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle/>
            {title}
            {selectedValues?.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4"/>
                  <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedValues.size}
                  </Badge>
                  <div className="hidden gap-1 lg:flex">
                    {selectedValues.size > 2 ? (
                        <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal"
                        >
                          {t('bade_selected_amount', {amount: selectedValues.size})}
                        </Badge>
                    ) : (
                        options
                            .filter((option) => selectedValues.has(option.value))
                            .map((option) => (
                                <Badge
                                    variant="secondary"
                                    key={option.value}
                                    className="rounded-sm px-1 font-normal"
                                >
                                  {option.label}
                                </Badge>
                            ))
                    )}
                  </div>
                </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title}/>
            <CommandList>
              <CommandEmpty>{t('no_results_found')}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                      <CommandItem
                          key={option.value}
                          onSelect={() => {
                            if (isSelected) {
                              selectedValues.delete(option.value)
                            } else {
                              selectedValues.add(option.value)
                            }
                            const filterValues = Array.from(selectedValues)
                            column?.setFilterValue(
                                filterValues.length ? filterValues : undefined
                            )
                          }}
                      >
                        <div
                            className={cn(
                                "flex size-4 items-center justify-center rounded-[4px] border",
                                isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-input [&_svg]:invisible"
                            )}
                        >
                          <Check className="text-primary-foreground size-3.5"/>
                        </div>
                        {option.icon && (
                            <option.icon className="text-muted-foreground size-4"/>
                        )}
                        <span>{option.label}</span>
                        {facets?.get(option.value) && (
                            <span
                                className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                        )}
                      </CommandItem>
                  )
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                  <>
                    <CommandSeparator/>
                    <CommandGroup>
                      <CommandItem
                          onSelect={() => column?.setFilterValue(undefined)}
                          className="justify-center text-center"
                      >
                        {t('clear_filter')}
                      </CommandItem>
                    </CommandGroup>
                  </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}