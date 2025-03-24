'use client';
import React, { useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface LostPetModalProps {
  name?: string;
  image?: string[];
  address?: string;
  phoneNumber?: string;
  description?: string;
  status?: string;
  onClose: () => void;
}

export default function LostPetModal({
  name = "Unknown",
  image = [],
  address = "Unknown",
  phoneNumber = "Unknown",
  description = "Unknown",
  status = "lost",
  onClose
}: LostPetModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const defaultImage = "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png";

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

  // Check if image is an array and has items, otherwise use default image
  const imageUrls = Array.isArray(image) && image.length > 0 ? image : [defaultImage];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card ref={modalRef} className="relative w-[90%] max-w-md bg-white shadow-lg rounded-xl p-6">
        <div className="p-2">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
          >
            <X size={24} />
          </button>

          <div className="w-full h-80 mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {imageUrls.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-80">
                      <CldImage
                        src={img}
                        width="400"
                        height="400"
                        alt={`${name} - image ${index + 1}`}
                        crop={{ type: "fill", source: true }}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {imageUrls.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                </>
              )}
            </Carousel>
          </div>

          <CardContent className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <CardDescription className="text-sm text-gray-600 mt-2">
             {status === "found" ? "Found near" : "Lost near"}
              : <span className="font-medium">{address}</span>
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