// src/hooks/useChatRooms.ts
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";

export const useChatRooms = () => {
  const { rooms, fetchRooms, createRoom, isLoading, error } = useChatStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // 추가

  useEffect(() => {
    if (isAuthenticated) {
      // 인증 상태 확인 추가
      fetchRooms();
    }
  }, [fetchRooms, isAuthenticated]);

  return {
    rooms,
    createRoom,
    fetchRooms,
    isLoading,
    error,
  };
};
