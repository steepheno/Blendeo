// src/components/chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage, ChatRoom, RoomParticipant } from "@/types/api/chat";
import { useAuthStore } from "@/stores/authStore";
import { ChatMessages } from "./ChatMessages";
import { toast } from "sonner";

// 컴포넌트의 props 인터페이스 정의
// 채팅방 정보, 메시지 목록, 메시지 전송 핸들러, 연결 상태 등을 포함
interface ChatWindowProps {
  room: ChatRoom; // ChatRoom 타입으로 변경
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  participants: RoomParticipant[]; // 참가자 목록 추가
}

// 채팅 창 컴포넌트
export const ChatWindow: React.FC<ChatWindowProps> = ({
  room,
  onClose,
  messages,
  onSendMessage,
  isConnected,
  participants,
}) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
  const [newMessage, setNewMessage] = useState(""); // 새 메시지 상태 관리
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 스크롤 맨 아래로 이동을 위한 ref
  const userId = useAuthStore((state) => state.userId); // 현재 로그인된 사용자 ID

  // 화상 통화 시작 핸들러
  const handleVideoCall = async () => {
    try {
      // 연결 상태 확인
      if (!isConnected) {
        toast.error("채팅 연결이 끊어져 있습니다. 연결 상태를 확인해주세요.");
        return;
      }

      // 화상 통화 페이지로 이동 (채팅방 ID와 이름 전달)
      navigate(`/chat/${room.id}/video`, {
        state: { roomName: room.name },
      });
    } catch (error) {
      // 화상 통화 초기화 실패 시 에러 처리
      console.error("화상통화 초기화 실패:", error);
      toast.error("화상통화를 시작할 수 없습니다. 다시 시도해주세요.");
    }
  };

  // 메시지 목록을 가장 아래로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지 목록이 변경될 때마다 스크롤을 가장 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || !isConnected || !newMessage.trim()) return;

    try {
      setIsSending(true);
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅방 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mr-3">
            {room.name ? room.name.charAt(0) : "?"}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{room.name || "채팅방"}</h2>
            {participants && (
              <p className="text-sm text-gray-500">
                {participants.length} 명의 참가자
              </p>
            )}
          </div>
        </div>

        {/* 연결 상태 및 액션 버튼 */}
        <div className="flex items-center gap-3">
          {/* 연결 상태 표시 */}
          <span
            className={`text-sm ${isConnected ? "text-green-500" : "text-gray-500"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>

          {/* 화상 통화 및 채팅방 닫기 버튼 */}
          <div className="flex items-center gap-1">
            {/* 화상 통화 버튼 */}
            <button
              onClick={handleVideoCall}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Start video call"
              disabled={!isConnected}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  isConnected
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-gray-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* 채팅방 닫기 버튼 */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 목록 컨테이너 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessages
            key={`${message.chatRoomId}-${message.userId}-${message.createdAt}`}
            message={{
              ...message,
              type: "TALK",
              chatRoomId: room.id,
            }}
            isCurrentUser={message.userId === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 연결 끊김 상태 알림 */}
      {!isConnected && (
        <div className="bg-yellow-50 p-2 text-center text-yellow-800 text-sm">
          Connecting... Messages will be sent when connection is restored.
        </div>
      )}

      {/* 메시지 입력 폼 */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          {/* 메시지 입력 필드 */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          {/* 메시지 전송 버튼 */}
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              isConnected
                ? "bg-violet-700 text-white hover:bg-violet-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
