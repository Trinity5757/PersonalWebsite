"use client";

import React, { useState, ChangeEvent } from "react";

interface UploadButtonProps {
  onUploadSuccess: (fileName: string) => void;
  buttonText?: React.ReactNode;
  folder?: string;
  className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadSuccess,
  buttonText = "Upload to S3",
  folder,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.secure_url) {
        onUploadSuccess(data.secure_url);
      } else {
        setError(data.error || "Failed to upload");
      }
    } catch (error) {
      setError("An unexpected error occurred " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`cursor-pointer ${className}`}>
      <label className="cursor-pointer w-full">
        {buttonText}
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*, .pdf, .txt, .svg"
        />
      </label>
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default UploadButton;
