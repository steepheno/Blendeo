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
    inviteUserByEmail, // userId 대신 email로 초대하는 함수로 변경
    searchUserByEmail, // 이메일 검색 함수 추가
    searchResults, // 검색 결과 추가
    clearSearchResults, // 검색 결과 초기화 함수 추가
  } = useChatStore();
  const currentUser = useUserStore((state) => state.currentUser);

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
        clearSearchResults(); // 방을 나갈 때 검색 결과 초기화
      }
    };
  }, [
    initializeRoom,
    currentRoom?.id,
    roomId,
    setCurrentRoom,
    clearSearchResults,
  ]);

  return {
    room: currentRoom,
    messages: currentMessages,
    sendMessage,
    inviteUserByEmail, // 변경된 초대 함수 반환
    searchUserByEmail, // 검색 함수 추가
    searchResults, // 검색 결과 추가
    clearSearchResults, // 검색 결과 초기화 함수 추가
    currentUser,
  };
};
