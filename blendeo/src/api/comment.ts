import axiosInstance from "@/api/axios";
import type { CreateCommentRequest, Comment } from "@/types/api/commnet";

export const createComment = async (commentData: CreateCommentRequest) => {
  try {
    return await axiosInstance.post<void>("/comment/", commentData);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getAllComments = async (projectId: number) => {
  try {
    return await axiosInstance.get<Comment[]>(`/comment/get-all/${projectId}`);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    return await axiosInstance.delete<void>(`/comment/delete/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export default {
  createComment,
  getAllComments,
  deleteComment
};