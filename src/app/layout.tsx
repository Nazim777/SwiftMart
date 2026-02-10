import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header, Footer } from "@/components/layout";
import { ToastContainer } from "react-toastify";
import { ProductContextProvider } from "@/components/providers/Product.Context";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "SwiftMart",
  description: "An Ecommerce Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ProductContextProvider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                <main className="min-h-screen">
                  {children}
                  <ToastContainer />
                </main>
                <Footer />
              </ThemeProvider>
            </QueryProvider>
          </ProductContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
