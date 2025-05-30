import { IUser } from "@/app/models/Users";
import React from "react";

interface UserCardProps {
  user: IUser;  
  onLike?: () => void;
  onShare?: () => void;
}

export default function UserCard({ user, onLike, onShare }: UserCardProps) {
  return (
    <div className="overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 w-60 my-4">
      {/* Header */}
      <div className="p-4">
        <header className="flex gap-2 items-center">
          <a
            href="#"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
          >
            <img
              src={user.avatar_image || "/default-avatar.jpg"} // Use a default image if no profile picture
              alt={user.username}
              title={user.username}
              width="40"
              height="40"
              className="max-w-full rounded-full"
            />
          </a>
          <div>
            <h3 className="text-sm font-medium text-slate-700 truncate">
              {user.username}
            </h3>
            <p className="text-xs text-slate-400">{user.bio? user.bio: "This is where my bio would be"}</p>
          </div>
        </header>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-slate-600 truncate">{user.bio}</p>
      </div>

      {/* Action Icon Buttons */}
      <div className="flex justify-end gap-2 p-2 pt-0">
        <button
          onClick={onLike}
          className="inline-flex h-8 w-8 items-center justify-center text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 rounded transition duration-300 focus:bg-emerald-200 focus:text-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <button
          onClick={onShare}
          className="inline-flex h-8 w-8 items-center justify-center text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 rounded transition duration-300 focus:bg-emerald-200 focus:text-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
