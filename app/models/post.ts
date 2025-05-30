import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { IUser } from "./Users";

// Post can be created by a user, business, or team




export interface IPost extends Document {
  _id: ObjectId | string; // Align with TypeScript
  caption: string;
  visibility: "public" | "friends" | "private";
  media?: string[]; // Array of media
  user_id: ObjectId | string; // if a user creates the post, then user_id will be the id of the user
  // links the post to the primary user/owner who owns the business, team, or entity
  created_by: ObjectId | IUser; // foriegn key for user who created the post - can be
  owner_id: ObjectId | string; // foriegn key for business or team or event
  owner_type: "user" | "business" | "team" | "event" | "program" | "page" | "sport";
  author: string; // username or the name of the team or business that the user posst on behalf
  tags: string[];
  location: string; // user entered location
  location_id?: ObjectId; // fetch the location from the location table
  shares: number;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  views: number;
  createdAt: Date;
  avatar_image: string;
  archived: boolean;
  trash: boolean;
  reported: ObjectId[];
  managers?: ObjectId[];

}

// Define the schema for Posts
const postSchema = new mongoose.Schema<IPost>(
  {
    caption: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      required: true,
      default: "public",
    },
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    owner_id: {
      type: mongoose.Schema.ObjectId,
      refPath: "owner_type",
      required: false,
    },
    owner_type: {
      type: String,
      enum: ["user", "business", "team", "event", "program", "page", "sport"],
      required: false,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      maxlength: 40,
      default: [],
    },
   
    location: {
      type: String,
      default: "",
    },
    location_id: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
    shares: {
      type: Number,
      default: 0,
    },   
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "Like",
      default: [], // Default to an empty array
    },
    views: {
      type: Number,
      default: 0,
    },
    media: {
      type: [String],
      default: ["https://picsum.photos/200/300"],
    },
    avatar_image: { type: String, default: "https://api.dicebear.com/9.x/glass/svg" },
    archived: {
      type: Boolean,
      default: false,
    },
    trash: {
      type: Boolean,
      default: false,
    },

    reported: {
      type: [Schema.Types.ObjectId],
      ref: "Report",
      default: [],
    },

    managers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

  },

  { timestamps: true }
);



postSchema.index({ created_by: 1 });
postSchema.index({ location: "2dsphere" });
postSchema.index({ visibility: 1 });


export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
