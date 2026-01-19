import {Skeleton} from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTableSkeleton() {
  return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        {/* Toolbar skeleton */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-8 w-64"/>
            <Skeleton className="h-8 w-24"/>
            <Skeleton className="h-8 w-24"/>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24"/>
            <Skeleton className="h-8 w-24"/>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                {Array.from({length: 5}).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-10 w-24"/>
                    </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({length: 7}).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({length: 5}).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="h-10 w-full"/>
                        </TableCell>
                    ))}
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-32"/>
          <Skeleton className="h-9 w-32"/>
          <Skeleton className="h-9 w-32"/>
        </div>
      </div>
  )
}

