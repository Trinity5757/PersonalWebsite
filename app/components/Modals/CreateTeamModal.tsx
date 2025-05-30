"use client";

import { useState, useEffect } from "react";
import UploadButton from "../Cloudinary/UploadButton";
import { ITeam } from "@/app/models/Team";
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

export default function CreateTeamModal({
  isVisible,
  onClose,
  created_by,
}: Props) {
  const [teamName, setTeamName] = useState("");
  const [sportType, setSportType] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadSuccess = (fileUrl: string, fieldName: string) => {
    if (fieldName === "profilePicture") {
      setAvatarPreview(fileUrl);
    } else if (fieldName === "cover_picture") {
      setCoverPreview(fileUrl);
    }
  };

  const handleSubmit = async () => {
    if (!teamName || !sportType) {
      setMessage("Please fill out all fields.");
      setIsSuccess(false);
      return;
    }

    const newTeam: Partial<ITeam> = {
      created_by: created_by._id,
      name: teamName,
      sportType,
      profilePicture: avatarPreview,
      cover_picture: coverPreview,
    };

    console.log("Team Created:", newTeam);

    // Mock API call
    try {
      setMessage("Team created successfully!");
      setIsSuccess(true);
      // Reset form
      setTeamName("");
      setSportType("");
      setAvatarPreview(null);
      setCoverPreview(null);
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      setMessage("Failed to create team.");
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
      {/* Modal Content */}
      <div className="bg-base-100 p-6 rounded-lg shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <h3 className="text-2xl font-semibold mb-4 text-white">
          Create a New Team
        </h3>

        {/* Team Name Input */}
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Sport Type Input */}
        <input
          type="text"
          placeholder="Sport Type"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Avatar Upload */}
        <div className="mb-4">
          <UploadButton
            onUploadSuccess={(fileUrl) =>
              handleUploadSuccess(fileUrl, "profilePicture")
            }
            buttonText={
              <span className="flex items-center cursor-pointer">
                <UploadCloud className="mr-2 text-2xl" />
                Upload Team Avatar
              </span>
            }
            folder="team_avatars"
          />
          {avatarPreview && (
            <div className="mt-3">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Cover Image Upload */}
        <div className="mb-4">
          <UploadButton
            onUploadSuccess={(fileUrl) =>
              handleUploadSuccess(fileUrl, "cover_picture")
            }
            buttonText={
              <span className="flex items-center cursor-pointer">
                <UploadCloud className="mr-2 text-2xl" />
                Upload Cover Image
              </span>
            }
            folder="team_covers"
          />
          {coverPreview && (
            <div className="mt-3">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Button Group */}
        <div className="flex justify-between items-center space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
          >
            Create Team
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
