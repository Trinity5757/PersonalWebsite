
import { connectDB } from "../lib/connectDB";
import { Location } from "../models/Location";
import { Types } from "mongoose";



// To do: test getAllLocations

// To do: test createLocation

// To do: test getLocationById
export async function getLocationById (locationId: string) {
     

  try {
    await connectDB();
    if (!Types.ObjectId.isValid(locationId)) {
      throw new Error("Invalid ID format");
    }

    const location = await Location.findById(locationId);

    if (!location) {
      throw new Error("Location not found");
    }

    return location;
  } catch (error) {
    throw error;
  }
};

// To do: implement & test updateLocationById

// To do: implement & test deleteLocationById

// To do: implement & test getLocationsByUserId







