import { Skeleton } from "@/components/ui/skeleton"; // Assuming ShadCN UI provides a Skeleton component

const SidebarSkeleton = () => {
  return (
    <div className="w-80 bg-background h-full p-4">
      {/* Sidebar Skeleton */}
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
      <Skeleton className="h-12 w-full mb-4" />
    </div>
  );
};

export default SidebarSkeleton;
