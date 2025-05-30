import { connectDB } from '@/app/lib/connectDB';
import { Types } from 'mongoose';
import { User } from '../models/Users';
import { IPage, Page } from '../models/Page';
import { createPage } from './pageService';
import { ISport, Sport } from '../models/Sport';


export const getAllSports = async (limit: number, offset: number) => {
  try {
    await connectDB();
    
    const sports = await Sport.find()
      .populate('pageId')
      .populate('createdBy', '-password')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by most recent

    return sports;
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw new Error('Failed to fetch sports');  
  }  
}

export async function createSport(
  sportName: string, 
  description: string,
  createdBy: Types.ObjectId | string,
  icon?: string,
  slug?: string
) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(createdBy)) {
      throw new Error('Invalid creator ID format');
    }

    if (!sportName || !description || !createdBy) {
      throw new Error('Sport name, description, and creator are required');
    }
    
    const user = await User.findById(createdBy).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    const newSport = new Sport({
      sportName,
      description,
      createdBy: user._id,
      icon,
      slug: slug || sportName.toLowerCase().replace(/\s+/g, '-')
    });
    
    await newSport.save();
    
    // Create page associated with the sport
    const newPage = await createPage(sportName, createdBy);
    newPage.associated_entity = newSport._id;
    newPage.type = 'sport';
    newPage.name = sportName;
    newPage.cover_picture = icon;
    await newPage.save();

    // Save reference to the page in sport
    newSport.pageId = newPage._id;
    await newSport.save();
    
    return newSport;
  } catch (error) {
    console.error('Error creating sport:', error);
    throw new Error(`Failed to create sport: ${error}`);  
  }
}

export async function getSportById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    
    const sport = await Sport.findById(id)
      .populate('pageId')
      .populate('createdBy', '-password')
      //.populate('teams')
     // .populate('events')
     // .populate('programs');

    if (!sport) {
      throw new Error('Sport not found');
    }
    
    return sport;
  } catch (error) {
    console.error('Sport not found:', error);
    throw new Error('Failed to fetch sport from database');  
  }  
}

export async function updateSportById(
  id: string,
  updatedData: Partial<ISport & { pageUpdates?: Partial<IPage> }>
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const { pageUpdates, ...sportUpdates } = updatedData;

    // Update sport details
    const sport = await Sport.findByIdAndUpdate(id, sportUpdates, { new: true });

    if (!sport) {
      throw new Error("Sport not found");
    }

    // If there are updates for the associated page, handle them
    if (pageUpdates) {
      const page = await Page.findByIdAndUpdate(
        sport.pageId, 
        pageUpdates, 
        { new: true }
      );

      if (!page) {
        throw new Error("Associated Page not found");
      }

      return { sport, page }; // Return both updated sport and page
    }

    return { sport };
  } catch (error) {
    console.error("Error updating sport or page:", error);
    throw new Error(`Failed to update sport: ${error}`);
  }
}

export async function deleteSportById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    // Find the sport first
    const sport = await Sport.findById(id);

    if (!sport) {
      throw new Error('Sport not found');
    }

    const createdBy = sport.createdBy;
    if (!createdBy) {
      throw new Error('Creator not found');
    }

    // Delete the associated page
    const pageDeletion = Page.findByIdAndDelete(sport.pageId);

    // Delete the sport
    const sportDeletion = Sport.findByIdAndDelete(id);

    // Perform concurrent deletions 
    await Promise.all([pageDeletion, sportDeletion]);

    return sport;
  } catch (error) {
    console.error('Error deleting sport and associated data:', error);
    throw new Error('Failed to delete sport and its associated page');
  }
}