import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Interface for Language
export interface ILanguage extends Document {
  _id: ObjectId | string;
  name: string;           // Name of the language
  languageCode: string;    // Abbreviation of the language
  createdAt: Date;
  updatedAt: Date;
}

const languageSchema = new Schema<ILanguage>(
  {
    name: { type: String, required: true },
    languageCode: { type: String, required: true },
  },
  { timestamps: true }
);



export const Language = mongoose.models.Language || mongoose.model<ILanguage>("Language", languageSchema);
