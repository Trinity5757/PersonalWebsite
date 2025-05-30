// app/models/Users.ts - Updated with password reset fields
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId | string; // align with typescript
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other";
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
  posts: mongoose.Types.ObjectId[]; // Changed from pages to posts
  comments: mongoose.Types.ObjectId[]; // Stores references to comments a user makes
  likes: mongoose.Types.ObjectId[]; // Stores a list of references of likes a user has made
  is2FAEnabled: boolean;
  is_verified: boolean;
  last_login: Date | null;
  bio?: string;
  avatar_image?: string;
  cover_image?: string;
  phone_number?: string;
  businesses: mongoose.Types.ObjectId[]; // or "Pages"
  teams: mongoose.Types.ObjectId[]; // added teams array
  friends: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  profilePage: ObjectId | string; // user main profile page reference
  
  // Password reset fields
  resetToken?: string;
  resetTokenExpiry?: Date;

  pages: mongoose.Types.ObjectId[]; // user can have multiple pages
  cart: mongoose.Types.ObjectId[];
  generalSettings: ObjectId | string; // Reference to settings
  settings: {
    general: ObjectId,
    privacy: ObjectId,
    userPreferences: ObjectId
  };

  locations?: { // array of embedded document for user locations
    displayName: string;
    streetName: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    locationType: "home" | "work" | "school" | "other";
    location: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
  }[];


  //generateEmailVerificationToken: () => string;
}

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true, maxlength: 255, trim: true },
    last_name: { type: String, required: true, maxlength: 255, trim: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    username: { type: String, required: true, unique: true, minlength: 3, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // Referencing posts
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Referencing comment
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Referencing likes
    is2FAEnabled: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    last_login: { type: Date, default: null },
    bio: { type: String, maxlength: 500, default: "" },
    avatar_image: { type: String, default: "https://api.dicebear.com/9.x/glass/svg" },
    cover_image: { type: String, default: "https://api.dicebear.com/9.x/glass/svg" },
    phone_number: { type: String, default: "" },
    businesses: [{ type: Schema.Types.ObjectId, ref: "Business", default: [] }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team", default: [] }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    profilePage: { type: Schema.Types.ObjectId, ref: "Page" },
    
    // Add password reset fields
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    
    pages: [{ type: Schema.Types.ObjectId, ref: "Page", default: [] }],
    cart: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }], // will need to creat a cart model or cart item
    settings: {
      general: { type: Schema.Types.ObjectId, ref: "GeneralSettings", default: null},
      privacy: { type: Schema.Types.ObjectId, ref: "PrivacySettings", default: null},
      userPreferences: { type: Schema.Types.ObjectId, ref: "UserPreferences", default: null},
    },
    locations: [
      {
        displayName: { type: String, required: true },
        streetName: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        locationType: { 
          type: String, 
          enum: ["home", "work", "school", "other"],  
          required: true, 
          default: "other" 
        },
        location: {
          type: { type: String, enum: ["Point"], required: true },
          coordinates: { 
            type: [Number], 
            required: true, 
            index: "2dsphere",
            validate: {
              validator: function (coords: number[]) {
                return (
                  coords.length === 2 &&
                  coords[0] >= -180 && coords[0] <= 180 &&  // Longitude range
                  coords[1] >= -90 && coords[1] <= 90       // Latitude range
               );
              },
              message: 'Location coordinates must have exactly two values within range: [longitude, ex: -180 to 180, latitude, ex: -90 to 90].'
            }
          }, 
        },
      },
    ],
  },
  { timestamps: true,  },
  
);

userSchema.path('locations').validate(function (value) {
  if (value && value.length > 3) {
    return false;
  }
  return true; 
}, 'A user can have a maximum of 3 locations.');

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);