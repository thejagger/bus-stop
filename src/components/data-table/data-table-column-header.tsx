import {type Column} from "@tanstack/react-table"
import {ArrowDown, ArrowUp, ChevronsUpDown, EyeOff} from "lucide-react"

import {cn} from "@/lib/utils.ts"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
                                                       column,
                                                       title,
                                                       className,
                                                     }: DataTableColumnHeaderProps<TData, TValue>) {
  const {t} = useTranslation('data_table');
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
      <div className={cn("flex items-center gap-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className="data-[state=open]:bg-accent -ml-3 h-8"
            >
              <span>{title}</span>
              {column.getIsSorted() === "desc" ? (
                  <ArrowDown/>
              ) : column.getIsSorted() === "asc" ? (
                  <ArrowUp/>
              ) : (
                  <ChevronsUpDown/>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp/>
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown/>
              Desc
            </DropdownMenuItem>
            {
              column.getCanHide() ?
                  <>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                      <EyeOff/>
                      {t('column_header_hide')}
                    </DropdownMenuItem>
                  </> :
                  <></>
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  )
}
