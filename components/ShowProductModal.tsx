import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ProductType } from "@/types/product";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ShowProductModalProps {
  isOpen: boolean;
  setProductShowModal: (value: boolean) => void;
  product?: ProductType | null;
}

const ShowProductModal = ({ isOpen, setProductShowModal, product }: ShowProductModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setProductShowModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
        </DialogHeader>

        {/* PRODUCT IMAGE */}
        <div className="w-full h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={product.url}
            alt={product.name}
            width={400}
            height={300}
            className="object-contain"
          />
        </div>

        {/* PRICE + STOCK */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          <p
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {product.categories?.length > 0 ? (
            product.categories.map((item, i) => (
              <Badge key={i} className="bg-gray-800 text-white">
                {item.category.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500">No category assigned</span>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">{product.description}</p>

        {/* FOOTER */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setProductShowModal(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowProductModal;

