"use client";

import { useState, useEffect } from "react";
import UploadButton from "../Cloudinary/UploadButton";
import usePostStore from "@/app/store/usePostStore";
import { IPost } from "@/app/models/post";
import { CiImageOn } from "react-icons/ci";



type Props = {
  created_by: {
    _id: string;
    username: string;
    avatar_image: string | null;
  };
  isVisible: boolean;
  onClose: () => void;
  post?: IPost;
};

export default function CreatePostModal({ created_by, isVisible, onClose, post }: Props) {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [imageResources, setImageResources] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {createPost, updatePost, fetchAllPosts} = usePostStore();

  const handleUploadSuccess = (fileUrl: string) => {

    setImageResources((prevResources) => [...prevResources, fileUrl]);

  };

  const handleSubmit = async () => {
    if (!caption || !tags || !location) {
      setMessage("Please fill out all fields.");
      setIsSuccess(false);
      return;
    }

    const newPost = {
      created_by: created_by._id,
      caption,
      tags: tags.split(","),
      location,
      media: imageResources,
    };

    console.log(newPost);

    try {
      if (post) {
        // If editing a post, update it
        await updatePost(post._id.toString(), newPost);
        setMessage("Post updated successfully!");
      } else {
        // If creating a post, create it
        await createPost(newPost);
        setMessage("Post created successfully!");
      }

      setCaption("");
      setTags("");
      setLocation("");
      setImageResources([]);
      fetchAllPosts();
      onClose();
    } catch (error) {
      setMessage("Failed to create post.");
      console.error("Error when creating post ", error);
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      setMessage("");
      setIsSuccess(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (post) {
      setCaption(post.caption);
      setTags(post.tags.join(","));
      setLocation(post.location);
      setImageResources(post.media || []);
    }
  }, [post]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-base-100 p-6 rounded-lg shadow-2xl w-full max-w-lg">
        {/* Modal Header */}
        <h3 className="text-2xl font-semibold mb-4 text-white">
         {post ? "Edit Post" : "Create a New Post"}
        </h3>

        {/* Caption Input */}
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Tags Input */}
        <input
          type="text"
          placeholder="Tags (e.g., tag1, tag2)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Location Input */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />



        {/* Image Preview */}
        {imageResources.length > 0 && (
          <div className="mt-4 mb-4">
            {imageResources.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt="Uploaded Preview"
                className="w-full h-48 object-cover rounded-lg shadow-md mb-2"
              />
            
            ))}
          </div>
        )}

        {/* Button Group */}
        <div className="flex justify-between items-center space-x-3 mt-4">
          {/* Upload Button */}
          <div className="flex items-center">
            <UploadButton
              onUploadSuccess={handleUploadSuccess}
              buttonText={
                <span className="flex items-center cursor-pointer">
                  <CiImageOn className="mr-2 text-2xl" />
                  Add Image
                </span>
              }
              folder="posts"
            />
          </div>

          {/* Cancel and Post Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-black font-semibold transition"
            >
             {post ? "Save Changes" : "Post"}
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}