import { useEffect, useCallback, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import { ChatRoom } from "@/types/api/chat";

// 재시도 관련 상수
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// WebSocket 상태 체크를 위한 hook
const useWebSocketStatus = () => {
  const wsStatus = useChatStore((state) => state.wsStatus);
  const isWebSocketReady = wsStatus === "OPEN";

  return {
    isWebSocketReady,
    wsStatus,
  };
};

export const useChatRooms = () => {
  const {
    rooms,
    fetchRooms,
    createRoom,
    isLoading,
    error,
    setCurrentRoom,
    fetchMessages,
    fetchRoomParticipants,
  } = useChatStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isWebSocketReady } = useWebSocketStatus();

  // 채팅방 생성 기본 함수
  // useChatRooms.ts
  const handleCreateRoom = useCallback(
    async (userIds: number[]) => {
      try {
        const newRoom = await createRoom(userIds);
        console.log("이것은 유저아이디: " + userIds);
        if (newRoom) {
          await fetchRooms();
          await setCurrentRoom(newRoom);
          // WebSocket이 필요한 작업은 연결 상태 확인 후 수행
          if (isWebSocketReady) {
            await fetchMessages(newRoom.id);
            await fetchRoomParticipants(newRoom.id);
          }
          return newRoom;
        }
      } catch (error) {
        console.error("Error creating room:", error);
        throw error;
      }
    },
    [
      createRoom,
      fetchMessages,
      fetchRoomParticipants,
      fetchRooms,
      isWebSocketReady,
      setCurrentRoom,
    ]
  );

  // 재시도 로직이 포함된 방 생성 함수
  const handleCreateRoomWithRetry = useCallback(
    async (userIds: number[], retryCount = 0): Promise<ChatRoom | void> => {
      try {
        return await handleCreateRoom(userIds);
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return handleCreateRoomWithRetry(userIds, retryCount + 1);
        }
        throw error;
      }
    },
    [handleCreateRoom]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [fetchRooms, isAuthenticated]);

  const sortedRooms = useMemo(() => {
    return [...rooms].sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() -
        new Date(a.lastMessage?.createdAt || 0).getTime()
    );
  }, [rooms]);

  return {
    rooms: sortedRooms,
    createRoom: handleCreateRoomWithRetry,
    fetchRooms,
    isLoading,
    error,
  };
};

export default useChatRooms;
