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





// 'use client'

// import React, { useEffect, useState } from "react";
// import Sidebar from "@/components/ProductsPageSidebar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { category } from "@/types/category";
// import { ProductType } from "@/types/product";
// import { getAllProducts } from "@/actions/action.products";
// import { getAllCategories } from "@/actions/action.category";
// import Pagination from "@/components/Pagination";

// const ProductsPage = () => {
//   const [categories, setCategories] = useState<category[]>([]);
//   const [products, setProducts] = useState<ProductType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const itemPerPage = 8;
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   const [filters, setFilters] = useState({
//     minPrice: 0,
//     maxPrice: 1500,
//     categoryIds: [] as string[],
//     stockStatus: "all" as "all" | "inStock" | "outOfStock",
//   });

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllProducts(
//         currentPage,
//         itemPerPage,
//         searchTerm,
//         filters,
//         sortOrder
//       );
//       if (response) {
//         setProducts(response.products);
//         setTotalPages(response.totalPages);
//       }
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, searchTerm, filters, sortOrder]);

//   const handlePriceChange = (value: number[]) => {
//     setFilters((prev) => ({
//       ...prev,
//       minPrice: value[0],
//       maxPrice: value[1],
//     }));
//   };

//   const handleCategoryChange = (categoryId: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       categoryIds: prev.categoryIds.includes(categoryId)
//         ? prev.categoryIds.filter((id) => id !== categoryId)
//         : [...prev.categoryIds, categoryId],
//     }));
//   };

//   const handleStockStatusChange = (status: "all" | "inStock" | "outOfStock") => {
//     setFilters((prev) => ({
//       ...prev,
//       stockStatus: status,
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       minPrice: 0,
//       maxPrice: 1500,
//       categoryIds: [],
//       stockStatus: "all",
//     });
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const fetchCategories = async () => {
//     const response = await getAllCategories();
//     if (response?.success) {
//       setCategories(response?.data);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="flex mt-14 h-[calc(100vh-3.5rem)]">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-100 h-full fixed top-0 left-0 p-4">
//         <Sidebar
//           placeholder="Search Products..."
//           value={searchTerm}
//           onSearchChange={setSearchTerm}
//           onSortChange={setSortOrder}
//           filters={filters}
//           categories={categories}
//           onPriceChange={handlePriceChange}
//           onCategoryChange={handleCategoryChange}
//           onStockStatusChange={handleStockStatusChange}
//           onClearFilters={clearFilters}
//         />
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-64 p-4 overflow-auto flex flex-col">
//         <h1 className="text-2xl font-semibold mb-4">Products Page</h1>
//         <div className="container mx-auto px-4 py-8 flex-1">
//           <h1 className="text-2xl font-bold mb-6">Browse Our Products</h1>
//           {/* Product Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
//             {products &&
//               products.map((product: any) => (
//                 <Card key={product.id} className="shadow-lg">
//                   <CardHeader className="p-0 relative">
//                     <Image
//                       src={product.url}
//                       alt={product.name}
//                       width={300}
//                       height={200}
//                       className="rounded-t-lg object-cover w-full h-48"
//                     />
//                   </CardHeader>
//                   <CardContent className="p-4 space-y-2">
//                     <CardTitle className="text-lg font-semibold">
//                       {product.name}
//                     </CardTitle>
//                     <p
//                       className={`text-sm ${
//                         product.stock > 0 ? "text-green-600" : "text-red-600"
//                       }`}
//                     >
//                       {product.stock > 0 ? "In Stock" : "Out of Stock"}
//                     </p>
//                     <p className="text-lg font-bold text-blue-600">
//                       ${product.price}
//                     </p>
//                     <div className="flex justify-between mt-4">
//                       <Button variant="outline" size="sm">
//                         View Details
//                       </Button>
//                       {product.stock > 0 && (
//                         <Button variant="default" size="sm">
//                           Add to Cart
//                         </Button>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//           </div>

//           {/* Pagination */}
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProductsPage;
