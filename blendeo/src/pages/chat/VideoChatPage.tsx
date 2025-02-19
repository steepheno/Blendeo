import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useOpenVidu } from "@/hooks/useOpenVidu";
import Layout from "@/components/layout/ChatLayout";
import VideoComponent from "@/components/video/VideoComponent";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
} from "lucide-react";
import { useVideoCallStore } from "@/stores/videoCallStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/chat/useWebSocket";
import useChatStore from "@/stores/chatStore";
import { cn } from "@/lib/utils";

const VideoChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;

  const {
    session,
    error,
    isLoading,
    publisher,
    initializeSession,
    cleanupSession,
    toggleAudio,
    toggleVideo,
  } = useOpenVidu(roomId!);

  const { subscribers } = useVideoCallStore();
  console.log("subscribers type:", typeof subscribers);
  console.log("subscribers value:", subscribers);

  // 자신의 스트림을 제외한 subscribers만 필터링
  const subscriberNotMe = Array.isArray(subscribers)
    ? subscribers.filter((subscriber) => {
        if (!publisher) return true;
        if (!subscriber?.stream?.connection) return false;
        return (
          subscriber.stream.connection.connectionId !==
          publisher.stream.connection.connectionId
        );
      })
    : [];

  // 채팅 관련 상태 추가
  const [inputMessage, setInputMessage] = useState("");
  const { sendMessage } = useWebSocket();
  const { currentRoom, messagesByRoom } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 채팅 스크롤 관련 함수 및 효과 추가
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (session) {
      // 세션이 연결되면 스크롤 실행
      scrollToBottom();
    }
  }, [session, messagesByRoom]);

  // 메시지 전송 핸들러 추가
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentRoom) return;
    const now = new Date();
    sendMessage(inputMessage, now.toISOString());
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 세션 초기화
  useEffect(() => {
    cleanupSession();

    if (!userId || !roomId) {
      navigate("/chat");
      return;
    }

    const connectSession = async () => {
      try {
        console.log("connectSession 실행");
        await initializeSession();
      } catch (error) {
        console.error("initializeSession 실패:", error);
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
          setTimeout(connectSession, 2000);
        } else {
          alert("화상통화 연결에 실패했습니다.");
          navigate(`/chat`);
        }
      }
    };

    connectSession();

    // 새로고침이나 페이지를 나갈 때 세션 정리
    const handleBeforeUnload = () => {
      cleanupSession();
    };

    // 뒤로가기 처리
    const handlePopState = () => {
      cleanupSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      cleanupSession();
    };
  }, []);

  const handleLeaveCall = () => {
    cleanupSession();
    navigate(`/chat`);
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toggleAudio();
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toggleVideo();
  };

  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (session && showChat) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [session, messagesByRoom, showChat]);

  if (isLoading || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-600">연결 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Layout showRightSidebar>
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <div className="text-red-500 text-xl">연결 실패: {error.message}</div>
          <Button onClick={() => navigate(`/chat`)} variant="default">
            채팅방으로 돌아가기
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showRightSidebar>
      <main className="flex-1 flex justify-between">
        {/* 비디오 및 채팅 컨테이너 */}
        <div className={cn("flex-1 p-4", showChat ? "pr-80" : "")}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">화상 통화</h2>
            <div className="flex items-center gap-4">
              <span>{subscribers.length + 1}명 참여 중</span>
              <Button variant="destructive" onClick={handleLeaveCall}>
                나가기
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {publisher && (
              <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
                <VideoComponent
                  streamManager={publisher}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-medium">나</span>
                </div>
              </div>
            )}

            {subscriberNotMe.map((subscriber, index) => (
              <div
                key={subscriber.id}
                className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden"
              >
                <VideoComponent
                  streamManager={subscriber}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="text-white font-medium">
                    참여자 {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 영역 - 조건부 렌더링 */}
        {showChat && (
          <div className="w-80 bg-white shadow-lg flex flex-col h-[calc(100vh-64px)] border-l fixed right-0 top-16">
            <div className="p-4 border-b">
              <h3 className="font-semibold">채팅</h3>
            </div>

            <ScrollArea className="flex-1 h-[calc(100%-8rem)]">
              <div className="p-4 space-y-4">
                {currentRoom &&
                  [...(messagesByRoom[currentRoom.id] || [])]
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                    .map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-2",
                          message.userId === userId
                            ? "flex-row-reverse"
                            : "flex-row"
                        )}
                      >
                        <div className="flex flex-col gap-1 max-w-[70%]">
                          <span className="text-sm font-medium">
                            {message.userId === userId
                              ? "나"
                              : message.nickname}
                          </span>
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm",
                              message.userId === userId
                                ? "bg-customPurple text-white"
                                : "bg-gray-100"
                            )}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="메시지를 입력하세요"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 컨트롤 버튼 */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white p-2 rounded-full shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleToggleAudio}
        >
          {isAudioEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleToggleVideo}
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full", showChat && "text-customPurple")}
          onClick={() => setShowChat(!showChat)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </Layout>
  );
};

export default VideoChatPage;
