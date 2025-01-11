import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Select from "react-select"; // Import react-select
import Spinner from "./Spinner";
import { ProductType } from "@/types/product";

interface ProductAddAndEditModalProps {
  isOpen: boolean;
  setIsModalOpen:any
  onAddOrEditProduct: (product: any) => void;
  productToEdit?: ProductType | null ;
  categories: { id: string; name: string }[];
  loading:boolean
}

const ProductAddAndEditModal = ({
  isOpen,
  setIsModalOpen,
  onAddOrEditProduct,
  productToEdit,
  categories,
  loading
}: ProductAddAndEditModalProps) => {
 
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]); // For multi-select

  const [isLoading, setIsLoading] = useState(loading);

useEffect(() => {
  setIsLoading(loading);  // Sync parent prop to local state
}, [loading]);

console.log(isLoading?'loading':'not loading')
  useEffect(() => {
    if (productToEdit) {
      setProductName(productToEdit.name);
      setProductUrl(productToEdit.url);
      setProductDescription(productToEdit.description);
      setProductPrice(productToEdit.price);
      setProductStock(productToEdit.stock);
    } else {
      setProductName("");
      setProductUrl("");
      setProductDescription("");
      setProductPrice(0);
      setProductStock(0);
      setSelectedCategories([]);
    }
  }, [productToEdit, isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product = {
      id: productToEdit?.id || "",
      name: productName,
      url: productUrl,
      description: productDescription,
      price: productPrice,
      stock: productStock,
      categories: selectedCategories.map((cat) => cat.value), // Map selected categories to their ids
    };

    onAddOrEditProduct(product);
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            {!productToEdit&&
            <div>
              <Label htmlFor="categories">Categories</Label>
              <Select
                id="categories"
                value={selectedCategories}
                onChange={(newValue) => setSelectedCategories(newValue as any[])} // Fix the type here
                options={categoryOptions}
                isMulti
                required
              />
            </div>
            }
            <div>
              <Label htmlFor="url">Product URL</Label>
              <Input
                id="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                value={productPrice}
                onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                value={productStock}
                onChange={(e) => setProductStock(parseInt(e.target.value))}
                required
              />
            </div>
           
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
            className="bg-red-600 hover:bg-red-700" 
            type="submit">{isLoading?<Spinner/>:'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAddAndEditModal;

