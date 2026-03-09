// app/dashboard/loading.tsx

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}