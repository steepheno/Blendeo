import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createComment, getAllComments, deleteComment } from '@/api/comment';
import type { Comment } from '@/types/api/commnet';

interface CommentStore {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  fetchComments: (projectId: number) => Promise<void>;
  addComment: (projectId: number, content: string) => Promise<void>;
  removeComment: (commentId: number) => Promise<void>;
}

const useCommentStore = create<CommentStore>()(
  devtools(
    (set) => ({
      comments: [],
      loading: false,
      error: null,
      fetchComments: async (projectId) => {
        console.log("im,", projectId);
        
        set({ loading: true, error: null });
        try {
          const response = await getAllComments(projectId);
          set({ comments: response, loading: false });
        } catch (error) {
          set({ error: 'Failed to fetch comments, '+error, loading: false });
        }
      },
      addComment: async (projectId, comment) => {
        set({ loading: true, error: null });
        try {
          await createComment({ projectId, comment });
          await useCommentStore.getState().fetchComments(projectId);
          set({ loading: false });
        } catch (error) {
          set({ error: 'Failed to add comment, '+error, loading: false });
        }
      },
      removeComment: async (commentId) => {
        set({ loading: true, error: null });
        try {
          await deleteComment(commentId);
          set((state) => ({
            comments: state.comments.filter((c) => c.id !== commentId),
            loading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to remove comment,'+error, loading: false });
        }
      },
    }),
    { name: 'CommentStore' }
  )
);

export default useCommentStore;