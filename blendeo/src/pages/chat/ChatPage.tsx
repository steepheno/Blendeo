import { useEffect, useState } from "react";
import Layout from "@/components/layout/ChatLayout";
import ChatApp from "@/components/chat/ChatRoomModal";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { useLocation } from "react-router-dom";
import { useChatStore } from "@/stores/chatStore";

const ChatPage = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const userId = useAuthStore((state) => state.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { fetchRooms } = useChatRooms();
  const [chatWindowOpened, setChatWindowOpened] = useState(false);
  const location = useLocation();

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

    void initializeUser();
  }, [isAuthenticated, userId, currentUser]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchRooms();
    }
  }, [isAuthenticated, fetchRooms]);

  useEffect(() => {
    if (location.state?.openChat && location.state?.roomId) {
      const initializeChat = async () => {
        try {
          await fetchRooms();
          const rooms = useChatStore.getState().rooms;
          const targetRoom = rooms.find(
            (room) => room.id === location.state.roomId
          );
          if (targetRoom) {
            await useChatStore.getState().setCurrentRoom(targetRoom);
            setChatWindowOpened(true);
          }
        } catch (error) {
          console.error("채팅방 초기화 중 오류 발생:", error);
        }
      };

      void initializeChat();
    }
  }, [location.state, fetchRooms]);

  if (isAuthenticated && !currentUser) {
    return <div>로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <Layout showNotification>
      <ChatApp
        chatWindowOpened={chatWindowOpened}
        setChatWindowOpened={setChatWindowOpened}
      />
    </Layout>
  );
};

export default ChatPage;
