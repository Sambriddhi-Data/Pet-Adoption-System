"use client";

import React, { useState, useEffect, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Simulate loading effect when route changes
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500); // 500ms fake delay
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {children}
    </>
  );
};
