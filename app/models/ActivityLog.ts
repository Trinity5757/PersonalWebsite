import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IActivityLog extends Document {
  _id: ObjectId | string;
  associatedId: ObjectId; // asscoaied ID of Page, Post, Comment, etc.
  associatedType: "page" | "post" | "comment"; // Type of associated entity
  userId: ObjectId; // User performing the action
  action: "view" | "like" | "unlike" | "follow" | "unfollow" | "comment";
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    associatedId: { type: Schema.Types.ObjectId, required: true },
    associatedType: { type: String, enum: ["page", "post", "comment"], required: true },
    action: { type: String, enum: ["view", "like", "unlike", "follow", "unfollow", "comment"], required: true },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);
