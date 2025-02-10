import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { chatAPI } from "@/api/chat";
import type { ChatRoom, ChatMessage, WebSocketStatus } from "@/types/api/chat";

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messagesByRoom: Record<number, ChatMessage[]>;
  isLoading: boolean;
  error: string | null;
  wsStatus: WebSocketStatus;
  stompClient: Client | null;
  isInitialized: boolean; // 초기화 상태 추가
}
// Actions 인터페이스 정의
interface ChatActions {
  // WebSocket 관련
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendMessage: (content: string) => void;

  // Room 관련
  fetchRooms: () => Promise<void>;
  setCurrentRoom: (room: ChatRoom | null) => void;
  createRoom: (roomName: string) => Promise<ChatRoom | void>;
  inviteUser: (roomId: number, userId: number) => Promise<void>;

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
  isLoading: false,
  error: null,
  wsStatus: "CLOSED",
  stompClient: null,
  isInitialized: false,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // ===== 초기화 메서드 추가 =====
  initialize: async () => {
    const { connectWebSocket, fetchRooms } = get();

    if (!get().isInitialized) {
      await fetchRooms();
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = async () => {
        set({ wsStatus: "OPEN", error: null });
        const { currentRoom } = get();

        // 웹소켓 연결 시 현재 방의 메시지를 다시 불러옵니다
        if (currentRoom) {
          await get().fetchMessages(currentRoom.id);
          stompClient.subscribe(
            `/sub/chat/room/${currentRoom.id}`,
            (message) => {
              try {
                const receivedMessage = JSON.parse(message.body) as ChatMessage;
                if (receivedMessage.type === "TALK") {
                  get().addMessage(receivedMessage);
                }
              } catch (error) {
                console.error("Message parsing error:", error);
              }
            }
          );
        }
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
      const userData = localStorage.getItem("user");
      if (!userData) {
        console.error("User data not found");
        return;
      }

      const { id: userId } = JSON.parse(userData);
      const message = {
        type: "TALK",
        chatRoomId: currentRoom.id,
        userId,
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
    const currentRoom = get().currentRoom;

    // 이전 방 구독 해제
    if (currentRoom && stompClient) {
      try {
        stompClient.unsubscribe(`/sub/chat/room/${currentRoom.id}`);
      } catch (error) {
        console.error("Unsubscribe error:", error);
      }
    }

    set({ currentRoom: room });

    // 새로운 방이 선택되면 항상 메시지를 가져옵니다
    if (room) {
      await get().fetchMessages(room.id);

      if (stompClient?.connected) {
        stompClient.subscribe(`/sub/chat/room/${room.id}`, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body) as ChatMessage;
            if (receivedMessage.type === "TALK") {
              get().addMessage(receivedMessage);
            }
          } catch (error) {
            console.error("Message parsing error:", error);
          }
        });
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

  inviteUser: async (roomId: number, userId: number) => {
    try {
      set({ isLoading: true, error: null });
      await chatAPI.inviteUser(roomId, userId);
      set({ isLoading: false });
      await get().fetchRooms();
    } catch (error) {
      console.error("초대 실패:", error);
      set({ error: "Failed to invite user", isLoading: false });
    }
  },

  // ===== Message 관련 메서드 =====
  fetchMessages: async (roomId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await chatAPI.getRoomMessages(roomId);

      if (!response || !response.messages) {
        set((state) => ({
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: [],
          },
          isLoading: false,
        }));
        return;
      }

      // 모든 메시지를 포함하도록 수정
      const messages = response.messages;
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
      console.error("메시지 조회 실패:", error);
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
      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [message.chatRoomId]: [...currentMessages, message],
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
