// app/components/Feeds/UserFeed.tsx
"use client";
import { useEffect } from "react";
import UserCard from "@/app/components/post/UserCard"; // Ensure this is the correct path
import useUserStore from "@/app/store/useUserStore";

export default function UserFeed() {
  const { users, fetchAllUsers, loading } = useUserStore();

  useEffect(() => {
    if (!users.length) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, users.length]);

  if (loading) {
    return <p>Loading users...</p>; 
  }

  if (!users || users.length === 0) {
    return <p>No users to display.</p>; 
  }

  const handleLike = (userId: string) => {
    alert(`Liked post with ID: ${userId}`);
  };

  const handleShare = (userId: string) => {
    console.log(`Shared post with ID: ${userId}`);
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-start-3 col-span-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onLike={() => handleLike(user._id)}
            onShare={() => handleShare(user._id)}
          />
        ))}
      </div>
    </div>
  );
}
