"use client";
import React, { useState } from "react";
import { IUser } from "@/app/models/Users";
import useUserStore from "@/app/store/useUserStore";

interface EditProfileFormProps {
  user: IUser;
  onUpdate: (updatedUser: IUser) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onUpdate }) => {
  const { updateUser } = useUserStore();
  const [formData, setFormData] = useState<IUser>(user);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }) as IUser);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated user data:", formData); 
    try {
      const updatedUserData = await updateUser(user._id.toString(), formData);
      setError(null);
      onUpdate(updatedUserData); 
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user information.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-4 bg-white shadow rounded-md">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          value={formData.first_name || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          value={formData.last_name || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          name="role"
          id="role"
          value={formData.role || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProfileForm;
