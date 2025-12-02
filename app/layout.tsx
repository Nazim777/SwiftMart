import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
//import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import { ProductContextProvider } from "@/context/Product.Context";
import { Navbar } from "./_components/Navbar";

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
      <html lang="en">
        <body>
          <html lang="en">
            <body>
              <ProductContextProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Navbar />
                  <main className="min-h-screen ">
                    {children}
                    <ToastContainer />
                  </main>
                </ThemeProvider>
              </ProductContextProvider>
            </body>
          </html>
        </body>
      </html>
    </ClerkProvider>
  );
}
