export default function WhyWithUs() {
  const reasons = [
    {
      title: "Premium Quality",
      description: "We offer the best quality products, sourced from trusted manufacturers.",
      icon: "quality",
    },
    {
      title: "Fast Shipping",
      description: "Enjoy fast and reliable shipping right to your doorstep.",
      icon: "shipping",
    },
    {
      title: "24/7 Customer Support",
      description: "Our customer service team is available 24/7 to assist you with any questions.",
      icon: "support",
    },
    {
      title: "Secure Payment",
      description: "We offer secure and easy payment methods for your peace of mind.",
      icon: "payment",
    },
  ];

  return (
    <section className="py-16 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Why Shop With Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="flex justify-center items-center mb-4">
                <svg
                  className="h-12 w-12 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {reason.icon === "quality" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9V3m0 0L8 7m4-4l4 4m4 14h-4m-8 0H4m0 0l4-4m-4 4l4 4"
                    />
                  )}
                  {reason.icon === "shipping" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 7h2l3 13h6l3-13h2M3 6h18M9 21v2h6v-2M9 13h6m-6 0L5 9h14l-4 4z"
                    />
                  )}
                  {reason.icon === "support" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zM12 2c-3.31 0-6 2.69-6 6 0 2.2 1.44 4.06 3.46 4.88C8.62 14.66 10.07 16 12 16c1.89 0 3.5-.9 4.38-2.24C15.56 13.02 16 11.7 16 10c0-3.31-2.69-6-6-6z"
                    />
                  )}
                  {reason.icon === "payment" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12h18M12 5l7 7-7 7m7-7H5"
                    />
                  )}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{reason.title}</h3>
              <p className="mt-4 text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
