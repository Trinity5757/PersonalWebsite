// app/store/useChatRoomStore.ts

import { create } from 'zustand';
import axios from 'axios';
import { IChatRoom } from '../models/MessageModels/ChatRoom';

// axios for clinet side
interface ChatRoomState {
  chatRoom: IChatRoom | null;
  chatRooms: IChatRoom[];
  error: string | null;
  loading: boolean;
  createChatRoom: (chatRoom: IChatRoom | Partial<IChatRoom> ) => Promise<IChatRoom>; 
  createOrFindChatRoom: (senderId: string, participantId: string) => Promise<IChatRoom>;
  addParticpantsToChatRoom: (chatRoomId: string, participants: string[]) => Promise<void>;
  fetchChatRoom: (id: string) => Promise<IChatRoom>; // get chatRoom ID
  updateChatRoom: (id: string, updatedData: Partial<IChatRoom>) =>  Promise<IChatRoom>; // get chatRoom ID to update chatRoom
  deleteChatRoom: (id: string) => Promise<void>; // get chatRoom ID to delete chatRoom
  fetchAllChatRooms: (page?: number, limit?: number) => Promise<void>;
  getChatRoomsByUser: (userId: string) =>Promise<IChatRoom[]>;
  setChatRooms: (chatRooms: IChatRoom[]) => void;

}

const useChatRoomStore = create<ChatRoomState>((set) => ({
  chatRoom: null,
  chatRooms: [], // Initial empty list of chatRooms
  error: null,
  loading: false, // Initial loading state
  currentPage: 1,  // Start from the first page
  totalPages: 0,   // Total number of pages
  // Create a new chatRoom
  createChatRoom: async (chatRoom: IChatRoom | Partial<IChatRoom>) => {
    set({ loading: true }); // Set loading to true when creating
    
 

    try {
      const response = await axios.post(`/api/chatRoutes/`, chatRoom);
      
      const data: IChatRoom = await response.data;

      set((state) => ({
        chatRooms: [data, ...state.chatRooms], // Add the newly created chatRoom
        chatRoom: data,
        error: null,
        loading: false,
      }));

    
    console.log("Success fully created data in the chat room store");
      return data;
    } catch (err) {
      set({ chatRoom: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the chat room store in createChatRoom");
      throw err;
    }
  },

  createOrFindChatRoom: async (senderId: string, participantId: string) => {
    try {
      const response = await axios.post(`/api/chatRoutes/createOrFindChat`, { senderId, participantId }); 
      console.log("Success fully created data in the chat room store");
    
      return response.data;
    } catch (err) {
      console.log("error in the chat room store in createOrFindChatRoom");
     
      return Promise.reject(err);
    }
  },

  addParticpantsToChatRoom: async (chatRoomId: string, participants: string[]) => {
    try {
      await axios.put(`/api/chatRoutes/${chatRoomId}/participants`, { participants });
      console.log("Success fully updated data in the chat room store");
    } catch (err) {
      console.log("error in the chat room store in addParticpantsToChatRoom");
      throw err;
    }
  },
  
  fetchChatRoom: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/chatRoutes/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch chat room data');
      }

      const data: IChatRoom = await response.data;
      set({ chatRoom: data, error: null, loading: false }); // Set the chat room data and clear any error
      console.log("Success fully fetched data in the chat room store");
      return data;
    } catch (err) {
      set({ chatRoom: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the chat room store in fecthChatRoom");
      return Promise.reject(err); 
 
    }
  },

  // Fetch all chatRooms 
  fetchAllChatRooms: async (page?: number, limit?: number) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/chatRoutes/getAll?page=${page}&limit=${limit}&fields=${encodeURIComponent(fieldsToSelect)}`);

  
      // shows all the chat rooms
      const data: IChatRoom[] = await response.data;


      if (!Array.isArray(data)) {
        throw new Error('Expected an array of chat rooms');
      }

     console.log(data, "Successfully fetched data in the chat room store");
     
    
      set({ chatRooms: data, error: null, loading: false });
      console.log("Successfully fetched data in the chat room store", data);
    } catch (err) {
      set({ chatRooms: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the chat room store in fetchAllChatRooms");
    }
  },
  updateChatRoom: async (id, updatedData: Partial<IChatRoom> ): Promise<IChatRoom> => {
    set({ loading: true, error: null });

    // Update the state with the new chat room data
    set((state: ChatRoomState) => ({
      chatRooms: state.chatRooms.map((chatRoom) =>
        chatRoom._id === id ? { ...chatRoom, ...updatedData } : chatRoom
      ),
      chatRoom: state.chatRoom?._id === id ? { ...state.chatRoom, ...updatedData } : state.chatRoom,
      error: null,
      loading: false,
    }) as ChatRoomState);
  
    try {
      
      const res = await axios.put(`/api/chatRoutes/${id}`, updatedData); 
  
      const updatedChat: IChatRoom = res.data;

      set((state: ChatRoomState) => ({
        chatRooms: state.chatRooms.map((chatRoom) =>
          chatRoom._id === id ? { ...chatRoom, ...updatedChat } : chatRoom
        ),
        chatRoom: state.chatRoom?._id === id ? updatedChat : state.chatRoom,
        error: null,
        loading: false,
      }) as ChatRoomState);
     
  
      console.log("updated chat room data in the chat room store");
      return updatedChat;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the chat room store in updateChatRoom");

      throw err;
    }
  },
  deleteChatRoom: async (id) => {
    set({ loading: true });

    set((state) => ({
      chatRooms: state.chatRooms.filter((chatRoom) => chatRoom._id !== id),
      chatRoom: state.chatRoom?._id === id ? null : state.chatRoom,
      error: null,
      loading: false,
    }));

    try {
      await axios.delete(`/api/chatRoutes/${id}`);

      set((state) => ({
        chatRoom: state.chatRoom?._id === id ? null : state.chatRoom,
        chatRooms: state.chatRooms.filter((chatRoom) => chatRoom._id !== id), // take chat room to detelet from list
        error: null,
        loading: false,
      }));

      console.log("Success fully deleted chat room data in the chat room store");

     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the post store in deleteChatRoom");
      
    }
  },


  getChatRoomsByUser: async (userId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/chatRoutes?userId=${userId}`);
      console.log("Raw API Response:", response.data); // Log actual response
  
      if (!Array.isArray(response.data.userChats)) {
        console.error("API returned an unexpected format:", response.data);
        throw new Error("Expected an array under 'userChats' but received something else.");
      }
  
      set({ chatRooms: response.data.userChats, error: null, loading: false }); 
      console.log("Success fully fetched data in the chat room store");
  
      return response.data.userChats;
    } catch (err) {
      console.error("Error in getChatRoomsByUser:", err);
      set({ chatRooms: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the chat room store in getChatRoomsByUser");
      return Promise.reject(err);
    }
  },
  

  setChatRooms: (chatRooms) => set({ chatRooms })


}));

export default useChatRoomStore;
