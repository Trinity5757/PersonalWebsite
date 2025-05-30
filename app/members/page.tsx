"use client";
import {  useEffect, useState } from "react";
import MemberCard from "@/app/components/post/MemberCard";
import useUserStore from "@/app/store/useUserStore";
import useRequestStore from "../store/useRequestStore";
import { useSession } from "next-auth/react";
import { RequestType } from "../models/enums/RequestType";
import { IRequest } from "../models/Request";

export default function Members() {
  const { users, setUsers, fetchAllUsers, loading: usersLoading } = useUserStore();

  const { sendRequest,fetchRequestByUserandType, removeRequest} = useRequestStore();
  const session = useSession();
  const currentUser = session.data?.user;
  const [requests, setRequests] = useState<{ [key: string]: IRequest }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await fetchAllUsers(1, 10, "username email avatar_image cover_image settings.privacy");
        setUsers(fetchedUsers); // Update the state with the fetched users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (users.length === 0) {
      fetchData();
    }

    const loadRequests = async () => {
      try {
        if (currentUser?.id) {
          const sentRequests = await fetchRequestByUserandType(currentUser.id.toString(),undefined, "sent", true);
          const requestMap: { [key: string]: IRequest } = {};
          sentRequests.forEach((req) => {
            requestMap[req.requestee.toString()] = req;
          });
          setRequests(requestMap);
        }
      } catch (error) {
        console.error("Error loading requests:", error);
      }
    };

    loadRequests();
  }, [users.length, fetchAllUsers, currentUser, setUsers, fetchRequestByUserandType]);

  if (usersLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <p className="text-black text-lg">No members to display.</p>
      </div>
    );
  }


  const handleAddFriend = async (userId: string) => {
    console.log(`Adding friend with ID: ${userId} of request ${requests[userId]}`);
  try {
    if (requests[userId]?.status === "accepted") {
      // Remove existing request
      await removeRequest(requests[userId]._id.toString());
      setRequests((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } else {
      // Send a new follow request
      const newRequest = await sendRequest(currentUser?.id.toString(), userId, RequestType.FOLLOW, "user", "user");
      if (currentUser?.id) {
        const updatedRequests = await fetchRequestByUserandType(
          currentUser.id.toString(),
          undefined,
          "sent",
          true
        );

        const requestMap: { [key: string]: IRequest } = {};
        updatedRequests.forEach((req) => {
          if (req.requestee && req._id) {
            requestMap[req.requestee.toString()] = req;
          }
        });

        setRequests(requestMap);
      }
    }
  } catch (error) {
      console.warn(`Error sending follow request for user ${userId}:`, error);
  } 
};

  
  const handleRemove = (userId: string) => {
    console.log(`Removed friend with ID: ${userId}`);
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">All Members</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {users.map((user) => (
            <div className="carousel-item flex-shrink-0 w-64" key={user._id}>
              <MemberCard
                user={user}
                onRemove={() => handleRemove(user._id.toString())}
                onAddFriend={() => handleAddFriend(user._id.toString())}
                request={requests[user._id.toString()]}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">Suggested Members</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {users.map((user) => (
            <div className="carousel-item flex-shrink-0 w-64" key={user._id}>
              <MemberCard
                user={user}
                onAddFriend={() => handleAddFriend(user._id.toString())}
                onRemove={() => handleRemove(user._id)}
                request={requests[user._id.toString()]}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">Your Friends</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {users.map((user) => (
            <div className="carousel-item flex-shrink-0 w-64" key={user._id}>
              <MemberCard
                user={user}
                onAddFriend={() => handleAddFriend(user._id.toString())}
                onRemove={() => handleRemove(user._id)}
                request={requests[user._id.toString()]}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}