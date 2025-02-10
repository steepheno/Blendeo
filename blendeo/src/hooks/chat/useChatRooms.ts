// src/hooks/useChatRooms.ts
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";

export const useChatRooms = () => {
  const { rooms, fetchRooms, createRoom, isLoading, error } = useChatStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    createRoom,
    fetchRooms, // fetchRooms도 반환
    isLoading,
    error,
  };
};
