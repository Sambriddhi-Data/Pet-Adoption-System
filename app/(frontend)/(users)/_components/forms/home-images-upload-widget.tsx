import { useEffect, useCallback } from 'react';

export const useSignedCloudinaryWidgetHome = (onSuccess: (result: any) => void) => {
  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = useCallback(async () => {
    if (!window.cloudinary) {
      console.error('Cloudinary widget not loaded');
      return;
    }

    try {
      // Get your signature from your API
      const signResponse = await fetch('/api/cloudinary/homesign');
      const { signature, timestamp, api_key } = await signResponse.json();

      // Create the widget with signed upload parameters
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
          apiKey: api_key,
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder: 'home_images', // folder
          maxFiles: 5,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ["jpg", "jpeg", "png"],
          sources: ["local", "camera", "url", "google_drive"],
          resourceType: "image",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onSuccess(result);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error('Error opening widget:', error);
    }
  }, [onSuccess]);

  return { openWidget };
};