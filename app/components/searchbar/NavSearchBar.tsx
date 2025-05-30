import React, { useState, useEffect } from "react";

type NavSearchBarProps = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  posts: any[];
  searchPosts: (searchTypes: string[], query: string) => Promise<void>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  searchResults: any[];
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  setFilteredPosts: (filtered: any[]) => void;
};

const NavSearchBar: React.FC<NavSearchBarProps> = ({
  posts,
  searchPosts,
  searchResults,
  setFilteredPosts,
}) => {
  const [query, setQuery] = useState("");
  const [searchTypes] = useState<string[]>(["tags", "caption", "username"]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);

    if (!query) {
      setFilteredPosts(posts); // Reset to all posts when query is cleared
      return;
    }

    await searchPosts(searchTypes, query);
    setFilteredPosts(searchResults); // Update filtered posts with search results
  };

  useEffect(() => {
    if (!query) {
      setFilteredPosts(posts); // Ensure filtered posts are reset when component mounts or query clears
    }
  }, [posts, query, setFilteredPosts]);

  return (
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search posts and explore..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
};

export default NavSearchBar;