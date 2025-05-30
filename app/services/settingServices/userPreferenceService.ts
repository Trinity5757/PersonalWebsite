//app/services/settingServices/userPreferenceService.ts

import { connectDB } from "@/app/lib/connectDB";
import { Frequency } from "@/app/models/enums/Frequency";
import { UserPreferences, IUserPreferences } from "@/app/models/SettingModels/UserPreferences";
import mongoose, { Types } from "mongoose";

export async function createUserPreferences(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    await connectDB();

    const userPreferences = new UserPreferences({
      userId
    });
    await userPreferences.save({ session });
    return userPreferences;
    
  } catch (error) {
    throw new Error(`Failed to create user preferences for user, ${userId}: ${error}`)
  }
}

export async function deleteUserPreferences(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    
    await connectDB();
    const deletedUserPreferences = await UserPreferences.findOneAndDelete({ userId }, { session });
    if(!deletedUserPreferences) {
      throw new Error('User has no existing user preferences');
    }
    
    return deletedUserPreferences;
    
  } catch (error) {
    throw new Error(`Failed to delete user preferences for user, ${userId}: ${error}`)
  }
}

export async function getUserPreferences(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    await connectDB();
    
    const settings = await UserPreferences.findOne({ userId });
    if(!settings) {
      throw new Error(`No user preferences exist for provided user`);
    }
    return settings;
  } catch (error) {
    throw new Error(`Failed to retrieve user preferences for user ${userId}: ${error}`);
  }
}

export async function updateUserPreferences(userId: string, updatedData: Partial<IUserPreferences>) {
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ID format');
      }

      const event = await UserPreferences.findOneAndUpdate({userId}, updatedData, { new: true });

      if (!event) {
        throw new Error('Settings not found');
      }

      return event;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', (error as Error).stack || error);

      throw new Error('Failed to connect to MongoDB');
    }
}

export async function resetUserPreferences(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    
    await connectDB();

    const defaultUserPreferences = await UserPreferences.findOneAndUpdate({userId}, {
      // TODO: Delete muted notifications from its collection and empty the references array in user preferences collection
      notifications: {
        inApp: true ,
        email: true,
        push: true,
        sms: false,
        frequency: Frequency.INSTANT
      },
    }, { new: true });

    return defaultUserPreferences;
  } catch (error) {
    throw new Error(`Failed to reset user preferences: ${error}`);
  }
}
