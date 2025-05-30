// app/models/Request.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { RequestStatus } from "./enums/RequestStatus";
import { RequestType } from "./enums/RequestType";

export interface IRequest extends Document {
  _id: ObjectId | string; 
  requestee: ObjectId | string; // Reference to the ID of the user being requested
  requesteeType: "user" | "business" | "team" | "event" | "program" | "page"; // The type of the user being followed
  requester: ObjectId | string; // The ID of the user who is makking request
  requesterType: "user" | "business" | "team" | "event" | "program" | "page"; // The type of the user who is following
  status: RequestStatus; // Status of the  request
  requestType: RequestType; // Specifies whether it's a follow or friend request
  
  acceptedAt: Date; // When the  request was accepted
  rejectedAt: Date; // When the  request was rejected
  requestedAt: Date; // When the  request was made  address resends of requests
  
  updatedAt: Date; // When the  request was updated 
  createdAt: Date; // When the  request was created
}



// user can follow another user depending on their privacy settings (requireFriendRequests boolean field)
// if user changes their settings, they will have to add them as friends first before they can follow.
// adding a friend is only for users
// Businesses can follow users
// if Business visits member profile, they will be able to follow only
// user can follow and/or join a team depending if Team is public or private
// User can follow a Business depending on their settings, business can block users
const requestSchema = new Schema<IRequest>(
  {
    requestee: { type: Schema.Types.ObjectId, required: true },
    requesteeType: {
      type: String,
      enum: ["user", "business", "team", "event", "program", "page"],
      required: false,
    },
    requester: { type: Schema.Types.ObjectId, required: true },
    requesterType: {
      type: String,
      enum: ["user", "business", "team", "event", "program", "page"],
      required: false,
    },
    status: {
       type: String,
       enum: Object.values(RequestStatus),
       default: RequestStatus.PENDING,
       required: false
    },
    requestType: {
      type: String,
      enum: Object.values(RequestType),
      default: RequestType.FOLLOW,
      required: false
      },

      acceptedAt: { type: Date, required: false },
      rejectedAt: { type: Date, required: false },
      requestedAt: { type: Date, required: false },
  },
  { timestamps: { createdAt: true, updatedAt: true } } 
);




requestSchema.pre("save", function (next) {

  if (this.requestType === RequestType.FRIEND) {
    // only users can send friend requests, TODO:maybe ENUMS for user and business other types
    if (this.requesterType !== "user" || this.requesteeType !== "user") {
      return next(new Error("Friend requests can only be sent between users."));
    }
  }
  next();
});



requestSchema.index({ requester: 1, requestee: 1 }, { unique: true });
requestSchema.index({status: 1});
export const Request = mongoose.models.Request || mongoose.model<IRequest>("Request", requestSchema);
