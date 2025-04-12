'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { CldImage } from 'next-cloudinary';
import { LostPetModalProps } from "./type";


export function LostPetCard({
  name = "Unknown",
  image = [], 
  address = "Unknown",
  phoneNumber = "Unknown",
  status = "lost",
  onClick
}: LostPetModalProps) {
  const primaryImage = Array.isArray(image) && image.length > 0 
    ? image[0] 
    : "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png";

  return (
    <>
      <div className="mt-10 cursor-pointer" onClick={onClick}>
        <Card className="relative w-64 h-96 bg-white bg-opacity-90 shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="relative w-full h-2/3">
            <CldImage
              src={primaryImage}
              width="350"
              height="350"
              alt={name}
              crop={{ type: "fill", source: true }}
              className="object-cover w-full h-full"
              priority
              loading="eager"
            />
          </div>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            {status === "found" ? "Found near" : "Lost near"}
              : <span className="font-medium">{address}</span>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Contact: <span className="font-medium">{phoneNumber}</span>
            </CardDescription>
          </CardContent>
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-semibold">
            Click for Details
          </div>
        </Card>
      </div>
    </>
  );
}