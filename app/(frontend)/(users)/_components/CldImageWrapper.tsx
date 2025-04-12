"use client";
import { CldImage } from "next-cloudinary";

export default function CldImageWrapper({ src, alt }: { src: string; alt: string }) {
  return (
    <CldImage
      src={src}
      height="60"
      width="60"
      alt={alt}
      crop={{ type: 'fill', source: true }}
      className="object-cover"
    />
  );
}
