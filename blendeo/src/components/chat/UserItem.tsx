import * as React from "react";
import { UserItemProps } from "@/types/components/chat/chat";

export const UserItem: React.FC<UserItemProps> = ({
  name,
  message,
  isOnline,
  imageUrl,
  onClick,
  isSelected,
}) => {
  return (
    <div
      className={`p-4 hover:bg-gray-100 cursor-pointer ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          loading="lazy"
          src={imageUrl}
          alt={`${name}'s profile`}
          className="object-contain shrink-0 w-14 rounded-3xl aspect-square"
        />
        {isOnline !== undefined && (
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
              ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
          />
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="text-base font-medium text-black truncate">{name}</div>
        {message && (
          <div className="text-sm text-gray-600 truncate">{message}</div>
        )}
        {isOnline !== undefined && (
          <div className="text-sm text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </div>
        )}
      </div>
    </div>
  );
};
