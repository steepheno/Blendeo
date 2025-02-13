// src/components/chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types/api/chat";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { ChatMessages } from "./ChatMessages";

interface ChatWindowProps {
  room: {
    id: number;
    name: string;
  };
  onClose: () => void;
  messages: ChatMessage[] & { isOwnMessage?: boolean }; // isOwnMessage 속성 추가
  onSendMessage: (message: string) => void;
  isConnected: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  room,
  onClose,
  messages,
  onSendMessage,
  isConnected,
}) => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useAuthStore((state) => state.userId);
  const fetchRoomParticipants = useChatStore(
    (state) => state.fetchRoomParticipants
  );

  const handleVideoCall = async () => {
    try {
      // 화상 통화 시작 전에 참여자 정보 로드
      const participants = await fetchRoomParticipants(room.id);
      if (participants.length > 0) {
        navigate(`/chat/${room.id}/video`);
      } else {
        console.error("No participants found in the room");
      }
    } catch (error) {
      console.error("Failed to initialize video call:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 부분 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 mr-3">
            {room.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{room.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm ${isConnected ? "text-green-500" : "text-gray-500"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <div className="flex items-center gap-1">
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

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessages
            key={`${message.chatRoomId}-${message.userId}-${message.timestamp}`}
            message={message}
            isCurrentUser={message.userId === userId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 연결 상태 알림 */}
      {!isConnected && (
        <div className="bg-yellow-50 p-2 text-center text-yellow-800 text-sm">
          Connecting... Messages will be sent when connection is restored.
        </div>
      )}

      {/* 메시지 입력 폼 */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              isConnected
                ? "bg-blue-500 text-white hover:bg-blue-600"
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
