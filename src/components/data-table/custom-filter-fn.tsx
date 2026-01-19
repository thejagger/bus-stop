import type {FilterFn} from "@tanstack/react-table";
import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface FilterFns {
    filterIncludesString: FilterFn<any>
  }
}


const filterIncludesString: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: string
) => filterValue.includes(row.getValue(columnId))

filterIncludesString.autoRemove = (val: any) => testFalsey(val)

export const customFilterFns = {
  filterIncludesString
}

export type CustomFilterFn = keyof typeof customFilterFns

function testFalsey(val: any) {
  return val === undefined || val === null || val === ''
}