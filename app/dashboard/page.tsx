"use client";

import { useState, useEffect } from "react";
import usePostStore from "@/app/store/usePostStore";
import { useSession } from "next-auth/react";
import PostFeed from "../components/Feeds/PostFeed";
import CreatePostModal from "../components/Modals/CreatePostModal";
import CommentModal from "../components/Modals/CommentModal";
import useCommentStore from "../store/useCommentStore";
import { IPost } from "../models/post";
import LikeModal from "../components/Modals/LikeModal";
import { ILike } from "../models/Like";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  if (role === "admin") {
    console.log("Admin");
  }

  const user_id = session?.user?.id?.toString();
  const { posts, searchResults, localFilteredPosts, fetchAllPosts, loading, deletePost } = usePostStore();

  // Data for comment and like modals
  const { postComments, fetchPostComments, createComment } = useCommentStore();
  const [ postLikes, setPostLikes ] = useState<ILike[]>([]);
  
  // State for modal visibility
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isViewingComment, setIsViewingComment] = useState(false);
  const [isViewingLikes, setIsViewingLikes] = useState(false);
  const [currentPost, setCurrentPost] = useState('');
  const loadingComments = useCommentStore((state) => state.loadingComments);

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchAllPosts().catch((err) => console.error("Error fetching posts:", err));
  }, [fetchAllPosts]);

  useEffect(() => {
    if(currentPost) {
      fetchPostComments(currentPost).catch((err) => console.error("Error fetching comments for post:", err));
    }
      
  }, [currentPost, fetchPostComments, createComment]);

  
  // Handle post creation from the modal
  // Tod habndle the typescript complaints
  const handleCreatePost = async (newPost: IPost) => {
    try {
      await createPost(newPost); // Call the store function to create the post
      setIsCreatingPost(false); // Close the modal upon success
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleViewComment = (viewing: boolean, postId: string) => {
    setCurrentPost(postId);
    setIsViewingComment(viewing);
  }

  const handleViewLikes = (viewing: boolean, postLikes: ILike[]) => {
    setPostLikes(postLikes);
    setIsViewingLikes(viewing);
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId); // Remove the post from the state
      console.log(`Post with ID ${postId} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting post with ID ${postId}:`, error);
    }
  };

  

  const displayedPosts = localFilteredPosts.length > 0 ? localFilteredPosts : posts;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Welcome to the dashboard!</h2>
      <div className="mb-2">
        Status:
        <span className="text-green-500 mx-2 font-semibold">{status}</span>
      </div>
      <p className="mb-2">Here’s a quick overview of your activities:</p>
      <h2 className="text-lg font-bold">{(session?.user?.avatar_image)}</h2>
      <h2 className="text-lg font-bold">{(session?.user?.username)}</h2>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8  ">
        <div className="bg-white dark:bg-base-100 p-4 shadow rounded">
          <h3 className="font-semibold">Total Users</h3>
          <p>120</p>
        </div>
        <div className="bg-white dark:bg-base-100 p-4 shadow rounded">
          <h3 className="font-semibold">Total Posts</h3>
          <p>{posts.length}</p>
        </div>
        <div className="bg-white dark:bg-base-100 p-4 shadow rounded">
          <h3 className="font-semibold">New Messages</h3>
          <p>15</p>
        </div>
      </div>

      {/* Create Post Button */}
    
      <div className="mb-4 px-5">
            {/* Input Section */}
           
                     {/* Create Post Button with Tooltip
               <IconButton tooltip="Create Post" icon={<CiImageOn className="h-10 w-10 rounded-full p-2 bg-[#E8EAED] hover:bg-gray-300" />} onClick={() => setIsCreatingPost(true)} />

         */}
        
      </div>

      {/* Modal for Creating a Post */}
      {user_id && (
        <CreatePostModal
          isVisible={isCreatingPost}
          onClose={() => setIsCreatingPost(false)}
          onCreatePost={handleCreatePost} // Pass store's createPost function
          created_by={user_id} // Pass user ID to use as the post creator
        />
      )}

      {user_id && (
        <CommentModal
          isVisible={isViewingComment}
          onClose={() => setIsViewingComment(false)} // Pass in function that will change viewing comment to false
          comments={postComments}
          loading={loadingComments}
          userId={user_id}
          postId={currentPost}
        />)
      }

      {user_id && (
        <LikeModal
          isVisible={isViewingLikes}
          onClose={() => setIsViewingLikes(false)}
          likes={postLikes}
        />
      )}


      {/* Display Posts */}
      <PostFeed 
        filteredPosts={displayedPosts} 
        loading={loading} 
        onViewComment={handleViewComment} 
        onViewLikes={handleViewLikes}
        onDelete={handleDeletePost}
      />

      {/* Recent Activity Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <ul className="list-disc list-inside">
          <li>User posted a new message.</li>
          <li>User updated their profile.</li>
          <li>User liked your post.</li>
        </ul>
      </div>
    </section>
  );
}
