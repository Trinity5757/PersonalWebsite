//app/services/settingServices/privacySettingService.ts

import { connectDB } from "@/app/lib/connectDB";
import { Block } from "@/app/models/Block";
import { Visibility } from "@/app/models/enums/Visibility";
import { PrivacySettings,IPrivacySettings } from "@/app/models/SettingModels/PrivacySettings";
import mongoose, { Types } from "mongoose";

export async function createPrivacySettings(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format`);
    }

    await connectDB();

    const privacySettings = new PrivacySettings({
      userId
    });
    await privacySettings.save({ session });
    return privacySettings;

  } catch (error) {
    throw new Error(`Failed to create privacy settings for user, ${userId}: ${error}`);
  }
}

export async function deletePrivacySettings(userId: string, session: mongoose.ClientSession) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    
    await connectDB();
    
    const deletedPrivacySettings = await PrivacySettings.findOneAndDelete({ userId }, { session });
    if(!deletedPrivacySettings) {
      throw new Error('User has no existing privacy settings');
    }
    
    return deletedPrivacySettings;
    
  } catch (error) {
    throw new Error(`Failed to delete user preferences for user, ${userId}: ${error}`)
  }
}

export async function getPrivacySettings(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    await connectDB();

    // sync indexes since Block collection is used in privacy settings
    Block.syncIndexes();
    
    const privacySettings = await PrivacySettings.findOne({ userId }).populate({
      path: 'blockList',
      populate: [
        { path: 'blockedMember', model: 'User', select: 'username avatar_image' }
      ],
    });
    if(!privacySettings) {
      throw new Error(`No privacy settings exist for provided user`);
    }
    return privacySettings;
  } catch (error) {
    throw new Error(`Failed to retrieve privacy settings for user ${userId}: ${error}`);
  }
}

export async function updatePrivacySettings(userId: string, updatedData: Partial<IPrivacySettings>) {
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ID format');
      }

      const event = await PrivacySettings.findOneAndUpdate({userId}, updatedData, { new: true });

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


// Utility function
export async function resetPrivacySettings(userId: string) {
  try {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    await connectDB();

    const defaultPrivacySettings = await PrivacySettings.findOneAndUpdate({userId}, {
      canBeFollowed: true,
      requireFriendRequests: true,

      // TODO: Remove users corresponding block members from blocked collection and clear blocked references array

      onlineVisibility: Visibility.PUBLIC,
      locationVisibility: Visibility.PRIVATE,
      pageVisibility: Visibility.PUBLIC,
      postVisibility: Visibility.PUBLIC,
      friendVisibility: Visibility.PRIVATE,
      followingVisibility: Visibility.FRIENDS,
    }, { new: true })

    return defaultPrivacySettings;
  } catch (error) {
    throw new Error(`Failed to reset privacy settings for user, ${userId}: ${error}`);
  }
}
