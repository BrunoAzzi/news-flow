import { Skeleton } from "../ui/skeleton";

export const ArticleSkeleton = () => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);
