// src/types/components/notification/notification.ts
export interface Notification {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
}
