import { useEffect, useState } from "react";
import CardSocial from "@/app/components/post/CardSocial";
import usePostStore from "@/app/store/usePostStore";
import useLikeStore from "@/app/store/useLikeStore";
import { useSession } from "next-auth/react";
import { LikeType } from "@/app/models/enums/LikeType";
import { ILike } from "@/app/models/Like";
import { IPost } from "@/app/models/post";

type Props = {
  loading: boolean;
  onViewComment: (viewing: boolean, postId: string) => void;
  onViewLikes: (viewing: boolean, postLikes: ILike[]) => void;
  layout?: "single-column" | "three-column";
  filteredPosts?: IPost[]; 
  onDelete: (postId: string) => void
};

export default function PostFeed({
  onViewComment,
  onViewLikes,
  layout = "three-column",
  filteredPosts = [],
  onDelete
}: Props) {
  const { posts, fetchAllPosts, deletePost, loading } = usePostStore();
  const { userlikes, fetchUserLikes } = useLikeStore();
  const { data: session } = useSession();

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserLikes(session.user.id, LikeType.POST).catch((err) =>
        console.error("Error fetching user likes:", err)
      );
    }
  }, [session?.user?.id, fetchUserLikes]);

  useEffect(() => {
    if (!posts.length) {
      fetchAllPosts()
        .then(() => {
          setHasFetched(true);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          setHasFetched(true);
        });
    } else {
      setHasFetched(true);
    }
  }, [fetchAllPosts, posts]);


  

 
  const displayedPosts = filteredPosts?.length ? filteredPosts : posts; 

  if (loading) {
    <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
  }
  if (!displayedPosts || displayedPosts.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!hasFetched) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#E8EAED] dark:bg-[#1c1c1d]">
        <div className="loader"></div>
      </div>
    );
  }

  const gridClasses =
    layout === "single-column"
      ? "grid grid-cols-1 gap-4 place-items-center mx-auto w-full max-w-3xl"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";


  return (
    <div className={gridClasses}>
      {displayedPosts.map((post) => {
        const liked = userlikes.some((like) => like.associatedId === post._id);

        return (
          <CardSocial
            key={post._id}
            author={post.created_by?.username}
            date={post.createdAt.toString()}
            avatar={
              post.created_by?.avatar_image ||
              "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kingston"
            }
            image={
              post.media && post.media.length > 0
                ? post.media[0]
                : "https://picsum.photos/id/146/800/600"
            }
            caption={post.caption}
            location={post.location}
            tags={post.tags}
            post={post}
            authorId={post.created_by?._id}
            liked={liked}
            userLikes={userlikes.map((like) => like.associatedId.toString())}
            onComment={onViewComment}
            onViewLikes={onViewLikes}
            onShare={() => console.log(`Shared post with ID: ${post._id}`)}
            onDelete={(postId) => {
              onDelete(postId); // Use the `onDelete` passed as a prop
            }}
           // onEdit={() => console.log(`Edit post with ID: ${post._id}`)}
          />
        );
      })}
    </div>
  );
}