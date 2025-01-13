import WhyShopWithUs from "@/components/WhyShopWIthUs";
import { getAllProducts } from "@/actions/action.products";
import ProductCarousel from "@/components/ProductCarousel";
import CustomerReviews from "@/components/CustomerReviews";
import SpecialOffers from "@/components/SpecialOffers";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";
export default async function Home() {
const page = 1;
const limit = 5
  const products = await getAllProducts(page,limit)
 
  
  return (
    <>
    <section className="relative bg-blue-600 text-white py-24 px-6 mt-16">
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to SwiftMart</h1>
      <p className="text-lg mb-6">
        Discover the best products at unbeatable prices!
      </p>
      <Link
        href="/products"
        className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg text-lg hover:bg-indigo-700"
      >
        Shop Now
      </Link>
    </div>
  </section>
  <ProductCarousel products={products.products}/>
  <CustomerReviews />
      <SpecialOffers />
  <WhyShopWithUs/>
      <NewsletterSignup /> {/* Add the NewsletterSignup section */}
  </>
  );
}
