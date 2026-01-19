import {useEffect, useMemo, useState, useRef} from "react"
import {useSearchParams} from "react-router-dom"
import type {
  SortingState,
  ColumnFiltersState,
  PaginationState,
  GlobalFilterTableState,
} from "@tanstack/react-table"

type TableState = {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter: GlobalFilterTableState
  pagination: PaginationState
}

export function usePersistentTableState(tableKey: string) {
  // Only use useSearchParams for reading initial state, not for updates
  const [searchParams] = useSearchParams()
  const isInitialMountRef = useRef(true)

  // --- Load initial state from URL or sessionStorage ---
  const initialState = useMemo((): TableState => {
    const session = sessionStorage.getItem(`tableState:${tableKey}`)
    if (session) {
      try {
        return JSON.parse(session)
      } catch (_) {
        // ignore corrupted storage
      }
    }

    const sortParam = searchParams.get(`${tableKey}-sort`)
    const filterParam = searchParams.get(`${tableKey}-filters`)
    const globalFilterParam = searchParams.get(`${tableKey}-global-filter`)
    const pageParam = searchParams.get(`${tableKey}-page`)
    const sizeParam = searchParams.get(`${tableKey}-pageSize`)

    return {
      sorting: sortParam ? JSON.parse(sortParam) : [],
      columnFilters: filterParam ? JSON.parse(filterParam) : [],
      globalFilter: globalFilterParam ? JSON.parse(globalFilterParam) : [],
      pagination: {
        pageIndex: Number(pageParam ?? 0),
        pageSize: Number(sizeParam ?? 20),
      },
    }
  }, [searchParams, tableKey])

  const [sorting, setSorting] = useState<SortingState>(initialState.sorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState.columnFilters
  )
  const [globalFilter, setGlobalFilter] = useState<GlobalFilterTableState>(
    initialState.globalFilter
  )
  const [pagination, setPagination] = useState<PaginationState>(initialState.pagination)

  // --- Persist to sessionStorage ---
  useEffect(() => {
    sessionStorage.setItem(
      `tableState:${tableKey}`,
      JSON.stringify({sorting, columnFilters, globalFilter, pagination})
    )
  }, [sorting, columnFilters, globalFilter, pagination, tableKey])

  // --- Persist to URL using window.history.replaceState to avoid rerenders ---
  useEffect(() => {
    // Skip URL update on initial mount (state is already synced from URL)
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

    // Use window.history.replaceState directly to update URL without triggering React Router rerender
    const params = new URLSearchParams(window.location.search)
    params.set(`${tableKey}-sort`, JSON.stringify(sorting))
    params.set(`${tableKey}-filters`, JSON.stringify(columnFilters))
    params.set(`${tableKey}-global-filter`, JSON.stringify(globalFilter))
    params.set(`${tableKey}-page`, String(pagination.pageIndex))
    params.set(`${tableKey}-pageSize`, String(pagination.pageSize))

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`
    window.history.replaceState({}, "", newUrl)
  }, [sorting, columnFilters, globalFilter, pagination, tableKey])

  return {
    state: {sorting, columnFilters, globalFilter, pagination},
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  }
}
