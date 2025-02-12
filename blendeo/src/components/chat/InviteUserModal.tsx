import { useState, useEffect } from "react";
import type { SearchUserResponse } from "@/types/api/chat";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
  onSearch: (email: string) => Promise<void>;
  searchResults?: SearchUserResponse[];
}

const InviteUserModal = ({
  isOpen,
  onClose,
  onInvite,
  onSearch,
  searchResults = [],
}: InviteUserModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setError(null);
      await onInvite(email);
      setEmail("");
      onClose();
    } catch {
      setError("초대에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setEmail(searchValue);
    setError(null);

    if (searchValue.length >= 2) {
      try {
        await onSearch(searchValue);
      } catch {
        setError("사용자 검색에 실패했습니다.");
      }
    }
  };

  const handleSelectUser = (selectedEmail: string) => {
    setEmail(selectedEmail);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[480px]">
        <h2 className="text-xl font-semibold mb-4">친구 초대하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={handleSearch}
              placeholder="이메일을 입력하세요"
              className="w-full p-2 border rounded"
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto mb-4 border rounded">
              {searchResults.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleSelectUser(user.email)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.email}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1">{user.email}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={!email || isLoading}
            >
              {isLoading ? "초대 중..." : "초대하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
