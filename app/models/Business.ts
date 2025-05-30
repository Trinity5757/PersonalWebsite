import mongoose, { Document, ObjectId, Schema } from "mongoose";

// a user can have multiple businesses
// they creat a page and asoite it with a business upon creation
export interface IBusiness extends Document {
  _id: ObjectId | string;
  pageId: ObjectId; // Reference to Page
  businessName: string;
  category: string; // "Food", "Retail", "Restaurant", "Tech"
  contactEmail: string;
  phone?: string;
  website?: string;
  address?: string;
  owner: ObjectId | string;
  members: ObjectId[]; // Array of Member references
  // todo add tags
  industry: string;
  tags?: string[]; 
  profilePicture?: string
  cover_picture?: string
  description?: string
 
}

const businessSchema = new Schema<IBusiness>({
  pageId: { type: Schema.Types.ObjectId, ref: "Page", required: false }, // Link to the Page
  businessName: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: String, required: false },
  contactEmail: { type: String, required: true },
  profilePicture: { type: String },
  cover_picture: { type: String },
  phone: { type: String },
  website: { type: String },
  address: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  tags: { type: [String], default: [] }, // Array of tags for flexibility
  industry: { type: String },
 

}, { timestamps: true });

businessSchema.index({ pageId: 1 });

export const Business = mongoose.models.Business || mongoose.model<IBusiness>("Business", businessSchema);
