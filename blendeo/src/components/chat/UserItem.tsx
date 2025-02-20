// src/components/chat/UserItem.tsx
import { memo } from "react";
import type { SearchUser, ChatRoom } from "@/types/api/chat";

interface UserItemProps {
  // 채팅방이나 사용자 데이터를 모두 받을 수 있도록
  item: SearchUser | ChatRoom;
  onClick: () => void;
  isSelected: boolean;
  type: "user" | "room"; // 어떤 타입의 아이템인지 구분
}

// 타입 가드 함수들
const isSearchUser = (item: SearchUser | ChatRoom): item is SearchUser => {
  return "email" in item;
};

const isRoom = (item: SearchUser | ChatRoom): item is ChatRoom => {
  return "createdAt" in item;
};

// 성능 최적화를 위해 memo 사용
export const UserItem = memo<UserItemProps>(
  ({ item, onClick, isSelected, type }) => {
    // 표시할 이름과 이미지 URL 결정
    const displayName = isSearchUser(item) ? item.email : item.name;
    const imageUrl = isSearchUser(item) ? item.profileImage : null;

    return (
      <div
        onClick={onClick}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        className={`
        p-4 cursor-pointer transition-colors duration-200
        ${isSelected ? "bg-blue-50" : "hover:bg-gray-100"}
        ${type === "room" ? "border-b border-gray-100" : ""}
      `}
        aria-selected={isSelected}
      >
        <div className="flex items-center gap-4">
          {/* 프로필 이미지/이니셜 */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-profile.png";
                e.currentTarget.className =
                  "w-12 h-12 rounded-full bg-gray-200";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* 정보 영역 */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* 이름/이메일 */}
            <span className="font-medium text-gray-900 truncate">
              {displayName}
            </span>

            {/* 채팅방인 경우 추가 정보 */}
            {isRoom(item) && (
              <span className="text-sm text-gray-500">
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* 선택 상태 표시 (검색 결과에서만) */}
          {type === "user" && isSelected && (
            <div className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// 컴포넌트 이름 설정 (디버깅용)
UserItem.displayName = "UserItem";

export default UserItem;
