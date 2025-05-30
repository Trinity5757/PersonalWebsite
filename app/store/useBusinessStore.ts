// app/store/useBuisnessStore.ts

import { IBusiness } from '@/app/models/Business';
import { create } from 'zustand';
import axios from 'axios';



interface SearchResult {
  businesses: IBusiness[];
  totalBusinesses: number;
  totalPages: number;
  currentPage: number;
}


// axios for clinet side
interface BusinessState {
  business: IBusiness | null;
  businesses: IBusiness[];
  error: string | null;
  loading: boolean; 
  searchResults: IBusiness[];
  localFilteredBusinesses: IBusiness[];
  searchQuery: string;
  createBusiness: (data: IBusiness) => Promise<IBusiness>;
  fetchBusiness: (id: string) => Promise<void>; // get user ID
  updateBusiness: (id: string, updatedData: Partial<IBusiness>) =>  Promise<IBusiness>; // get user ID to update user
  deleteBusiness: (id: string) => Promise<void>; // get user ID to delete user
  fetchAllBusinesses: () => Promise<void>;
  setBusinesses: (businesses: IBusiness[]) => void;
  searchBusinesses: (types: string[], query: string, page?: number, limit?: number) => Promise<SearchResult>;
  setSearchQuery: (query: string) => void;
  clearSearchResults: () => void;

}

const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  businesses: [], // Initial empty list of business
  error: null,
  loading: false, // Initial loading state
  searchResults: [],
  localFilteredBusinesses: [],
  searchQuery: '',

  createBusiness: async (data: IBusiness) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/api/business`, data);
      const createdBusiness: IBusiness = await response.data;
      set((state) => ({
        businesses: [createdBusiness, ...state.businesses], // Add the newly created buiness with the `_id`
        business: createdBusiness,
        error: null,
        loading: false,
      }));

      console.log("Success fully created business data in the business store");
      return createdBusiness;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the business store in createBusiness");
      throw err;
    }
  },

  fetchBusiness: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/business/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch business data');
      }

      const data: IBusiness = await response.data;
      set({ business: data, error: null, loading: false }); // Set the user data and clear any error
      console.log("Success fully fetched data in the user store");
    } catch (err) {
      set({ business: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the user store in fetchUser");
    }
  },

  // Fetch all users - to do pagination
  fetchAllBusinesses: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/business/`); 
  
      const data: IBusiness[] = await response.data;

      
      if (Array.isArray(data)) {
        set({ businesses: data, error: null, loading: false });
     
      } else {
        set({ businesses: [], error: 'Failed to fetch businesses: Invalid data format', loading: false });
      }
      console.log("Successfully fetched data in the business store");
    } catch (err) {
      set({ businesses: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the business store in fetchAllBusinesses");
    }
  },
  updateBusiness: async (id, updatedData: Partial<IBusiness> ): Promise<IBusiness> => {
    set({ loading: true, error: null });
  
    try {
      
      const res = await axios.put(`/api/business/${id}`, updatedData); // modify for dyanimic routes over query params
      // better for SEO, cleaner here but not for dyanmic  routes since we will need toget the id from the query params
  
      const updatedBusiness: IBusiness = res.data;

      // Update the state with the new business data, and mark loading as false
      set((state: BusinessState) => {
        const updatedBusinesses = state.businesses.map((business) =>
          business._id === id ? { ...business, ...updatedData } : business
        ) as IBusiness[];
        return {
          businesses: updatedBusinesses,
          business: state.business?._id === id ? updatedBusiness : state.business,
          error: null,
          loading: false,
        };
      });
     
  
      console.log("updatedBusiness in the user store");
      return updatedBusiness;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the business store in updateBusiness");

      throw err;
    }
  },
  deleteBusiness: async (id) => {
    set({ loading: true });

    try {
      await axios.delete(`/api/business/${id}`);

      set((state) => ({
        business: state.business?._id === id ? null : state.business,
        businesses: state.businesses.filter((business) => business._id !== id), // take user to detelet from list
        error: null,
        loading: false,
      }));

      console.log("Success fully deleted business data in the business store");

     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the business store in deleteBusiness");
      
    }
  },

  setBusinesses: (businesses) => set({ businesses }),

  searchBusinesses: async (types, query, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/business/search', {
        params: {
          types: types.join(','),
          q: query,
          page,
          limit
        }
      });

      const searchResult: SearchResult = {
        businesses: response.data.businesses,
        totalBusinesses: response.data.totalBusinesses,
        totalPages: response.data.totalPages,
        currentPage: page
      };

      set({
        searchResults: searchResult.businesses,
        loading: false,
        localFilteredBusinesses: searchResult.businesses,
        error: null
      });

      return searchResult;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred during search',
        loading: false,
        searchResults: []
      });

      return Promise.reject(error);
    }
  },

  setSearchQuery: (query) => {
    set((state) => {
      const filtered = state.businesses.filter((business) => {
        const nameMatch = business.businessName.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = business.category?.toLowerCase().includes(query.toLowerCase());
        const tagsMatch = business.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

        return nameMatch || categoryMatch || tagsMatch;
      });

      return { searchQuery: query, localFilteredBusinesses: filtered };
    });
  },

  clearSearchResults: () => {
    set({ searchResults: [], localFilteredBusinesses: [], searchQuery: '' });
  },


}));

export default useBusinessStore;
