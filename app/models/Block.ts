// app/models/Block.ts
import mongoose, { ObjectId, Schema } from "mongoose";

export interface IBlock extends Document {
    _id: ObjectId | string; 
    pageId: ObjectId | string;
    userId: ObjectId | string;
    blockedMember: ObjectId | string;
    blockedPage: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;

  }
  
  const blockSchema = new Schema<IBlock>(
    {
      pageId: { type: Schema.Types.ObjectId, ref: "Page", required: false },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
      blockedMember: { type: Schema.Types.ObjectId, ref: "User", required: false },
      blockedPage: { type: Schema.Types.ObjectId, ref: "Page", required: false },
    },
    { timestamps: true }
  );
  

  export const Block = mongoose.models.Block || mongoose.model<IBlock>("Block", blockSchema);
  