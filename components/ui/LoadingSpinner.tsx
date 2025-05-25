import React from "react";
import "@/components/ui/loader.css";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="loader"></div>
    </div>
  );
};
