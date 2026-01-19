import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function ErrorPage404() {
  return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you're looking for doesn't exist. Try searching for
            what you need below.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
  )
}