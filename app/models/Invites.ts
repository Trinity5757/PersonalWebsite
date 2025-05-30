import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { InviteStatus } from "./enums/InviteStatus";
import { InviteType } from "./enums/InviteType";
import { OrganizationRoles } from "./enums/OrganizationRoles";

export interface Invite extends Document {
  _id: ObjectId | string; 
  associatedEntity: {
    associatedEntityId: ObjectId | string; // associated entity (e.g., Sport, Team, etc.)
    associatedEntityType: InviteType; // The type of the associated entity
  };
  inviter: ObjectId | string; // the user who sends the invite (Must be organization/event admin)
  invitees: {
    inviteeId: ObjectId | string; // Reference to User
    inviteeType: string;
    role?: OrganizationRoles // WIll be displayed for organization invites. Invites for events may not be necessary unless we may want to differentiate between participants and attendees
    status: InviteStatus; // invite status
    expirationDate: Date; // Date when the invite expires
    joinDate: Date; // Date when the invite was accepted
    declinedAt: Date;
  }[];
  title: string;  // May function as subject (Organization/event  name) useful for notifications
  message?: string; // Optional introduction message 
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema({
  associatedEntity: {
    associatedEntityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    associatedEntityType: {
      type: String,
      enum: Object.values(InviteType),
      required: true,
    },
  },
  inviter: {
    type: Schema.Types.ObjectId, // Reference to User (inviting user)
    ref: 'User',
    required: true,
  },
  invitees: [
    {
      inviteeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'inviteeType', // Dynamically sets the reference based on the type of like
      },
      inviteeType: {
        type: String,
        enum: ["User", "Team", "Business"],
        required: true,
      },
      role: {
        type: String,
        enum: Object.values(OrganizationRoles),
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(InviteStatus),
        default: InviteStatus.PENDING,
      },
      expirationDate: {
        type: Date, 
        default: null,
      },
      acceptedDate: {
        type: Date,
        default: null, 
      },
      declinedDate: {
        type: Date,
        default: null, 
      },
    },
  ],
  title: {
    type: String,
    required: true, 
  },
  message: { type: String, maxlength: 255, trim: true, default: ""},
}, { timestamps: true });

export const Invite = mongoose.models.Invite || mongoose.model<Invite>("Invite", inviteSchema);