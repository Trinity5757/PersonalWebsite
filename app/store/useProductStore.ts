// app/store/userUserStore.ts
// not implemented
import { IProduct } from '@/app/models/Product';
import { create } from 'zustand';
import axios from 'axios';

interface ProductState {
  product: IProduct | null;
  products: IProduct[];
  error: string | null;
  loading: boolean; 
  fetchProduct: (productId: string) => Promise<void>; // get product ID
  //updateUser: (id: string, updatedData: Partial<IUser>) => Promise<void>; // get user ID to update user
  deleteProduct: (prouctId: string) => Promise<void>; // get user ID to delete user
  fetchAllProducts: () => Promise<void>;
  setProducts: (products: IProduct[]) => void;
  createCheckoutSession: (priceId: string) => Promise<string | null>; // Add this


}

const useProductStore = create<ProductState>((set) => ({
  product: null,
  products: [], // Initial empty list of users
  error: null,
  loading: false, // Initial loading state
  fetchProduct: async (productId) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
        // To do :  Switch to axios
        const res = await axios.get(`api/products/${productId}`);
        const productData: IProduct = res.data;
        set({ product: productData, error: null, loading: false }); 
    } catch (error) {
        set({ loading: false });
        console.error(error, "error in the product store in fetchProduct");
    }
  },

  // Fetch all users 
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/fetchProducts`); // Ensure this path is correct
      if (!response.ok) throw new Error('Failed to fetch products from API');
  
      const data: IProduct[] = await response.json();
      set({ products: data, error: null, loading: false });
      console.log("Successfully fetched data in the user store");
    } catch (err) {
      set({ products: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the user store in fetchAllProducts");
    }
  },
 /* updateProduct: async (id, updatedData: Partial<IProduct> ) => {
  // Todo - Possibly
   throw new Error('Not implemented');
  },*/
  deleteProduct: async () => {
   
     // Todo - Possibly
     throw new Error('Not implemented');

  },

  setProducts: (products) => set({ products }),

  createCheckoutSession: async (priceId) => {
    try {
      const response = await axios.post('/api/payments/checkout-form', { priceId });
      return response.data.clientSecret;  // Returns the clientSecret for the session
    } catch (error) {
      console.error('Error creating checkout session:', error);
      set({ error: 'Failed to create checkout session' });
      return null;
    }
  },
}));

export default useProductStore;
