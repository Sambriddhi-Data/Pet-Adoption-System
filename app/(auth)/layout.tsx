import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen relative bg-cover bg-center" style={{ backgroundImage: "url('/images/dog.jpg')" }}>
      <div className="absolute top-4 left-4">
        <Logo />
      </div>

      <div className="h-full flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}
