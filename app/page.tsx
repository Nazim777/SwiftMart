import { getAllProducts } from "@/actions/action.products";
import { Hero } from "./_components/Hero";
import { ProductSection } from "./_components/ProductSection";
import { Offers } from "./_components/Offers";
import { Features } from "./_components/Features";
import { Testimonials } from "./_components/Testimonials";
import { Newsletter } from "./_components/Newsletter";
import { Footer } from "./_components/Footer";
import { AIChatBot } from "./_components/AIChatBot";
export default async function Home() {
  const page = 1;
  const limit = 6;
  let products;
  let error;
 try {
  products = await getAllProducts(page,limit)
 } catch (error) {
  error = 'Failed to get the product, please try again'
  
 }
  return (
    <>
       <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Hero />
      <ProductSection products={products?.products} error={error}/>
      <Offers />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
      
      {/* AI Assistant - Sticky floating component */}
      <AIChatBot />
    </div>
    </>
  );
}
