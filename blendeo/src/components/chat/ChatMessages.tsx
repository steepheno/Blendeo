/**
 * 채팅 메시지를 표시하는 컴포넌트
 * 사용자 구분에 따라 다른 스타일을 적용하며, 프로필 이미지, 닉네임, 메시지 내용, 시간을 표시
 */
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
  /**
   * 메시지 작성 시간을 포맷팅하는 함수
   * @param createdAt - ISO 형식의 시간 문자열 (예: "2025-02-10T11:13:16")
   * @returns 포맷팅된 시간 문자열 (예: "오후 2:30")
   */
  const formatTime = (createdAt: string) => {
    try {
      if (!createdAt) return "시간 정보 없음";

      const date = new Date(createdAt);

      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", createdAt);
        return "잘못된 시간 정보";
      }

      return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Error formatting time:", error, "for date:", createdAt);
      return "시간 정보 오류";
    }
  };

  // 메시지 유효성 검사
  if (message.type !== "TALK") {
    console.error("Unsupported message type:", message.type);
    return null;
  }

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
      key={`${message.chatRoomId}-${message.userId}-${message.createdAt}`}
    >
      {/* 상대방 메시지일 때의 프로필 이미지 */}
      {!isCurrentUser && message.profileImage && (
        <div className="flex-shrink-0 mr-3">
          <img
            src={message.profileImage}
            alt={`${message.nickname}의 프로필`}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/default-profile.png"; // 기본 프로필 이미지로 대체
              e.currentTarget.alt = "프로필 이미지 로드 실패";
            }}
          />
        </div>
      )}

      {/* 메시지 말풍선 */}
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isCurrentUser ? "bg-violet-700 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <div className="flex flex-col">
          {/* 발신자 닉네임 */}
          <span className="text-sm font-semibold mb-1">
            {isCurrentUser ? "나" : message.nickname}
          </span>

          {/* 메시지 내용 */}
          <span className="break-words whitespace-pre-wrap">
            {message.content}
          </span>

          {/* 메시지 시간 */}
          <span
            className={`text-xs mt-1 ${
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>

      {/* 내 메시지일 때의 프로필 이미지 */}
      {isCurrentUser && message.profileImage && (
        <div className="flex-shrink-0 ml-3">
          <img
            src={message.profileImage}
            alt={`${message.nickname}의 프로필`}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/default-profile.png";
              e.currentTarget.alt = "프로필 이미지 로드 실패";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
