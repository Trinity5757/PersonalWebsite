import { IComment } from "@/app/models/Comment";
import CommentCard from "./CommentCard";
import CommonSpinner from "../Spinners/CommonSpinner";

type Props = {
  loading: boolean;
  comments: IComment[];
  currentUser: string;
};

export default function CommentFeed({ loading, comments, currentUser }: Props) {
  if (loading) {
    return <CommonSpinner />;
  }

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {!comments.length ? (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <h3 className="text-gray-500 text-lg">No Comments</h3>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment._id.toString()} comment={comment} currentUser={currentUser} />
        ))
      )}
    </div>
  );
}