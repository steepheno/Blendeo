// src/components/chat/Input.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChatInputProps } from "@/types/components/chat/chat";

export const Input: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 input에 포커스
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !isSubmitting && !disabled) {
      try {
        setIsSubmitting(true);
        await onSend(message);
        setMessage("");

        // 메시지 전송 후 input에 포커스
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Enter 키로 전송, Shift + Enter로 줄바꿈
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 px-4 py-2 bg-white border-t border-gray-200"
    >
      <label htmlFor="messageInput" className="sr-only">
        메시지를 입력하세요
      </label>

      <input
        ref={inputRef}
        id="messageInput"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "연결 중입니다..." : "메시지를 입력하세요..."}
        disabled={disabled || isSubmitting}
        className={`
          flex-1 px-4 py-2 text-base text-gray-700 
          bg-gray-100 rounded-xl border-none
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-violet-500
          disabled:bg-gray-50 disabled:text-gray-400
          transition-colors duration-200
          ${disabled ? "cursor-not-allowed" : "cursor-text"}
        `}
        maxLength={1000} // 메시지 길이 제한
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled || isSubmitting}
        className={`
          px-4 py-2 text-sm font-medium text-white
          rounded-xl border-none
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
          transition-colors duration-200
          ${
            !message.trim() || disabled || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-700 hover:bg-violet-800 cursor-pointer"
          }
        `}
        aria-label="메시지 보내기"
      >
        {isSubmitting ? (
          // 전송 중 로딩 표시
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>전송중</span>
          </div>
        ) : (
          "보내기"
        )}
      </button>
    </form>
  );
};

export default Input;
