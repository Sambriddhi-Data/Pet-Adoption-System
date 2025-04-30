"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    // Add event listeners for route change events
    window.addEventListener("beforeunload", handleStart);
    document.addEventListener("routeChangeStart", handleStart);
    document.addEventListener("routeChangeComplete", handleStop);
    document.addEventListener("routeChangeError", handleStop);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      document.removeEventListener("routeChangeStart", handleStart);
      document.removeEventListener("routeChangeComplete", handleStop);
      document.removeEventListener("routeChangeError", handleStop);
    };
  }, []);

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {children}
    </>
  );
};