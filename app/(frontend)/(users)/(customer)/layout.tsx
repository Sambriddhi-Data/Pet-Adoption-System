'use client'

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { LoadingProvider } from "@/providers/LoadingProvider";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <main className="flex-grow min-h-screen">
      <div>
        <Navbar/>
        <LoadingProvider>
        {children}
        </LoadingProvider>
      </div>
    </main>
    <Footer />
    </>
  );
}
