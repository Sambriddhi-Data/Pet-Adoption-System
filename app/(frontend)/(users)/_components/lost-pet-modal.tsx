import React, { useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { X } from "lucide-react";

interface LostPetModalProps {
  name?: string;
  image?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  onClose: () => void;
}

export default function LostPetModal({
  name = "Unknown",
  image = "",
  address = "Unknown",
  phoneNumber = "Unknown",
  description = "Unknown",
  onClose
}: LostPetModalProps) {

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card ref={modalRef} className="relative w-[90%] max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="p-2">

          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>

          <div className="w-full h-64 mb-4">
            <CldImage
              src={
                image ||
                "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png"
              }
              width="400"
              height="400"
              alt={name}
              crop={{ type: "fill", source: true }}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>

          <CardContent className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <CardDescription className="text-sm text-gray-600 mt-2">
              Lost near: <span className="font-medium">{address}</span>
            </CardDescription>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Contact: <span className="font-medium">{phoneNumber}</span>
            </CardDescription>
            <p className="text-gray-700 text-sm mt-3">{description}</p>
          </CardContent>
        </div>

      </Card>
    </div>
  );
}
