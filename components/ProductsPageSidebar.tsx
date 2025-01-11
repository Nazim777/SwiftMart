'use client'
import React from "react";
import ProductFilters from "./ProductFilters";
import SortProduct from "./SortComponet";
import Search from "./Search";

type sidebarProps = {
  value: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  onSortChange: (sortOrder: "asc" | "desc") => void;
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
}

const ProductPageSidebar = ({value,onSearchChange,placeholder,onSortChange,filters,categories,onPriceChange,onStockStatusChange,onClearFilters,onCategoryChange,className}:sidebarProps) => {
  return (
    <aside className="w-80 h-screen bg-background p-4 shadow-lg">
        <Search placeholder={placeholder} value={value} onSearchChange={onSearchChange}/>
        <div className="my-6">
        <SortProduct onSortChange={onSortChange}/> 
        </div>
      <ProductFilters filters={filters} categories={categories} onPriceChange={onPriceChange} onStockStatusChange={onStockStatusChange} onClearFilters={onClearFilters} onCategoryChange={onCategoryChange} className="flex flex-col gap-6" />

    </aside>
  );
};

export default ProductPageSidebar;
