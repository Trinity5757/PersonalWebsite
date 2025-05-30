import React from "react";
import Link from "next/link";
import { IBusiness } from "@/app/models/Business";

interface BusinessCardProps {
  business: IBusiness;
 
  onLike: () => void;
  onRemove: () => void;
}

export default function BusinessCard({ business, onLike, onRemove }: BusinessCardProps) {
  return (
    <div className="relative bg-black-200 border-4 border-black rounded-lg shadow-lg overflow-hidden w-80 h-96">
      {/* Background image with link */}
      <Link href={`/pages/${business._id}`}>
        <div
          className="absolute inset-0 cursor-pointer"
          style={{
            backgroundImage: `url(${
              business.pageId?.profilePicture || "/images/pages_images/Olympiah.webp"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-label={`View ${business.businessName}`}
        />
      </Link>

      {/* Overlay for text */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <Link href={`/pages/${business._id}`}>
          <h3 className="text-white font-bold text-xl cursor-pointer">
            {business.businessName}
          </h3>
        </Link>
        <p className="text-gray-300 text-sm mb-2">
          {business.category || "Category not specified"}
        </p>
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