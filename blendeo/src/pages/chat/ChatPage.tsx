// src/pages/chat/ChatPage.tsx
import { useState, useEffect, ChangeEvent } from "react";
import { ChatSearchBar } from "@/components/chat/ChatSearchBar";
import { UserItem } from "@/components/chat/UserItem";
import { ChatWindow } from "@/components/chat/ChatWindow";
import Layout from "@/components/layout/Layout";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useChatStore } from "@/stores/chatStore";
import { User } from "@/types/components/chat/chat";

const WEBSOCKET_URL = "ws://your-backend-url/ws";

const ChatPage = () => {
  const [chatWindowOpened, setChatWindowOpened] = useState(false);

  const {
    users,
    selectedUser,
    chatMessages,
    searchQuery,
    isConnected,
    currentUserId,
    setUsers,
    setSelectedUser,
    setSearchQuery,
  } = useChatStore();

  const { sendMessage } = useWebSocket(WEBSOCKET_URL);

  // 초기 데이터 로딩
  useEffect(() => {
    // TODO: API로 사용자 목록을 가져오도록 수정
    const fetchUsers = async () => {
      try {
        // const response = await api.get('/users');
        // setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [setUsers]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setChatWindowOpened(true);

    if (isConnected) {
      sendMessage({
        type: "JOIN",
        roomId: user.id,
        sender: currentUserId,
        content: "",
      });
    }
  };

  const handleSendMessage = (content: string) => {
    if (selectedUser && isConnected) {
      sendMessage({
        type: "CHAT",
        roomId: selectedUser.id,
        sender: currentUserId,
        content,
      });
    }
  };

  const handleCloseChat = () => {
    if (selectedUser && isConnected) {
      sendMessage({
        type: "LEAVE",
        roomId: selectedUser.id,
        sender: currentUserId,
        content: "",
      });
    }
    setChatWindowOpened(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showNotification>
      <div className={`flex flex-1 ${chatWindowOpened ? "gap-0" : ""}`}>
        <div
          className={`flex flex-col ${
            chatWindowOpened ? "w-[400px] min-w-[400px]" : "w-full"
          }`}
        >
          <div className="p-4">
            <ChatSearchBar
              placeholder="Search..."
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1b61981f2c48450f2aff765e8726b53074f0dbc21e70d524b2f0fd106c92ae86"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((user) => (
              <UserItem
                key={user.id}
                {...user}
                onClick={() => handleUserClick(user)}
                isSelected={selectedUser?.id === user.id}
              />
            ))}
          </div>
        </div>

        {chatWindowOpened && selectedUser && (
          <div className="flex-1 border-l border-gray-200">
            <ChatWindow
              user={selectedUser}
              onClose={handleCloseChat}
              messages={chatMessages[selectedUser.id] || []}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
