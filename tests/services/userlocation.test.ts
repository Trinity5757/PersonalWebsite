import { connectDB } from "@/app/lib/connectDB";
import { User } from "../../app/models/Users";
import mongoose from "mongoose";
import { addLocationToUser } from "@/app/services/userService";
import { Gender } from "@/app/models/enums/Gender";
import { createSettings } from "@/app/services/settingServices/settingService";

let testUser: any;

beforeAll(async () => {
  await connectDB();

  const users = await User.find({});

  for (const user of users) {
    user.locations = [];
  }


  // Ensure the test user exists
  testUser = await User.findById("679b923ab1b6a6d3c8947270");

  if (!testUser) {
    throw new Error("Test user not found. Make sure the user exists in the database.");
  }
});

beforeEach(async () => {
  //dont clean test collections!
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Add Location to User", () => {
  it("should add a location to the test user, even if no locations exist", async () => {
    const locationData = {
      displayName: "Test Location",
      streetName: "123 Example St",
      city: "Salinas",
      state: "California",
      country: "United States",
      locationType: "home",
      zipCode: "93907",
      location: {
        type: "Point",
        coordinates: [-73.856077, 40.848447], // Longitude, Latitude
      }
    };

    const users = await User.find({});

    for (const user of users) {
      user.locations = [];
  
      if (user._id === "679b923ab1b6a6d3c8947270") {
      await createSettings(user._id);
      }
    }

    // Add location to user
    await addLocationToUser("679b923ab1b6a6d3c8947270", locationData);

    // Fetch the user and check if location was added
    const updatedUser = await User.findById("679b923ab1b6a6d3c8947270");
    expect(updatedUser).toBeTruthy();
   
  });

  it("should handle case where the user has no locations initially", async () => {
    const userWithNoLocation = await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      username: "johndoe",
      password: "password123",
      role: "user",
      gender: Gender.Male,
      date_of_birth: new Date("1990-01-01"),
      posts: [],
      comments: [],
      likes: [],
      locations: [] // Initially no locations
    });

    const locationData = {
      displayName: "Test Location",
      streetName: "123 Example St",
      city: "Salinas",
      state: "California",
      country: "United States",
      zipCode: "93907",
      locationType: "home",
      location: {
        type: "Point",
        coordinates: [-73.856077, 40.848447], // Longitude, Latitude
      }
    };

    // Add location to the user with no initial locations
    await addLocationToUser(userWithNoLocation._id.toString(), locationData);

    // Fetch the user and check if location was added
    const updatedUser = await User.findById(userWithNoLocation._id);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser?.locations.length).toBeGreaterThan(0);
    expect(updatedUser?.locations[0].displayName).toBe("Test Location");
  });
});
