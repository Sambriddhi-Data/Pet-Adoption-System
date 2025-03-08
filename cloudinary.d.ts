// cloudinary.d.ts
interface CloudinaryWidget {
  open(): void;
  close(): void;
}

interface CloudinaryInterface {
  createUploadWidget(options: any, callback: Function): CloudinaryWidget;
}

declare global {
interface Window {
  cloudinary: CloudinaryInterface;
}
}

export {};
