'use client';
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Card } from "@/components/ui/card"

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Sign-In Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage]);

  return (
    <Card className='m-10 p-20 space-y-4 text-center opacity-85'>
      <h1 className="text-2xl font-bold mb-4">Sign-In Error</h1>
      <p className="text-gray-600 mb-8">
        {errorMessage || "An unknown error occurred during sign-in."}
      </p>
      <Link href="/sign-in" className="text-blue-500 hover:underline">
        Go back to Sign-In
      </Link>
    </Card>
  );
}