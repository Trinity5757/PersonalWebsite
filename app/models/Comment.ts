import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Define interface for a Comment document
export interface IComment extends Document {
  _id: ObjectId | string;
  userId: ObjectId;
  postId: ObjectId;
  text: string;
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date; // edits
  childIds: ObjectId[];
  parentId: ObjectId | null;
}

const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    childIds: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // For nested comments
  },
  { timestamps: { createdAt: true, updatedAt: true } } // Add timestamps for easy tracking of when the comment was created
);

commentSchema.index({ post: 1, createdAt: -1 }); // Index to optimize querying posts and comments

// Exporting the model to use it in the app
export const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);