import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface EditRoomNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => void;
  currentName: string;
}

const EditRoomNameModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentName,
}: EditRoomNameModalProps) => {
  const [newName, setNewName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (newName.trim() && newName !== currentName) {
      onSubmit(newName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">채팅방 이름 수정</h2>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새로운 채팅방 이름을 입력하세요"
          className="mb-4"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>저장</Button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomNameModal;
