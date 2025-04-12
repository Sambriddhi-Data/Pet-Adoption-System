'use client'
import { useSession } from "@/auth-client";
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import classNames from "classnames";
import { FileUser, MapPin } from "lucide-react";
import { CldImage } from 'next-cloudinary';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdoptionRequest } from "./type";
import { toast } from "@/hooks/use-toast";

export function PetCard({ id = "", name = "Unknown", age = "Unknown", status = "Unknown", address = "Unknown", images = [] }) {
  const session = useSession();
  const pathname = usePathname();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdoptionRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/adoptionRequestsByPetId?petId=${id}`
      );
      const data = await response.json();
      const requestsData = Array.isArray(data.data) ? data.data : [];
      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch adoption requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.data?.user?.id) {
      fetchAdoptionRequests();
    }
  }, [id, session]);

  const primaryImage = Array.isArray(images) && images.length > 0
    ? images[0]
    : "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png";

  return (
    <div className='mt-4 sm:mt-6 md:mt-8 lg:mt-10 cursor-pointer w-full'>
      <Card className="relative w-full h-64 sm:h-72 md:h-80 text-left bg-white bg-opacity-90 shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative w-full h-3/5 sm:h-2/3">
          <CldImage
            src={primaryImage}
            height="200"
            width="200"
            alt={name}
            crop={{
              type: 'fill',
              source: true
            }}
            className="object-cover w-full h-full"
          />
        </div>

        <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col justify-between h-2/5 sm:h-1/3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm sm:text-base font-semibold truncate max-w-32 sm:max-w-40 md:max-w-48">{name}</p>
              <CardDescription className="text-xs sm:text-sm truncate">{age}</CardDescription>
              {pathname !== "/shelter-homepage" &&
                <CardDescription className="flex gap-1 items-center text-xs sm:text-sm truncate max-w-32 sm:max-w-40 md:max-w-48">
                  <MapPin color="green" size={12} className="sm:w-4 sm:h-4" />
                  <span className="truncate">{address}</span>
                </CardDescription>
              }
              {pathname === "/shelter-homepage" &&
                <CardDescription className="flex gap-1 items-center text-xs sm:text-sm">
                  <FileUser color="green" size={12} className="sm:w-4 sm:h-4" />
                  <span>{requests.length > 1 ? `${requests.length} Applications` : `${requests.length} Application`}</span>
                </CardDescription>
              }
            </div>
            <div>
              {pathname === "/shelter-homepage" &&
                <CardDescription className={classNames({
                  "bg-blue-200 rounded-md px-2 py-1 text-xs w-fit text-black": true,
                  'bg-green-200': status === "adopted"
                })}>
                  {status.toUpperCase()}
                </CardDescription>
              }
              {/* {pathname !== "/shelter-homepage" &&
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} className="sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path fill="#df0000" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"></path>
                </svg>
              } */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}