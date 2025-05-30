"use client";

import { useState, useEffect } from "react";
import UploadButton from "../Cloudinary/UploadButton";
import { ISport } from "@/app/models/Sport";
import { UploadCloud } from "lucide-react";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  created_by: {
    _id: string;
    username: string;
    avatar_image: string | null;
  };
};

export default function CreateSportModal({ isVisible, onClose, created_by }: Props) {
  const [sportName, setSportName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadSuccess = (fileUrl: string) => {
    setIcon(fileUrl);
  };

  const handleSubmit = async () => {
    if (!sportName || !description) {
      setMessage("Please fill out all required fields.");
      setIsSuccess(false);
      return;
    }

    const newSport: Partial<ISport> = {
      createdBy: created_by._id as any,
      sportName,
      description,
      icon: icon || undefined,
      teams: [],
      events: [],
      programs: [],
    };

    console.log("Sport Created:", newSport);

    try {
      setMessage("Sport created successfully!");
      setIsSuccess(true);
      // Reset form
      setSportName("");
      setDescription("");
      setIcon(null);
      onClose();
    } catch (error) {
      console.error("Error creating sport:", error);
      setMessage("Failed to create sport.");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      setMessage("");
      setIsSuccess(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <h3 className="text-2xl font-semibold mb-4 text-white">Create a New Sport</h3>

        {/* Sport Name Input */}
        <input
          type="text"
          placeholder="Sport Name"
          value={sportName}
          onChange={(e) => setSportName(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Description Input */}
        <textarea
          placeholder="Sport Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />

        {/* Icon Upload */}
        <div className="mb-4">
          <UploadButton
            onUploadSuccess={handleUploadSuccess}
            buttonText={
              <span className="flex items-center cursor-pointer">
                <UploadCloud className="mr-2 text-2xl" />
                Upload Sport Icon
              </span>
            }
            folder="sport_icons"
          />
          {icon && (
            <img
              src={icon}
              alt="Sport Icon Preview"
              className="w-20 h-20 mt-4 rounded-full object-cover shadow-md"
            />
          )}
        </div>

        {/* Button Group */}
        <div className="flex justify-between items-center space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-black font-semibold transition"
          >
            Create Sport
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}