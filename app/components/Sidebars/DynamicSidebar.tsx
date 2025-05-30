"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Logout from '@/app/dashboard/Logout';
import { resolveSidebarConfig, SidebarConfig } from '@/app/utility/sidebarConfig';
import CreateTeamModal from '../Modals/CreateTeamModal';
import CreateBusinessModal from '../Modals/CreateBusinessModal';
import useTeamStore from '@/app/store/useTeamStore';
import useBusinessStore from '@/app/store/useBusinessStore';
import { ITeam } from '@/app/models/Team';
import { ISport } from '@/app/models/Sport';
import BusinessModal from '../Modals/BusinessModal';
import { IBusiness } from '@/app/models/Business';
import CreateSportModal from '../Modals/CreateSportModal';

interface DynamicSidebarProps {
  type: 'teams' | 'pages' | 'fundraisers' | 'sports';
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ type }) => {
  const { data: session } = useSession();
  const config: SidebarConfig = resolveSidebarConfig(type, session);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSmScreen, setIsSmScreen] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to determine if the screen is large
    const handleResize = () => {
      setIsSmScreen(window.innerWidth < 1024);
      setIsLgScreen(window.innerWidth >= 1200);
      setIsMobile(window.innerWidth < 768);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatically close the sidebar on large screens
  useEffect(() => {
    if (isLgScreen) {
      setSidebarOpen(false);
    }
  }, [isLgScreen]);
  const { createTeam, fetchAllTeams } = useTeamStore();
  const { createBusiness, fetchAllBusinesses } = useBusinessStore();

  const [teamFormData, setTeamFormData] = useState<Partial<ITeam>>({
    sportType: "",
    cover_picture: "",
    profilePicture: "",
    owner: session?.user?.id?.toString() || "",
  });

  const [businessFormData, setBusinessFormData] = useState<Partial<IBusiness>>({
    businessName: "",
    contactEmail: "",
    category: "",
    phone: "",
    website: "",
    address: "",
    tags: [],
    members: []
  });

  const [sportFormData, setSportFormData] = useState<Partial<ISport>>({
    sportName: '',
    description: '',
    icon: '',
    createdBy: session?.user?.id as any,
  });

  useEffect(() => {
    if (session?.user?.id) {
      setTeamFormData((prev) => ({
        ...prev,
        owner: session.user?.id?.toString(),
      }));
    }
  }, [session]);

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessFormChange = (name: string, value: string | string[]) => {
    //console.log(`Updating ${name} with value:`, value);
    setBusinessFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSportFormData((prev) => ({ ...prev, [name]: value }));
  };


  // Handle team creation
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      if (type === "teams") {
        await createTeam(teamFormData as ITeam);
        await fetchAllTeams();
        setTeamFormData({
          sportType: "",
          cover_picture: "",
          profilePicture: "",
          owner: session?.user?.id?.toString() || "",
        });
      } else if (type === "pages" && session?.user?.id) {
        if (!businessFormData.businessName || !businessFormData.contactEmail) {
          throw new Error("Business name and contact email are required");
        }

        const businessData = {
          ...businessFormData,
          owner: session.user.id,
          category: businessFormData.category || "",
          members: businessFormData.members || [],
          tags: businessFormData.tags || [],
        };
        //console.log("Submitting business data:", businessData);

        await createBusiness(businessData);
        await fetchAllBusinesses();

        setBusinessFormData({
          businessName: "",
          contactEmail: "",
          category: "",
          phone: "",
          website: "",
          address: "",
          tags: [],
          members: []
        });
      } else if (type === 'sports' && session?.user?.id) {
        const sportData = {
          ...sportFormData,
          createdBy: session.user.id,
        };
        
        // You'll need to implement these functions in your store
        // await createSport(sportData);
        // await fetchAllSports();
        
        setSportFormData({
          sportName: '',
          description: '',
          icon: '',
          createdBy: session?.user?.id as any,
        });
      }

      setIsCreating(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      setIsCreating(false);
    }
  };

  // Dynamic "Create" button labels and paths
  const createLabels = {
    teams: 'Create Team',
    pages: 'Create Page',
    fundraisers: 'Create Fundraiser',
    sports: 'Create Sport',
  };

  const createModals = {
    teams: (
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={teamFormData}
        onChange={handleTeamFormChange}
        onSubmit={handleCreate}
      />
    ),
    
    pages: (
      <CreateBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={businessFormData}
        onChange={handleBusinessFormChange}
        onSubmit={handleCreate}
      />
    ),

    fundraisers: null,

    sports: (
      <CreateSportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={sportFormData}
        onChange={handleSportFormChange}
        onSubmit={handleCreate}
      />
    ),

  };

  return (
    <>
      {!isSmScreen && (
        <div className="sticky top-[64px] w-64 h-[calc(100vh-64px)] shadow-xl dark:bg-[#1c1c1d] bg-white text-black dark:text-white  flex flex-col  z-50 overflow-y-auto">
          {/* Sidebar Title */}
          {config.title && (
            <h1 className="px-4 py-2 text-2xl font-bold">{config.title}</h1>
          )}

          {/* Sidebar Items */}
          <ul className="space-y-2 px-4">
            {config.items?.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className="flex items-center hover:bg-purple-400 hover:text-black p-2 rounded transition"
                >
                  {item.icon && (
                    <span className="mr-3 text-2xl">{item.icon}</span>
                  )}
                  <span className="text-xl">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Create Button */}
          <div className="border-t border-gray-300 mt-4 pt-4 px-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-purple-400 hover:text-black font-bold transition"
            >
              {isCreating ? "Creating..." : createLabels[type]}
            </button>
          </div>

          {/* Categories Section */}
          {config.categories && (
            <div className="border-t border-gray-300 mt-4 pt-4 px-4">
              <h2 className="text-xl font-bold mb-2">Categories</h2>
              <ul className="space-y-2">
                {config.categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      href={`/${type}/category/${category.toLowerCase()}`}
                      className="text-xl hover:underline"
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

          {/* Create Modal */}
          {createModals[type]}
        </div>
      )}
    </>
  );
};

export default DynamicSidebar;
