import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IProgram extends Document {
  name: string;              // Program name
  type: "sport" | "fundraiser" | "financialAid";  // Type of program  - change to enum later or categoryId
  description?: string;     
  organizer: ObjectId | string;       // Link to a user, team, or business
  startDate: Date;           // Program start date - A program can have multiple events, can be timely 
  endDate: Date;             // Program end date - events may have different start and end dates
  events: ObjectId[];        // References to Events
  sport?: ObjectId | string;
  // open league program - age restricted
  // consist of leagues - unions of teams with similar skill level
}

const programSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["sport", "fundraiser", "financialAid"], required: true },
    description: { type: String },
    organizer: { type: Schema.Types.ObjectId, refPath: "organizerType", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Link to related events
    sport: { type: Schema.Types.ObjectId, ref: "Sport" },    // Link to the Sport model (for sport type programs)

},
  { timestamps: true }
);

export const Program = mongoose.models.Program || mongoose.model<IProgram>("Program", programSchema);
