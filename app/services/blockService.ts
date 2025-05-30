import { startSession, Types } from "mongoose";
import { connectDB } from "../lib/connectDB";
import { User } from "../models/Users";
import { Block } from "../models/Block";
import { PrivacySettings } from "../models/SettingModels/PrivacySettings";


export async function verifyIfBlockExists(currentUser: string, userToView: string) {
  try {
    await connectDB();

    // Verify the ID formats a valid
    if(!Types.ObjectId.isValid(currentUser) || !Types.ObjectId.isValid(userToView)) {
      throw new Error('Invalid user ID format');
    }

    // Verify that the users exist
    const currentUserExists = await User.findById(currentUser);
    if(!currentUserExists) {
      throw new Error(`There is no existing user with ID: ${currentUser}`);
    }

    const userToViewExists = await User.findById(userToView);
    if(!userToViewExists) {
      throw new Error(`The is no matching ID, ${userToView}, for the user to be blocked`);
    }

    const blockEntity = await Block.findOne({ userId: userToView, blockedMember: currentUser})

    if(!blockEntity) {
      return false;
    }

    return true;
  } catch (error) {
    throw new Error(`Failed to verify if user ${currentUser} has been blocked by user ${userToView}: \n${error}`);
  }
}

// Get list of users that have blocked current user
export async function getUsersWhoBlocked(userId: string) {
  try {
    await connectDB();

    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const whoBlockedMe = await Block.find({ blockedMember: userId });

    return whoBlockedMe;

  } catch (error) {
    throw new Error(`Failed to get list of users that have blocked current user: ${userId}: \n${error}`);
  }
}

// Get list of blocked users for current user
export async function getBlockedUsers(userId: string) {
  try {
    await connectDB();

    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const blockedUsers = await Block.find({ userId }).populate({ path: 'blockedMember', select: 'username avatar_image'});

    return blockedUsers;
    
  } catch (error) {
    throw new Error(`Failed to fetch list of blocked users for ${userId}: \n${error}`);
  }
}

export async function blockUser(userId: string, userToBlock: string) {
  await connectDB();

  const session = await startSession();
  session.startTransaction();

  try {
    // Verify the ID formats a valid
    if(!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(userToBlock)) {
      throw new Error('Invalid user ID format');
    }

    // Verify that the users exist
    const userExists = await User.findById(userId);
    if(!userExists) {
      throw new Error(`There is no existing user with ID: ${userId}`);
    }

    const userToBlockExists = await User.findById(userToBlock);
    if(!userToBlockExists) {
      throw new Error(`The is no matching ID, ${userToBlock}, for the user to be blocked`);
    }

    // Create the block entity and store it in the database
    const blocked = new Block({
      userId,
      blockedMember: userToBlock
    });

    await blocked.save({ session });

    const addBlockToPrivacyBlockList = await PrivacySettings.updateOne(
      { userId: userId },
      { $addToSet: { blockList: blocked._id } },
      { session }
    );

    if(!addBlockToPrivacyBlockList) {
      throw new Error('Failed to add new block entity reference ID to block list in privacy settings');
    }

    await session.commitTransaction();
    await blocked.populate({ path: 'blockedMember', select: 'username avatar_image'});
    return blocked;

  } catch (error) {
    await session.abortTransaction();
    // throw new Error(`Failed to block user: \n${error}`);
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function removeBlockedUser(userId: string, blockedMember: string) {
  await connectDB();
  const session = await startSession();
  session.startTransaction();

  try {
    // Verify the ID formats a valid
    if(!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(blockedMember)) {
      throw new Error('Invalid user ID format');
    }

    // Verify that the users exist
    const userExists = await User.findById(userId);
    if(!userExists) {
      throw new Error(`There is no existing user with ID: ${userId}`);
    }

    const blockedUserExists = await User.findById(blockedMember);
    if(!blockedUserExists) {
      throw new Error(`The is no matching ID, ${blockedMember}, for the user to be blocked`);
    }

    const deletedBlockEntity = await Block.findOneAndDelete({ userId: userId, blockedMember: blockedMember }, { session });
    if(!deletedBlockEntity) {
      throw new Error(`Failed to remover blocked member: ${blockedMember}, from users blocked list`);
    }

    const deletedBlockReference = await PrivacySettings.updateOne(
      { userId: userId },
      { $pull: { blockList: deletedBlockEntity._id} },
      { session }
    )
    if(!deletedBlockReference) {
      throw new Error('Failed to delete block reference ID from privacy settings');
    }

    await session.commitTransaction();
    return deletedBlockEntity;

  } catch (error) {
    await session.abortTransaction();
    throw new Error(`Failed to remove blocked user from list: \n${error}`);
  } finally {
    await session.endSession();
  }
}