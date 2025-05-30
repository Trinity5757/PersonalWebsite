"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUserStore from "@/app/store/useUserStore";
import { IUser } from "@/app/models/Users";
import EditProfileForm from "../profile/edit/[id]/EditProfileForm";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { users, fetchAllUsers, deleteUser, loading } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (session?.user?.role === "admin" && users.length === 0) {
      fetchAllUsers();
    }
  }, [session, fetchAllUsers]);

  const openEditModal = (user: IUser) => {
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    } else {
      console.error("No user selected");
    }
  };
  

  const handleUserUpdate = async () => {
    try {
      setIsModalOpen(false);  // Close the modal after successful update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const closeModal = async() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (session?.user?.role !== "admin") {
    return <h1 className="text-2xl font-bold">You are not authorized to view this page.</h1>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Page</h1>
      <div className="p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id.toString()}>
                  <td className="py-2 px-4 border-b">{user._id.toString()}</td>
                  <td className="py-2 px-4 border-b">{user.first_name || user.email.split('@')[0]}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => openEditModal(user)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteUser(user._id.toString())} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <button onClick={closeModal} className="text-red-500 float-right">Close</button>
            <EditProfileForm user={selectedUser} onUpdate={handleUserUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}
