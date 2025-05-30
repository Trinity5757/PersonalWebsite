// app/models/Like.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { LikeType } from "./enums/LikeType";

export interface ILike extends Document {
    _id: ObjectId | string;
    userId: ObjectId | string; // change to foreign key name consistent with other models
    associatedId: ObjectId | string; // ID reference to a post or comment
    type: string; 
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
    {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    associatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'type', // Dynamically sets the reference based on the type of like
    },
    type: {
      type: String,
      enum: Object.values(LikeType),
      required: true,
    },
  },
  { timestamps: true }
);

// index the user, associatedId, and type fields to limit duplicate likes by user
likeSchema.index({ userId: 1, associatedId: 1, type: 1 }, { unique: true });



export const Like = mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);
