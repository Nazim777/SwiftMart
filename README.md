# SwiftMart: eCommerce Platform

SwiftMart is a full-featured eCommerce application built using Next.js that allows users to browse products, manage orders, and make payments. With a powerful admin dashboard, admins can efficiently manage products, users, and orders.

## Features

- User authentication and account management with Clerk
- Product browsing with  Search, Sort, Filter, Pagination, cart management, and checkout,
- Order placement, payment processing, and tracking
- Admin dashboard for managing products, orders, and users
- Product category management
- Real-time payment and order status updates
- View and manage past orders and user profiles

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the frontend and API routes
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Clerk](https://clerk.com/) - Authentication and user management
- [Prisma](https://prisma.io/) - TypeScript ORM for database management
- [Neon Database](https://neon.tech/) - Serverless Postgres database
- [Stripe](https://stripe.com/) - Payment processing for subscriptions
- [Lucide React](https://lucide.dev/) - Icon library

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Nazim777/SwiftMart.git
   cd SwiftMart
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   DATABASE_URL= 
   STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_BASE_URL= 
   STRIPE_WEBHOOK_SECRET=
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Migreate the database

   ```bash
   npx prisma migrate dev
   ```
6. push the changes to the database

   ```bash
   npx prisma db push 
  ```
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```



