'use client'

import { Skeleton } from "@/components/ui/skeleton";

export default function LostPetCarouselSkeleton() {
    return (
        <div className="w-full flex gap-4 overflow-x-auto px-4 py-6">
            {/* Always show 1 */}
            <SkeletonCard />

            {/* Show 2 more from md (total 3 on md) */}
            <div className="hidden md:block">
                <SkeletonCard />
            </div>
            <div className="hidden md:block">
                <SkeletonCard />
            </div>

            {/* Show 2 more from lg (total 5 on lg+) */}
            <div className="hidden lg:block">
                <SkeletonCard />
            </div>
            <div className="hidden lg:block">
                <SkeletonCard />
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="w-64 h-96 bg-white bg-opacity-90 rounded-2xl shadow-xl p-2 flex flex-col space-y-3">
            {/* Image skeleton */}
            <Skeleton className="h-2/3 w-full rounded-lg" />

            <div className="space-y-2 px-4">
                <Skeleton className="h-4 w-3/4 mx-auto" /> {/* Pet name */}
                <Skeleton className="h-4 w-5/6 mx-auto" /> {/* Address */}
                <Skeleton className="h-4 w-2/3 mx-auto" /> {/* Phone */}
            </div>
        </div>
    );
}
