// app/services/userService.ts
import { connectDB } from '@/app/lib/connectDB';
import { User } from '@/app/models/Users';
import { IUser } from '@/app/models/Users';
import { Types } from 'mongoose';
import { IPage, Page } from '../models/Page';
import { createPage } from './pageService';
import {  deleteSettings } from './settingServices/settingService';


export async function getAllUsers(page: number = 1, limit: number = 10, fieldsToSelect = "-password") {
    try {
      await connectDB();
      
      const skip = (page - 1) * limit;

      //pagination, excluding passwords
      const users = await User.find()
        .skip(skip) // Skip records
        .limit(limit) // Limit the number of records
        .select(fieldsToSelect)
        .populate('settings.privacy')
        .lean();
      
        const totalUsers = await User.countDocuments();

        return {
          users,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        };
        
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');  
    }  
  }


  export async function getUserById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      
      
      const user = await User.findById(id).select('-password'); // Exclude passwords for all users


    
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      console.error('User not found:', error);
      throw new Error('Failed to fetch user from database');  
    }  
  }


  //get user by username
  export async function getUserByUsername(uName: string) {
    try {
      await connectDB();     
      
      const user = await User.findOne({username:uName}).select('-password'); // Exclude passwords for all users
      
      

      if (!user) {
        throw new Error('User not found');
      }

     
      return user;
    } catch (error) {
      console.error('User not found:', error);
      throw new Error('Failed to fetch user from database');  
    }  
  }





  // Update user by ID
export async function updateUserById(
  id: string, 
  updatedData: Partial<IUser & { pageUpdates?: Partial<IPage>}>) {
 
 
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const { pageUpdates, ...userUpdates } = updatedData;


      const user = await User.findByIdAndUpdate(id, userUpdates, { new: true });

      if (!user) {
        throw new Error('User not found');
      }

    // Handle missing profile page
    if (!user.profilePage) {
      const newPage = await createPage(user.username, user._id); // name of the page set to username
      newPage.save();
      user.profilePage = newPage._id;
      await user.save();
    }

    // Handle updates to the profile page
    if (pageUpdates && user.profilePage) {
      const page = await Page.findByIdAndUpdate(user.profilePage, pageUpdates, { new: true });
      if (!page) {
        throw new Error('Associated Page not found');
      }

      return { user, page }; // Return both updated user and page
    }

    return { user };
    }
  catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
}

// Delete user by ID
export async function deleteUserById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new Error('User not found');
    }

    // Delete the associated profile page if it exists
    if (deletedUser.profilePage) {
      await Page.findByIdAndDelete(deletedUser.profilePage);
    }

    await deleteSettings(deletedUser._id);

    return deletedUser;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Search for users by name or username
export const searchUsers = async (
  query: string,
  options: {
    limit?: number;
    searchFields?: ('username' | 'first_name' | 'last_name')[];
    exactMatch?: boolean;
  } = {}
) => {
  try {
    const {
      limit = 10,
      searchFields = ['username', 'first_name'],
      exactMatch = false
    } = options;

    if (!query) {
      return [];
    }

    // Create search conditions based on specified fields
    const searchPattern = exactMatch ? 
      `^${query}$` : // Exact match
      `^${query}`; // Prefix match

    const regex = new RegExp(searchPattern, 'i');

    const searchConditions = searchFields.map(field => ({
      [field]: { $regex: regex }
    }));

    const users = await User.find({ $or: searchConditions })
      .select('-password -settings -email')
      .limit(limit)
      .lean();

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
};



/// set up for use in test cases

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addLocationToUser(userId: string, locationData: any) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the locations field exists before adding the location 
  if (!user.locations) {
    user.locations = [];
  }

  // Add the location to the user's locations array
 user.locations.push(locationData);

  await user.save();
  
  return user;
}