import { LikeType } from "@/app/models/enums/LikeType";
import { ILike } from "@/app/models/Like";
import useLikeStore from "@/app/store/useLikeStore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface LikeButtonProps {
  associatedId: string;
  type: LikeType;
  liked: boolean; // Accept liked state as a prop
  onLike: (likedState: boolean, like: ILike) => void; // Callback to update the like state
}

export default function LikeButton({ associatedId, type, liked, onLike}: LikeButtonProps) {
  const { data: session } = useSession();
  const user_id = session?.user?.id?.toString();
  const { fetchLike, createLike, deleteLike } = useLikeStore();
  
  const [loading, setLoading] = useState(false);

  // Fetch if the user has already liked the post when the component mounts
  useEffect(() => {
    if (user_id && associatedId && type) {
      fetchLike(user_id, type, associatedId);
    }
  }, [associatedId, type, user_id, fetchLike]);

  // Handle like toggling
  const handleLike = async (associatedId: string, type: LikeType) => {
    if (loading) return; // Prevent further clicks while loading
    setLoading(true);

    try {
      if (!user_id) {
        alert("You must be logged in to like a post.");
        return;
      }
      if (liked) {
        const deletedLike = await deleteLike(user_id, type, associatedId);
        onLike(false, deletedLike);
      } else {
        const newLike = await createLike(user_id, type, associatedId);
        onLike(true, newLike); // Update the like state to true
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => handleLike(associatedId, type)}
      disabled={loading} // Disable the button while processing
      className="inline-flex h-8 w-8 items-center justify-center text-emerald-500  hover:text-emerald-600 rounded transition duration-300 focus:text-emerald-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill={liked ? 'currentColor' : 'none'} // Fill heart if liked
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <title>Like Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
