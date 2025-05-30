// app/components/Cloudinary/UploadButton.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import React from "react";

interface UploadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSuccess: (resource: any) => void; // Callback for successful upload
  buttonText?: React.ReactNode; // Accept ReactNode for button content
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadSuccess,
  buttonText = "Upload an Image", // Default to a string if no buttonText is passed
}) => {
  return (
    <CldUploadWidget
      options={{ sources: ["local", "url", "unsplash"] }} // Define upload sources
      signatureEndpoint="/api/sign-cloudinary-params" // Backend endpoint for signature
      onSuccess={(result) => {
        const uploadedResource = result?.info;
        onUploadSuccess(uploadedResource);
      }}
      onQueuesEnd={(result, { widget }) => {
        widget.close(); // Close widget after all uploads are done
      }}
    >
      {({ open }) => (
        <button
          onClick={() => open()} // Open upload widget
          className="flex items-center px-4 py-2 rounded-lg text-purple-400 hover:text-purple-600 transition-all"
        >
          {buttonText} {/* Supports icons, strings, or other React nodes */}
        </button>
      )}
    </CldUploadWidget>
  );
};

export default UploadButton;