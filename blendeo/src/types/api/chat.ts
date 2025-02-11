// src/types/api/chat.ts
import type { User } from "@/types/api/user"; // User 타입 import

export interface ChatMessage {
  type: "TALK" | "ENTER" | "LEAVE";
  chatRoomId: number;
  userId: number;
  user?: User; // 메시지 작성자 정보
  content: string;
  timestamp: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants?: User[]; // 채팅방 참여자 정보
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
}

export interface CreateRoomRequest {
  roomName: string;
}

export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";
