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
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
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
    inviteUserByEmail, // userId 대신 email로 초대하는 함수로 변경
    searchUserByEmail, // 이메일 검색 함수 추가
    searchResults, // 검색 결과 추가
    clearSearchResults, // 검색 결과 초기화 함수 추가
    fetchMessages,
  } = useChatStore();
  const { sendMessage, isConnected } = useWebSocket();

  const currentUser = useUserStore((state) => state.currentUser);
  const userId = useAuthStore((state) => state.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 인증 상태 확인 (변경 없음)
  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated && userId && !currentUser) {
        try {
          await useUserStore.getState().getUser(userId);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    initializeUser();
  }, [isAuthenticated, userId, currentUser]);

  useEffect(() => {
    if (currentRoom?.id && isConnected && isAuthenticated) {
      fetchMessages(currentRoom.id);
    }
  }, [currentRoom?.id, isConnected, fetchMessages, isAuthenticated]);

  // 모달이 닫힐 때 검색 결과 초기화
  useEffect(() => {
    if (!inviteModalOpen) {
      clearSearchResults();
    }
  }, [inviteModalOpen, clearSearchResults]);

  const currentMessages = currentRoom
    ? messagesByRoom[currentRoom.id] || []
    : [];

  const filteredRooms =
    rooms?.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleRoomClick = async (room: ChatRoom) => {
    if (!isAuthenticated) return;

    setCurrentRoom(room);
    setChatWindowOpened(true);
    if (room.id && isConnected) {
      await fetchMessages(room.id);
    }
  };

  const handleCloseChat = () => {
    setCurrentRoom(null);
    setChatWindowOpened(false);
  };

  const handleCreateRoom = async (roomName: string) => {
    if (!isAuthenticated) return;

    try {
      await createRoom(roomName);
      await fetchRooms();
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  // 이메일로 사용자 초대하는 함수로 변경
  const handleInviteUser = async (email: string) => {
    if (!isAuthenticated || !currentRoom) return;

    try {
      await inviteUserByEmail(currentRoom.id, email);
      setInviteModalOpen(false); // 성공 시 모달 닫기
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  };

  // 이메일로 사용자 검색하는 함수 추가
  const handleSearchUser = async (email: string) => {
    if (!isAuthenticated) return;

    try {
      await searchUserByEmail(email);
    } catch (error) {
      console.error("Failed to search user:", error);
    }
  };

  if (isAuthenticated && !currentUser) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Layout showNotification>
      <div className={`flex flex-1 ${chatWindowOpened ? "gap-0" : ""}`}>
        {/* 채팅방 목록 (변경 없음) */}
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

        {/* 채팅 창 (변경 없음) */}
        {chatWindowOpened && currentRoom && (
          <div className="flex-1 border-l border-gray-200">
            <div className="h-full relative">
              <ChatWindow
                room={currentRoom}
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
        onSearch={handleSearchUser}
        searchResults={searchResults}
      />
    </Layout>
  );
};

export default ChatPage;
