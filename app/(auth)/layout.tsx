import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <main>
    <div className="h-screen flex flex-col items-center justify-center">
      <Logo/>
        {children}
    </div>
   </main>
  );
}
