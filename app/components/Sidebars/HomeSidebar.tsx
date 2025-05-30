"use client";

import React from "react";
import Image from "next/image";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

interface Friend {
  names: string;
  username: string;
  image: string;
}

interface HomeSidebarProps {
  friends: Friend[];
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({ friends }) => {
  return (
    <div className="sticky w-64 lg:flex flex-col bg-white dark:bg-[#1c1c1d] text-black dark:text-white shadow-md p-4 overflow-y-auto">
      {/* Suggested Members Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold mb-2">Suggested Members</h3>
          <IoEllipsisHorizontalSharp className="text-[1.5rem] cursor-pointer" />
        </div>
        {friends.map((friend, i) => (
          <div key={i} className="flex items-center mb-2">
            <Image
              src={friend.image}
              alt="friend-image"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-2">
              <p className="text-md font-semibold">{friend.names}</p>
              <p className="text-sm text-gray-500">{friend.username}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Pages */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold  mb-2">Suggested Pages</h3>
          <IoEllipsisHorizontalSharp className="text-[1.5rem] cursor-pointer" />
        </div>
        <div className="flex items-center mb-2">
          <Image
            src="/images/Adds_images/Olympiah.webp"
            alt="page-img"
            width={32}
            height={32}
            className="rounded-full w-10 h-10"
            style={{ objectFit: "cover" }}
          />
          <div className="ml-2">
            <p className="text-md font-semibold ">Olympiah</p>
            <p className="text-sm text-gray-500">@Olympiah</p>
          </div>
        </div>
        <div className="flex items-center mb-3">
          <Image
            src="/images/pages_images/Atari.webp"
            alt="page-img"
            width={32}
            height={32}
            className="rounded-full w-10 h-10"
            style={{ objectFit: "cover" }}
          />
          <div className="ml-2">
            <p className="text-md font-semibold ">Atari</p>
            <p className="text-sm text-gray-500">@Atari_831</p>
          </div>
        </div>
        <div className="flex items-center mb-3">
          <Image
            src="/images/pages_images/Target.webp"
            alt="page-img"
            width={32}
            height={32}
            className="rounded-full w-10 h-10"
            style={{ objectFit: "cover" }}
          />
          <div className="ml-2">
            <p className="text-md font-semibold">Target</p>
            <p className="text-sm text-gray-500">@Target_831</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
