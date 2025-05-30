"use client";

import { IUser } from "@/app/models/Users";
import { useState } from "react";

interface EditProfileFormProps {
  user: IUser; // Use the appropriate type for userData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (updatedData: any) => void;
  onClose: () => void;
}

export default function EditProfileModal({
  user,
  onSave,
  onClose,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    avatar_image: user.avatar_image || "",
    cover_image: user.cover_image || "",
    bio: user.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-lg resize overflow-auto"
        style={{ minHeight: "300px", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm text-gray-400 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm text-gray-400 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="avatar_image"
              className="block text-sm text-gray-400 mb-1"
            >
              Avatar Image URL
            </label>
            <input
              type="text"
              id="avatar_image"
              name="avatar_image"
              value={formData.avatar_image}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="cover_image"
              className="block text-sm text-gray-400 mb-1"
            >
              Cover Image URL
            </label>
            <input
              type="text"
              id="cover_image"
              name="cover_image"
              value={formData.cover_image}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm text-gray-400 mb-1">
              Bio
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Button Group */}
          <div className="flex justify-between items-center space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-black font-semibold transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}