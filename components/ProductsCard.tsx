import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Image from 'next/image'
import { Button } from './ui/button'
import { ProductType } from '@/types/product'
import Link from 'next/link'

type productProps = {
    product:ProductType
}

const ProductsCard = ({product}:productProps) => {
  return (
    <Card key={product.id} className="shadow-lg">
    <CardHeader className="p-0 relative">
      <Image
        src={product.url}
        alt={product.name}
        width={300}
        height={200}
        className="rounded-t-lg object-cover w-full h-48"
      />
    </CardHeader>
    <CardContent className="p-4 space-y-2">
      <CardTitle className="text-lg font-semibold">
        {product.name}
      </CardTitle>
      <p
        className={`text-sm ${
          product.stock > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </p>
      <p className="text-lg font-bold text-blue-600">${product.price}</p>
      <div className="flex justify-between mt-4">
       <Link href={`/products/${product.id}`}>
       <Button variant="outline" size="sm">
          View Details
        </Button>
       </Link>
        {product.stock > 0 && (
          <Button variant="default" size="sm">
            Add to Cart
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
  )
}

export default ProductsCard
