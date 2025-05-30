// app/dashboard/layout.tsx
'use client'
import { useState, useEffect } from "react";
import Sidebar from "../dashboard/sidebar";
import Navbar from "../components/Navbar/Navbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
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
    <div className="flex h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {isSmScreen && <MobileNavbar />}

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 flex-none md:flex md:flex-col pt-16">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col bg-gray-100">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-xl font-semibold">Dashboard Title</h1>
        </header>
        <main className="flex-grow p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
