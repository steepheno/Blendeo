// src/hooks/useChatRoom.ts
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";

export const useChatRoom = (roomId: number | null) => {
  const {
    fetchMessages,
    setCurrentRoom,
    currentRoom,
    messagesByRoom,
    rooms,
    sendMessage,
    inviteUser,
  } = useChatStore();

  const messages = roomId ? messagesByRoom[roomId] || [] : [];

  useEffect(() => {
    if (roomId) {
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        setCurrentRoom(room);
        fetchMessages(roomId);
      }
    }

    return () => {
      setCurrentRoom(null);
    };
  }, [roomId, rooms, setCurrentRoom, fetchMessages]);

  return {
    room: currentRoom,
    messages,
    sendMessage,
    inviteUser,
  };
};
