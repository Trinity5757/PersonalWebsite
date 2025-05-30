// app/services/settingServices/settingService.ts
import { startSession, Types } from "mongoose";
import { connectDB } from "../../lib/connectDB";
import { getUserById } from "../userService";
import { createUserPreferences, deleteUserPreferences, resetUserPreferences, getUserPreferences, updateUserPreferences } from "./userPreferenceService";
import { createPrivacySettings, deletePrivacySettings, resetPrivacySettings,getPrivacySettings,updatePrivacySettings } from "./privacySettingService";
import { createGeneralSettings, deleteGeneralSettings, resetGeneralSettings, getGeneralSettings, updateGeneralSettings } from "./generalSettingService";
import { IGeneralSettings } from "@/app/models/SettingModels/GeneralSettings";
import { IUserPreferences } from "@/app/models/SettingModels/UserPreferences";
import { IPrivacySettings } from "@/app/models/SettingModels/PrivacySettings";


export async function createSettings(userId: string) {
  const session = await startSession();
  session.startTransaction();

  try {
    const user = await getUserById(userId);

    await connectDB();

    const generalSettings = await createGeneralSettings(user._id, session);
    user.settings.general = generalSettings._id;

    const privacySettings = await createPrivacySettings(user._id, session);
    user.settings.privacy = privacySettings._id;

    const userPreferences = await createUserPreferences(user._id, session);
    user.settings.userPreferences = userPreferences._id;
    
    await user.save({ session });

    await session.commitTransaction();
    return { generalSettings, privacySettings, userPreferences };

  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Failed to create settings for user, ${userId}: ${error}`);
  } finally {
    session.endSession();
  }
}

export async function deleteSettings(userId: string) {
  const session = await startSession();
  session.startTransaction();

  try {
    const deletedGeneralSettings = await deleteGeneralSettings(userId, session);
    const deletedPrivacySettings = await deletePrivacySettings(userId, session)
    const deletedUserPreferences = await deleteUserPreferences(userId, session);
    
    await session.commitTransaction();

    return { deletedGeneralSettings, deletedPrivacySettings, deletedUserPreferences };
  } catch (error) {
    session.abortTransaction();
    throw new Error(`Failed to delete user settings, ${error}`);
  } finally {
    session.endSession();
  }
}

export async function getSettings(userId: string) {
  try {
    await connectDB();
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // if the settings field is missing, or eithier of its subfields are missing, create new settings
    if(!user.settings || !user.settings.general || !user.settings.privacy || !user.settings.userPreferences) {
      console.log("No settings for existing user - creating settings...");
      return await createSettings(userId);
    }
    // then retrieve the settings
    const generalSettings = await getGeneralSettings(userId);
    const privacySettings = await getPrivacySettings(userId);
    const userPreferences = await getUserPreferences(userId);

    if(!generalSettings || !privacySettings ||!userPreferences) {
      //console.log(`Settings not found for user ${userId}. Creating new settings.`);
      throw new Error(`No settings exist for the provided user`);
      //return await createSettings(userId);
    }

    return { generalSettings, privacySettings, userPreferences};
  } catch (error) {
    throw new Error(`Failed to retrieve settings for user, ${userId}: ${error}`);
  }
}

export async function resetAllSettings(userId: string) {
  try {
    
    const defaultGeneralSettings = await resetGeneralSettings(userId);
    const defaultPrivacySettings = await resetPrivacySettings(userId);
    const defaultUserPreferences = await resetUserPreferences(userId);
  
    return { defaultGeneralSettings, defaultPrivacySettings, defaultUserPreferences };
    
  } catch (error) {
    throw new Error(`Failed to reset user settings: ${error}`);
  }
}

export async function updateSettings(userId: string, settingType:number ,updatedData: Partial<Document>){
try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ID format');
      }

      let settings;
      
      switch(settingType){
        case 0:
          settings = await updateGeneralSettings(userId, updatedData as Partial<IGeneralSettings>)
          break;

        case 1:
          settings = await updateUserPreferences(userId, updatedData as Partial<IUserPreferences>)
          break; 

        case 2:
          settings = await updatePrivacySettings(userId, updatedData as Partial<IPrivacySettings>)
          break;

        default:
          throw new Error("Incorrect Setting type.")

      } 


      return settings;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }

}
