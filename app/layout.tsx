import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from "@/providers/LoadingProvider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Fur-Ever Friends",
    template: "%s | Fur-Ever Friends"
  },
  description: "Pet Adoption Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen`}
      >
        <main className="flex-grow">
          <LoadingProvider>
            {children}
          </LoadingProvider>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
