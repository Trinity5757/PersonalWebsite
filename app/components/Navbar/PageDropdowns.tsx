"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { resolveSidebarConfig, SidebarConfig } from "app/utility/sidebarConfig";

interface PageDropdownsProps {
  currentPath: string;
}

const PageDropdowns: React.FC<PageDropdownsProps> = ({ currentPath }) => {
  const { data: session } = useSession();

  let config: SidebarConfig | null = null;

  const [openDropdown, setOpenDropdown] = useState<
    "avatar" | "messages" | "notifications" | "create" | "hamburger" | null
  >(null);

  switch (currentPath) {
    case "/members":
      // This will use the members config from sidebarConfig.tsx
      config = resolveSidebarConfig("members", session);
      break;
    // Can add additional cases here for other pages in the future.
    default:
      return <div className="px-4 py-2">Default Dropdown Content</div>;
  }

  return (
    <div>
      {config.title && (
        <h1 className="px-4 py-2 text-lg font-bold text-black dark:text-white">
          {config.title}
        </h1>
      )}
      <div>
        {config.items?.map((item, index) => (
          <div key={index} className="px-4 py-2">
            <Link
              href={item.path}
              onClick={() => setOpenDropdown(null)}
              className="flex items-center hover:bg-purple-400 p-2 rounded transition text-black dark:text-white dark:hover:text-base-100"
            >
              {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
              <span className="text-base">{item.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageDropdowns;
