export default function CustomerReviews() {
    const reviews = [
      { name: "John Doe", text: "Amazing products and great customer service!", rating: 5 },
      { name: "Jane Smith", text: "Fast shipping and quality is top-notch!", rating: 4 },
      { name: "Alice Johnson", text: "I love shopping here. Definitely coming back!", rating: 5 },
    ];
  
    return (
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Customer Reviews</h2>
          <div className="flex justify-center space-x-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white shadow-lg p-6 rounded-lg max-w-sm">
                <p className="text-lg text-gray-700 mb-4">{review.text}</p>
                <div className="flex items-center justify-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-6 w-6 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 17.75l5.65 3.05-1.45-6.45 4.9-4.75-6.6-.6L12 2.75l-2.5 6.7-6.6.6 4.9 4.75-1.45 6.45L12 17.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-6 w-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 17.75l5.65 3.05-1.45-6.45 4.9-4.75-6.6-.6L12 2.75l-2.5 6.7-6.6.6 4.9 4.75-1.45 6.45L12 17.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <p className="mt-2 font-semibold text-gray-800">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  