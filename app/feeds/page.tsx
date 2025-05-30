"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import usePostStore from "@/app/store/usePostStore";
import CreatePostModal from "../components/Modals/CreatePostModal";
import PostFeed from "../components/Feeds/PostFeed";
import useCommentStore from "../store/useCommentStore";
import CommentModal from "../components/Modals/CommentModal";
import { IPost } from "../models/post";
import { ILike } from "../models/Like";
import LikeModal from "../components/Modals/LikeModal";

const Feeds = () => {
  const { data: session } = useSession();
  const user_id = session?.user?.id?.toString();

  const { fetchAllPosts, loading, createPost, deletePost } = usePostStore();
  const [postLikes, setPostLikes] = useState<ILike[]>([]);


  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isViewingComment, setIsViewingComment] = useState(false);
  const [isViewingLikes, setIsViewingLikes] = useState(false);
  const [currentPost, setCurrentPost] = useState('');
  const { postComments, fetchPostComments, createComment } = useCommentStore();

  const loadingComments = useCommentStore((state) => state.loadingComments);

  useEffect(() => {
    fetchAllPosts().catch((err) => console.error("Error fetching posts:", err));
  }, [fetchAllPosts]);

  useEffect(() => {
    if (currentPost) {
      fetchPostComments(currentPost).catch((err) => console.error("Error fetching comments for post:", err));
    }

  }, [currentPost, fetchPostComments, createComment]);

  const handleCreatePost = async (newPost: IPost) => {
    try {
      setIsCreatingPost(false);
      await createPost(newPost);
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



  return (
    <div className="flex h-screen ">
      {/* Middle Section */}
      <div className="flex-grow overflow-y-auto p-5">


        {user_id && (
          <CreatePostModal
            isVisible={isCreatingPost}
            onClose={() => setIsCreatingPost(false)}
            onCreatePost={handleCreatePost}
            created_by={user_id}
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

        <PostFeed 
          loading={loading} 
          onViewComment={handleViewComment} 
          onViewLikes={handleViewLikes} 
          layout="single-column" 
          onDelete={handleDeletePost}
        />
      </div>


    </div>
  );
};

export default Feeds;