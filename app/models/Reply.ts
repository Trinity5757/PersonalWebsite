import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Handle Replies
export interface IReply extends Document {
  _id: ObjectId | string;
  user: ObjectId; //  user who replied
  text: string; 
  commentId: ObjectId; // Reference to the comment this reply is associated with
  createdAt: Date; 
}

const replySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    text: { type: String, required: true }, 
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: true }, 
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Reply = mongoose.models.Reply || mongoose.model<IReply>("Reply", replySchema);
