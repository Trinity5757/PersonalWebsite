// app/services/eventService.ts
import { connectDB } from '@/app/lib/connectDB';
import { Event } from '@/app/models/Event';
import { IEvent } from '@/app/models/Event';
import { Types } from 'mongoose';
import {createPage} from '@/app/services/pageService'
import { Page } from '@/app/models/Page';
import { User } from '@/app/models/Users';

export async function createEvent(title: string, description: string, location: string,  startDate:Date,
    endDate: Date, organizer: Types.ObjectId | string, organizerType: "Admin"|"buisness"|"team", category:string,
    capacity:number) {
  try {
    await connectDB();    
    if (!organizer) {
      throw new Error('Invalid ID format');
    }
    
    const user = await User.findById(organizer).select('-password'); // Exclude passwords for all users

    if (!user) {
      throw new Error('user not found');
    }

    // create page with name and owner
    const newPage = await createPage(title, organizer);

    const newEvent = new Event({
        pageId:newPage._id,
        title,
        description,
        location,
        startDate,
        endDate,
        organizer:user._id,
        organizerType,
        category,
        capacity
    });
       
    await newEvent.save();

    return newEvent;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to create event');  
  }  
}

export async function getAllEvents() {
    try {
      await connectDB();
      
      const events = await Event.find();
      return events
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');  
    }  
  }


  export async function getEventById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      
      const event = await Event.findById(id);

      if (!event) {
        throw new Error('event not found');
      }
      
      return event;
    } catch (error) {
      console.error('event not found:', error);
      throw new Error('Failed to fetch event from database');  
    }  
  }


  // Update event by ID
export async function updateEventById(id: string, updatedData: Partial<IEvent>) {
 
 
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const event = await Event.findByIdAndUpdate(id, updatedData, { new: true });

      if (!event) {
        throw new Error('event not found');
      }

      return event;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', error.stack || error);
      throw new Error('Failed to connect to MongoDB');
    }
}

// Delete event by ID
export async function deleteEventById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    // Find the event first
    const event = await Event.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    const owner = event.owner;
    if (!owner) {
      throw new Error('Owner not found');
    }

    // Delete the associated page
    const pageDeletion = Page.findByIdAndDelete(event.pageId);

    // Delete the tean
    const eventDeletion = event.findByIdAndDelete(id);

    // Remove event ID from the event's businesses array
    const eventUpdate = event.updateOne(
      { _id: event.owner },
      { $pull: { events: event._id } }
    );

    //  concurrent deletions and updates 
    await Promise.all([pageDeletion, eventDeletion, eventUpdate]);

    return event;
  } catch (error) {
    console.error('Error deleting event and associated data:', error);
    throw new Error('Failed to delete event and its associated page');
  }
}