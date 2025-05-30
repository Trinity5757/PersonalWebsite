// app/members/requests/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useUserStore from "@/app/store/useUserStore";
import { IRequest } from "@/app/models/Request";
import useRequestStore from "@/app/store/useRequestStore";
import { RequestType } from "@/app/models/enums/RequestType";
import { RequestStatus } from "@/app/models/enums/RequestStatus";

export default function Requests() {
  const { data: session, status } = useSession();
  const [requestsSent, setRequestsSent] = useState<IRequest[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const { fetchRequestByUserandType, removeRequest, fetchRequestById, updateRequest } = useRequestStore();
  const { fetchUser} = useUserStore(); 

  const currentUser = session?.user?.id?.toString();

  // To store user details (like username) of the requestees/requestors
  const [users, setUsers] = useState<{ [key: string]: string }>({});

  // Fetch requests on component mount
  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const sent = await fetchRequestByUserandType(currentUser, undefined, "sent", true);
      const received = await fetchRequestByUserandType(currentUser, "friend", "received");
      setRequestsSent(sent);
      setRequestsReceived(received);
      console.log("requestsReceived", requestsReceived);


      const userIds = new Set<string>();
      sent.forEach(request => userIds.add(request.requestee.toString()));
      received.forEach(request => userIds.add(request.requester.toString()));

      // get users first
      const usersArray = await Promise.all([...userIds].map( id => 
        fetchUser(id)
        .then(user => {
          console.log("user", user.username); // test check for users
          return user;
        })
      ));

      // then map them

      const usersMap: { [key: string]: string } = {};
      usersArray.forEach(user => {
        if (user) usersMap[user._id.toString()] = user.username;
      });

      setUsers(usersMap); // Store the users and their usernames
      console.log("usersMap", usersMap);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRequest = async (requestId: string) => {
    console.log("Removing request with ID:", requestId);
    try {

      setRequestsReceived((prev) => prev.filter((req) => req._id !== requestId));
      setRequestsSent((prev) => prev.filter((req) => req._id !== requestId));

      await removeRequest(requestId);
     // fetchRequests(); // Refresh requests after deletion
    } catch (error) {
      console.error("Error removing request:", error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      setRequestsReceived((prev) =>
        prev.map((req) =>
          req._id === requestId ? Object.assign({}, req, { status: RequestStatus.ACCEPTED }) : req
        )
      );
     

     
       const updatedRequest = await updateRequest(requestId, { requestType: RequestType.FRIEND, status: RequestStatus.ACCEPTED });

       const request = await fetchRequestById(requestId);
       console.log("request", request._id.toString());
      
       console.log("Friend request accepted!" + updatedRequest._id.toString() + "now has a status of " + updatedRequest.status); 
      
      await fetchRequestById(updatedRequest._id.toString());
    } catch (error) {
      console.error("Error accepting request:", error);
      console.log(currentUser);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#1c1c1d] px-4 sm:px-6 lg:px-20">
      <h1 className="text-2xl text-gray-800 dark:text-white font-bold text-center my-6">Manage Friend Requests</h1>

      {/* Sent Requests Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg ">
      <h2 className="rounded-t-lg p-2 text-xl text-gray-800 dark:text-white bg-purple-400 font-semibold">Requests Sent</h2>
      {requestsSent.length === 0 ? (
          <p className="text-gray-500">You have not sent any requests yet.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Recipient</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requestsSent.map((request) => (
                <tr key={request._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{users[request.requestee.toString()] || "N/A"}</td>
                  <td className="px-6 py-4 capitalize">{request.status}</td>

                  <td className="px-6 py-4">
                    <button onClick={() => handleRemoveRequest(request._id.toString())} className="text-red-500 hover:underline">Cancel</button>
                </td>
                </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Received Requests Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
        <h2 className="rounded-t-lg p-2 text-xl text-gray-800 dark:text-white bg-purple-400 font-semibold my-6 ">Requests Received</h2>
        {requestsReceived.length === 0 ? (
          <p className="text-gray-500">You have not received any requests yet.</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Sender</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requestsReceived.map((request) => (
                <tr key={request._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{users[request.requester.toString()] || "N/A"}</td> 
                  <td className="px-6 py-4 capitalize">{request.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id.toString())}
                      className="text-purple-500 hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRemoveRequest(request._id.toString())}
                      className="text-red-500 hover:underline"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
