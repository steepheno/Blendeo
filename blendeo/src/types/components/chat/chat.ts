// src/types/components/chat/chat.ts
import type {
  ChatRoom,
  ChatMessage,
  SearchUserResponse,
} from "@/types/api/chat";
import type { User } from "@/types/api/user";

export interface ChatSearchBarProps {
  placeholder: string;
  iconSrc: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ChatRoomListProps {
  rooms: ChatRoom[];
  onRoomSelect: (roomId: number) => void;
  selectedRoomId?: number;
}

export interface ChatRoomProps {
  room: ChatRoom;
  messages: ChatMessage[];
  currentUser: User | null;
  onSendMessage: (message: string) => void;
  onInviteUser: (email: string) => void; // userId 대신 email로 변경
}

export interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  user?: User;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>; // userId -> email로 변경, Promise 반환 타입 추가
  roomId: number;
  searchResults?: SearchUserResponse[]; // 이메일 검색 결과 추가
  onSearch: (email: string) => Promise<void>; // 이메일 검색 함수 추가
}
