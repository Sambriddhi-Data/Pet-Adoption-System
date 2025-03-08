'use client'
import { useSession } from "@/auth-client";
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import classNames from "classnames";
import { FileUser, MapPin } from "lucide-react";
import { CldImage } from 'next-cloudinary';
import { usePathname } from "next/navigation";

export function PetCard({ name = "Unknown", age = "Unknown", status = "Unknown", address = "Unknown", images = [] }) {
  const session = useSession();
  const pathname = usePathname();
  const primaryImage = Array.isArray(images) && images.length > 0
    ? images[0]
    : "https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png";

  return (
    <div className='mt-10 cursor-pointer'>
      <Card className="relative w-full h-80 text-left bg-white bg-opacity-90 shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105">
        <CardContent className="relative w-full h-2/3">
          <CldImage
            src={primaryImage}
            fill
            alt={name}
            crop={{
              type: 'fill',
              source: true
            }}
            className="object-cover w-full h-full"
          />
        </CardContent>

        <CardContent className="mt-1 flex flex-col justify-between h-1/3">
          <div className="p-2 flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="font-semibold">{name}</p>
              <CardDescription className="">{age}</CardDescription>
              {pathname !== "/shelter-homepage" &&
                <CardDescription className="flex gap-1 items-center"> <MapPin color="green" size={16} />{address}</CardDescription>
              }
              {pathname === "/shelter-homepage" &&
                <CardDescription className="flex gap-1 items-center"><FileUser color="green" size={16}/>0 Applications</CardDescription>
              }

            </div>
            <div>
              {pathname === "/shelter-homepage" && <CardDescription className={classNames({
                "bg-blue-200 rounded-md px-2 text-xs w-fit": true,
                'bg-green-200': status === "adopted"
              })}
              >{status}</CardDescription>}
              {pathname !== "/shelter-homepage" &&
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#df0000" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"></path></svg>}
            </div>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#df0000" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"></path></svg> */}
          </div>
        </CardContent>
      </Card>
    </div>

  );

}
