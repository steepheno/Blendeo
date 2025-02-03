import * as React from "react";
import { MessageProps } from "@/types/components/chat/chat";

export const Message: React.FC<MessageProps> = ({
  avatar,
  sender,
  time,
  content,
  isUser,
}) => {
  return (
    <div
      className={`flex gap-3 mb-4 w-full ${isUser ? "justify-end" : ""}`}
      role="listitem"
      aria-label={`Message from ${sender}`}
    >
      {!isUser && avatar && (
        <img
          src={avatar}
          alt={`${sender}'s profile`}
          className="object-cover w-10 h-10 rounded-3xl"
        />
      )}
      <div
        className={`flex flex-col max-w-[520px] ${isUser ? "items-end" : ""}`}
      >
        {!isUser && (
          <div className="flex gap-3 items-center mb-1">
            <div className="text-base font-bold text-black">{sender}</div>
            <time className="text-sm text-gray-400">{time}</time>
          </div>
        )}
        <div
          className={`px-6 py-2 text-base leading-6 rounded-xl max-sm:px-4 max-sm:py-2 max-sm:max-w-[80%] ${
            isUser ? "text-white bg-violet-700" : "text-black bg-gray-100"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};
