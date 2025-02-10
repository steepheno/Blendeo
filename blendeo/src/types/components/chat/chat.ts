import type { ChatRoom, ChatMessage } from "@/types/api/chat";

// 채팅방 검색바 컴포넌트 Props
export interface ChatSearchBarProps {
  placeholder: string;
  iconSrc: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 채팅방 목록 컴포넌트 Props
export interface ChatRoomListProps {
  rooms: ChatRoom[];
  onRoomSelect: (roomId: number) => void;
  selectedRoomId?: number;
}

// 채팅방 컴포넌트 Props
export interface ChatRoomProps {
  room: ChatRoom;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onInviteUser: (userId: number) => void;
}

// 채팅 메시지 컴포넌트 Props
export interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

// 채팅 입력 컴포넌트 Props
export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

// 사용자 초대 모달 Props
export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (userId: number) => void;
  roomId: number;
}
