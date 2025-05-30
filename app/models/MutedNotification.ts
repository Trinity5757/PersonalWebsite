import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMutedNotification extends Document {
    _id: ObjectId | string;
  userId: ObjectId | string; //  user who muted the notification
  notificationId: ObjectId | string; 
  mutedAt?: Date;
}

const mutedNotificationSchema = new Schema<IMutedNotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notificationId: { type: Schema.Types.ObjectId, ref: "Notification" }, // Optional
    mutedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


mutedNotificationSchema.index({ userId: 1, notificationId: 1 });
mutedNotificationSchema.index({ userId: 1, senderId: 1 });
mutedNotificationSchema.index({ userId: 1, type: 1 }); // index for filtering by type

export const MutedNotification = mongoose.model<IMutedNotification>(
  "MutedNotification",
  mutedNotificationSchema
);
