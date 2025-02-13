// src/pages/chat/VideoCallPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useOpenVidu } from "@/hooks/useOpenVidu";
import Layout from "@/components/layout/Layout";
import VideoComponent from "@/components/video/VideoComponent";

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const currentRoom = useChatStore((state) => state.currentRoom);

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
  } = useOpenVidu();

  useEffect(() => {
    if (!userId || !roomId) {
      navigate("/chat");
      return;
    }

    // 바로 세션 초기화
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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Video Call - {currentRoom?.name || `Room ${roomId}`}
            </h1>
            <div className="space-x-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                onClick={handleLeaveCall}
              >
                Leave Call
              </button>
            </div>
          </div>

          {/* Session Info (Debug/Development purpose) */}
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h2 className="font-semibold mb-2">Session Information</h2>
            <div className="text-sm">
              <p>Session ID: {session.sessionId}</p>
              <p>Token: {session.token}</p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Video Container */}
            <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {publisher && <VideoComponent streamManager={publisher} />}
            </div>

            {/* Participants Grid */}
            <div className="grid grid-cols-2 gap-2">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="aspect-video bg-gray-900 rounded-lg overflow-hidden"
                >
                  <VideoComponent streamManager={subscriber} />
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 rounded-full px-6 py-3 flex gap-4">
              <button
                className="p-3 rounded-full hover:bg-gray-700 text-white"
                title="Toggle Microphone"
                onClick={toggleAudio}
              >
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
              </button>
              <button
                className="p-3 rounded-full hover:bg-gray-700 text-white"
                title="Toggle Camera"
                onClick={toggleVideo}
              >
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
