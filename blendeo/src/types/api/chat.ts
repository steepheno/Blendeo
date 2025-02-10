// src/types/api/chat.ts
export interface ChatMessage {
  type: "TALK" | "ENTER" | "LEAVE";
  chatRoomId: number;
  userId: number;
  content: string;
  timestamp: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
}

export interface CreateRoomRequest {
  roomName: string;
}

export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";
