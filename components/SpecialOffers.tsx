import Link from "next/link";

export default function SpecialOffers() {
    const offers = [
      { title: "Spring Sale", discount: "20%", description: "Get 20% off on all products" },
      { title: "Bundle Deal", discount: "Buy 1 Get 1 Free", description: "Limited time offer on select items" },
      { title: "Free Shipping", discount: "Free", description: "Enjoy free shipping on orders over $50" },
    ];
  
    return (
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Special Offers</h2>
          <div className="flex justify-center space-x-8">
            {offers.map((offer, index) => (
              <div key={index} className="bg-white text-indigo-600 p-6 rounded-lg max-w-sm shadow-lg">
                <h3 className="text-2xl font-semibold mb-2">{offer.title}</h3>
                <p className="text-xl font-bold mb-4">{offer.discount}</p>
                <p>{offer.description}</p>
                <Link
                  href="/products"
                  className="mt-4 inline-block bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-800"
                >
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  