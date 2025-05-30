"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface UploadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadSuccess: (resource: any) => void; // Callback for successful upload
  buttonText?: string;                      // Optional custom button text
  icon?: JSX.Element;                       // Optional icon component
  className?: string;                       // Optional custom className for styling
  children?: React.ReactNode;               // Optional custom children
}

const UploadAvatar: React.FC<UploadButtonProps> = ({
  onUploadSuccess,
  buttonText = "Upload an Image",
  icon,
  className = "cursor-pointer inline-flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-4",
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [setResource] = useState<any>();

  return (
    <CldUploadWidget
      options={{ sources: ["local", "url", "unsplash"] }}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={(result) => {
        const uploadedResource = result?.info;
        setResource(uploadedResource);
        onUploadSuccess(uploadedResource);
      }}
      onQueuesEnd={(result, { widget }) => {
        widget.close();
      }}
    >
      {({ open }) => (
        <button
          type="button"
          className={className}
          onClick={() => {
            setResource(undefined);
            open();
          }}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children || buttonText}
        </button>
      )}
    </CldUploadWidget>
  );
};

export default UploadAvatar;
