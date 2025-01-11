import { Skeleton } from "@/components/ui/skeleton"; // Assuming ShadCN UI provides a Skeleton component
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="p-0 relative">
        <Skeleton className="rounded-t-lg object-cover w-full h-48" />
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;
