import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Define interface for a Message document
export interface IMessage extends Document {
  _id: ObjectId | string;
  chatId: ObjectId | string; // Ref to the chat room 
  senderId: ObjectId | string; // User who sent the message
  sender: {
    username: string;
    avatar_image: string;
  }
  content: string; //content of the message
  messageType: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: { userId: ObjectId | string, readAt: Date }[];
  readAt: Date | null;
  status: string; // Sent, delivered, read status // to do enums
  mediaUrl?: string; // URL for media messages
  mediaSize?: number; // Size of media, if applicable
  deletedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: {
      username: { type: String, required: false },
      avatar_image: { type: String, required: false },
    },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "video", "audio", "file"], required: false },
    readBy: [{ userId: { type: Schema.Types.ObjectId, ref: "User" }, readAt: { type: Date } }],
    readAt: { type: Date, default: null },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    mediaUrl: { type: String, required: false },
    mediaSize: { type: Number, required: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Indexing by chatId and createdAt 
messageSchema.index({ chatId: 1, createdAt: -1 });
// todo index for status
export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
