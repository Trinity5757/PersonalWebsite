import React, { useState } from 'react';
import usePostStore from '@/app/store/usePostStore';

const SearchBar = () => {
  const { searchPosts, setSearchQuery, searchQuery, localFilteredPosts, loading } = usePostStore();
  const [input, setInput] = useState(searchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setSearchQuery(value);
    searchPosts('caption', value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search posts..."
        className="w-full p-2 border rounded"
      />
      {loading && <p className="text-sm">Searching...</p>}
      {localFilteredPosts.length > 0 && (
        <div className="absolute bg-white border rounded w-full mt-2 max-h-60 overflow-y-auto">
          {localFilteredPosts.map((post) => (
            <div key={post._id} className="p-2 hover:bg-gray-100">
              <p>{post.caption}</p>
              <span className="text-xs text-gray-500">@{post.created_by.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
