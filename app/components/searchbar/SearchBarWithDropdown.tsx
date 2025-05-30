"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

type SearchType = "All" | "posts" | "feeds" | "members" | "pages" | "teams" | "fundraisers" | "sports" | "events";

interface SearchBarWithDropdownProps {
  setSearchQuery: (query: string) => void;
  searchPosts: (fields: string[], searchTerm: string) => Promise<void>;
  searchBusinesses: (fields: string[], searchTerm: string) => Promise<void>;
}

const SearchBarWithDropdown: React.FC<SearchBarWithDropdownProps> = ({ setSearchQuery, searchPosts, searchBusinesses }) => {
  const [selectedType, setSelectedType] = useState<SearchType>("All");
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchTypes: SearchType[] = ['All', 'posts', 'feeds', 'members', 'pages', 'teams', 'fundraisers', 'sports', 'events'];

  const handleSearch = async () => {
    console.log(`Searching for '${query}' in '${selectedType}'`);

    if (query.trim() === "") return;  // Do not execute on empty query

    try {
      console.log(`Searching for '${query}' in '${selectedType}'`);

      // Dynamically call search based on search type
      if (selectedType === "All") {
        await searchPosts(["caption", "username", "tags"], query); // Search all fields
      } else if (selectedType === "pages") {
        await searchBusinesses(["businessName", "category", "tags"], query);
      }
      else {
        await searchPosts([selectedType.toLowerCase()], query);  // Search selected field
      }
    } catch (error) {
      console.error("Search error:", error);
      // Add error handling logic here
    }
  };

  return (
    <div className="flex w-full max-w-lg border border-gray-300 dark:border-gray-700 rounded-full shadow-sm focus-within:border-purple-500 focus-within:ring-purple-500">
      {/* Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-l-full focus:outline-none"
        >
          {selectedType}
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-lg z-10">
            {searchTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setDropdownOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 rounded-md hover:bg-purple-400 transition dark:hover:text-black transition-all"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchQuery(e.target.value); // Call the passed setSearchQuery function
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search..."
          className="block w-full pl-10 pr-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 rounded-r-full focus:outline-none"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-5 w-5 text-gray-400 dark:text-purple-500" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default SearchBarWithDropdown;