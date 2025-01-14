"use client";
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "@/components/ProductsPageSidebar";
import { category } from "@/types/category";
import { ProductType } from "@/types/product";
import { getAllProducts } from "@/actions/action.products";
import { getAllCategories } from "@/actions/action.category";
import Pagination from "@/components/Pagination";
import ProductsCard from "@/components/ProductsCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import PaginationSkeletonLoader from "@/components/PaginationSkeletonLoader";
import { ProductContext } from "@/context/Product.Context";
import { getLoggedInUser } from "@/actions/action.user";
import { getCartItem } from "@/actions/action.cart";
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
    stockStatus: "all" as "all" | "inStock" | "outOfStock",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts(
        currentPage,
        itemPerPage,
        searchTerm,
        filters,
        sortOrder
      );
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
  }, [currentPage, searchTerm, filters, sortOrder]);

  // Filter handlers
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleStockStatusChange = (
    status: "all" | "inStock" | "outOfStock"
  ) => {
    setFilters((prev) => ({
      ...prev,
      stockStatus: status,
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1500,
      categoryIds: [],
      stockStatus: "all",
    });
    setCurrentPage(1);
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



 //fetch cart and update to the cart context
  const {cartItems, setCartItems } = useContext(ProductContext);
  const [triggerAddToCart,setTriggerAddToCart] = useState(false)
  const handleTriggerAddToCart = (text:boolean)=>{
    setTriggerAddToCart(text)
  }
  const fetchCart = async () => {
    try {
      const user = await getLoggedInUser();
      if (user) {
        const response = await getCartItem(user.id);
        if (response.succes) {
          setCartItems(response.data);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTriggerAddToCart(false)
    }
  };



  useEffect(() => {
    fetchCart();
  }, [triggerAddToCart]);


  return (
    <div className="flex mt-14">
      <aside className="w-80 bg-background h-full fixed   p-4 z-10 overflow-y-auto scrollbar-hidden">
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
      </aside>
      <main className="flex-1 p-4  flex flex-col ml-80">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Browse Our Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              <>
                {products &&
                  products.map((product: ProductType) => {
                    const isInCart = cartItems?.some(
                      (item) => item.product.id === product.id
                    );

                    return (
                      <ProductsCard
                        key={product.id}
                        product={product}
                        isInCart={isInCart}
                        handleTriggerAddToCart={handleTriggerAddToCart}
                      />
                    );
                  })}
              </>
            )}
          </div>
          <div className="mt-auto">
            {loading ? (
              <PaginationSkeletonLoader />
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
