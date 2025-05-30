"use client";

import React, { useEffect, useState } from "react";
import useTeamStore from "../store/useTeamStore";
import TeamCard from "@/app/components/post/TeamCard";

export default function Teams() {
  const { teams, loading, fetchAllTeams } = useTeamStore();

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!loading && teams.length === 0 && !hasFetched) {
      fetchAllTeams();
      setHasFetched(true);
    }
  }, [teams.length, fetchAllTeams, loading, hasFetched]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <p className="text-black text-lg">No teams to display.</p>
      </div>
    );
  }

  const handleLike = (teamId: string) => {
    console.log(`Liked team with ID: ${teamId}`);
  };

  const handleRemove = (teamId: string) => {
    console.log(`Removed team with ID: ${teamId}`);
  };

  return (

    <>
      {/* All Teams */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">All Teams</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
         {teams.map((team) => (
            <div className="carousel-item flex-shrink-0 w-64" key={team._id}>
              <TeamCard
                team={team}
                onLike={() => handleLike(team._id)}
                onRemove={() => handleRemove(team._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Teams */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">Suggested Teams</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {teams.map((team) => (
            <div className="carousel-item flex-shrink-0 w-64" key={team._id}>
              <TeamCard
                team={team}
                onLike={() => handleLike(team._id)}
                onRemove={() => handleRemove(team._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Your Favorite Teams */}
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">Your Favorite Teams</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {teams.map((team) => (
            <div className="carousel-item flex-shrink-0 w-64" key={team._id}>
              <TeamCard
                team={team}
                onLike={() => handleLike(team._id)}
                onRemove={() => handleRemove(team._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}