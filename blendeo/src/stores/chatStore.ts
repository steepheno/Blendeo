import { create } from "zustand";
import SockJS from "sockjs-client";
import { chatAPI } from "@/api/chat";
import type {
  ChatRoom,
  ChatMessage,
  WebSocketStatus,
  SearchUserResponse,
} from "@/types/api/chat";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { Client, StompSubscription } from "@stomp/stompjs";

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messagesByRoom: Record<number, ChatMessage[]>;
  searchResults: SearchUserResponse[]; // 이메일 검색 결과 추가
  isLoading: boolean;
  error: string | null;
  wsStatus: WebSocketStatus;
  stompClient: Client | null;
  isInitialized: boolean;
  currentSubscription: StompSubscription | null;
}

interface ChatActions {
  // WebSocket 관련
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string) => void;

  // Room 관련
  fetchRooms: () => Promise<void>;
  setCurrentRoom: (room: ChatRoom | null) => void;
  createRoom: (roomName: string) => Promise<ChatRoom | void>;

  // 사용자 검색 및 초대 관련
  searchUserByEmail: (email: string) => Promise<void>; // 이메일 검색 메서드 추가
  inviteUserByEmail: (roomId: number, email: string) => Promise<void>; // 이메일로 초대 메서드 변경
  clearSearchResults: () => void; // 검색 결과 초기화

  // Message 관련
  fetchMessages: (roomId: number) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;

  // State 관리
  reset: () => void;
}

type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messagesByRoom: {},
  searchResults: [], // 초기 검색 결과 빈 배열로 설정
  isLoading: false,
  error: null,
  wsStatus: "CLOSED",
  stompClient: null,
  isInitialized: false,
  currentSubscription: null,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,
  // ===== 초기화 메서드 추가 =====
  initialize: async () => {
    const { connectWebSocket, fetchRooms, currentRoom, fetchMessages } = get();
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!get().isInitialized && isAuthenticated) {
      await fetchRooms();
      if (currentRoom) {
        await fetchMessages(currentRoom.id);
      }
      connectWebSocket();
      set({ isInitialized: true });
    }
  },

  // ===== WebSocket 관련 메서드 =====
  connectWebSocket: () => {
    try {
      const stompClient = new Client({
        webSocketFactory: () =>
          new SockJS("http://i12a602.p.ssafy.io:8080/ws-stomp"),
        connectHeaders: {
          userId: String(useAuthStore.getState().userId),
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = () => {
        set({ wsStatus: "OPEN", error: null });
        // 여기서 구독 로직 제거
      };

      stompClient.onDisconnect = () => {
        set({ wsStatus: "CLOSED" });
      };

      stompClient.onStompError = (frame) => {
        console.error("WebSocket Error:", frame);
        set({ error: "WebSocket connection error", wsStatus: "CLOSED" });
      };

      stompClient.activate();
      set({ stompClient });
    } catch (error) {
      console.error("WebSocket connection error:", error);
      set({
        error: "Failed to establish WebSocket connection",
        wsStatus: "CLOSED",
      });
    }
  },

  disconnectWebSocket: () => {
    const { stompClient } = get();
    if (stompClient) {
      try {
        stompClient.deactivate();
        set({ stompClient: null, wsStatus: "CLOSED" });
      } catch (error) {
        console.error("WebSocket disconnection error:", error);
      }
    }
  },

  sendMessage: (content: string) => {
    const { stompClient, currentRoom } = get();
    if (!stompClient?.connected) {
      console.error("WebSocket is not connected");
      return;
    }
    if (!currentRoom) {
      console.error("No current room selected");
      return;
    }

    try {
      const userId = useAuthStore.getState().userId;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const message = {
        type: "TALK" as const,
        chatRoomId: currentRoom.id,
        userId, // useAuthStore에서 가져온 userId 사용
        content,
        timestamp: new Date().toISOString(),
      };

      stompClient.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      set({ error: "Failed to send message" });
    }
  },

  // ===== Room 관련 메서드 =====
  fetchRooms: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.getRooms();
      if (!response) {
        throw new Error("No response from server");
      }
      set({ rooms: response, isLoading: false });
    } catch (error) {
      console.error("방 목록 조회 에러:", error);
      set({ error: "Failed to fetch rooms", isLoading: false, rooms: [] });
    }
  },

  setCurrentRoom: async (room: ChatRoom | null) => {
    const { stompClient } = get();
    const currentSubscription = get().currentSubscription;

    // 이전 구독 해제
    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }

    set({ currentRoom: room, currentSubscription: null });

    if (room) {
      await get().fetchMessages(room.id);

      if (stompClient?.connected) {
        const newSubscription = stompClient.subscribe(
          `/sub/chat/room/${room.id}`,
          (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              if (receivedMessage.type === "TALK") {
                get().addMessage(receivedMessage);
              }
            } catch (error) {
              console.error("Message parsing error:", error);
            }
          }
        );

        set({ currentSubscription: newSubscription });
      }
    }
  },

  createRoom: async (roomName: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.createRoom({ roomName });
      if (!response) {
        throw new Error("Failed to create room");
      }

      set((state) => ({
        rooms: [...state.rooms, response],
        isLoading: false,
      }));

      return response;
    } catch (error) {
      console.error("방 생성 에러:", error);
      set({ error: "Failed to create room", isLoading: false });
    }
  },
  searchUserByEmail: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.searchUserByEmail(email);
      // 응답을 SearchUserResponse[] 타입으로 명시적 타입 단언
      set({
        searchResults: response as SearchUserResponse[],
        isLoading: false,
      });
    } catch (error) {
      console.error("사용자 검색 실패:", error);
      set({
        error: "Failed to search user",
        isLoading: false,
        searchResults: [],
      });
    }
  },

  // 이메일로 사용자 초대
  inviteUserByEmail: async (roomId: number, email: string) => {
    try {
      set({ isLoading: true, error: null });
      await chatAPI.inviteUserByEmail(roomId, email);
      set({ isLoading: false });
      await get().fetchRooms(); // 방 목록 새로고침
    } catch (error) {
      console.error("초대 실패:", error);
      set({ error: "Failed to invite user", isLoading: false });
    }
  },

  // 검색 결과 초기화
  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  // ===== Message 관련 메서드 =====
  // src/stores/chatStore.ts
  fetchMessages: async (roomId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.getRoomMessages(roomId);

      if (!response) {
        set((state) => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: [],
          },
          isLoading: false,
        }));
        return;
      }

      // response 구조 로깅
      console.log("Messages response:", response);

      const messages = Array.isArray(response) ? response : response.messages;
      const sortedMessages = [...messages].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      set((state) => ({
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: sortedMessages,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error(`메시지 조회 실패 (방 ${roomId}):`, error);
      set((state) => ({
        error: "Failed to fetch messages",
        isLoading: false,
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: [],
        },
      }));
    }
  },

  addMessage: (message: ChatMessage) => {
    set((state) => {
      const currentMessages = state.messagesByRoom[message.chatRoomId] || [];
      // 메시지에 사용자 정보 포함
      const user = useUserStore.getState().currentUser;
      const messageWithUser = {
        ...message,
        user: user?.id === message.userId ? user : undefined,
      };

      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [message.chatRoomId]: [...currentMessages, messageWithUser],
        },
      };
    });
  },

  clearMessages: () => {
    set({
      messagesByRoom: {},
    });
  },

  // ===== State 관리 메서드 =====
  reset: () => {
    const { disconnectWebSocket } = get();
    disconnectWebSocket();
    set({ ...initialState, isInitialized: false });
  },
}));

export default useChatStore;
