// app/store/usePostStore.ts

import { IPost } from '@/app/models/post';
import { create } from 'zustand';
import axios from 'axios';

interface SearchResult {
  posts: IPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

// axios for clinet side
interface PostState {
  post: IPost | null;
  posts: IPost[];
  error: string | null;
  loading: boolean;
  searchResults: IPost[];
  localFilteredPosts: IPost[];
  searchQuery: string;

  currentPage: number;
  totalPages: number;
  createPost: (post: IPost | Partial<IPost> ) => Promise<IPost>; 
  fetchPost: (id: string) => Promise<IPost>; // get post ID
  updatePost: (id: string, updatedData: Partial<IPost>) =>  Promise<IPost>; // get post ID to update post
  deletePost: (id: string) => Promise<void>; // get post ID to delete post
  fetchAllPosts: (page?: number, limit?: number) => Promise<IPost[]>;
  setPosts: (posts: IPost[]) => void;

  setSearchQuery: (query: string) => void;

  searchPosts: (types: string[] , query: string, page?: number, limit?: number) => Promise<SearchResult>;
  clearSearchResults: () => void;

}

const usePostStore = create<PostState>((set) => ({
  post: null,
  posts: [], // Initial empty list of posts
  error: null,
  loading: false, // Initial loading state
  searchResults: [],
  localFilteredPosts: [],
  searchQuery: '',
  currentPage: 1,  // Start from the first page
  totalPages: 0,   // Total number of pages
  // Create a new post
  createPost: async (post: IPost | Partial<IPost>) => {
    set({ loading: true }); // Set loading to true when creating
    
 

    try {
      const response = await axios.post(`/api/posts/`, post);
      
      const data: IPost = await response.data;

      set((state) => ({
        posts: [data, ...state.posts], // Add the newly created post with the `_id`
        post: data,
        error: null,
        loading: false,
      }));

      //fetchAllPosts();
    
    console.log("Success fully created data in the post store");
      return data;
    } catch (err) {
      set({ post: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the post store in createpost");
      throw err;
    }
  },

  searchPosts: async (types, query, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/posts/search', {
        params: {
          types: types.join(','),
          q: query,
          page,
          limit
        }
      });

      const searchResult: SearchResult = {
        posts: response.data.posts,
        totalPosts: response.data.totalPosts,
        totalPages: response.data.totalPages,
        currentPage: page
      };

      set({
        searchResults: searchResult.posts,
        loading: false,
        localFilteredPosts: searchResult.posts,
        error: null
      });

      return searchResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during search';
      set({
        error: errorMessage,
        loading: false,
        searchResults: []
      });

      return Promise.reject(error);
     
    }
  
  },

  setSearchQuery: (query) => {
    set((state) => {
      const filtered = state.posts.filter((post) => {
        const captionMatch = post.caption.toLowerCase().includes(query.toLowerCase());
        const authorMatch = post.created_by?.username.toLowerCase().includes(query.toLowerCase());
        const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

      return captionMatch || authorMatch || tagsMatch; 
    });
      return { searchQuery: query, localFilteredPosts: filtered };
    });
  },

  clearSearchResults: () => {
    set({  searchResults: [], localFilteredPosts: [], searchQuery: '' });
  },
  
  fetchPost: async (id) => {
    set({ loading: true }); // Set loading to true when fetching
    try {
      const response = await axios.get(`/api/posts/${id}`); 

      if (!response) {
        throw new Error('Failed to fetch post data');
      }

      const data: IPost = await response.data;
      set({ post: data, error: null, loading: false }); // Set the post data and clear any error
      console.log("Success fully fetched data in the post store");
      return data;
    } catch (err) {
      set({ post: null, error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the post store in fetchpost");
      return Promise.reject(err); // Return a rejected promise with the error
 
    }
  },

  // Fetch all post 
  fetchAllPosts: async (page?: number, limit?: number, fieldsToSelect = 'username avatar_image email') => {
    set({ loading: true });
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=${limit}&fields=${encodeURIComponent(fieldsToSelect)}`);

  
      // shows all the posts
      const data: IPost[] = await response.data.posts;


      if (!Array.isArray(data)) {
        throw new Error('Expected an array of posts');
      }

     console.log(data, "Successfully fetched data in the post store");
     
    
      set({ posts: data, localFilteredPosts: data, error: null, loading: false });

     
      
       // console.log(data, "Successfully fetched data in the post store");
      console.log("Successfully fetched data in the post store", data);
      return data;
    } catch (err) {
      set({ posts: [], error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("Error in the post store in fetchAllPosts");
      return Promise.reject(err);
    }
  },
  updatePost: async (id, updatedData: Partial<IPost> ): Promise<IPost> => {
    set({ loading: true, error: null });

    // Update the state with the new post data
    set((state: PostState) => ({
      posts: state.posts.map((post) =>
        post._id === id ? { ...post, ...updatedData } : post
      ),
      post: state.post?._id === id ? { ...state.post, ...updatedData } : state.post,
      error: null,
      loading: false,
    }) as PostState);
  
    try {
      
      const res = await axios.put(`/api/posts/${id}`, updatedData); // modify for dyanimic routes over query params
      // better for SEO, cleaner here but not for dyanmic  routes since we will need toget the id from the query params
  
      const updatedPost: IPost = res.data;

      // Update the state with the new post data, and mark loading as false
      set((state: PostState) => ({
        posts: state.posts.map((post) =>
          post._id === id ? { ...post, ...updatedPost } : post
        ),
        post: state.post?._id === id ? updatedPost : state.post,
        error: null,
        loading: false,
      }) as PostState);
     
  
      console.log("updatedpost in the post store");
      return updatedPost;
     
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred', loading: false });
      console.log("error in the post store in updatepost");

      throw err;
    }
  },
 // In usePostStore
 deletePost: async (id) => {
  set((state) => ({
    posts: state.posts.filter((post) => post._id !== id),
    localFilteredPosts: state.localFilteredPosts.filter((post) => post._id !== id),
  }));

  try {
    await axios.delete(`/api/posts/${id}`);
    console.log("Successfully deleted post");
  } catch (err) {
    set({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    console.error("Error deleting post:", err);
  }
},



  setPosts: (posts) => set({ posts })


}));

export default usePostStore;
