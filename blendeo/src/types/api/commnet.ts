export interface CreateCommentRequest {
  projectId: number;
  comment: string;
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  userId: number;
  userNickname: string;
  userProfile: string;
}
