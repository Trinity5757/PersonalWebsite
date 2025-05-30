"use client";

import { ReactNode } from "react";
import React, { useState, useEffect } from "react";
// import { useSession } from 'next-auth/react';
import DynamicSidebar from "../components/Sidebars/DynamicSidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

interface LayoutProps {
  children: ReactNode;
}

export default function TeamsLayout({ children }: LayoutProps) {
  // TODO: Authenticate session
  // const { data: session } = useSession();
  const [isLgScreen, setIsLgScreen] = useState(false);
  const [isSmScreen, setIsSmScreen] = useState(false);

  useEffect(() => {
    // Function to determine if the screen is large
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1200);
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
    <div className="flex flex-col h-full bg-gray-100 dark:bg-[#1c1c1d]">
      {/* Navbar */}
      <Navbar />
      {isSmScreen && <MobileNavbar />}

      <div className="flex flex-grow pt-[64px]">
        {/* Team Sidebar */}
        <DynamicSidebar type="teams" />

        {/* Main Content */}
        <div className={`flex-grow mx-auto w-full overflow-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
}
