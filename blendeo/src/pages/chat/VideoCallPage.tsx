// src/pages/chat/VideoCallPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useOpenVidu } from "@/hooks/useOpenVidu";
import Layout from "@/components/layout/Layout";
import VideoComponent from "@/components/video/VideoComponent";

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useAuthStore((state) => state.userId);
  const roomName = location.state?.roomName || `Room ${roomId}`;

  // 오디오 상태 추적
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const {
    session,
    error,
    isLoading,
    publisher,
    subscribers,
    initializeSession,
    cleanupSession,
    toggleAudio,
    toggleVideo,
  } = useOpenVidu(roomId!);

  useEffect(() => {
    if (!userId || !roomId) {
      navigate("/chat");
      return;
    }

    initializeSession().catch((error) => {
      console.error("Failed to initialize video call:", error);
      alert("화상통화 연결에 실패했습니다.");
      navigate(`/chat/${roomId}`);
    });

    return () => {
      cleanupSession();
    };
  }, [userId, roomId, navigate, initializeSession, cleanupSession]);

  const handleLeaveCall = () => {
    cleanupSession();
    navigate(`/chat/${roomId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Connecting to video call...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen flex-col gap-4">
          <div className="text-red-500 text-xl">
            Failed to connect: {error.message}
          </div>
          <button
            onClick={() => navigate(`/chat/${roomId}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Chat
          </button>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Initializing video call...</div>
        </div>
      </Layout>
    );
  }

  const totalParticipants = 1 + subscribers.length;

  // 그리드 레이아웃 클래스 계산
  const getGridLayout = () => {
    switch (totalParticipants) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      case 5:
        return "grid-cols-3";
      case 6:
        return "grid-cols-3";
      default:
        return "grid-cols-3";
    }
  };

  // 비디오 컴포넌트의 크기 클래스 계산
  const getVideoSize = (isPublisher: boolean) => {
    switch (totalParticipants) {
      case 1:
        return "col-span-1 row-span-1";
      case 2:
        return "col-span-1 row-span-1";
      case 3:
        return isPublisher ? "col-span-2 row-span-1" : "col-span-1 row-span-1";
      case 4:
        return "col-span-1 row-span-1";
      case 5:
        return isPublisher ? "col-span-2 row-span-1" : "col-span-1 row-span-1";
      case 6:
        return "col-span-1 row-span-1";
      default:
        return "col-span-1 row-span-1";
    }
  };

  // 오디오 토글 핸들러
  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toggleAudio();
  };

  // 비디오 토글 핸들러
  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toggleVideo();
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col h-[calc(100vh-32px)]">
          {" "}
          {/* 전체 높이 조정 */}
          {/* 헤더 부분 */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Video Call - {roomName}</h1>
            <div className="space-x-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                onClick={handleLeaveCall}
              >
                Leave Call
              </button>
            </div>
          </div>
          {/* 동적 그리드 레이아웃 */}
          <div
            className={`grid ${getGridLayout()} gap-4 flex-1`} // flex-1로 변경
          >
            {/* Publisher (자신의 비디오) */}
            {publisher && (
              <div
                className={`${getVideoSize(true)} bg-gray-900 rounded-lg overflow-hidden`}
              >
                <VideoComponent
                  streamManager={publisher}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Subscribers (다른 참가자들의 비디오) */}
            {subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className={`${getVideoSize(false)} bg-gray-900 rounded-lg overflow-hidden`}
              >
                <VideoComponent
                  streamManager={subscriber}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
          {/* Controls */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 rounded-full px-6 py-3 flex gap-4">
              <button
                className={`p-3 rounded-full hover:bg-gray-700 text-white
                  ${!isAudioEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
                title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                onClick={handleToggleAudio}
              >
                {isAudioEnabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                )}
              </button>
              <button
                className={`p-3 rounded-full hover:bg-gray-700 text-white
                  ${!isVideoEnabled ? "bg-red-500 hover:bg-red-600" : ""}`}
                title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
                onClick={handleToggleVideo}
              >
                {isVideoEnabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                    <line
                      x1="3"
                      y1="3"
                      x2="21"
                      y2="21"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
