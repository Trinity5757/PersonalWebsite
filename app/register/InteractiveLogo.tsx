"use client";

import { useState, useEffect } from "react";
import OlymipahLogo from "../ui/OlympiahLogo";

export default function InteractiveLogo() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full cursor-pointer"
      onClick={toggleTheme} // Toggle theme when the logo is clicked
    >
      <OlymipahLogo className="h-10 w-10 md:h-12 md:w-12 text-purple-500" />
    </div>
  );
}