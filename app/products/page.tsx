'use client'
import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/ProductsPageSidebar'
import { category } from '@/types/category';
import { ProductType } from '@/types/product';
import { getAllProducts } from '@/actions/action.products';
import { getAllCategories } from '@/actions/action.category';
import Pagination from '@/components/Pagination';
import ProductsCard from '@/components/ProductsCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import SidebarSkeleton from '@/components/SidebarSkeleton';
import PaginationSkeletonLoader from '@/components/PaginationSkeletonLoader';
const ProductsPage = () => {
 const [categories, setCategories] = useState<category[]>([]);
   const [products, setProducts] = useState<ProductType[]>([]);
   const [loading, setLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const itemPerPage = 6;
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


    const [filters, setFilters] = useState({
       minPrice: 0,
       maxPrice: 1500,
       categoryIds: [] as string[],
       stockStatus: 'all' as 'all' | 'inStock' | 'outOfStock'
     });
   
    
   
     const fetchProducts = async () => {
       setLoading(true);
       try {
         const response = await getAllProducts(currentPage, itemPerPage, searchTerm, filters,sortOrder);
         if (response) {
           setProducts(response.products);
           setTotalPages(response.totalPages);
         }
       } catch (error) {
         console.log("error", error);
       } finally {
         setLoading(false);
       }
     };
   
     
   
     useEffect(() => {
       fetchProducts();
     }, [currentPage, searchTerm, filters,sortOrder]);
   
     // Filter handlers
     const handlePriceChange = (value: number[]) => {
       setFilters(prev => ({
         ...prev,
         minPrice: value[0],
         maxPrice: value[1]
       }));
     };
   
     const handleCategoryChange = (categoryId: string) => {
       setFilters(prev => ({
         ...prev,
         categoryIds: prev.categoryIds.includes(categoryId)
           ? prev.categoryIds.filter(id => id !== categoryId)
           : [...prev.categoryIds, categoryId]
       }));
     };
   
     const handleStockStatusChange = (status: 'all' | 'inStock' | 'outOfStock') => {
       setFilters(prev => ({
         ...prev,
         stockStatus: status
       }));
     };
   
     const clearFilters = () => {
       setFilters({
         minPrice: 0,
         maxPrice: 1500,
         categoryIds: [],
         stockStatus: 'all'
       });
       setCurrentPage(1)
     };
   
     
     const handlePageChange = (page: number) => {
       setCurrentPage(page);
     };


     // categories
       const fetchCategories = async () => {
         const response = await getAllCategories();
         if (response?.success) {
           setCategories(response?.data);
         }
       };
     
       useEffect(() => {
         fetchCategories();
       }, []);
   
   





  return (
    <div className="flex mt-14">
     <aside className='w-80 bg-background h-full fixed   p-4 z-10 overflow-y-auto scrollbar-hidden' >

      {
        loading?<SidebarSkeleton/>:
     
      <Sidebar
      placeholder="Search Products..." 
      value={searchTerm}
      onSearchChange={setSearchTerm}
      onSortChange={setSortOrder}
      filters={filters}
      categories={categories}
      onPriceChange={handlePriceChange}
      onCategoryChange={handleCategoryChange}
      onStockStatusChange={handleStockStatusChange}
      onClearFilters={clearFilters}
      />
}
      </aside>
      <main className="flex-1 p-4  flex flex-col ml-80">
        <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

        {loading?
        [...Array(6)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
        : <>
       {products&&products?.map((product:any) => (
         <ProductsCard product={product}/>
        ))}
        </>
      }
      </div>
      <div className="mt-auto">
        {loading?<PaginationSkeletonLoader/>:
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />}
          </div>
    </div>
      </main>
    </div>
  );
};

export default ProductsPage;
