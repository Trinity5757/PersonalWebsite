import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IReport extends Document {
  _id: ObjectId | string;
  reportedEntityId: ObjectId | string;
  reportedEntityType: "Post" | "User" | "Page" | "Comment" | "Team";
  reported_by: ObjectId;
  reason: string;  // To do create a enum for reasons of report: ReportType should be an enum:  ["inapropriate content", "violence", "harassment", "misinformation", "other"],  required: true  },
  details: string;
  description: string; // a max description of 500 characters for the report
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reportedEntityId: { type: Schema.Types.ObjectId, required: true },
    reportedEntityType: {
        type: String,  
        enum: ["Post", "User", "Page", "Comment", "Team"],  
        required: true 
    },
    reported_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    details: { type: String, required: true },
    description: { type: String, required: true, maxlength: 500 },
    status: { 
        type: String, 
        enum: ["pending", "reviewed", "resolved"], 
        default: "pending" 
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);