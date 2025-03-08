import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  export async function POST(req: NextRequest) {
    try {
      const { publicId } = await req.json();
      
      console.log("Attempting to delete image with public ID:", publicId);
      
      if (!publicId) {
        return NextResponse.json({ message: 'Public ID is required' }, { status: 400 });
      }
      
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete result:", result);
      
      if (result.result === 'ok' || result.result === 'not found') {
        return NextResponse.json({ success: true });
      } else {
        throw new Error(`Cloudinary deletion failed: ${result.result}`);
      }
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return NextResponse.json({ 
        message: 'Failed to delete image',
        error: (error as Error).message 
      }, { status: 500 });
    }
  }