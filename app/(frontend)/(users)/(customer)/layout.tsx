'use client'

import CustomerNavbar from "../_components/customer-navbar";

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
