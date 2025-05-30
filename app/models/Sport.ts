import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Ecah Sport is a broad catgeory
export interface ISport extends Document {
  createdBy: ObjectId; // Reference to admin user
  sportName: string;        // 
  description: string; // Broad Description of the sport
  pageId: ObjectId;    // Refers  page/ profile
  teams: ObjectId[];   // Associated teams
  events: ObjectId[];  // Associated events
  programs: ObjectId[]; // Associated programs
  icon?: string;       
  slug?: string;       
}

const sportSchema = new Schema<ISport>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Admin user
    sportName: { type: String, required: true },
    description: { type: String, required: true },
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: false }, 
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }], // Teams associated with this sport
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Events associated to this sport
    programs: [{ type: Schema.Types.ObjectId, ref: "Program" }], // Programs asociated to this sport
    icon: { type: String },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);


sportSchema.index({ sportName: 1 }); // Index for querying by sport name

export const Sport = mongoose.models.Sport || mongoose.model<ISport>("Sport", sportSchema);
