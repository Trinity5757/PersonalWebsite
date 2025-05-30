import React, { useState, useEffect } from "react";
import { IPost } from "@/app/models/post";
import LikeButton from "../Buttons/LikeButton";
import { LikeType } from "@/app/models/enums/LikeType";
import useLikeStore from "@/app/store/useLikeStore";
import { ILike } from "@/app/models/Like";
import CommentButton from "../Comment/CommentButton";
import { useSession } from "next-auth/react";
import CreatePostModal from "../Modals/CreatePostModal";

interface CardSocialProps {
  author: string;
  date: string;
  avatar: string;
  image: string;
  caption: string;
  location: string;
  tags: string[];
  post: IPost;
  authorId: string; // post object that contains the `likes` array
  userLikes: string[]; // User's likes array (IDs of liked posts)
  onComment: (viewing: boolean, postId: string) => void;
  onViewLikes: (viewing: boolean, postLikes: ILike[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (updatedData: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (updatedData: any) => void;
  onDelete: (postId: string) => void;
}
export default function CardSocial({
  author,
  date,
  avatar,
  image,
  caption,
  tags,
  location,
  post,
  authorId,
  userLikes,
  onComment,
  onViewLikes,
  onDelete
}: CardSocialProps) {
  const [liked, setLiked] = useState(false);
  const { data: session } = useSession();
  const user_id = session?.user?.id?.toString();

  const [isEditing] = useState(false); // New state for edit mode
  const { fetchObjectLikes } = useLikeStore();
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<ILike[]>([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        setLoading(true);
        setLikes(await fetchObjectLikes(LikeType.POST, post._id.toString()));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching likes for post:", error);
      }
    };

    if (post._id) loadLikes();
  }, [post._id, fetchObjectLikes]);

  useEffect(() => {
    if (user_id && userLikes) {
      const userLiked = userLikes.includes(post._id.toString());
      setLiked(userLiked);
    }
  }, [userLikes, post._id, user_id]);

  const handleLike = (newLikedState: boolean, currentLike: ILike) => {
    setLiked(newLikedState);

    if (newLikedState) {
      setLikes((prev) => [...prev, currentLike]);
    } else {
      setLikes((prev) => prev.filter((like) => like._id !== currentLike._id));
    }
  };

  const handleReport = (postId: string) => {
    // some revelant action - todo add something useful
    alert("Reported post with ID:" + postId);
  };


  const toggleDropdown = () => setDropdownOpen((prev) => !prev);


  const handleEdit = () => {

    // opening CreatePostModal for editing, no need to track editable data
    setSelectedPost(post); // Set the post to be edited
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedPost(null); // Clear selected post
  };
  
  return (
    <div className="card bg-white dark:bg-base-100 border border-gray-200 dark:border-none shadow-md w-full max-w-lg my-6">
      {/* Main Image */}


      <figure>
        <img src={image} alt="card image" className="w-full h-96 object-cover" />
      </figure>

      {/* Header */}
      <div className="card-body p-3">
        <div className="flex gap-4 items-center">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={avatar} alt={author} title={author} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{author}</h3>
            <p className="text-sm text-gray-500 dark:text-white">{date}</p>
            <p className="text-sm text-gray-500 dark:text-white">{location}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-3">
        {/* Editable Caption */}
          <p className="text-base text-gray-700 dark:text-white mb-2">
            {caption}
          </p>
        {/* Divider */}
        <div className="border-t border-gray-200 mt-2"></div>

        {/* Tags and Action Buttons */}
        <div className="flex justify-between items-center mt-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="badge badge-outline text-gray-700 dark:text-white border-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Likes Button */}
            {loading ? (
              <div className="animate-spin border-2 border-blue-600 border-t-transparent rounded-full w-4 h-4"></div>
            ) : (
              <button onClick={() => onViewLikes(true, likes)}>
                {likes.length} likes
              </button>
            )}

            <LikeButton
              associatedId={post._id.toString()}
              type={LikeType.POST}
              liked={liked}
              onLike={handleLike}
            />

            <CommentButton postId={post._id.toString()} onComment={onComment} />

            <button
              className="btn btn-outline btn-sm text-gray-700 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-purple-400 dark:hover:text-black"
              title="Share Post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>

            {/* Three-dot Dropdown Button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="btn btn-outline btn-sm text-gray-700 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-purple-400 dark:hover:text-black"
                title="Options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">

                  {(session?.user?.role === "admin" || session?.user?.id === authorId) && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:bg-base-100 hover:bg-purple-400 dark:hover:bg-purple-400 dark:hover:text-black"                      >
                        Edit
                      </button>


                      <CreatePostModal
                        created_by={post.created_by}
                        isVisible={isModalVisible}
                        onClose={handleModalClose}
                        post={selectedPost}// Pass the post to the modal for editing
                      />

                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:bg-base-100 hover:bg-purple-400 dark:hover:bg-purple-400 dark:hover:text-black"
                        onClick={() => onDelete(post._id.toString())}
                      >
                        Delete
                      </button>
                    </>
                  )}

                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:bg-base-100 hover:bg-purple-400 dark:hover:bg-purple-400 dark:hover:text-black"
                    onClick={() => handleReport(post._id.toString())}
                  >

                    Report
                  </button>

                </div>


              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
