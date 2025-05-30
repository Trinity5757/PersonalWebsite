// app/services/messageService.ts
import { connectDB } from '../../lib/connectDB';
import { Message } from '../../models/MessageModels/Message';
import { IMessage } from '../../models/MessageModels/Message';
import { User } from '../../models/Users';
import { ChatRoom } from '../../models/MessageModels/ChatRoom';
import { Types } from 'mongoose';

export async function createMessage(
  chatId:Types.ObjectId | string,
  senderId:Types.ObjectId | string,
  content:string,
  messageType:string,
  mediaUrl?:string,
  mediaSize?:number

){

    try {
      await connectDB();     
      
      if (!chatId  || !senderId || !content) {
        throw new Error('chatId, SenderId, and content are required');
      }
      
      const user = await User.findById(senderId).select('-password'); 
      
      if (!user) {
        throw new Error('User not found');
      }
      const chatRoom = await ChatRoom.findById(chatId);
      if (!chatRoom) {
        throw new Error('ChatRoom not found');
      }
      const currentTime = new Date();
      const newMessage = new Message({
        chatId:chatRoom._id,
        senderId:user._id,
        sender: {
          username: user.username,
          avatar_image: user.avatar_image,
        },
        content,
        messageType,
        createdAt: currentTime,
        updatedAt: currentTime,
        mediaUrl,
        mediaSize 
      });
      
      await newMessage.save();    
      
      return newMessage;
    }  catch (error) {
      console.error('Error creating message:', error);
      throw new Error(`Failed to create message: ${error}`);  
    }
  }
export async function getAllMessages(page: number = 1, limit: number = 10) {
    try {
      await connectDB();
      
      const skip = (page - 1) * limit;

      //pagination, excluding passwords
      const messages = await Message.find()
        .skip(skip) // Skip records
        .limit(limit) // Limit the number of records
        .lean();
      
        const totalMessages = await Message.countDocuments();

        return {
          messages,
          totalMessages,
          totalPages: Math.ceil(totalMessages / limit),
          currentPage: page,
        };
        
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');  
    }  
  }


  export async function getMessageById(id: string) {
    try {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      
      const message = await Message.findById(id); 

      if (!message) {
        throw new Error('Message not found');
      }
      
      return message;
    } catch (error) {
      console.error('Message not found:', error);
      throw new Error('Failed to fetch message from database');  
    }  
  }

  export async function getMessageByAuthor(authorId: string) {
    try {
        await connectDB();
        
        if (!Types.ObjectId.isValid(authorId)) {
          throw new Error('Invalid ID format');
        }
        
        const message = await Message.find({senderId:authorId}); 
  
        if (!message) {
          throw new Error('Message not found');
        }
        
        return message;
      } catch (error) {
        console.error('Message not found:', error);
        throw new Error('Failed to fetch message from database');  
      } 
  }

  export async function getMessageByChatroom(cId: string, sId: string = '') {
    try {
      await connectDB();
      if (!Types.ObjectId.isValid(cId)) {
        throw new Error("Invalid chatroom ID format");
      }
  
      const query: object = { chatId:cId };
  
      if (sId !='') {
        
        
        if (!Types.ObjectId.isValid(sId)) {
          throw new Error("Invalid sender ID format");
        }
        query.senderId = sId;
      }
      const messages = await Message.find(query);
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error();
    }
  }


  // Update message by ID
export async function updateMessageById(id: string, updatedData: Partial<IMessage>) { 
  try  {
      await connectDB();
      
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const message = await Message.findByIdAndUpdate(id, updatedData, { new: true });

      if (!message) {
        throw new Error('Message not found');
      }

      return message;
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
}

// Delete message by ID
export async function deleteMessageById(id: string) {
  try {
    await connectDB();
    
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      throw new Error('Message not found');
    }

    return deletedMessage;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}