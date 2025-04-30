import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PetLoading() {
  return (
    <main className="p-6 flex flex-col items-center justify-center">
      {/* Pet Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 w-full max-w-4xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" /> {/* Image placeholder */}
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" /> {/* Pet name */}
              <Skeleton className="h-4 w-1/2" /> {/* Pet breed */}
              <Skeleton className="h-4 w-1/3" /> {/* Pet age */}
              <div className="flex pt-2 gap-2">
                <Skeleton className="h-8 w-20" /> {/* Button */}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="flex justify-center mt-6 space-x-2">
        <Skeleton className="h-10 w-24" /> {/* Previous button */}
        <Skeleton className="h-10 w-24" /> {/* Page indicator */}
        <Skeleton className="h-10 w-24" /> {/* Next button */}
      </div>
    </main>
  );
}