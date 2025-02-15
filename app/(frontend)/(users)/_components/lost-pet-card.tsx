'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import classNames from "classnames";
import { CldImage } from 'next-cloudinary';


export function LostPetCard({ name = "Unknown", age = "Unknown", status = "Unknown", address = "Unknown" }) {
  return (
    <div className='mt-10'>
      <Card className="flex-col justify-center w-64 h-80 min-w-28 bg-white bg-opacity-85 shadow-lg p-2 ">
        <CardContent className="flex justify-center">
          <CldImage
            src="https://res.cloudinary.com/dasa1mcpz/image/upload/v1739022787/FurEverFriendsPetImages/kracd2oevfyabh2scuqk.png" // Use this sample image or upload your own via the Media Explorer
            width="350"
            height="350"
            alt="Sample"
            crop={{
              type: 'auto',
              source: true
            }}
          />
        </CardContent>

        <CardContent>
          <div className="flex flex-col">
            <p>{name}</p>
            <CardDescription className="">{age}</CardDescription>
            <CardDescription>Lost near {address}</CardDescription>
            <CardDescription>9810101010</CardDescription>

          </div>

        </CardContent>

      </Card>
    </div>

  );

}
