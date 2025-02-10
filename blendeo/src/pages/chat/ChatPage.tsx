// src/pages/chat/ChatPage.tsx
import { useState, useEffect } from "react";
import { ChatSearchBar } from "@/components/chat/ChatSearchBar";
import { UserItem } from "@/components/chat/UserItem";
import { ChatWindow } from "@/components/chat/ChatWindow";
import CreateRoomModal from "@/components/chat/CreateRoomModal";
import InviteUserModal from "@/components/chat/InviteUserModal";
import Layout from "@/components/layout/Layout";
import { useWebSocket } from "@/hooks/chat/useWebSocket";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { useChatStore } from "@/stores/chatStore";
import type { ChatRoom } from "@/types/api/chat";

const ChatPage = () => {
  const [chatWindowOpened, setChatWindowOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { rooms = [], isLoading, createRoom, fetchRooms } = useChatRooms();
  const {
    currentRoom,
    setCurrentRoom,
    messagesByRoom,
    inviteUser,
    fetchMessages,
  } = useChatStore(); // fetchMessages 추가
  const { sendMessage, isConnected } = useWebSocket();

  // WebSocket 연결 상태 변경 시 현재 채팅방의 메시지 다시 로드
  useEffect(() => {
    if (currentRoom?.id && isConnected) {
      fetchMessages(currentRoom.id);
    }
  }, [currentRoom?.id, isConnected, fetchMessages]);

  const currentMessages = currentRoom
    ? messagesByRoom[currentRoom.id] || []
    : [];

  const filteredRooms =
    rooms?.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleRoomClick = async (room: ChatRoom) => {
    setCurrentRoom(room);
    setChatWindowOpened(true);
    // 채팅방 선택 시 메시지 이력 로드
    if (room.id && isConnected) {
      await fetchMessages(room.id);
    }
  };

  const handleCloseChat = () => {
    setCurrentRoom(null);
    setChatWindowOpened(false);
  };

  const handleCreateRoom = async (roomName: string) => {
    try {
      await createRoom(roomName);
      await fetchRooms(); // rooms 목록을 새로고침
      setCreateModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleInviteUser = async (userId: number) => {
    if (currentRoom) {
      try {
        await inviteUser(currentRoom.id, userId);
      } catch (error) {
        console.error("Failed to invite user:", error);
      }
    }
  };

  return (
    <Layout showNotification>
      <div className={`flex flex-1 ${chatWindowOpened ? "gap-0" : ""}`}>
        <div
          className={`flex flex-col ${
            chatWindowOpened ? "w-[400px] min-w-[400px]" : "w-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                새 채팅방 만들기
              </button>
            </div>
            <ChatSearchBar
              placeholder="채팅방 검색..."
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1b61981f2c48450f2aff765e8726b53074f0dbc21e70d524b2f0fd106c92ae86"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4">로딩 중...</div>
            ) : (
              filteredRooms.map((room) => (
                <UserItem
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  onClick={() => handleRoomClick(room)}
                  isSelected={currentRoom?.id === room.id}
                />
              ))
            )}
          </div>
        </div>

        {chatWindowOpened && currentRoom && (
          <div className="flex-1 border-l border-gray-200">
            <div className="h-full relative">
              <ChatWindow
                user={{
                  id: currentRoom.id,
                  name: currentRoom.name,
                }}
                onClose={handleCloseChat}
                messages={currentMessages}
                onSendMessage={sendMessage}
                isConnected={isConnected}
              />
              <button
                onClick={() => setInviteModalOpen(true)}
                className="absolute top-4 right-20 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                친구 초대
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateRoomModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />

      <InviteUserModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </Layout>
  );
};

export default ChatPage;
