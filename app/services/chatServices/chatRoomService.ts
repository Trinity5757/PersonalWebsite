// app/services/chatRoomService.ts
import { ObjectId, Types } from 'mongoose';
import { connectDB } from '../../lib/connectDB';
import { ChatRoom, IChatRoom } from '../../models/MessageModels/ChatRoom';
import { Message } from '@/app/models/MessageModels/Message';
import { Participant } from '@/app/models/MessageModels/Participant';
import { createParticipant } from './participantService';




export const getAllChatRooms = async (page: number = 1, limit: number = 10) => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;
    const chatRooms = await ChatRoom.find()
      .skip(skip) // Skip records
      .limit(limit) // Limit the number of records
      .lean();
    const totalChatRooms = await ChatRoom.countDocuments();
    return {
      chatRooms,
      totalChatRooms,
      totalPages: Math.ceil(totalChatRooms / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw new Error('Failed to fetch chat rooms');
  }
}


export const createChatRoom = async (data: {
  userId: ObjectId | string;
  role: string;
  participants: string[],
  chatName?: string;
  chatIcon?: string;
 
}) => {
  try {
  
    if (!data.userId || !data.role) {
      throw new Error('Missing required fields: userId');
    }

    
    await connectDB();

   
    if (!Types.ObjectId.isValid(data.userId.toString())) {
      throw new Error('Invalid user ID format');
    }

    const userId = new Types.ObjectId(data.userId.toString());
    const participantIds = data.participants.map((id) => new Types.ObjectId(id));


    

    console.log('Creating Chat Room with:', { userId, chatName: data.chatName, chatRoomIcon: data.chatIcon, role: data.role, participants: participantIds });


    // Create a new ChatRoom
    const chatRoom = new ChatRoom({
      userId,
      chatName: data.chatName,
      chatIcon: data.chatIcon,
      role: data.role,
      participants: participantIds,
    });

    await chatRoom.save();
    console.log('Chat Room created successfully');
    return chatRoom;
  } catch (error) {
    console.error('Error creating chat room:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Failed to create chat room');
  }
};

const createChatRoomWithParticipants = async (senderId: string, participantId: string) => {
  const chatRoom = await ChatRoom.create({
    isDirectMessage: true,
    chatName: 'Direct Message',
    userId: senderId, // creator of the DM or chat
    role: 'admin',
    participants: [senderId, participantId],
  });

  await Promise.all([
    createParticipant(chatRoom.id, senderId, 'admin'),
    createParticipant(chatRoom.id, participantId, 'member'),
  ]);

  return chatRoom;
};

export const createOrFindChatRoom = async (senderId: string, participantId: string) => {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(participantId)) {
      throw new Error('Invalid ID format');
    }

    // 1. Find a chat room where both participants exist
    const existingChatRoom = await ChatRoom.findOne({
      isDirectMessage: true,
      participants: { $all: [senderId, participantId] },
    });

    if (existingChatRoom) {
      return existingChatRoom;
    }

    console.log('No existing DM found, creating new chat...');
    return await createChatRoomWithParticipants(senderId, participantId);
  } catch (error) {
    console.error('Error creating or finding direct message chat room:', error);
    throw new Error('Failed to create or find chat room');
  }
};


// Fetch chat rooms for a user
export const getChatRoomsByUser = async (userId: string) => {
    try {

      if (!userId) {
        throw new Error('User ID is required');
      }
    
      await connectDB();
    
    
      if (!Types.ObjectId.isValid(userId.toString())) {
        throw new Error('Invalid user ID format');
      }
  
    
        
    
      
      const chatRooms = await ChatRoom.find({ userId });
  
      if (chatRooms.length === 0) {
        throw new Error('No chat rooms found for the user');
      } 
        
      return chatRooms;
    } catch (error) {
      console.error("Error fetching chat rooms by user:", error);
      throw new Error("Could not fetch chat rooms.");
    }
  };
  
 
  
  export const getChatRoomById = async (id: string) => {
    try {
      await connectDB();
  
      // Validate ID format
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
  
      
      const chatRoom = await ChatRoom.findById(id);
  
      if (!chatRoom) {
        throw new Error("Chat room not found");
      }
  
      return chatRoom;
    } catch (error) {
      console.error("Error fetching chat room by ID:", error);
      throw new Error("Could not fetch chat room.");
    }
  };
  
  export const deleteChatRoomById = async (id: string) => {
    try {
     
      await connectDB();

      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }

      // Delete messages associated with the chat room
      await Message.deleteMany({ chatId: id });

      // Delete participants associated with the chat room
      await Participant.deleteMany({ chatId: id });

      const chatRoom = await ChatRoom.findOneAndDelete({ id });

      if (!chatRoom) {
        return null;
      }

      return chatRoom;
    } catch (error) {
      console.error("Error fetching chat rooms by chatId:", error);
      throw new Error("Could not fetch chat rooms.");
    }
  };


 // Update chatRoom by ID
export async function updateChatRoomById(
  id: string,
  updatedData: Partial<IChatRoom>
) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    // Update chat room details
    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
      id, 
      updatedData, { 
      new: true,
    });

    if (!updatedChatRoom) {
      throw new Error("Chat room not found");
    }

    return updatedChatRoom;
  } catch (error) {
    console.error("Error updating business or page:", error);
    throw new Error(`Failed to update business: ${error}`);
  }
}


export async function addParticipants(id: string, participants: string[]) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      throw new Error("Chat room not found");
    }

    const newParticipants = participants
    .filter((participant) => Types.ObjectId.isValid(participant))
    .map((participant) => new Types.ObjectId(participant));

    chatRoom.participants.push(...newParticipants);

    await chatRoom.save();

    return chatRoom;
  } catch (error) {
    console.error("Error adding participants to chat room:", error);
    throw new Error("Failed to add participants to chat room"); 
  }
}
