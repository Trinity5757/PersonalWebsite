"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, Plus, House, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { resolveSidebarConfig, SidebarConfig } from "app/utility/sidebarConfig";
import CreatePostModal from "../Modals/CreatePostModal";
import CreateTeamModal from "../Modals/CreateTeamModal";
import Logout from "@/app/dashboard/Logout";
import SearchBarWithDropdown from "../searchbar/SearchBarWithDropdown";
import usePostStore from "@/app/store/usePostStore";
import { useRef, useEffect } from "react";
import CreateBusinessModal from "../Modals/CreateBusinessModal";



const MobileNavbar: React.FC = () => {
  const { data: session } = useSession();

  // Shared state to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<
    "avatar" | "messages" | "notifications" | "create" | null
  >(null);
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] =
    useState(false);
  const [isCreateTeamModalVisible, setIsCreateTeamModalVisible] =
    useState(false);
  const [isCreateBusinessModalVisible, setIsCreateBusinessModalVisible] = useState(false);

  // Resolve configurations for dropdowns
  const config: SidebarConfig = resolveSidebarConfig("dropdown", session);
  const notificationsConfig: SidebarConfig = resolveSidebarConfig(
    "notifications",
    session
  );
  const createConfig: SidebarConfig = resolveSidebarConfig("create", session);
  const handleDropdown = (
    dropdown: "avatar" | "messages" | "notifications" | "create"
  ) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const [searchBoxVisible, setSearchBoxVisible] = useState(false);
  const { setSearchQuery, searchPosts: originalSearchPosts } = usePostStore();
  
  const searchPosts = async (fields: string[], searchTerm: string): Promise<void> => {
    await originalSearchPosts(fields, searchTerm);
  };
  const searchBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSearchBoxVisible(false);
      }
    };
  
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    <nav
      className="bg-white dark:bg-[#1c1c1d] dark:text-white border-t text-black border-gray-200 fixed w-full"
      style={{
        boxShadow: "0 -1px 4px rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
        bottom: 0,
      }}
    >
      <div className="px-5">
        <div className="relative flex items-center justify-between h-12">
          {/* Create Dropdown */}
          <div className="relative">
            <Link className="p-2" href={"/home"}>
              <House className="h-6 w-6 text-purple-500" />
            </Link>
          </div>
{/* Search Button */}
<div className="relative">
<button
  className="p-2"
  onClick={() => setSearchBoxVisible(!searchBoxVisible)}  // Toggle search box visibility
>
  <Search className="h-5 w-5 text-black-400 dark:text-purple-500" />
</button>

</div>
{/* Show search box when searchBoxVisible is true */}
{searchBoxVisible && (
  <div
  ref={searchBoxRef}
  className="absolute inset-x-0 bottom-12 bg-transparent p-4 z-20 shadow-lg"
>
  <SearchBarWithDropdown
    setSearchQuery={setSearchQuery}
    searchPosts={searchPosts}
  />
</div>
)}



          <div className="relative">
            <button className="p-2" onClick={() => handleDropdown("create")}>
              <Plus className="h-6 w-6 text-purple-500" />
            </button>
            {openDropdown === "create" && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {createConfig.title && (
                  <h1 className="px-4 py-2 text-lg font-bold text-black dark:text-white">
                    {typeof createConfig.title === "function"
                      ? createConfig.title(session)
                      : createConfig.title}
                  </h1>
                )}
                {createConfig.items.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-purple-400 rounded transition text-black dark:text-white dark:hover:text-base-100 cursor-pointer"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (item.name === "Post") {
                        setIsCreatePostModalVisible(true);
                      } else if (item.name === "Team") {
                        setIsCreateTeamModalVisible(true);
                      } else if (item.name === "Page") {
                        setIsCreateBusinessModalVisible(true);
                      }
                      console.log(`Clicked ${item.name}, Team Modal State:`, isCreateTeamModalVisible);
                    }}
                  >
                    <span className="flex items-center text-black dark:text-white dark:hover:text-base-100">
                      {item.icon && (
                        <span className="mr-2 text-lg">{item.icon}</span>
                      )}
                      <span>{item.name}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              className="p-2"
              onClick={() => handleDropdown("notifications")}
            >
              <Bell className="h-6 w-6 text-black dark:text-purple-500" />
            </button>
            {openDropdown === "notifications" && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {notificationsConfig.title && (
                  <h1 className="px-4 py-2 text-lg font-bold text-black dark:text-white">
                    {typeof notificationsConfig.title === "function"
                      ? notificationsConfig.title(session)
                      : notificationsConfig.title}
                  </h1>
                )}
                <div>
                  {notificationsConfig.items.map((item, index) => (
                    <div key={index} className="px-4 py-2">
                      <Link
                        href={item.path}
                        className="flex items-center hover:bg-purple-400 p-2 rounded transition text-black dark:text-white dark:hover:text-base-100"
                      >
                        {item.icon && (
                          <span className="mr-3 text-lg">{item.icon}</span>
                        )}
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={() => handleDropdown("avatar")}
            >
              <img
                src={session?.user?.avatar_image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
            </button>
            {openDropdown === "avatar" && (
              <div
                className="absolute right-0 bottom-full mb-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {config.title && (
                  <h1 className="px-4 py-2 text-lg font-bold text-black dark:text-white">
                    {typeof config.title === "function"
                      ? config.title(session)
                      : config.title}
                  </h1>
                )}
                <div>
                  {config.items.map((item, index) => (
                    <div key={index} className="px-4 py-2">
                      <Link
                        href={item.path}
                        className="flex items-center hover:bg-purple-400 p-2 rounded transition text-black dark:text-white dark:hover:text-base-100"
                      >
                        {item.icon && (
                          <span className="mr-3 text-lg">{item.icon}</span>
                        )}
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </div>
                  ))}
                  {config.footer?.type === "logout" && (
                    <div className="p-4 border-t border-gray-300">
                      <Logout />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Create Post Modal */}
      <CreatePostModal
        created_by={{
          _id: session?.user?.id || "",
          username: session?.user?.username || "",
          avatar_image: session?.user?.avatar_image || null,
        }}
        isVisible={isCreatePostModalVisible}
        onClose={() => setIsCreatePostModalVisible(false)}
      />
      {/* Create Team Modal */}
      <CreateTeamModal
        isVisible={isCreateTeamModalVisible}
        onClose={() => {
          setIsCreateTeamModalVisible(false);
          console.log('Closing Team Modal');
        }}
        created_by={{
          _id: session?.user?.id || "",
          username: session?.user?.username || "",
          avatar_image: session?.user?.avatar_image || null,
        }}
      />
      {/* Create Business Modal */}
      <CreateBusinessModal
        isOpen={isCreateBusinessModalVisible}
        onClose={() => setIsCreateBusinessModalVisible(false)}
        formData={{}}
        onChange={(name, value) => {
          // Handle form data changes
        }}
        onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission
          setIsCreateBusinessModalVisible(false);
        }}
      />
    </nav>
  );
};

export default MobileNavbar;

