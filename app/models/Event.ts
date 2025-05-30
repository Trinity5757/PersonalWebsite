import mongoose, { Document, ObjectId, Schema } from "mongoose";
// only admins can create events
export interface IEvent extends Document {
  _id: ObjectId | string;
  pageId: ObjectId;
  title: string;
  description: string;
  location: string;
  startDate: Date; // Start of the event
  endDate: Date;   // End of the event
  organizer: ObjectId;
  organizerType: "admin" | "business" | "team";
  category: string; // Event type: sport, tryout, etc.
  capacity: number;
  attendees: { user: ObjectId; ticketType: string }[];
  participants: { user: ObjectId; team?: ObjectId }[];
  programId?: ObjectId;
  locationId?: ObjectId;
}

const eventSchema = new Schema<IEvent>(
  {
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: false },
    location: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true }, // Start date is required
    endDate: { type: Date, required: true },   // End date is required
    organizer: { type: Schema.Types.ObjectId, refPath: "organizerType", required: true },
    organizerType: { type: String, enum: ["user", "business", "team"], required: true },
    category: { type: String, enum: ["sport", "tryout", "practice", "other"], required: true },
    capacity: { type: Number, default: 0 },
    attendees: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        ticketType: { type: String, enum: ["general", "vip"], default: "general" },
      },
    ],
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        team: { type: Schema.Types.ObjectId, ref: "Team" },
      },
    ],

    programId: { type: Schema.Types.ObjectId, ref: "Program", required: false },
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: false },

  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
