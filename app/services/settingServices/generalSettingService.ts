//app/services/settingServices/settingService.ts

import mongoose, { Types } from "mongoose";
import { connectDB } from "../../lib/connectDB";
import { GeneralSettings, IGeneralSettings } from "../../models/SettingModels/GeneralSettings";

export async function createGeneralSettings(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const generalSettings = new GeneralSettings({
      userId,
    });
    await generalSettings.save({ session });
    return generalSettings;

  } catch (error) {
    throw new Error(`Failed to create general settings for user, ${userId}: ${error}`);
  }
}

// (ONLY TO BE USED WHEN DELETING A USER)
export async function deleteGeneralSettings(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const deletedGeneralSettings = await GeneralSettings.findOneAndDelete({ userId }, { session });
    if(!deletedGeneralSettings) {
      throw new Error('User has no existing general settings');
    }
    return deletedGeneralSettings;
  } catch (error) {
    throw new Error(`Failed to delete general settings for user, ${userId}: ${error}`);
  }
}

export async function getGeneralSettings(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    await connectDB();

    const generalSettings = await GeneralSettings.findOne({ userId });
    if(!generalSettings) {
      throw new Error('No general settings exist for provided user');
    }
    return generalSettings;
  } catch (error) {
    throw new Error(`Failed to retrieve general settings for user, ${userId}: ${error}`);
  }
}

export async function resetGeneralSettings(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    await connectDB();

    const defaultGeneralSettings = await GeneralSettings.findOneAndUpdate({userId}, {
      marketplace: false,
      darkMode: false,
    }, { new: true})
    return defaultGeneralSettings;
  } catch (error) {
    throw new Error(`Failed to reset general settings for user, ${userId}: ${error}`);
  }
}


export async function updateGeneralSettings(userId: string, updatedData: Partial<IGeneralSettings>) {
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ID format');
      }

      const setting = await GeneralSettings.findOneAndUpdate({userId}, updatedData, { new: true });

      if (!setting) {
        throw new Error('Settings not found');
      }

      return setting;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', (error as Error).stack || error);
      throw new Error('Failed to connect to MongoDB');
    }
}
