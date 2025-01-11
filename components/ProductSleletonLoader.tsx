import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeletonLoader: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image Skeleton */}
        <Skeleton className="h-64 w-full md:w-1/2 rounded-md" />
        {/* Product Details Skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          {/* Price and Button */}
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-10 w-1/3 rounded-md" />
            <Skeleton className="h-10 w-1/3 rounded-md" />
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};

export default ProductSkeletonLoader;
