import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";
import {Construction} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export function Error({errorTitle, errorDescription, refetch}: {
  errorTitle?: string,
  errorDescription?: string,
  refetch: () => void
}) {
  return <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Construction/>
      </EmptyMedia>
      <EmptyTitle>{errorTitle ?? "Error"}</EmptyTitle>
      <EmptyDescription>
        {errorDescription ?? "Something went wrong. Please try again later."}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div className="flex gap2">
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    </EmptyContent>
  </Empty>
}