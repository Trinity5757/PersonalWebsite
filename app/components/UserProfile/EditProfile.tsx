"use client";
import { Gender } from '@/app/models/enums/Gender';
import React, { ChangeEvent } from 'react';
import { useSession } from "next-auth/react";
import UploadButton from "@/app/components/Cloudinary/UploadButton";
import { useState } from 'react';

interface UserEditFormProps {
  formData: {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    gender: Gender;
    bio?: string;
    avatar_image?: string;
    cover_image?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ formData, onInputChange, onSubmit }) => {
  const { update } = useSession();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (uploadedResource: any, fieldName: string) => {
    try {
      if (fieldName === "avatar_image") setUploadingAvatar(true);
      if (fieldName === "cover_image") setUploadingCover(true);

      const fileUrl = uploadedResource?.secure_url || uploadedResource;

      if (!fileUrl) {
        console.error("Invalid upload response:", uploadedResource);
        return;
      }

      // Create a synthetic event to pass to the parent's onInputChange handler
      const syntheticEvent = {
        target: {
          name: fieldName,
          value: fileUrl,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onInputChange(syntheticEvent);
    } catch (error) {
      console.error("Upload handling error:", error);
    } finally {
      if (fieldName === "avatar_image") setUploadingAvatar(false);
      if (fieldName === "cover_image") setUploadingCover(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || uploadingAvatar || uploadingCover) return;

    setIsSubmitting(true);
    try {
      // Call the original onSubmit provided by the parent
      await onSubmit(e);

      // Update the session
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
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Avatar Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full h-24 rounded-lg object-cover border border-gray-300"
            />
          )}
        </div>
      </div>

      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={onInputChange}
        placeholder="First Name"
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={onInputChange}
        placeholder="Last Name"
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
        disabled={isSubmitting}
      />
      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={onInputChange}
        placeholder="Role"
        className="w-full p-2 border rounded"
        disabled={isSubmitting}
      />

      <textarea
        name="bio"
        value={formData.bio || ""}
        onChange={onInputChange}
        placeholder="Bio"
        className="w-full p-2 border rounded"
        disabled={isSubmitting}
      />

      <select
        title='Gender'
        name="gender"
        value={formData.gender}
        onChange={onInputChange}
        className="w-full p-2 border rounded mb-4"
        disabled={isSubmitting}
      >
        <option value={Gender.Male}>Male</option>
        <option value={Gender.Female}>Female</option>
        <option value={Gender.Other}>Other</option>
      </select>

      <div className="flex justify-end space-x-2 border-t border-gray-200 py-4"></div>

      <button 
        type="submit" 
        className="mx-auto bg-blue-500 text-white p-2 rounded"
        disabled={isSubmitting || uploadingAvatar || uploadingCover}
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UserEditForm;