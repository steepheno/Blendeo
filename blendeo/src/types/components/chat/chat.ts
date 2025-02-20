// src/types/components/chat/chat.ts
import type {
  ChatRoom,
  ChatMessage,
  SearchUser,
  WebSocketStatus,
} from "@/types/api/chat";

/**
 * 채팅 검색바 컴포넌트 props 타입
 */
export interface ChatSearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (searchValue: string) => Promise<void>;
  placeholder?: string;
  iconSrc?: string;
}

/**
 * 채팅방 목록 컴포넌트 props 타입
 */
export interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId?: number;
  onRoomSelect: (roomId: number) => void;
}

/**
 * 채팅방 컴포넌트 props 타입
 */
export interface ChatRoomProps {
  roomId: number;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  connectionStatus: WebSocketStatus;
}

/**
 * 채팅 메시지 아이템 컴포넌트 props 타입
 */
export interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

/**
 * 채팅 입력 컴포넌트 props 타입
 */
export interface ChatInputProps {
  onSend: (content: string) => Promise<void>; // Promise 타입으로 변경
  disabled?: boolean; // WebSocket 연결 상태에 따른 비활성화
}

/**
 * 사용자 검색 결과 아이템 컴포넌트 props 타입
 */
export interface UserItemProps {
  user: SearchUser;
  onSelect: (userId: number) => void;
  isSelected: boolean;
}

/**
 * 채팅방 생성 모달 컴포넌트 props 타입
 */
export interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: SearchUser[];
  onCreateRoom: (userIds: number[]) => Promise<void>;
}

/**
 * 사용자 검색 결과 리스트 컴포넌트 props 타입
 */
export interface UserSearchListProps {
  users: SearchUser[];
  selectedUsers: SearchUser[];
  onUserSelect: (user: SearchUser) => void;
}

/**
 * 채팅방 네비게이션 아이템 props 타입
 */
export interface NavigationItemProps {
  room: ChatRoom;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * 채팅방 이름 수정 props 타입
 */
export interface EditRoomNameProps {
  roomId: number;
  onEditName: (roomId: number, newName: string) => Promise<void>;
}
