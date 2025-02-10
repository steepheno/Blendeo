// src/components/chat/CreateRoomModal.tsx
import { useState } from "react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string) => void;
}

const CreateRoomModal = ({
  isOpen,
  onClose,
  onCreateRoom,
}: CreateRoomModalProps) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onCreateRoom(roomName.trim());
      setRoomName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">새로운 채팅방 만들기</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="채팅방 이름을 입력하세요"
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
              disabled={!roomName.trim()}
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
