import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { NavigationSkeleton } from "./navigation-skeleton"
import { DataTableSkeleton } from "./data-table-skeleton"
import {Separator} from "@/components/ui/separator.tsx";

export function PageSkeleton() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <NavigationSkeleton variant="inset" />
      <SidebarInset>
        {/* Header skeleton */}
        <div className="flex h-[calc(var(--header-height))] items-center gap-4 border-b px-4 lg:px-6">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-18" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTableSkeleton />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

