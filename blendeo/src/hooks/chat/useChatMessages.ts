// src/hooks/chat/useChatMessages.ts
import { useCallback, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/api/chat";
import { useUserStore } from "@/stores/userStore";

interface ProcessedMessage extends ChatMessage {
  isOwnMessage: boolean;
}

export const useChatMessages = (roomId: number) => {
  const { messagesByRoom, addMessage, clearMessages } = useChatStore();
  const currentUser = useUserStore((state) => state.currentUser);

  // 메시지 처리: isOwnMessage 속성 추가
  const processedMessages = useMemo(() => {
    return (messagesByRoom[roomId] || []).map((message: ChatMessage) => ({
      ...message,
      isOwnMessage: message.userId === currentUser?.id,
    }));
  }, [messagesByRoom, roomId, currentUser?.id]);

  // 메시지 시간순 정렬
  const sortedMessages = useMemo(
    () =>
      [...processedMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [processedMessages]
  );

  // 날짜별 메시지 그룹화
  const groupMessagesByDate = useCallback(() => {
    return sortedMessages.reduce(
      (groups, message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
      },
      {} as Record<string, ProcessedMessage[]>
    );
  }, [sortedMessages]);

  // 새 메시지 추가 핸들러
  const handleAddMessage = useCallback(
    (message: ChatMessage) => {
      if (message.chatRoomId === roomId) {
        addMessage(message);
      }
    },
    [roomId, addMessage]
  );

  return {
    messages: sortedMessages,
    groupedMessages: groupMessagesByDate(),
    addMessage: handleAddMessage,
    clearMessages,
    currentUser,
  };
};

export default useChatMessages;
