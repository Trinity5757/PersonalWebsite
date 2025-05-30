import { create } from "zustand";
import { IComment } from "../models/Comment";
import axios from "axios";

interface CommentState {
  comment: IComment | null;
  postComments: IComment[];
  error: string | null;
  loadingComments: boolean;
  loadingComment:boolean;
  fetchPostComments: (postId: string) => Promise<void>;
  createComment: (comment: IComment) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  updateComment: (commentId: string, updatedData: Partial<IComment>) => Promise<IComment>;
}

const useCommentStore = create<CommentState>((set) => ({
  comment: null,
  postComments: [],
  error: null,
  loadingComments: false,
  loadingComment: false,
  fetchPostComments: async (postId: string) => {
    set({loadingComments: true});
    await axios.get(`/api/posts/${postId}/comments`) // Maybe add pagination to this
      .then((response) => {
        set({
          postComments: response.data,
          error: null,
          loadingComments: false,
        });
      })
      .catch((error) => {
        set({postComments: [], error: error instanceof Error ? error.message : 'An unknown error occurred', loadingComments: false});
        console.log('Error in the comment store in fetchPostComments');
      });

  },
  createComment: async (comment: IComment) => {
    set({loadingComments: true});
    await axios.post('/api/comments/', comment)
      .then((response) => {
        set((state) => ({
          comment: response.data,
          postComments: [response.data, ...state.postComments],
          error: null,
          loadingComments: false,
        }));
      })
      .catch((error) => {
        set({comment: null, error: error instanceof Error ? error.message : 'An unknown error occurred', loadingComments: false});
        console.log('Error in the comment store in createComment');
      });
  },
  deleteComment: async (commentId: string) => {
    set({loadingComment: true});
    await axios.delete(`/api/comments/${commentId}`)
      .then(() => {
        set((state) => ({
          comment: state.comment?._id === commentId ? null : state.comment,
          postComments: state.postComments.filter((comment) => comment._id !== commentId),
          error: null,
          loadingComment: false,
        }));
      })
      .catch((error) => {
        set({error: error instanceof Error ? error.message : 'An unknown error occurred', loadingComment: false})
        console.log('Error in the comment store in deleteComment');
      });
  },
  updateComment: async (commentId: string, updatedData: Partial<IComment>): Promise<IComment> => {
    set({loadingComment: true});

    try {
      const response = await axios.put(`/api/comments/${commentId}`, updatedData);

      const updatedComment : IComment = response.data; 

      set((state: CommentState) => ({
        comment: state.comment?._id === commentId ? response.data: state.comment, 
        postComments: state.postComments.map((comment) =>
          comment._id === commentId ?  updatedComment : comment
        ),
        error: null,
        loadingComment: false,
      }) as CommentState);
      
      console.log('Updated comment in the coment store');
      return updatedComment;

    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', loadingComment: false });
      throw error;
    }
  }

}));

export default useCommentStore;