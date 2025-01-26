'use client'

import CustomerNavbar from "@/components/navbar";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main >
      <div>
        <CustomerNavbar/>
        {children}
      </div>
    </main>
  );
}
