"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { resolveSidebarConfig } from "app/utility/sidebarConfig";
import Sidebar from "@/app/components/Sidebars/Sidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  // Resolve the sidebar configuration dynamically
  const sidebarConfig = resolveSidebarConfig("dashboard", session);

  const [isSmScreen, setIsSmScreen] = useState(false);

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

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      {isSmScreen && <MobileNavbar />}

      <div className="flex flex-grow pt-[64px]">
        {/* Sidebar */}
        <Sidebar config={sidebarConfig} />

        {/* Main Content */}
        <div className="flex-grow mx-auto w-full p-8 bg-gray-100 dark:bg-[#1c1c1d] text-black dark:text-white ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
