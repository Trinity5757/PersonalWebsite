import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Location - areas for venues and major cities
export interface ILocation extends Document {
  _id: ObjectId | string;
  associatedID: ObjectId | string; // Refers to the associated entity (Event, Team, etc.)
  displayName: string;    // Display name of the location
  streetName: string;           // Name of the location (Orange County, CA, US
  county?: string;         // County where the location is located Orange County
  city: string;           // City where the location is located
  cityId?: string;
  state: string;          // State where the location is located
  region?: string;
  regionId?: string;
  country: string;        // Country of the location
  countryCode?: string; // Country code
  zipCode?: string; // Zip code or postal code
  located_in?: ObjectId | string;

  location:{
    type: string;
    coordinates: number[];
  }

  locationType?: 'home' | 'work' | 'other'; // Type of location (home, work, etc.)
 
  associatedEntity: 'Event' | 'Team' | 'Business' | 'Program'; // Entity type the location is associated with

}

// https://www.mongodb.com/docs/manual/reference/geojson/
/*
If specifying latitude and longitude coordinates, list the longitude first, and then latitude.

Valid longitude values are between -180 and 180, both inclusive.

Valid latitude values are between -90 and 90, both inclusive.
*/
const locationSchema = new Schema<ILocation>(
  {
    associatedID: { type: Schema.Types.ObjectId, required: true, refPath: 'associatedEntity' }, // Refers to any associated entity
    displayName: { type: String, required: true },
    streetName: { type: String, required: true },
    county: { type: String, required: true },
    city: { type: String, required: false },
    cityId: { type: String, default: null },
    state: { type: String, required: false },
    region: { type: String, default: null },
    regionId: { type: String, default: null },
    country: { type: String, required: false },
    countryCode: { type: String, default: null },
    zipCode: { type: String, default: null },
    located_in: { type: Schema.Types.ObjectId, ref: "Location" },
    location: {
      type: {
        type: String,
        enum: ['Point'], // 'Point' for geospatial data
        required: true
      },
      coordinates: { // [longitude, latitude]
        type: [Number],
        required: true,
       
        validate: {
          validator: function (coords: number[]) {
            return (
              coords.length === 2 &&
              coords[0] >= -180 && coords[0] <= 180 &&  // Longitude range
              coords[1] >= -90 && coords[1] <= 90       // Latitude range
            );
      },

          locationType: {
            type: String,
            enum: ['home', 'work', 'other'],
            required: true,
            default: 'other'
          },
          
          message: 'Location coordinates must have exactly two values within range: [longitude, ex: -180 to 180, latitude, ex: -90 to 90].'
        }
      }
    },
   
    associatedEntity: { 
      type: String, 
      enum:  ['Event', 'Team', 'User', 'Business', 'Program'], // type of associated entity
      required: true,

    },
  },
  { timestamps: true }
);


locationSchema.index({ location: "2dsphere" });


// Export the Location model
export const Location = mongoose.models.Location || mongoose.model<ILocation>("Location", locationSchema);