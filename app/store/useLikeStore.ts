//app/store/useLikeStore.ts

import { create } from "zustand";
import { LikeType } from "../models/enums/LikeType";
import { ILike } from "../models/Like";
import axios from "axios";

interface LikeState {
  like: ILike | null;
  userlikes: ILike[];
  objectLikes: ILike[];
  error: string | null;
  loading: boolean;
  createLike: (userId: string, type: LikeType, associatedId: string) => Promise<ILike>;
  deleteLike: (userId: string, type: LikeType, associatedId: string) => Promise<ILike>;
  fetchLike: (userId: string, type: LikeType, associatedId: string) => Promise<void>;
  fetchUserLikes: (userId: string, type?: LikeType) => Promise<void>;
  fetchObjectLikes: (type: LikeType, associatedId: string) => Promise<ILike[]>; // fetches all likes for specified post, comment, page, user, etc.

  setLike: (like: ILike) => void;

}

const useLikeStore = create<LikeState>((set) => ({
  like: null,
  userlikes: [],
  objectLikes: [],
  error: null,
  loading: false,
  createLike: async (userId: string, type: LikeType, associatedId: string): Promise<ILike> => {
    set({ loading: true }); // Set loading to true when creating

    try {
      const response = await axios.post(`/api/likes/${userId}/${type}/${associatedId}`);

      if(!response) {
        throw new Error(`Error creating like for ${type}`);
      }

      const newLike : ILike = response.data;

      set((state) => ({
        userlikes: [...state.userlikes, newLike],
        objectlikes: [...state.objectLikes, newLike],
        like: newLike,
        error: null,
        loading: false
      }));

      console.log('Success, created like data in the like store');

      return newLike;
    } catch (error) {
      console.log('Error in the like store in createLike');
      set({like: null, error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false})
      return Promise.reject(error);
    }
      
  },
  deleteLike: async (userId: string, type: LikeType, associatedId: string): Promise<ILike> => {
    set({ loading: true });

    try {
      const response =  await axios.delete(`/api/likes/${userId}/${type}/${associatedId}`);

      if(!response) {
        throw new Error('Failed to delete like');
      }

      const deletedLike : ILike = response.data

      set((state) => ({
          userlikes: state.userlikes.filter((like) => like.associatedId !== associatedId),
          objectlikes: state.objectLikes.filter((like) => like.userId !== userId),
          like: state.like?.userId === userId ? null : state.like,
          error: null,
          loading: false,
        }));

      console.log('Success, deleted like data in the like store');

      return deletedLike;
    } catch (error) {
      console.log('Error in the like store in deleteLike');
      set({like: null, error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false})
      return Promise.reject(error);
    }
      
  },
  fetchLike: async (userId: string, type: LikeType, associatedId: string) => {
    set({ loading: true });
     try {
       const response = await axios.get(`/api/likes/${userId}/${type}/${associatedId}`);
       set({ like: response.data || null, error: null, loading: false });
     } catch (error) {
       set({ like: null, error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false });
       console.log(`Error in fetching like: ${error}`);
     }
   },
  fetchUserLikes: async (userId: string, type?: LikeType) => {
    set({ loading: true });
    await axios.get(`/api/likes/${userId}/${type}`)
      .then((response) => {
        set({
          userlikes: response.data,
          error: null,
          loading: false,
        });
        console.log('Success, fetched user like data in the like store');
      })
      .catch((error) => {
        set({userlikes: [], error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false})
        console.log('Error in the like store fetchUserLike');
      });
  },
  fetchObjectLikes: async (type: LikeType, associatedId: string): Promise<ILike[]> => {
    set({ loading: true });

    try {
      const response = await axios.get(`/api/likes/all-users/${type}/${associatedId}`);

      if(!response) {
        throw new Error(`Failed to fetch likes for ${type}`);
      }

      const likes : ILike[] = await response.data;

      set({
        objectLikes: likes,
        error: null,
        loading: false
      });
      
      console.log(`Success, fetched like data for ${type} in the like store`);

      return likes;
    } catch (error) {
      set({ objectLikes: [], error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false });
      console.log(`Error in fetching likes for ${type}: ${error}`);
      return Promise.reject(error);
    }
  },

setLike: (like) => set({like}),

}));

export default useLikeStore;