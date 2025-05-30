import { IComment } from "@/app/models/Comment";
import useCommentStore from "@/app/store/useCommentStore";
import { MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  comment: IComment;
  currentUser: string;
};

export default function CommentCard({ comment, currentUser }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<IComment>>({ text: "" });

  const { updateComment, deleteComment } = useCommentStore();
  const { data: session } = useSession();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ text: event.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ text: comment.text });
    setShowOptions(false); // Close dropdown
  };

  const handleDelete = async () => {
    await deleteComment(comment._id.toString());
    setShowOptions(false); // Close dropdown
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateComment(comment._id.toString(), formData);
    setIsEditing(false);
  };

  const handleReport = () => {
    alert(`Reported comment with ID: ${comment._id}`);
    setShowOptions(false); // Close dropdown
  };

  const toggleDropdown = () => setShowOptions((prev) => !prev);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      {/* Comment Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={comment.userId.avatar_image}
            alt={comment.userId.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{comment.userId.username}</h4>
            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="relative">
          {session?.user?.role === "admin" || comment.userId._id.toString() === currentUser ? (
            <button onClick={toggleDropdown}>
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          ) : null}

          {showOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {session?.user?.role === "admin" || comment.userId._id.toString() === currentUser ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReport}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form or Comment Text */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            value={formData.text}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex justify-end space-x-3 mt-3">
            <button type="button" onClick={() => setIsEditing(false)} className="text-red-500">
              Cancel
            </button>
            <button type="submit" className="text-purple-500">
              Save
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-3 text-gray-700">{comment.text}</p>
      )}
    </div>
  );
}