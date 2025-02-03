// src/types/components/chat/chat.ts
export interface UserProps {
  name: string;
  message?: string;
  isOnline?: boolean;
  imageUrl: string;
}

export interface ChatSearchBarProps {
  placeholder: string;
  iconSrc: string;
}

export interface MessageProps {
  avatar?: string;
  sender: string;
  time: string;
  content: string;
  isUser?: boolean;
}

export interface ChatHeaderProps {
  title: string;
  onBack: () => void;
  onVideo: () => void;
  onMenu: () => void;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
}
