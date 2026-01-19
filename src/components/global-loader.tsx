import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalLoader({ message, className }: { message?: string; className?: string }) {
  return (
      <div
          className={cn(
              "flex flex-col items-center justify-center h-screen w-full text-muted-foreground",
              className
          )}
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm">{message ?? "Loading..."}</p>
      </div>
  );
}