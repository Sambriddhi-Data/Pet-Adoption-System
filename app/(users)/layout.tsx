import Navbar from "@/components/navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main >
      <div>
        <Navbar />
        {children}
      </div>
    </main>
  );
}
