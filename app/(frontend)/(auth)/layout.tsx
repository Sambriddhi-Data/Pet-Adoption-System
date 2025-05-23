import { Logo } from "@/components/Logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:"Register",
}
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('/images/dog.jpg')"}}>
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Logo color="white"/>
        </Link>
      </div>
      <div className="h-full flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}
