// app/services/teamService.ts

import { connectDB } from '@/app/lib/connectDB';
import { Types } from 'mongoose';
import { User } from '../models/Users';
import { IPage, Page } from '../models/Page';
import { createPage } from './pageService';
import { ITeam, Team } from '../models/Team';


export const getAllTeams = async (limit: number, offset: number) => {
  try {
      await connectDB();
      
      const teams = await Team.find().populate('pageId') 
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
       // Sort by most recent

      return teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams');  
    }  
  }


  export async function createTeam(
    name: string, 
    sportType: string, 
    owner: Types.ObjectId | string,
    cover_picture?: string,
    profilePicture?: string
  ) {

    try {
      await connectDB();

     
      
      if(!Types.ObjectId.isValid(owner)) {
        throw new Error('Invalid owner ID format');
      }

      if (!name || !sportType || !owner) {
        throw new Error('Team name, sportType and owner are required');
      }
      
      const user = await User.findById(owner).select('-password'); // Exclude passwords for all users

      if (!user) {
        throw new Error('User not found');
      }

      const newTeam = new Team({
        name,
        sportType,
        owner: user._id,
      });
      
      await newTeam.save();
      
      // Create page associated with the team
      const newPage = await createPage(name, owner);
      newPage.associated_entity = newTeam._id;
      newPage.type = 'team';
      newPage.name = name;
      newPage.cover_picture = cover_picture;
      newPage.profilePicture = profilePicture;
      await newPage.save();

      // Save reference to the page in business’s page array
      newTeam.pageId = newPage._id;
      await newTeam .save();
      
      // Save reference to the page in user’s teams array with atomic update
      await User.findByIdAndUpdate(user._id, { $set: { teams: user.teams } });
      
      
      return newTeam;
    }  catch (error) {
      console.error('Error creating team:', error);
      throw new Error(`Failed to create team: ${error}`);  
    }
  }


  export async function getTeamById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      
      const team = await Team.findById(id).populate('pageId');

      if (!team) {
        throw new Error('Team not found');
      }
      
      return team;
    } catch (error) {
      console.error('Team not found:', error);
      throw new Error('Failed to fetch team from database');  
    }  
  }

  export async function getTeamBySlug(slug: string) {
    try {
      await connectDB();
      
     
      const team = await Team.findOne({ name: slug }).populate('pageId');

      if (!team) {
        throw new Error('Team not found');
      }
      
      return team;
    } catch (error) {
      console.error('Team not found:', error);
      throw new Error('Failed to fetch team from database');  
    }  
  }



  // Update team by ID
// Update team by ID, including associated Page
export async function updateTeamById(
  id: string,
  updatedData: Partial<ITeam & { pageUpdates?: Partial<IPage> }>
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const { pageUpdates, ...teamUpdates } = updatedData;

    // Update team details
    const team = await Team.findByIdAndUpdate(id, teamUpdates, { new: true });

    if (!team) {
      throw new Error("Team not found");
    }

    // If there are updates for the associated page, handle them
    if (pageUpdates) {
      const page = await Page.findByIdAndUpdate(
        team.pageId, pageUpdates, 
        { new: true }
      );

      if (!page) {
        throw new Error("Associated Page not found");
      }

      return { team, page }; // Return both updated team and page
    }

    return { team };
  } catch (error) {
    console.error("Error updating team or page:", error);
    throw new Error(`Failed to update team: ${error}`);
  }
}

// Delete team by ID
export async function deleteTeamById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    // Find the team first
    const team = await Team.findById(id);

    if (!team) {
      throw new Error('Team not found');
    }

    const owner = team.owner;
    if (!owner) {
      throw new Error('Owner not found');
    }

    // Delete the associated page
    const pageDeletion = Page.findByIdAndDelete(team.pageId);

    // Delete the team
    const teamDeletion = Team.findByIdAndDelete(id);

    // Remove team ID from the user's teams array
    const userUpdate = User.updateOne(
      { _id: team.owner },
      { $pull: { teams: team._id } }
    );

    //  concurrent deletions and updates 
    await Promise.all([pageDeletion, teamDeletion, userUpdate]);

    return team;
  } catch (error) {
    console.error('Error deleting team and associated data:', error);
    throw new Error('Failed to delete team and its associated page');
  }
}
