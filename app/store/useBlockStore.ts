import axios from "axios";
import { create } from "zustand";

interface Block {
  _id: string;
  userId: string;
  blockedMember: {
    _id: string;
    username: string;
    avatar_image: string;
  };
}

interface BlockState {
  blockList: Block[];
  loading: boolean;
  error: string | null;
  fetchBlockList: (userId: string) => Promise<void>;
  deleteFromBlockList: (userId: string, blockedMember: string) => Promise<void>;
  addToBlockList: (userId: string, blockedMember: string) => Promise<void>;  
}

const useBlockStore = create<BlockState> ((set) => ({
  blockList: [],
  loading: false,
  error: null,
  fetchBlockList: async (userId: string) => {
    set({ loading: true });
    await axios.get(`/api/users/${userId}/block/?searchForUsersBlockList=true`)
    .then((response) => {
      set({
        blockList: response.data,
        loading: false,
        error: null
      });
    })
    .catch((error) => {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false
      });
    });
  },
  deleteFromBlockList: async (userId: string, blockedMember: string) => {
    set({ loading: true});

    await axios.delete(`/api/users/${userId}/block`, { data: {blockedMember: blockedMember} })
      .then(() => {
        set((state) => ({
          blockList: state.blockList.filter((blockedUser) => blockedUser.blockedMember._id !== blockedMember),
          loading: false,
          error: null,
        }));
      })
      .catch((error) => {
        set({
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          loading: false
        });
      });
  },
  addToBlockList: async (userId: string, blockedMember: string) => {
    set({ loading: true});

    await axios.put(`/api/users/${userId}/block`, { data: { blockedMember: blockedMember } })
      .then((response) => {
        set((state) => ({
          blockList: [response.data, ...state.blockList], // Add the newly created post with the `_id`
          error: null,
          loading: false,
        }));
      })
      .catch((error) => {
        set({
          error: error instanceof Error ? error.message : 'An unknown error occurred',
          loading: false
        });
      });
  }
}))

export default useBlockStore;