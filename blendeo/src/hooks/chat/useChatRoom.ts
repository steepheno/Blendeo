// src/hooks/chat/useChatRoom.ts
import { useEffect, useCallback, useMemo, useState } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";

export const useChatRoom = (roomId: number | null) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const {
    fetchMessages,
    setCurrentRoom,
    currentRoom,
    rooms,
    sendMessage,
    searchUserByEmail,
    searchResults,
    clearSearchResults,
    fetchRoomParticipants,
    roomParticipants,
    editRoomName,
  } = useChatStore();

  const currentUser = useUserStore((state) => state.currentUser);

  // 현재 채팅방의 메시지 목록
  const currentMessages = useChatStore((state) =>
    roomId ? state.messagesByRoom[roomId] || [] : []
  );

  // 현재 채팅방의 참가자 목록
  const currentParticipants = useMemo(
    () => (roomId ? roomParticipants[roomId] || [] : []),
    [roomId, roomParticipants]
  );

  // 채팅방 이름 변경 핸들러
  const handleEditRoomName = useCallback(
    async (newName: string) => {
      if (!roomId) return;

      try {
        await editRoomName(roomId, newName);
      } catch (error) {
        console.error("Error editing room name:", error);
        throw error;
      }
    },
    [roomId, editRoomName]
  );

  // 사용자 검색 핸들러
  const handleSearchUser = useCallback(
    async (email: string) => {
      try {
        await searchUserByEmail(email);
      } catch (error) {
        console.error("Error searching user:", error);
        throw error;
      }
    },
    [searchUserByEmail]
  );

  // 채팅방 초기화
  const initializeRoom = useCallback(async () => {
    if (roomId) {
      setIsInitializing(true);
      try {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
          await setCurrentRoom(room);
          await Promise.all([
            fetchMessages(roomId),
            fetchRoomParticipants(roomId),
          ]);
        }
      } catch (error) {
        console.error("Error initializing room:", error);
      } finally {
        setIsInitializing(false);
      }
    }
  }, [roomId, rooms, setCurrentRoom, fetchMessages, fetchRoomParticipants]);

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed) {
      initializeRoom();
    }

    return () => {
      isSubscribed = false;
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null);
        clearSearchResults();
      }
    };
  }, [
    initializeRoom,
    currentRoom?.id,
    roomId,
    setCurrentRoom,
    clearSearchResults,
  ]);

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!roomId) return;
      sendMessage(content);
    },
    [roomId, sendMessage]
  );

  return {
    room: currentRoom,
    messages: currentMessages,
    participants: currentParticipants,
    sendMessage: handleSendMessage,
    searchUser: handleSearchUser,
    searchResults,
    clearSearchResults,
    editRoomName: handleEditRoomName,
    currentUser,
    isInitializing, // 반환값에 추가
  };
};

export default useChatRoom;
