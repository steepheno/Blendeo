import * as React from "react";
import { UserProps } from "../../types/types";

export const UserItem: React.FC<UserProps> = ({ name, message, isOnline, imageUrl }) => {
  return (
    <div className="flex gap-4 items-center px-4 py-2 w-full whitespace-nowrap min-h-[72px]">
      <img
        loading="lazy"
        src={imageUrl}
        alt={`${name}'s profile`}
        className="object-contain shrink-0 self-stretch my-auto w-14 rounded-3xl aspect-square"
      />
      <div className="flex flex-col justify-center self-stretch my-auto w-[65px]">
        <div className="overflow-hidden text-base font-medium text-black w-[65px]">
          {name}
        </div>
        {message && (
          <div className="overflow-hidden w-full leading-6">
            {message}
          </div>
        )}
        {isOnline !== undefined && (
          <div className="overflow-hidden text-sm text-gray-400 w-[65px]">
            {isOnline ? 'Online' : 'Offline'}
          </div>
        )}
      </div>
    </div>
  );
}