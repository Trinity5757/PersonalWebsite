"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useUserStore from "@/app/store/useUserStore";
import EditProfileModal from "./EditProfileModal";
import { IUser } from "@/app/models/Users";
import UserPost from "../../components/post/UserPost";
import MessageModal from "../../components/Modals/MessageModal";

export default function MemberPage() {
  const { memberUsername } = useParams();

  const { data: session, status } = useSession();
  const [current_user, setCurrentUser] = useState<string | null>(null);
  // const[sender  , setSender] = useState<IUser | null>(null);

  const [userId, setUserId] = useState("");
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { user, error, loading, fetchUserByUsername, updateUser } = useUserStore();

  const [formData, setFormData] = useState<Partial<IUser>>({
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
    gender: "other",
    bio: "",
    avatar_image: "",
    cover_image: "",
  });

  // Fetch user details and session
  useEffect(() => {
    console.log("Session Data =>" + session);
    console.log(session?.user);
    fetchUserByUsername(memberUsername);
    setCurrentUser(session?.user?.id?.toString());
  }, [memberUsername, fetchUserByUsername, session]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        avatar_image: user.avatar_image || "",
        cover_image: user.cover_image || "",
        bio: user.bio || "",
      });
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    setCanEditProfile(current_user === userId);
  }, [current_user, userId]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(userId, formData);
      await fetchUserByUsername(memberUsername);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div className="text-red-500 font-bold">Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#1c1c1d] px-4 sm:px-6 lg:px-20">
      <div className="w-full mx-auto bg-white dark:bg-base-100 shadow-md text-black dark:text-white">
        {/* Cover Photo */}
        <div className="relative h-52 sm:h-64 lg:h-80 px-3 sm:px-5">
          <img
            src={user.cover_image || "/images/membersprofile_images/placeholder.jpg"}
            alt="Cover"
            className="w-full h-full rounded-lg object-cover"
          />

          {/* Profile Image */}
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8 w-24 sm:w-32 lg:w-44 h-24 sm:h-32 lg:h-44 rounded-full border-4 border-white">
            <div className="relative h-full w-full flex justify-center items-center">
              <img
                src={user.avatar_image || "/images/members_images/imageplaceholder.webp"}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />

              {session?.user?.id === user._id && status === "authenticated" ? (
                <div className="absolute bottom-0 right-0 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-green-500 rounded-full border-2 border-white" />
              ) : <div className="absolute bottom-0 right-0 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-red-500 rounded-full border-2 border-white" />
              }
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 lg:px-8 pt-16 pb-6 lg:pt-10 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left sm:ml-24 lg:ml-60">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-500">{user.bio}</p>
            <p className="text-gray-500">  {user.followers && user.followers.length ? user.followers.length : 0} Followers · {user.following && user.following.length ? user.following.length : 0} Following</p>
          </div>

          {/* Buttons */}
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {canEditProfile ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-400 text-black rounded-md hover:bg-purple-600"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button className="px-4 py-2 bg-purple-400 text-base-100 rounded-md hover:bg-purple-600">
                  Add Friend
                </button>
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  className="px-4 py-2 bg-purple-400 text-base-100 rounded-md hover:bg-purple-600"
                >
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="flex flex-col mx-auto mt-10 w-full px-4">
        {!user.posts || user.posts.length === 0 ? (
          <div className="w-full p-3 mt-4 bg-white text-center rounded-lg shadow-md">
            <p className="text-md sm:text-lg font-semibold text-gray-600">No Posts Yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 mx-auto max-w-full px-4">
            {user.posts.map((postId) => (
              <UserPost key={postId} post={postId} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* Message Modal */}
      {session?.user?.id && (
        <MessageModal
          sender={session?.user.id?.toString()}
          participant={user as IUser}
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
        />
      )}
    </div>
  );
}