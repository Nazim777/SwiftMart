"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/actions/action.category";
import type { category } from "@/types/category";
import Spinner from "@/components/Spinner";
import DeleteConfirmationDialog from "@/components/ConfirmationModal";
import { toast } from "react-toastify";
import CategoryTable from "@/components/CategoryTable";
import TableSkeleton from "@/components/TableSkeleton";
import Pagination from "@/components/Pagination";
import PaginationSkeletonLoader from "@/components/PaginationSkeletonLoader";
import Search from "@/components/Search";
import SortCategory from "@/components/SortComponet";
import { useAdminGuard } from "@/custom-hooks/UseAdminGuard";

const AdminCategoriesPage = () => {
  


  const [categories, setCategories] = useState<category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<category |null>(null);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<category | null>(
    null
  );

  const itemPerPage = 2
  const [curretnPage,setCurrentPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)
  const [searchTerm,setSearchTerm] = useState('')
  const [sortOrder,setSortOrder] = useState<"asc"|"desc">("asc")

  // Fetch categories from the database
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await getAllCategories(curretnPage,itemPerPage,searchTerm,sortOrder);
    if (response?.success) {
      setCategories(response.data);
      setTotalPages(response?.totalPages)
    }
    } catch (error) {
      console.log('error',error)
      
    }finally{
      setLoading(false)
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, [curretnPage,searchTerm,sortOrder]);

  // Handle add/edit category
  const handleSaveCategory = async () => {
    setLoading(true);

    if (editingCategory?.name !== "" && editingCategory?.id) {
      if (categoryName !== "") {
        const response = await updateCategory({
          id: editingCategory.id,
          name: categoryName,
        });
        if (response?.success) {
          const mappedCategories = categories.map((item) =>
            item.id === response.data.id ? { ...response.data } : item
          );
          setCategories(mappedCategories);
          toast.success('Category Updated Successfully!',{
            theme: "colored",
          })
        }
      }
    } else {
      if (categoryName !== "") {
        const response = await createCategory(categoryName);
        if (response?.success) {
          setCategories((prev) => [...prev, response.data]);
          toast.success('Category Created Successfully!',{
            theme: "colored",
          })
        }
      }
    }

    // Reset state after saving
    setCategoryName("");
    setEditingCategory(null);
    fetchCategories();
    setIsDialogOpen(false);
    setLoading(false);
  };




  // Open dialog for editing a category
  const openEditDialog = (category: category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
    setIsDialogOpen(true);
  };


// delete category
const [isOpeneDialogDelete,setIsOpenDialogForDelete] = useState(false)
const handleCancelDialog = ()=>{
  setIsOpenDialogForDelete(false)
  setSelectedCategory(null)
  setCategoryName('')

}

  const confirmDelete = async () => {
    if (selectedCategory) {
      setLoading(true);
      try {
        const response = await deleteCategory(selectedCategory.id);
        if (response?.success) {
          const filteredCategories = categories.filter(
            (item) => item.id !== selectedCategory.id
          );
          setCategories(filteredCategories);
          setSelectedCategory(null);
          toast.success('Category Deleted Successfully!',{
            theme: "colored",
          })
        }
      } catch (error) {
        console.error("Failed to delete category", error);
      } finally {
        setLoading(false);
        setIsOpenDialogForDelete(false)
      }
    }
  };



  // pagination
  const handlePageChange = (page:number)=>{
    setCurrentPage(page)

  }

  const handleSearchChanges = (text:string)=>{
    setSearchTerm(text)
  }


  // admin guard(admin accessible only)
  const {} = useAdminGuard()
   


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
       <Search value={searchTerm} onSearchChange={handleSearchChanges} placeholder="Search category name..."/>
       <SortCategory onSortChange={setSortOrder}/>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Category
        </Button>
       
      </div>

      {loading? 
      <>
      <TableSkeleton/>
      <PaginationSkeletonLoader/>
      </>
      :
      <>
      <CategoryTable
      categories={categories}
      openEditDialog={openEditDialog}
      setSelectedCategory={setSelectedCategory}
      setIsOpenDialogForDelete={setIsOpenDialogForDelete}
      />
      <Pagination currentPage={curretnPage} totalPages={totalPages} onPageChange={handlePageChange}/>
      </>
      }

      <DeleteConfirmationDialog
        open={isOpeneDialogDelete}
        onCancel={handleCancelDialog}
        onConfirm={confirmDelete}
        itemName={selectedCategory?.name || ""}
        loading={loading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveCategory}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? <Spinner /> : "Save Category"}
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false)
                setEditingCategory(null);
                setCategoryName('')
              }}
              variant="ghost"
              className="ml-4"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoriesPage;
