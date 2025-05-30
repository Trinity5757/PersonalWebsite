import { useEffect, useState } from "react";
import usePostStore from "@/app/store/usePostStore";
import { IPost } from "@/app/models/post";

interface UserPostProps {
  post: string; // ObjectId as a string
}

export default function UserPost({ post: postId }: UserPostProps) {
  const { fetchPost } = usePostStore();
  const [postData, setPostData] = useState<IPost | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchPost(postId);
        setPostData(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (postId) loadPost();
  }, [postId, fetchPost]);

  if (!postData) {
    return <div className="text-gray-500">Loading post...</div>;
  }

  const hasImage = postData.media && postData.media.length > 0 && postData.media[0];

  return (
    <>
      {/* Main Card */}
      <div className="relative bg-gray-200 border-2 border-black rounded-lg shadow-md overflow-hidden w-64 h-72">
        {hasImage ? (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setLightboxOpen(true)} // Open lightbox
            style={{
              backgroundImage: `url(${postData.media[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={`View post by ${postData.created_by?.username || "Anonymous"}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="text-white font-semibold text-sm truncate">
            {postData.caption || "No caption"}
          </h3>

        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)} // Close lightbox when clicking outside
        >
          <div className="relative">
            <img
              src={postData.media[0]}
              alt="Full-sized post image"
              className="max-w-full max-h-screen object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}