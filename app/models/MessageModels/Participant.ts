import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IParticipant extends Document {
  chatId: ObjectId | string; // Reference to the chat room
  userId: ObjectId | string; // User in the chat room
  role: string; // E.g., "admin", "member"
  joinedAt: Date; // Date when user joined
  leftAt?: Date; // Date when user left
}

const participantSchema = new Schema<IParticipant>({
  chatId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "member"], required: true },
  joinedAt: { type: Date, default: Date.now },
  leftAt: { type: Date, default: null },
});

// index for queries by chatId and userId
participantSchema.index({ chatId: 1, userId: 1 }, { unique: true }); 
// to do index for role or other needed fields

export const Participant = mongoose.models.Participant || mongoose.model<IParticipant>("Participant", participantSchema);
