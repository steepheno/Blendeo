// src/components/chat/ChatMessages.tsx
import React from "react";
import type { ChatMessage } from "@/types/api/chat";

interface ChatMessagesProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  message,
  isCurrentUser,
}) => {
  const formatTime = (timestamp: string) => {
    try {
      // UTC 시간을 Date 객체로 변환
      const date = new Date(timestamp);

      // 한국 시간으로 변환 (UTC+9)
      const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

      // 오전/오후 포함하여 시간 포맷팅
      return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(koreanTime);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "시간 정보 없음";
    }
  };

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isCurrentUser && message.profileImage && (
        <div className="flex-shrink-0 mr-3">
          <img
            src={message.profileImage}
            alt={message.nickname}
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold mb-1">
            {isCurrentUser ? "나" : message.nickname || "알 수 없는 사용자"}
          </span>
          <span className="break-words">{message.content}</span>
          <span
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
      {isCurrentUser && message.profileImage && (
        <div className="flex-shrink-0 ml-3">
          <img
            src={message.profileImage}
            alt={message.nickname}
            className="w-8 h-8 rounded-full"
          />
        </div>
      )}
    </div>
  );
};
