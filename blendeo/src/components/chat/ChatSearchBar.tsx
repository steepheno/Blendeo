// src/components/chat/ChatSearchBar.tsx
import * as React from "react";
import { useState, useCallback } from "react";
import { ChatSearchBarProps } from "@/types/components/chat/chat";

export const ChatSearchBar: React.FC<ChatSearchBarProps> = ({
  placeholder,
  iconSrc,
  value,
  onChange,
  onSearch, // API 검색 호출을 위한 콜백
}) => {
  const [isSearching, setIsSearching] = useState(false);

  // 디바운스 처리를 위한 타이머 ref
  const debounceTimer = React.useRef<NodeJS.Timeout>();

  // 검색 핸들러
  const handleSearch = useCallback(
    (searchValue: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (searchValue.trim() && onSearch) {
        setIsSearching(true);
        debounceTimer.current = setTimeout(async () => {
          try {
            await onSearch(searchValue);
          } catch (error) {
            console.error("Search failed:", error);
          } finally {
            setIsSearching(false);
          }
        }, 300); // 300ms 디바운스
      }
    },
    [onSearch]
  );

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
      handleSearch(e.target.value);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[48px] min-w-[160px]">
      <div className="flex items-center w-full h-12 bg-gray-100 rounded-xl relative">
        {/* 검색 아이콘 */}
        <div className="flex justify-center items-center pl-4 w-10">
          {isSearching ? (
            // 검색 중일 때 로딩 스피너 표시
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          ) : (
            <img
              loading="lazy"
              src={iconSrc}
              alt="Search icon"
              className="w-5 h-5 object-contain"
            />
          )}
        </div>

        {/* 검색 입력 필드 */}
        <input
          type="search"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Search"
          className="flex-1 h-full py-2 pr-4 pl-2 text-base text-gray-500 bg-transparent outline-none min-w-0"
          // 입력 중 스타일
          disabled={isSearching}
        />

        {/* 입력값이 있을 때만 초기화 버튼 표시 */}
        {value && (
          <button
            onClick={() => {
              if (onChange) {
                onChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            className="absolute right-4 p-1 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatSearchBar;
