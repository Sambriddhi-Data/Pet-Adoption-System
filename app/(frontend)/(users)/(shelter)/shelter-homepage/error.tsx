'use client';
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");
  const handleReload = () => {
    // Reload the current page
    window.location.reload();
  };

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
    <Card className='m-10 p-10 space-y-4 text-center max-h-44 opacity-85'>
      <h1 className="text-2xl font-bold mb-4">Pet Card Error</h1>
      <p className="text-gray-600 mb-8">
        {errorMessage || "An unknown error occurred during sign-in."}
      </p>
      <Button onClick={handleReload} >
      Reload page
    </Button>
    </Card>
  );
}