"use client";
import React, { useEffect } from "react";
import { FaPen } from "react-icons/fa6";
import { FaEllipsisH } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
// import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import useBusinessStore  from "@/app/store/useBusinessStore";
export default function Page({ }: { params: { pagesID: string } }) {
  const { pagesID } = useParams();

  console.log("company ID", pagesID);
  // TODO: verify user
  // const { data: session } = useSession();
  // const current_user = session?.user?.id?.toString();

  const { business, loading, fetchBusiness } = useBusinessStore();
  
  useEffect(() => {
    if (!pagesID) return;

    fetchBusiness(pagesID.toString()); // Fetch business data on page load
  }, [pagesID, fetchBusiness]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <div className="min-h-screen w-full bg-white  dark:bg-[#1c1c1d] px-4 sm:px-6 lg:px-20">
      <div className="w-full mx-auto bg-white dark:bg-base-100 shadow-md">
        <div className="relative h-52 sm:h-64 lg:h-80 px-3 sm:px-5">
          <img
            src={
              business.pageId?.cover_picture
                ? business.pageId?.cover_picture
                : "/images/membersprofile_images/placeholder.jpg"
            }
            alt="Cover"
            className="w-full h-full rounded-lg object-cover"
          />

          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8 w-24 sm:w-32 lg:w-44 h-24 sm:h-32 lg:h-44 rounded-full border-4 border-white">
            <div className="relative h-full w-full flex justify-center items-center">
              <img
                src={
                  business.pageId?.profilePicture
                    ? business.pageId?.profilePicture
                    : "/images/members_images/imageplaceholder.webp"
                }
                alt="Profile"
                className="rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pt-16 pb-6 lg:pt-10 flex flex-col sm:flex-row justify-between items-center ">
          <div className="text-center sm:text-left sm:ml-24 lg:ml-60">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              {business.businessName}
            </h1>
            <p className="text-gray-500">
              {business.pageId?.followers
                ? business.pageId?.followers.length
                : "0"}{" "}
              Followers ·{" "}
              {business.pageId?.following
                ? business.pageId?.following.length
                : "0"}{" "}
              Following
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-2 sm:space-x-3 lg:space-x-4">
            <button className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-blue-700">
              <FaPen className="mr-1 sm:mr-2" /> Edit
            </button>
            <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-md shadow-md hover:bg-gray-200">
              <FaEllipsisH />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-auto mt-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="w-full p-3 bg-white dark:bg-base-100 rounded-lg shadow-md flex items-center space-x-2">
          <div>
            <CiImageOn className="h-8 sm:h-10 w-8 sm:w-10 rounded-full p-2 bg-[#E8EAED] dark:bg-base-100" />
          </div>
          <input
            type="text"
            placeholder="Feel like sharing soomething?"
            className="w-full p-2 text-gray-600 placeholder-gray-500 outline-none rounded-full bg-[#E8EAED] "
          />
        </div>

        <div className="w-full p-3 mt-4 bg-white dark:bg-base-100 text-center rounded-lg shadow-md">
          <p className="text-md sm:text-lg font-semibold text-gray-600">
            No Posts
          </p>
        </div>
      </div>
    </div>
  );
}
