import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen relative bg-cover bg-center" style={{ backgroundImage: "url('/images/dog.jpg')"}}>
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
