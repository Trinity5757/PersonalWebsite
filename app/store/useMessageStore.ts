// app/store/useMessageStore.ts

import { IMessage } from '../models/MessageModels/Message';
import { create } from 'zustand';
import axios from 'axios';

// axios for clinet side
interface MessageState {
  message: IMessage | null;
  messages: IMessage[];
  error: string | null;
  loading: boolean; 

  currentPage: number; // Track the current page
  totalPages: number;  // Track the total number of pages

  sendMessage: (messageData: IMessage | Partial<IMessage>) => Promise<IMessage>;
  fetchMessage: (id: string) => Promise<IMessage>; // get message ID
  fetchMessageByChatroom: (chatroomId:string) => Promise<IMessage[]>;
  fetchMessageByAuthor: (username:string) =>Promise<IMessage[]>
  updateMessage: (id: string, updatedData: Partial<IMessage>) =>  Promise<IMessage>; // get message ID to update message
  deleteMessage: (id: string) => Promise<void>; // get message ID to delete message
  fetchAllMessages: (page?: number, limit?: number) => Promise<IMessage[]>; // Added optional params
  setMessages: (messages: IMessage[]) => void;

}

const useMessageStore = create<MessageState>((set) => ({
  message: null,
  messages: [], // Initial empty list of messages
  error: null,
  loading: false, // Initial loading state
  // To do: Pagination 
  currentPage: 1,  // Start from the first page
  totalPages: 0,   // Total number of pages

  sendMessage: async (messageData: IMessage | Partial<IMessage>) => {
    try {
      const response = await axios.post('/api/messages', messageData); // modify for dyanimic routes over query params

      if (!response) {
        throw new Error('Failed to send message');
      }

      const data: IMessage = await response.data;
      set({ message: data, error: null, loading: false }); // Set the message data and clear any error
      console.log("Success fully sent data in the message store");
      return data;
    } catch (err) { 
      set({ message: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in sendMessage");
      return Promise.reject(err);
    }
  },
  fetchMessage: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/messages/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch message data');
      }

      const data: IMessage = await response.data;
      set({ message: data, error: null, loading: false }); // Set the message data and clear any error

      console.log("Success fully fetched data in the message store");
      return data;
    } catch (err) {
      set({ message: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in fetchMessage");
      return Promise.reject(err);
    }
  },
  
  fetchMessageByAuthor: async (username:string)=>{
    set({ loading: true });
    try{    
        const response = await axios.get(`/api/messages?authorId=${username}`); 

      if (!response) {
        throw new Error('Failed to fetch message data');
      }
      const data: IMessage[] = await response.data;
      set({ messages: data, error: null, loading: false }); // Set the message data and clear any error
      console.log("Success fully fetched data in the message store");
      return data;      
    }catch (err) {
      set({ message: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in fetchMessageByAuthor");
      return Promise.reject(err);
    }

  },
  fetchMessageByChatroom: async (chatroomId:string)=>{
    set({ loading: true });
    try{ 
      const response = await axios.get(`/api/messages?chatId=${chatroomId}`); 

      if (!response) {
        throw new Error('Failed to fetch message data');
      }
      const data: IMessage[] = await response.data;
      set({ messages: data, error: null, loading: false }); // Set the message data and clear any error
      console.log("Success fully fetched data in the message store");

      return data;      
    }catch (err) {
      set({ message: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in fetchMessageByChatroom");
      return Promise.reject(err);
    }

  },

  // Fetch all messages - to do pagination
  fetchAllMessages: async (page?: number, limit?: number, fieldsToSelect = "") => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/messages?page=${page}&limit=${limit}&fields=${encodeURIComponent(fieldsToSelect)}`);
      // const { messages, totalPages, currentPage } = response.data;
    
      const messageData: IMessage[] = await response.data.messages;
      const totalPages = response.data.totalPages;
      const currentPage = response.data.currentPage;
      if (Array.isArray(messageData)) {
        set({ messages: messageData,  currentPage,
          totalPages, error: null, loading: false });
       // console.log(data, "Successfully fetched data in the message store");
      } else {
        set({ messages: [], error: 'Failed to fetch messages: Invalid data format', loading: false });
      }
      console.log("Successfully fetched data in the message store");
      return messageData;
    } catch (err) {
      set({ messages: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the message store in fetchAllMessages");
      return Promise.reject(err);
    }
  },
  updateMessage: async (id, updatedData: Partial<IMessage> ): Promise<IMessage> => {
    set({ loading: true, error: null });
  
    try {
      
      const res = await axios.put(`/api/messages/${id}`, updatedData); // modify for dyanimic routes over query params
      // better for SEO, cleaner here but not for dyanmic  routes since we will need toget the id from the query params
  
      const updatedMessage: IMessage = res.data;

      // Update the state with the new message data, and mark loading as false
      set((state ) => {
        const updatedMessages = state.messages.map((message) =>
          message._id === id ? { ...message, ...updatedData } : message
        );
        return {
          messages: updatedMessages,
          message: state.message?._id === id ? updatedMessage : state.message,
          error: null,
          loading: false,
        } as Partial<MessageState>;
      });
     
  
      console.log("updatedMessage in the message store");
      return updatedMessage;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in updateMessage");

      throw err;
    }
  },
  deleteMessage: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`/api/messages/${id}`);

      set((state) => ({
        message: state.message?._id === id ? null : state.message,
        messages: state.messages.filter((message) => message._id !== id), // take message to delete from list
        error: null,
        loading: false,
      }));

      console.log("Success fully deleted message data in the message store");

     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the message store in deleteMessage");
      
    }
  },

  setMessages: (messages) => set({ messages })


}));

export default useMessageStore;
