import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import type {JSX} from "react";

export function DefaultCard({
                               title,
                               description,
                               children,
                             }: {
  title?: string,
  description?: string,
  children: JSX.Element | JSX.Element[]
}) {
  let cardHeader = null
  if(title != null || description != null)
  {
    cardHeader = <CardHeader>
      {title && <CardTitle>
        {title}
      </CardTitle>}
      {description && <CardDescription>
        {description}
      </CardDescription>}
    </CardHeader>
  }

  return <Card>
    {cardHeader != null && cardHeader}
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
}