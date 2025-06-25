// src/stores/chatStore.ts
import { create } from "zustand";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { chatAPI } from "@/api/chat";
import type {
  ChatRoom,
  ChatMessage,
  WebSocketStatus,
  SearchUser,
  RoomParticipant,
} from "@/types/api/chat";
import { useAuthStore } from "@/stores/authStore";

const SOCKET_URL = "https://api.blendeo.shop/ws-stomp";

export interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messagesByRoom: Record<number, ChatMessage[]>;
  searchResults: SearchUser[];
  isLoading: boolean;
  error: string | null;
  wsStatus: WebSocketStatus;
  stompClient: Client | null;
  currentSubscription: StompSubscription | null;
  roomParticipants: Record<number, RoomParticipant[]>;
}

export interface ChatActions {
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string, createdAt?: string) => void;
  fetchRooms: () => Promise<void>;
  setCurrentRoom: (room: ChatRoom | null) => Promise<void>;
  createRoom: (userIds: number[]) => Promise<ChatRoom | void>;
  fetchRoomParticipants: (roomId: number) => Promise<void>;
  searchUserByEmail: (email: string) => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  editRoomName: (roomId: number, newName: string) => Promise<void>;
  clearMessages: () => void;
  clearSearchResults: () => void;
  reset: () => void;
  setConnectionStatus: (status: WebSocketStatus) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  updateRoom: (updatedRoom: ChatRoom) => void;
}

export type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messagesByRoom: {},
  searchResults: [],
  isLoading: false,
  error: null,
  wsStatus: "CLOSED",
  stompClient: null,
  currentSubscription: null,
  roomParticipants: {},
};

const getAccessToken = () => {
  return document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="))
    ?.split("=")[1];
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  setConnectionStatus: (status: WebSocketStatus) => {
    set({ wsStatus: status });
  },

  connectWebSocket: () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const socket = new SockJS(SOCKET_URL);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => {
          console.debug(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        set({ wsStatus: "OPEN", stompClient: client, error: null });
        const { currentRoom } = get();
        if (currentRoom) {
          get().setCurrentRoom(currentRoom);
        }
      };

      client.onStompError = (frame) => {
        console.error("STOMP error:", frame);
        set({ wsStatus: "CLOSED", error: "WebSocket connection error" });
      };

      client.onWebSocketError = (event) => {
        console.error("WebSocket error:", event);
        set({ wsStatus: "CLOSED", error: "WebSocket connection error" });
      };

      client.onWebSocketClose = () => {
        set({ wsStatus: "CLOSED" });
      };

      client.activate();
      set({ wsStatus: "CONNECTING" });
    } catch (error) {
      console.error("WebSocket connection error:", error);
      set({
        error: "Failed to establish WebSocket connection",
        wsStatus: "CLOSED",
      });
    }
  },

  disconnectWebSocket: () => {
    const { stompClient, currentSubscription } = get();
    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }
    if (stompClient) {
      stompClient.deactivate();
      set({ stompClient: null, wsStatus: "CLOSED", currentSubscription: null });
    }
  },

  sendMessage: (content: string, createdAt?: string) => {
    const { stompClient, currentRoom } = get();
    if (!stompClient?.connected || !currentRoom) {
      console.error("Cannot send message: No connection or room");
      return;
    }

    try {
      const userId = useAuthStore.getState().userId;
      if (!userId) {
        console.error("User Id not found");
        return;
      }

      const message = {
        type: "TALK",
        userId,
        chatRoomId: currentRoom.id,
        content,
        createdAt: createdAt || new Date().toISOString(),
      };

      stompClient.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error("Error sending messages", error);
      set({ error: "Failed to send message" });
    }
  },

  fetchRooms: async () => {
    try {
      set({ isLoading: true, error: null });
      const rooms = await chatAPI.getRooms();
      set({ rooms, isLoading: false });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ error: "Failed to fetch rooms", isLoading: false });
    }
  },

  setCurrentRoom: async (room: ChatRoom | null) => {
    const { stompClient, currentSubscription } = get();

    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }

    set({ currentRoom: room });

    if (!room) {
      return;
    }

    if (room && stompClient?.connected) {
      try {
        await get().fetchMessages(room.id);
        await get().fetchRoomParticipants(room.id);

        const subscription = stompClient.subscribe(
          `/sub/chat/room/${room.id}`,
          (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              get().addMessage(receivedMessage);
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          }
        );

        set({ currentSubscription: subscription });
      } catch (error) {
        console.error("Error setting up room:", error);
        set({ error: "Failed to set up room" });
      }
    }
  },

  createRoom: async (userIds: number[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.createRoom(userIds);
      if (response) {
        const newRoom: ChatRoom = {
          id: response.roomId,
          name: response.roomName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          participants: [],
        };

        set((state) => ({
          rooms: [...state.rooms, newRoom],
          isLoading: false,
        }));
        return newRoom;
      }
    } catch (error) {
      console.error("Error creating room:", error);
      set({ error: "Failed to create room", isLoading: false });
    }
  },

  fetchRoomParticipants: async (roomId: number) => {
    try {
      const participants = await chatAPI.getRoomParticipants(roomId);
      set((state) => ({
        roomParticipants: {
          ...state.roomParticipants,
          [roomId]: participants,
        },
      }));
    } catch (error) {
      console.error("Error fetching participants:", error);
      set({ error: "Failed to fetch participants" });
    }
  },

  searchUserByEmail: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const results = await chatAPI.searchUserByEmail(email);
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      console.error("Error searching users:", error);
      set({ error: "Failed to search users", isLoading: false });
    }
  },

  fetchMessages: async (roomId: number) => {
    try {
      set({ isLoading: true, error: null });
      const messages = await chatAPI.getRoomMessages(roomId);
      set((state) => ({
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ error: "Failed to fetch messages", isLoading: false });
    }
  },

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [message.chatRoomId]: [
          ...new Set([
            ...(state.messagesByRoom[message.chatRoomId] || []),
            message,
          ]),
        ].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      },
    }));
  },

  editRoomName: async (roomId: number, newName: string) => {
    try {
      set({ isLoading: true, error: null });
      await chatAPI.editRoomName({ roomId, roomName: newName });
      await get().fetchRooms();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error editing room name:", error);
      set({ error: "Failed to edit room name", isLoading: false });
    }
  },

  clearMessages: () => {
    set({ messagesByRoom: {} });
  },

  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  reset: () => {
    const { disconnectWebSocket } = get();
    disconnectWebSocket();
    set(initialState);
  },

  setRooms: (rooms) => set({ rooms }),

  updateRoom: (updatedRoom) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === updatedRoom.id ? updatedRoom : room
      ),
    })),
}));

export default useChatStore;
