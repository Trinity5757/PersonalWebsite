import React from "react";
import Link from "next/link";
import { ITeam } from "@/app/models/Team";

interface TeamCardProps {
  team: ITeam;
  onLike: () => void;
  onRemove: () => void;
}

export default function TeamCard({ team, onLike, onRemove }: TeamCardProps) {
  return (

    <div className="relative bg-black-200 border-4 border-black rounded-lg shadow-lg overflow-hidden w-80 h-96">
      <Link href={`/teams/${team._id}`}>

        <div
          key={team.pageId?.profilePicture || "default"}
          className="absolute inset-0 p-4 cursor-pointer"
          style={{
            backgroundImage: `url(${team.pageId?.profilePicture || "/images/pages_images/Olympiah.webp"})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-label={`View ${team.name}`}
        />
      </Link>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Link href={`/teams/${team.name}`}>
          <h3 className="text-white font-bold text-xl cursor-pointer">
            {team.name}
          </h3>
        </Link>
        <p className="text-gray-300 text-sm mb-2">{team.sportType || "No description available"}</p>
        <div className="flex gap-2 mt-2 justify-between">
          <button
            onClick={onLike}
            className="px-3 py-1 bg-purple-400 hover:bg-purple-600 text-black font-semibold rounded text-sm"
          >
            Explore
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-600 text-purple-400 font-semibold rounded text-sm"
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}