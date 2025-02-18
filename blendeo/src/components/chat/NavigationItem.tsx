// src/components/chat/NavigationItem.tsx
import * as React from "react";
import type { NavigationItemProps } from "@/types/components/chat/chat";

export const NavigationItem: React.FC<NavigationItemProps> = ({
  room,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 w-full cursor-pointer
        hover:bg-gray-50 transition-colors duration-200
        ${isSelected ? "bg-gray-100" : ""}
      `}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      {/* 채팅방 아바타/이니셜 */}
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
        {room.name ? room.name.charAt(0).toUpperCase() : "?"}
      </div>

      {/* 채팅방 정보 */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between">
          {/* 채팅방 이름 */}
          <span className="font-medium text-sm text-gray-900 truncate">
            {room.name || "새로운 채팅방"}
          </span>

          {/* 마지막 메시지 시간 */}
          {room.updatedAt && (
            <span className="text-xs text-gray-500">
              {new Date(room.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* 마지막 업데이트 시간 */}
        <span className="text-xs text-gray-500 truncate">
          {new Date(room.createdAt).toLocaleDateString()} 생성됨
        </span>
      </div>
    </div>
  );
};

export default NavigationItem;
