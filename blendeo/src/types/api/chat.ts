// src/types/api/chat.ts

// 채팅 메시지 타입
export interface ChatMessage {
  type: "TALK";
  chatRoomId: number;
  userId: number;
  nickname: string;
  profileImage: string;
  content: string;
  createdAt: string;
}

// 채팅 메시지 응답 타입
export type GetMessagesResponse = ChatMessage[];

// 채팅방 타입
export interface ChatRoom {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    createdAt: string;
  };
  participants: {
    id: number;
  }[];
}

export type ChatRoomsResponse = ChatRoom[];

// 채팅방 참가자 타입
export interface RoomParticipant {
  userId: number;
  email: string;
  nickname: string;
  profileImage: string;
}

// 사용자 검색 타입
export interface SearchUser {
  userId: number;
  email: string;
  profileImage: string;
}

export type SearchUserResponse = SearchUser[];

// 채팅방 생성 관련 타입
export interface CreateRoomRequest {
  userIds: number[];
}

export interface CreateRoomResponse {
  roomId: number;
  roomName: string;
  userIds: number[];
}

// 채팅방 이름 수정 관련 타입
export interface EditRoomNameRequest {
  roomId: number;
  roomName: string;
}

// WebSocket 상태 타입
export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";
