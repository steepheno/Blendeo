// src/components/chat/ChatSearchBar.tsx
import * as React from "react";
import { ChatSearchBarProps } from "@/types/components/chat/chat";

export const ChatSearchBar: React.FC<ChatSearchBarProps> = ({
  placeholder,
  iconSrc,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col w-full min-h-[48px] min-w-[160px]">
      <div className="flex items-center w-full h-12 bg-gray-100 rounded-xl">
        <div className="flex justify-center items-center pl-4 w-10">
          <img
            loading="lazy"
            src={iconSrc}
            alt="Search icon"
            className="w-5 h-5 object-contain"
          />
        </div>
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label="Search"
          className="flex-1 h-full py-2 pr-4 pl-2 text-base text-gray-500 bg-transparent outline-none min-w-0"
        />
      </div>
    </div>
  );
};
