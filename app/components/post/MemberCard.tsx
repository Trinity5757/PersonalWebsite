import React from "react";
import Link from "next/link";
import { IUser } from "@/app/models/Users";
import { IRequest } from "@/app/models/Request";
import { RequestStatus } from "@/app/models/enums/RequestStatus";


interface MemberCardProps {
  user: IUser;
  request?: IRequest;
  onRemove: () => void;
  onAddFriend: () => void;
}

export default function MemberCard({ user, request, onRemove, onAddFriend}: MemberCardProps) {
  const isPrivate = !user.settings?.privacy?.canBeFollowed;
  const isPending = request?.status === RequestStatus.PENDING;
  const isAccepted = request?.status === RequestStatus.ACCEPTED;

 
  console.log( request?.requestee + " " + request?.status);  
  
  return (
    <div className="relative bg-gray-200 border-4 border-black rounded-lg shadow-lg overflow-hidden w-80 h-96 my-4">
      
      <Link href={`/members/${user.username}`}>
        <div
          className="absolute inset-0 cursor-pointer"
          style={{
            backgroundImage: `url(${
              user.avatar_image || "/images/members_images/imageplaceholder.webp"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-label={`View ${user.username}'s profile`}
        />
      </Link>

      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Link href={`/members/${user.username}`}>
          <h3 className="text-white font-bold text-xl cursor-pointer">
            {user.username}
          </h3>
        </Link>
        <div className="flex gap-2 mt-2 justify-between">
          <button
            onClick={onRemove}
            className="px-3 py-1 bg-purple-400 hover:bg-purple-600 text-black font-semibold rounded text-sm"
          >
            Say Hi
          </button>
          <button
            type="button"
            onClick={onAddFriend}
            className={`px-3 py-1 ${
              isPrivate
                ? "bg-red-500 text-white cursor-not-allowed"
                : isPending
                ? "bg-gray-500 text-gray-300"
                : isAccepted
                ? "bg-gray-800 text-purple-400"
                : "bg-purple-400 text-black"
            } font-semibold rounded text-sm`}
            disabled={isPrivate || isPending} 
          >
            {isPrivate
              ? "Private"
              : isPending
              ? "Pending"
              : isAccepted
              ? "Remove"
              : "Add"}
          </button>
          
        </div>
      </div>
    </div>
  );
}