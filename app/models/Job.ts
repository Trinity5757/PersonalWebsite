import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IJob extends Document {
  _id: ObjectId | string;
  title: string; 
  description: string; 
  pageId: ObjectId; // Ref to the Page associated with the job
  location?: string; 
  employmentType: "full-time" | "part-time" | "contract" | "internship"; 
  salaryRange?: { min: number; max: number }; //  salary range
  requirements: string[]; // job requirements 
  responsibilities: string[]; //  job responsibilities
  applicants: {
    userId: ObjectId; // Ref to User applying for the job
    applicationDate: Date;
    status: "pending" | "reviewed" | "accepted" | "rejected"; 
  }[];
  status: "active" | "closed"; // Job  status
  postedDate: Date;   // posted date
  closingDate?: Date; //   closing date
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pageId: { type: Schema.Types.ObjectId, ref: "Page", required: true },
    location: { type: String },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    requirements: [{ type: String },] ,
    responsibilities: [{ type: String }],
    applicants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        applicationDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "reviewed", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    postedDate: { type: Date, default: Date.now },
    closingDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Job = mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);
