import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
export const metadata: Metadata = {
  title: "Fur-Ever Friends",
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
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
