export default function NewsletterSignup() {
    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Stay Updated!</h2>
          <p className="text-lg mb-8">Subscribe to our newsletter to get the latest deals and updates.</p>
          <form className="max-w-md mx-auto flex items-center justify-center space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    );
  }
  