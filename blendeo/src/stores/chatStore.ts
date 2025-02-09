// src/stores/chatStore.ts
import { create } from "zustand";
import { User, ChatMessage } from "../types/components/chat/chat";

interface ChatState {
  users: User[];
  selectedUser: User | null;
  chatMessages: Record<string, ChatMessage[]>;
  isConnected: boolean;
  searchQuery: string;
  currentUserId: string;

  // Actions
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  addMessage: (userId: string, message: ChatMessage) => void;
  setMessages: (userId: string, messages: ChatMessage[]) => void;
  setConnectionStatus: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateUserLastMessage: (
    userId: string,
    message: string,
    timestamp: number
  ) => void;
  setCurrentUserId: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  users: [],
  selectedUser: null,
  chatMessages: {},
  isConnected: false,
  searchQuery: "",
  currentUserId: "",

  setUsers: (users) => set({ users }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  addMessage: (userId, message) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [userId]: [...(state.chatMessages[userId] || []), message],
      },
    })),

  setMessages: (userId, messages) =>
    set((state) => ({
      chatMessages: {
        ...state.chatMessages,
        [userId]: messages,
      },
    })),

  setConnectionStatus: (status) => set({ isConnected: status }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  updateUserLastMessage: (userId, message, timestamp) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? { ...user, message, lastMessageTime: timestamp }
          : user
      ),
    })),

  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
