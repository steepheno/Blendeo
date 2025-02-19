import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useOpenVidu } from "@/hooks/useOpenVidu";
import Layout from "@/components/layout/ChatLayout";
import VideoComponent from "@/components/video/VideoComponent";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, MessageSquare } from "lucide-react";
import { useVideoCallStore } from "@/stores/videoCallStore";

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
      <main className="flex-1 p-4">
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
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </Layout>
  );
};

export default VideoChatPage;
