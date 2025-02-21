// src/types/api/notification.ts
export interface NotificationResponse {
  notificationId: number;
  receiverId: number;
  senderId: number;
  content: string;
  profileImage: string;
  nickname: string;
  createdAt: string;
  read: boolean;
}
