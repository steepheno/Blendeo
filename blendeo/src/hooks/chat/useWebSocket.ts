// src/hooks/chat/useWebSocket.ts
import { useEffect, useCallback, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import type { ChatStore } from "@/stores/chatStore";

interface WebSocketHookResult {
  sendMessage: (content: string, createdAt?: string) => void;
  closeConnection: () => void;
  isConnected: boolean;
}

export const useWebSocket = (): WebSocketHookResult => {
  const hasInitialized = useRef(false);

  const {
    currentRoom,
    wsStatus,
    stompClient,
    connectWebSocket,
    disconnectWebSocket,
    sendMessage: storeSendMessage,
  } = useChatStore() as ChatStore;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.userId);

  // 초기 연결 설정
  useEffect(() => {
    if (!hasInitialized.current && isAuthenticated && userId) {
      if (!stompClient && wsStatus === "CLOSED") {
        connectWebSocket();
      }
      hasInitialized.current = true;
    }
  }, [connectWebSocket, stompClient, wsStatus, isAuthenticated, userId]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (wsStatus === "OPEN") {
        disconnectWebSocket();
        hasInitialized.current = false;
      }
    };
  }, [disconnectWebSocket, wsStatus]);

  // 메시지 전송 메서드
  const sendMessage = useCallback(
    (content: string, createdAt?: string) => {
      if (!isAuthenticated || !userId) {
        console.error("User is not authenticated");
        return;
      }

      if (!stompClient?.connected) {
        console.log("No connection, attempting to reconnect...");
        connectWebSocket();
        return;
      }

      if (!currentRoom) {
        console.error("No current room selected");
        return;
      }

      try {
        storeSendMessage(content, createdAt);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [
      currentRoom,
      stompClient,
      connectWebSocket,
      storeSendMessage,
      isAuthenticated,
      userId,
    ]
  );

  const closeConnection = useCallback(() => {
    if (wsStatus === "OPEN") {
      disconnectWebSocket();
      hasInitialized.current = false;
    }
  }, [wsStatus, disconnectWebSocket]);

  return {
    sendMessage,
    closeConnection,
    isConnected: Boolean(
      stompClient?.connected && wsStatus === "OPEN" && isAuthenticated
    ),
  };
};

export default useWebSocket;
