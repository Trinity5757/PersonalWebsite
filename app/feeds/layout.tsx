"use client";

import { ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { resolveSidebarConfig } from "app/utility/sidebarConfig";
import Sidebar from "@/app/components/Sidebars/Sidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

interface LayoutProps {
  children: ReactNode;
}

const FeedsLayout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  // Dynamically resolve the sidebar configuration
  const sidebarConfig = resolveSidebarConfig("feeds", session);

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
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      {isSmScreen && <MobileNavbar />}

      <div className="flex flex-grow pt-[64px]">
        <Sidebar config={sidebarConfig} />

        <div className="flex-grow mx-auto w-full bg-gray-100 dark:bg-[#1c1c1d] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeedsLayout;
