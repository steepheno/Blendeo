import React, { useState, useCallback, useEffect } from "react";
import { SearchUser } from "@/types/api/chat";
import { useAuthStore } from "@/stores/authStore";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (userIds: number[]) => Promise<void>;
  onSearch: (email: string) => Promise<void>;
  searchResults: SearchUser[];
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onSearch,
  searchResults,
}) => {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimer = React.useRef<NodeJS.Timeout>();

  const currentUserId = useAuthStore((state) => state.userId);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchEmail("");
      setSelectedUsers([]);
      setError(null);
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedUsers.length === 0) {
      setError("채팅 상대를 선택해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const userIds = selectedUsers.map((user) => user.userId);
      await onCreateRoom(userIds);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create room:", err);
      setError("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchEmail(value);
      setError(null);

      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }

      if (value.length >= 2) {
        searchTimer.current = setTimeout(async () => {
          try {
            await onSearch(value);
          } catch (err: unknown) {
            console.error("Search failed:", err);
            setError("사용자 검색에 실패했습니다.");
          }
        }, 300);
      }
    },
    [onSearch]
  );

  const handleSelectUser = useCallback(
    (user: SearchUser) => {
      if (user.userId === currentUserId) {
        setError("자기 자신은 선택할 수 없습니다.");
        return;
      }

      if (selectedUsers.some((u) => u.userId === user.userId)) {
        setError("이미 선택된 사용자입니다.");
        return;
      }

      setSelectedUsers((prev) => [...prev, user]);
      setSearchEmail("");
      setError(null);
    },
    [currentUserId, selectedUsers]
  );

  const handleRemoveUser = useCallback((userId: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.userId !== userId));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">새로운 채팅방 만들기</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={searchEmail}
              onChange={handleSearch}
              placeholder="초대할 친구의 이메일을 입력하세요"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              autoComplete="off"
            />
            {searchEmail && (
              <button
                type="button"
                onClick={() => setSearchEmail("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.userId}
                  className="bg-blue-100 px-2 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {user.profileImage && (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-profile.png";
                      }}
                    />
                  )}
                  <span className="max-w-[150px] truncate">{user.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.userId)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="제거"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchEmail && searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border rounded divide-y">
              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleSelectUser(user)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-profile.png";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 truncate">{user.email}</span>
                </div>
              ))}
            </div>
          )}

          {searchEmail && searchResults.length === 0 && (
            <div className="text-center text-gray-500 py-2">
              검색 결과가 없습니다.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              disabled={selectedUsers.length === 0 || isLoading}
            >
              {isLoading ? "생성 중..." : "만들기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
