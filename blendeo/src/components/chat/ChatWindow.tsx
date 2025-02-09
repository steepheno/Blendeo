// src/components/chat/ChatWindow.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ChatWindow as ChatWindowType,
  ChatMessage,
} from "@/types/components/chat/chat";
import { useChatStore } from "@/stores/chatStore";

export const ChatWindow: React.FC<ChatWindowType> = ({
  user,
  onClose,
  messages,
  onSendMessage,
  isConnected,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUserId } = useChatStore();

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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.senderId === currentUserId;

    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[70%] p-3 rounded-lg ${
            isCurrentUser
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold mb-1">
              {isCurrentUser ? "You" : user.name}
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
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅방 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <span
              className={`text-sm ${user.isOnline ? "text-green-500" : "text-gray-500"}`}
            >
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
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

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* 연결 상태 표시 */}
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

export default ChatWindow;
