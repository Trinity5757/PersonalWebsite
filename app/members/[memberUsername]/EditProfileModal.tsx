"use client";
import { IUser } from "@/app/models/Users";
import UploadButton from "@/app/components/Cloudinary/UploadButton";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EditProfileModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<IUser>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = async (uploadedResource: any, fieldName: string) => {
    try {
      if (fieldName === "avatar_image") setUploadingAvatar(true);
      if (fieldName === "cover_image") setUploadingCover(true);

      const fileUrl = uploadedResource?.secure_url || uploadedResource;

      if (!fileUrl) {
        console.error("Invalid upload response:", uploadedResource);
        return;
      }

      const syntheticEvent = {
        target: {
          name: fieldName,
          value: fileUrl,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    } catch (error) {
      console.error("Upload handling error:", error);
    } finally {
      if (fieldName === "avatar_image") setUploadingAvatar(false);
      if (fieldName === "cover_image") setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || uploadingAvatar || uploadingCover) return;

    setIsSubmitting(true);

    try {
      await onSubmit(e);

      if (update) {
        const sessionUpdateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          avatar_image: formData.avatar_image,
          bio: formData.bio,
          gender: formData.gender,
        };

        await update({ user: sessionUpdateData });
      }

      onClose();
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-base-100 p-6 rounded-lg shadow-2xl w-full max-w-lg overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Avatar Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar Image
          </label>
          <div className="flex items-center gap-4">
            <UploadButton
              onUploadSuccess={(resource) =>
                handleUploadSuccess(resource, "avatar_image")
              }
              buttonText={uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              folder="user_avatars"
            />
            {formData.avatar_image && (
              <img
                src={formData.avatar_image}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border border-gray-300"
              />
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            <UploadButton
              onUploadSuccess={(resource) =>
                handleUploadSuccess(resource, "cover_image")
              }
              buttonText={uploadingCover ? "Uploading..." : "Upload Cover"}
              folder="user_covers"
            />
            {formData.cover_image && (
              <img
                src={formData.cover_image}
                alt="Cover Preview"
                className="w-full h-32 rounded-lg object-cover border border-gray-300"
              />
            )}
          </div>
        </div>


        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "First Name", name: "first_name", type: "text" },
            { label: "Last Name", name: "last_name", type: "text" },
            { label: "Email", name: "email", type: "email" },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={onChange}
                className="mt-1 w-full p-3 border rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-purple-400"
                disabled={isSubmitting}
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={onChange}
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-purple-400"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || "other"}
              onChange={onChange}
              className="mt-1 w-full p-3 border rounded-md bg-gray-100 text-gray-800 focus:ring-2 focus:ring-purple-400"
              disabled={isSubmitting}
            >
              <option value="other">Other</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              disabled={isSubmitting || uploadingAvatar || uploadingCover}
              className="px-4 py-2 bg-purple-500 text-base-100 rounded-md hover:bg-purple-600"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || uploadingAvatar || uploadingCover}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}