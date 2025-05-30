import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IChatRoom extends Document {
  _id: ObjectId | string;
  userId: ObjectId | string;  // Reference to the user who created the chat room
  role: string; // Role of the user (e.g., "admin", "member")
  chatIcon?: string; // Optional icon for the chat room (e.g., URL to the image)
  chatName?: string; // Name of the chat room, default could be a list of recipients
  createdAt: Date; // Timestamp for when the chat room was created
  isDirectMessage: boolean;
  participants: ObjectId[];
  updatedAt: Date; // Timestamp for when the chat room was last updated
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], required: true },
    chatIcon: { type: String, required: false }, // Optional, could store image URL
    chatName: { type: String, required: false }, // Optional, used for chat room name
    isDirectMessage: { type: Boolean, default: false , required: false },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    
  },
  { timestamps: true } 
);

// retriev chats by userId
chatRoomSchema.index({ userId: 1 });
chatRoomSchema.index({ participants: 1 });
// index for queries by chatname
chatRoomSchema.index({ chatName: 1 });


export const ChatRoom = mongoose.models.ChatRoom || mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
