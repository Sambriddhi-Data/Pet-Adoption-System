'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import classNames from "classnames";
import { CldImage } from 'next-cloudinary';


export function PetCard({name = "Unknown", age = "Unknown", status = "Unknown", address = "Unknown"}) {
  return (
    <div className='mt-10'>
        <Card className="flex-col justify-center max-w-md h-80 min-w-28 bg-white bg-opacity-85 shadow-lg p-4 ">
          <CardContent className="flex justify-center">
            <CldImage
              src="https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png" // Use this sample image or upload your own via the Media Explorer
              width="160"
              height="160"
              alt="Sample"
              crop={{
                type: 'auto',
                source: true
              }}
            />
          </CardContent>

          <CardContent>
            <div className="flex flex-col">
              <CardDescription className={classNames({
                "bg-blue-200 rounded-md px-2 w-fit": true,
                'bg-green-200': status ==="adopted"
              })}
              >{status}</CardDescription>
              <p>{name}</p>
              <CardDescription className="">{age}</CardDescription>
              <CardDescription>{address}</CardDescription>
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#df0000" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"></path></svg>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#df0000" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"></path></svg> */}
            </div>

          </CardContent>

        </Card>
    </div>

  );

}
