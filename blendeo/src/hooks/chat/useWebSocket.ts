import { useEffect, useCallback, useRef } from "react";
import { useChatStore } from "@/stores/chatStore";
import { StompSubscription } from "@stomp/stompjs";

interface WebSocketHookResult {
  sendMessage: (content: string) => void;
  closeConnection: () => void;
  isConnected: boolean;
}

export const useWebSocket = (): WebSocketHookResult => {
  const {
    currentRoom,
    wsStatus,
    stompClient,
    connectWebSocket,
    disconnectWebSocket,
    sendMessage: storeSendMessage,
    addMessage,
  } = useChatStore();

  const hasInitialized = useRef(false);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  // 초기 연결 설정
  useEffect(() => {
    if (!hasInitialized.current) {
      if (!stompClient && wsStatus === "CLOSED") {
        connectWebSocket();
      }
      hasInitialized.current = true;
    }
  }, [connectWebSocket, stompClient, wsStatus]);

  // 구독 관리
  useEffect(() => {
    if (currentRoom && stompClient?.connected) {
      // 이전 구독 취소
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      // 새로운 구독 설정
      subscriptionRef.current = stompClient.subscribe(
        `/sub/chat/room/${currentRoom.id}`,
        (message) => {
          const receivedMessage = JSON.parse(message.body);
          addMessage(receivedMessage);
        }
      );
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [currentRoom, stompClient, addMessage]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (wsStatus === "OPEN") {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        disconnectWebSocket();
        hasInitialized.current = false;
      }
    };
  }, [disconnectWebSocket, wsStatus]);

  // 메시지 전송 메서드
  const sendMessage = useCallback(
    (content: string) => {
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
        storeSendMessage(content);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [currentRoom, stompClient, connectWebSocket, storeSendMessage]
  );

  const closeConnection = useCallback(() => {
    if (wsStatus === "OPEN") {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      disconnectWebSocket();
      hasInitialized.current = false;
    }
  }, [wsStatus, disconnectWebSocket]);

  return {
    sendMessage,
    closeConnection,
    isConnected: Boolean(stompClient?.connected && wsStatus === "OPEN"),
  };
};
