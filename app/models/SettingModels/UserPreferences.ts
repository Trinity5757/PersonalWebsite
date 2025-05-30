//app/models/SettingModels.UserPreferences.ts
import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { Frequency } from "../enums/Frequency";

// aka User Notification Settings - global notification settings for the user
export interface IUserPreferences extends Document {
    _id: ObjectId | string;
  userId: ObjectId | string;  
  notifications: { // Notification preferences for the user - global
    inApp:boolean; 
    email: boolean;
    push: boolean;
    sms: boolean;
    frequency: "instant" | "daily" | "weekly";
  };

  mutedNotifications: ObjectId[]; // Notification ids that the user has muted
}

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notifications: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      frequency: { type: String, 
        enum: Object.values(Frequency),
        default: Frequency.INSTANT
       },
    },

    mutedNotifications: [{ type: Schema.Types.ObjectId, ref: "MutedNotification" }],
  },
  { timestamps: true }
);


userPreferencesSchema.index({ userId: 1 }, {unique: true});

export const UserPreferences = mongoose.models.UserPreferences || mongoose.model<IUserPreferences>('UserPreferences', userPreferencesSchema);
