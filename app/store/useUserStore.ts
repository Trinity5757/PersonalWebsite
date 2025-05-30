// app/store/userUserStore.ts

import { IUser } from '@/app/models/Users';
import { create } from 'zustand';
import axios from 'axios';

// axios for clinet side
interface UserState {
  user: IUser | null;
  users: IUser[];
  error: string | null;
  loading: boolean; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generalSettings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  privacySettings: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userPreferences: any;

  currentPage: number; // Track the current page
  totalPages: number;  // Track the total number of pages
  searchResults: IUser[];
  searchLoading: boolean;
  searchError: string | null;

  fetchUser: (id: string) => Promise<IUser>; // get user ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchUserSettings: (id: string) => Promise<any>;
  fetchUserByUsername: (username: string) =>Promise<IUser>
  updateUser: (id: string, updatedData: Partial<IUser>) =>  Promise<IUser>; // get user ID to update user
  deleteUser: (id: string) => Promise<void>; // get user ID to delete user
  fetchAllUsers: (page?: number, limit?: number) => Promise<IUser[]>; // Added optional params
  setUsers: (users: IUser[]) => void;
  searchUsers: (
    query: string,
    options?: {
      limit?: number;
      exactMatch?: boolean;
      searchFields?: ('username' | 'first_name' | 'last_name')[];
    }
  ) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  users: [], // Initial empty list of users
  error: null,
  loading: false, // Initial loading state
  // To do: Pagination 

  generalSettings: null,
  privacySettings: null,
  userPreferences: null,
  currentPage: 1,  // Start from the first page
  totalPages: 0,   // Total number of pages
  searchResults: [],
  searchLoading: false,
  searchError: null,
  fetchUser: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/users/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch user data');
      }

      const data: IUser = await response.data;
      set({ user: data, error: null, loading: false }); // Set the user data and clear any error

      console.log("Success fully fetched data in the user store");
      return data;
    } catch (err) {
      set({ user: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the user store in fetchUser");
      return Promise.reject(err);
    }
  },
  fetchUserSettings: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`/api/settings/${id}`);
      set({
        generalSettings: response.data.generalSettings,
        privacySettings: response.data.privacySettings,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(`Error fetching user settings for ID ${id}:`);
      set({ loading: false, error: null });  
      return Promise.reject(error);
    }
  },


  
  
  fetchUserByUsername: async (username: string)=>{
    set({ loading: true });
    try{
    const response = await axios.get(`/api/users/username/${username}`); 

      if (!response) {
        throw new Error('Failed to fetch user data');
      }
      const data: IUser = await response.data;
      set({ user: data, error: null, loading: false }); // Set the user data and clear any error
      console.log("Success fully fetched data in the user store");
      console.log(data);  
      return data;      
    }catch (err) {
      set({ user: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the user store in fetchUser");
      return Promise.reject(err);
    }

  },

  // Fetch all users - to do pagination
  fetchAllUsers: async (page?: number, limit?: number, fieldsToSelect = "-password") => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/users?page=${page}&limit=${limit}&fields=${encodeURIComponent(fieldsToSelect)}`);
      // const { users, totalPages, currentPage } = response.data;
    
      const usersData: IUser[] = await response.data.users;
      const totalPages = response.data.totalPages;
      const currentPage = response.data.currentPage;
      if (Array.isArray(usersData)) {
        set({ users: usersData,  currentPage,
          totalPages, error: null, loading: false });
       // console.log(data, "Successfully fetched data in the user store");
      } else {
        set({ users: [], error: 'Failed to fetch users: Invalid data format', loading: false });
      }
      console.log("Successfully fetched data in the user store" , usersData);
      return usersData;
    } catch (err) {
      set({ users: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the user store in fetchAllUsers");
      return Promise.reject(err);
    }
  },
  updateUser: async (id, updatedData: Partial<IUser> ): Promise<IUser> => {
    set({ loading: true, error: null });
  
    try {
      
      const res = await axios.put(`/api/users/${id}`, updatedData); // modify for dyanimic routes over query params
      // better for SEO, cleaner here but not for dyanmic  routes since we will need toget the id from the query params
  
      const updatedUser: IUser = res.data;

      // Update the state with the new user data, and mark loading as false
      set((state) => {
        const updatedUsers = state.users.map((user) =>
          user._id === id ? { ...user, ...updatedData } : user
        );
        return {
          users: updatedUsers,
          user: state.user?._id === id ? updatedUser : state.user,
          error: null,
          loading: false,
        };
      });
     
  
      console.log("updatedUser in the user store");
      return updatedUser;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the user store in updateUser");

      throw err;
    }
  },
  deleteUser: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`/api/users/${id}`);

      set((state) => ({
        user: state.user?._id === id ? null : state.user,
        users: state.users.filter((user) => user._id !== id), // take user to detelet from list
        error: null,
        loading: false,
      }));

      console.log("Success fully deleted user data in the user store");

     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the user store in deleteUser");
      
    }
  },

  setUsers: (users) => set({ users }),
  
  searchUsers: async (query, options = {}) => {
    set({ searchLoading: true, searchError: null });
    try {
      const { limit = 10, exactMatch = false, searchFields } = options;
      
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        exact: exactMatch.toString()
      });
      
      if (searchFields?.length) {
        params.append('fields', searchFields.join(','));
      }
      
      const response = await axios.get(`/api/users/search?${params.toString()}`);
      const { users } = response.data;
      
      set({
        searchResults: users,
        searchLoading: false,
        searchError: null
      });
    } catch (error) {
      set({
        searchResults: [],
        searchLoading: false,
        searchError: error instanceof Error ? error.message : 'Failed to search users'
      });
      console.error('Error searching users:', error);
    }
  },



}));

export default useUserStore;
