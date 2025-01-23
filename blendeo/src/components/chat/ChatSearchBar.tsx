import * as React from "react";
import { ChatSearchBarProps } from "../../types/types";

export const ChatSearchBar: React.FC<ChatSearchBarProps> = ({ placeholder, iconSrc }) => {
  return (
    <div className="flex flex-col w-full min-h-[48px] min-w-[160px]">
      <div className="flex flex-wrap flex-1 rounded-xl size-full">
        <div className="flex justify-center items-center pl-4 w-10 h-full bg-gray-100 rounded-xl">
          <img
            loading="lazy"
            src={iconSrc}
            alt="Search icon"
            className="object-contain flex-1 shrink self-stretch my-auto w-6 aspect-square basis-0"
          />
        </div>
        <input
          type="search"
          placeholder={placeholder}
          aria-label="Search"
          className="overflow-hidden flex-1 shrink self-stretch py-2 pr-4 pl-2 h-full text-base text-gray-500 whitespace-nowrap bg-gray-100 rounded-none min-w-[240px]"
        />
      </div>
    </div>
  );
}