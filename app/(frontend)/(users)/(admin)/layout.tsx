'use client'

import AdminNavbar from "../_components/admin/admin-navbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main >
      <div>
        <AdminNavbar/>
        {children}
      </div>
    </main>
  );
}
