import { useCallback, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/api/chat";

export const useChatMessages = (roomId: number) => {
  const { messagesByRoom, addMessage, clearMessages } = useChatStore();

  // messages를 useMemo로 감싸서 의존성 문제 해결
  const messages = useMemo(
    () => messagesByRoom[roomId] || [],
    [messagesByRoom, roomId]
  );

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [messages]
  );

  const groupMessagesByDate = useCallback(() => {
    return messages.reduce(
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
  }, [messages]);

  return {
    messages: sortedMessages,
    groupedMessages: groupMessagesByDate(),
    addMessage,
    clearMessages,
  };
};
