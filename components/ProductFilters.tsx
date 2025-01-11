import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FilterProps = {
  filters: {
    minPrice: number;
    maxPrice: number;
    categoryIds: string[];
    stockStatus: 'all' | 'inStock' | 'outOfStock';
  };
  categories: Array<{ id: string; name: string; }>;
  onPriceChange: (value: number[]) => void;
  onCategoryChange: (categoryId: string) => void;
  onStockStatusChange: (status: 'all' | 'inStock' | 'outOfStock') => void;
  onClearFilters: () => void;
  className?: string;
};

export default function ProductFilters({
  filters,
  categories,
  onPriceChange,
  onCategoryChange,
  onStockStatusChange,
  onClearFilters,
  className = ""
}: FilterProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className={`${className !==''?className:'grid grid-cols-1 md:grid-cols-3 gap-6'}`}>
          {/* Price Range Filter */}
          <div className="space-y-4">
            <h3 className="font-medium">Price Range</h3>
            <Slider
              defaultValue={[filters?.minPrice, filters?.maxPrice]}
              value={[filters?.minPrice, filters?.maxPrice]}
              max={1500}
              step={10}
              onValueChange={onPriceChange}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters?.minPrice}</span>
              <span>${filters?.maxPrice}</span>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-4">
            <h3 className="font-medium">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories?.map((category) => (
                <label 
                  key={category.id}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.categoryIds.includes(category.id)}
                    onChange={() => onCategoryChange(category.id)}
                    className="rounded text-blue-600"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Status Filter */}
          <div className="space-y-4">
            <h3 className="font-medium">Stock Status</h3>
            <div className="flex flex-col gap-2">
              {['all', 'inStock', 'outOfStock'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="stockStatus"
                    checked={filters?.stockStatus === status}
                    onChange={() => onStockStatusChange(status as any)}
                    className="text-blue-600"
                  />
                  <span className="capitalize">
                    {status === 'all' ? 'All' : 
                     status === 'inStock' ? 'In Stock' : 
                     'Out of Stock'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-12">
          <Button 
            variant="ghost" 
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}