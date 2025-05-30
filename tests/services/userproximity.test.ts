import { connectDB } from "@/app/lib/connectDB";
import { User } from "../../app/models/Users";
import mongoose from "mongoose";
import { addLocationToUser } from "@/app/services/userService";

import { faker } from '@faker-js/faker';

let testUser: any;

beforeAll(async () => {
  await connectDB();

  // Ensure the test user exists
  testUser = await User.findById("67bb80d7c86577be7b541202");

  if (!testUser) {
    throw new Error("Test user not found. Make sure the user exists in the database.");
  }

  const users = await User.find({});

  for (const user of users) {
    if (!user.locations ) {
      user.locations = [];
    }
  }
});

beforeEach(async () => {
  // Clean test collections if necessary otherwise dont
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Add Realistic Location to User and Query Nearby Users", () => {

  const generateSpecificLocation = (city: "Los Angeles" | "Monterey") => {
    let coordinates: [number, number];

    if (city === "Los Angeles") {
      coordinates = [ -118.243683, 34.052234]; // Los Angeles Coordinates
    } else {
      coordinates = [-122.453379, 36.600236]; // Monterey Coordinates
    }

    return {
      displayName: city,
      streetName: faker.location.streetAddress(),
      city: city,
      state: "California",
      country: "United States",
      locationType: "home",
      zipCode: faker.location.zipCode(),
      location: {
        type: "Point",
        coordinates: coordinates,
      },
    };
  };

  it("should add Los Angeles and Monterey locations to users and find nearby users", async () => {
    // Add specific locations (Los Angeles and Monterey) to test user
    const losAngelesLocation = generateSpecificLocation("Los Angeles");
    const montereyLocation = generateSpecificLocation("Monterey");

    // Add the Los Angeles location to the test user
   
    if (!testUser.locations) {
      testUser.locations = [];
      testUser.locations.push(losAngelesLocation);
    } else {
      testUser.locations[0] = losAngelesLocation;
    }

    await testUser.save();
    
    
    // Fetch the updated user and check if locations were added
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.locations.length).toBeGreaterThan(0);

    // add a random location to each user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nearbyUsers: any[] = [];
    const users = await User.find({});
    let randomNumber;

    for (const user of users) {
     // randomNumber = Math.floor(Math.random() * 5); // Generate a random number between 0 and 4
   
      // create a random location based on the user's city
      let location = generateSpecificLocation("Los Angeles");
      user.locations[0] = location; // just first lcoation 

      if ( user._id === "67bbc735685bf63691e2c15e") {

        location = generateSpecificLocation("Los Angeles");;
        user.locations[0] = location;
      }

      // Note this will fail if user has 3 locations! - enforved on User schema
     ///  user.locations.push(location);
     await user.save();
      nearbyUsers.push(user);

     
    }

    // Perform geospatial query to find nearby users within a 10km radius
    const usersInRadius = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: updatedUser.locations[0].location.coordinates, // User's location 
          },
          distanceField: "distance",
          maxDistance: 1000, 
          spherical: true,
        },
      },
    ]);

    // Check if the query works by ensuring some users are within range
    expect(usersInRadius.length).toBeGreaterThan(0);
    expect(usersInRadius[0].distance).toBeDefined();
    console.log("Nearby users:", usersInRadius.length);

    usersInRadius.forEach((user: any) => {
      console.log(`User ID: ${user._id}`);
      console.log(`Name: ${user.first_name} ${user.last_name}`);
      console.log(`Location: ${user.locations[0].displayName}`);
      console.log(`Distance: ${user.locations[0].latitude - testUser.locations[0].longitude}  meters`);
      console.log(`Coordinates: ${user.locations[0].location.coordinates}`);
    });
  });
});
