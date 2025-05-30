// app/models/SettingModels/GeneralSettings.ts
import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IGeneralSettings extends Document {
  _id: ObjectId | string; // Reference to entity who owns the settings
  userId: ObjectId | string;
  is2FAenabled: boolean; // 2FA enabled or not
  marketplace: boolean; // Marketplace service area
  languages: ObjectId[]; // Reference to supported languages

  // UI Settings
  darkMode: boolean;
}

const generalSettingsSchema = new Schema<IGeneralSettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    is2FAenabled: { type: Boolean, default: false },
    marketplace: { type: Boolean, default: false },
    languages: [{ type: Schema.Types.ObjectId, ref: "Language" }], // Reference to language IDs

    // UI Settings
    darkMode: { type: Boolean, default: false },
    
},

 
{ timestamps: true }
);

generalSettingsSchema.index({ userId: 1 }, {unique: true}); 

export const GeneralSettings = mongoose.models.GeneralSettings || mongoose.model<IGeneralSettings>("GeneralSettings", generalSettingsSchema);

