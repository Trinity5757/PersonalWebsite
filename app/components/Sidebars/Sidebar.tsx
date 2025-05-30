"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logout from "app/dashboard/Logout";
import { SidebarConfig } from "app/utility/sidebarConfig";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface SidebarProps {
  config: SidebarConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ config }) => {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);

  useEffect(() => {
    // Function to determine if the screen is large
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
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

  return (
    <>
      {/* Sidebar */}
      {(sidebarOpen || isLgScreen) && (
        <div
          className={`sticky top-[64px] w-64 h-[calc(100vh-64px)] shadow-xl dark:bg-[#1c1c1d] bg-white text-black dark:text-white z-50 overflow-y-auto lg:w-96`}
        >
          {!isLgScreen && (
            <button
              className="p-2 bg-gray-200 rounded-full absolute top-4 right-4"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 " />
            </button>
          )}

          {config.title && (
            <h1 className="px-4 py-2 text-2xl font-bold">{config.title}</h1>
          )}
          {config.items.map((item, index) => (
            <div key={index} className="px-4 py-2">
              <Link
                href={item.path}
                className="flex items-center hover:bg-purple-400 p-2 rounded transition dark:hover:text-black"
              >
                {item.icon && (
                  <span className="mr-3 text-2xl">{item.icon}</span>
                )}
                <span className="text-xl">
                  {item.isDynamic && session
                    ? typeof item.name === "function"
                      ? item.name(session)
                      : item.name
                    : item.name}
                </span>
              </Link>
            </div>
          ))}

          {config.footer?.type === "logout" && (
            <div className="p-4 border-t border-gray-300">
              <Logout />
            </div>
          )}
        </div>
      )}

      {/* Overlay for smaller screens */}
      {sidebarOpen && !isLgScreen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toggle Button */}
      {!isLgScreen && (
        <div className="fixed top-0 left-0 p-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
