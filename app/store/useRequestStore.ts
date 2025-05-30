// app/store/useRequestStore.ts
import { create } from 'zustand'; // Import Zustand for state management
import axios from 'axios'; // Import Axios for making HTTP requests
import { IRequest } from '../models/Request';
import { IUser } from '../models/Users';
import { string } from 'zod';

interface FetchUserDataResponse {
  friends: IUser[];
  followers: IUser[];
  followerCount: number;
  followingCount: number;
  friendCount: number;
}



// Define the interface for the state of the request store
interface RequestState {
  request: IRequest | null;
  requests: IRequest[]; // Array to hold the list of requests
  followers: IUser[];
  friends: IUser[];
  loading: boolean;
  followerCount: number;
  followingCount: number;
  friendCount: number;
  error: string | null; // Error message, if any

  fetchRequestById: (id: string) => Promise<IRequest>;

  updateRequest: (id: string, updatedData: Partial<IRequest>) => Promise<IRequest>;

  fetchRequests: ( type: 'follow' | 'friend', userId: string | null, allowAll?: boolean) => Promise<IRequest[]>;
  
  
  fetchUserData: (userId: string) => Promise<FetchUserDataResponse>;  // fetching user requess data

  
  // Function to fetch requests for a specific user and request type (follow or friend)
  fetchRequestByUserandType: (
    userId: string, 
    requestType?: 'follow' | 'friend',
     direction?: 'sent' | 'received',
     allowAll?: boolean
  ) => Promise<IRequest[]>;
  // Function to send a new request (follow or friend) between two users
  sendRequest: (reuesterId: string, requesteeId: string, requestType: 'follow' | 'friend',requesterType: string, requesteeType: string) => Promise<IRequest>;
  removeRequest: (requestId: string) => Promise<void>;
}


const useRequestStore = create<RequestState>((set, get) => ({
  request: null,
  requests: [], // Initialize the requests array as an empty array
  followers: [],
  friends: [],
  loading: false,
  followerCount: 0,
  followingCount: 0,
  friendCount: 0,

  error: null, // Start with no errors


  fetchRequestById: async(id: string) => {
    try {
      set({ loading: true });
      const response = await axios.get(`/api/requests/${id}`);
    
      set((state) => ({
        ...state,
        request: response.data, // Set the fetched request to the state
        loading: false,
        error: null,
      }));      
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch request' });
      return Promise.reject(error);
    }
  },


  updateRequest: async(id, updatedData): Promise<IRequest> => {
    try {
      set({ loading: true });
      const response = await axios.put(`/api/requests/${id}`, updatedData);
    
      set((state) => ({
        ...state,
        request: response.data, 
        requests: state.requests.map((req) =>
          req._id === id ? { ...req, ...updatedData }  as IRequest : req
        ), // Update the request in the list
        loading: false,
        error: null,
      }));      
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch request' });
      return Promise.reject(error);
    }
      
  },
     
  
 
  fetchRequests: async (type: 'follow' | 'friend', userId?: string | null, allowAll?: boolean) => {
    try {
      set({ loading: true });
      const endpoint = userId
        ? `/api/requests/users-type?requestType=${type}&userId=${userId}&allowAll=${allowAll}`
        : `/api/requests/users-type?requestType=${type}&allowAll=${allowAll}`;

      const response = await axios.get(endpoint);
      // Update the state with the fetched requests and reset any previous errors
      set((state) => ({
        ...state,
        requests: response.data, // Set all requests to the state
        loading: false,
        error: null,
      }));

      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch requests' });
      return Promise.reject(error);
    }
  },
 
 
  // Function to fetch requests for a user
  fetchRequestByUserandType: async (userId, requestType, direction = 'received', allowAll = false) => {
    try {
      set ({ loading: true });
      // Make an HTTP GET request to the backend to fetch requests for the given user and request type
      const response = await axios.get(`/api/requests/users-type?userId=${userId}&requestType=${requestType}&direction=${direction}&allowAll=${allowAll}`);
      // Update the state with the fetched requests and reset any previous errors
      set({ requests: response.data, error: null });
      return response.data;
    } catch (error) {
      // In case of error, set an error message in the state
      set({ error: 'Failed to fetch requests' });
      return Promise.reject(error);
    }
  },
  
  // Function to send a new follow or friend request
  sendRequest: async (requesterId, requesteeId, requestType, requesterType, requesteeType) => {
    set({ loading: true, error: null });
  
    try {
      // Make an HTTP POST request to send the follow or friend request to the backend
      const response = await axios.post('/api/requests', { requesterId, requesteeId, requestType, requesterType, requesteeType });
  
      if (response.status === 201 && response.data.success) {
        console.log(`Request with ID ${response.data.data._id} successfully created`);
  
        const requestData = response.data.data;
        // Update the state with the new request
        set((state) => ({
          ...state,
          [requestType === 'follow' ? 'followers' : 'friends']: [
            ...state[requestType === 'follow' ? 'followers' : 'friends'],
            requestData,
          ],
          error: null,
        }));
  
        return requestData; 
      } else {
       
        const message = response.data.message || 'Unexpected server response';
        throw new Error(message);
      }
    } catch (error) {
     
   
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false });
      return Promise.reject(error);
     
    } finally {
      set({ loading: false }); 
    }
  },
  
  removeRequest: async (requestId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`/api/requests/${requestId}`);

      if (response.status === 200) {
        console.log(`Request with ID ${requestId} successfully deleted`);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false });
      console.error('Error removing request:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserData: async (userId) => {
    try {
      set({ loading: true });
      const response = await axios.get(`/api/user/${userId}/followers`);
      console.log(response.data);
      
      const { 
        followers = [], 
        following = [], 
        friends = [], 
        user = null 
      } = response.data || {};

      set({
        followers,
        friends,
        requests: following,
        loading: false,
        error: null,
        followerCount: followers?.length || 0,
        followingCount: following?.length || 0,
        friendCount: friends?.length || 0,
      });

      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch user data', loading: false });
      return Promise.reject(error);

    }
  },

 
}));


// Export the useRequestStore hook to use the state in components
export default useRequestStore;
