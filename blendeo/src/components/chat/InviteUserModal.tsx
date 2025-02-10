// src/components/chat/InviteUserModal.tsx
import { useState } from "react";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (userId: number) => void;
}

const InviteUserModal = ({
  isOpen,
  onClose,
  onInvite,
}: InviteUserModalProps) => {
  const [userId, setUserId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userIdNumber = parseInt(userId);
    if (!isNaN(userIdNumber)) {
      onInvite(userIdNumber);
      setUserId("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">친구 초대하기</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="친구 ID를 입력하세요"
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={!userId}
            >
              초대하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
