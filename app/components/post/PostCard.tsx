// app/components/post/PostCard.tsx
// To do: save this terrible design!
import { IPost } from "@/app/models/post";

interface PostCardProps {
    post: IPost;
}

const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString(); // needs to be format as needed
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-sm mx-auto">
            {/* Header */}
            <div className="flex gap-4 items-center">
                <a href="#" className="relative inline-flex h-12 w-12 items-center justify-center rounded-full">
                    <img
                        src={post.created_by?.avatar_image}
                        alt={post.created_by.username}
                        title={post.created_by.username}
                        width="48"
                        height="48"
                        className="rounded-full"
                    />
                </a>
                <div>
                    <h2 className="font-semibold text-lg">{post.created_by.username}</h2>
                    <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
                    <p className="text-xs text-slate-400">{post.location}</p>
                </div>
            </div>

            {/* Main Image */}
            <div className="my-4">
                <img 
                    src={post.media[0] ? post.media[0] : 'https://picsum.photos/200/300'}  // Todo: handle more images ex carousel
                    alt="card image" 
                    className="aspect-square w-full h-64 object-cover rounded-md" 
                />
            </div>

            {/* Post Content */}
            <div className="my-4">
                <p className="text-sm text-slate-600">{post.caption}</p>
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-2">
                        {post.tags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="inline-block text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-1 mr-2 mb-2"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Icons */}
            <div className="flex justify-end gap-4">
                {/*TO DO: Action buttons/icons */}
            </div>
        </div>
    );
}
