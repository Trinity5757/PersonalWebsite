// app/services/likeService.ts

import { connectDB } from "../lib/connectDB";
import { Types } from 'mongoose';
import { LikeType } from "../models/enums/LikeType";
import { Like } from "../models/Like";
import { getUserById } from "./userService";
import { User } from "../models/Users";
import { Post } from "../models/post";

// Get list of users that liked a given post, comment, reply, etc, 
export async function getObjectLikes(associatedId: string, type: LikeType, fieldsToPopulate = '_id username avatar_image') {
  try {
    await connectDB();

    // Verify that the type is a valid LikeType
    if (!Object.values(LikeType).includes(type)) {
      throw new Error(`Object of type ${type} is invalid. It contains no like data`);
    }

    if (!Types.ObjectId.isValid(associatedId)) {
      throw new Error(`Invalid ${type} ID format`);
    }

    const likes = await Like.find({ associatedId: associatedId, type: type }).populate({ path: 'userId', select: fieldsToPopulate }); // Finds like and makes a join to get user info

    if (!likes) {
      throw new Error(`The provided ${type} has no likes`);
    }

    return likes;

  } catch (error) {
    console.error(`Error fetching likes for ${type}`, error);
    throw new Error(`Failed to fetch likes for ${type}: ${error}`);
  }
}

// Get specific like from an object (post/comment/user) 
export async function getLike(userId: string, type: LikeType, associatedId: string) {
  try {
    await connectDB();

    // Verify that the type is a valid LikeType
    if (!Object.values(LikeType).includes(type)) {
      throw new Error(`Object of type ${type} is invalid. It contains no like data`);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format`);
    }

    if (!Types.ObjectId.isValid(associatedId)) {
      throw new Error(`Invalid ${type} ID format`);
    }

    const like = await Like.findOne({ userId: userId, associatedId: associatedId, type: type });

    return like;
  } catch (error) {
    console.error(`Error fetching like`, error);
    throw new Error(`Failed to fetch like for ${type}: \n${error}`);
  }
}

// Returns a list of likes a particular user has made (Ex: comments, posts)
export async function getUsersLikes(userId: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format`);
    }

    await getUserById(userId); 

    const likes = await Like.find({ userId: userId });

    if (likes.length <= 0) {
      throw new Error('This user has no likes');
    }

    return likes;
  } catch (error) {
    console.error('Error fetching users likes', error);
    throw error;
  }
}

// Returns a list of particular likes a certain user has made (Ex: only liked comments, only liked posts)
export async function getUsersLikesByType(userId: string, type: LikeType) {
  try {
    await connectDB();

    // Verify that the type is a valid LikeType
    if (!Object.values(LikeType).includes(type)) {
      throw new Error(`Object of type ${type} is invalid. It contains no like data`);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid user ID format`);
    }

    const user = await getUserById(userId); // verify user exists
    if (!user) {
      throw new Error('User not found');
    }

    const likes = await Like.find({ userId: userId, type: type });
    
    return likes;
  } catch (error) {
    console.error('Error fetching users likes', error);
    throw new Error(`Failed to fetch users likes: \n${error}`);
  }
}

// Like a given post, comment, reply, etc.
export async function createLike(userId: string, associatedId: string, type: LikeType) {
  try {
    await connectDB();

    // Verify that the type is a valid LikeType
    if (!Object.values(LikeType).includes(type)) {
      throw new Error(`Object of type ${type} is invalid. It cannot be liked`);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    if (!Types.ObjectId.isValid(associatedId)) {
      throw new Error(`Invalid ${type} ID format`);
    }

    // since we have a unique index on type and userId and associatedId, check if the combination already exists
    // create a new like if it doesn't or update it if it does
    const newLike = await Like.findOneAndUpdate(
      { userId: userId, associatedId: associatedId, type: type },
      { $setOnInsert: { userId: userId, associatedId: associatedId, type: type } },
      { upsert: true, new: true }
    ).populate({ path: 'userId', select: '_id username avatar_image' });


    // Add the like to the associated object
    if (type === LikeType.POST) {
      await Post.findByIdAndUpdate(
        associatedId,
        {
          $addToSet: { likes: newLike._id }, // Add the newLike to the post's likes array
        },
        { new: true } // we want to return and work with the updated post
      );
      console.log("Post likes updated");
    }


    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { likes: newLike._id }, // Add the newLike to the user's likes array
      },
      { new: true }
    );

    return newLike;

  } catch (error) {
    console.error(`Error creating a like for ${type}:`, error);
    throw error;
  }
}

// Unlike a given post, comment, reply, etc.
export async function deleteLike(userId: string, associatedId: string, type: LikeType) {
  try {
    await connectDB();

    if (!Object.values(LikeType).includes(type)) {
      throw new Error(`There is no object of type ${type}`);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    if (!Types.ObjectId.isValid(associatedId)) {
      throw new Error(`Invalid ${type} ID format`);
    }

    // Verify user exists
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }


    const like = await Like.findOne({ userId, associatedId, type });
    if (!like) {
      throw new Error(`The provided user has not liked the provided ${type}`);
    }

    // Use findOneAndDelete to remove the like atomically
    const deletedLike = await Like.findOneAndDelete({ userId, associatedId, type });

    if (!deletedLike) {
      throw new Error('Failed to delete like');
    }


    // Atomically update the associated Post or other entities
    if (type === LikeType.POST) {
      const postUpdate = await Post.findByIdAndUpdate(
        associatedId,
        { $pull: { likes: deletedLike._id } }, // Remove the like from the Post's likes array
        { new: true } // return the updated post
      );
      if (!postUpdate) {
        throw new Error('Failed to update the post');
      }
      console.log('Post likes updated successfully');
    }

    // Atomically update the User
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { $pull: { likes: deletedLike._id } },
      { new: true } // return the updated user
    );
    if (!userUpdate) {
      throw new Error('Failed to update the user');
    }
    console.log('User likes updated successfully');



    return deletedLike;
  } catch (error) {
    console.error('Error deleting users like:', error);
    throw error;
  }
}
