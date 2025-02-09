// src/types/components/chat/chat.ts
export interface User {
  id: string;
  name: string;
  message?: string;
  isOnline?: boolean;
  imageUrl: string;
  lastMessageTime?: number;
}

export interface UserItemProps extends User {
  onClick: () => void;
  isSelected?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

export interface WebSocketMessage {
  type: "CHAT" | "JOIN" | "LEAVE";
  roomId: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface ChatWindow {
  user: User;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isConnected: boolean;
}
