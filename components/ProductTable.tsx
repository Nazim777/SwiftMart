import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductType } from '@/types/product';



interface ProductTableProps {
  products: ProductType[] | undefined;
  onEdit: (product: ProductType) => void;
  onDelete:(id:string,name:string)=>void
}

export default function ProductTable({ products, onEdit,onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium">
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Categories</th>
            <th className="px-6 py-3">Created At</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">{product.name}</td>
              <td className="px-6 py-4">${product.price.toFixed(2)}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">
                {product.categories.map((c) => c.category.name).join(', ')}
              </td>
              <td className="px-6 py-4">{new Date(product.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 flex justify-center gap-3">
                <Link href={`/admin/products/${product.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={()=>onDelete(product.id,product.name)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
