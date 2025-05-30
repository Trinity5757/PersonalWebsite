import mongoose, { ObjectId, Schema } from "mongoose";
// import { Frequency } from "./enums/Frequency";

export interface INotification extends Document {
    _id: ObjectId | string;
    recipient: ObjectId | string; // ID of the recipient (User or Page)
    recipientType: "User" | "Page"; // Type of recipient (e.g., "User" or "Page")
    sender: ObjectId | string; // ID of the user or entity that triggered the notificatio
    senderType: "User" | "Business" | "Team" | "Page" | "Event" | "Sport"; // Type of sender (e.g., "User", "Business", "Team")
    type: string; // Notification type (ex: "like", "comment", "follow
    message: string; //  message (ex: "User X liked your post")
    read: boolean;// Whether the notification has been read
    readAt?: Date;
    metadata?: Record<string, any>; // todo: add metadata for different notification types possibly
    frequency?: "instant" | "daily" | "weekly"; // account for different notification frequency
    turnedOn?: boolean; // whether the notification is turned on(or off)  for this entity
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: { type: Schema.Types.ObjectId, required: true },
        recipientType: { type: String, enum: ["User", "Page"], required: true },
        sender: { type: Schema.Types.ObjectId, required: true },
        senderType: { type: String, enum: ["User", "Business", "Team"], required: true },
        type: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        readAt: { type: Date, default: null },
        metadata: { type: Schema.Types.Mixed },
        frequency: {
            type: String,
            enum:  ["instant", "daily", "weekly"],
            default: "instant",
        },
        turnedOn: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 }); // index for querying by recipient sorted by createdAt in descending order
notificationSchema.index({ recipient: 1, read: 1 }); // index for querying by recipient sorted by read status
notificationSchema.index({ recipient: 1, type: 1 }); // index for querying by recipient and type

export const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);
