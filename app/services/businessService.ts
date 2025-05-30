// app/services/postService.ts

import { connectDB } from '@/app/lib/connectDB';
import { Types } from 'mongoose';
import { Business, IBusiness } from '../models/Business';
import { User } from '../models/Users';
import { IPage, Page } from '../models/Page';
import { createPage } from './pageService';

interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  businesses: any[];
  totalBusinesses: number;
  totalPages: number;
  currentPage: number;
}

export const getAllBusinesses = async (limit: number, offset: number) => {
  try {
    // to do populate the owner
      await connectDB();
      
      const businesses = await Business.find().populate('pageId') 
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 }).lean();
       // Sort by most recent

      return businesses;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch buisinesses');  
    }  
  }


  export async function createBusiness(
    businessName: string,
    owner: Types.ObjectId | string,
    cover_picture?: string,
    profilePicture?: string,
    tags?: string[],
    category?: string,
    address?: string,
    website?: string,
    phone?: string,
    email?: string
    ) {

    try {
      await connectDB();

     
      
      if (!businessName  || !owner ) {
        throw new Error('buisinessName, contactEmail and owner are required');
      }
      
      const user = await User.findById(owner); // Exclude passwords for all users

      if (!user) {
        throw new Error('User not found');
      }

      const contactEmail = email === undefined || email === "" ? user.email : email;

      const newBusiness = new Business({
        businessName,
        contactEmail,
        owner: user._id,
        category,
        address,
        website,
        phone,
        tags,
        cover_picture,
        profilePicture
      });
      
      await newBusiness.save();
      
      // Create page associated with the business
      const newPage = await createPage(businessName, owner);
      newPage.associated_entity = newBusiness._id;
      newPage.type = 'business';
      newPage.name = businessName;
      newPage.cover_picture = cover_picture;
      newPage.profilePicture = profilePicture;
      await newPage.save();

      // Save reference to the page in business’s page array
      newBusiness.pageId = newPage._id;
      await newBusiness.save();
      

      
      // atomic update for user to avoid version conflicts
      await User.findByIdAndUpdate(user._id, { $set: { businesses: user.businesses } });

      
      
      return newBusiness;
    }  catch (error) {
      console.error('Error creating business:', error);
      throw new Error(`Failed to create Business: ${error}`);  
    }
  }


  export async function getBusinessById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      
      const business = await Business.findById(id).populate('pageId');

      if (!business) {
        throw new Error('Buisiness not found');
      }
      
      return business;
    } catch (error) {
      console.error('Buisiness not found:', error);
      throw new Error('Failed to fetch post from database');  
    }  
  }


  // Update business by ID
// Update business by ID, including associated Page
export async function updateBusinessById(
  id: string,
  updatedData: Partial<IBusiness & { pageUpdates?: Partial<IPage> }>
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const { pageUpdates, ...businessUpdates } = updatedData;

    // Update business details
    const business = await Business.findByIdAndUpdate(id, businessUpdates, { new: true });

    if (!business) {
      throw new Error("Business not found");
    }

    // If there are updates for the associated page, handle them
    if (pageUpdates) {
      const page = await Page.findByIdAndUpdate(
        business.pageId, pageUpdates, 
        { new: true }
      );

      if (!page) {
        throw new Error("Associated Page not found");
      }

      return { business, page }; // Return both updated business and page
    }

    return { business };
  } catch (error) {
    console.error("Error updating business or page:", error);
    throw new Error(`Failed to update business: ${error}`);
  }
}

// Delete business by ID
export async function deleteBusinessById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    // Find the business first
    const business = await Business.findById(id);

    if (!business) {
      throw new Error('Business not found');
    }

    const owner = business.owner;
    if (!owner) {
      throw new Error('Owner not found');
    }

    // Delete the associated page
    const pageDeletion = Page.findByIdAndDelete(business.pageId);

    // Delete the business
    const businessDeletion = Business.findByIdAndDelete(id);

    // Remove business ID from the user's businesses array
    const userUpdate = User.updateOne(
      { _id: business.owner },
      { $pull: { businesses: business._id } }
    );

    //  concurrent deletions and updates 
    await Promise.all([pageDeletion, businessDeletion, userUpdate]);

    return business;
  } catch (error) {
    console.error('Error deleting business and associated data:', error);
    throw new Error('Failed to delete business and its associated page');
  }
}

export const searchBusinesses = async (
  searchTypes: string[], // search types ex: businessName, category, tags
  query: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    // Build the query based on types
    const filters = [];

    if (searchTypes.includes('tags')) {
      const tagsQuery = query.split(',').map(tag => ({
        tags: { $regex: new RegExp(tag.trim(), 'i') }
      }));
      filters.push({ $or: tagsQuery });
    }

    if (searchTypes.includes('businessName')) {
      filters.push({ businessName: { $regex: new RegExp(query, 'i') } });
    }

    if (searchTypes.includes('category')) {
      filters.push({ category: { $regex: new RegExp(query, 'i') } });
    }

    // Final query based on the filters
    const queryObject = filters.length > 0 ? { $or: filters } : {};

    const totalBusinesses = await Business.countDocuments(queryObject);
    const businesses = await Business.find(queryObject)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('pageId')
      .lean();

    return {
      businesses,
      totalBusinesses,
      totalPages: Math.ceil(totalBusinesses / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw new Error('Failed to search businesses');
  }
};

export const searchBusinessesByTags = async (
  tags: string[],
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    const tagQuery = tags.map(tag => ({
      tags: { $regex: new RegExp(tag, 'i') }
    }));

    const query = { $or: tagQuery };

    const totalBusinesses = await Business.countDocuments(query);

    const businesses = await Business.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('pageId')
      .lean();

    return {
      businesses,
      totalBusinesses,
      totalPages: Math.ceil(totalBusinesses / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching businesses by tags:', error);
    throw new Error('Failed to search businesses by tags');
  }
};

export const searchBusinessesByCategory = async (
  category: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    const query = {
      category: { $regex: new RegExp(category, 'i') }
    };

    const totalBusinesses = await Business.countDocuments(query);

    const businesses = await Business.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('pageId')
      .lean();

    return {
      businesses,
      totalBusinesses,
      totalPages: Math.ceil(totalBusinesses / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching businesses by category:', error);
    throw new Error('Failed to search businesses by category');
  }
};

export const searchBusinessesByName = async (
  businessName: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    const query = {
      businessName: { $regex: new RegExp(businessName, 'i') }
    };

    const totalBusinesses = await Business.countDocuments(query);

    const businesses = await Business.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('pageId')
      .lean();

    return {
      businesses,
      totalBusinesses,
      totalPages: Math.ceil(totalBusinesses / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching businesses by name:', error);
    throw new Error('Failed to search businesses by name');
  }
};
