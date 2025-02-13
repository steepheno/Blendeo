// src/hooks/useChatMessages.ts
import { useCallback, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/api/chat";
import { useUserStore } from "@/stores/userStore";

export const useChatMessages = (roomId: number) => {
  const { messagesByRoom, addMessage, clearMessages } = useChatStore();
  const currentUser = useUserStore((state) => state.currentUser);

  // 메시지 처리 (isOwnMessage 추가)
  const processedMessages = useMemo(() => {
    return (messagesByRoom[roomId] || []).map((message) => ({
      ...message,
      isOwnMessage: message.userId === currentUser?.id,
    }));
  }, [messagesByRoom, roomId, currentUser?.id]);

  // 메시지 시간순 정렬
  const sortedMessages = useMemo(
    () =>
      [...processedMessages].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [processedMessages]
  );

  // 날짜별 메시지 그룹화
  const groupMessagesByDate = useCallback(() => {
    return sortedMessages.reduce(
      (groups, message) => {
        const date = new Date(message.timestamp).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
      },
      {} as Record<string, ChatMessage[]>
    );
  }, [sortedMessages]);

  return {
    messages: sortedMessages,
    groupedMessages: groupMessagesByDate(),
    addMessage,
    clearMessages,
    currentUser,
  };
};
