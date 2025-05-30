"use client";

import { IComment } from "@/app/models/Comment";
import useCommentStore from "@/app/store/useCommentStore";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import CommentFeed from "app/components/Comment/CommentFeed";

type Props = {
  userId: string;
  postId: string;
  comments: IComment[];
  loading: boolean;
  isVisible: boolean;
  onClose: () => void;
};

export default function CommentModal({ userId, postId, comments, loading, isVisible, onClose }: Props) {
  const { data: session } = useSession();
  const [commentCaption, setCommentCaption] = useState("");

  const createComment = useCommentStore((state) => state.createComment);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentCaption(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newComment = {
        userId,
        postId,
        text: commentCaption,
      };
      await createComment(newComment);
      setCommentCaption(""); // Clear the input after submit
    } catch (error) {
      console.log("Error creating comment", error);
    }
  };

  if (!isVisible) return null;

  // Filter comments by postId, then pass to comment feed
  const filteredComments = comments.filter((comment) => comment.postId === postId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-lg resize overflow-auto"
        style={{ minHeight: "300px", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Comments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input Section */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 mb-6">
          <input
            type="text"
            name="comment"
            placeholder="Write a comment..."
            onChange={handleInputChange}
            value={commentCaption}
            className="w-full p-3 text-gray-800 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 text-black hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-500 text-base-100 hover:bg-purple-600"
            >
              Post
            </button>
          </div>
        </form>

        {/* Comment Feed */}
        <CommentFeed
          comments={filteredComments}
          currentUser={session?.user?.id?.toString() || ""}
          loading={loading}
        />
      </div>
    </div>
  );
}