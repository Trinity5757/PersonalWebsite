"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logout from "@/app/dashboard/Logout";
import { resolveSidebarConfig } from "@/app/utility/sidebarConfig";
import useTeamStore from "@/app/store/useTeamStore";
import { ITeam } from "@/app/models/Team";
import { useSession } from "next-auth/react";
import CreateTeamModal from "../Modals/CreateTeamModal";

interface TeamSidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

const TeamSidebar: React.FC<TeamSidebarProps> = ({ session }) => {
  const { createTeam, fetchAllTeams } = useTeamStore();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const { data: user_session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      // To Do: set all teams managed by the user
      setFormData((prev) => ({
        ...prev,
        owner: session.user.id.toString(),
      }));
    }
  }, [session]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState<Partial<ITeam>>({
    sportType: "",
    cover_picture: "",
    profilePicture: "",
    owner: session?.user?.id?.toString() || "",
  });

  // Dynamically resolve the teams sidebar configuration
  const config = resolveSidebarConfig("teams", user_session);

  // Handler for successful upload of the profile picture

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting team data:", formData);

    try {
      const createdTeam = await createTeam(formData as ITeam);
      await fetchAllTeams();
      console.log("Successfully created team:", createdTeam);
      setIsCreatingTeam(false);
      setIsModalOpen(false); // Close the modal after team creation

      // Reset form data after successful team creation
      setFormData({});
    } catch (error) {
      console.error("Error creating team:", error);
      setIsCreatingTeam(false);
    }
  };

  // Handle form change for creating team
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="sticky top-[64px] w-96 h-[calc(100vh-64px)] shadow-xl text-black flex flex-col bg-white z-50 overflow-y-auto">
      {/* Sidebar Title */}
      {config.title && (
        <h1 className="px-4 py-2 text-2xl font-bold text-black">
          {config.title}
        </h1>
      )}

      {/* Sidebar Items */}
      <ul className="space-y-2 px-4">
        {config.items!.map((item, index) => (
          <li key={index}>
            <Link
              href={item.path}
              className="flex items-center hover:bg-gray-100 p-2 rounded transition"
            >
              {item.icon && (
                <span className="mr-3 text-2xl text-black">{item.icon}</span>
              )}
              <span className="text-xl text-black">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Create Team Button */}
      <div className="border-t border-gray-300 mt-4 pt-4 px-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-black text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isCreatingTeam ? "Creating..." : "Create Team"}
        </button>
      </div>
      <div className="border-t border-gray-300 mt-4 pt-4 px-4 text-xl">
        Filters
      </div>
      {/* Categories Section */}
      {config.categories && (
        <div className="border-t border-gray-300 mt-4 pt-4 px-4">
          <h2 className="text-xl font-bold text-black mb-2">Categories</h2>
          <ul className="space-y-2">
            {config.categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/teams/category/${category.toLowerCase()}`}
                  className="text-black text-xl hover:underline"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Section */}
      {config.footer?.type === "logout" && (
        <div className="border-t border-gray-300 mt-4 pt-4 px-4">
          <Logout />
        </div>
      )}

      {/* Modal for Create Team */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData} // Pass teamData to modal
        onChange={handleFormChange} // Pass handleFormChange to update teamData
        onSubmit={handleCreateTeam} // Pass handleCreateTeam as form submit handler
      />
    </div>
  );
};

export default TeamSidebar;
