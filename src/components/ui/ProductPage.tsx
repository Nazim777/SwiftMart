"use client";
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "@/features/products/components/ProductsPageSidebar";
import { category } from "@/types/category";
import { ProductType } from "@/types/product";
import { getAllProducts } from "@/features/products/actions/action.products";
import { getAllCategories } from "@/features/category/actions/action.category";
import Pagination from "@/components/ui/PaginationControl";
import ProductsCard from "@/features/products/components/ProductsCard";
import ProductCardSkeleton from "@/features/products/components/ProductCardSkeleton";
import PaginationSkeletonLoader from "@/components/ui/PaginationSkeletonLoader";
import { ProductContext } from "@/components/providers/Product.Context";
import { getLoggedInUser } from "@/features/user/actions/action.user";
import { getCartItem } from "@/features/cart/actions/action.cart";
import CustomError from "@/app/_components/CustomError";
const ProductsPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryLoader, setCategoryLoader] = useState(false)
  const [categories, setCategories] = useState<category[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemPerPage = 6;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 1000);
    return () => clearTimeout(handler);
  }, [searchTerm])



  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1500,
    categoryIds: [] as string[],
    stockStatus: "all" as "all" | "inStock" | "outOfStock",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null)
    try {
      const response = await getAllProducts(
        currentPage,
        itemPerPage,
        debouncedSearch,
        filters,
        sortOrder
      );
      if (response) {
        setProducts(response.products);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.log("error", error);
      setError('Failed to load product. Please try again later!')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, filters, sortOrder]);

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
    setCategoryLoader(true);
    setCategoryError(null)
    try {
      const response = await getAllCategories();
      if (response?.success) {
        setCategories(response?.data);
      }
    } catch (error) {
      console.log('error', error)
      setCategoryError('Failed to load category. Please try again later!')

    } finally {
      setCategoryLoader(false)
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //fetch cart and update to the cart context
  const { cartItems, setCartItems } = useContext(ProductContext);
  const [triggerAddToCart, setTriggerAddToCart] = useState(false);
  const handleTriggerAddToCart = (text: boolean) => {
    setTriggerAddToCart(text);
  };
  const fetchCart = async () => {
    try {
      const user = await getLoggedInUser();
      if (user) {
        const response = await getCartItem(user.id);
        if (response.success) {
          setCartItems(response.data);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTriggerAddToCart(false);
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
          categoryError={categoryError}
          categoryLoader={categoryLoader}
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
            ) : error ? <CustomError error={error} /> : (
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
