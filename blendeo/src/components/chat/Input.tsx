import * as React from "react";
import { ChatInputProps } from "@/types/components/chat/chat";

export const Input: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 px-4 py-0 mt-auto min-h-[48px] max-sm:px-2 max-sm:py-0"
    >
      <label htmlFor="messageInput" className="sr-only">
        Type a message
      </label>
      <input
        id="messageInput"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 text-base text-gray-500 bg-gray-100 rounded-xl border-[none]"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-violet-700 rounded-xl cursor-pointer border-[none] hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
};
