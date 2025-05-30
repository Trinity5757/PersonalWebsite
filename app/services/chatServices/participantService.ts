import { connectDB } from "@/app/lib/connectDB";
import { ChatRoom } from "@/app/models/MessageModels/ChatRoom";
import { IParticipant, Participant } from "@/app/models/MessageModels/Participant";
import { Types } from "mongoose";



// get all participants with pagination

export async function getAllParticipants(page: number = 1, limit: number = 10) {
    try {
      await connectDB();
      
      const skip = (page - 1) * limit;

      //pagination, excluding passwords
      const participants = await Participant.find()
        .skip(skip) // Skip records
        .limit(limit) // Limit the number of records
        .select('-password')
        .lean();
      
        const totalParticipants = await Participant.countDocuments();

        return {
          participants,
          totalParticipants,
          totalPages: Math.ceil(totalParticipants / limit),
          currentPage: page,
        };
        
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw new Error('Failed to fetch participants');  
    }  
  }

// create single participant and assign it to the chat room
export const createParticipant = async(chatId: string, userId: string, role: string) => {
    // Check if the chat room exists
    const chatRoom = await ChatRoom.findById(chatId);
    if (!chatRoom) {
        throw new Error("Chat room not found");
    }

    // Create participant
    const participant = new Participant({
        chatId, // assign to the chatId of the chat room
        userId,
        role,
    });

    // Save participant
    try {
        const participantSaved = await participant.save();
        console.log("Participant created successfully");

        return participantSaved;
    } catch (error) {
        console.error("Error creating participant:", error);
    }
}



export async function getParticipantById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      
      const participant = await Participant.findById(id).select('-password'); // Exclude passwords for all users

      if (!participant) {
        throw new Error('Participant not found');
      }
      
      return participant;
    } catch (error) {
      console.error('Participant not found:', error);
      throw new Error('Failed to fetch user from database');  
    }  
  }




  // Update participant by ID or username
export async function updateParticipantById(id: string, updatedData: Partial<IParticipant>) {
 
 
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const participant = await Participant.findByIdAndUpdate(id, updatedData, { new: true });

      if (!participant) {
        throw new Error('Participant not found');
      }

      return participant;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
}

// Delete participant by ID
export async function deleteParticipantById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const deletedParticipant = await Participant.findByIdAndDelete(id);

    if (!deletedParticipant) {
      throw new Error('Participant not found');
    }

    return deletedParticipant;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

//To Do: Add search functionality
// Search for participants by name or username
export const searchParticipants = async (query: string) => {
  return Participant.find({
    $or: [{ username: { $regex: query, $options: "i" } }, { first_name: { $regex: query, $options: "i" } }],
  }).select('-password');
};


export const addParticipants = async(chatId: string, participants: { userId: string; role: string }[]) => {
  // Check if the chat room exists
  const chatRoom = await ChatRoom.findById(chatId);
  if (!chatRoom) {
    throw new Error("Chat room not found");
  }

  // check then Create participants
  const existingParticipants = await Participant.find({
    chatId,
    userId: { $in: participants.map((p) => p.userId) },
  }).select("userId");

  const existingUserIds = new Set(existingParticipants.map((p) => p.userId));
  const filteredParticipants = participants.filter(
    (p) => !existingUserIds.has(p.userId)
  );

  if (filteredParticipants.length === 0) {
    return { message: "No new participants were added", added: [] };
  }

  // create participant entries
  const participantEntries = filteredParticipants.map(({ userId, role }) => ({
    chatId,
    userId,
    role,
  }));



  // Use insertMany to add many participants and ignore duplicates
  try {
    const participantsAdded = await Participant.insertMany(
        participantEntries,
        { ordered: false }
    );
    console.log("Participants added successfully");

    return participantsAdded;
  } catch (error) {
    console.error("Error adding participants:", error);
  }
}
