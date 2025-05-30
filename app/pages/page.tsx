"use client";

import React, { useEffect } from "react";
import useBusinessStore from "../store/useBusinessStore";
import BusinessCard from "@/app/components/post/BusinessCard";

export default function Pages() {
  const { 
    businesses, 
    searchResults, 
    localFilteredBusinesses,
    searchQuery,
    loading, 
    fetchAllBusinesses 
  } = useBusinessStore();
  const displayedBusinesses = searchResults.length > 0 ? searchResults : businesses; 
  
  useEffect(() => {
    if (businesses.length === 0) {
      fetchAllBusinesses(); // Fetch all businesses
    }
  }, [businesses.length, fetchAllBusinesses]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <p className="text-black text-lg">No Pages to display.</p>
      </div>
    );
  }

  const handleLike = (businessId: string) => {
    console.log(`Liked business with ID: ${businessId}`);
  };

  const handleRemove = (businessId: string) => {
    console.log(`Removed business with ID: ${businessId}`);
  };

  return (
    <>
      {/* Your Favorite Businesses */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">
          Search Result
        </h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {displayedBusinesses.map((business) => (
            <div
              className="carousel-item flex-shrink-0 w-64"
              key={business._id}
            >
              <BusinessCard
                business={business}
                onLike={() => handleLike(business._id)}
                onRemove={() => handleRemove(business._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* All Businesses */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">
          All Pages
        </h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {businesses.map((business) => (
            <div
              className="carousel-item flex-shrink-0 w-64"
              key={business._id}
            >
              <BusinessCard
                business={business}
                onLike={() => handleLike(business._id)}
                onRemove={() => handleRemove(business._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Businesses */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">
          Suggested Pages
        </h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {businesses.map((business) => (
            <div
              className="carousel-item flex-shrink-0 w-64"
              key={business._id}
            >
              <BusinessCard
                business={business}
                onLike={() => handleLike(business._id)}
                onRemove={() => handleRemove(business._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
