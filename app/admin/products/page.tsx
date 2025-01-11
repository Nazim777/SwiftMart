
'use client'

import { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import ProductAddAndEditModal from "../../../components/ProductAddEditModal";
import { category } from "@/types/category";
import { getAllCategories } from "@/actions/action.category";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/actions/action.products";
import { ProductType, productTypeForCreateAndEdit } from "@/types/product";
import DeleteConfirmationDialog from "@/components/ConfirmationModal";
import { toast } from "react-toastify";
import TableSkeleton from "@/components/TableSkeleton";
import Pagination from "@/components/Pagination";
import PaginationSkeletonLoader from "@/components/PaginationSkeletonLoader";
import Search from "@/components/Search";
import ProductFilters from "@/components/ProductFilters";
import SortProduct from "@/components/SortComponet";

const ProductsPage = () => {
  // Existing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
  const [categories, setCategories] = useState<category[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemPerPage = 4;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // New state for filters
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1500,
    categoryIds: [] as string[],
    stockStatus: 'all' as 'all' | 'inStock' | 'outOfStock'
  });

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

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



  const handleModalOpen = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleAddOrEditProduct = async (
    product: productTypeForCreateAndEdit
  ) => {
    setLoading(true);
    if (product.id) {
      console.log("product to edit", product);
      try {
        const productToUpdate = {
          id: product.id,
          name: product.name,
          stock: product.stock,
          description: product.description,
          price: product.price,
          url: product.url,
        };
        const response = await updateProduct(productToUpdate);
        if (response?.success) {
          const mappedProducts = products.map((item) =>
            item.id === product.id ? response.data : item
          );
          setProducts(mappedProducts);
          toast.success("Product Updated Successfully!", {
            theme: "colored",
          });
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await createProduct(product);
        if (response?.success) {
          setProducts((prev) => [...prev, response.data]);
          toast.success("Product Created Successfully!", {
            theme: "colored",
          });
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    }

    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleEditClick = (product: ProductType) => {
    setProductToEdit(product);
    setIsModalOpen(true);
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

  // delete
  const [isOpeneDialog, setIsOpenDialog] = useState(false);
  const [itemName, setItmeName] = useState("");
  const [productToDeleteId, setProductToDeleteId] = useState("");
  const handleCancelDialog = () => {
    setIsOpenDialog(false);
    setItmeName("");
    setProductToDeleteId("");
  };
  const handleDeleteClick = async (id: string, name: string) => {
    setItmeName(name);
    setProductToDeleteId(id);
    setIsOpenDialog(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteProduct(productToDeleteId);
      if (response?.success) {
        const filteredProduct = products.filter(
          (item) => item.id !== productToDeleteId
        );
        setProducts(filteredProduct);
        setItmeName("");
        setProductToDeleteId("");
        toast.success("Product Deleted Successfully!", {
          theme: "colored",
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setIsOpenDialog(false);
    }
  };








  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Search 
            placeholder="Search Products..." 
            value={searchTerm}
            onSearchChange={setSearchTerm}
          /> 

          <SortProduct onSortChange={setSortOrder}/>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              {isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={handleModalOpen}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterPanelOpen && (
          <ProductFilters
            filters={filters}
            categories={categories}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
            onStockStatusChange={handleStockStatusChange}
            onClearFilters={clearFilters}
          />
        )}

        {loading ? (
          <>
            <TableSkeleton />
            <PaginationSkeletonLoader/>
          </>
        ) : (
          <>
            <ProductTable
              products={products}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <ProductAddAndEditModal
          loading={loading}
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onAddOrEditProduct={handleAddOrEditProduct}
          productToEdit={productToEdit}
          categories={categories}
        />

        <DeleteConfirmationDialog
          loading={loading}
          open={isOpeneDialog}
          itemName={itemName}
          onConfirm={handleDelete}
          onCancel={handleCancelDialog}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
