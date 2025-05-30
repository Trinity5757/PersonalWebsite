import mongoose from "mongoose";
import { Location } from "../../app/models/Location";
import { connectDB } from "@/app/lib/connectDB";
import { User } from "../../app/models/Users";

let testUser: any;

beforeAll(async () => {
  await connectDB();


  // Ensure the test user exists
  testUser = await User.findById("67aa6bd76a68fea597ed6e3d");

  if (!testUser) {
    throw new Error("Test user not found. Make sure the user exists in the database.");
  }
});

beforeEach(async () => {
  // Clean test collections instead of dropping the database
  await Location.syncIndexes();
  await Location.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Geospatial Queries in MongoDB", () => {
  it("should insert a location linked to the test user", async () => {
    const location = await Location.create({
      associatedID: testUser._id,
      displayName: "Test Place",
      streetName: "410 Central Avenue",
      city: "Salinas",
      state: "California",
      country: "United States",
      countryCode: "US",
      county: "Monterey",
      zipCode: "93907",
      location: {
        type: "Point",
        coordinates: [-73.856077, 40.848447], // Longitude, Latitude
      },
      locationType: "home",
      associatedEntity: "User",
    });

    testUser = await User.findById("67aa6bd76a68fea597ed6e3d");
    testUser.locations.push(location);

    expect(location).toBeTruthy();
    expect(location._id).toBeDefined();
    expect(location.associatedID.toString()).toBe(testUser._id.toString());
  });

  it("should find multiple locations near a point", async () => {
    // Create multiple test locations within the search radius
    await Location.create([
      {
        associatedID: testUser._id,
        displayName: "Nearby Place 1",
        streetName: "456 Side St",
        county: "Test County",
        city: "Salinas",
        state: "California",
        country: "United States",
        countryCode: "US",
        zipCode: "93907",
        location: {
          type: "Point",
          coordinates: [-73.85, 40.85], // Slightly different coordinates
        },
        associatedEntity: "User",
      },
      {
        associatedID: testUser._id,
        displayName: "Nearby Place 2",
        streetName: "789 Another St",
        county: "Test County",
        city: "Salinas",
        state: "California",
        country: "United States",
        countryCode: "US",
        zipCode: "93907",
        location: {
          type: "Point",
          coordinates: [-73.852, 40.849], // Another close location
        },
        associatedEntity: "User",
      },
      {
        associatedID: testUser._id,
        displayName: "Far Place",
        streetName: "123 Far Away St",
        county: "Test County",
        city: "Los Angeles",
        state: "California",
        country: "United States",
        countryCode: "US",
        zipCode: "90001",
        location: {
          type: "Point",
          coordinates: [-74.00, 41.00], // Too far to be included
        },
        associatedEntity: "User",
      }
    ]);
  
    const userLocation = [-73.856077, 40.848447];
    const maxDistance = 10 * 1000; // 10 km in meters
  
    const nearbyPlaces = await Location.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: userLocation },
          $maxDistance: maxDistance,
        },
      },
    });
  
    // Expecting to find the first two places, but not the far one
    expect(nearbyPlaces.length).toBe(2);
    console.log(nearbyPlaces);
    expect(nearbyPlaces.map(p => p.displayName)).toContain("Nearby Place 1");
    expect(nearbyPlaces.map(p => p.displayName)).toContain("Nearby Place 2");
    expect(nearbyPlaces.map(p => p.displayName)).not.toContain("Far Place");
  });
  
});
