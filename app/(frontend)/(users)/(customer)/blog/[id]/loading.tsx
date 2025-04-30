import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Title skeleton */}
      <Skeleton className="h-10 w-3/4 mb-2" />
      
      {/* Date skeleton */}
      <Skeleton className="h-4 w-40 mb-6" />
      
      {/* Image skeleton */}
      <Skeleton className="w-full h-[300px] rounded-lg mb-6" />
      
      {/* Content skeletons - multiple paragraphs */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </main>
  );
}