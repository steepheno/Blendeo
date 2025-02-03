import * as React from "react";
import { UserProps } from "@/types/components/chat/chat";

// UserProps 타입을 확장하여 onClick 추가
interface ExtendedUserProps extends UserProps {
  onClick: () => void;
}

export const UserItem: React.FC<ExtendedUserProps> = ({
  name,
  message,
  isOnline,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      className="flex gap-4 items-center px-4 py-2 w-full whitespace-nowrap min-h-[72px] cursor-pointer hover:bg-gray-50 transition-colors duration-200"
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
