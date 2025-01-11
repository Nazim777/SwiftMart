import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CartPageSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-14">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main cart content skeleton */}
        <div className="lg:col-span-2">
          {[1, 2, 3].map((key) => (
            <Card key={key} className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded" />
                      <Skeleton className="w-12 h-6" />
                      <Skeleton className="w-8 h-8 rounded" />
                      <Skeleton className="w-8 h-8 rounded ml-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-1/2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="w-full h-10 rounded" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPageSkeleton;
