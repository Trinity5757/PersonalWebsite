import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface ITeam extends Document {
  _id: ObjectId | string;
  name: string;
  sportType: string; 
  sportId: ObjectId; // To reference a Sport
  pageId: ObjectId | string; // Reference to a Page
  coach?: ObjectId; // Reference to a User as the coach
  owner: ObjectId | string; // refernce to User who owns the team
  league?: string; 
  members: ObjectId[]; // Array of Member references
  cover_picture?: string;
  profilePicture?: string
  
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    sportId: { type: Schema.Types.ObjectId, ref: "Sport", required: false },
    sportType: { type: String, required: true },
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: false },
    coach: { type: Schema.Types.ObjectId, ref: "User" },
    owner: { type: Schema.Types.ObjectId, ref: "User" , required: true },
    league: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    cover_picture: { type: String },
    profilePicture: { type: String }
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);
