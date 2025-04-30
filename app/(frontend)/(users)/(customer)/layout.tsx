'use client'

import CustomerNavbar from "@/components/navbar";
import { LoadingProvider } from "@/providers/LoadingProvider";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main >
      <div>
        <CustomerNavbar/>
        <LoadingProvider>
        {children}
        </LoadingProvider>
      </div>
    </main>
  );
}
