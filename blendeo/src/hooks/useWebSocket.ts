// src/hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "../stores/chatStore";
import { WebSocketMessage } from "../types/components/chat/chat";

export const useWebSocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { setConnectionStatus, currentUserId } = useChatStore();

  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { addMessage, updateUserLastMessage, selectedUser } =
      useChatStore.getState();

    if (message.type === "CHAT" && selectedUser) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: message.sender,
        receiverId: selectedUser.id,
        content: message.content,
        timestamp: message.timestamp,
      };

      addMessage(selectedUser.id, newMessage);
      updateUserLastMessage(
        selectedUser.id,
        message.content,
        message.timestamp
      );
    }
  }, []);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setConnectionStatus(true);
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setConnectionStatus(false);
        // 재연결 시도
        setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setConnectionStatus(false);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("WebSocket connection error:", error);
      setConnectionStatus(false);
    }
  }, [url, setConnectionStatus, handleMessage]);

  const sendMessage = useCallback(
    (message: Omit<WebSocketMessage, "timestamp">) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            ...message,
            timestamp: Date.now(),
          })
        );
      } else {
        console.error("WebSocket is not connected");
      }
    },
    []
  );

  const closeConnection = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      connect();
    }
    return () => {
      closeConnection();
    };
  }, [connect, closeConnection, currentUserId]);

  return {
    sendMessage,
    closeConnection,
  };
};
