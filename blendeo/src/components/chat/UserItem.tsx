import * as React from "react";

interface ChatRoomItemProps {
  id: number;
  name: string;
  onClick: () => void;
  isSelected: boolean;
}

export const UserItem: React.FC<ChatRoomItemProps> = ({
  name,
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
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-3xl bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
          {name.charAt(0)}
        </div>
        <div className="ml-4 flex flex-col justify-center flex-1 min-w-0">
          <div className="text-base font-medium text-black truncate">
            {name}
          </div>
        </div>
      </div>
    </div>
  );
};
