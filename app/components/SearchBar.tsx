import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilteredPosts: (filtered: any[]) => void;
};

export default function SearchBar({ posts = [], setFilteredPosts }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchTypes] = useState<string[]>(["tags", "caption", "username"]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);

    if (!query) {
      setFilteredPosts(posts);
      return;
    }

    if (Array.isArray(posts)) {
      const filtered = posts.filter((post) =>
        searchTypes.some((type) =>
          post[type]?.toLowerCase().includes(query)
        )
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search posts and explore..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
}