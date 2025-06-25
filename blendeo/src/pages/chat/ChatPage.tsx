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
      {!chatWindowOpened && (
        <div className="absolute left-1/2 top-1/2 -translate-x-[55%] -translate-y-[60%] flex flex-col items-center justify-center space-y-6 max-w-[calc(100vw-640px)] md:max-w-[calc(100vw-768px)]">
          <div className="w-64 h-64 bg-center bg-no-repeat bg-contain bg-[url('/images/login_img.png')]" />
          <h1 className="text-2xl font-bold text-gray-800">
            채팅을 시작해보세요!
          </h1>
          <p className="text-gray-600 text-center max-w-md">
            우측의 채팅 목록에서 대화할 상대를 선택하거나,
            <br />
            새로운 대화를 시작할 수 있습니다.
          </p>
        </div>
      )}
      <ChatApp
        chatWindowOpened={chatWindowOpened}
        setChatWindowOpened={setChatWindowOpened}
      />
    </Layout>
  );
};

export default ChatPage;
