'use client'
import { Card } from "./ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper's default styles
import { ProductType } from "@/types/product";
import Link from "next/link";

type productsProps ={
    products:ProductType[] | []
}


export default function ProductCarousel({products}:productsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Our Latest Products</h2>

        <Swiper
          spaceBetween={20} // Spacing between slides
          slidesPerView={3} // Number of slides shown at once
          loop={true} // Infinite loop mode
          autoplay={{ delay: 3000 }} // Autoplay every 3 seconds
          breakpoints={{
            640: {
              slidesPerView: 1, // Show 1 slide for smaller screens
            },
            768: {
              slidesPerView: 2, // Show 2 slides for medium screens
            },
            1024: {
              slidesPerView: 3, // Show 3 slides for large screens
            },
          }}
        >
          {products &&products?.map((product) => (
            <SwiperSlide key={product.name}>
              <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={product.url}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg text-indigo-600">${product.price}</p>
                <Link
                  href="/products"
                  className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                >
                  Add to Cart
                </Link>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
