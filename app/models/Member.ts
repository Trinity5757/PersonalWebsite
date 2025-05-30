import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { OrganizationRoles } from "./enums/OrganizationRoles";
import { OrganizationType } from "./enums/OrganizationType";

export interface IMember extends Document {
  _id: ObjectId | string;
  userId: ObjectId | string; // Ref to user
  organization: ObjectId | string; // Ref either Team or Business
  organizationType: OrganizationType; // Distinguish between team or business
  role: OrganizationRoles; // Role within the organization
  inviteId: ObjectId | string; // Ref to invite
  status: "active" | "inactive"; // if user is active or not
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organization: { type: Schema.Types.ObjectId, refPath: "organizationType", required: true },
    organizationType: { type: String, enum: Object.values(OrganizationType), required: true },
    role: { type: String, enum: Object.values(OrganizationRoles), required: true },
    inviteId: { type: Schema.Types.ObjectId, ref: "Invite", required: false }, // link member to invite
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

memberSchema.index({ userId: 1 });
memberSchema.index({ organization: 1, organizationType: 1 });
memberSchema.index({ status: 1 });

export const Member = mongoose.models.Member || mongoose.model<IMember>("Member", memberSchema);
