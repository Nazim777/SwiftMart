import { Skeleton } from "@/components/ui/skeleton";
const PaginationSkeletonLoader = () => {
  return (
    <div className="flex justify-between items-center p-4 mt-4 border-t border-gray-200">
      {/* Skeleton for Previous button */}
      <Skeleton className="w-16 h-10 rounded-md" />

      {/* Skeleton for Page Number */}
      <div className="flex gap-2 items-center">
        <Skeleton className="w-12 h-8 rounded-md" />
        <Skeleton className="w-12 h-8 rounded-md" />
      </div>

      {/* Skeleton for Next button */}
      <Skeleton className="w-16 h-10 rounded-md" />
    </div>
  );
};

export default PaginationSkeletonLoader;
