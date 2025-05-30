"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logout from "@/app/dashboard/Logout";
import { resolveSidebarConfig } from "@/app/utility/sidebarConfig";
import useTeamStore from "@/app/store/useTeamStore";
import { ITeam } from "@/app/models/Team";
import { useSession } from "next-auth/react";
import BusinessModal from "../Modals/BusinessModal";
import useBusinessStore from "@/app/store/useBuisnessStore";
import { IBusiness } from "@/app/models/Business";

interface PageSidebarProps {
  session: any;
}

const PageSidebar: React.FC<PageSidebarProps> = ({ session }) => {
  const { createBusiness, fetchAllBusinesses } = useBusinessStore();
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);

  const { data: user_session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      // To Do: set all businesses managed by the user
      setFormData((prev) => ({
        ...prev,
        owner: session.user.id.toString(),
      }));
    }
  }, [session]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState<Partial<IBusiness>>({
    businessName: "",
    cover_picture: "",
    profilePicture: "",
    category: "",
    description: "",
    owner: session?.user?.id?.toString() || "",
  });

  // Dynamically resolve the teams sidebar configuration
  const config = resolveSidebarConfig("pages", user_session);

  const handleCoverPictureUpload = (resource: any) => {
    setFormData((prevData) => ({
      ...prevData,
      cover_picture: resource?.secure_url, // Save the URL of the uploaded image
    }));
  };

  // Handler for successful upload of the profile picture

  const handleCreatePage= async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting Page data:', formData);

    try {
      const createdBusiness = await createBusiness(formData as IBusiness);
      await fetchAllBusinesses();
      console.log("Successfully created team:", createdBusiness);
      setIsCreatingBusiness(false);
      setIsModalOpen(false);  // Close the modal after team creation

      // Reset form data after successful team creation
      setFormData({});

    } catch (error) {
      console.error("Error creating team:", error);
      setIsCreatingBusiness(false);
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

      {/* Create Page Button */}
      <div className="border-t border-gray-300 mt-4 pt-4 px-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-black text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isCreatingBusiness ? "Creating..." : "Create Team"}
        </button>
      </div>
      <div className="border-t border-gray-300 mt-4 pt-4 px-4 text-xl">Filters</div>
      {/* Categories Section */}
      {config.categories && (
        <div className="border-t border-gray-300 mt-4 pt-4 px-4">
          <h2 className="text-xl font-bold text-black mb-2">Categories</h2>
          <ul className="space-y-2">
            {config.categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/pages/category/${category.toLowerCase()}`}
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

      {/* Modal for Create Business */}
      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData} // Pass pageData to modal
        onChange={handleFormChange} // Pass handleFormChange to update pageData
        onSubmit={handleCreatePage} // Pass handleCreatePage as form submit handler
      />
    </div>
  );
};

export default PageSidebar;
