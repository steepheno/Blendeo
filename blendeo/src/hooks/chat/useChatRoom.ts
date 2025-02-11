// src/hooks/useChatRoom.ts
import { useEffect, useCallback } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";

export const useChatRoom = (roomId: number | null) => {
  const {
    fetchMessages,
    setCurrentRoom,
    currentRoom,
    rooms,
    sendMessage,
    inviteUser,
  } = useChatStore();
  const currentUser = useUserStore((state) => state.currentUser);

  // 현재 방의 메시지를 useChatStore에서 직접 가져오기
  const currentMessages = useChatStore((state) =>
    roomId ? state.messagesByRoom[roomId] || [] : []
  );

  const initializeRoom = useCallback(async () => {
    if (roomId) {
      console.log(`방 ${roomId} 초기화 시작`);
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        await setCurrentRoom(room);
        console.log(`방 ${roomId} 메시지 가져오기 시작`);
        await fetchMessages(roomId);
      }
    }
  }, [roomId, rooms, setCurrentRoom, fetchMessages]);

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      initializeRoom();
    }

    return () => {
      isSubscribed = false;
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null);
      }
    };
  }, [initializeRoom, currentRoom?.id, roomId, setCurrentRoom]);

  return {
    room: currentRoom,
    messages: currentMessages,
    sendMessage,
    inviteUser,
    currentUser,
  };
};
