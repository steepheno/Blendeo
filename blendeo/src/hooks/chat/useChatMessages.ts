import { useCallback, useMemo } from "react";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/api/chat";
import { useUserStore } from "@/stores/userStore";

export const useChatMessages = (roomId: number) => {
  const { messagesByRoom, addMessage, clearMessages } = useChatStore();
  const currentUser = useUserStore((state) => state.currentUser); // 추가

  const messages = useMemo(
    () => messagesByRoom[roomId] || [],
    [messagesByRoom, roomId]
  );

  // 메시지에 isOwnMessage 속성 추가
  const processedMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        isOwnMessage: message.userId === currentUser?.id,
      })),
    [messages, currentUser?.id]
  );

  const sortedMessages = useMemo(
    () =>
      [...processedMessages].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [processedMessages]
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
    currentUser,
  };
};
