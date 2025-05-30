// app/models/SettingModels/PrivacySettings.ts
import mongoose, { Document, Schema, ObjectId } from "mongoose";
import { Visibility } from "../enums/Visibility";

export interface IPrivacySettings extends Document {
  _id: ObjectId | string; 
  userId: ObjectId | string; // Reference to user ID
  canBeFollowed: boolean; // Whether this account can be followed
  requireFriendRequests: boolean; // Users can enable this to require a friend request before a follow
  blockList: ObjectId[]; // List of blocked user or business IDs

  // genreral Visibility settings
  onlineVisibility: Visibility; // Who can see online s
  locationVisibility: Visibility; // Who can see location

  // web visibility
  pageVisibility: Visibility; // Who can see the page
  postVisibility: Visibility; // Who can see posts
  friendVisibility: Visibility; // Who can see friends
  followingVisibility: Visibility; // Who can see followers


}

const privacySettingsSchema = new Schema<IPrivacySettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   
    canBeFollowed: { type: Boolean, default: true },
    requireFriendRequests: { type: Boolean, default: false }, // default is false

    blockList: [{ type: Schema.Types.ObjectId, ref: "Block" }], // Reference to blocked user IDs
   
    
    // genearal Visibility settings
     onlineVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.PUBLIC,
      },

      locationVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.PRIVATE,
      },


      // web visibility
      pageVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.PUBLIC,
      },
      postVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.PUBLIC,
      },

      friendVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.PRIVATE,
      },
      followingVisibility: {
        type: String,
        enum: Object.values(Visibility),
        default: Visibility.FRIENDS,
      },
     
},

 
{ timestamps: true }
);

privacySettingsSchema.index({ userId: 1}, { unique: true });

export const PrivacySettings = mongoose.models.PrivacySettings || mongoose.model<IPrivacySettings>("PrivacySettings", privacySettingsSchema);

