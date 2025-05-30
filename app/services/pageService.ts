// app/services/pageService.ts

import { Types } from 'mongoose';


import { User } from '../models/Users';
import { IPage, Page } from '../models/Page';




export const getAllPages = async (limit: number, offset: number) => {
  try {


    const pages = await Page.find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    // Sort by most recent

    return pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw new Error('Failed to fetch pages');
  }
}


export async function createPage(name: string, owner: Types.ObjectId | string) {
  try {
    // await connectDB(); // Ensure DB connection

    if (!name || !owner) {
      throw new Error('Page name and owner are required');
    }

    if (!Types.ObjectId.isValid(owner)) {
      throw new Error('Invalid owner ID format');
    }

    const user = await User.findById(owner).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    // Ensure pages array exists on user
    if (!Array.isArray(user.pages)) {
      user.pages = [];
    }

    const newPage = new Page({
      name,
      owner,
    });

    const savedPage = await newPage.save();
    if (!savedPage) {
      throw new Error('Failed to create page in database');
    }

    // Add the page ID to the user's pages
    user.pages.push(savedPage._id);
    await user.save();

    return savedPage;
  } catch (error) {
    console.error('Error creating page:', error);
    throw new Error(`Failed to create page: ${error}`);
  }
}



export async function getPageById(id: string) {
  try {

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const page = await Page.findById(id);

    if (!page) {
      throw new Error('Page not found');
    }

    return page;
  } catch (error) {
    console.error('Page not found:', error);
    throw new Error('Failed to fetch page from database');
  }
}


// Update {Page} by ID
export async function updatePageById(id: string, updatedData: Partial<IPage>) {


  try {

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const page = await Page.findByIdAndUpdate(id, updatedData, { new: true });

    if (!page) {
      throw new Error('Page not found');
    }

    return page;
  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Delete Page by ID
export async function deletePageById(id: string) {
  try {

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const page = await Page.findByIdAndDelete(id);

    if (!page) {
      throw new Error('Page not found');
    }

    const user = await User.findById(page.owner).select('-password'); // Exclude passwords for all users

    if (!user) {
      throw new Error('User not found');
    }

    // Remove page ID from the user pages 
    await User.findOneAndUpdate(
      { _id: page.owner },
      { $pull: { pages: page._id } }
    );


    return page;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}