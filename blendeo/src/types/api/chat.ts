// src/types/api/chat.ts
import type { User } from "@/types/api/user";

export interface ChatMessage {
  type: "TALK" | "ENTER" | "LEAVE";
  chatRoomId: number;
  userId: number;
  nickname: string;
  profileImage: string | null;
  content: string;
  timestamp: string;
}

export interface RoomParticipant {
  userId: number;
  email: string;
  nickname: string;
  profileImage: string | null;
}

export interface ChatRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants?: User[];
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
}

export interface CreateRoomRequest {
  roomName: string;
}

// 이메일로 사용자 검색 응답 타입 추가
export interface SearchUserResponse {
  userId: number;
  email: string;
  profileImage: string;
}

// 사용자 초대 요청 타입 추가
export interface InviteUserRequest {
  email: string;
}

export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";
