// app/models/Page.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { Visibility } from "./enums/Visibility";

// a page is a gneric template to display an entity
export interface IPage extends Document {
  _id: ObjectId | string; // align with typescript
  name: string;
  description?: string;
  owner: ObjectId | string; // Ref to User who owns page
  associated_entity?: ObjectId; // if a team or business or event page
  type: "user"| "business" | "team" | "event" | "profile"; // whether the profile belomngs to a user or business...
  cover_picture?: string;
  profilePicture?: string;
  followers: ObjectId[];
  location?: string; // Location of the page - to do use array
  posts: ObjectId[]; // posts on page
  events: ObjectId[]; // event refs
  likes: ObjectId[]; // Likes on the page
  jobs?: ObjectId[]; // Array of Job references if relevant
  access_history?: { user: ObjectId; access_date: Date }[];
  roles: {
    userId: ObjectId; // Ref to user with access role
    page_role: "admin" | "user" | "editor"; // Access role on the page - different permissions
    createdAt: Date;
  }[];
 
  settings: ObjectId | string;
  notifications?: ObjectId | string;

  status: "published" | "draft" | "unpublished"; // Publishing status

  canBeFollowed: boolean;
  pageVisibility: Visibility;

  managers?: ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        associated_entity: { type: Schema.Types.ObjectId, refPath: "type" },
        type: {
          type: String,
          enum: ["business", "team", "event", "profile", "user", "sport"],
          required: false,
        },
        cover_picture: { type: String, default: null },
        profilePicture: { type: String, default: null },
        description: { type: String, default: '' },
        location: { type: String, default: '' },
        followers: [{ type: Schema.Types.ObjectId }],
        posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
        events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
        access_history: [ // tracking visits
          {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            access_date: { type: Date, default: Date.now },
          },
        ],
        roles: [
          {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            page_role: { type: String, enum: ["admin", "user", "editor"], required: true },
            createdAt: { type: Date, default: Date.now },
          },
        ],

        settings: { type: Schema.Types.ObjectId, ref: "PageSettings" },
        notifications: { type: Schema.Types.ObjectId, ref: "PageNotifications" },
      
        status: {
          type: String,
          enum: ["published", "unpublished", "draft"],
          default: "published",
        },

        canBeFollowed: { type: Boolean, default: true },

        pageVisibility: {
          type: String,
          enum: Object.values(Visibility),
          default: Visibility.PUBLIC,
        },

      managers: [{ type: Schema.Types.ObjectId, ref: "User" }], // users who can manage the page

      },
    { timestamps: true }
);

pageSchema.index({ owner: 1 });
pageSchema.index({ associated_entity: 1 });
pageSchema.index({ owner: 1, type: 1, status: 1 });


export const Page = mongoose.models.Page || mongoose.model<IPage>("Page", pageSchema);
