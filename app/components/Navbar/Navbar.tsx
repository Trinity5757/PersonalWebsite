"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, MessageCircle, Plus, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { resolveSidebarConfig, SidebarConfig } from "app/utility/sidebarConfig";
import ThemeToggle from "../ThemeToggle";
import CreatePostModal from "../Modals/CreatePostModal";
import CreateTeamModal from "../Modals/CreateTeamModal";
import usePostStore from "@/app/store/usePostStore";
import useUserStore from "@/app/store/useUserStore";
import SearchBar from "../searchbar/MainSearchBar";
import SearchBarWithDropdown from "../searchbar/SearchBarWithDropdown";
import Logout from "@/app/dashboard/Logout";
import useBusinessStore from "@/app/store/useBusinessStore";
import CreateBusinessModal from "../Modals/CreateBusinessModal";
import PageDropdowns from "./PageDropdowns";
import { usePathname } from "next/navigation";



const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const currentPath = usePathname(); // current path
  // Shared state to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<
    "avatar" | "messages" | "notifications" | "create" | "hamburger" | null
  >(null);
  const [isCreatePostModalVisible, setIsCreatePostModalVisible] =
    useState(false);
  const [isCreateTeamModalVisible, setIsCreateTeamModalVisible] =
    useState(false);
  const [isCreateBusinessModalVisible, setIsCreateBusinessModalVisible] = useState(false);
  const [isSmScreen, setIsSmScreen] = useState(false);
  const { searchBusinesses } = useBusinessStore(); 

  useEffect(() => {
    // Function to determine if the screen is large
    const handleResize = () => {
      setIsSmScreen(window.innerWidth < 1024);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resolve configurations for dropdowns
  const config: SidebarConfig = resolveSidebarConfig("dropdown", session);
  const messagesConfig: SidebarConfig = resolveSidebarConfig(
    "messages",
    session
  );
  const notificationsConfig: SidebarConfig = resolveSidebarConfig(
    "notifications",
    session
  );
  const createConfig: SidebarConfig = resolveSidebarConfig("create", session);


  const [query, setQuery] = useState("");
  const { setSearchQuery, searchPosts: originalSearchPosts } = usePostStore();
  
  const searchPosts = async (fields: string[], searchTerm: string): Promise<void> => {
    await originalSearchPosts(fields, searchTerm);
  };

  
  const handleDropdown = (dropdown: "avatar" | "messages" | "notifications" | "create" | "hamburger") => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };


  
// Commented out the original search logic
 /* const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Client-side filtering
    setSearchQuery(value);

    // Server-side filtering (if needed)
    if (value.trim() !== "") {
      try {
        await searchPosts(["caption", "username", "tags"], value);
      } catch (err) {
        console.error("Error in server-side search:", err);
      }
    }
  };*/



  return (
    <nav
      className="bg-white dark:bg-[#1c1c1d] dark:text-white border-b text-black border-gray-200 fixed w-full"
      style={{
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
      }}
    >
      <div className="px-5">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/dashboard">
                <h1 className="font-arial-black text-[36px] font-[800]">
                  OLYMPIAH
                </h1>
              </Link>
            </div>

  {/* Search Bar Section */}
  {/* <div className="relative w-40 sm:w-48 md:w-64 lg:w-72">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
      <Search
        className="h-5 w-5 text-gray-400 dark:text-purple-500"
        aria-hidden="true"
      />
    </div>
    <input
        type="search"
        className="block w-full pl-10 pr-3 py-1 border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-0 dark:focus:border-purple-500 dark:focus:outline-none dark:focus:ring-0 transition-all"
        placeholder="Search"
        onChange={handleSearchChange}
        
      />
  </div> */}
  
{/* Search Bar Section */}
{!isSmScreen && (
  <div className="relative w-40 sm:w-48 md:w-64 lg:w-72">
    <SearchBarWithDropdown
      setSearchQuery={setSearchQuery}
      searchPosts={searchPosts}
      searchBusinesses={searchBusinesses}

    />
  </div>
)}
  </div>
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Create Dropdown */}

            {!isSmScreen && (
              <div className="relative">
                <button
                  className="p-2"
                  onClick={() => handleDropdown("create")}
                >
                  <Plus className="h-6 w-6 text-purple-500" />
                </button>
                {openDropdown === "create" && (
                  <div
                    className="absolute right-0 mt-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
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
            )}

            {!isSmScreen && <ThemeToggle />}
            {/* Messages Dropdown */}
            <div className="relative">
              <button
                className="p-2"
                onClick={() => handleDropdown("messages")}
              >
                <MessageCircle className="h-6 w-6 text-black dark:text-purple-500" />
              </button>
              {openDropdown === "messages" && (
                <div
                  className="absolute right-0 mt-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {messagesConfig.title && (
                    <h1 className="px-4 py-2 text-lg font-bold text-black dark:text-white">
                      {typeof messagesConfig.title === "function"
                        ? messagesConfig.title(session)
                        : messagesConfig.title}
                    </h1>
                  )}
                  <div>
                    {messagesConfig.items.map((item, index) => (
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
            
            {/* Hamburger menu active on Small screen */}
            {isSmScreen && currentPath === "/members" &&( // This is set to members only temporarily
              <div className="relative">
                <button
                  className="p-2"
                  onClick={() => handleDropdown("hamburger")}
                >
                  <Menu className="h-6 w-6 text-purple-500" />
                </button>
                {openDropdown === "hamburger" && (
                <div
                  className="absolute right-0 mt-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <PageDropdowns currentPath={currentPath} />
                </div>
              )}
              </div>
            )}

            {/* Notifications Dropdown */}
            {!isSmScreen && (
              <div className="relative">
                <button
                  className="p-2"
                  onClick={() => handleDropdown("notifications")}
                >
                  <Bell className="h-6 w-6 text-black dark:text-purple-500" />
                </button>
                {openDropdown === "notifications" && (
                  <div
                    className="absolute right-0 mt-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
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
            )}

            {/* Avatar Dropdown */}
            {!isSmScreen && (
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
                    className="absolute right-0 mt-2 bg-white text-black dark:bg-base-100 rounded-box p-4 shadow-lg w-48 z-50 overflow-y-auto max-h-96"
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
        isOpen={isCreateTeamModalVisible}
        onClose={() => setIsCreateTeamModalVisible(false)}
        created_by={{
          _id: session?.user?.id || "",
          username: session?.user?.username || "",
          avatar_image: session?.user?.avatar_image || null,
        }}
        isVisible={isCreateTeamModalVisible}
        onClose={() => setIsCreateTeamModalVisible(false)}
      />
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

export default Navbar;
